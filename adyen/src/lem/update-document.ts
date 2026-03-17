import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {
  CreateDocumentInput,
  CreateDocumentOutput,
} from './create-document.js';

export type UpdateDocumentInput = Partial<CreateDocumentInput>;

export type UpdateDocumentOutput = CreateDocumentOutput;

export async function updateDocument(
  client: AdyenClient,
  documentId: string,
  input: UpdateDocumentInput,
) {
  return await client.patch<UpdateDocumentOutput>({
    baseUrl: lemV4BaseUrl,
    path: `documents/${documentId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/patch/documents/(id)
