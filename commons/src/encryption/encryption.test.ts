import {test, expect} from 'vitest';
import {
  decodeKey,
  generateEncodedKey,
  localDecrypt,
  localEncrypt,
} from './encryption.js';

test('Test generateEncodedKey', () => {
  const key = generateEncodedKey();
  expect(key).toBeDefined();
  console.log('Encoded key:', key);
  const decoded = decodeKey(key);
  expect(decoded).toBeDefined();
}, 10000);

test('Test encryption', () => {
  const key = generateEncodedKey();
  const encrypted = localEncrypt({test: 'test'}, decodeKey(key));
  expect(encrypted).toBeDefined();
  console.log('Encrypted:', encrypted);
  const decrypted = localDecrypt(encrypted, key);
  expect(decrypted).toBeDefined();
  expect(decrypted).toEqual({test: 'test'});
}, 10000);
