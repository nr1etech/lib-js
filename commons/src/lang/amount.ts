import {safeCall, SafeResult} from '../errors/index.js';

/**
 * Parses an amount in the format "0.00", "0.0" or "0" and converts it to a
 * number. Both positive and negative values are supported. This will throw
 * an error if the amount is not in the expected format.
 *
 * @param amount - The amount string to parse
 * @returns The parsed amount as a number
 * @throws Error if the amount is not in the expected format or is not a finite number
 */
export function parseAmount(amount: string): number {
  const trimmed = amount.trim();
  const AMOUNT_REGEX = /^-?\d+(\.\d{1,2})?$/;

  if (!AMOUNT_REGEX.test(trimmed)) {
    throw new Error(`Invalid amount format: "${amount}"`);
  }

  const value = Number(trimmed);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid numeric value: "${amount}"`);
  }

  return value;
}

/**
 * Parses an amount in the format "0.00", "0.0" or "0" and converts it to a
 * number. Both positive and negative values are supported. This will return
 * an error message if the amount is not in the expected format.
 *
 * @param input - The amount string to parse
 * @returns A safe result containing the parsed amount as a number, or an error message if the amount is invalid.
 */
export function safeParseAmount(input: string): SafeResult<number> {
  return safeCall(() => parseAmount(input), 'Invalid amount format');
}

/**
 * Formats a number into a canonical "0.00" amount string. Numbers must be two
 * decimal places or less. Both positive and negative values are supported.
 *
 * @param value - The number to format
 * @returns The formatted amount string, e.g., "10.00" or "-10.00"
 * @throws Error if the value is not finite or exceeds two decimal places
 */
export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error('Amount must be a finite number');
  }
  if (Number.isNaN(value)) {
    throw new Error('Amount must be a valid number');
  }

  // Normalize -0 → 0
  const normalized = Object.is(value, -0) ? 0 : value;

  // Convert to string without scientific notation
  const asString = normalized.toString();

  // Validate decimal precision (max 2 decimal places)
  const DECIMAL_REGEX = /^-?\d+(\.\d{1,2})?$/;

  if (!DECIMAL_REGEX.test(asString)) {
    throw new Error(`Invalid amount format: "${asString}"`);
  }

  return normalized.toFixed(2);
}

/**
 * Formats a number into a canonical "0.00" amount string. Numbers must be two
 * decimal places or less. Both positive and negative values are supported.
 *
 * @param value - The number to format
 * @returns A safe result containing the formatted amount string, or an error message if the value is invalid.
 */
export function safeFormatAmount(value: number): SafeResult<string> {
  return safeCall(() => formatAmount(value), 'Invalid amount');
}
