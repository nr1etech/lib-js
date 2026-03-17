import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {
  Address,
  Store,
  LocalizedInformation,
  SplitConfiguration,
  SubMerchantData,
} from './get-merchant-store-list.js';

export type CreateStoreInput = {
  address: Address;
  businessLineIds?: string[];
  description: string;
  externalReferenceId?: string;
  localizedInformation?: LocalizedInformation;
  merchantId: string;
  phoneNumber: string;
  reference?: string;
  shopperStatement: string;
  splitConfiguration?: SplitConfiguration;
  subMerchantData?: SubMerchantData;
};

export type CreateStoreOutput = Store;

export async function createStore(
  client: AdyenClient,
  input: CreateStoreInput,
) {
  return await client.post<CreateStoreOutput>({
    baseUrl: managementV3BaseUrl,
    path: 'stores',
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/post/stores
