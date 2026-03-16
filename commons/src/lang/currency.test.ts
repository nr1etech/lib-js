import {test, expect, describe} from 'vitest';
import {formatCurrency, safeFormatCurrency} from './currency.js';

describe('formatCurrency', () => {
  test('formats string amounts with USD', () => {
    expect(formatCurrency('10', 'USD')).toBe('$10.00');
    expect(formatCurrency('10.5', 'USD')).toBe('$10.50');
    expect(formatCurrency('10.99', 'USD')).toBe('$10.99');
    expect(formatCurrency('0', 'USD')).toBe('$0.00');
  });

  test('formats number amounts with USD', () => {
    expect(formatCurrency(10, 'USD')).toBe('$10.00');
    expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
    expect(formatCurrency(10.99, 'USD')).toBe('$10.99');
    expect(formatCurrency(0, 'USD')).toBe('$0.00');
  });

  test('formats negative amounts', () => {
    expect(formatCurrency('-10.50', 'USD')).toBe('-$10.50');
    expect(formatCurrency(-10.5, 'USD')).toBe('-$10.50');
  });

  test('handles different currencies', () => {
    expect(formatCurrency('10', 'EUR')).toBe('€10.00');
    expect(formatCurrency('10', 'GBP')).toBe('£10.00');
    expect(formatCurrency('10', 'JPY')).toBe('¥10.00');
  });

  test('handles lowercase currency codes', () => {
    expect(formatCurrency('10', 'usd')).toBe('$10.00');
    expect(formatCurrency('10', 'eur')).toBe('€10.00');
  });

  test('formats with different locales', () => {
    // German locale uses different formatting
    expect(formatCurrency('1234.56', 'EUR', 'de-DE')).toBe('1.234,56\u00A0€');
    // Japanese locale (uses fullwidth yen symbol ￥)
    expect(formatCurrency('1234.56', 'JPY', 'ja-JP')).toBe('￥1,234.56');
    // US locale (default)
    expect(formatCurrency('1234.56', 'USD', 'en-US')).toBe('$1,234.56');
  });

  test('validates and normalizes numeric precision', () => {
    // Numbers with valid precision are formatted correctly
    expect(formatCurrency(10.5, 'USD')).toBe('$10.50');
    expect(formatCurrency(10.99, 'USD')).toBe('$10.99');
  });

  test('throws on invalid string amounts', () => {
    expect(() => formatCurrency('invalid', 'USD')).toThrow(
      'Invalid amount format',
    );
    expect(() => formatCurrency('10.000', 'USD')).toThrow(
      'Invalid amount format',
    );
    expect(() => formatCurrency('$10.00', 'USD')).toThrow(
      'Invalid amount format',
    );
  });

  test('throws on invalid numeric amounts', () => {
    expect(() => formatCurrency(NaN, 'USD')).toThrow(
      'Amount must be a finite number',
    );
    expect(() => formatCurrency(Infinity, 'USD')).toThrow(
      'Amount must be a finite number',
    );
    expect(() => formatCurrency(10.999, 'USD')).toThrow(
      'Invalid amount format',
    );
  });

  test('uses en-US locale by default', () => {
    expect(formatCurrency('1234.56', 'USD')).toBe('$1,234.56');
  });

  test('handles large amounts', () => {
    expect(formatCurrency('1000000', 'USD')).toBe('$1,000,000.00');
    expect(formatCurrency('1000000.99', 'USD')).toBe('$1,000,000.99');
  });
});

describe('safeFormatCurrency', () => {
  test('returns success for valid string amounts', () => {
    const result = safeFormatCurrency('10.50', 'USD');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('$10.50');
    }
  });

  test('returns success for valid numeric amounts', () => {
    const result = safeFormatCurrency(10.5, 'USD');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('$10.50');
    }
  });

  test('returns error for invalid string amounts', () => {
    const result = safeFormatCurrency('invalid', 'USD');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid amount format: "invalid"');
    }
  });

  test('returns error for invalid numeric amounts', () => {
    const result = safeFormatCurrency(NaN, 'USD');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Amount must be a finite number');
    }
  });

  test('returns error for excessive precision', () => {
    const result = safeFormatCurrency(10.999, 'USD');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid amount format: "10.999"');
    }
  });
});
