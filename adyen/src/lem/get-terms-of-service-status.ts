import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {TermsOfServiceType} from './create-terms-of-service.js';

export type GetTermsOfServiceStatusOutput = {
  /**
   * The type of Terms of Service that the legal entity needs to accept.
   * If empty, no Terms of Service needs to be accepted.
   */
  termsOfServiceTypes?: TermsOfServiceType[];
};

export async function getTermsOfServiceStatus(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.get<GetTermsOfServiceStatusOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/termsOfServiceStatus`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/termsOfServiceStatus
