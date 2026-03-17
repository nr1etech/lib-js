import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {
  Address,
  Store,
  LocalizedInformation,
  SplitConfiguration,
  SubMerchantData,
} from './get-merchant-store-list.js';

export type CreateMerchantStoreInput = {
  address?: Address;
  businessLineIds?: string[];
  description?: string;
  externalReferenceId?: string;
  localizedInformation?: LocalizedInformation;
  phoneNumber?: string;
  reference?: string;
  shopperStatement?: string;
  splitConfiguration?: SplitConfiguration;
  subMerchantData?: SubMerchantData;
};

export type CreateMerchantStoreOutput = Store;

export async function createMerchantStore(
  client: AdyenClient,
  merchantId: string,
  input: CreateMerchantStoreInput,
) {
  return await client.post<CreateMerchantStoreOutput>({
    baseUrl: managementV3BaseUrl,
    path: `merchants/${merchantId}/stores`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/post/merchants/(merchantId)/stores
