# AIM-Style Chat System Implementation

## Overview
This implementation adds a purpose-built, presence-aware chat system to Quote.Vote inspired by early instant messenger paradigms (AIM/ICQ). The system enables real-time one-to-one and group conversations with presence, away messages, typing indicators, and read receipts.

## Features Implemented

### ✅ Core Features

1. **Buddy List (Roster System)**
   - Display mutual connections with live presence states
   - Status indicators: online, away, dnd, invisible, offline
   - Grouped by presence status
   - Real-time presence updates via subscriptions

2. **Direct Messaging**
   - Lightweight two-user message threads
   - Built on existing message infrastructure
   - Enhanced with read receipts

3. **Rooms**
   - Group chats anchored to posts (one room per quote)
   - Leverages existing MessageRoom model

4. **Status / Away Messages**
   - User-editable status text (max 200 characters)
   - Examples: "Out for lunch," "In meeting"
   - Visible to all contacts

5. **Typing Indicators**
   - Real-time broadcast when participants are typing
   - Auto-expire after 10 seconds
   - Rate-limited to prevent abuse

6. **Read Receipts**
   - Track when each user read each message
   - Display last read message per user
   - Enhanced Message model with readBy array

7. **Presence Service**
   - Low-latency status updates
   - Heartbeat every 30 seconds
   - TTL-based expiration (2 minutes)
   - MongoDB TTL indexes for automatic cleanup

8. **Moderation Controls**
   - Mutual roster acceptance required before DMs
   - Blocklist functionality
   - Message rate limiting (30 messages/minute)
   - Typing rate limiting (60 updates/minute)
   - Presence update rate limiting (120 updates/minute)

## Technical Architecture

### Backend (Node.js / GraphQL / MongoDB)

#### New Models
- **PresenceModel**: User presence status with TTL
- **RosterModel**: Buddy list/contact management
- **TypingIndicatorModel**: Real-time typing status with TTL
- **BlocklistModel**: User blocking functionality
- **RateLimitModel**: Rate limiting with TTL

#### Enhanced Models
- **MessageModel**: Updated readBy field to track read timestamps

#### GraphQL Schema
- **Mutations**: 8 new mutations for presence, roster, blocking, typing
- **Queries**: 7 new queries for fetching presence, roster, blocklist
- **Subscriptions**: 3 new subscriptions for real-time updates

#### Services
- **presenceService.js**: Manages presence updates and heartbeats
- **rateLimiter.js**: Enforces rate limits on actions

### Frontend (React / Material-UI)

#### Components
- **ChatSidebar**: Main chat UI wrapper with responsive behavior
  - Desktop: 360px persistent drawer on right
  - Mobile: Full-screen temporary drawer with FAB
- **BuddyListPanel**: Displays contacts grouped by presence
- **StatusEditor**: Dialog for updating status and away message
- **PresenceHeartbeat**: Background service for heartbeat

#### UI Integration
- **Navbar**: Chat icon button (desktop) and menu item (mobile)
- **Layout**: Integrated into Scoreboard layout with state management
- **Responsive**: Adapts to screen size with appropriate UX patterns

#### GraphQL Integration
- Queries for fetching roster, presence, blocklist
- Mutations for updating presence, managing contacts, blocking
- Subscriptions for real-time presence updates

## API Reference

### Mutations

```graphql
# Update user presence status
updatePresence(presence: PresenceInput!): Presence

# Send heartbeat to keep presence alive
sendHeartbeat: Presence

# Add a contact to roster
addRosterContact(roster: RosterInput!): Roster

# Accept a roster contact request
acceptRosterContact(contactUserId: String!): Roster

# Block a user
blockUser(block: BlockUserInput!): Blocklist

# Unblock a user
unblockUser(blockedUserId: String!): JSON

# Update typing indicator
updateTypingIndicator(typing: TypingInput!): TypingIndicator

# Mark messages as read
markMessagesAsRead(conversationId: String!): [Message]
```

### Queries

```graphql
# Get user presence
getUserPresence(userId: String!): Presence

# Get presence for multiple users (buddy list)
getBuddyListPresence(userIds: [String!]!): [Presence]

# Get user roster (contacts)
getUserRoster: [Roster]

# Get pending roster requests
getPendingRosterRequests: [Roster]

# Get user blocklist
getUserBlocklist: [Blocklist]

# Check if user is blocked
isUserBlocked(userId: String!): Boolean

# Get typing indicators for conversation
getTypingIndicators(conversationId: String!): [TypingIndicator]
```

### Subscriptions

```graphql
# Subscribe to presence updates
presenceUpdate(userId: String!): Presence

# Subscribe to typing indicator updates
typingUpdate(conversationId: String!): TypingIndicator

# Subscribe to roster updates
rosterUpdate(userId: String!): Roster
```

## Usage Examples

### Frontend: Integrated Chat UI (Current Implementation)

The chat system is now fully integrated into the main application:

```jsx
// In Scoreboard.jsx layout
import { ChatSidebar, PresenceHeartbeat } from '../components/Chat';

function Scoreboard() {
  const [chatOpen, setChatOpen] = useState(false);
  const loggedIn = useSelector((state) => !!state.user.data._id);

  return (
    <>
      <MainNavBar onChatToggle={() => setChatOpen(!chatOpen)} />
      {loggedIn && <PresenceHeartbeat />}
      {loggedIn && <ChatSidebar open={chatOpen} onClose={() => setChatOpen(false)} />}
      {/* Rest of app */}
    </>
  );
}
```

**Desktop Experience:**
- Chat icon in navbar (top-right)
- Click to open 360px sidebar from right
- Persistent drawer stays open until closed

**Mobile Experience:**
- Floating Action Button (bottom-right)
- "Chat" option in hamburger menu
- Full-screen drawer with swipe-to-dismiss

### Frontend: Standalone Buddy List (Alternative)

```jsx
import { BuddyListPanel } from '../components/Chat';

function ChatPage() {
  const handleSelectContact = (contact) => {
    // Open chat window with contact
    console.log('Selected contact:', contact);
  };

  return <BuddyListPanel onSelectContact={handleSelectContact} />;
}
```

### Frontend: Update Status

```jsx
import { StatusEditor } from '../components/Chat';
import { useState } from 'react';

function UserProfile() {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setStatusDialogOpen(true)}>
        Update Status
      </Button>
      <StatusEditor
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        currentStatus="online"
        currentAwayMessage=""
      />
    </>
  );
}
```

### Frontend: Send Heartbeat

```jsx
import { PresenceHeartbeat } from '../components/Chat';

function App() {
  return (
    <>
      <PresenceHeartbeat />
      {/* Rest of your app */}
    </>
  );
}
```

## Database Indexes

The following indexes are automatically created:

- **Presence**: TTL index on `lastHeartbeat` (120 seconds)
- **TypingIndicator**: TTL index on `lastTypingAt` (10 seconds)
- **RateLimit**: TTL index on `expiresAt`
- **Roster**: Compound unique index on `userId` + `contactUserId`
- **Blocklist**: Compound unique index on `userId` + `blockedUserId`

## Security & Rate Limiting

### Rate Limits
- **Messages**: 30 per minute
- **Presence Updates**: 120 per minute (2 per second)
- **Typing Indicators**: 60 per minute

### Access Controls
- Mutual roster acceptance required before DMs
- Blocked users cannot send messages or see presence
- Authentication required for all chat operations

## Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## Future Enhancements (Stretch Goals)

- [ ] Message search functionality
- [ ] Admin moderation hooks (delete, export, archive)
- [ ] Message history pagination
- [ ] File/image sharing in messages
- [ ] Voice/video call integration
- [ ] Push notifications for offline messages
- [ ] Message encryption

## Migration Notes

### Existing Data
- Existing messages will have empty `readBy` arrays
- Existing users will have no presence records (created on first heartbeat)
- No data migration required

### Backward Compatibility
- All existing message functionality remains intact
- New features are additive, not breaking

## Performance Considerations

- TTL indexes automatically clean up stale data
- Presence polling every 30 seconds reduces server load
- Rate limiting prevents abuse
- Subscriptions use filtered pub/sub for efficiency

## Troubleshooting

### Presence not updating
- Check that heartbeat is being sent every 30 seconds
- Verify MongoDB TTL index is active
- Check for rate limiting errors

### Messages not marked as read
- Ensure `markMessagesAsRead` mutation is called when viewing messages
- Check authentication token is valid

### Typing indicators not showing
- Verify subscription is active
- Check that typing updates are being sent
- Ensure rate limits are not exceeded

## Contributors

This implementation follows the specification in Issue #181 and incorporates best practices from early instant messenger systems while adapting them for modern civic engagement use cases.
