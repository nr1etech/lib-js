import {
  LambdaClient,
  GetFunctionCommand,
  GetFunctionCommandInput,
  GetFunctionCommandOutput,
  ResourceNotFoundException,
} from '@aws-sdk/client-lambda';
import {getAwsRegion} from './region.js';

export {GetFunctionCommand, GetFunctionCommandInput, GetFunctionCommandOutput};

const lambdaClients = new Map<string, LambdaClient>();

export function getLambdaClient(region?: string): LambdaClient {
  const regionKey = region || getAwsRegion();
  let client = lambdaClients.get(regionKey);
  if (!client) {
    client = new LambdaClient({region: regionKey});
    lambdaClients.set(regionKey, client);
  }
  return client;
}

export async function getCodeSizeBytes(
  functionName: string,
  client?: LambdaClient,
): Promise<number | null> {
  const response = await getFunction(functionName, client);
  return response?.Configuration?.CodeSize || null;
}

export async function getFunction(
  functionName: string,
  client?: LambdaClient,
): Promise<GetFunctionCommandOutput | null> {
  if (!client) {
    client = getLambdaClient();
  }
  try {
    return await client.send(
      new GetFunctionCommand({
        FunctionName: functionName,
      }),
    );
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      return null;
    }
    throw e;
  }
}
