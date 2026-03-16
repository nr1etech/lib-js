import {createCipheriv, createDecipheriv} from 'crypto';
import {randomBytes} from 'node:crypto';

const ALGORITHM = 'aes-128-cbc';
const SEPARATOR = '|';

export function localEncrypt(val: object, key: Buffer | string) {
  if (typeof key === 'string') {
    key = decodeKey(key);
  }
  const iv = generateIV();
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(JSON.stringify(val), 'utf8', 'base64url');
  encrypted += cipher.final('base64url');
  return iv.toString('base64url') + SEPARATOR + encrypted;
}

export function localDecrypt(encrypted: string, key: Buffer | string) {
  if (typeof key === 'string') {
    key = decodeKey(key);
  }
  const parts = encrypted.split(SEPARATOR);
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted value');
  }
  const iv = decodeIV(parts[0]);
  encrypted = parts[1];
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  const decrypted = decipher.update(encrypted, 'base64url', 'utf8');
  return JSON.parse(decrypted + decipher.final('utf8'));
}

export function generateKey(size?: number) {
  return randomBytes(size ?? 16);
}

export function generateEncodedKey(size?: number) {
  return generateKey(size).toString('base64');
}

export function generateIV(size?: number) {
  return randomBytes(size ?? 16);
}

export function generateEncodedIV(size?: number) {
  return generateIV(size).toString('base64');
}

export function decodeKey(encodedKey: string) {
  return Buffer.from(encodedKey, 'base64');
}

export function decodeIV(encodedIV: string) {
  return Buffer.from(encodedIV, 'base64');
}
