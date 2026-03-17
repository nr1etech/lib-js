import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type GetPciQuestionnaireByIdOutput = {
  /**
   * The generated questionnaire in a base64 encoded format.
   */
  content?: string;
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

export async function getPciQuestionnaireById(
  client: AdyenClient,
  legalEntityId: string,
  pciId: string,
) {
  return await client.get<GetPciQuestionnaireByIdOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/pciQuestionnaires/${pciId}`,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/get/legalEntities/(id)/pciQuestionnaires/(pciid)
