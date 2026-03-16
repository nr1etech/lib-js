import {
  generateKeyPairSync as cryptoGenerateKeyPairSync,
  generateKeyPair as cryptoGenerateKeyPair,
  publicEncrypt,
  privateDecrypt,
  constants,
  KeyObject,
  createPublicKey,
  createPrivateKey,
} from 'crypto';
import {promisify} from 'util';

const generateKeyPairAsync = promisify(cryptoGenerateKeyPair);

export type KeySize = 2048 | 3072 | 4096;
export type KeyFormat = 'pem' | 'base64';

export interface RSAKeyPair {
  publicKey: string;
  privateKey: string;
}

export interface RSAKeyPairObjects {
  publicKey: KeyObject;
  privateKey: KeyObject;
}

export interface GenerateKeyPairOptions {
  keySize?: KeySize;
  format?: KeyFormat;
}

export interface EncryptionOptions {
  encoding?: BufferEncoding;
}

/**
 * Convert raw base64 key (without PEM headers) to PEM format
 * @param base64Key - Raw base64 encoded key (no headers)
 * @param type - Type of key (PUBLIC or PRIVATE)
 * @returns PEM formatted key
 */
function rawBase64ToPem(
  base64Key: string,
  type: 'PUBLIC' | 'PRIVATE' = 'PUBLIC',
): string {
  const pemHeader = `-----BEGIN ${type} KEY-----`;
  const pemFooter = `-----END ${type} KEY-----`;

  // Format as PEM with line breaks every 64 characters
  const formatted = base64Key.match(/.{1,64}/g)?.join('\n') || base64Key;

  return `${pemHeader}\n${formatted}\n${pemFooter}`;
}

/**
 * Normalize a key to PEM format
 * Handles three formats:
 * 1. Already in PEM format (with -----BEGIN headers)
 * 2. Base64 encoded PEM (decode first, then use as PEM)
 * 3. Raw base64 key material (needs PEM headers added)
 * @param key - Key in any supported format
 * @param type - Type of key (PUBLIC or PRIVATE)
 * @returns PEM formatted key
 */
function normalizeKeyToPem(key: string, type: 'PUBLIC' | 'PRIVATE'): string {
  // Already in PEM format
  if (key.includes('-----BEGIN')) {
    return key;
  }

  // Try to decode as base64 to see if it contains PEM
  try {
    const decoded = Buffer.from(key, 'base64').toString('utf8');
    if (decoded.includes('-----BEGIN')) {
      // It was base64 encoded PEM
      return decoded;
    }
  } catch {
    // Not valid base64 or not PEM inside, continue
  }

  // Raw base64 key material - add PEM headers
  return rawBase64ToPem(key, type);
}

/**
 * Generate an RSA key pair synchronously
 * @param options - Options for key generation
 * @returns RSA key pair in the specified format
 */
export function generateKeyPairSync(
  options: GenerateKeyPairOptions = {},
): RSAKeyPair {
  const {keySize = 2048, format = 'pem'} = options;

  const {publicKey, privateKey} = cryptoGenerateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  if (format === 'base64') {
    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      privateKey: Buffer.from(privateKey).toString('base64'),
    };
  }

  return {publicKey, privateKey};
}

/**
 * Generate an RSA key pair asynchronously
 * @param options - Options for key generation
 * @returns Promise resolving to RSA key pair in the specified format
 */
export async function generateKeyPair(
  options: GenerateKeyPairOptions = {},
): Promise<RSAKeyPair> {
  const {keySize = 2048, format = 'pem'} = options;

  const {publicKey, privateKey} = await generateKeyPairAsync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  if (format === 'base64') {
    return {
      publicKey: Buffer.from(publicKey).toString('base64'),
      privateKey: Buffer.from(privateKey).toString('base64'),
    };
  }

  return {publicKey, privateKey};
}

/**
 * Encrypt data using an RSA public key
 * Supports three key formats:
 * 1. PEM format (with -----BEGIN PUBLIC KEY-----)
 * 2. Base64 encoded PEM
 * 3. Raw base64 key material (without PEM headers)
 * @param data - Data to encrypt (string or object)
 * @param publicKey - RSA public key in any supported format
 * @param options - Encryption options
 * @returns Encrypted data as base64 string
 */
export function encryptWithPublicKey(
  data: string | object,
  publicKey: string,
  options: EncryptionOptions = {},
): string {
  const {encoding = 'base64'} = options;

  // Convert data to string if it's an object
  const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
  const dataBuffer = Buffer.from(dataString, 'utf8');

  // Normalize key to PEM format
  const keyToUse = normalizeKeyToPem(publicKey, 'PUBLIC');

  // Encrypt using OAEP padding with SHA-256
  const encrypted = publicEncrypt(
    {
      key: keyToUse,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    dataBuffer,
  );

  return encrypted.toString(encoding as BufferEncoding);
}

/**
 * Decrypt data using an RSA private key
 * Supports three key formats:
 * 1. PEM format (with -----BEGIN PRIVATE KEY-----)
 * 2. Base64 encoded PEM
 * 3. Raw base64 key material (without PEM headers)
 * @param encryptedData - Encrypted data as base64 string
 * @param privateKey - RSA private key in any supported format
 * @param options - Decryption options
 * @returns Decrypted data as string or parsed object
 */
export function decryptWithPrivateKey(
  encryptedData: string,
  privateKey: string,
  options: EncryptionOptions = {},
): string | object {
  const {encoding = 'base64'} = options;

  // Convert encrypted data from base64 to buffer
  const encryptedBuffer = Buffer.from(
    encryptedData,
    encoding as BufferEncoding,
  );

  // Normalize key to PEM format
  const keyToUse = normalizeKeyToPem(privateKey, 'PRIVATE');

  // Decrypt using OAEP padding with SHA-256
  const decrypted = privateDecrypt(
    {
      key: keyToUse,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedBuffer,
  );

  const decryptedString = decrypted.toString('utf8');

  // Try to parse as JSON, return string if it fails
  try {
    return JSON.parse(decryptedString);
  } catch {
    return decryptedString;
  }
}

/**
 * Export RSA keys to different formats
 * @param keyPair - RSA key pair
 * @param format - Target format
 * @returns Key pair in the specified format
 */
export function exportKeys(keyPair: RSAKeyPair, format: KeyFormat): RSAKeyPair {
  if (format === 'base64') {
    // Convert PEM to base64 if needed
    if (keyPair.publicKey.includes('-----BEGIN')) {
      return {
        publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
        privateKey: Buffer.from(keyPair.privateKey).toString('base64'),
      };
    }
    return keyPair;
  } else {
    // Convert to PEM if needed
    return {
      publicKey: normalizeKeyToPem(keyPair.publicKey, 'PUBLIC'),
      privateKey: normalizeKeyToPem(keyPair.privateKey, 'PRIVATE'),
    };
  }
}

/**
 * Import RSA keys from strings to KeyObject instances
 * @param publicKey - Public key string (PEM, base64 encoded PEM, or raw base64)
 * @param privateKey - Private key string (PEM, base64 encoded PEM, or raw base64)
 * @returns KeyObject instances for the keys
 */
export function importKeys(
  publicKey: string,
  privateKey: string,
): RSAKeyPairObjects {
  const pubKeyPem = normalizeKeyToPem(publicKey, 'PUBLIC');
  const privKeyPem = normalizeKeyToPem(privateKey, 'PRIVATE');

  return {
    publicKey: createPublicKey(pubKeyPem),
    privateKey: createPrivateKey(privKeyPem),
  };
}

/**
 * Validate if a string is a valid RSA public key
 * @param key - Key string to validate
 * @returns True if valid public key
 */
export function isValidPublicKey(key: string): boolean {
  try {
    const keyPem = normalizeKeyToPem(key, 'PUBLIC');
    // Check if it's actually a private key
    if (keyPem.includes('PRIVATE KEY')) {
      return false;
    }
    createPublicKey(keyPem);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate if a string is a valid RSA private key
 * @param key - Key string to validate
 * @returns True if valid private key
 */
export function isValidPrivateKey(key: string): boolean {
  try {
    const keyPem = normalizeKeyToPem(key, 'PRIVATE');
    createPrivateKey(keyPem);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the key size of an RSA key
 * @param key - RSA key (public or private) in any supported format
 * @returns Key size in bits
 */
export function getKeySize(key: string): number {
  let keyPem: string;

  // Determine if it's a public or private key
  if (
    key.includes('PRIVATE') ||
    (!key.includes('BEGIN') && key.length > 1000)
  ) {
    keyPem = normalizeKeyToPem(key, 'PRIVATE');
  } else {
    keyPem = normalizeKeyToPem(key, 'PUBLIC');
  }

  let keyObject: KeyObject;
  if (keyPem.includes('PUBLIC KEY')) {
    keyObject = createPublicKey(keyPem);
  } else {
    keyObject = createPrivateKey(keyPem);
  }

  const keyDetails = keyObject.asymmetricKeyDetails;
  return keyDetails?.modulusLength || 0;
}
