import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {TermsOfServiceDocumentFormat} from './create-terms-of-service.js';

export type GetTermsOfServiceDocumentOptions = {
  /**
   * The format of the Terms of Service document.
   * Possible values: JSON, PDF, or TXT
   */
  termsOfServiceDocumentFormat?: TermsOfServiceDocumentFormat;
};

export type GetTermsOfServiceDocumentOutput = {
  /**
   * The accepted Terms of Service document in the requested format
   * represented as a Base64-encoded bytes array.
   */
  document?: string;
  /**
   * The unique identifier of the legal entity.
   */
  id?: string;
  /**
   * An Adyen-generated reference for the accepted Terms of Service.
   */
  termsOfServiceAcceptanceReference?: string;
  /**
   * The format of the Terms of Service document.
   */
  termsOfServiceDocumentFormat?: TermsOfServiceDocumentFormat;
};

export async function getTermsOfServiceDocument(
  client: AdyenClient,
  legalEntityId: string,
  termsOfServiceAcceptanceReference: string,
  options?: GetTermsOfServiceDocumentOptions,
) {
  let path = `legalEntities/${legalEntityId}/acceptedTermsOfServiceDocument/${termsOfServiceAcceptanceReference}`;
  if (options?.termsOfServiceDocumentFormat) {
    path += `?termsOfServiceDocumentFormat=${options.termsOfServiceDocumentFormat}`;
  }
  return await client.get<GetTermsOfServiceDocumentOutput>({
    baseUrl: lemV4BaseUrl,
    path,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/acceptedTermsOfServiceDocument/(termsofserviceacceptancereference)
