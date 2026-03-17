import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';

export type Address = {
  city?: string;
  country: string;
  line1?: string;
  line2?: string;
  line3?: string;
  postalCode?: string;
  stateOrProvince?: string;
};

export type StoreStatus = 'active' | 'inactive' | 'closed';

export type LocalShopperStatement = {
  script?: string;
  value?: string;
};

export type LocalizedInformation = {
  localShopperStatement?: LocalShopperStatement[];
};

export type SplitConfiguration = {
  balanceAccountId?: string;
  splitConfigurationId?: string;
};

export type SubMerchantData = {
  email?: string;
  id?: string;
  mcc?: string;
  name?: string;
};

export type Store = {
  address?: Address;
  businessLineIds?: string[];
  description?: string;
  externalReferenceId?: string;
  id?: string;
  localizedInformation?: LocalizedInformation;
  merchantId?: string;
  phoneNumber?: string;
  reference?: string;
  shopperStatement?: string;
  splitConfiguration?: SplitConfiguration;
  status?: StoreStatus;
  subMerchantData?: SubMerchantData;
};

export type GetMerchantStoreListOutput = {
  data?: Store[];
  itemsTotal?: number;
  pagesTotal?: number;
};

export type GetMerchantStoreListOptions = {
  pageNumber?: number;
  pageSize?: number;
  reference?: string;
};

export async function getMerchantStoreList(
  client: AdyenClient,
  merchantId: string,
  options?: GetMerchantStoreListOptions,
) {
  let path = `merchants/${merchantId}/stores`;
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
  return await client.get<GetMerchantStoreListOutput>({
    baseUrl: managementV3BaseUrl,
    path,
  });
}

// Reference: https://docs.adyen.com/api-explorer/Management/3/get/merchants/(merchantId)/stores
