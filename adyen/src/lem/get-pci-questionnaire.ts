import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type PciQuestionnaireInfo = {
  /**
   * The date the questionnaire was created, in ISO 8601 extended format.
   * For example, 2022-12-18T10:15:30+01:00
   */
  createdAt?: string;
  /**
   * The unique identifier of the signed questionnaire.
   */
  id?: string;
  /**
   * The expiration date of the questionnaire, in ISO 8601 extended format.
   * For example, 2022-12-18T10:15:30+01:00
   */
  validUntil?: string;
};

export type GetPciQuestionnaireOutput = {
  /**
   * Information about the signed PCI questionnaires.
   */
  data?: PciQuestionnaireInfo[];
};

export async function getPciQuestionnaire(
  client: AdyenClient,
  legalEntityId: string,
) {
  return await client.get<GetPciQuestionnaireOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/pciQuestionnaires`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/pciQuestionnaires
