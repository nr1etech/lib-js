import {describe, it, expect} from 'vitest';
import {
  encryptWithPublicKey,
  decryptWithPrivateKey,
  isValidPublicKey,
  isValidPrivateKey,
} from './rsa-encryption.js';

describe('New Environment Format Support', () => {
  // Test keys from the dev environment (raw base64 without PEM headers)
  const rawPublicKey =
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1M6wSqLb6VDlo1E1zQet/F8ubAhvdcLLe8CKd66w154qZ4b0mYNSmw7DXR+wNz4k8VkP9Cxi/SxxHqj+PLYugHWftN/OFsSUASWRr0jiywQ5pbEngMU56Wy90iZmu9ngimdwinmuOjIuDFVyQNGb8E9k1YcTUMqhbgV7OPjn2n6YuJje5A/bLXzrF9qwXxDlLz3Idc8oRDjL42/erifhV7jPk6yFGD7TxHYAtaFP9Q6sQzNvPX3z4xJkTsRCDoFXGu5jCWxWKtXZTT7Jgpxo5PWjR05aNSQu87UBDNM1a3cJygFGdi4k9lhVfK9NRLwX3IrGJx0EYpS70e6SYwmxawIDAQAB';
  const rawPrivateKey =
    'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUzrBKotvpUOWjUTXNB638Xy5sCG91wst7wIp3rrDXnipnhvSZg1KbDsNdH7A3PiTxWQ/0LGL9LHEeqP48ti6AdZ+0384WxJQBJZGvSOLLBDmlsSeAxTnpbL3SJma72eCKZ3CKea46Mi4MVXJA0ZvwT2TVhxNQyqFuBXs4+Ofafpi4mN7kD9stfOsX2rBfEOUvPch1zyhEOMvjb96uJ+FXuM+TrIUYPtPEdgC1oU/1DqxDM289ffPjEmROxEIOgVca7mMJbFYq1dlNPsmCnGjk9aNHTlo1JC7ztQEM0zVrdwnKAUZ2LiT2WFV8r01EvBfcisYnHQRilLvR7pJjCbFrAgMBAAECggEAFNVnTOdEwEK7OJHqwnfOALcQxGLPBqhbY3ImHDFt/q3tWNVNfPnuTF/VoHhJuB7NXxNpDG6MAl0ndej1etwbEVhymjKO6ou0MaiL6q0oBtgTDLWbOHAWi1OqAbjgteNOqD4YNnZTKD9hYrO6y725ln0vUfg3W+F6jFrdBWbYy/sLFC6LiPjBo5UrtYwsFXS63JiOs+wuZGRWDlaOpA26ptGQFh4hIoQ494Lwz5G92w0zKTPh1qGLa+vpB9NlUWpJdZPVbN3GL7q3/N2qwt26VwgR2UB/wdM7lA7m4OltqcYykz8bJa+dm9U/qwME3i7GGhqtSml6ugWE7XsBK47QgQKBgQD2RNK7EnhTKs08j5O8+yLR9ZTFdKsmx6kdXddQ9v//y5IxlYeoQDZ+o6pyWdLixfWg6O4ipMlG+5WOG5Gvxqf/avpUc25aCF157dLLaagDUCoJbsmnw13vDl/xE4HfADJSk8vlhU2MX6z+uYR7t286HbJ9Z0XZnDAo55qoPV0SlwKBgQDdN2FIi9Wr6D1vioQsJLINbTwIQIv5Khko/RzS4MwApdaKiL+0mUFUqPBAX4jxdihv9wl8shtgZZleB+283JzmDouO4I7H4pf8HhQ6Fg/1q66EucgCJvY7xkVN6BGN1RblcDx3GAdoQF7o8k1ME9uynkFTZjGdjEnNh2C8jwL2TQKBgEuy8hfA4K2n3Xh9JcuUYqqpU3aymx2LiAdX3iSsGBrXx3NoZE+qlVWuF2mZBMLiWNOCZhjOEHS6Rsls3gZrCR7xEku9Q7F3Gsys9vvB2XxTOui1XlUsL4aZI5KmDWiv1cgeWDGQHTtF+ZY/DmM9CnqRwFjd0tHGOeOI9bg7TI23AoGBANk9dGzQ3fGm7QYnqirLkos69ZRJBuyWmgS1pGO23L/aHDkJl/Gb+xtPmDgvWYV+erGRkSCCq/3baGR+Nsqcf/ww1n5mKfFDpeuyAj0Uw3GHuqee5jqu1mrXB+I8/1ggpg6FTOvLjiKj7FCo+p22dq8PWKm1Fw5X4XZT9vzVGJyVAoGAfWcHjfYtBZF7j7V1AorL6mDaD7fpDEl/JQxwYpFwryAtSlPFrylXvvxb0R9h2cGdknNSAZhUkl+D+ceIH9iz3mwHT7uncNqwyi7OomOJSeWbsisw2II8vmGdSnEQDKKwZAfJ6nF8BGq6+HuRzD/Y0sujE31CSkRJbMRRgUVmPfU=';

  describe('Key Validation', () => {
    it('should validate raw base64 public key', () => {
      expect(isValidPublicKey(rawPublicKey)).toBe(true);
    });

    it('should validate raw base64 private key', () => {
      expect(isValidPrivateKey(rawPrivateKey)).toBe(true);
    });
  });

  describe('Encryption/Decryption with Raw Base64 Keys', () => {
    it('should encrypt and decrypt a string with raw base64 keys', () => {
      const originalData = 'Test data for new environment format';

      const encrypted = encryptWithPublicKey(originalData, rawPublicKey);
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(originalData);

      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);
      expect(decrypted).toBe(originalData);
    });

    it('should encrypt and decrypt an object with raw base64 keys', () => {
      const originalData = {
        userId: '12345',
        email: 'test@example.com',
        ssn: '123456789',
      };

      const encrypted = encryptWithPublicKey(originalData, rawPublicKey);
      expect(encrypted).toBeDefined();

      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);
      expect(decrypted).toEqual(originalData);
    });

    it('should handle SSN encryption/decryption', () => {
      const ssn = '123456789';

      const encrypted = encryptWithPublicKey(ssn, rawPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);

      // When a string contains only numbers, JSON.parse converts it to a number
      // Convert back to string for comparison
      expect(String(decrypted)).toBe(ssn);
    });

    it('should handle routing number encryption/decryption', () => {
      const routingNumber = '123456789';

      const encrypted = encryptWithPublicKey(routingNumber, rawPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);

      // When a string contains only numbers, JSON.parse converts it to a number
      // Convert back to string for comparison
      expect(String(decrypted)).toBe(routingNumber);
    });

    it('should handle account number encryption/decryption', () => {
      const accountNumber = '12345678901234';

      const encrypted = encryptWithPublicKey(accountNumber, rawPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);

      // When a string contains only numbers, JSON.parse converts it to a number
      // Convert back to string for comparison
      expect(String(decrypted)).toBe(accountNumber);
    });
  });

  describe('Backward Compatibility', () => {
    it('should still work with PEM format keys', () => {
      const pemPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1M6wSqLb6VDlo1E1zQet
/F8ubAhvdcLLe8CKd66w154qZ4b0mYNSmw7DXR+wNz4k8VkP9Cxi/SxxHqj+PLYu
gHWftN/OFsSUASWRr0jiywQ5pbEngMU56Wy90iZmu9ngimdwinmuOjIuDFVyQNGb
8E9k1YcTUMqhbgV7OPjn2n6YuJje5A/bLXzrF9qwXxDlLz3Idc8oRDjL42/erifh
V7jPk6yFGD7TxHYAtaFP9Q6sQzNvPX3z4xJkTsRCDoFXGu5jCWxWKtXZTT7Jgpxo
5PWjR05aNSQu87UBDNM1a3cJygFGdi4k9lhVfK9NRLwX3IrGJx0EYpS70e6SYwmx
awIDAQAB
-----END PUBLIC KEY-----`;

      const pemPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDUzrBKotvpUOWj
UTXNB638Xy5sCG91wst7wIp3rrDXnipnhvSZg1KbDsNdH7A3PiTxWQ/0LGL9LHEe
qP48ti6AdZ+0384WxJQBJZGvSOLLBDmlsSeAxTnpbL3SJma72eCKZ3CKea46Mi4M
VXJA0ZvwT2TVhxNQyqFuBXs4+Ofafpi4mN7kD9stfOsX2rBfEOUvPch1zyhEOMvj
b96uJ+FXuM+TrIUYPtPEdgC1oU/1DqxDM289ffPjEmROxEIOgVca7mMJbFYq1dlN
PsmCnGjk9aNHTlo1JC7ztQEM0zVrdwnKAUZ2LiT2WFV8r01EvBfcisYnHQRilLvR
7pJjCbFrAgMBAAECggEAFNVnTOdEwEK7OJHqwnfOALcQxGLPBqhbY3ImHDFt/q3t
WNVNfPnuTF/VoHhJuB7NXxNpDG6MAl0ndej1etwbEVhymjKO6ou0MaiL6q0oBtgT
DLWbOHAWi1OqAbjgteNOqD4YNnZTKD9hYrO6y725ln0vUfg3W+F6jFrdBWbYy/sL
FC6LiPjBo5UrtYwsFXS63JiOs+wuZGRWDlaOpA26ptGQFh4hIoQ494Lwz5G92w0z
KTPh1qGLa+vpB9NlUWpJdZPVbN3GL7q3/N2qwt26VwgR2UB/wdM7lA7m4OltqcYy
kz8bJa+dm9U/qwME3i7GGhqtSml6ugWE7XsBK47QgQKBgQD2RNK7EnhTKs08j5O8
+yLR9ZTFdKsmx6kdXddQ9v//y5IxlYeoQDZ+o6pyWdLixfWg6O4ipMlG+5WOG5Gv
xqf/avpUc25aCF157dLLaagDUCoJbsmnw13vDl/xE4HfADJSk8vlhU2MX6z+uYR7
t286HbJ9Z0XZnDAo55qoPV0SlwKBgQDdN2FIi9Wr6D1vioQsJLINbTwIQIv5Khko
/RzS4MwApdaKiL+0mUFUqPBAX4jxdihv9wl8shtgZZleB+283JzmDouO4I7H4pf8
HhQ6Fg/1q66EucgCJvY7xkVN6BGN1RblcDx3GAdoQF7o8k1ME9uynkFTZjGdjEnN
h2C8jwL2TQKBgEuy8hfA4K2n3Xh9JcuUYqqpU3aymx2LiAdX3iSsGBrXx3NoZE+q
lVWuF2mZBMLiWNOCZhjOEHS6Rsls3gZrCR7xEku9Q7F3Gsys9vvB2XxTOui1XlUs
L4aZI5KmDWiv1cgeWDGQHTtF+ZY/DmM9CnqRwFjd0tHGOeOI9bg7TI23AoGBANk9
dGzQ3fGm7QYnqirLkos69ZRJBuyWmgS1pGO23L/aHDkJl/Gb+xtPmDgvWYV+erGR
kSCCq/3baGR+Nsqcf/ww1n5mKfFDpeuyAj0Uw3GHuqee5jqu1mrXB+I8/1ggpg6F
TOvLjiKj7FCo+p22dq8PWKm1Fw5X4XZT9vzVGJyVAoGAfWcHjfYtBZF7j7V1AorL
6mDaD7fpDEl/JQxwYpFwryAtSlPFrylXvvxb0R9h2cGdknNSAZhUkl+D+ceIH9iz
3mwHT7uncNqwyi7OomOJSeWbsisw2II8vmGdSnEQDKKwZAfJ6nF8BGq6+HuRzD/Y
0sujE31CSkRJbMRRgUVmPfU=
-----END PRIVATE KEY-----`;

      const testData = 'Test with PEM format';

      const encrypted = encryptWithPublicKey(testData, pemPublicKey);
      const decrypted = decryptWithPrivateKey(encrypted, pemPrivateKey);

      expect(decrypted).toBe(testData);
    });

    it('should still work with base64-encoded PEM keys', () => {
      // Base64 encode the PEM format
      const pemPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1M6wSqLb6VDlo1E1zQet
/F8ubAhvdcLLe8CKd66w154qZ4b0mYNSmw7DXR+wNz4k8VkP9Cxi/SxxHqj+PLYu
gHWftN/OFsSUASWRr0jiywQ5pbEngMU56Wy90iZmu9ngimdwinmuOjIuDFVyQNGb
8E9k1YcTUMqhbgV7OPjn2n6YuJje5A/bLXzrF9qwXxDlLz3Idc8oRDjL42/erifh
V7jPk6yFGD7TxHYAtaFP9Q6sQzNvPX3z4xJkTsRCDoFXGu5jCWxWKtXZTT7Jgpxo
5PWjR05aNSQu87UBDNM1a3cJygFGdi4k9lhVfK9NRLwX3IrGJx0EYpS70e6SYwmx
awIDAQAB
-----END PUBLIC KEY-----`;

      const base64PublicKey = Buffer.from(pemPublicKey).toString('base64');
      const testData = 'Test with base64-encoded PEM';

      // Should work with base64-encoded PEM
      expect(isValidPublicKey(base64PublicKey)).toBe(true);

      const encrypted = encryptWithPublicKey(testData, base64PublicKey);
      expect(encrypted).toBeDefined();

      // Should be able to decrypt with raw private key
      const decrypted = decryptWithPrivateKey(encrypted, rawPrivateKey);
      expect(decrypted).toBe(testData);
    });
  });
});
