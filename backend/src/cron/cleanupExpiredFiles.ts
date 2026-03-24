import 'dotenv/config';
import { query } from '../db.js';
import { deleteFile } from '../storage.js';

const BATCH_SIZE = 500;

async function cleanupExpiredFiles() {
  console.log('Starting expired files cleanup...');

  try {
    // Find expired files
    const expiredFiles = await query<{ id: string; storage_key: string }>(
      `SELECT id, storage_key as "storageKey" 
       FROM files 
       WHERE deleted_at IS NULL AND expires_at < now() 
       LIMIT $1`,
      [BATCH_SIZE]
    );

    console.log(`Found ${expiredFiles.length} expired files to delete`);

    for (const file of expiredFiles) {
      try {
        // Delete from S3
        await deleteFile(file.storage_key);
      } catch (s3Error) {
        console.error(`Error deleting file ${file.id} from S3:`, s3Error);
      }

      // Soft delete in database
      await query(
        `UPDATE files SET deleted_at = now() WHERE id = $1`,
        [file.id]
      );

      console.log(`Deleted file: ${file.id}`);
    }

    console.log(`Cleanup complete. Processed ${expiredFiles.length} files.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }

  process.exit(0);
}

cleanupExpiredFiles();
