import {unmarshall} from '@aws-sdk/util-dynamodb';
import * as client from '@aws-sdk/client-dynamodb';
import {AttributeValue, StreamRecord} from 'aws-lambda';

export {unmarshall, StreamRecord, AttributeValue};
export {DynamoDBStreamEvent} from 'aws-lambda';

export type AttributeValueMap = {[key: string]: AttributeValue};

export function unmarshallAttributeValueMap<T>(
  map?: AttributeValueMap,
): T | undefined {
  if (!map) {
    return undefined;
  }
  // The cast is necessary since there is an AttributeType defined in the client as well as lambda libraries
  return unmarshall(map! as {[key: string]: client.AttributeValue}) as T;
}

export interface UnmarshalledStreamRecord {
  ApproximateCreationDateTime?: number | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Keys?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NewImage?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  OldImage?: Record<string, any>;
  SequenceNumber?: string | undefined;
  SizeBytes?: number | undefined;
  StreamViewType?:
    | 'KEYS_ONLY'
    | 'NEW_IMAGE'
    | 'OLD_IMAGE'
    | 'NEW_AND_OLD_IMAGES'
    | undefined;
}

export function unmarshallStreamRecord(
  record: StreamRecord,
): UnmarshalledStreamRecord {
  return {
    ...record,
    Keys: unmarshallAttributeValueMap(record.Keys),
    NewImage: unmarshallAttributeValueMap(record.NewImage),
    OldImage: unmarshallAttributeValueMap(record.OldImage),
  };
}
