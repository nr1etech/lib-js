import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type TermsOfServiceLanguage = 'en' | 'fr';

export type TermsOfServiceDocumentFormat = 'JSON' | 'PDF' | 'TXT';

export type TermsOfServiceType =
  | 'adyenForPlatformsManage'
  | 'adyenIssuing'
  | 'adyenForPlatformsAdvanced'
  | 'adyenCapital'
  | 'adyenAccount'
  | 'adyenCard'
  | 'adyenFranchisee'
  | 'adyenPccr'
  | 'adyenChargeCard'
  | 'kycOnInvite';

export type CreateTermsOfServiceInput = {
  /**
   * The language to be used for the Terms of Service document.
   * Specified by the two-letter ISO 639-1 language code.
   */
  language: TermsOfServiceLanguage;
  /**
   * The requested format for the Terms of Service document.
   * Default value: JSON.
   */
  termsOfServiceDocumentFormat?: TermsOfServiceDocumentFormat;
  /**
   * The type of Terms of Service.
   */
  type: TermsOfServiceType;
};

export type CreateTermsOfServiceOutput = {
  /**
   * The Terms of Service document in Base64-encoded format.
   */
  document?: string;
  /**
   * The unique identifier of the legal entity.
   */
  id?: string;
  /**
   * The language used for the Terms of Service document.
   */
  language?: TermsOfServiceLanguage;
  /**
   * The format of the Terms of Service document.
   */
  termsOfServiceDocumentFormat?: TermsOfServiceDocumentFormat;
  /**
   * The unique identifier of the Terms of Service document.
   */
  termsOfServiceDocumentId?: string;
  /**
   * The type of Terms of Service.
   */
  type?: TermsOfServiceType;
};

export async function createTermsOfService(
  client: AdyenClient,
  legalEntityId: string,
  input: CreateTermsOfServiceInput,
) {
  return await client.post<CreateTermsOfServiceOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/termsOfService`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/legalEntities/(id)/termsOfService
