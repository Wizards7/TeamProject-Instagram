# 👤 Abubakr — Create Post

## Role
**Frontend Developer — Post Creation Module**

## Pages & Components

### Create Post Modal
- **File**: `src/components/createPost/CreatePostModal.tsx`
- **Triggered from**: Sidebar "Create" button (`src/components/navBar/SidebarUi.tsx`)

---

## What Was Built

### 1. Create Post Modal
- Full-screen Instagram-style modal overlay with backdrop blur
- Multi-step post creation wizard:

#### Step 1: Media Upload
- Drag & drop zone for image/video upload
- File input with click-to-browse
- Support for multiple image formats (JPEG, PNG, WebP)
- Support for video formats (MP4, MOV, WebM)
- Image preview after selection
- Video preview with thumbnail

#### Step 2: Edit & Filter
- Image cropping and aspect ratio selection
- Preview of uploaded media
- Ability to add multiple images (carousel post)

#### Step 3: Caption & Share
- Text area for post caption
- Character count
- Location tagging (optional)
- Share button to publish the post
- Loading state during upload

### 2. Post Upload Flow
- FormData construction with image(s) and caption
- Upload progress indication
- Success feedback with automatic modal close
- Feed auto-refresh after successful post (cache invalidation)
- Error handling with user-friendly error messages

### 3. Integration Points
- Accessible from the Sidebar "+" (Create) button
- Modal opens with `AnimatePresence` animation from Framer Motion
- After posting, the new post appears immediately in the Home feed
- Post count updates automatically on the Profile page

---

## Technologies Used
- **RTK Query** — post upload (`useAddPostMutation`)
- **FormData API** — multipart file upload
- **Framer Motion** — modal open/close animations with `AnimatePresence`
- **React useState** — multi-step wizard state management
- **File API** — client-side image/video preview before upload

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/Post/add-post` | Upload new post (FormData with image + caption) |

## Cache Invalidation
After successful post creation, the following RTK Query tags are invalidated:
- `"Post"` — refreshes the home feed
- `"Profile"` — updates the post count on profile
