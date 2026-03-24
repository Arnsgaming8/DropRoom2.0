# DropRoom 2.0

Anonymous, room-based file sharing. No accounts. No hassle.

## Quick Start (Frontend Only - GitHub Pages)

The frontend is configured for deployment to GitHub Pages. To deploy:

1. Fork or push this repository to GitHub
2. Go to Repository Settings → Pages
3. Set Source to "Deploy from a branch"
4. Select branch "main" and folder "docs" (after building)
5. Or use GitHub Actions to build and deploy automatically

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend (Requires PostgreSQL + S3)

```bash
cd backend
npm install
# Configure .env with your database and S3 credentials
npm run dev
```

## Features

- **Anonymous**: No accounts required - identity via localStorage UUID
- **Room-based**: Create rooms to share files with others
- **Auto-expiry**: Files automatically expire after 7 days
- **Live Countdown**: Each file shows remaining time until expiration

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + PostgreSQL + S3 (Cloudflare R2)
