import { Router } from 'express';
import { customAlphabet } from 'nanoid';
import { query, queryOne } from '../db.js';

const router = Router();

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

export interface Room {
  id: string;
  slug: string;
  name: string | null;
  created_at: string;
  last_active_at: string | null;
}

// POST /api/rooms
router.post('/', async (req, res) => {
  try {
    const slug = nanoid(10);
    const name = req.body.name || null;

    const result = await queryOne<Room>(
      `INSERT INTO rooms (slug, name)
       VALUES ($1, $2)
       RETURNING id, slug, name, created_at as "createdAt", last_active_at as "lastActiveAt"`,
      [slug, name]
    );

    if (!result) {
      return res.status(500).json({ error: 'Failed to create room' });
    }

    res.json({
      id: result.id,
      slug: result.slug,
      name: result.name,
      createdAt: result.created_at,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// GET /api/rooms/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const room = await queryOne<Room>(
      `SELECT id, slug, name, created_at as "createdAt", last_active_at as "lastActiveAt"
       FROM rooms WHERE slug = $1`,
      [slug]
    );

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Update last_active_at
    await query(`UPDATE rooms SET last_active_at = now() WHERE id = $1`, [room.id]);

    res.json({
      id: room.id,
      slug: room.slug,
      name: room.name,
      createdAt: room.created_at,
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export default router;
