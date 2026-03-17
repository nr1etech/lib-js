import {AdyenClient} from '../client.js';
import {bclV2BaseUrl} from './env.js';
import {Metadata} from '../types.js';

export type RequestedLevel = 'notApplicable' | 'low' | 'medium' | 'high';

/**
 * Every account holder has a list of capabilities that determine what they can do on your marketplace.
 *
 * @see https://docs.adyen.com/marketplaces/verification-overview/capabilities
 */
export type Capability =
  | 'receiveFromBalanceAccount'
  | 'receiveFromTransferInstrument'
  | 'receiveFromPlatformPayments'
  | 'sendToBalanceAccount'
  | 'sendToTransferInstrument'
  // Financial product capabilities
  | 'issueBankAccount'
  | 'receiveFromThirdParty'
  | 'sendToThirdParty';

export type CapabilityInput = {
  /**
   * Indicates whether the capability is enabled. If false, the capability is temporarily disabled for the
   * account holder.
   */
  enabled?: boolean;
  /**
   * Indicates whether the capability is requested. To check whether the account holder is permitted to use the
   * capability, refer to the allowed field.
   */
  requested?: boolean;
  /**
   * The requested level of the capability. Some capabilities, such as those used in card issuing, have different
   * levels. Levels increase the capability, but also require additional checks and increased monitoring.
   */
  requestedLevel?: RequestedLevel;
};

export type CreateAccountHolderInput = {
  legalEntityId: string;
  /**
   * Required in the request if your API credentials can be used for multiple balance platforms.
   */
  balancePlatform?: string;
  /**
   * Contains key-value pairs that specify the actions that an account holder can do in your platform. The key is a
   * capability required for your integration. For example, issueCard for Issuing. The value is an object containing
   * the settings for the capability.
   */
  capabilities?: Record<Capability, CapabilityInput>;
  /**
   * Your description for the account holder.
   */
  description?: string;

  /**
   * A set of key and value pairs for general use. The keys do not have specific names and may be used for storing
   * miscellaneous data as desired.
   */
  metadata?: Metadata;
  /**
   * Your reference for the account holder.
   */
  reference?: string;

  /**
   * The time zone of the account holder. For example, Europe/Amsterdam. Defaults to the time zone of the balance
   * platform if no time zone is set.
   *
   * @see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timeZone?: string;
};

export type EntityType = 'LegalEntity' | 'BankAccount' | 'Document';

export type AmountOutput = {
  currency: string;
  value: number;
};

export type AllowedSettingsOutput = {
  amountPerIndustry: AmountOutput;
  authorizedCardUsers: boolean;
  fundingSource: string[];
  interval: string;
  maxAmount: AmountOutput;
};

export type OwnerType = 'LegalEntity' | 'BankAccount' | 'Document';

export type OwnerOutput = {
  documents: string[];
  id: string;
  type: OwnerType;
};

export type EntityOutput = {
  documents: string[];
  id: string;
  owner: OwnerOutput;
  type: EntityType;
};

export type RemediatingActionOutput = {
  code: string;
  message: string;
};

export type ErrorType =
  | 'invalidInput'
  | 'dataMissing'
  | 'pendingStatus'
  | 'dataReview';

export type SubErrorOutput = {
  capabilities: string[];
  code: string;
  message: string;
  type: ErrorType;
  remediatingActions: RemediatingActionOutput[];
};

export type VerificationErrorOutput = {
  capabilities: string[];
  code: string;
  message: string;
  remediatingActions: RemediatingActionOutput[];
  subErrors: SubErrorOutput[];
  type: ErrorType;
};

export type ProblemOutput = {
  entity: EntityOutput;
  verificationErrors: VerificationErrorOutput[];
};

export type RequestedSettingsOutput = {
  amountPerIndustry: AmountOutput;
  authorizedCardUsers: boolean;
  fundingSource: string[];
  interval: string;
  maxAmount: AmountOutput;
};

export type TransferInstrumentOutput = {
  allowed: boolean;
  allowedLevel: RequestedLevel;
  enabled: boolean;
  id: string;
  requested: boolean;
  requestedLevel: RequestedLevel;
  verificationStatus: string;
};

export type CapabilityOutput = {
  allowed: boolean;
  allowedLevel: RequestedLevel;
  allowedSettings: AllowedSettingsOutput;
  enabled: boolean;
  problems: ProblemOutput[];
  requested: boolean;
  requestedLevel: RequestedLevel;
  requestedSettings: RequestedSettingsOutput;
  transferInstruments: TransferInstrumentOutput[];
  verificationStatus: string;
};

export type AccountHolderStatus = 'active' | 'suspended' | 'closed';

export type VerificationDeadlinesOutput = {
  capabilities: string[];
  entityIds: string[];
  expiresAt: string;
};

export type CreateAccountHolderOutput = {
  balancePlatform: string;
  capabilities: Record<Capability, CapabilityOutput>;
  description: string;
  id: string;
  legalEntityId: string;
  metadata: Metadata;
  migratedAccountHolderCode: string;
  primaryBalanceAccount: string;
  reference: string;
  status: AccountHolderStatus;
  timeZone: string;
  verificationDeadlines: VerificationDeadlinesOutput[];
};

/**
 * Create an account holder.
 *
 * @see https://docs.adyen.com/api-explorer/balanceplatform/2/post/accountHolders
 *
 * @param client
 * @param input
 */
export async function createAccountHolder(
  client: AdyenClient,
  input: CreateAccountHolderInput,
): Promise<CreateAccountHolderOutput> {
  return await client.post<CreateAccountHolderOutput>({
    baseUrl: bclV2BaseUrl,
    path: 'accountHolders',
    body: input,
  });
}
