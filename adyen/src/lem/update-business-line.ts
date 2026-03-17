import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {CreateBusinessLineInput} from './create-business-line.js';
import type {GetBusinessLinesOutput} from './get-business-lines.js';

export type UpdateBusinessLineInput = Partial<
  Omit<CreateBusinessLineInput, 'legalEntityId'>
>;

export type UpdateBusinessLineOutput = GetBusinessLinesOutput;

export async function updateBusinessLine(
  client: AdyenClient,
  businessLineId: string,
  input: UpdateBusinessLineInput,
) {
  return await client.patch<UpdateBusinessLineOutput>({
    baseUrl: lemV4BaseUrl,
    path: `businessLines/${businessLineId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/3/patch/businessLines/(id)
