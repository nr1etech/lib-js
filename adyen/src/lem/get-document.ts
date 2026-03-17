import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {CreateDocumentOutput} from './create-document.js';

export type GetDocumentOutput = CreateDocumentOutput;

export type GetDocumentOptions = {
  /**
   * Do not load document content while fetching the document.
   */
  skipContent?: boolean;
};

export async function getDocument(
  client: AdyenClient,
  documentId: string,
  options?: GetDocumentOptions,
) {
  let path = `documents/${documentId}`;
  if (options?.skipContent) {
    path += '?skipContent=true';
  }
  return await client.get<GetDocumentOutput>({
    baseUrl: lemV4BaseUrl,
    path,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/documents/(id)
