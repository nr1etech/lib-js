/**
 * Masks a card number showing the first 6 (BIN) and last 4 which is allowed by
 * PCI. This function will never return the original string even if the card
 * number is an invalid length.
 *
 * @param cardNumber - The card number to mask
 */
export function maskCardNumber(cardNumber?: string | null) {
  if (
    cardNumber === undefined ||
    cardNumber === null ||
    cardNumber.trim().length === 0
  ) {
    return null;
  }
  cardNumber = cardNumber.trim().replace(/\s+/g, '');
  // If the card length is less than 8, we mask everything to be safe
  if (cardNumber.length < 8) {
    return ''.padEnd(cardNumber.length, '*');
  }
  // If the card length is less than 12 we return everything masked but the last 4
  if (cardNumber.length < 12) {
    return cardNumber.slice(-4).padStart(cardNumber.length, '*');
  }
  return (
    cardNumber.slice(0, 6) +
    ''.padEnd(cardNumber.length - 10, '*') +
    cardNumber.slice(-4)
  );
}
