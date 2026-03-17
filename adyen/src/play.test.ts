import {test} from 'vitest';
import {createAdyenClient} from './client.js';
import {createAccountHolder, createBalanceAccount} from './bcl/index.js';
import {
  createBusinessLine,
  createLegalEntity,
  createTransferInstrument,
  getLegalEntity,
  updateLegalEntity,
} from './lem/index.js';
import {
  createStore,
  listMerchantAccounts,
  requestPaymentMethod,
  updateStore,
} from './management/index.js';
import {createPaymentSession} from './checkout/index.js';

test('Test getLegalEntity @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await getLegalEntity(client, 'LE32CVS22322775NT3G4KFR5Q');
  console.log('Get legal entity', JSON.stringify(output, null, 2));
});

test('Test getLegalEntity @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await getLegalEntity(client, 'LE32CVS22322775NT3G4KFR5Q');
  console.log('Get legal entity', JSON.stringify(output, null, 2));
});

test('Test createLegalEntity (Organization) @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await createLegalEntity(client, {
    type: 'organization',
    organization: {
      legalName: 'Test Company 3 LLC',
      registeredAddress: {
        city: 'San Francisco',
        country: 'US',
        postalCode: '94107',
        stateOrProvince: 'CA',
        street: '123 Market Street',
      },
      email: 'test@example.com',
      phone: {
        number: '+14155551234',
        type: 'mobile',
      },
      taxInformation: [
        {
          country: 'US',
          number: '00-1234567',
          type: 'EIN',
        },
      ],
    },
  });
  console.log('Organization', JSON.stringify(output, null, 2));
});

// {
//   id: 'LE32CTB22322765NNZPLK29CG',
//   organization: Organization {
//     email: 'test@example.com',
//     legalName: 'Test Company LLC',
//     phone: PhoneNumber {
//       number: '+14155551234',
//       phoneCountryCode: 'US',
//       type: 'mobile'
//     },
//     registeredAddress: Address {
//       city: 'San Francisco',
//       country: 'US',
//       postalCode: '94107',
//       stateOrProvince: 'CA',
//       street: '123 Market Street'
//     }
//   },
//   type: 'organization'
// }

// {
//   "id": "LE32CVS22322775NT3G4KFR5Q",
//   "organization": {
//     "email": "test@example.com",
//     "legalName": "Test Company 2 LLC",
//     "phone": {
//       "number": "+14155551234",
//       "phoneCountryCode": "US",
//       "type": "mobile"
//     },
//     "registeredAddress": {
//       "city": "San Francisco",
//       "country": "US",
//       "postalCode": "94107",
//       "stateOrProvince": "CA",
//       "street": "123 Market Street"
//     }
//   },
//   "type": "organization"
// }

// {
//   "organization": {
//     "email": "test@example.com",
//     "phone": {
//       "number": "+14155551234",
//       "phoneCountryCode": "US",
//       "type": "mobile"
//     },
//     "legalName": "Test Company 3 LLC",
//     "registeredAddress": {
//       "city": "San Francisco",
//       "country": "US",
//       "postalCode": "94107",
//       "stateOrProvince": "CA",
//       "street": "123 Market Street"
//     }
//   },
//   "type": "organization",
//   "id": "LE32CT622322775NT3JV43MGF"
// }

test('Test createLegalEntity (Individual) @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await createLegalEntity(client, {
    type: 'individual',
    individual: {
      name: {
        firstName: 'James',
        lastName: 'Kirk',
      },
      residentialAddress: {
        street: '51 W 1st St',
        city: 'Riverside',
        stateOrProvince: 'IA',
        country: 'US',
        postalCode: '52327',
      },
    },
  });
  console.log('Individual', JSON.stringify(output, null, 2));
});

// TODO This is what an error looks like
// {
//   "type": "https://docs.adyen.com/errors/validation",
//   "title": "The request is missing required fields or contains invalid data.",
//   "status": 422,
//   "detail": "Invalid legal entity information provided",
//   "requestId": "NO_PSP_REF_1770175188331646",
//   "invalidFields": [
//     {
//       "name": "individual.residentialAddress.postalCode",
//       "message": "Required field was not provided."
//     },
//     {
//       "name": "individual.residentialAddress.stateOrProvince",
//       "value": "Iowa",
//       "message": "Not valid for US. Allowed values: [DE, HI, PR, TX, MA, MD, IA... For full list visit documentation."
//     }
//   ],
//   "errorCode": "30_102"
// }

// {
//   "individual": {
//     "name": {
//       "firstName": "James",
//       "lastName": "Kirk"
//     },
//     "residentialAddress": {
//       "city": "Riverside",
//       "country": "US",
//       "postalCode": "52327",
//       "stateOrProvince": "IA",
//       "street": "51 W 1st St"
//     }
//   },
//   "type": "individual",
//   "id": "LE32CM722322795NTXGNX53SZ"
// }

test('Test associate individual with org @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await updateLegalEntity(client, 'LE32CTB22322765NNZPLK29CG', {
    entityAssociations: [
      {
        jobTitle: 'Captain',
        legalEntityId: 'LE32CM722322795NTXGNX53SZ',
        type: 'signatory',
      },
    ],
  });
  console.log('Legal entity associations', JSON.stringify(output, null, 2));
});

test('Test createTransferInstrument @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await createTransferInstrument(client, {
    legalEntityId: 'LE32CTB22322765NNZPLK29CG',
    type: 'bankAccount',
    bankAccount: {
      accountIdentification: {
        type: 'usLocal',
        // https://developer.payments.jpmorgan.com/docs/commerce/online-payments/testing
        routingNumber: '122000247',
        accountNumber: '0888271156',
        accountType: 'checking',
      },
      bankName: 'Chase',
      countryCode: 'US',
    },
  });
  console.log('Transfer instrument', JSON.stringify(output, null, 2));
});

// {
//   "balancePlatform": "ClientloopAdminipayPlatform",
//   "legalEntityId": "LE32CTB22322765NNZPLK29CG",
//   "timeZone": "America/Los_Angeles",
//   "capabilities": {
//     "receiveFromPlatformPayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "receiveFromBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "sendToBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "sendToTransferInstrument": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "transferInstruments": [
//         {
//           "enabled": true,
//           "requested": true,
//           "allowed": false,
//           "id": "SE32CVS22322775NT3M823SZH",
//           "verificationStatus": "pending"
//         },
//         {
//           "enabled": true,
//           "requested": true,
//           "allowed": false,
//           "id": "SE32CN822322775NRDHJ4BZBN",
//           "verificationStatus": "pending"
//         }
//       ],
//       "verificationStatus": "pending"
//     },
//     "receivePayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     }
//   },
//   "id": "AH32CQB22322B35NT3NCVBDQH",
//   "status": "active"
// }

// {
//   "balancePlatform": "ClientloopAdminipayPlatform",
//   "legalEntityId": "LE32CVS22322775NT3G4KFR5Q",
//   "timeZone": "America/Los_Angeles",
//   "capabilities": {
//     "receiveFromPlatformPayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "receiveFromBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "sendToBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "sendToTransferInstrument": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     },
//     "receivePayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "verificationStatus": "pending"
//     }
//   },
//   "id": "AH32CQB22322B35NT3NJWBFDJ",
//   "status": "active"
// }

test('Test create business line @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.LEM_API_KEY!,
    env: 'test',
  });
  const output = await createBusinessLine(client, {
    legalEntityId: 'LE32CTB22322765NNZPLK29CG',
    service: 'paymentProcessing',
    industryCode: '23', // Construction & installation
    salesChannels: ['pos', 'eCommerce', 'payByLink'],
  });
  console.log(
    'Payment processing business line',
    JSON.stringify(output, null, 2),
  );
});

// {
//   "industryCode": "23",
//   "legalEntityId": "LE32CTB22322765NNZPLK29CG",
//   "salesChannels": [
//     "eCommerce",
//     "pos",
//     "payByLink"
//   ],
//   "service": "paymentProcessing",
//   "id": "SE32CM722322795NTXQ496ZT5"
// }

test('Test listMerchantAccounts @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.US_PSP_API_KEY!,
    env: 'test',
  });
  const output = await listMerchantAccounts(client);
  console.log('Merchant accounts', JSON.stringify(output, null, 2));
});

test('Test create store @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.US_PSP_API_KEY!,
    env: 'test',
  });
  const output = await createStore(client, {
    address: {
      city: 'San Francisco',
      country: 'US',
      postalCode: '94107',
      stateOrProvince: 'CA',
      line1: '123 Market Street',
    },
    description: 'Test store',
    merchantId: 'ClientloopAdminipay_US',
    phoneNumber: '+14155551234',
    shopperStatement: 'Test Store',
    businessLineIds: ['SE32CM722322795NTXQ496ZT5'],
  });
  console.log('Store', JSON.stringify(output, null, 2));
});

test('Update store @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.US_PSP_API_KEY!,
    env: 'test',
  });
  const output = await updateStore(client, 'ST3298S223229G5NTXW3N5326', {
    businessLineIds: ['SE32CM722322795NTXQ496ZT5'],
  });
  console.log('Updated store', JSON.stringify(output, null, 2));
});

// {
//   "address": {
//     "city": "San Francisco",
//     "line1": "123 Market Street",
//     "postalCode": "94107",
//     "stateOrProvince": "CA",
//     "country": "US"
//   },
//   "businessLineIds": [
//     "SE32CM722322795NTXQ496ZT5"
//   ],
//   "description": "Test store",
//   "id": "ST3298S223229G5NTXW3N5326",
//   "_links": {
//     "self": {
//       "href": "https://management-test.adyen.com/v3/stores/ST3298S223229G5NTXW3N5326"
//     }
//   },
//   "merchantId": "ClientloopAdminipay_US",
//   "phoneNumber": "+14155551234",
//   "reference": "ST3298S223229G5NTXW3N5326",
//   "shopperStatement": "Test Store",
//   "status": "active"
// }

test('Add VISA to store @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.US_PSP_API_KEY!,
    env: 'test',
  });
  const output = await requestPaymentMethod(client, 'ClientloopAdminipay_US', {
    type: 'visa',
    businessLineId: 'SE32CM722322795NTXQ496ZT5',
    currencies: ['USD'],
    countries: ['US'],
  });
  console.log('Payment methods', JSON.stringify(output, null, 2));
});

test('Test createAccountHolder @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.BCL_API_KEY!,
    env: 'test',
  });
  const output = await createAccountHolder(client, {
    legalEntityId: 'LE32CVS22322775NT3G4KFR5Q',
  });
  console.log('Account holder', JSON.stringify(output, null, 2));
});

// {
//   "balancePlatform": "ClientloopAdminipayPlatform",
//   "legalEntityId": "LE32CVS22322775NT3G4KFR5Q",
//   "timeZone": "America/Los_Angeles",
//   "capabilities": {
//     "receiveFromPlatformPayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "problems": [
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_902",
//               "message": "Terms Of Service forms are not accepted.",
//               "remediatingActions": [
//                 {
//                   "code": "2_902",
//                   "message": "Accept TOS"
//                 }
//               ],
//               "type": "invalidInput"
//             }
//           ]
//         }
//       ],
//       "verificationStatus": "invalid"
//     },
//     "receiveFromBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "problems": [
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_902",
//               "message": "Terms Of Service forms are not accepted.",
//               "remediatingActions": [
//                 {
//                   "code": "2_902",
//                   "message": "Accept TOS"
//                 }
//               ],
//               "type": "invalidInput"
//             }
//           ]
//         }
//       ],
//       "verificationStatus": "invalid"
//     },
//     "sendToBalanceAccount": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "problems": [
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_8189",
//               "message": "'UBO through control' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_151",
//                   "message": "Add 'organization.entityAssociations' of type 'uboThroughControl' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8086",
//               "message": "'organization.doingBusinessAs' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_133",
//                   "message": "Add 'organization.doingBusinessAs' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8175",
//               "message": "'taxInformation.number' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_171",
//                   "message": "Add 'taxInformation.number' to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8043",
//               "message": "'organization.registrationNumber' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_117",
//                   "message": "Add 'organization.registrationNumber' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8174",
//               "message": "'taxInformation' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_170",
//                   "message": "Add tax information to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8069",
//               "message": "'organization.type' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_125",
//                   "message": "Add 'organization.type' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8067",
//               "message": "'Signatory' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_124",
//                   "message": "Add 'organization.entityAssociations' of type 'signatory' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8045",
//               "message": "'organization.taxId' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_118",
//                   "message": "Add 'organization.taxId' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             }
//           ]
//         },
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_902",
//               "message": "Terms Of Service forms are not accepted.",
//               "remediatingActions": [
//                 {
//                   "code": "2_902",
//                   "message": "Accept TOS"
//                 }
//               ],
//               "type": "invalidInput"
//             }
//           ]
//         }
//       ],
//       "verificationStatus": "invalid"
//     },
//     "sendToTransferInstrument": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "problems": [
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_8174",
//               "message": "'taxInformation' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_170",
//                   "message": "Add tax information to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8045",
//               "message": "'organization.taxId' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_118",
//                   "message": "Add 'organization.taxId' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8036",
//               "message": "'bankAccount' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_115",
//                   "message": "Add bank account"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8043",
//               "message": "'organization.registrationNumber' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_117",
//                   "message": "Add 'organization.registrationNumber' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8086",
//               "message": "'organization.doingBusinessAs' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_133",
//                   "message": "Add 'organization.doingBusinessAs' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8175",
//               "message": "'taxInformation.number' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_171",
//                   "message": "Add 'taxInformation.number' to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8067",
//               "message": "'Signatory' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_124",
//                   "message": "Add 'organization.entityAssociations' of type 'signatory' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8189",
//               "message": "'UBO through control' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_151",
//                   "message": "Add 'organization.entityAssociations' of type 'uboThroughControl' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8069",
//               "message": "'organization.type' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_125",
//                   "message": "Add 'organization.type' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             }
//           ]
//         },
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_902",
//               "message": "Terms Of Service forms are not accepted.",
//               "remediatingActions": [
//                 {
//                   "code": "2_902",
//                   "message": "Accept TOS"
//                 }
//               ],
//               "type": "invalidInput"
//             }
//           ]
//         }
//       ],
//       "verificationStatus": "invalid"
//     },
//     "receivePayments": {
//       "enabled": true,
//       "requested": true,
//       "allowed": false,
//       "problems": [
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_8067",
//               "message": "'Signatory' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_124",
//                   "message": "Add 'organization.entityAssociations' of type 'signatory' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8174",
//               "message": "'taxInformation' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_170",
//                   "message": "Add tax information to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8043",
//               "message": "'organization.registrationNumber' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_117",
//                   "message": "Add 'organization.registrationNumber' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8175",
//               "message": "'taxInformation.number' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_171",
//                   "message": "Add 'taxInformation.number' to legal entity."
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8069",
//               "message": "'organization.type' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_125",
//                   "message": "Add 'organization.type' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8190",
//               "message": "'businessLine' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_136",
//                   "message": "Add business line"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8189",
//               "message": "'UBO through control' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_151",
//                   "message": "Add 'organization.entityAssociations' of type 'uboThroughControl' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8249",
//               "message": "'organization.support.phone.number' was missing",
//               "remediatingActions": [
//                 {
//                   "code": "2_236",
//                   "message": "Add 'organization.support.phone.number' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8045",
//               "message": "'organization.taxId' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_118",
//                   "message": "Add 'organization.taxId' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8247",
//               "message": "'organization.support.email' was missing",
//               "remediatingActions": [
//                 {
//                   "code": "2_234",
//                   "message": "Add 'organization.support.email' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             },
//             {
//               "code": "2_8086",
//               "message": "'organization.doingBusinessAs' was missing.",
//               "remediatingActions": [
//                 {
//                   "code": "2_133",
//                   "message": "Add 'organization.doingBusinessAs' to legal entity"
//                 }
//               ],
//               "type": "dataMissing"
//             }
//           ]
//         },
//         {
//           "entity": {
//             "id": "LE32CVS22322775NT3G4KFR5Q",
//             "type": "LegalEntity"
//           },
//           "verificationErrors": [
//             {
//               "code": "2_902",
//               "message": "Terms Of Service forms are not accepted.",
//               "remediatingActions": [
//                 {
//                   "code": "2_902",
//                   "message": "Accept TOS"
//                 }
//               ],
//               "type": "invalidInput"
//             }
//           ]
//         }
//       ],
//       "verificationStatus": "invalid"
//     }
//   },
//   "id": "AH3292W22322B55NV2TDC3JXF",
//   "status": "active"
// }

test('Create balance account @none', async () => {
  const client = createAdyenClient({
    apiKey: process.env.BCL_API_KEY!,
    env: 'test',
  });
  const output = await createBalanceAccount(client, {
    accountHolderId: 'AH3292W22322B55NV2TDC3JXF',
  });
  console.log('Balance account', JSON.stringify(output, null, 2));
});

// {
//   "accountHolderId": "AH3292W22322B55NV2TDC3JXF",
//   "defaultCurrencyCode": "USD",
//   "timeZone": "America/Los_Angeles",
//   "balances": [
//     {
//       "available": 0,
//       "balance": 0,
//       "currency": "USD",
//       "pending": 0,
//       "reserved": 0
//     }
//   ],
//   "id": "BA32CMZ22322B55NV2TJZDGFM",
//   "status": "active"
// }

// 9. Send in acceptance of terms of service - https://docs.adyen.com/platforms/onboard-users/terms-of-service/
// 10. Send in security questionnaire - https://docs.adyen.com/platforms/onboard-users/pci-forms#generate-questionnaires/
// 11. Resolver verification errors. We can get verification updates from https://docs.adyen.com/api-explorer/#/balanceplatform/latest/get/accountHolders/{id}

// Test Company LLC
// LE32CTB22322765NNZPLK29CG
// James Kirk
// LE32CM722322795NTXGNX53SZ
// Transfer Instrument
// AH32CQB22322B35NT3NCVBDQH
// Business Line
// SE32CM722322795NTXQ496ZT5
// Store
// ST3298S223229G5NTXW3N5326
// Account Holder
// AH3292W22322B55NV2TDC3JXF
// Balance Account
// BA32CMZ22322B55NV2TJZDGFM

// test('Test create store @only', async () => {
//   const client = createAdyenClient({
//     apiKey: process.env.LEM_API_KEY!,
//     env: 'test',
//   });
//   const output = await createStore(client, {});
// });

// 9. Send in acceptance of terms of service - https://docs.adyen.com/platforms/onboard-users/terms-of-service/
// 10. Send in security questionnaire - https://docs.adyen.com/platforms/onboard-users/pci-forms#generate-questionnaires/
// 11. Resolver verification errors. We can get verification updates from https://docs.adyen.com/api-explorer/#/balanceplatform/latest/get/accountHolders/{id}

// Test Company LLC
// LE32CTB22322765NNZPLK29CG
// James Kirk
// LE32CM722322795NTXGNX53SZ
// Transfer Instrument
// AH32CQB22322B35NT3NCVBDQH
// Business Line
// SE32CM722322795NTXQ496ZT5
// Store
// ST3298S223229G5NTXW3N5326
// Account Holder
// AH3292W22322B55NV2TDC3JXF
// Balance Account
// BA32CMZ22322B55NV2TJZDGFM

test('Test createPaymentSession @only', async () => {
  const client = createAdyenClient({
    apiKey: process.env.US_PSP_API_KEY!,
    env: 'test',
  });
  const output = await createPaymentSession(client, {
    amount: {
      value: 99900,
      currency: 'USD',
    },
    merchantAccount: 'ClientloopAdminipay_US',
    reference: '12345',
    returnUrl: 'https://checkout.clientloop.com/tesst',
  });
  console.log('Payment Session', JSON.stringify(output, null, 2));
});

// {
//   "amount": {
//     "currency": "USD",
//     "value": 10
//   },
//   "expiresAt": "2026-02-09T16:41:40+01:00",
//   "id": "CSBD2DFB68E243D42F97F621E",
//   "merchantAccount": "ClientloopAdminipay_US",
//   "reference": "12345",
//   "returnUrl": "https://checkout.clientloop.com/tesst",
//   "shopperLocale": "en-US",
//   "mode": "embedded",
//   "sessionData": "Ab02b4c0!BQABAgBDteNBk7ugQGi9AxwRJsXAeZ1/PyZf0jvLqKZLH31iz20fmKU2GYXQ61G+X4ei25xKzjqOZO1vDl+sotjZQ4kAg5mbPmSluV/A5FlJ2jc7v1nzDR7wUmKoMP0RDa8bhYdYFWA9jDJuf2Ql2T7Z3pHqw12dG+M44NonwEdLg11p6Ct6Z1ULl/kjYlL/xg06MSYraecIe2AgdI8EltOh6BUg6YceonRRlZIHlTghfjjzLj5l5OAuJbV5A6s9ax53rJEUK/Z/HOPe33bEhmAKoO8h+v4jiy96DdJvxqG7EbmUXfSDXLHqXcc9wob7/MkEtgfQjTZvcc8TJ1c03MNKTbdkvJtxny/ReF/RjLMU7Z2FfwYaEI1JqQHXigDuzpeZuQb3pdHpzO1NOhYWUpvnj/Jxxfs5036axoc/m7bKQd0vjPee6gZvD7aZIOAvv6Sndb21iWMlYDJsOxnXQ+Bh7fX6jVUrhZtr8RQIPg/suYNalKEPr9dHWCCFBEShNPRsvlZ+pJTUAEu2bWHNLNvGTCifsJVZ/q1UsFo68kj7R/31c5hBGqx+dWplzjhy5QwumIErbnwTawR7jt1iA1+9G6UbgVMC0EphbMvU/7AvIv261GIlIU1IxhzzEDAQfcTpbRKN39bsEPaNa/R2cPsYxJf6/StGaY8zEBjc+go7fm71Dwxe+tvLTZOXlHSYPP8ASnsia2V5IjoiQUYwQUFBMTAzQ0E1MzdFQUVEODdDMjRERDUzOTA5QjgwQTc4QTkyM0UzODIzRDY4REFDQzk0QjlGRjgzMDVEQyJ9S+L60FrZ6uSngyVGNpesGlhqmAPA6QzB9zTWuTNzj483KsPS5Qd5UWmGrPQMXogLIFu29zll+SA60mDEwzpJ19Ff0yANkMh/E5kgINQ5q8z4/6b6pRd1+4gGamamgzhF08XLK1ohcF09lVf1lj5FW2X0taiXHiA2oisRN3OoRVrRdSNi/7tx1kXUPbJH+eoISm2mV8Jg4Enaj8mxOPxxXmIUAkXRQqM4GTdMUrHSPlX6V+PP0i/L6yxNxQsbqeUrN8ymM4yVlRqi5+YXebfxmBRKahV/4sFAn1wlsz4lKcrA+dR3MIkyfpCgW6geTYFQeH14IaQCBnxrtcpjzGh4FXgswLi59VuIQv/ciA4MYh8I7mbiAcdueqaKdZaRIsuUXIWMpnDc7AtpuD6RRCQ4i9HPiETpBMFpee63C6cQVBPliJQCKjNGpNIezn4JXul/YIwkVBI9Bt7jOv+vtdnOgCMYqiJg133p7a180FciottBVg582vuY+Op/0dD3bz+Uw0679N38n5mDUKfppgef1Q6XWxwnnNhngIjh/l36k5iJUdMEznqERAbG/pRcEI5LdN7jF9GGlz0sjgoFEuxwwirImWYPn6wHKpJdEENgYxMIoAA9OneByTzS/9FR16PL+g=="
// }
