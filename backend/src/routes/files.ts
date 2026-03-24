import { Router } from 'express';
import multer from 'multer';
import { query, queryOne } from '../db.js';
import { uploadFile, deleteFile } from '../storage.js';
import { config } from '../env.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

export interface FileRecord {
  id: string;
  room_id: string;
  uploader_uuid: string | null;
  filename: string;
  mime_type: string;
  size_bytes: number;
  storage_key: string;
  public_url: string;
  created_at: string;
  expires_at: string;
  deleted_at: string | null;
}

// GET /api/rooms/:slug/files
router.get('/rooms/:slug/files', async (req, res) => {
  try {
    const { slug } = req.params;

    const room = await queryOne<{ id: string }>(
      `SELECT id FROM rooms WHERE slug = $1`,
      [slug]
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const files = await query<FileRecord>(
      `SELECT id, room_id as "roomId", uploader_uuid as "uploaderUuid", 
              filename, mime_type as "mimeType", size_bytes as "sizeBytes",
              storage_key as "storageKey", public_url as "publicUrl",
              created_at as "createdAt", expires_at as "expiresAt", 
              deleted_at as "deletedAt"
       FROM files 
       WHERE room_id = $1 AND deleted_at IS NULL AND expires_at > now()
       ORDER BY created_at DESC`,
      [room.id]
    );

    res.json(files.map(f => ({
      id: f.id,
      roomId: f.room_id,
      uploaderUuid: f.uploader_uuid,
      filename: f.filename,
      mimeType: f.mime_type,
      sizeBytes: f.size_bytes,
      storageKey: f.storage_key,
      publicUrl: f.public_url,
      createdAt: f.created_at,
      expiresAt: f.expires_at,
    })));
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// POST /api/rooms/:slug/files
router.post('/rooms/:slug/files', upload.single('file'), async (req, res) => {
  try {
    const { slug } = req.params;
    const file = req.file;
    const uploaderUuid = req.body.uploaderUuid || null;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const room = await queryOne<{ id: string }>(
      `SELECT id FROM rooms WHERE slug = $1`,
      [slug]
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const storageKey = `${room.id}/${Date.now()}-${file.originalname}`;
    
    const { storageKey: sk, publicUrl } = await uploadFile({
      key: storageKey,
      contentType: file.mimetype,
      body: file.buffer,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.fileTtlDays);

    const result = await queryOne<FileRecord>(
      `INSERT INTO files (room_id, uploader_uuid, filename, mime_type, size_bytes, storage_key, public_url, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, room_id as "roomId", uploader_uuid as "uploaderUuid", 
                 filename, mime_type as "mimeType", size_bytes as "sizeBytes",
                 storage_key as "storageKey", public_url as "publicUrl",
                 created_at as "createdAt", expires_at as "expiresAt"`,
      [room.id, uploaderUuid, file.originalname, file.mimetype, file.size, sk, publicUrl, expiresAt.toISOString()]
    );

    if (!result) {
      return res.status(500).json({ error: 'Failed to save file record' });
    }

    res.json({
      id: result.id,
      roomId: result.room_id,
      uploaderUuid: result.uploader_uuid,
      filename: result.filename,
      mimeType: result.mime_type,
      sizeBytes: result.size_bytes,
      storageKey: result.storage_key,
      publicUrl: result.public_url,
      createdAt: result.created_at,
      expiresAt: result.expires_at,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// DELETE /api/files/:id
router.delete('/files/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const uploaderUuid = req.headers['x-uploader-uuid'] as string | undefined;

    const file = await queryOne<FileRecord>(
      `SELECT id, room_id, uploader_uuid, storage_key, deleted_at 
       FROM files WHERE id = $1`,
      [id]
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.deleted_at) {
      return res.status(400).json({ error: 'File already deleted' });
    }

    // Check if uploader matches (or no uploader UUID set)
    if (uploaderUuid && file.uploader_uuid && uploaderUuid !== file.uploader_uuid) {
      return res.status(403).json({ error: 'Not authorized to delete this file' });
    }

    // Soft delete in database
    await query(
      `UPDATE files SET deleted_at = now() WHERE id = $1`,
      [id]
    );

    // Delete from S3
    try {
      await deleteFile(file.storage_key);
    } catch (s3Error) {
      console.error('Error deleting file from S3:', s3Error);
      // Continue even if S3 deletion fails
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
