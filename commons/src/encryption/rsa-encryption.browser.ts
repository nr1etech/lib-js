/**
 * Browser-compatible RSA encryption using Web Crypto API
 * This module provides RSA encryption functionality that works in browsers
 */

export type KeyFormat = 'pem' | 'base64';

export interface EncryptionOptions {
  encoding?: BufferEncoding;
}

/**
 * Convert a PEM formatted public key to a format usable by Web Crypto API
 * @param pem - PEM formatted public key string
 * @returns ArrayBuffer containing the key data
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Remove PEM headers/footers and whitespace
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';

  let pemContents = pem;
  pemContents = pemContents.replace(pemHeader, '');
  pemContents = pemContents.replace(pemFooter, '');
  pemContents = pemContents.replace(/\s/g, '');

  // Convert base64 to binary
  const binaryString = atob(pemContents);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

/**
 * Import a public key for use with Web Crypto API
 * @param publicKey - RSA public key in PEM or base64 format
 * @returns CryptoKey object for use with Web Crypto API
 */
async function importPublicKey(publicKey: string): Promise<CryptoKey> {
  let keyData: ArrayBuffer;

  // Check if it's PEM format or base64
  if (publicKey.includes('-----BEGIN')) {
    keyData = pemToArrayBuffer(publicKey);
  } else {
    // Assume it's base64 encoded PEM
    const pemKey = atob(publicKey);
    keyData = pemToArrayBuffer(pemKey);
  }

  // Import the key using Web Crypto API
  return await crypto.subtle.importKey(
    'spki', // SubjectPublicKeyInfo format
    keyData,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false, // not extractable
    ['encrypt'], // usage
  );
}

/**
 * Encrypt data using an RSA public key in the browser
 * @param data - Data to encrypt (string or object)
 * @param publicKey - RSA public key in PEM or base64 format
 * @param options - Encryption options
 * @returns Promise resolving to encrypted data as base64 string
 */
export async function encryptWithPublicKey(
  data: string | object,
  publicKey: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options?: EncryptionOptions,
): Promise<string> {
  // Note: options parameter is kept for API compatibility but not used in browser version
  // Browser always returns base64 encoded encrypted data
  // Convert data to string if it's an object
  const dataString = typeof data === 'object' ? JSON.stringify(data) : data;

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(dataString);

  try {
    // Import the public key
    const cryptoKey = await importPublicKey(publicKey);

    // Encrypt the data
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      cryptoKey,
      dataBuffer,
    );

    // Convert encrypted data to base64
    const encryptedArray = new Uint8Array(encryptedBuffer);
    let binaryString = '';

    for (let i = 0; i < encryptedArray.length; i++) {
      binaryString += String.fromCharCode(encryptedArray[i]);
    }

    return btoa(binaryString);
  } catch (error) {
    throw new Error(
      `Failed to encrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {cause: error},
    );
  }
}

/**
 * Validate if a string is a valid RSA public key (browser version)
 * @param key - Key string to validate
 * @returns Promise resolving to true if valid public key
 */
export async function isValidPublicKey(key: string): Promise<boolean> {
  try {
    // Check if it contains private key markers
    if (key.includes('PRIVATE KEY')) {
      return false;
    }

    // Try to import the key
    await importPublicKey(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper function to convert base64 string to PEM format
 * @param base64Key - Base64 encoded key
 * @param type - Type of key (PUBLIC or PRIVATE)
 * @returns PEM formatted key
 */
export function base64ToPem(
  base64Key: string,
  type: 'PUBLIC' | 'PRIVATE' = 'PUBLIC',
): string {
  const pemHeader = `-----BEGIN ${type} KEY-----`;
  const pemFooter = `-----END ${type} KEY-----`;

  // Decode base64 to check if it's already PEM
  try {
    const decoded = atob(base64Key);
    if (decoded.includes('-----BEGIN')) {
      return decoded;
    }
  } catch {
    // If decoding fails, assume it's already PEM
    if (base64Key.includes('-----BEGIN')) {
      return base64Key;
    }
  }

  // Format as PEM with line breaks every 64 characters
  const formatted = base64Key.match(/.{1,64}/g)?.join('\n') || base64Key;

  return `${pemHeader}\n${formatted}\n${pemFooter}`;
}

/**
 * Check if the browser supports Web Crypto API
 * @returns true if Web Crypto API is available
 */
export function isWebCryptoSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.crypto !== undefined &&
    window.crypto.subtle !== undefined
  );
}
