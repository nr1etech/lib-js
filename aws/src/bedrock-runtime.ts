import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  ConverseCommandOutput,
  ConverseStreamCommand,
  ConverseStreamCommandInput,
  ConverseStreamCommandOutput,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
  Message,
  SystemContentBlock,
} from '@aws-sdk/client-bedrock-runtime';
import {getAwsRegion} from './region.js';

export {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  ConverseCommandOutput,
  ConverseStreamCommand,
  ConverseStreamCommandInput,
  ConverseStreamCommandOutput,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
  Message,
  SystemContentBlock,
};

const bedrockRuntimeClients = new Map<string, BedrockRuntimeClient>();

export function getBedrockRuntimeClient(region?: string) {
  const regionKey = region || getAwsRegion();
  let client = bedrockRuntimeClients.get(regionKey);
  if (!client) {
    client = new BedrockRuntimeClient({region: regionKey});
    bedrockRuntimeClients.set(regionKey, client);
  }
  return client;
}
