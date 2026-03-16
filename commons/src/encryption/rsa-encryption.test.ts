import {describe, it, expect, beforeAll} from 'vitest';
import {
  generateKeyPair,
  generateKeyPairSync,
  encryptWithPublicKey,
  decryptWithPrivateKey,
  exportKeys,
  importKeys,
  isValidPublicKey,
  isValidPrivateKey,
  getKeySize,
  type RSAKeyPair,
} from './rsa-encryption.js';

describe('RSA Encryption', () => {
  let testKeyPair: RSAKeyPair;

  beforeAll(() => {
    // Generate a test key pair for use in multiple tests
    testKeyPair = generateKeyPairSync();
  });

  describe('generateKeyPairSync', () => {
    it('should generate a valid RSA key pair with default options', () => {
      const keyPair = generateKeyPairSync();

      expect(keyPair).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
    });

    it('should generate a 2048-bit key pair by default', () => {
      const keyPair = generateKeyPairSync();
      const keySize = getKeySize(keyPair.publicKey);
      expect(keySize).toBe(2048);
    });

    it('should generate a 3072-bit key pair when specified', () => {
      const keyPair = generateKeyPairSync({keySize: 3072});
      const keySize = getKeySize(keyPair.publicKey);
      expect(keySize).toBe(3072);
    });

    it('should generate a 4096-bit key pair when specified', () => {
      const keyPair = generateKeyPairSync({keySize: 4096});
      const keySize = getKeySize(keyPair.publicKey);
      expect(keySize).toBe(4096);
    });

    it('should generate keys in base64 format when specified', () => {
      const keyPair = generateKeyPairSync({format: 'base64'});

      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).not.toContain('-----BEGIN');
      expect(keyPair.privateKey).not.toContain('-----BEGIN');

      // Should be valid base64
      expect(() => Buffer.from(keyPair.publicKey, 'base64')).not.toThrow();
      expect(() => Buffer.from(keyPair.privateKey, 'base64')).not.toThrow();
    });
  });

  describe('generateKeyPair (async)', () => {
    it('should generate a valid RSA key pair asynchronously', async () => {
      const keyPair = await generateKeyPair();

      expect(keyPair).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(keyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
    });

    it('should generate keys in base64 format when specified', async () => {
      const keyPair = await generateKeyPair({format: 'base64'});

      expect(keyPair.publicKey).not.toContain('-----BEGIN');
      expect(keyPair.privateKey).not.toContain('-----BEGIN');
    });
  });

  describe('encryptWithPublicKey and decryptWithPrivateKey', () => {
    it('should encrypt and decrypt a string successfully', () => {
      const originalData = 'Hello, World!';

      const encrypted = encryptWithPublicKey(
        originalData,
        testKeyPair.publicKey,
      );
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalData);

      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toBe(originalData);
    });

    it('should encrypt and decrypt an object successfully', () => {
      const originalData = {
        name: 'John Doe',
        age: 30,
        email: 'john@example.com',
        nested: {
          key: 'value',
        },
      };

      const encrypted = encryptWithPublicKey(
        originalData,
        testKeyPair.publicKey,
      );
      expect(encrypted).toBeDefined();

      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toEqual(originalData);
    });

    it('should handle base64 encoded keys', () => {
      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      const originalData = 'Test with base64 keys';

      const encrypted = encryptWithPublicKey(
        originalData,
        base64KeyPair.publicKey,
      );
      const decrypted = decryptWithPrivateKey(
        encrypted,
        base64KeyPair.privateKey,
      );

      expect(decrypted).toBe(originalData);
    });

    it('should handle raw base64 keys without PEM headers', () => {
      // Generate a key pair and extract the raw base64 (simulate the new format)
      const pemKeyPair = generateKeyPairSync({format: 'pem'});

      // Extract raw base64 from PEM by removing headers and newlines
      const rawPublicKey = pemKeyPair.publicKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

      const rawPrivateKey = pemKeyPair.privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      const originalData = 'Test with raw base64 keys';

      // Should work with raw base64 format
      const encrypted = encryptWithPublicKey(originalData, rawPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);

      expect(decrypted).toBe(originalData);
    });

    it('should handle the new environment format (raw base64 without PEM headers)', () => {
      // Test with the actual format from the dev environment
      const rawPublicKey =
        'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1M6wSqLb6VDlo1E1zQet/F8ubAhvdcLLe8CKd66w154qZ4b0mYNSmw7DXR+wNz4k8VkP9Cxi/SxxHqj+PLYugHWftN/OFsSUASWRr0jiywQ5pbEngMU56Wy90iZmu9ngimdwinmuOjIuDFVyQNGb8E9k1YcTUMqhbgV7OPjn2n6YuJje5A/bLXzrF9qwXxDlLz3Idc8oRDjL42/erifhV7jPk6yFGD7TxHYAtaFP9Q6sQzNvPX3z4xJkTsRCDoFXGu5jCWxWKtXZTT7Jgpxo5PWjR05aNSQu87UBDNM1a3cJygFGdi4k9lhVfK9NRLwX3IrGJx0EYpS70e6SYwmxawIDAQAB';
      const rawPrivateKey =
        'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUzrBKotvpUOWjUTXNB638Xy5sCG91wst7wIp3rrDXnipnhvSZg1KbDsNdH7A3PiTxWQ/0LGL9LHEeqP48ti6AdZ+0384WxJQBJZGvSOLLBDmlsSeAxTnpbL3SJma72eCKZ3CKea46Mi4MVXJA0ZvwT2TVhxNQyqFuBXs4+Ofafpi4mN7kD9stfOsX2rBfEOUvPch1zyhEOMvjb96uJ+FXuM+TrIUYPtPEdgC1oU/1DqxDM289ffPjEmROxEIOgVca7mMJbFYq1dlNPsmCnGjk9aNHTlo1JC7ztQEM0zVrdwnKAUZ2LiT2WFV8r01EvBfcisYnHQRilLvR7pJjCbFrAgMBAAECggEAFNVnTOdEwEK7OJHqwnfOALcQxGLPBqhbY3ImHDFt/q3tWNVNfPnuTF/VoHhJuB7NXxNpDG6MAl0ndej1etwbEVhymjKO6ou0MaiL6q0oBtgTDLWbOHAWi1OqAbjgteNOqD4YNnZTKD9hYrO6y725ln0vUfg3W+F6jFrdBWbYy/sLFC6LiPjBo5UrtYwsFXS63JiOs+wuZGRWDlaOpA26ptGQFh4hIoQ494Lwz5G92w0zKTPh1qGLa+vpB9NlUWpJdZPVbN3GL7q3/N2qwt26VwgR2UB/wdM7lA7m4OltqcYykz8bJa+dm9U/qwME3i7GGhqtSml6ugWE7XsBK47QgQKBgQD2RNK7EnhTKs08j5O8+yLR9ZTFdKsmx6kdXddQ9v//y5IxlYeoQDZ+o6pyWdLixfWg6O4ipMlG+5WOG5Gvxqf/avpUc25aCF157dLLaagDUCoJbsmnw13vDl/xE4HfADJSk8vlhU2MX6z+uYR7t286HbJ9Z0XZnDAo55qoPV0SlwKBgQDdN2FIi9Wr6D1vioQsJLINbTwIQIv5Khko/RzS4MwApdaKiL+0mUFUqPBAX4jxdihv9wl8shtgZZleB+283JzmDouO4I7H4pf8HhQ6Fg/1q66EucgCJvY7xkVN6BGN1RblcDx3GAdoQF7o8k1ME9uynkFTZjGdjEnNh2C8jwL2TQKBgEuy8hfA4K2n3Xh9JcuUYqqpU3aymx2LiAdX3iSsGBrXx3NoZE+qlVWuF2mZBMLiWNOCZhjOEHS6Rsls3gZrCR7xEku9Q7F3Gsys9vvB2XxTOui1XlUsL4aZI5KmDWiv1cgeWDGQHTtF+ZY/DmM9CnqRwFjd0tHGOeOI9bg7TI23AoGBANk9dGzQ3fGm7QYnqirLkos69ZRJBuyWmgS1pGO23L/aHDkJl/Gb+xtPmDgvWYV+erGRkSCCq/3baGR+Nsqcf/ww1n5mKfFDpeuyAj0Uw3GHuqee5jqu1mrXB+I8/1ggpg6FTOvLjiKj7FCo+p22dq8PWKm1Fw5X4XZT9vzVGJyVAoGAfWcHjfYtBZF7j7V1AorL6mDaD7fpDEl/JQxwYpFwryAtSlPFrylXvvxb0R9h2cGdknNSAZhUkl+D+ceIH9iz3mwHT7uncNqwyi7OomOJSeWbsisw2II8vmGdSnEQDKKwZAfJ6nF8BGq6+HuRzD/Y0sujE31CSkRJbMRRgUVmPfU=';

      const originalData = 'Test with new environment format';

      // Should work with the new raw base64 format from environment
      const encrypted = encryptWithPublicKey(originalData, rawPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);

      expect(decrypted).toBe(originalData);
    });

    it('should handle maximum allowed string size', () => {
      // For 2048-bit key with OAEP padding, max is approximately 190 bytes
      const maxString = 'x'.repeat(190);

      const encrypted = encryptWithPublicKey(maxString, testKeyPair.publicKey);
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );

      expect(decrypted).toBe(maxString);
    });

    it('should throw error when data is too large for key size', () => {
      // Exceeding the maximum size for 2048-bit key
      const tooLargeString = 'x'.repeat(250);

      expect(() => {
        encryptWithPublicKey(tooLargeString, testKeyPair.publicKey);
      }).toThrow('data too large for key size');
    });

    it('should throw error when decrypting with wrong key', () => {
      const wrongKeyPair = generateKeyPairSync();
      const originalData = 'Secret message';

      const encrypted = encryptWithPublicKey(
        originalData,
        testKeyPair.publicKey,
      );

      expect(() => {
        decryptWithPrivateKey(encrypted, wrongKeyPair.privateKey);
      }).toThrow();
    }, 30000);

    it('should throw error when encrypting with invalid key', () => {
      const invalidKey = 'not-a-valid-key';

      expect(() => {
        encryptWithPublicKey('test', invalidKey);
      }).toThrow();
    });
  });

  describe('exportKeys', () => {
    it('should export PEM keys to base64 format', () => {
      const pemKeyPair = generateKeyPairSync({format: 'pem'});
      const base64KeyPair = exportKeys(pemKeyPair, 'base64');

      expect(base64KeyPair.publicKey).not.toContain('-----BEGIN');
      expect(base64KeyPair.privateKey).not.toContain('-----BEGIN');

      // Should be valid base64
      expect(() =>
        Buffer.from(base64KeyPair.publicKey, 'base64'),
      ).not.toThrow();
      expect(() =>
        Buffer.from(base64KeyPair.privateKey, 'base64'),
      ).not.toThrow();
    });

    it('should export base64 keys to PEM format', () => {
      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      const pemKeyPair = exportKeys(base64KeyPair, 'pem');

      expect(pemKeyPair.publicKey).toContain('-----BEGIN PUBLIC KEY-----');
      expect(pemKeyPair.privateKey).toContain('-----BEGIN PRIVATE KEY-----');
    });

    it('should return same keys if already in requested format', () => {
      const pemKeyPair = generateKeyPairSync({format: 'pem'});
      const exportedPem = exportKeys(pemKeyPair, 'pem');

      expect(exportedPem).toEqual(pemKeyPair);

      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      const exportedBase64 = exportKeys(base64KeyPair, 'base64');

      expect(exportedBase64).toEqual(base64KeyPair);
    });
  });

  describe('importKeys', () => {
    it('should import PEM keys successfully', () => {
      const keyObjects = importKeys(
        testKeyPair.publicKey,
        testKeyPair.privateKey,
      );

      expect(keyObjects).toBeDefined();
      expect(keyObjects.publicKey).toBeDefined();
      expect(keyObjects.privateKey).toBeDefined();
      expect(keyObjects.publicKey.type).toBe('public');
      expect(keyObjects.privateKey.type).toBe('private');
    });

    it('should import base64 keys successfully', () => {
      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      const keyObjects = importKeys(
        base64KeyPair.publicKey,
        base64KeyPair.privateKey,
      );

      expect(keyObjects).toBeDefined();
      expect(keyObjects.publicKey.type).toBe('public');
      expect(keyObjects.privateKey.type).toBe('private');
    });

    it('should import raw base64 keys without PEM headers', () => {
      const pemKeyPair = generateKeyPairSync({format: 'pem'});

      // Extract raw base64
      const rawPublicKey = pemKeyPair.publicKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

      const rawPrivateKey = pemKeyPair.privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      const keyObjects = importKeys(rawPublicKey, rawPrivateKey);

      expect(keyObjects).toBeDefined();
      expect(keyObjects.publicKey.type).toBe('public');
      expect(keyObjects.privateKey.type).toBe('private');
    });
  });

  describe('isValidPublicKey', () => {
    it('should return true for valid PEM public key', () => {
      expect(isValidPublicKey(testKeyPair.publicKey)).toBe(true);
    });

    it('should return true for valid base64 public key', () => {
      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      expect(isValidPublicKey(base64KeyPair.publicKey)).toBe(true);
    });

    it('should return true for raw base64 public key without PEM headers', () => {
      const pemKeyPair = generateKeyPairSync({format: 'pem'});
      const rawPublicKey = pemKeyPair.publicKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

      expect(isValidPublicKey(rawPublicKey)).toBe(true);
    });

    it('should return false for invalid key', () => {
      expect(isValidPublicKey('invalid-key')).toBe(false);
      expect(isValidPublicKey('')).toBe(false);
      expect(
        isValidPublicKey(
          '-----BEGIN PUBLIC KEY-----\ninvalid\n-----END PUBLIC KEY-----',
        ),
      ).toBe(false);
    });

    it('should return false for private key', () => {
      expect(isValidPublicKey(testKeyPair.privateKey)).toBe(false);
    });
  });

  describe('isValidPrivateKey', () => {
    it('should return true for valid PEM private key', () => {
      expect(isValidPrivateKey(testKeyPair.privateKey)).toBe(true);
    });

    it('should return true for valid base64 private key', () => {
      const base64KeyPair = generateKeyPairSync({format: 'base64'});
      expect(isValidPrivateKey(base64KeyPair.privateKey)).toBe(true);
    });

    it('should return true for raw base64 private key without PEM headers', () => {
      const pemKeyPair = generateKeyPairSync({format: 'pem'});
      const rawPrivateKey = pemKeyPair.privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      expect(isValidPrivateKey(rawPrivateKey)).toBe(true);
    });

    it('should return false for invalid key', () => {
      expect(isValidPrivateKey('invalid-key')).toBe(false);
      expect(isValidPrivateKey('')).toBe(false);
      expect(
        isValidPrivateKey(
          '-----BEGIN PRIVATE KEY-----\ninvalid\n-----END PRIVATE KEY-----',
        ),
      ).toBe(false);
    });

    it('should return false for public key', () => {
      expect(isValidPrivateKey(testKeyPair.publicKey)).toBe(false);
    });
  });

  describe('getKeySize', () => {
    it('should return correct key size for 2048-bit key', () => {
      const keyPair = generateKeyPairSync({keySize: 2048});
      expect(getKeySize(keyPair.publicKey)).toBe(2048);
      expect(getKeySize(keyPair.privateKey)).toBe(2048);
    });

    it('should return correct key size for 3072-bit key', () => {
      const keyPair = generateKeyPairSync({keySize: 3072});
      expect(getKeySize(keyPair.publicKey)).toBe(3072);
      expect(getKeySize(keyPair.privateKey)).toBe(3072);
    });

    it('should return correct key size for 4096-bit key', () => {
      const keyPair = generateKeyPairSync({keySize: 4096});
      expect(getKeySize(keyPair.publicKey)).toBe(4096);
      expect(getKeySize(keyPair.privateKey)).toBe(4096);
    });

    it('should handle base64 encoded keys', () => {
      const base64KeyPair = generateKeyPairSync({
        keySize: 2048,
        format: 'base64',
      });
      expect(getKeySize(base64KeyPair.publicKey)).toBe(2048);
      expect(getKeySize(base64KeyPair.privateKey)).toBe(2048);
    });

    it('should handle raw base64 keys without PEM headers', () => {
      const pemKeyPair = generateKeyPairSync({keySize: 2048, format: 'pem'});

      const rawPublicKey = pemKeyPair.publicKey
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

      const rawPrivateKey = pemKeyPair.privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .replace(/\s/g, '');

      expect(getKeySize(rawPublicKey)).toBe(2048);
      expect(getKeySize(rawPrivateKey)).toBe(2048);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle empty string encryption', () => {
      const encrypted = encryptWithPublicKey('', testKeyPair.publicKey);
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toBe('');
    });

    it('should handle special characters', () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;\':",./<>?`~\n\t\r';
      const encrypted = encryptWithPublicKey(
        specialChars,
        testKeyPair.publicKey,
      );
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toBe(specialChars);
    });

    it('should handle Unicode characters', () => {
      const unicode = '你好世界 🌍 مرحبا بالعالم';
      const encrypted = encryptWithPublicKey(unicode, testKeyPair.publicKey);
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toBe(unicode);
    });

    it('should handle null values in objects', () => {
      const dataWithNull = {key: null, value: 'test'};
      const encrypted = encryptWithPublicKey(
        dataWithNull,
        testKeyPair.publicKey,
      );
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toEqual(dataWithNull);
    });

    it('should handle arrays', () => {
      const arrayData = [1, 2, 3, 'test', {nested: true}];
      const encrypted = encryptWithPublicKey(arrayData, testKeyPair.publicKey);
      const decrypted = decryptWithPrivateKey(
        encrypted,
        testKeyPair.privateKey,
      );
      expect(decrypted).toEqual(arrayData);
    });
  });
}, 30000);
