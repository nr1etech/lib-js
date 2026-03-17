import {AdyenClient} from '../client.js';
import {Metadata} from '../types.js';
import {bclV2BaseUrl} from './env.js';

export type PlatformPaymentConfiguration = {
  salesDayClosingTime?: string;
  settlementDelayDays?: number;
};

export type CreateBalanceAccountInput = {
  accountHolderId: string;
  defaultCurrencyCode?: string;
  description?: string;
  metadata?: Metadata;
  platformPaymentConfiguration?: unknown;
  reference?: string;
  timeZone?: string;
};

export type Balance = {
  available: number;
  balance: number;
  currency: string;
  pending: number;
  reserved: number;
};

export type CreateBalanceAccountOutput = {
  accountHolderId: string;
  balances: Balance[];
  defaultCurrencyCode: string;
  description: string;
  id: string;
  metadata: Metadata;
  migratedAccountCode: string;
  platformPaymentConfiguration: PlatformPaymentConfiguration;
  reference: string;
  status: string;
  timeZone: string;
};

export async function createBalanceAccount(
  client: AdyenClient,
  input: CreateBalanceAccountInput,
): Promise<CreateBalanceAccountOutput> {
  return await client.post<CreateBalanceAccountOutput>({
    baseUrl: bclV2BaseUrl,
    path: `balanceAccounts`,
    body: input,
  });
}
