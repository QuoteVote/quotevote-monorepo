# Conversation Models and Testing Guide

## Overview
This document describes the new Conversation and ConversationMessage models, along with testing procedures for both the models and the presence feature.

---

## New Mongoose Models

### 1. ConversationModel
**Location**: `server/app/data/resolvers/models/ConversationModel.js`

A Mongoose model for managing conversations between users.

#### Schema Fields
```javascript
{
  participantIds: [ObjectId],  // Array of user IDs in the conversation (indexed)
  isRoom: Boolean,             // true for group chats, false for direct messages
  postId: ObjectId,            // Optional: associated post ID for post-based conversations
  createdAt: Date              // Timestamp when conversation was created
}
```

#### Indexes
- **Single Index**: `participantIds` (ascending)
- **Compound Index**: `participantIds` + `createdAt` (descending) - for efficient participant queries sorted by time

#### Usage Example
```javascript
import ConversationModel from './models/ConversationModel';

// Create a direct conversation
const conversation = new ConversationModel({
  participantIds: [userId1, userId2],
  isRoom: false,
});
await conversation.save();

// Create a room conversation
const roomConversation = new ConversationModel({
  participantIds: [userId1, userId2, userId3],
  isRoom: true,
  postId: somePostId,
});
await roomConversation.save();

// Find conversations for a user
const userConversations = await ConversationModel.find({
  participantIds: userId,
}).sort({ createdAt: -1 });
```

---

### 2. ConversationMessageModel
**Location**: `server/app/data/resolvers/models/ConversationMessageModel.js`

A Mongoose model for managing messages within conversations.

#### Schema Fields
```javascript
{
  conversationId: ObjectId,  // Reference to Conversation (indexed)
  authorId: ObjectId,        // Reference to User who sent the message
  body: String,              // Message content
  createdAt: Date,           // Timestamp when message was created
  editedAt: Date             // Optional: timestamp when message was last edited
}
```

#### References
- `conversationId` → `Conversation` model
- `authorId` → `User` model

#### Indexes
- **Single Index**: `conversationId` (ascending)
- **Compound Index**: `conversationId` + `createdAt` (descending) - for efficient message retrieval sorted by time

#### Usage Example
```javascript
import ConversationMessageModel from './models/ConversationMessageModel';

// Create a message
const message = new ConversationMessageModel({
  conversationId: conversationId,
  authorId: userId,
  body: 'Hello, this is a message!',
});
await message.save();

// Get messages for a conversation
const messages = await ConversationMessageModel.find({
  conversationId: conversationId,
}).sort({ createdAt: 1 });

// Edit a message
await ConversationMessageModel.findByIdAndUpdate(
  messageId,
  {
    $set: {
      body: 'Updated message content',
      editedAt: new Date(),
    },
  }
);
```

---

## Testing

### Unit Tests

#### Conversation Model Tests
**Location**: `server/tests/models/conversation.test.js`

**Test Coverage**:
- ✅ Schema validation with required fields
- ✅ Optional postId field
- ✅ Default values (isRoom, createdAt)
- ✅ Query operations (find, findOne)
- ✅ Room vs direct conversation filtering
- ✅ Index verification

**Run Tests**:
```bash
cd server
npm test -- tests/models/conversation.test.js
```

#### ConversationMessage Model Tests
**Location**: `server/tests/models/conversationMessage.test.js`

**Test Coverage**:
- ✅ Schema validation with required fields
- ✅ Optional editedAt field
- ✅ Default createdAt value
- ✅ Query operations by conversationId and authorId
- ✅ Update operations (editing messages)
- ✅ Index verification
- ✅ Model reference verification

**Run Tests**:
```bash
cd server
npm test -- tests/models/conversationMessage.test.js
```

---

### Integration Tests

#### Presence Feature Integration Tests
**Location**: `server/tests/integration/presence.integration.test.js`

**Test Coverage**:
- ✅ End-to-end presence flow (set, retrieve, verify TTL)
- ✅ Retrieve all online users
- ✅ Multiple users with different statuses
- ✅ Update existing presence
- ✅ Error handling
- ✅ TTL verification (120 seconds)
- ✅ Pub/Sub integration

**Run Tests**:
```bash
cd server
npm test -- tests/integration/presence.integration.test.js
```

---

### Manual Testing

#### Manual Model Test Script
**Location**: `server/manual-test-models.js`

A comprehensive manual test script that verifies all model functionality against a real MongoDB database.

**What it tests**:
1. Creating conversations (direct and room)
2. Creating messages
3. Querying messages by conversation
4. Editing messages
5. Finding conversations by participant
6. Verifying indexes
7. Cleanup

**Run Manual Tests**:
```bash
cd server
node manual-test-models.js
```

**Prerequisites**:
- MongoDB running locally or connection string in `DATABASE_URL` environment variable
- Default connection: `mongodb://localhost:27017/quotevote-test`

**Expected Output**:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📝 Test 1: Creating a conversation...
✅ Conversation created: { id: ..., participants: 2, isRoom: false }

📝 Test 2: Creating a room conversation...
✅ Room conversation created: { id: ..., participants: 3, isRoom: true }

📝 Test 3: Creating messages...
✅ Messages created: { message1: {...}, message2: {...} }

📝 Test 4: Querying messages by conversation...
✅ Found 2 messages in conversation

📝 Test 5: Editing a message...
✅ Message edited: { id: ..., body: "...", editedAt: ... }

📝 Test 6: Finding conversations by participant...
✅ Found 2 conversations for user1

📝 Test 7: Verifying indexes...
✅ Conversation indexes: [ '_id_', 'participantIds_1', ... ]
✅ Message indexes: [ '_id_', 'conversationId_1', ... ]

🧹 Cleaning up test data...
✅ Test data cleaned up

🎉 All tests passed successfully!

🔌 Disconnected from MongoDB
```

---

## Testing the Presence Feature

### Backend Testing

#### 1. Unit Tests
```bash
cd server
npm test -- tests/presence.test.js
```

#### 2. Integration Tests
```bash
cd server
npm test -- tests/integration/presence.integration.test.js
```

#### 3. Manual GraphQL Testing

Start the server:
```bash
cd server
npm run dev
```

Open GraphQL Playground at `http://localhost:4000/graphql`

**Test Query - Get Online Users**:
```graphql
query {
  presenceOnlineUsers {
    userId
    status
    text
    lastSeen
  }
}
```

**Test Mutation - Set Presence**:
```graphql
mutation {
  presenceSet(status: "online", text: "Testing presence") {
    userId
    status
    text
    lastSeen
  }
}
```

**Test Subscription - Listen to Updates**:
```graphql
subscription {
  presenceUpdates {
    userId
    status
    text
    lastSeen
  }
}
```

---

### Frontend Testing

#### 1. Start the Client
```bash
cd client
npm start
```

#### 2. Test BuddyListPanel Component

Import and use the component:
```jsx
import { BuddyListPanel } from './components/Chat';

function TestPage() {
  return (
    <div>
      <h1>Presence Feature Test</h1>
      <BuddyListPanel />
    </div>
  );
}
```

#### 3. Verify Functionality
- ✅ Component mounts and sets presence to "online"
- ✅ User appears in the online users list
- ✅ Heartbeat sends every 45 seconds
- ✅ Real-time updates when other users come online/offline
- ✅ Component unmounts and sets presence to "offline"

#### 4. Browser Console Testing

Open browser console and check for:
```javascript
// Should see heartbeat logs every 45 seconds
"Sending presence heartbeat..."

// Should see subscription updates
"Received presence update: { userId: '...', status: 'online' }"
```

---

## Troubleshooting

### Common Issues

#### 1. Redis Connection Error
**Error**: `ECONNREFUSED 127.0.0.1:6379`

**Solution**:
```bash
# Start Redis
redis-server

# Or with Docker
docker run -d -p 6379:6379 redis:latest
```

#### 2. MongoDB Connection Error
**Error**: `MongoNetworkError: connect ECONNREFUSED`

**Solution**:
```bash
# Start MongoDB
mongod

# Or with Docker
docker run -d -p 27017:27017 mongo:latest
```

#### 3. Jest Test Timeout
**Error**: `Timeout - Async callback was not invoked within the 5000 ms timeout`

**Solution**: The tests use stubs and should not timeout. If they do, check:
- Ensure all async operations are properly stubbed
- Check that `sinon.restore()` is called in `afterEach`
- Verify no actual Redis/MongoDB connections in unit tests

#### 4. GraphQL Authentication Error
**Error**: `Authentication required`

**Solution**:
- Ensure you're logged in
- Check that JWT token is in localStorage
- Verify Authorization header is being sent

---

## Performance Considerations

### Indexes
Both models have optimized indexes for common query patterns:

**ConversationModel**:
- Efficiently find conversations by participant
- Sort conversations by creation date

**ConversationMessageModel**:
- Efficiently retrieve messages for a conversation
- Sort messages chronologically

### Query Optimization Tips

**Good**:
```javascript
// Uses index efficiently
const messages = await ConversationMessageModel.find({
  conversationId: id,
}).sort({ createdAt: -1 }).limit(50);
```

**Bad**:
```javascript
// Full collection scan - avoid!
const messages = await ConversationMessageModel.find({
  body: { $regex: /hello/i },
});
```

---

## Next Steps

### Recommended Enhancements

1. **Add GraphQL Resolvers** for Conversation and ConversationMessage models
2. **Create Mutations** for creating conversations and sending messages
3. **Add Subscriptions** for real-time message updates
4. **Implement Pagination** for message retrieval
5. **Add Message Reactions** (similar to existing reaction system)
6. **Add Typing Indicators** using presence system
7. **Add Read Receipts** tracking
8. **Add Message Search** functionality

---

## Summary

### ✅ Completed
- ConversationModel with proper schema and indexes
- ConversationMessageModel with proper schema and indexes
- Comprehensive unit tests for both models
- Integration tests for presence feature
- Manual test script for real database testing
- Full documentation

### 📋 Files Created
1. `server/app/data/resolvers/models/ConversationModel.js`
2. `server/app/data/resolvers/models/ConversationMessageModel.js`
3. `server/tests/models/conversation.test.js`
4. `server/tests/models/conversationMessage.test.js`
5. `server/tests/integration/presence.integration.test.js`
6. `server/manual-test-models.js`
7. `MODELS_AND_TESTING.md` (this file)

### 🎯 Ready for Production
All models are production-ready with:
- Proper validation
- Optimized indexes
- Comprehensive tests
- Clear documentation
