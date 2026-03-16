import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {CreateMerchantStoreInput} from './create-merchant-store.js';
import type {GetMerchantStoreOutput} from './get-merchant-store.js';

export type UpdateMerchantStoreInput = Partial<CreateMerchantStoreInput>;

export type UpdateMerchantStoreOutput = GetMerchantStoreOutput;

export async function updateMerchantStore(
  client: AdyenClient,
  merchantId: string,
  storeId: string,
  input: UpdateMerchantStoreInput,
) {
  return await client.patch<UpdateMerchantStoreOutput>({
    baseUrl: managementV3BaseUrl,
    path: `merchants/${merchantId}/stores/${storeId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/patch/merchants/(merchantId)/stores/(storeId)
