# DropRoom 2.0 Infrastructure

## Overview

DropRoom is an anonymous, room-based file sharing application. This directory contains infrastructure configuration and deployment information.

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase, Neon, or Render)
- S3-compatible storage (Cloudflare R2, AWS S3)

## Environment Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   PORT=4000
   DATABASE_URL=postgres://...
   S3_ENDPOINT=...
   S3_REGION=...
   S3_ACCESS_KEY_ID=...
   S3_SECRET_ACCESS_KEY=...
   S3_BUCKET=...
   FILE_TTL_DAYS=7
   CORS_ORIGIN=http://localhost:5173
   ```

4. Run database migrations to create tables:
   ```sql
   CREATE TABLE rooms (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     slug TEXT UNIQUE NOT NULL,
     name TEXT,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     last_active_at TIMESTAMPTZ
   );

   CREATE TABLE files (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
     uploader_uuid TEXT,
     filename TEXT NOT NULL,
     mime_type TEXT NOT NULL,
     size_bytes BIGINT NOT NULL,
     storage_key TEXT NOT NULL,
     public_url TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
     expires_at TIMESTAMPTZ,
     deleted_at TIMESTAMPTZ
   );

   CREATE INDEX idx_files_room_id ON files(room_id);
   CREATE INDEX idx_files_expires_at ON files(expires_at);
   CREATE INDEX idx_files_deleted_at ON files(deleted_at);
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Cron Job

The cleanup job runs periodically to delete expired files. Set up a cron job to run:

```bash
cd backend && npm run cron
```

Recommended: Run every hour using system cron or a scheduler like cron-job.org.

## API Endpoints

- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:slug` - Get room info
- `GET /api/rooms/:slug/files` - List files in a room
- `POST /api/rooms/:slug/files` - Upload a file
- `DELETE /api/files/:id` - Delete a file (requires uploader UUID)
- `GET /api/health` - Health check

## Deployment

### Backend (Render/Heroku)

1. Set environment variables in the dashboard
2. Connect to PostgreSQL database
3. Set up S3-compatible storage (Cloudflare R2 recommended)
4. Deploy and start server

### Frontend (Vercel/Netlify)

1. Connect to GitHub repository
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set up environment variables if needed

## Architecture

- **Anonymous Identity**: Client UUID stored in localStorage
- **Room-based Sharing**: Files are organized by rooms with unique slugs
- **Automatic Expiration**: Files expire after configured TTL (default 7 days)
- **Soft Deletes**: Deleted files are marked but not immediately removed
- **S3 Storage**: Files stored in S3-compatible object storage
