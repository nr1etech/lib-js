import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {
  Address,
  EntityType,
  OrganizationType,
  Phone,
} from './create-legal-entity.js';

export type Capability = {
  allowed?: boolean;
  allowedLevel?: string;
  allowedSettings?: {
    // TODO: Implement settings structure
    [key: string]: unknown;
  };
  enabled?: boolean;
  problems?: Array<{
    entity?: {
      documents?: string[];
      id?: string;
      owner?: {
        id?: string;
        type?: string;
      };
      type?: string;
    };
    verificationErrors?: Array<{
      code?: string;
      message?: string;
      remediatingActions?: Array<{
        code?: string;
        message?: string;
      }>;
      subErrors?: Array<{
        code?: string;
        message?: string;
        remediatingActions?: Array<{
          code?: string;
          message?: string;
        }>;
      }>;
      type?: string;
    }>;
  }>;
  requested?: boolean;
  requestedLevel?: string;
  requestedSettings?: {
    // TODO: Implement settings structure
    [key: string]: unknown;
  };
  transferInstruments?: Array<{
    id?: string;
    type?: string;
  }>;
  verificationStatus?: string;
};

export type Individual = {
  birthData?: {
    dateOfBirth?: string;
  };
  email?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  phone?: Phone;
  residentialAddress?: Address;
  // TODO: Add more individual fields
};

export type Organization = {
  countryOfGoverningLaw?: string;
  dateOfIncorporation?: string;
  description?: string;
  doingBusinessAs?: string;
  doingBusinessAsAbsent?: boolean;
  email?: string;
  legalName?: string;
  phone?: Phone;
  principalPlaceOfBusiness?: Address;
  registeredAddress?: Address;
  registrationNumber?: string;
  type?: OrganizationType;
  vatNumber?: string;
  // TODO: Add more organization fields
};

export type SoleProprietorship = {
  countryOfGoverningLaw?: string;
  dateOfIncorporation?: string;
  doingBusinessAs?: string;
  legalName?: string;
  name?: {
    firstName?: string;
    lastName?: string;
  };
  principalPlaceOfBusiness?: Address;
  registeredAddress?: Address;
  registrationNumber?: string;
  vatNumber?: string;
  // TODO: Add more sole proprietorship fields
};

export type Trust = {
  countryOfGoverningLaw?: string;
  dateOfIncorporation?: string;
  doingBusinessAs?: string;
  name?: string;
  principalPlaceOfBusiness?: Address;
  registeredAddress?: Address;
  registrationNumber?: string;
  type?: string;
  vatNumber?: string;
  // TODO: Add more trust fields
};

export type UnincorporatedPartnership = {
  countryOfGoverningLaw?: string;
  dateOfIncorporation?: string;
  doingBusinessAs?: string;
  name?: string;
  principalPlaceOfBusiness?: Address;
  registeredAddress?: Address;
  registrationNumber?: string;
  type?: string;
  vatNumber?: string;
  // TODO: Add more partnership fields
};

export type VerificationDeadline = {
  capabilities?: string[];
  entityIds?: string[];
  expiresAt?: string;
};

export type GetLegalEntityOutput = {
  id: string;
  type: EntityType;
  capabilities?: {
    [key: string]: Capability;
  };
  entityAssociations?: Array<{
    associatorId?: string;
    entityId?: string;
    jobTitle?: string;
    legalEntityId?: string;
    name?: string;
    type?: string;
  }>;
  individual?: Individual;
  organization?: Organization;
  problems?: Array<{
    entity?: {
      documents?: string[];
      id?: string;
      owner?: {
        id?: string;
        type?: string;
      };
      type?: string;
    };
    verificationErrors?: Array<{
      code?: string;
      message?: string;
      remediatingActions?: Array<{
        code?: string;
        message?: string;
      }>;
      subErrors?: Array<{
        code?: string;
        message?: string;
        remediatingActions?: Array<{
          code?: string;
          message?: string;
        }>;
      }>;
      type?: string;
    }>;
  }>;
  reference?: string;
  soleProprietorship?: SoleProprietorship;
  transferInstruments?: Array<{
    id?: string;
    type?: string;
  }>;
  trust?: Trust;
  unincorporatedPartnership?: UnincorporatedPartnership;
  verificationDeadlines?: VerificationDeadline[];
  verificationPlan?: string;
};

export async function getLegalEntity(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.get<GetLegalEntityOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)
