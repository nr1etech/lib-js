import {nanoid, customAlphabet} from 'nanoid';
import {createHash, timingSafeEqual} from 'crypto';

const PREFIX_REGEX = /^[a-z]+$/;
const ALPHABET =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * A generated API key.
 */
export interface GeneratedApiKey {
  /**
   * The raw key to give to the user. Do not store.
   */
  readonly rawKey: string;
  /**
   * The ID of the key. This should be used for lookup.
   */
  readonly keyId: string;
  /**
   * The SHA256 hash of the secret. This should be stored with the keyId.
   */
  readonly secretHash: string;
}

/**
 * Generates a new API key with a random ID and secret using SHA256.
 *
 * @param prefix - A prefix to add to the key ID and secret. Must be lowercase letters. Default is 'ak'.
 * @param idLength - Length of the key ID. Default is 12.
 * @param secretLength - Length of the secret. Default is 32.
 */
export function generateApiKey(
  prefix: string = 'ak',
  idLength: number = 12,
  secretLength: number = 32,
): GeneratedApiKey {
  if (!PREFIX_REGEX.test(prefix)) {
    throw new Error(
      'Prefix must contain only lowercase letters (a-z) and no other characters.',
    );
  }
  const keyId = customAlphabet(ALPHABET, idLength)();
  const secret = nanoid(secretLength);
  const fullKey = `${prefix}_${keyId}_${secret}`;
  const secretHash = createHash('sha256').update(secret).digest('hex');
  return {
    rawKey: fullKey,
    keyId,
    secretHash,
  };
}

export interface ParsedApiKey {
  readonly prefix: string;
  readonly keyId: string;
  readonly secret: string;
}

/**
 * Parse and validate raw API key format.
 */
export function parseApiKey(rawKey: string): ParsedApiKey {
  const parts = rawKey.split('_');
  if (parts.length < 3) {
    throw new Error('Invalid API key format.');
  }
  const prefix = parts[0];
  const keyId = parts[1];
  const secret = rawKey.substring(prefix.length + keyId.length + 2);

  if (!PREFIX_REGEX.test(prefix)) {
    throw new Error('Invalid API key prefix.');
  }

  if (!keyId || !secret) {
    throw new Error('Malformed API key.');
  }

  return {prefix, keyId, secret};
}

export function verifySecret(
  providedSecret: string,
  storedSecretHash: string,
): boolean {
  const providedHash = createHash('sha256').update(providedSecret).digest();

  const storedHashBuffer = Buffer.from(storedSecretHash, 'hex');

  // Prevent length mismatch timing leaks
  if (providedHash.length !== storedHashBuffer.length) {
    return false;
  }

  return timingSafeEqual(providedHash, storedHashBuffer);
}

/**
 * A stored API key.
 */
export interface StoredApiKeyRecord {
  /**
   * The ID of the key.
   */
  keyId: string;
  /**
   * The SHA256 hash of the secret. This should be stored with the keyId.
   */
  secretHash: string;
}

/**
 * A function that looks up a stored API key record by key ID.
 */
export type ApiKeyLookupFn = (
  keyId: string,
) => Promise<StoredApiKeyRecord | null>;

/**
 * Verifies an API key secret against a stored hash.
 *
 * @param rawKey - The raw API key to verify.
 * @param lookupFn - The function to use to lookup the stored hash.
 */
export async function verifyApiKey(
  rawKey: string,
  lookupFn: ApiKeyLookupFn,
): Promise<StoredApiKeyRecord | null> {
  let parsed: ParsedApiKey;
  try {
    parsed = parseApiKey(rawKey);
  } catch {
    return null;
  }
  const record = await lookupFn(parsed.keyId);
  if (!record) {
    return null;
  }
  const valid = verifySecret(parsed.secret, record.secretHash);
  if (!valid) {
    return null;
  }
  return record;
}
