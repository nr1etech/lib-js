import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type PciSalesChannel = 'eCommerce' | 'pos' | 'ecomMoto' | 'posMoto';

export type CreateGeneratePciInput = {
  /**
   * An array of additional sales channels to generate PCI questionnaires.
   * Include the relevant sales channels if you need your user to sign PCI questionnaires.
   * Not required if you create stores and add payment methods before you generate the questionnaires.
   */
  additionalSalesChannels?: PciSalesChannel[];
  /**
   * Sets the language of the PCI questionnaire.
   * Its value is a two-character ISO 639-1 language code, for example, **en**.
   */
  language?: string;
};

export type CreateGeneratePciOutput = {
  /**
   * The generated questionnaires in a base64 encoded format.
   */
  content?: string;
  /**
   * The two-letter ISO-639-1 language code for the questionnaire.
   * For example, **en**.
   */
  language?: string;
  /**
   * The array of Adyen-generated unique identifiers for the questionnaires.
   * If empty, the user is not required to sign questionnaires.
   */
  pciTemplateReferences?: string[];
};

export async function createGeneratePci(
  client: AdyenClient,
  legalEntityId: string,
  input?: CreateGeneratePciInput,
) {
  return await client.post<CreateGeneratePciOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/pciQuestionnaires/generatePciTemplates`,
    body: input || {},
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/legalEntities/(id)/pciQuestionnaires/generatePciTemplates
