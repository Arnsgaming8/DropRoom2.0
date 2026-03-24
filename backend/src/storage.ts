import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './env.js';

const s3Client = new S3Client({
  endpoint: config.s3.endpoint,
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

export interface UploadResult {
  storageKey: string;
  publicUrl: string;
}

export async function uploadFile(params: {
  key: string;
  contentType: string;
  body: Buffer;
}): Promise<UploadResult> {
  const { key, contentType, body } = params;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      ContentType: contentType,
      Body: body,
    })
  );

  const publicUrl = `${config.s3.endpoint}/${config.s3.bucket}/${key}`;

  return {
    storageKey: key,
    publicUrl,
  };
}

export async function deleteFile(storageKey: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.s3.bucket,
      Key: storageKey,
    })
  );
}

export async function getPresignedUrl(storageKey: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.s3.bucket,
    Key: storageKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}
