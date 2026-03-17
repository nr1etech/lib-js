import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import {
  EntityAssociation,
  EntityType,
  IndividualInput,
  OrganizationInput,
} from './create-legal-entity.js';
import type {GetLegalEntityOutput} from './get-legal-entity.js';

export type UpdateLegalEntityInput = {
  // capabilities?: X;
  entityAssociations?: EntityAssociation[];
  individual?: IndividualInput;
  organization?: OrganizationInput;
  // reference?: string;
  // soleProprietorship?: X;
  // trust?: X;
  type?: EntityType;
  // unincorporatedPartnership: X;
  // verificationPlan: string;
};

export type UpdateLegalEntityOutput = GetLegalEntityOutput;

export async function updateLegalEntity(
  client: AdyenClient,
  legalEntityId: string,
  input: UpdateLegalEntityInput,
) {
  return await client.patch<UpdateLegalEntityOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/patch/legalEntities/(id)
