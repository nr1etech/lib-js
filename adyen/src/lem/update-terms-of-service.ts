import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {
  TermsOfServiceLanguage,
  TermsOfServiceType,
} from './create-terms-of-service.js';

export type UpdateTermsOfServiceInput = {
  /**
   * The legal entity ID of the user accepting the Terms of Service.
   * - For organizations: individual legal entity ID of an authorized signatory
   * - For sole proprietorships: individual legal entity ID of the owner
   * - For individuals: individual legal entity ID of the individual, parent, or guardian
   */
  acceptedBy: string;
  /**
   * The IP address of the user accepting the Terms of Service.
   */
  ipAddress?: string;
};

export type UpdateTermsOfServiceOutput = {
  /**
   * The unique identifier of the user that accepted the Terms of Service.
   */
  acceptedBy?: string;
  /**
   * The unique identifier of the Terms of Service acceptance.
   */
  id?: string;
  /**
   * The IP address of the user that accepted the Terms of Service.
   */
  ipAddress?: string;
  /**
   * The language used for the Terms of Service document.
   */
  language?: TermsOfServiceLanguage;
  /**
   * The unique identifier of the Terms of Service document.
   */
  termsOfServiceDocumentId?: string;
  /**
   * The type of Terms of Service.
   */
  type?: TermsOfServiceType;
};

export async function updateTermsOfService(
  client: AdyenClient,
  legalEntityId: string,
  termsOfServiceDocumentId: string,
  input: UpdateTermsOfServiceInput,
) {
  return await client.patch<UpdateTermsOfServiceOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/termsOfService/${termsOfServiceDocumentId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/patch/legalEntities/(id)/termsOfService/(termsofservicedocumentid)
