import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {PciSalesChannel} from './create-generate-pci.js';

export type CreateSigningRequiredInput = {
  /**
   * An array of additional sales channels to generate PCI questionnaires.
   * Include the relevant sales channels if you need your user to sign PCI questionnaires.
   * Not required if you create stores and add payment methods before you generate the questionnaires.
   */
  additionalSalesChannels?: PciSalesChannel[];
};

export type CreateSigningRequiredOutput = {
  /**
   * Indicates if the user is required to sign PCI questionnaires.
   * If false, they do not need to sign any questionnaires.
   */
  signingRequired?: boolean;
};

export async function createSigningRequired(
  client: AdyenClient,
  legalEntityId: string,
  input?: CreateSigningRequiredInput,
) {
  return await client.post<CreateSigningRequiredOutput>({
    baseUrl: lemV4BaseUrl,
    path: `legalEntities/${legalEntityId}/pciQuestionnaires/signingRequired`,
    body: input || {},
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/post/legalEntities/(id)/pciQuestionnaires/signingRequired
