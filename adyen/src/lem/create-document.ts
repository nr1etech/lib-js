import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type DocumentPageType = 'front' | 'back';

export type DocumentAttachment = {
  /**
   * The document in Base64-encoded string format.
   */
  content: string;
  /**
   * @deprecated Use pageName instead
   */
  contentType?: 'application/pdf' | 'image/jpg' | 'image/jpeg' | 'image/png';
  /**
   * @deprecated Use pageName instead
   */
  filename?: string;
  /**
   * The name of the file including the file extension.
   */
  pageName?: string;
  /**
   * Specifies which side of the ID card is uploaded.
   * Required for driversLicense or identityCard types.
   */
  pageType?: DocumentPageType;
};

export type DocumentOwnerType = 'legalEntity' | 'bankAccount';

export type DocumentOwner = {
  /**
   * Unique identifier of the resource that owns the document.
   * For type legalEntity: legal entity ID
   * For type bankAccount: transfer instrument ID
   */
  id: string;
  /**
   * Type of resource that owns the document.
   */
  type: DocumentOwnerType;
};

export type OrganizationDocumentType =
  | 'proofOfAddress'
  | 'registrationDocument'
  | 'vatDocument'
  | 'proofOfOrganizationTaxInfo'
  | 'proofOfOwnership'
  | 'proofOfIndustry'
  | 'proofOfSignatory'
  | 'proofOfDirector'
  | 'proofOfFundingOrWealthSource';

export type IndividualDocumentType =
  | 'identityCard'
  | 'driversLicense'
  | 'passport'
  | 'liveSelfie'
  | 'proofOfNationalIdNumber'
  | 'proofOfResidency'
  | 'proofOfIndustry'
  | 'proofOfIndividualTaxId'
  | 'proofOfFundingOrWealthSource'
  | 'proofOfRelationship';

export type SoleProprietorshipDocumentType =
  | 'constitutionalDocument'
  | 'proofOfAddress'
  | 'proofOfIndustry';

export type TrustDocumentType = 'constitutionalDocument';

export type UnincorporatedPartnershipDocumentType = 'constitutionalDocument';

export type BankAccountDocumentType = 'bankStatement';

export type DocumentType =
  | OrganizationDocumentType
  | IndividualDocumentType
  | SoleProprietorshipDocumentType
  | TrustDocumentType
  | UnincorporatedPartnershipDocumentType
  | BankAccountDocumentType;

export type CreateDocumentInput = {
  /**
   * @deprecated Use attachments array instead
   */
  attachment?: DocumentAttachment;
  /**
   * Array that contains the document. Supports multiple attachments for different sides/pages.
   */
  attachments?: DocumentAttachment[];
  /**
   * Your description for the document.
   */
  description: string;
  /**
   * @deprecated
   * The expiry date of the document, in YYYY-MM-DD format.
   */
  expiryDate?: string;
  /**
   * The filename of the document.
   */
  fileName?: string;
  /**
   * @deprecated
   * The two-character ISO 3166-1 alpha-2 country code where the document was issued.
   */
  issuerCountry?: string;
  /**
   * @deprecated
   * The state or province where the document was issued (AU only).
   */
  issuerState?: string;
  /**
   * The number in the document.
   */
  number?: string;
  /**
   * Contains information about the resource that owns the document.
   */
  owner: DocumentOwner;
  /**
   * Type of document.
   */
  type: DocumentType;
};

export type CreateDocumentOutput = {
  /**
   * @deprecated Use attachments array instead
   */
  attachment?: DocumentAttachment;
  attachments?: DocumentAttachment[];
  creationDate?: string;
  description?: string;
  /**
   * @deprecated
   */
  expiryDate?: string;
  fileName?: string;
  id?: string;
  /**
   * @deprecated
   */
  issuerCountry?: string;
  /**
   * @deprecated
   */
  issuerState?: string;
  modificationDate?: string;
  number?: string;
  owner?: DocumentOwner;
  type?: DocumentType;
};

export async function createDocument(
  client: AdyenClient,
  input: CreateDocumentInput,
) {
  return await client.post<CreateDocumentOutput>({
    baseUrl: lemV4BaseUrl,
    path: 'documents',
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/documents
