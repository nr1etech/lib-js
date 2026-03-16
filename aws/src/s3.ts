import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  S3ServiceException,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';

/**
 * Re-exporting commands to be helpful so clients may not have to import the AWS SDK directly.
 */
export {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3ServiceException,
  ListObjectsV2Command,
};

const clients: Record<string, S3Client> = {};

export function getS3Client(region?: string) {
  let client = clients[region ?? 'unspecified'];
  if (!client) {
    client = new S3Client({region});
    clients[region ?? 'unspecified'] = client;
  }
  return client;
}

export interface PutFileInput {
  bucketName: string;
  key: string;
  data: Buffer;
  contentType: string;
  region?: string;
}

export async function putFile(input: PutFileInput) {
  await getS3Client(input.region).send(
    new PutObjectCommand({
      Bucket: input.bucketName,
      Key: input.key,
      Body: input.data,
      ContentType: input.contentType,
    }),
  );
}

export interface GetSignedGetObjectUrlInput {
  bucketName: string;
  key: string;
  region?: string;
  expiresIn?: number;
}

export async function getSignedGetObjectUrl(
  input: GetSignedGetObjectUrlInput,
): Promise<string> {
  const client = getS3Client(input.region);
  const command = new GetObjectCommand({
    Bucket: input.bucketName,
    Key: input.key,
  });
  return await getSignedUrl(client, command, {
    expiresIn: input.expiresIn ?? 300, // Default is 5 minutes
  });
}

export interface GetSignedPutObjectUrlInput {
  bucketName: string;
  key: string;
  contentType: string;
  region?: string;
  expiresIn?: number;
  metadata?: Record<string, string>;
}

export async function getSignedPutObjectUrl(
  input: GetSignedPutObjectUrlInput,
): Promise<string> {
  const client = getS3Client(input.region);
  const comment = new PutObjectCommand({
    Bucket: input.bucketName,
    Key: input.key,
    Metadata: input.metadata,
    ContentType: input.contentType,
  });
  return await getSignedUrl(client, comment, {
    expiresIn: input.expiresIn ?? 300, // Default is 5 minutes
  });
}

export interface GetObjectInput {
  bucketName: string;
  key: string;
  region?: string;
}

export interface GetObjectOutput {
  buffer: Buffer;
  fileName: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export async function getFile(
  input: GetObjectInput,
): Promise<GetObjectOutput | null> {
  try {
    const response = await getS3Client(input.region).send(
      new GetObjectCommand({
        Bucket: input.bucketName,
        Key: input.key,
      }),
    );

    // stream the body into a Buffer
    const stream = response.Body as NodeJS.ReadableStream;
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const fileName = input.key.split('/').pop() || input.key;

    return {
      fileName,
      buffer: Buffer.concat(chunks),
      contentType: response.ContentType ?? undefined,
      metadata: response.Metadata,
    };
  } catch (err) {
    // err may be an S3ServiceException
    if (err instanceof S3ServiceException && err.name === 'NoSuchKey') {
      // not found — return null or handle as you like
      return null;
    }
    // re-throw other errors
    throw err;
  }
}

export interface ListObjectsInput {
  bucketName: string;
  prefix: string;
  region?: string;
}

export interface S3ObjectInfo {
  key: string;
  fileName: string;
  contentType?: string;
  metadata?: Record<string, string>;
  lastModified?: Date;
  size?: number;
}

export async function listObjectsWithMetadata(
  input: ListObjectsInput,
): Promise<S3ObjectInfo[]> {
  const client = getS3Client(input.region);

  // First, list all objects with the prefix
  const listResponse = await client.send(
    new ListObjectsV2Command({
      Bucket: input.bucketName,
      Prefix: input.prefix,
    }),
  );

  if (!listResponse.Contents || listResponse.Contents.length === 0) {
    return [];
  }

  // For each object, get its metadata by making a HEAD request (GetObjectCommand without Body)
  const objectInfoPromises = listResponse.Contents.map(async (obj) => {
    if (!obj.Key) return null;

    try {
      const headResponse = await client.send(
        new GetObjectCommand({
          Bucket: input.bucketName,
          Key: obj.Key,
        }),
      );

      const fileName = obj.Key.split('/').pop() || obj.Key;

      return {
        key: obj.Key,
        fileName,
        contentType: headResponse.ContentType,
        metadata: headResponse.Metadata,
        lastModified: obj.LastModified,
        size: obj.Size,
      };
    } catch (err) {
      // If we can't get metadata for an object, skip it
      console.warn(`Failed to get metadata for ${obj.Key}:`, err);
      return null;
    }
  });

  const results = await Promise.all(objectInfoPromises);
  return results.filter((result) => result !== null) as S3ObjectInfo[];
}
