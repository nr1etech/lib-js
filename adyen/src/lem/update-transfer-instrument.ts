import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';
import type {BankAccountInput} from './create-transfer-instrument.js';
import type {GetTransferInstrumentOutput} from './get-transfer-instrument.js';

export type UpdateTransferInstrumentInput = {
  bankAccount?: Partial<BankAccountInput>;
  legalEntityId?: string;
  type?: 'bankAccount';
};

export type UpdateTransferInstrumentOutput = GetTransferInstrumentOutput;

export async function updateTransferInstrument(
  client: AdyenClient,
  transferInstrumentId: string,
  input: UpdateTransferInstrumentInput,
) {
  return await client.patch<UpdateTransferInstrumentOutput>({
    baseUrl: lemV4BaseUrl,
    path: `transferInstruments/${transferInstrumentId}`,
    body: input,
  });
}

// Reference: https://docs.adyen.com/api-explorer/legalentity/4/patch/transferInstruments/(id)
