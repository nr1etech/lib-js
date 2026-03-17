import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {CreateStoreInput} from './create-store.js';
import type {GetStoreOutput} from './get-store.js';

export type UpdateStoreInput = Partial<Omit<CreateStoreInput, 'merchantId'>>;

export type UpdateStoreOutput = GetStoreOutput;

export async function updateStore(
  client: AdyenClient,
  storeId: string,
  input: UpdateStoreInput,
) {
  return await client.patch<UpdateStoreOutput>({
    baseUrl: managementV3BaseUrl,
    path: `stores/${storeId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/patch/stores/(storeId)
