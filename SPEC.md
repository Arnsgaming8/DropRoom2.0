# DropRoom - Specification Document

## Project Overview
- **Project Name**: DropRoom
- **Type**: Anonymous file sharing web application
- **Core Functionality**: Room-based file sharing where users can create rooms, upload files, and share links. No authentication - all identity is anonymous and stored locally.
- **Target Users**: Anyone needing quick, anonymous file sharing without registration

## Technology Stack
- **Frontend**: React 19 + Next.js 16 (static export)
- **Styling**: TailwindCSS 4
- **Backend**: Firebase (Firestore + Firebase Storage)
- **Deployment**: GitHub Pages (static export)

## UI/UX Specification

### Color Palette
- **Background**: `#0a0a0f` (deep night)
- **Surface**: `#12121a` (card background)
- **Surface Elevated**: `#1a1a24` (hover states)
- **Border**: `#2a2a3a` (subtle borders)
- **Primary**: `#6366f1` (indigo)
- **Primary Hover**: `#818cf8`
- **Accent**: `#22d3ee` (cyan)
- **Text Primary**: `#f1f5f9`
- **Text Secondary**: `#94a3b8`
- **Text Muted**: `#64748b`
- **Danger**: `#ef4444`
- **Danger Hover**: `#f87171`
- **Success**: `#22c55e`

### Typography
- **Font Family**: 'DM Sans' (headings), 'JetBrains Mono' (room IDs, code)
- **Heading Sizes**: 
  - H1: 2.5rem (40px), weight 700
  - H2: 1.75rem (28px), weight 600
  - H3: 1.25rem (20px), weight 600
- **Body**: 1rem (16px), weight 400
- **Small**: 0.875rem (14px)
- **Room ID**: 0.875rem, monospace

### Spacing System
- Base unit: 4px
- Padding: 16px (cards), 24px (sections)
- Gap: 12px (items), 24px (sections)
- Border radius: 8px (cards), 6px (buttons), 12px (modals)

### Layout Structure

#### Homepage
```
┌─────────────────────────────────────────────────┐
│ [Sidebar Toggle]  DropRoom          [Create]   │ Header
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Saved    │        Hero Section                  │
│ Rooms    │   - Logo/Icon                        │
│          │   - "DropRoom" title                 │
│ [List    │   - Tagline                         │
│  of      │   - Create Room Button (Primary)    │
│  rooms]  │                                      │
│          │        How it works                  │
│          │   - Step 1, 2, 3                     │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

#### Room Page
```
┌─────────────────────────────────────────────────┐
│ [Sidebar]  Room: abc123      [Save] [Leave]    │ Header
├──────────┴──────────────────────────────────────┤
│                                                  │
│   ┌─────────────────────────────────────────┐   │
│   │         Upload Area                      │   │
│   │   Drag & drop or click to select        │   │
│   │   [Upload Files]                         │   │
│   └─────────────────────────────────────────┘   │
│                                                  │
│   Files (X)                                      │
│   ┌─────────────────────────────────────────┐   │
│   │ file.txt  1.2 MB  [Open] [DL] [X]       │   │
│   │ image.png 500 KB [Open] [DL] [X]        │   │
│   └─────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Components

#### Sidebar
- Width: 280px (expanded), 0px (collapsed)
- Toggle button: hamburger icon in header
- Saved rooms list with room ID and timestamp
- Remove button (X) on hover for each room
- Smooth slide animation (300ms)

#### Upload Area
- Dashed border, rounded corners
- Drag-over state: primary color border, slight background
- File input (hidden), clickable trigger
- Progress bar during upload
- Accept: any file type

#### File List Item
- File icon based on type (image, document, archive, other)
- Filename (truncated with ellipsis if too long)
- File size formatted (KB, MB, GB)
- Action buttons: Open, Download, Delete
- Delete button: only visible if uploaderId matches current user

#### Buttons
- Primary: Indigo background, white text, hover brightens
- Secondary: Transparent, border, hover fills
- Danger: Red background, white text
- Icon buttons: 32x32px, rounded

### Animations
- Sidebar slide: 300ms ease-in-out
- Button hover: 150ms
- File item appear: fade-in 200ms
- Upload progress: smooth width transition
- Card hover: subtle lift with shadow

## Functionality Specification

### 1. Anonymous User Identity
- On first visit, check localStorage for `droproom_userId`
- If not exists, generate UUID v4
- Store in localStorage
- Use this ID for all operations

### 2. Room System
- Create room: generate random 6-10 character alphanumeric ID
- Store in Firestore: `rooms/{roomId}` with createdAt timestamp
- Anyone with room URL can access
- No owner - rooms are communal

### 3. File Upload
- Select multiple files via drag-drop or file picker
- Upload to Firebase Storage: `files/{roomId}/{fileId}`
- Store metadata in Firestore: `files/{fileId}`
- Show progress during upload
- Refresh file list after upload completes

### 4. File Permissions
- **Open**: Any user can open (window.open with fileUrl)
- **Download**: Any user can download (anchor with download attribute)
- **Delete**: Only if `file.uploaderId === currentUserId`

### 5. Saved Rooms
- localStorage key: `droproom_savedRooms`
- Array of objects: `{ roomId, createdAt }`
- Add/remove via buttons
- Sidebar shows all saved rooms
- Click navigates to room

### 6. Routing
- `/` - Homepage with create room and sidebar
- `/room/[roomId]` - Room page with files

## Firebase Schema

### Firestore Collections

#### rooms/{roomId}
```json
{
  "roomId": "abc123",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### files/{fileId}
```json
{
  "fileId": "uuid",
  "roomId": "abc123",
  "uploaderId": "user-uuid",
  "fileName": "document.pdf",
  "fileSize": 1048576,
  "fileType": "application/pdf",
  "fileUrl": "https://firebasestorage...",
  "createdAt": "2024-01-15T10:35:00Z"
}
```

### Storage Structure
```
files/
├── {roomId}/
│   ├── {fileId}/
│   │   └── (file content)
```

## Acceptance Criteria

### Homepage
- [ ] Shows "Create Room" button prominently
- [ ] Sidebar displays saved rooms
- [ ] Clicking saved room navigates to it
- [ ] Sidebar can be collapsed/expanded

### Room Creation
- [ ] Generates unique 6-10 char room ID
- [ ] Stores room in Firestore
- [ ] Redirects to new room page

### File Upload
- [ ] Drag and drop works
- [ ] File picker works
- [ ] Multiple files can be uploaded
- [ ] Progress is shown during upload
- [ ] Files appear in list after upload

### File Operations
- [ ] Open button opens file in new tab
- [ ] Download button downloads file
- [ ] Delete button only shows for own files
- [ ] Delete removes from Storage and Firestore

### Saved Rooms
- [ ] Save button adds room to sidebar
- [ ] Remove button removes from sidebar
- [ ] Persists across page refreshes
- [ ] Works on both homepage and room page

### Deployment
- [ ] Builds with `next build`
- [ ] Outputs static files
- [ ] Works on GitHub Pages
