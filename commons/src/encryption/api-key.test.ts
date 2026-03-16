import {expect, test} from 'vitest';
import {
  generateApiKey,
  parseApiKey,
  verifyApiKey,
  type ApiKeyLookupFn,
  type StoredApiKeyRecord,
} from './api-key.js';

test('generateApiKey creates valid API key with defaults', () => {
  const result = generateApiKey();

  expect(result.rawKey).toMatch(/^ak_[\w-]+_[\w-]+$/);
  expect(result.keyId).toHaveLength(12);
  expect(result.secretHash).toMatch(/^[a-f0-9]{64}$/);
});

test('generateApiKey accepts custom parameters', () => {
  const result = generateApiKey('custom', 16, 40);

  expect(result.rawKey.startsWith('custom_')).toBe(true);
  expect(result.keyId).toHaveLength(16);
});

test('generateApiKey throws error for invalid prefix', () => {
  expect(() => generateApiKey('AK')).toThrow(
    'Prefix must contain only lowercase letters',
  );
  expect(() => generateApiKey('ak1')).toThrow(
    'Prefix must contain only lowercase letters',
  );
});

test('parseApiKey parses valid API key', () => {
  const generated = generateApiKey('test', 12, 32);
  const parsed = parseApiKey(generated.rawKey);

  expect(parsed.prefix).toBe('test');
  expect(parsed.keyId).toBe(generated.keyId);
  expect(parsed.secret).toHaveLength(32);
});

test('parseApiKey throws error for invalid format', () => {
  expect(() => parseApiKey('invalid_format')).toThrow(
    'Invalid API key format.',
  );
  expect(() => parseApiKey('AK_keyid_secret')).toThrow(
    'Invalid API key prefix.',
  );
  expect(() => parseApiKey('ak__secret')).toThrow('Malformed API key');
});

test('verifyApiKey verifies valid key successfully', async () => {
  const generated = generateApiKey();
  const storedRecord: StoredApiKeyRecord = {
    keyId: generated.keyId,
    secretHash: generated.secretHash,
  };

  const lookupFn: ApiKeyLookupFn = async (keyId: string) => {
    return keyId === storedRecord.keyId ? storedRecord : null;
  };

  const result = await verifyApiKey(generated.rawKey, lookupFn);

  expect(result).toEqual(storedRecord);
});

test('verifyApiKey returns null for invalid key', async () => {
  const lookupFn: ApiKeyLookupFn = async () => null;

  const result = await verifyApiKey('invalid_key_format', lookupFn);

  expect(result).toBeNull();
});

test('verifyApiKey returns null when secret does not match', async () => {
  const generated = generateApiKey();
  const storedRecord: StoredApiKeyRecord = {
    keyId: generated.keyId,
    secretHash:
      'wronghash123456789012345678901234567890123456789012345678901234',
  };

  const lookupFn: ApiKeyLookupFn = async () => storedRecord;

  const result = await verifyApiKey(generated.rawKey, lookupFn);

  expect(result).toBeNull();
});

test('full flow: generate, store, and verify', async () => {
  // Generate key
  const generated = generateApiKey('api', 12, 32);
  console.log(generated.rawKey);

  // Simulate storage
  const database = new Map<string, StoredApiKeyRecord>();
  database.set(generated.keyId, {
    keyId: generated.keyId,
    secretHash: generated.secretHash,
  });

  // Verify
  const lookupFn: ApiKeyLookupFn = async (keyId: string) => {
    return database.get(keyId) || null;
  };

  const verified = await verifyApiKey(generated.rawKey, lookupFn);

  expect(verified).not.toBeNull();
  expect(verified?.keyId).toBe(generated.keyId);
});
