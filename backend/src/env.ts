import 'dotenv/config';

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: parseInt(getEnv('PORT', '4000'), 10),
  databaseUrl: getEnv('DATABASE_URL'),
  s3: {
    endpoint: getEnv('S3_ENDPOINT'),
    region: getEnv('S3_REGION', 'auto'),
    accessKeyId: getEnv('S3_ACCESS_KEY_ID'),
    secretAccessKey: getEnv('S3_SECRET_ACCESS_KEY'),
    bucket: getEnv('S3_BUCKET'),
  },
  fileTtlDays: parseInt(getEnv('FILE_TTL_DAYS', '7'), 10),
  corsOrigin: getEnv('CORS_ORIGIN', 'http://localhost:5173'),
};
