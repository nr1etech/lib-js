import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type CreateSignPciInput = {
  /**
   * The array of Adyen-generated unique identifiers for the questionnaires.
   */
  pciTemplateReferences: string[];
  /**
   * The legal entity ID of the individual who signs the PCI questionnaire.
   */
  signedBy: string;
};

export type CreateSignPciOutput = {
  /**
   * The unique identifiers of the signed PCI documents.
   */
  pciQuestionnaireIds?: string[];
  /**
   * The legal entity ID of the individual who signed the PCI questionnaire.
   */
  signedBy?: string;
};

export async function createSignPci(
  client: AdyenClient,
  legalEntityId: string,
  input: CreateSignPciInput,
) {
  return await client.post<CreateSignPciOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/pciQuestionnaires/signPciTemplates`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/legalEntities/(id)/pciQuestionnaires/signPciTemplates
