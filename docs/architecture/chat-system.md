# Chat System Architecture

This document provides a comprehensive technical overview of Quote.Vote's presence-aware chat system, inspired by early instant messenger paradigms (AIM/ICQ) but simplified for civic engagement use cases.

## Overview

The chat system enables real-time one-to-one and group conversations with presence awareness, typing indicators, read receipts, and moderation controls. It's built entirely with GraphQL subscriptions, MongoDB, and React—no external dependencies required.

### Key Features

- **Buddy List** - Display mutual connections with live presence states
- **Direct Messaging** - Lightweight two-user message threads
- **Group Chat Rooms** - Post-anchored group conversations
- **Presence System** - Real-time online/away/dnd/invisible status
- **Away Messages** - User-editable status text
- **Typing Indicators** - Real-time typing status per conversation
- **Read Receipts** - Track last message seen per user
- **Moderation** - Mutual opt-in DMs, blocklist, rate limiting

---

## System Architecture

### High-Level Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Server    │─────▶│  Database   │
│   (React)   │◀─────│  (GraphQL)  │◀─────│  (MongoDB)  │
└─────────────┘      └─────────────┘      └─────────────┘
        │                   │
        │                   │
        └─────WebSocket─────┘
      (Real-time Subscriptions)
```

### Component Interaction

1. **Client** sends GraphQL queries/mutations via Apollo Client
2. **Server** processes requests, updates MongoDB, publishes events
3. **Subscriptions** broadcast real-time updates to all connected clients
4. **Database** stores persistent data with TTL indexes for auto-cleanup

---

## Database Schema

### Presence Collection

Tracks user online status and heartbeat information.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (unique, indexed),
  status: enum['online', 'away', 'dnd', 'invisible', 'offline'],
  statusMessage: String (max 200 characters),
  lastHeartbeat: Date (indexed),
  lastSeen: Date,
  expiresAt: Date (TTL index - expires after 5 minutes)
}
```

**Indexes:**
- `userId`: Unique index
- `lastHeartbeat`: Index for stale presence detection
- `expiresAt`: TTL index (expires after 0 seconds, set to 5 minutes in future)

**Key Features:**
- Auto-expires stale presence after 5 minutes of no heartbeat
- Status can be `online`, `away`, `dnd`, `invisible`, or `offline`
- Custom status messages up to 200 characters
- TTL index automatically cleans up expired records

### Roster Collection

Manages buddy relationships and blocking status.

```javascript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  buddyId: ObjectId (indexed),
  status: enum['pending', 'accepted', 'blocked'],
  initiatedBy: ObjectId,
  created: Date,
  updated: Date
}
```

**Indexes:**
- Compound unique: `{ userId: 1, buddyId: 1 }`
- `{ userId: 1, status: 1 }` for efficient queries

**Status Flow:**
1. `pending` - Initial buddy request
2. `accepted` - Mutual acceptance (enables DMs)
3. `blocked` - User has blocked the other

**Reciprocal Entries:**
- When a buddy request is accepted, a reciprocal roster entry is automatically created
- Both entries must be `accepted` for direct messaging to work

### TypingIndicator Collection

Tracks active typing indicators per conversation.

```javascript
{
  _id: ObjectId,
  messageRoomId: ObjectId (indexed),
  userId: ObjectId (indexed),
  isTyping: Boolean,
  timestamp: Date
}
```

**Indexes:**
- `messageRoomId`: Index for room queries
- `userId`: Index for user queries
- TTL index: Expires after 10 seconds

**Key Features:**
- Auto-expires after 10 seconds of inactivity
- Automatically cleared when message is sent
- Used for real-time typing indicator display

### MessageRoom Collection (Enhanced)

Message rooms for both direct messages and group chats.

```javascript
{
  _id: ObjectId,
  users: [ObjectId] (indexed),
  postId: ObjectId (indexed, optional),
  messageType: enum['USER', 'POST'],
  isDirect: Boolean,
  created: Date,
  lastActivity: Date (indexed),
  lastSeenMessages: Map<userId, messageId>
}
```

**Indexes:**
- `{ users: 1, lastActivity: -1 }` for efficient room queries
- `postId`: Index for post-linked rooms

**Room Types:**
- **Direct Message (`USER`)**: Two-user conversations, requires mutual roster acceptance
- **Group Chat (`POST`)**: Post-anchored group conversations, auto-adds users

### Messages Collection (Enhanced)

Individual messages within rooms.

```javascript
{
  _id: ObjectId,
  messageRoomId: ObjectId (indexed),
  userId: ObjectId (indexed),
  title: String (optional),
  text: String (required),
  created: Date,
  readBy: [ObjectId],
  readByDetailed: [{
    userId: ObjectId,
    readAt: Date
  }],
  deliveredTo: [{
    userId: ObjectId,
    deliveredAt: Date
  }],
  deleted: Boolean (default: false)
}
```

**Read Receipt Tracking:**
- `readBy`: Simple array of user IDs who have read the message
- `readByDetailed`: Detailed tracking with timestamps
- `lastSeenMessages` in MessageRoom: Tracks last message seen per user

---

## GraphQL API

### Queries

#### Get Presence
```graphql
query getPresence($userId: String!) {
  getPresence(userId: $userId) {
    userId
    status
    statusMessage
    lastSeen
    lastHeartbeat
  }
}
```

#### Get Buddy List
```graphql
query getBuddyList {
  getBuddyList {
    _id
    user {
      _id
      name
      username
      avatar
    }
    presence {
      status
      statusMessage
      lastSeen
    }
    room {
      _id
      lastActivity
    }
    unreadMessages
  }
}
```

#### Get Roster
```graphql
query getRoster {
  getRoster {
    _id
    userId
    buddyId
    status
    initiatedBy
    created
    updated
    buddy {
      _id
      name
      username
      avatar
    }
    presence {
      status
      statusMessage
    }
  }
}
```

#### Get Typing Users
```graphql
query getTypingUsers($messageRoomId: String!) {
  getTypingUsers(messageRoomId: $messageRoomId) {
    userId
    user {
      _id
      name
      username
    }
    isTyping
    timestamp
  }
}
```

### Mutations

#### Update Presence
```graphql
mutation updatePresence($presence: PresenceInput!) {
  updatePresence(presence: $presence) {
    userId
    status
    statusMessage
    lastSeen
  }
}
```

**Input:**
```graphql
input PresenceInput {
  status: PresenceStatus!
  statusMessage: String
}
```

#### Heartbeat
```graphql
mutation heartbeat {
  heartbeat {
    timestamp
    status
  }
}
```

**Usage:** Called every 45 seconds to keep presence alive.

#### Clear Presence
```graphql
mutation clearPresence {
  clearPresence
}
```

**Usage:** Called on logout to mark user as offline.

#### Roster Management

**Add Buddy:**
```graphql
mutation addBuddy($roster: RosterInput!) {
  addBuddy(roster: $roster) {
    _id
    status
    buddy {
      _id
      name
    }
  }
}
```

**Accept/Decline Buddy:**
```graphql
mutation acceptBuddy($rosterId: String!) {
  acceptBuddy(rosterId: $rosterId) {
    _id
    status
  }
}

mutation declineBuddy($rosterId: String!) {
  declineBuddy(rosterId: $rosterId) {
    _id
  }
}
```

**Block/Unblock:**
```graphql
mutation blockBuddy($buddyId: String!) {
  blockBuddy(buddyId: $buddyId) {
    _id
    status
  }
}

mutation unblockBuddy($buddyId: String!) {
  unblockBuddy(buddyId: $buddyId) {
    _id
    status
  }
}
```

#### Typing Indicator
```graphql
mutation updateTyping($typing: TypingInput!) {
  updateTyping(typing: $typing) {
    success
  }
}
```

**Input:**
```graphql
input TypingInput {
  messageRoomId: String!
  isTyping: Boolean!
}
```

#### Read Receipts
```graphql
mutation updateMessageReadBy($messageRoomId: String!) {
  updateMessageReadBy(messageRoomId: $messageRoomId) {
    _id
    readBy
  }
}
```

### Subscriptions

#### Presence Updates
```graphql
subscription presence($userId: String) {
  presence(userId: $userId) {
    userId
    status
    statusMessage
    lastSeen
  }
}
```

**Usage:** Subscribe to all presence updates (pass `null` for `userId`) or specific user.

#### Roster Updates
```graphql
subscription roster($userId: String!) {
  roster(userId: $userId) {
    _id
    userId
    buddyId
    status
    buddy {
      _id
      name
      username
    }
  }
}
```

#### Typing Indicators
```graphql
subscription typing($messageRoomId: String!) {
  typing(messageRoomId: $messageRoomId) {
    messageRoomId
    userId
    user {
      _id
      name
      username
    }
    isTyping
    timestamp
  }
}
```

#### New Messages
```graphql
subscription newMessage($messageRoomId: String!) {
  message(messageRoomId: $messageRoomId) {
    _id
    messageRoomId
    userId
    userName
    text
    created
    type
  }
}
```

---

## Frontend Architecture

### Component Structure

```
client/src/components/
├── Chat/
│   ├── ChatContent.jsx          # Main chat container
│   ├── MessageBox.jsx           # Message display area
│   ├── MessageSend.jsx          # Message input with typing indicator
│   ├── MessageItem.jsx          # Individual message with read receipts
│   ├── TypingIndicator.jsx      # Real-time typing display
│   ├── StatusEditor.jsx         # Status/away message editor
│   ├── PresenceIcon.jsx         # Status indicator icon
│   └── StatusMessage.jsx        # Custom status message display
└── BuddyList/
    ├── BuddyListWithPresence.jsx # Main buddy list with presence
    └── BuddyItemList.jsx         # Individual buddy items
```

### Custom Hooks

#### usePresenceHeartbeat
Manages periodic presence heartbeat.

```javascript
usePresenceHeartbeat(interval = 45000) // 45 seconds
```

**Features:**
- Sends heartbeat every 45 seconds
- Automatically updates presence on mount
- Clears presence on unmount

#### usePresenceSubscription
Subscribes to presence updates and updates Redux store.

```javascript
usePresenceSubscription()
```

**Features:**
- Subscribes to all presence updates
- Automatically updates `presenceMap` in Redux
- Handles subscription errors gracefully

#### useTypingIndicator
Manages typing indicator state with debouncing.

```javascript
const { handleTyping, stopTyping } = useTypingIndicator(messageRoomId)
```

**Features:**
- Debounced typing updates (3 seconds)
- Automatically stops typing when message sent
- Clears on component unmount

#### useRosterManagement
Handles buddy list operations.

```javascript
const {
  addBuddy,
  acceptBuddy,
  declineBuddy,
  blockBuddy,
  unblockBuddy,
  removeBuddy
} = useRosterManagement()
```

### Redux Store

**Chat Slice State:**
```javascript
{
  buddyList: [],
  presenceMap: {}, // { userId: { status, statusMessage, lastSeen } }
  typingUsers: {}, // { messageRoomId: [userId1, userId2] }
  userStatus: 'online',
  userStatusMessage: '',
  pendingBuddyRequests: [],
  blockedUsers: [],
  statusEditorOpen: false,
  selectedRoom: null,
  open: false
}
```

**Key Reducers:**
- `SET_BUDDY_LIST` - Update buddy list
- `UPDATE_PRESENCE` - Update user presence
- `UPDATE_TYPING` - Update typing indicators
- `SET_USER_STATUS` - Update current user status

---

## Backend Architecture

### Resolver Structure

```
server/app/data/resolvers/
├── queries/
│   ├── presence/
│   │   ├── getPresence.js
│   │   ├── getBuddyList.js
│   │   └── getRoster.js
│   └── typing/
│       └── getTypingUsers.js
├── mutations/
│   ├── presence/
│   │   ├── updatePresence.js
│   │   ├── heartbeat.js
│   │   └── clearPresence.js
│   ├── roster/
│   │   ├── addBuddy.js
│   │   ├── acceptBuddy.js
│   │   ├── declineBuddy.js
│   │   ├── blockBuddy.js
│   │   ├── unblockBuddy.js
│   │   └── removeBuddy.js
│   ├── typing/
│   │   └── updateTyping.js
│   └── message/
│       ├── createMessage.js
│       └── updateMessageReadBy.js
└── subscriptions/
    ├── presence.js
    ├── roster.js
    └── typing.js
```

### Key Backend Features

#### Presence Service
- **Heartbeat System**: Clients send heartbeat every 45 seconds
- **TTL Index**: Auto-expires presence after 5 minutes
- **Stale Detection**: Checks if heartbeat is older than 2 minutes
- **Cleanup Job**: Background job runs every 2 minutes to mark stale presence as offline

#### Rate Limiting
- **In-Memory Rate Limiter**: 10 messages per minute per user
- **Automatic Cleanup**: Expired rate limit entries are removed
- **User-Friendly Errors**: Returns remaining time when limit exceeded

#### Blocklist Protection
- **Presence Hiding**: Blocked users see offline status
- **Message Blocking**: Blocked users cannot send messages
- **Validation**: Block checks on all relevant operations

#### Mutual Opt-in
- **Roster Validation**: Direct messages require mutual acceptance
- **Reciprocal Entries**: Auto-creates reciprocal roster on acceptance
- **Pending Requests**: Users must accept before messaging

---

## Data Flow Examples

### Presence Flow

1. User logs in → `updatePresence` mutation sets initial status
2. Client sends heartbeat every 45 seconds via `heartbeat` mutation
3. Server updates `lastHeartbeat` and `expiresAt` fields
4. Presence updates published via `presenceEvent` subscription
5. All subscribers receive real-time updates
6. If heartbeat stops for 2+ minutes, presence marked as offline
7. TTL index auto-deletes expired presence after 5 minutes

### Typing Indicator Flow

1. User types in message input
2. `useTypingIndicator` hook debounces (3 seconds)
3. Calls `updateTyping` mutation with `isTyping: true`
4. Backend creates/updates TypingIndicator document
5. Publishes `typingEvent` to all room participants
6. `TypingIndicator` component subscribes and displays status
7. Auto-expires after 10 seconds or when message sent
8. On message send, typing indicator automatically cleared

### Read Receipt Flow

1. User opens conversation
2. `updateMessageReadBy` mutation called
3. Server finds all unread messages in room
4. Marks messages as read by adding user ID to `readBy` array
5. Updates `lastSeenMessages` map in MessageRoom
6. Periodic refresh (every 5 seconds) keeps receipts current
7. Visual indicators (checkmarks) show on sent messages

### Roster/Buddy Flow

1. User searches and adds buddy → `addBuddy` creates pending roster entry
2. Recipient sees pending request in buddy list
3. Recipient accepts/declines → `acceptBuddy`/`declineBuddy` mutation
4. On acceptance:
   - Original roster entry status set to `accepted`
   - Reciprocal roster entry created automatically
   - Both users can now send DMs
5. Roster updates published via `rosterEvent` subscription
6. Both users' buddy lists update in real-time

---

## Performance Optimizations

### Database Indexes
- **Presence**: `userId` (unique), `lastHeartbeat`, `expiresAt` (TTL)
- **Roster**: `{ userId: 1, buddyId: 1 }` (unique), `{ userId: 1, status: 1 }`
- **TypingIndicator**: `messageRoomId`, `userId`, TTL index (10 seconds)
- **MessageRoom**: `{ users: 1, lastActivity: -1 }`, `postId`
- **Messages**: `messageRoomId`, `userId`

### TTL Indexes
- **Presence**: Auto-deletes after 5 minutes (via `expiresAt`)
- **TypingIndicator**: Auto-deletes after 10 seconds

### In-Memory Caching
- **Rate Limiter**: In-memory Map for fast lookups
- **Presence Map**: Redux store caches presence data
- **Typing Users**: Redux store caches active typing indicators

### Subscription Optimization
- **Debounced Typing**: Reduces server load from typing indicators
- **Selective Subscriptions**: Only subscribe to relevant data
- **Auto-Cleanup**: TTL indexes prevent database bloat

---

## Security & Moderation

### Blocklist Protection
- Blocked users cannot see presence (returns offline)
- Blocked users cannot send messages (validated on `createMessage`)
- Blocked users cannot see typing indicators
- Block checks performed on all relevant queries/mutations

### Rate Limiting
- **Message Sending**: 10 messages per minute per user
- **In-Memory Storage**: Fast lookups without database queries
- **Automatic Cleanup**: Expired entries removed automatically
- **User-Friendly Errors**: Returns remaining time in error message

### Mutual Opt-in
- Direct messages require mutual roster acceptance
- Pending requests must be accepted before messaging
- One-way roster entries don't enable messaging
- Blocked status prevents all communication

### Input Validation
- Status messages limited to 200 characters
- Message text required and validated
- User IDs validated on all operations
- Room existence validated before operations

---

## Error Handling

### Common Errors

**Rate Limit Exceeded:**
```javascript
{
  message: "Rate limit exceeded for sendMessage. Please try again in X seconds.",
  code: "RATE_LIMIT_EXCEEDED"
}
```

**User Blocked:**
```javascript
{
  message: "Cannot send message: user is blocked",
  code: "USER_BLOCKED"
}
```

**Roster Not Accepted:**
```javascript
{
  message: "Cannot send message: roster not accepted",
  code: "ROSTER_NOT_ACCEPTED"
}
```

### Error Recovery
- Subscription reconnection handled automatically
- Stale presence detection and cleanup
- Typing indicator auto-expiration
- Rate limit automatic reset

---

## Testing Considerations

### Manual Testing Checklist
- [ ] Buddy list displays with correct presence grouping
- [ ] Presence updates in real-time across multiple clients
- [ ] Status messages display correctly
- [ ] Typing indicators appear/disappear correctly
- [ ] Read receipts update when messages are viewed
- [ ] Direct messages require mutual acceptance
- [ ] Blocked users cannot message or see presence
- [ ] Rate limiting prevents spam
- [ ] Presence expires after inactivity
- [ ] Heartbeat keeps presence alive
- [ ] Post rooms auto-create and add users
- [ ] Status editor saves and updates correctly

### Edge Cases
- Stale presence detection and cleanup
- Typing indicator auto-expiration
- Blocklist validation on all operations
- Roster acceptance validation
- Rate limit enforcement
- TTL index expiration
- Subscription reconnection handling
- Multiple simultaneous clients per user

---

## Future Enhancements

### Planned Features
- Message search functionality
- Admin moderation hooks (delete, export, archive)
- Message reactions/emojis
- File attachments
- Message editing/deletion with timestamps
- Push notifications for offline users
- Presence history/activity logs

### Performance Improvements
- Redis-based presence caching (optional)
- Message pagination optimization
- Subscription connection pooling
- Batch presence updates

---

## Related Documentation

- [Database Schema](./database-schema.md) - Complete database documentation
- [Backend Architecture](./backend-architecture.md) - Backend overview
- [Frontend Architecture](./frontend-architecture.md) - Frontend overview
- [API Reference](../api/graphql-schema.md) - GraphQL schema reference

---

**Last Updated:** 2024  
**Maintainers:** Quote.Vote Team

