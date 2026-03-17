import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {Store} from './get-merchant-store-list.js';

export type GetStoreOutput = Store;

export async function getStore(client: AdyenClient, storeId: string) {
  return await client.get<GetStoreOutput>({
    baseUrl: managementV3BaseUrl,
    path: `stores/${storeId}`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/get/stores/(storeId)
