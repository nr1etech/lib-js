import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';
import type {Store} from './get-merchant-store-list.js';

export type GetStoreListOutput = {
  data?: Store[];
  itemsTotal?: number;
  pagesTotal?: number;
};

export type GetStoreListOptions = {
  pageNumber?: number;
  pageSize?: number;
  reference?: string;
};

export async function getStoreList(
  client: AdyenClient,
  options?: GetStoreListOptions,
) {
  let path = 'stores';
  const queryParams: string[] = [];
  if (options?.pageNumber !== undefined) {
    queryParams.push(`pageNumber=${options.pageNumber}`);
  }
  if (options?.pageSize !== undefined) {
    queryParams.push(`pageSize=${options.pageSize}`);
  }
  if (options?.reference) {
    queryParams.push(`reference=${encodeURIComponent(options.reference)}`);
  }
  if (queryParams.length > 0) {
    path += `?${queryParams.join('&')}`;
  }
  return await client.get<GetStoreListOutput>({
    baseUrl: managementV3BaseUrl,
    path,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/get/stores
