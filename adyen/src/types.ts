/*
 * Holds types that are used across multiple modules.
 */

export type Metadata = Record<string, string>;

export type Amount = {
  currency: string;
  value: number;
};

/**
 * @see https://docs.adyen.com/payment-methods/payment-method-types
 */
export type PaymentMethodType =
  | 'amex'
  | 'applepay'
  | 'diners'
  | 'discover'
  | 'googlepay'
  | 'interac'
  | 'jcb'
  | 'mc'
  | 'paybybank_plaid'
  | 'paypal'
  | 'visa';

export type CountryCode = 'US' | 'CAD';
