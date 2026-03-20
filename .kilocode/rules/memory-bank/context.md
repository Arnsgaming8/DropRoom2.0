# Active Context: DropRoom - Anonymous File Sharing App

## Current State

**Project Status**: ✅ Complete

DropRoom is a fully functional anonymous room-based file sharing web app. It's built with Next.js 16 (static export), TailwindCSS 4, and Firebase (Firestore + Storage).

## Recently Completed

- [x] Next.js 16 static export configuration for GitHub Pages
- [x] Firebase Firestore integration for rooms and files
- [x] Firebase Storage integration for file uploads
- [x] Anonymous user identity with UUID stored in localStorage
- [x] Room creation and management
- [x] File upload with progress tracking
- [x] File listing with open/download/delete functionality
- [x] Delete permissions (only uploader can delete)
- [x] Saved rooms sidebar with localStorage persistence
- [x] Collapsible sidebar UI
- [x] Modern dark theme UI

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/firebase.ts` | Firebase initialization | ✅ |
| `src/lib/rooms.ts` | Room CRUD operations | ✅ |
| `src/lib/files.ts` | File upload/list/delete | ✅ |
| `src/lib/storage.ts` | localStorage utilities | ✅ |
| `src/lib/room.ts` | Helper functions | ✅ |
| `src/components/Header.tsx` | App header | ✅ |
| `src/components/Sidebar.tsx` | Saved rooms sidebar | ✅ |
| `src/components/UploadArea.tsx` | File upload area | ✅ |
| `src/components/FileList.tsx` | File listing UI | ✅ |
| `src/app/page.tsx` | Homepage | ✅ |
| `src/app/room/[roomId]/page.tsx` | Room page server wrapper | ✅ |
| `src/app/room/[roomId]/RoomClient.tsx` | Room page client component | ✅ |
| `.env.example` | Firebase config template | ✅ |
| `SPEC.md` | Full specification | ✅ |

## Firebase Schema

### Firestore Collections
- `rooms/{roomId}` - Room metadata
- `files/{fileId}` - File records with metadata

### Storage Structure
- `files/{roomId}/{fileId}/{fileName}` - Uploaded files

## Deployment

The app outputs to `out/` directory and is ready for GitHub Pages deployment. Configure Firebase environment variables in GitHub Secrets:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Session History

| Date | Changes |
|------|---------|
| 2026-03-20 | Complete DropRoom implementation |

## Pending Improvements

- [ ] CI/CD workflow for GitHub Pages deployment
