# 👤 Umar — Home Feed & Reels

## Role
**Frontend Developer — Home Feed & Reels Module**

## Pages & Components

### Home Page (`/`)
- **File**: `src/app/[locale]/page.tsx`
- **Components**: `src/components/PostCard.tsx`, `src/components/Suggestions.tsx`, `src/components/StoryBar.tsx`

### Reels Page (`/reels`)
- **Route**: `src/app/[locale]/reels/page.tsx`

---

## What Was Built

### 1. Home Feed Page
- Instagram-style main feed with infinite scroll
- **Story Bar** at the top — horizontal scrollable row of user stories with gradient ring indicators
- **Post Cards** — full-featured post component:
  - User avatar and username header with follow button
  - Image/video media display with swipe support for multi-image posts
  - Double-click to like animation (heart overlay)
  - Action buttons: Like, Comment, Share, Save (Bookmark)
  - Like count display
  - Caption with "more" expand functionality
  - Comments preview with "View all X comments" link
  - Add comment input field
  - Relative timestamp ("2h", "1d", "3w")
- **Suggestions Panel** (right sidebar on desktop):
  - "Suggestions for you" with "See All" button
  - User suggestions with avatar, username, and "Follow" button
  - Optimistic follow/unfollow updates

### 2. Reels Page
- Full-screen vertical video feed (TikTok/Instagram Reels style)
- Video player with custom controls:
  - Play/Pause on tap
  - Mute/Unmute toggle
  - Progress bar
- Like, Comment, Share, Bookmark actions on each reel
- User info overlay (avatar, username, caption)
- Auto-play next reel on scroll
- Follow button on reel overlay

---

## Technologies Used
- **RTK Query** — post & reel data (`useGetPostsQuery`, `useGetReelsQuery`)
- **Optimistic Updates** — instant like/unlike, comment, follow/unfollow
- **Framer Motion** — double-tap heart animation, scroll transitions
- **Intersection Observer** — auto-play reels when in viewport
- **next-intl** — multilingual support

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Post/get-posts` | Get feed posts |
| GET | `/Post/get-reels` | Get reels |
| POST | `/Post/like-post` | Like/unlike a post |
| POST | `/Post/add-comment` | Add comment to post |
| DELETE | `/Post/delete-comment` | Delete a comment |
| POST | `/Post/view-post` | Mark post as viewed |
| POST | `/Post/add-post-favorite` | Save/unsave a post |
