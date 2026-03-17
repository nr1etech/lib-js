import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {TermsOfServiceType} from './create-terms-of-service.js';

export type TermsOfServiceAcceptanceInfo = {
  /**
   * The unique identifier of the user that accepted the Terms of Service.
   */
  acceptedBy?: string;
  /**
   * The unique identifier of the legal entity for which the Terms of Service are accepted.
   */
  acceptedFor?: string;
  /**
   * The date when the Terms of Service were accepted, in ISO 8601 extended format.
   * For example, 2022-12-18T10:15:30+01:00.
   */
  createdAt?: string;
  /**
   * An Adyen-generated reference for the accepted Terms of Service.
   */
  id?: string;
  /**
   * The type of Terms of Service.
   */
  type?: TermsOfServiceType;
  /**
   * The expiration date for the Terms of Service acceptance, in ISO 8601 extended format.
   * For example, 2022-12-18T00:00:00+01:00.
   */
  validTo?: string;
};

export type GetTermsOfServiceInfoOutput = {
  /**
   * The Terms of Service acceptance information.
   */
  data?: TermsOfServiceAcceptanceInfo[];
};

export async function getTermsOfServiceInfo(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.get<GetTermsOfServiceInfoOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/termsOfServiceAcceptanceInfos`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/termsOfServiceAcceptanceInfos
