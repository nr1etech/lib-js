import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {VerificationError} from './get-legal-entity-business-lines.js';

export type EntityWithOwner = {
  documents?: string[];
  id?: string;
  owner?: {
    documents?: string[];
    id?: string;
    type?: string;
  };
  type?: string;
};

export type VerificationProblem = {
  entity?: EntityWithOwner;
  verificationErrors?: VerificationError[];
};

export type CheckVerificationErrorsOutput = {
  problems?: VerificationProblem[];
};

export async function checkVerificationErrors(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.post<CheckVerificationErrorsOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/checkVerificationErrors`,
    body: {},
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/legalEntities/(id)/checkVerificationErrors
