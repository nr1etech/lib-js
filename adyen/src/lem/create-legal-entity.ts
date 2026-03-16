import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type EntityType =
  | 'individual'
  | 'organization'
  | 'soleProprietorship'
  | 'trust';

export type OrganizationType =
  | 'associationIncorporated'
  | 'governmentalOrganization'
  | 'listedPublicCompany'
  | 'nonProfit'
  | 'partnershipIncorporated'
  | 'privateCompany';

export type PhoneType = 'mobile' | 'landline' | 'sip' | 'fax';

export type Phone = {
  number: string;
  type?: PhoneType;
};

export type Address = {
  city?: string;
  /**
   * The two-letter ISO 3166-1 alpha-2 country code.
   */
  country: string;
  postalCode?: string;
  stateOrProvince?: string;
  street?: string;
  street2?: string;
};

export type OrganizationInput = {
  /**
   * The two-character ISO 3166-1 alpha-2 country code of the governing country.
   */
  countryOfGoverningLaw?: string;
  /**
   * The date when the organization was incorporated in YYYY-MM-DD format.
   */
  dateOfIncorporation?: string;
  /**
   *
   */
  dateOfInitiationOfLegalProceeding?: string;
  description?: string;
  doingBusinessAs?: string;
  doingBusinessAsAbsent?: boolean;
  economicSector?: string;
  email?: string;
  // financialReports?: X;
  globalLegalEntityIdentifier?: string;
  headOfficeIndicator?: boolean;
  institutionalSector?: string;
  legalForm?: string;
  legalName: string;
  phone?: Phone;
  principalPlaceOfBusiness?: Address;
  registeredAddress: Address;
  registrationNumber?: string;
  registrationNumberAbsent?: boolean;
  statusOfLegalProceeding?: string;
  // stockData: X;
  // support: X;
  taxInformation?: TaxInformation[];
  // taxReportingClassification: X;
  type?: OrganizationType;
  // vatAbsenceReason: X;
  vatNumber?: string;
};

export type BirthData = {
  /**
   * The individual's date of birth, in YYYY-MM-DD format.
   */
  dateOfBirth?: string;
};

export type IdentificationDataType =
  | 'driversLicense'
  | 'passport'
  | 'nationalIdNumber';

export type IdentificationData = {
  cardNumber?: string;
  expiryDate?: string;
  issuerState?: string;
  nationalIdExempt?: boolean;
  number?: string;
  type: IdentificationDataType;
};

export type Name = {
  firstName?: string;
  infix?: string;
  lastName?: string;
};

export type TaxInformationType = 'SSN' | 'EIN' | 'ITIN';

export type TaxInformation = {
  country: string;
  number: string;
  type: TaxInformationType;
};

export type IndividualInput = {
  birthData?: BirthData;
  email?: string;
  identificationData?: IdentificationData;
  name: Name;
  nationality?: string;
  phone?: Phone;
  residentialAddress: Address;
  taxInformation?: TaxInformation[];
};

export type EntityRelationship = 'parent' | 'guardian';

export type EntityAssociationType =
  | 'legalRepresentative'
  | 'partner'
  | 'shareholder'
  | 'director'
  | 'signatory'
  | 'trustOwnership'
  | 'uboThroughOwnership'
  | 'uboThroughControl'
  | 'ultimateParentCompany'
  | 'soleProprietorship'
  | 'trust'
  | 'definedBeneficiary'
  | 'protector'
  | 'secondaryTrustee'
  | 'settlor';

export type EntityAssociation = {
  /**
   * The individual's job title if the type is uboThroughControl or signatory.
   */
  jobTitle?: string;
  /**
   * The unique identifier of the associated legal entity.
   */
  legalEntityId: string;
  /**
   * Default value: false Set to true if the entity association type director,
   * secondaryPartner or shareholder is also a nominee. Only applicable to
   * New Zealand.
   */
  nominee?: boolean;
  /**
   * The individual's relationship to a legal representative if the type is
   * legalRepresentative. Possible values: parent, guardian.
   */
  relationship?: EntityRelationship;
  /**
   * Defines the KYC exemption reason for a settlor associated with a trust. Only applicable to trusts in Australia.
   */
  settlorExemptionReason?: string;
  /**
   * Defines the relationship of the legal entity to the current legal entity.
   */
  type: EntityAssociationType;
};

export type CreateLegalEntityInput = {
  // capabilities?: X;
  entityAssociations?: EntityAssociation[];
  individual?: IndividualInput;
  organization?: OrganizationInput;
  // reference?: string;
  // soleProprietorship?: X;
  // trust?: X;
  type: EntityType;
  // unincorporatedPartnership: X;
  // verificationPlan: string;
};

export type CreateLegalEntityOutput = {
  replaceme?: unknown;
  // TODO Impement me!
};

export async function createLegalEntity(
  client: AdyenClient,
  input: CreateLegalEntityInput,
) {
  return await client.post<CreateLegalEntityOutput>({
    baseUrl: lemV4BaseUrl,
    path: 'legalEntities',
    body: input,
  });
}

// TODO Need to consult https://docs.adyen.com/marketplaces/onboard-users/onboarding-steps?onboarding_type=custom&location=us&legal_entity=organization
