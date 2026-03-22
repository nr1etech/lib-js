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
import {getAwsRegion} from './region.js';

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

/**
 * Builds a dynamic DynamoDB update expression from an input object.
 * Only includes fields that are defined (not undefined) and not in the excluded list.
 *
 * @param input - The input object containing fields to update
 * @param options - Configuration options
 * @param options.excludedFields - Fields to exclude from the update expression (e.g., 'id', 'createdAt')
 * @param options.prefix - Prefix for nested objects (e.g., 'Detail', 'Data'). Set to empty string for no prefix. Default: 'Detail'
 * @returns Object containing UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
 */
export function buildUpdateExpression(
  input: Record<string, unknown>,
  options: {
    excludedFields?: string[];
    prefix?: string;
  } = {},
): {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, unknown>;
} {
  const {excludedFields = [], prefix = 'Detail'} = options;

  const updateExpression: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};

  // Add prefix to attribute names if provided
  const prefixKey = prefix ? `#${prefix.toLowerCase()}` : '';
  if (prefix) {
    expressionAttributeNames[prefixKey] = prefix;
  }

  // Build update expressions for all provided fields
  for (const [key, value] of Object.entries(input)) {
    if (!excludedFields.includes(key) && value !== undefined) {
      const prefixPart = prefix ? `${prefixKey}.` : '';
      updateExpression.push(`${prefixPart}#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  }

  return {
    UpdateExpression: `SET ${updateExpression.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  };
}

/**
 * Executes a DynamoDB update operation that only succeeds if the item already exists.
 *
 * This function builds a dynamic update expression from the input object and applies
 * an existence check condition. Unlike DynamoDB's default upsert behavior, this function
 * will throw an error if you attempt to update a non-existent item.
 *
 * @template T - The type of the returned item or nested object
 * @param input - Object containing the fields to update. Only defined values are included.
 * @param tableName - The name of the DynamoDB table
 * @param key - The primary key of the item to update (e.g., `{ Pk: 'User#123', Sk: 'Profile' }`)
 * @param options - Configuration options
 * @param options.client - Custom DynamoDB Document Client instance (defaults to singleton client)
 * @param options.excludedFields - Fields to exclude from the update (e.g., `['id', 'createdAt']`)
 * @param options.prefix - Prefix for nested object updates (default: 'Detail'). Set to empty string for no prefix.
 * @returns The updated item or nested object (based on prefix setting)
 *
 * @throws {ConditionalCheckFailedException} When the item doesn't exist in the table
 * @throws {Error} When the key object is empty
 *
 * @example
 * ```typescript
 * // Update a user profile (with default 'Detail' prefix)
 * const updated = await executeUpdate<UserProfile>(
 *   { name: 'John Doe', email: 'john@example.com', updatedAt: new Date().toISOString() },
 *   'MyTable',
 *   { Pk: 'User#123', Sk: 'Profile' }
 * );
 * // Returns: updated.name, updated.email, etc. from the Detail object
 *
 * // Update without prefix (top-level attributes)
 * const updated = await executeUpdate<User>(
 *   { status: 'active', lastLogin: Date.now() },
 *   'MyTable',
 *   { Pk: 'User#123', Sk: 'Metadata' },
 *   { prefix: '' }
 * );
 * // Returns: full item with top-level attributes
 *
 * // Exclude certain fields and add timestamp
 * const updated = await executeUpdate<Product>(
 *   { ...productData, updatedAt: new Date().toISOString() },
 *   'Products',
 *   { Pk: 'Product#456' },
 *   { excludedFields: ['id', 'createdAt'] }
 * );
 * ```
 */
export async function executeUpdate<T>(
  input: Record<string, unknown>,
  tableName: string,
  key: Record<string, unknown>,
  options: {
    client?: DynamoDBDocumentClient;
    excludedFields?: string[];
    prefix?: string;
  } = {},
): Promise<T> {
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = buildUpdateExpression(input, {
    excludedFields: options.excludedFields,
    prefix: options.prefix,
  });

  // Get the first key attribute name to use for existence check
  const firstKeyName = Object.keys(key)[0];
  if (!firstKeyName) {
    throw new Error('Key object must contain at least one attribute');
  }

  // Add the key attribute to ExpressionAttributeNames for the condition
  const conditionKeyAlias = '#__existsKey';
  ExpressionAttributeNames[conditionKeyAlias] = firstKeyName;

  const dynamoDBDocumentClient = options.client ?? getDynamoDBDocumentClient();
  const result = await dynamoDBDocumentClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression: `attribute_exists(${conditionKeyAlias})`,
      ReturnValues: 'ALL_NEW',
    }),
  );
  if (!result.Attributes) {
    throw new Error('Update failed: No attributes returned');
  }
  if (!options.prefix) {
    return result.Attributes as T;
  } else {
    return result.Attributes?.[options.prefix] as T;
  }
}

/**
 * Executes a DynamoDB put operation to create or replace an item in the table.
 *
 * This function puts an entire item into DynamoDB. By default, it will NOT overwrite
 * existing items (preventOverwrite is true by default). Set preventOverwrite to false
 * if you want to allow replacing existing items.
 *
 * @template T - The type of the returned item
 * @param item - The complete item to put into the table, including the primary key
 * @param tableName - The name of the DynamoDB table
 * @param key - The primary key of the item (e.g., `{ Pk: 'User#123', Sk: 'Profile' }`). Used for the preventOverwrite condition.
 * @param options - Configuration options
 * @param options.client - Custom DynamoDB Document Client instance (defaults to singleton client)
 * @param options.preventOverwrite - If true, the put will fail if an item with the same key already exists (default: true)
 * @param options.returnValues - Specify what values to return. 'NONE' (default) or 'ALL_OLD' to return the previous item
 * @returns The item that was put (or the old item if returnValues is 'ALL_OLD')
 *
 * @throws {ConditionalCheckFailedException} When preventOverwrite is true and the item already exists
 * @throws {Error} When the key object is empty
 *
 * @example
 * ```typescript
 * // Create a new user (will fail if already exists - default behavior)
 * const user = await executePut<User>(
 *   {
 *     Pk: 'User#123',
 *     Sk: 'Profile',
 *     Detail: {
 *       name: 'John Doe',
 *       email: 'john@example.com',
 *       createdAt: new Date().toISOString()
 *     }
 *   },
 *   'MyTable',
 *   { Pk: 'User#123', Sk: 'Profile' }
 * );
 * // Throws ConditionalCheckFailedException if User#123 already exists
 *
 * // Allow overwriting existing item
 * const user = await executePut<User>(
 *   {
 *     Pk: 'User#456',
 *     Sk: 'Profile',
 *     Detail: { name: 'Jane Doe', email: 'jane@example.com' }
 *   },
 *   'MyTable',
 *   { Pk: 'User#456', Sk: 'Profile' },
 *   { preventOverwrite: false }
 * );
 * // Will replace the item if User#456 already exists
 *
 * // Replace item and return the old version
 * const oldUser = await executePut<User>(
 *   {
 *     Pk: 'User#789',
 *     Sk: 'Profile',
 *     Detail: { name: 'Updated Name', email: 'updated@example.com' }
 *   },
 *   'MyTable',
 *   { Pk: 'User#789', Sk: 'Profile' },
 *   { preventOverwrite: false, returnValues: 'ALL_OLD' }
 * );
 * // Returns the previous item data
 * ```
 */
export async function executePut<T>(
  item: Record<string, unknown>,
  tableName: string,
  key: Record<string, unknown>,
  options: {
    client?: DynamoDBDocumentClient;
    preventOverwrite?: boolean;
    returnValues?: 'NONE' | 'ALL_OLD';
  } = {},
): Promise<T | undefined> {
  const {client, preventOverwrite = true, returnValues = 'NONE'} = options;

  const dynamoDBDocumentClient = client ?? getDynamoDBDocumentClient();

  const putCommandInput: PutCommandInput = {
    TableName: tableName,
    Item: item,
    ReturnValues: returnValues,
  };

  // Add condition to prevent overwriting existing items if requested
  if (preventOverwrite) {
    const keyNames = Object.keys(key);
    if (keyNames.length === 0) {
      throw new Error('Key object must contain at least one attribute');
    }

    // Build condition expression checking that ALL key attributes don't exist
    const keyConditions = keyNames.map((k) => `attribute_not_exists(${k})`);
    putCommandInput.ConditionExpression = keyConditions.join(' AND ');
  }

  const result = await dynamoDBDocumentClient.send(
    new PutCommand(putCommandInput),
  );

  // Return the old item if ALL_OLD was requested, otherwise return the item that was put
  if (returnValues === 'ALL_OLD') {
    return result.Attributes as T;
  }
  return item as T;
}

/**
 * Executes a DynamoDB delete operation to remove an item from the table.
 *
 * @param tableName - The name of the DynamoDB table
 * @param key - The primary key of the item to delete (e.g., `{ Pk: 'User#123', Sk: 'Profile' }`)
 * @param options - Configuration options
 * @param options.client - Custom DynamoDB Document Client instance (defaults to singleton client)
 *
 * @example
 * ```typescript
 * await executeDelete('MyTable', { Pk: 'User#123', Sk: 'Profile' });
 * ```
 */
export async function executeDelete(
  tableName: string,
  key: Record<string, unknown>,
  options: {
    client?: DynamoDBDocumentClient;
  } = {},
): Promise<void> {
  const dynamoDBDocumentClient = options.client ?? getDynamoDBDocumentClient();

  await dynamoDBDocumentClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: key,
    }),
  );
}

/**
 * Executes a DynamoDB get operation to retrieve an item from the table.
 *
 * @template T - The type of the returned item
 * @param tableName - The name of the DynamoDB table
 * @param key - The primary key of the item to retrieve (e.g., `{ Pk: 'User#123', Sk: 'Profile' }`)
 * @param options - Configuration options
 * @param options.client - Custom DynamoDB Document Client instance (defaults to singleton client)
 * @returns The item if found, or null if not found
 *
 * @example
 * ```typescript
 * const user = await executeGet<User>('MyTable', { Pk: 'User#123', Sk: 'Profile' });
 * ```
 */
export async function executeGet<T>(
  tableName: string,
  key: Record<string, unknown>,
  options: {
    client?: DynamoDBDocumentClient;
    prefix?: string | null;
  } = {},
): Promise<T | null> {
  const dynamoDBDocumentClient = options.client ?? getDynamoDBDocumentClient();

  const result = await dynamoDBDocumentClient.send(
    new GetCommand({
      TableName: tableName,
      Key: key,
    }),
  );

  const item = result.Item;
  if (options.prefix) {
    return (item?.[options.prefix] as T) ?? null;
  }
  if (options.prefix === null) {
    return (item as T) ?? null;
  }
  return (item?.Detail as T) ?? null;
}

/**
 * Executes a DynamoDB query on a secondary index and returns the first matching item.
 *
 * @template T - The type of the returned item
 * @param tableName - The name of the DynamoDB table
 * @param indexName - The name of the secondary index to query
 * @param key - The key attributes to query (e.g., `{ Gs1Pk: 'User#123' }` or `{ Gs1Pk: 'User#123', Gs1Sk: 'Profile' }`)
 * @param options - Configuration options
 * @param options.client - Custom DynamoDB Document Client instance (defaults to singleton client)
 * @returns The first matching item if found, or null if not found
 *
 * @example
 * ```typescript
 * // Query with just partition key
 * const user = await executeGetFromIndex<User>('MyTable', 'Gs1', { Gs1Pk: 'User#123' });
 *
 * // Query with partition and sort key
 * const user = await executeGetFromIndex<User>('MyTable', 'Gs1', { Gs1Pk: 'User#123', Gs1Sk: 'Profile' });
 * ```
 */
export async function executeGetFromIndex<T>(
  tableName: string,
  indexName: string,
  key: Record<string, unknown>,
  options: {
    client?: DynamoDBDocumentClient;
    prefix?: string | null;
  } = {},
): Promise<T | null> {
  const dynamoDBDocumentClient = options.client ?? getDynamoDBDocumentClient();

  // Build KeyConditionExpression and ExpressionAttributeValues from key object
  const keyConditions: string[] = [];
  const expressionAttributeValues: Record<string, unknown> = {};

  for (const [keyName, value] of Object.entries(key)) {
    keyConditions.push(`${keyName} = :${keyName}`);
    expressionAttributeValues[`:${keyName}`] = value;
  }

  const result = await dynamoDBDocumentClient.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: indexName,
      KeyConditionExpression: keyConditions.join(' AND '),
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: 1,
    }),
  );

  const item = result.Items?.[0];
  if (options.prefix) {
    return (item?.[options.prefix] as T) ?? null;
  }
  if (options.prefix === null) {
    return (item as T) ?? null;
  }
  return (item?.Detail as T) ?? null;
}
