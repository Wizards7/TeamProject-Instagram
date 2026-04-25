# 👤 Iso — Messages & Chat

## Role
**Frontend Developer — Messaging Module**

## Pages & Components

### Messages Page (`/messages`)
- **File**: `src/app/[locale]/messages/page.tsx` (MessagesPage)
- **Route**: `src/app/[locale]/messages/page.tsx`

### Chat View
- **File**: `src/components/messages/ChatView.tsx`

### Empty Chat State
- **File**: `src/components/messages/EmptyChat.tsx`

---

## What Was Built

### 1. Messages Page (Conversation List)
- Instagram-style split layout: sidebar with conversation list + main chat area
- Real-time conversation list with user avatars, last message preview, and timestamps
- Search functionality to filter conversations
- "Requests" tab for message requests
- Unread message indicators
- Click to open individual conversations
- Empty state with "Send message" call-to-action button

### 2. Chat View (Individual Conversation)
- Full chat interface with message bubbles (sent = right/blue, received = left/gray)
- Chat header with user avatar, name, "Active now" status
- Video call and audio call buttons
- Message input with send button
- Support for text messages
- Voice message recording and playback
- Real-time message timestamps ("just now", "5m", "1h")
- "Seen" status indicator on sent messages
- Message actions on hover: Reply, Forward, Copy, Unsend
- Profile view link from chat header
- Delete chat functionality with confirmation modal

### 3. Empty Chat State
- Displayed when no conversation is selected
- Instagram-style illustration with "Your messages" title
- "Send private photos and messages to a friend or group" description
- "Send message" primary action button

---

## Technologies Used
- **RTK Query** — real-time chat data (`useGetChatsQuery`, `useSendMessageMutation`)
- **SignalR / Polling** — message updates
- **next-intl** — multilingual chat UI (English, Russian, Tajik)
- **Framer Motion** — smooth message animations
- **CSS Variables** — theme-aware styling (dark/light mode support)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/Chat/get-chats` | Get all conversations |
| POST | `/Chat/send-message` | Send a message |
| POST | `/Chat/create-chat` | Create new conversation |
| DELETE | `/Chat/delete-chat` | Delete a conversation |
