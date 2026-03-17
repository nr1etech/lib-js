import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export async function deleteBusinessLine(
  client: AdyenClient,
  businessLineId: string,
): Promise<void> {
  return await client.delete({
    baseUrl: lemV4BaseUrl,
    path: `businessLines/${businessLineId}`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/3/delete/businessLines/(id)
