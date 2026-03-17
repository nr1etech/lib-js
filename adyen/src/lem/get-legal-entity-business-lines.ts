import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import {Amount} from '../types.js';

export type BusinessLineServiceType =
  | 'paymentProcessing'
  | 'issuing'
  | 'banking';

export type SalesChannel =
  | 'pos'
  | 'posMoto'
  | 'eCommerce'
  | 'ecomMoto'
  | 'payByLink';

export type SourceOfFundsType =
  | 'business'
  | 'employment'
  | 'donations'
  | 'inheritance'
  | 'financialAid'
  | 'rentalIncome'
  | 'dividendIncome'
  | 'royaltyIncome'
  | 'thirdPartyFunding'
  | 'pensionIncome'
  | 'insuranceSettlement'
  | 'cryptocurrencyIncome'
  | 'assetSale'
  | 'loans'
  | 'gamblingWinnings';

export type Financier = {
  amount?: Amount;
  firstName?: string;
  lastName?: string;
  location?: string;
};

export type SourceOfFunds = {
  adyenProcessedFunds?: boolean;
  amount?: Amount;
  assetMonthsHeld?: number;
  cryptocurrencyExchange?: string;
  dateOfFundsReceived?: string;
  dateOfSourceEvent?: string;
  description?: string;
  financiers?: Financier[];
  originatorLegalEntityId?: string;
  purpose?: string;
  relationship?: string;
  type?: SourceOfFundsType;
  website?: string;
};

export type WebData = {
  webAddress?: string;
  webAddressId?: string;
};

export type WebDataExemption = {
  reason?: string;
};

export type VerificationError = {
  capabilities?: string[];
  code?: string;
  message?: string;
  remediatingActions?: Array<{
    code?: string;
    message?: string;
  }>;
  subErrors?: Array<{
    capabilities?: string[];
    code?: string;
    message?: string;
    remediatingActions?: Array<{
      code?: string;
      message?: string;
    }>;
    type?: string;
  }>;
  type?: string;
};

export type BusinessLineProblem = {
  entity?: {
    documents?: string[];
    id?: string;
    type?: string;
  };
  verificationErrors?: VerificationError[];
};

export type BusinessLine = {
  capability?: string;
  id?: string;
  industryCode?: string;
  legalEntityId?: string;
  problems?: BusinessLineProblem[];
  salesChannels?: SalesChannel[];
  service?: BusinessLineServiceType;
  sourceOfFunds?: SourceOfFunds;
  webData?: WebData[];
  webDataExemption?: WebDataExemption;
};

export type GetLegalEntityBusinessLinesOutput = {
  businessLines?: BusinessLine[];
};

export async function getLegalEntityBusinessLines(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.get<GetLegalEntityBusinessLinesOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/businessLines`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/businessLines
