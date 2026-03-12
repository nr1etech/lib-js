import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  DynamoDBDocumentClient,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import {getAwsRegion} from './region.mjs';

/**
 * Re-exporting commands to be helpful so clients may not have to import the AWS SDK directly.
 */
export {
  DynamoDBDocumentClient,
  DynamoDBClient,
  DeleteCommand,
  DeleteCommandInput,
  DeleteCommandOutput,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  PutCommand,
  PutCommandInput,
  PutCommandOutput,
  UpdateCommand,
  UpdateCommandInput,
  UpdateCommandOutput,
};

const dynamoDBClients = new Map<string, DynamoDBClient>();
const dynamoDBDocumentClients = new Map<string, DynamoDBDocumentClient>();

export function getDynamoDBClient(region?: string) {
  const regionKey = region || getAwsRegion();
  let client = dynamoDBClients.get(regionKey);
  if (!client) {
    client = new DynamoDBClient({region: regionKey});
    dynamoDBClients.set(regionKey, client);
  }
  return client;
}

export function getDynamoDBDocumentClient(region?: string) {
  const regionKey = region || getAwsRegion();
  let client = dynamoDBDocumentClients.get(regionKey);
  if (!client) {
    client = DynamoDBDocumentClient.from(getDynamoDBClient(regionKey), {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
    dynamoDBDocumentClients.set(regionKey, client);
  }
  return client;
}

function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Builds a DynamoDB `ExclusiveStartKey` or `LastEvaluatedKey` object
 * from a given item and a list of key attribute names.
 *
 * This is useful when performing paginated `Query` or `Scan` operations
 * and you only have the last returned item from the previous page rather
 * than the full `LastEvaluatedKey` returned by DynamoDB.
 *
 * The function copies the specified key attributes from the provided item
 * into a new object suitable for use as `ExclusiveStartKey` in a
 * subsequent query. For Global Secondary Index (GSI) queries, include
 * both the table’s primary key attributes and the index’s key attributes.
 *
 * @param item - The DynamoDB item (from a previous page) to extract key values from.
 * @param keyNames - The list of key attribute names that uniquely identify an item
 *                   (e.g., `["Pk", "Sk"]` for a table, or
 *                   `["Pk", "Sk", "Gs1Pk", "Gs1Sk"]` for a GSI).
 * @returns A plain JavaScript object representing the `ExclusiveStartKey`.
 *
 * @throws {Error} If any specified key attribute is missing on the provided item.
 *
 * @example
 * ```ts
 * const lastItem = { Pk: "User#123", Sk: "Order#456", Gs1Pk: "User#123", Gs1Sk: "Order#456" };
 * const keyNames = ["Pk", "Sk", "Gs1Pk", "Gs1Sk"];
 * const eks = makeExclusiveStartKeyFromItem(lastItem, keyNames);
 *
 * await ddbDoc.query({
 *   TableName: "MyTable",
 *   IndexName: "GSI1",
 *   Limit: 100,
 *   ExclusiveStartKey: eks,
 * });
 * ```
 */
function makeExclusiveStartKeyFromItem(
  item: Record<string, unknown> | null | undefined,
  keyNames: string[],
): Record<string, unknown> | undefined {
  if (item) {
    const eks: Record<string, unknown> = {};
    for (const name of dedupe(keyNames)) {
      if (!(name in item)) {
        throw new Error(
          `ExclusiveStartKey: item is missing key attribute "${name}"`,
        );
      }
      eks[name] = item[name];
    }
    return eks;
  }
  return undefined;
}

interface Cursor {
  f: Record<string, unknown> | undefined; // first evaluated key
  l: Record<string, unknown> | undefined; // last evaluated key
  p: number; // page
  d: 'n' | 'p'; // direction
  i: number; // limit
}

function encodeCursor(cursor: Cursor): string {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

function decodeCursor(encoded: string | null | undefined): Cursor | undefined {
  if (encoded) {
    return JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8'),
    ) as Cursor;
  }
  return undefined;
}

function getExclusiveStartKey(
  previous: Cursor | undefined,
  direction: 'next' | 'prev' | undefined | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> | undefined {
  if (!direction) {
    direction = 'next';
  }
  if (previous) {
    if (previous.d === 'p' && previous.p === 1) {
      return undefined;
    }
    if (previous.p === 1 && direction === 'prev') {
      return undefined;
    }
    if (previous.d === 'n' && direction === 'next') {
      // If trying to go next but there's no LastEvaluatedKey, we're past the last page
      // Return the first key to query from there with ScanIndexForward=true
      // This will return an empty result set instead of wrapping to page 1
      if (previous.l === undefined) {
        return previous.f;
      }
      return previous.l;
    }
    if (previous.d === 'n' && direction === 'prev') {
      return previous.f;
    }
    if (previous.d === 'p' && direction === 'prev') {
      return previous.l;
    }
    if (previous.d === 'p' && direction === 'next') {
      return previous.f;
    }
  }
  return undefined;
}

function getNextPage(
  previous: Cursor | undefined,
  direction: 'next' | 'prev' | undefined,
): number {
  if (previous) {
    if (direction === 'next') {
      return previous.p + 1;
    }
    if (direction === 'prev') {
      return previous.p - 1;
    }
  }
  return 1;
}

function encodeDirection(direction: 'next' | 'prev'): 'n' | 'p' {
  if (direction === 'prev') {
    return 'p';
  }
  return 'n';
}

function getDirection(
  previous: Cursor | undefined,
  direction: 'next' | 'prev' | undefined | null,
): 'next' | 'prev' {
  if (direction === 'prev' && previous?.p === 1) {
    return 'next';
  }
  if (direction === 'prev') {
    return 'prev';
  }
  return 'next';
}

export interface PaginationParams {
  cursor?: string | null | undefined;
  direction?: 'next' | 'prev' | null | undefined;
  limit?: number | null | undefined;
}

export interface PaginatedResult<T> {
  items: T[];
  cursor: string;
  hasNext: boolean;
  page: number;
}

/**
 * Executes a paginated DynamoDB query with full cursor-based pagination support.
 *
 * This helper encapsulates all pagination logic including:
 * - Cursor encoding/decoding
 * - ExclusiveStartKey calculation
 * - Bidirectional pagination (next/prev)
 * - First/last key tracking
 * - Automatic item ordering
 *
 * @param params Configuration for the query and item mapping
 * @param params.client DynamoDB Document Client instance
 * @param params.query QueryCommand input (without ExclusiveStartKey, Limit, ScanIndexForward)
 * @param params.keyAttributes Array of key attribute names for the table/index being queried
 * @param params.mapItem Function to transform raw DynamoDB items into desired format
 * @param pagination Pagination parameters from the client
 * @param pagination.cursor Base64-encoded cursor from previous request
 * @param pagination.direction Direction to paginate ('next' or 'prev')
 * @param pagination.limit Number of items per page (locked after first request)
 * @param defaultScanForward Controls the default scan direction. When true, 'next' scans forward (ascending) and 'prev' scans backward (descending). When false, the behavior is inverted.
 * @returns Paginated result with items, cursor, hasNext flag, and page number
 *
 * @example
 * ```typescript
 * return executePaginatedQuery(
 *   {
 *     client: getDynamoDBDocumentClient(),
 *     query: {
 *       TableName: 'MyTable',
 *       IndexName: 'Gs1',
 *       KeyConditionExpression: 'Gs1Pk = :pk',
 *       ExpressionAttributeValues: { ':pk': 'Agency#123' },
 *     },
 *     keyAttributes: ['Pk', 'Sk', 'Gs1Pk', 'Gs1Sk'],
 *     mapItem: (item) => item.Detail,
 *   },
 *   { cursor: '...', direction: 'next', limit: 10 },
 *   true // defaultScanForward
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executePaginatedQuery<T = any>(
  params: {
    client: DynamoDBDocumentClient;
    query: Omit<
      QueryCommandInput,
      'ExclusiveStartKey' | 'Limit' | 'ScanIndexForward'
    >;
    keyAttributes: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapItem: (item: Record<string, any>) => T;
  },
  pagination: PaginationParams,
  defaultScanForward?: boolean,
): Promise<PaginatedResult<T>> {
  const {client, query, keyAttributes, mapItem} = params;

  // Decode cursor and calculate pagination parameters
  const decodedCursor = decodeCursor(pagination?.cursor);
  const limit = decodedCursor?.i ?? pagination?.limit ?? 25;

  // Validate limit
  if (limit <= 0) {
    throw new Error('Pagination limit must be a positive number');
  }

  const exclusiveStartKey = getExclusiveStartKey(
    decodedCursor,
    pagination?.direction,
  );
  const direction = getDirection(decodedCursor, pagination?.direction);

  // Execute query with calculated pagination parameters
  const result = await client.send(
    new QueryCommand({
      ...query,
      Limit: limit,
      ScanIndexForward: defaultScanForward
        ? direction === 'next'
        : direction === 'prev',
      ExclusiveStartKey: exclusiveStartKey,
    }),
  );

  // Build cursor for next request
  const page = getNextPage(decodedCursor, direction);
  const firstItem = result.Items?.[0];
  const newCursor: Cursor = {
    l: result.LastEvaluatedKey,
    f: makeExclusiveStartKeyFromItem(firstItem, keyAttributes),
    p: page,
    d: encodeDirection(direction),
    i: limit,
  };

  // Map and order items
  const items: T[] = (result.Items ?? []).map(mapItem);

  return {
    items: direction === 'next' ? items : items.reverse(),
    cursor: encodeCursor(newCursor),
    hasNext: !!result.LastEvaluatedKey,
    page,
  };
}

/**
 * Executes a paginated DynamoDB scan with cursor-based pagination support.
 *
 * Similar to executePaginatedQuery but for Scan operations. Note that Scan operations
 * are unordered by nature and do not support scan direction control (unlike Query operations).
 * Scan operations only support forward pagination (no bidirectional navigation).
 *
 * @param params Configuration for the scan and item mapping
 * @param params.client DynamoDB Document Client instance
 * @param params.scan ScanCommand input (without ExclusiveStartKey or Limit)
 * @param params.keyNames Array of key attribute names for the table
 * @param params.mapItem Function to transform raw DynamoDB items into desired format
 * @param pagination Pagination parameters from the client
 * @param pagination.cursor Base64-encoded cursor from previous request
 * @param pagination.limit Number of items per page (locked after first request)
 * @returns Paginated result with items, cursor, hasNext flag, and page number
 *
 * @example
 * ```typescript
 * return executePaginatedScan(
 *   {
 *     client: getDynamoDBDocumentClient(),
 *     scan: {
 *       TableName: 'MyTable',
 *       FilterExpression: 'attribute_exists(#attr)',
 *       ExpressionAttributeNames: { '#attr': 'myAttribute' },
 *     },
 *     keyNames: ['Pk', 'Sk'],
 *     mapItem: (item) => item.Detail,
 *   },
 *   { cursor: '...', limit: 10 }
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function executePaginatedScan<T = any>(
  params: {
    client: DynamoDBDocumentClient;
    scan: Omit<QueryCommandInput, 'ExclusiveStartKey' | 'Limit'>;
    keyNames: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapItem: (item: Record<string, any>) => T;
  },
  pagination: PaginationParams,
): Promise<PaginatedResult<T>> {
  const {client, scan, keyNames, mapItem} = params;

  // Decode cursor and calculate pagination parameters
  const decodedCursor = decodeCursor(pagination?.cursor);
  const limit = decodedCursor?.i ?? pagination?.limit ?? 25;

  // Validate limit
  if (limit <= 0) {
    throw new Error('Pagination limit must be a positive number');
  }

  // For scans, only forward pagination is supported
  const exclusiveStartKey = decodedCursor?.l;

  // Execute scan with calculated pagination parameters
  const result = await client.send(
    new ScanCommand({
      ...scan,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    }),
  );

  // Build cursor for next request
  const page = (decodedCursor?.p ?? 0) + 1;
  const firstItem = result.Items?.[0];
  const newCursor: Cursor = {
    l: result.LastEvaluatedKey,
    f: makeExclusiveStartKeyFromItem(firstItem, keyNames),
    p: page,
    d: 'n', // Scans only support forward direction
    i: limit,
  };

  // Map items
  const items: T[] = (result.Items ?? []).map(mapItem);

  return {
    items,
    cursor: encodeCursor(newCursor),
    hasNext: !!result.LastEvaluatedKey,
    page,
  };
}
