import {formatAmount, parseAmount} from './amount.js';
import {safeCall, SafeResult} from '../errors/index.js';

/**
 * Formats a currency amount using the Intl.NumberFormat API.
 * All inputs are validated and normalized to two decimal places.
 *
 * @param amount   - Amount as number or string ("0", "0.0", "0.00")
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @param locale   - Locale (defaults to 'en-US')
 * @returns Formatted currency string
 * @throws Error if the amount is invalid
 */
export function formatCurrency(
  amount: number | string,
  currency: string,
  locale?: string,
): string {
  let numericAmount: number;
  if (typeof amount === 'string') {
    // strict string validation: disallows "0.000", etc.
    numericAmount = parseAmount(amount);
  } else {
    // strict numeric validation + normalization
    numericAmount = parseFloat(formatAmount(amount));
  }

  return new Intl.NumberFormat(locale ?? 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

/**
 * Safely formats a currency amount.
 *
 * @param amount   - Amount as number or string
 * @param currency - Currency code (e.g., 'USD')
 * @param locale   - Locale (defaults to 'en-US')
 * @returns A safe result containing the formatted currency string,
 *          or an error message if the amount is invalid.
 */
export function safeFormatCurrency(
  amount: number | string,
  currency: string,
  locale?: string,
): SafeResult<string> {
  return safeCall(
    () => formatCurrency(amount, currency, locale),
    'Invalid currency amount',
  );
}
