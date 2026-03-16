import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {
  BusinessLine,
  BusinessLineServiceType,
  SalesChannel,
  SourceOfFunds,
  WebData,
  WebDataExemption,
} from './get-legal-entity-business-lines.js';

export type CreateBusinessLineInput = {
  /**
   * A code that represents the industry of the legal entity for marketplaces or platforms.
   * For example, **4431A** for computer software stores.
   */
  industryCode?: string;
  /**
   * Unique identifier of the legal entity that owns the business line.
   */
  legalEntityId: string;
  /**
   * A list of channels where goods or services are sold.
   * Required only in combination with the service **paymentProcessing**.
   */
  salesChannels?: SalesChannel[];
  /**
   * The service for which you are creating the business line.
   * Possible values: **paymentProcessing**, **banking**
   */
  service: BusinessLineServiceType;
  /**
   * Contains information about the source of your user's funds.
   * Required only for the service **banking**.
   */
  sourceOfFunds?: SourceOfFunds;
  /**
   * List of website URLs where your user's goods or services are sold.
   * When this is required for a service but your user does not have an online presence,
   * provide the reason in the webDataExemption object.
   */
  webData?: WebData[];
  /**
   * The reason why the web data is not provided.
   */
  webDataExemption?: WebDataExemption;
};

export type CreateBusinessLinesOutput = BusinessLine;

export async function createBusinessLine(
  client: AdyenClient,
  input: CreateBusinessLineInput,
) {
  return await client.post<CreateBusinessLinesOutput>({
    baseUrl: lemV4BaseUrl,
    path: 'businessLines',
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/3/post/businessLines
