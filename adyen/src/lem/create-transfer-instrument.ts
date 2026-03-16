import {AdyenClient} from '../client.js';
import {lemV4BaseUrl} from './env.js';

export type USBankAccountType = 'checking' | 'savings';

export type USLocalAccountIdentificationInput = {
  accountNumber: string;
  accountType?: USBankAccountType;
  routingNumber: string;
  type: 'usLocal';
};

export type BankAccountInput = {
  accountIdentification: USLocalAccountIdentificationInput;
  bankName: string;
  countryCode: string;
};

export type CreateTransferInstrumentInput = {
  bankAccount: BankAccountInput;
  legalEntityId: string;
  type: 'bankAccount';
};

export type CreateTransferInstrumentOutput = {
  replaceme?: unknown;
  // TODO Implement me!
};

export async function createTransferInstrument(
  client: AdyenClient,
  input: CreateTransferInstrumentInput,
): Promise<CreateTransferInstrumentOutput> {
  return await client.post<CreateTransferInstrumentOutput>({
    baseUrl: lemV4BaseUrl,
    path: 'transferInstruments',
    body: input,
  });
}

// {
//   "bankAccount": {
//     "accountIdentification": {
//       "type": "usLocal",
//       "accountNumber": "0888271156",
//       "accountType": "checking",
//       "routingNumber": "122000247"
//     },
//     "bankName": "Chase",
//     "countryCode": "US",
//     "trustedSource": false
//   },
//   "legalEntityId": "LE32CTB22322765NNZPLK29CG",
//   "type": "bankAccount",
//   "id": "SE32CVS22322775NT3M823SZH"
// }
