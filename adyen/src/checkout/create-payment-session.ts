// export type Channel = 'iOS' | 'Android' | 'Web';
// export type Mode = 'embedded' | 'hosted';
// export type ShopperInteraction = 'Ecommerce' | 'ContAuth' | 'Moto' | 'POS';
// export type StoreFiltrationMode = 'exclusive' | 'inclusive';
// export type StorePaymentMethodMode = 'disabled' | 'askForConsent' | 'enabled';

import {AdyenClient} from '../client.js';
import {checkoutV71BaseUrl} from './env.js';
import {Amount} from '../types.js';

export type Address = {
  /**
   * The name of the city. Maximum length: 3000 characters.
   */
  city: string;
  /**
   * The two-character ISO-3166-1 alpha-2 country code. For example, US.
   */
  country: string;
  /**
   * The number or name of the house. Maximum length: 3000 characters.
   */
  houseNumberOrName: string;
  /**
   * A maximum of five digits for an address in the US, or a maximum of ten
   * characters for an address in all other countries.
   */
  postalCode: string;
  /**
   * The two-character ISO 3166-2 state or province code. For example,
   * CA in the US or ON in Canada.
   */
  stateOrProvince?: string;
  /**
   * The name of the street. Maximum length: 3000 characters.
   */
  street: string;
};

export type DeliveryAddress = Address & {
  firstName?: string;
  lastName?: string;
};

export type Company = {
  honmepage?: string;
  name?: string;
  registrationNumber?: string;
  registryLocation?: string;
  taxId?: string;
  type?: string;
};

export type FundOrigin = {
  billingAddress?: Address;
  shopperEmail?: string;
  shopperName?: string;
  telephoneNumber?: string;
  walletIdentifier?: string;
};

/**
 * @see https://docs.adyen.com/api-explorer/Checkout/71/post/sessions
 */
export type CreatePaymentSessionInput = {
  idempotencyKey?: string;
  // /**
  //  * Shopper account information for 3D Secure 2.
  //  */
  // accountInfo?: {};
  // additionalAmounts?: Amount[];
  // additionalAmount?: Amount;
  // additionalData?: {};
  // /**
  //  * List of payment methods to be presented to the shopper.
  //  *
  //  * @see https://docs.adyen.com/payment-methods/payment-method-types
  //  */
  // allowedPaymentMethods?: PaymentMethodType[];
  /**
   * The amount of the payment.
   */
  amount: Amount;
  // /**
  //  * Information about your application.
  //  *
  //  * @see https://docs.adyen.com/development-resources/building-adyen-solutions
  //  */
  // applicationInfo?: {};
  // /**
  //  * Configuration data for 3DS payments.
  //  */
  // authenticationData?: {};
  // billingAddress?: Address;
  // /**
  //  * List of payment methods to be hidden from the shopper.
  //  *
  //  * @see https://docs.adyen.com/payment-methods/payment-method-types
  //  */
  // blockedPaymentMethods?: PaymentMethodType[];
  // /**
  //  * The delay between the authorisation and scheduled auto-capture, specified
  //  * in hours.
  //  */
  // captureDelayHours?: number;
  // /**
  //  * The platform where a payment transaction takes place. This field is
  //  * optional for filtering out payment methods that are only available on
  //  * specific platforms. If this value is not set, then we will try to infer
  //  * it from the sdkVersion or token.
  //  */
  // channel?: Channel;
  // /**
  //  * Information regarding the company.
  //  */
  // company?: Company;
  // /**
  //  * The shopper's two-letter country code.
  //  */
  // countryCode?: CountryCode;
  // /**
  //  * The shopper's date of birth.
  //  *
  //  * Format ISO-8601: YYYY-MM-DD
  //  */
  // dateOfBirth?: string;
  // /**
  //  * The date and time when the purchased goods should be delivered.
  //  *
  //  * ISO 8601 format: YYYY-MM-DDThh:mm:ss+TZD, for example, 2020-12-18T10:15:30+01:00.
  //  */
  // deliverAt?: string;
  // /**
  //  * The address where the purchased goods should be delivered.
  //  */
  // deliveryAddress?: DeliveryAddress;
  // /**
  //  * When true and shopperReference is provided, the shopper will be asked if
  //  * the payment details should be stored for future one-click payments.
  //  *
  //  * @see https://docs.adyen.com/get-started-with-adyen/payment-glossary/#one-click-payments-definition
  //  */
  // enableOneClick?: boolean;
  // /**
  //  * When true and shopperReference is provided, the payment details will be
  //  * tokenized for payouts.
  //  */
  // enablePayOut?: boolean;
  // /**
  //  * When true and shopperReference is provided, the payment details will be
  //  * stored for recurring payments where the shopper is not present, such as
  //  * subscription or automatic top-up payments.
  //  */
  // enableRecurring?: boolean;
  // /**
  //  * The date the session expires in ISO8601 format. When not specified, the
  //  * expiry date is set to 1 hour after session creation. You cannot set the
  //  * session expiry to more than 24 hours after session creation.
  //  */
  // expiresAt?: string;
  // fundOrigin?: FundOrigin;
  // // fundRecipient?: {};
  // // installmentOptions?: {};
  // // lineItems?: {}[];
  // // mandate: {};
  // /**
  //  * The merchant category code (MCC) is a four-digit number, which relates to
  //  * a particular market segment. This code reflects the predominant activity
  //  * that is conducted by the merchant.
  //  */
  // mcc?: string;
  /**
   * The merchant account identifier, with which you want to process the transaction.
   */
  merchantAccount: string;
  // /**
  //  * This reference allows linking multiple transactions to each other for
  //  * reporting purposes (i.e. order auth-rate). The reference should be unique
  //  * per billing cycle. The same merchant order reference should never be
  //  * reused after the first authorised attempt. If used, this field should be
  //  * supplied for all incoming authorisations.
  //  */
  // merchantOrderReference?: string;
  // metadata?: Metadata;
  // /**
  //  * Indicates the type of front end integration. Default is `embedded`.
  //  */
  // mode?: Mode;
  // // mpiData: {};
  // // platformChargebackLogic?: {};
  // recurringExpiry?: string;
  // recurringFrequency?: string;
  // recurringProcessingModel?: string;
  // redirectFromIssuerMethod?: string;
  // redirectToIssuerMethod?: string;
  /**
   * The reference to uniquely identify a payment.
   */
  reference: string;
  /**
   * The URL to return to in case of a redirection. The format depends on the channel.
   */
  returnUrl: string;
  // // riskData?: {};
  // shopperEmail?: string;
  // shopperIP?: string;
  // shopperInteraction?: ShopperInteraction;
  // shopperLocale?: string;
  // // shopperName?: {};
  // /**
  //  * Your reference to uniquely identify this shopper, for example user ID or
  //  * account ID. The value is case-sensitiveand must be at least three
  //  * characters. Min length: 3Max length: 256
  //  */
  // shopperReference?: string;
  // shopperStatement?: string;
  // showInstallmentAmount?: boolean;
  // showRemovePaymentMethodButton?: boolean;
  // socialSecurityNumber?: string;
  // splitCardFundingSources?: boolean;
  // splits?: {}[];
  // /**
  //  * Required for Adyen for Platforms integrations if you are a platform model.
  //  * This is your reference (on balance platform) or the storeReference (in the
  //  * classic integration) for the ecommerce or point-of-sale store that is
  //  * processing the payment.
  //  */
  // store?: string;
  // storeFiltrationMode?: StoreFiltrationMode;
  // storePaymentMethod?: boolean;
  // storePaymentMethodMode?: StorePaymentMethodMode;
  // telephoneNumber?: string;
  // themeId?: string;
  // // threeDS2RequestData?: {};
  // trustedShopper?: boolean;
};

export type CreatePaymentSessionOutput = {
  id: string;
  amount: Amount;
  expiresAt: string;
  merchantAccount: string;
  reference: string;
  returnUrl: string;
  shopperLocale: string;
  mode: string;
  sessionData: string;
};

export async function createPaymentSession(
  client: AdyenClient,
  input: CreatePaymentSessionInput,
): Promise<CreatePaymentSessionOutput> {
  const {idempotencyKey, ...body} = input;
  return await client.post<CreatePaymentSessionOutput>({
    baseUrl: checkoutV71BaseUrl,
    path: 'sessions',
    body,
    idempotencyKey,
  });
}
