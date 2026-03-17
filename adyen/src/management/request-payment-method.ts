import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import {PaymentMethodType} from '../types.js';

// maestro_usa
// star

export type TransactionDescriptionType = 'fixed' | 'append' | 'dynamic';

export type TransactionDescription = {
  doingBusinessAsName?: string;
  type?: TransactionDescriptionType;
};

export type AmexServiceLevel =
  | 'noContract'
  | 'gatewayContract'
  | 'paymentDesignatorContract';

export type AmexPaymentMethod = {
  midNumber?: string;
  reuseMidNumber?: boolean;
};

export type ApplePayPaymentMethod = {
  domains: string[];
};

export type ChinaUnionPayPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type DinersServiceLevel = 'noContract' | 'gatewayContract';

export type DinersPaymentMethod = {
  midNumber?: string;
  reuseMidNumber: boolean;
  serviceLevel?: DinersServiceLevel;
  transactionDescription?: TransactionDescription;
};

export type DiscoverPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type GooglePayPaymentMethod = {
  merchantId: string;
  reuseMerchantId?: boolean;
};

export type InteracPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type JcbServiceLevel =
  | 'noContract'
  | 'gatewayContract'
  | 'paymentDesignatorContract';

export type JcbPaymentMethod = {
  midNumber?: string;
  reuseMidNumber?: boolean;
  serviceLevel: JcbServiceLevel;
  transactionDescription?: TransactionDescription;
};

export type MaestroPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type MaestroUsaPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type MasterCardPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type PayByBankPlaidPaymentMethod = {
  logo?: string;
  transactionDescription?: TransactionDescription;
};

export type PayPalPaymentMethod = {
  directCapture?: boolean;
  payerId: string;
  subject: string;
};

export type StarProcessingType = 'pos' | 'billpay' | 'ecom';

export type StarPaymentMethod = {
  processingType: StarProcessingType;
  transactionDescription?: TransactionDescription;
};

export type VisaPaymentMethod = {
  transactionDescription?: TransactionDescription;
};

export type ShopperInteractionType = 'eCommerce' | 'pos' | 'contAuth' | 'noto';

export type RequestPaymentMethodInput = {
  // accel: unknown;
  // affirm: unknown;
  // afterpayTouch: unknown;
  // alipayPlus: unknown;
  amex?: unknown;
  applePay?: ApplePayPaymentMethod;
  // bcmc: unknown;
  businessLineId: string;
  // cartesBancaires: unknown;
  // clearpay: unknown;
  countries?: string[];
  cup?: ChinaUnionPayPaymentMethod;
  currencies?: string[];
  customRoutingFlags?: string[];
  diners?: DinersPaymentMethod;
  discover?: DiscoverPaymentMethod;
  // eft_directdebit_CA: unknown;
  // eftpos_australia: unknown;
  // girocard: unknown;
  // givex: unknown;
  googlePay?: GooglePayPaymentMethod;
  // ideal: unknown;
  interac_card?: InteracPaymentMethod;
  jcb?: JcbPaymentMethod;
  // klarna: unknown;
  maestro?: MaestroPaymentMethod;
  maestro_usa?: MaestroUsaPaymentMethod;
  mc?: MasterCardPaymentMethod;
  // mealVoucher_FR: unknown;
  // nyce: unknown;
  paybybank_plaid?: PayByBankPlaidPaymentMethod;
  // payme: unknown;
  paypal?: PayPalPaymentMethod;
  // payto: unknown;
  // pulse: unknown;
  /**
   * Your reference for the payment method. Supported characters a-z, A-Z, 0-9.
   */
  reference?: string;
  // sepadirectdebit: unknown;

  /**
   * The sales channel. Required if the merchant account does not have a sales
   * channel. When you provide this field, it overrides the default sales
   * channel set on the merchant account.
   */
  shopperInteraction?: ShopperInteractionType;
  // sodexo: unknown;
  star?: StarPaymentMethod;
  /**
   * The unique identifier of the store for which to configure the payment
   * method, if any.
   */
  storeIds?: string[];
  // svs: unknown;
  // swish: unknown;
  // ticket: unknown;
  // twint: unknown;
  type: PaymentMethodType;
  // valuelink: unknown;
  // vipps: unknown;
  visa?: VisaPaymentMethod;
  // wechatpay: unknown;
  // wechatpay_pos: unknown;
};

export type RequestPaymentMethodOutput = RequestPaymentMethodInput & {
  id: string;
};

/**
 * Sends a request to add a new payment method to the merchant account
 * identified in the path.
 *
 * @see https://docs.adyen.com/api-explorer/Management/latest/post/merchants/(merchantId)/paymentMethodSettings
 *
 * @param client
 * @param meerchantId
 * @parma input
 */
export async function requestPaymentMethod(
  client: AdyenClient,
  meerchantId: string,
  input: RequestPaymentMethodInput,
): Promise<RequestPaymentMethodOutput> {
  return await client.post<RequestPaymentMethodOutput>({
    baseUrl: managementV3BaseUrl,
    path: `merchants/${meerchantId}/paymentMethodSettings`,
    body: input,
  });
}
