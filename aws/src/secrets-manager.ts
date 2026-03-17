import {
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {getAwsRegion} from './region.js';

/**
 * Re-exporting commands to be helpful so clients may not have to import the AWS SDK directly.
 */
export {
  GetSecretValueCommand,
  GetSecretValueCommandInput,
  GetSecretValueCommandOutput,
};

const secretsManagerClients = new Map<string, SecretsManagerClient>();

export function getSecretsManagerClient(region?: string): SecretsManagerClient {
  const regionKey = region || getAwsRegion();
  let client = secretsManagerClients.get(regionKey);
  if (!client) {
    client = new SecretsManagerClient({region: regionKey});
    secretsManagerClients.set(regionKey, client);
  }
  return client;
}

export async function getSecret(
  secretArn: string,
  client?: SecretsManagerClient,
): Promise<Record<string, string>> {
  if (!client) {
    client = getSecretsManagerClient();
  }
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: secretArn,
    }),
  );
  const secretValue = response.SecretString;
  if (secretValue === undefined) {
    return {
      status: 'failure',
      result: `Secret ${secretArn} not found`,
    };
  }
  return JSON.parse(secretValue) as Record<string, string>;
}
