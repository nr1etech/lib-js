import {
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput,
  SQSClient,
} from '@aws-sdk/client-sqs';

/**
 * Re-exporting commands to be helpful so clients may not have to import the AWS SDK directly.
 */
export {
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageCommandOutput,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchCommandOutput,
};

const clients: Record<string, SQSClient> = {};

export function getSQSClient(region?: string) {
  let client = clients[region ?? 'unspecified'];
  if (!client) {
    client = new SQSClient({region});
    clients[region ?? 'unspecified'] = client;
  }
  return client;
}

export async function sendMessage(
  queueUrl: string,
  messageBody: string | object,
  region?: string,
): Promise<SendMessageCommandOutput> {
  return await getSQSClient(region).send(
    new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody:
        typeof messageBody === 'string'
          ? messageBody
          : JSON.stringify(messageBody),
    }),
  );
}
