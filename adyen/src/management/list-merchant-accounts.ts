import {AdyenClient} from '../client.js';
import {managementV3BaseUrl} from './env.js';

export async function listMerchantAccounts(client: AdyenClient) {
  return await client.get({
    baseUrl: managementV3BaseUrl,
    path: 'merchants',
  });
}
