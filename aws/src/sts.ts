import {
  GetCallerIdentityCommand,
  GetCallerIdentityCommandInput,
  GetCallerIdentityCommandOutput,
  STSClient,
} from '@aws-sdk/client-sts';
import {getAwsRegion} from './region.js';

export {
  STSClient,
  GetCallerIdentityCommand,
  GetCallerIdentityCommandInput,
  GetCallerIdentityCommandOutput,
};

const stsClients = new Map<string, STSClient>();

export function getStsClient(region?: string) {
  const regionKey = region || getAwsRegion();
  let client = stsClients.get(regionKey);
  if (!client) {
    client = new STSClient({region: regionKey});
    stsClients.set(regionKey, client);
  }
  return client;
}
