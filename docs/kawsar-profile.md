# 👤 Kawsar — Profile Page

## Role
**Frontend Developer — User Profile Module**

## Pages & Components

### Profile Page (`/profile`)
- **File**: `src/components/ProfileUi/profileUi.tsx`
- **Route**: `src/app/[locale]/profile/page.tsx`

### Other User Profile (`/profile/:id`)
- Same component with dynamic user loading

### Follow Modal
- **File**: `src/components/FollowModal.tsx`

### Saved Page (`/saved`)
- **File**: `src/components/SavedUi.tsx`
- **Route**: `src/app/[locale]/saved/page.tsx`

---

## What Was Built

### 1. Profile Page
- Complete Instagram-style profile layout:
  - **Profile Header**: Avatar with story ring, username, settings gear icon
  - **Stats Row**: Posts count, Followers count (clickable), Following count (clickable)
  - **Bio Section**: First name, Last name, bio text
  - **Action Buttons**:
    - Own profile: "Edit Profile", "View Archive"
    - Other user: "Follow/Following", "Message"
  - **Story Highlights**: Horizontal scrollable row with story thumbnails and relative timestamps
  - **Content Tabs**: POSTS | REELS | SAVED (tabs with Instagram-style icons)

### 2. Post Grid
- 3-column square grid layout (matching Instagram exactly)
- Hover overlay showing like count and comment count
- Video indicator icon for video posts
- Click to open Post Detail Modal

### 3. Post Detail Modal
- Full post view with media (image/video) on left, details on right
- Custom video player with play/pause, mute, progress bar
- Like/unlike with optimistic updates
- Comment section with all comments
- Add comment input
- Follow/Unfollow button
- User avatar and username linking to their profile
- Close on backdrop click or X button

### 4. Follow/Followers Modal
- Modal showing list of followers or following users
- User avatars, usernames, and full names
- Navigate to any user's profile by clicking their name
- Close button

### 5. Edit Profile
- Update first name, last name, username, bio, gender
- Upload/change profile avatar image
- Delete profile image option

### 6. Story Integration
- View stories by clicking the profile avatar
- Add new story (image/video upload)
- Story viewer with full-screen display
- Delete own stories

### 7. Saved Posts Page
- Accessible from sidebar "More" → "Saved" and profile hamburger menu
- Grid display of all bookmarked/saved posts
- Click to open post detail modal
- Empty state with bookmark icon and description

---

## Technologies Used
- **RTK Query** — profile, posts, followers, following, stories data
- **Optimistic Updates** — instant follow/unfollow, like/unlike
- **React Hook Form** — edit profile form
- **Framer Motion** — modal animations, tab transitions
- **next-intl** — multilingual profile labels
- **FormData API** — avatar and story image uploads

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/UserProfile/get-my-profile` | Get own profile |
| GET | `/UserProfile/get-user-profile-by-id` | Get other user's profile |
| PUT | `/UserProfile/update-user-profile` | Update profile info |
| PUT | `/UserProfile/update-user-image-profile` | Update avatar |
| DELETE | `/UserProfile/delete-user-image-profile` | Remove avatar |
| GET | `/Post/get-my-posts` | Get own posts |
| GET | `/UserProfile/get-post-favorites` | Get saved posts |
| GET | `/FollowingRelationShip/get-subscribers` | Get followers list |
| GET | `/FollowingRelationShip/get-subscriptions` | Get following list |
| POST | `/FollowingRelationShip/add-following-relation-ship` | Follow a user |
| DELETE | `/FollowingRelationShip/delete-following-relation-ship` | Unfollow a user |
| GET | `/UserProfile/get-is-follow-user-profile-by-id` | Check if following |
| GET | `/Story/get-my-stories` | Get own stories |
| GET | `/Story/get-stories-by-user-id` | Get user's stories |
| POST | `/Story/add-story` | Upload new story |
