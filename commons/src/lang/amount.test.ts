import {test, expect, describe} from 'vitest';
import {
  parseAmount,
  safeParseAmount,
  formatAmount,
  safeFormatAmount,
} from './amount.js';

describe('parseAmount', () => {
  test('parses valid integer formats', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('10')).toBe(10);
    expect(parseAmount('100')).toBe(100);
  });

  test('parses valid decimal formats', () => {
    expect(parseAmount('10.0')).toBe(10);
    expect(parseAmount('10.00')).toBe(10);
    expect(parseAmount('10.5')).toBe(10.5);
    expect(parseAmount('10.99')).toBe(10.99);
    expect(parseAmount('0.01')).toBe(0.01);
  });

  test('parses negative values', () => {
    expect(parseAmount('-10')).toBe(-10);
    expect(parseAmount('-10.50')).toBe(-10.5);
    expect(parseAmount('-0.01')).toBe(-0.01);
  });

  test('handles whitespace', () => {
    expect(parseAmount('  10.00  ')).toBe(10);
    expect(parseAmount('\t10.50\n')).toBe(10.5);
  });

  test('throws on invalid formats', () => {
    expect(() => parseAmount('')).toThrow('Invalid amount format');
    expect(() => parseAmount('   ')).toThrow('Invalid amount format');
    expect(() => parseAmount('abc')).toThrow('Invalid amount format');
    expect(() => parseAmount('10.000')).toThrow('Invalid amount format');
    expect(() => parseAmount('10.')).toThrow('Invalid amount format');
    expect(() => parseAmount('.10')).toThrow('Invalid amount format');
    expect(() => parseAmount('10.5.5')).toThrow('Invalid amount format');
    expect(() => parseAmount('$10.00')).toThrow('Invalid amount format');
    expect(() => parseAmount('10,000.00')).toThrow('Invalid amount format');
  });

  test('throws on special numeric values', () => {
    expect(() => parseAmount('NaN')).toThrow('Invalid amount format');
    expect(() => parseAmount('Infinity')).toThrow('Invalid amount format');
    expect(() => parseAmount('-Infinity')).toThrow('Invalid amount format');
  });
});

describe('safeParseAmount', () => {
  test('returns success for valid amounts', () => {
    const result = safeParseAmount('10.50');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(10.5);
    }
  });

  test('returns error for invalid amounts', () => {
    const result = safeParseAmount('invalid');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid amount format');
    }
  });
});

describe('formatAmount', () => {
  test('formats integers with two decimal places', () => {
    expect(formatAmount(0)).toBe('0.00');
    expect(formatAmount(10)).toBe('10.00');
    expect(formatAmount(100)).toBe('100.00');
  });

  test('formats decimals with two decimal places', () => {
    expect(formatAmount(10.5)).toBe('10.50');
    expect(formatAmount(10.99)).toBe('10.99');
    expect(formatAmount(0.01)).toBe('0.01');
  });

  test('formats negative values', () => {
    expect(formatAmount(-10)).toBe('-10.00');
    expect(formatAmount(-10.5)).toBe('-10.50');
    expect(formatAmount(-0.01)).toBe('-0.01');
  });

  test('normalizes negative zero', () => {
    expect(formatAmount(-0)).toBe('0.00');
  });

  test('throws on non-finite numbers', () => {
    expect(() => formatAmount(NaN)).toThrow('Amount must be a finite number');
    expect(() => formatAmount(Infinity)).toThrow(
      'Amount must be a finite number',
    );
    expect(() => formatAmount(-Infinity)).toThrow(
      'Amount must be a finite number',
    );
  });

  test('throws on excessive decimal precision', () => {
    expect(() => formatAmount(10.999)).toThrow('Invalid amount format');
    expect(() => formatAmount(0.001)).toThrow('Invalid amount format');
    expect(() => formatAmount(10.123456)).toThrow('Invalid amount format');
  });
});

describe('safeFormatAmount', () => {
  test('returns success for valid amounts', () => {
    const result = safeFormatAmount(10.5);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('10.50');
    }
  });

  test('returns error for invalid amounts', () => {
    const result = safeFormatAmount(NaN);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Amount must be a finite number');
    }
  });
});
