import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {VerificationError} from './get-legal-entity-business-lines.js';
import type {EntityWithOwner} from './check-verification-errors.js';

export type BankAccountIdentification = {
  type: string;
  accountNumber?: string;
  accountType?: string;
  routingNumber?: string;
  // TODO: Add other account identification types (IBAN, etc.)
  [key: string]: unknown;
};

export type BankAccount = {
  accountIdentification?: BankAccountIdentification;
  accountType?: string;
  bankName?: string;
  countryCode?: string;
  trustedSource?: boolean;
};

export type TransferInstrumentCapability = {
  allowed?: boolean;
  id?: string;
  requested?: boolean;
  verificationStatus?: 'pending' | 'invalid' | 'valid' | 'rejected';
};

export type DocumentPage = {
  pageName?: string;
  pageNumber?: number;
  type?: string;
};

export type DocumentDetail = {
  active?: boolean;
  description?: string;
  fileName?: string;
  id?: string;
  modificationDate?: string;
  pages?: DocumentPage[];
  type?: string;
};

export type TransferInstrumentProblem = {
  entity?: EntityWithOwner;
  verificationErrors?: VerificationError[];
};

export type GetTransferInstrumentOutput = {
  bankAccount?: BankAccount;
  capabilities?: {
    [key: string]: TransferInstrumentCapability;
  };
  documentDetails?: DocumentDetail[];
  id?: string;
  legalEntityId?: string;
  problems?: TransferInstrumentProblem[];
  type?: string;
};

export async function getTransferInstrument(
  client: AdyenClient,
  transferInstrumentId: string,
) {
  return await client.get<GetTransferInstrumentOutput>({
    baseUrl: lemV4BaseUrl,
    path: `transferInstruments/${transferInstrumentId}`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/transferInstruments/(id)
