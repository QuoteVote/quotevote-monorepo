# Presence Feature Implementation

## Overview
This document describes the Redis-based presence service implementation for the QuoteVote monorepo.

## Architecture

### Components

1. **Presence Service** (`server/app/utils/presenceService.js`)
   - Redis-based storage with 2-minute TTL
   - Pub/Sub for real-time updates
   - Functions: `setPresence`, `getPresence`, `presenceSet`, `presenceOnlineUsers`

2. **GraphQL Schema** (`server/app/data/type_definition/`)
   - Type: `Presence { userId: ID!, status: String!, text: String, lastSeen: String! }`
   - Query: `presence(userId: String!)`, `presenceOnlineUsers: [Presence!]!`
   - Mutation: `setPresence(userId, status, text)`, `presenceSet(status, text)`
   - Subscription: `presenceUpdates`, `presenceStream(userIds: [ID!])`

3. **Resolvers**
   - Query resolvers: `server/app/data/resolvers/queries/presence.js`
   - Mutation resolvers: `server/app/data/resolvers/mutations/presence.js`
   - All resolvers require authentication

4. **Tests** (`server/tests/presence.test.js`)
   - Unit tests for all presence functions
   - TTL expiry verification
   - Subscription event testing

## Key Features

### 1. Redis Storage
- Key format: `presence:<userId>`
- Fields: `status`, `text`, `lastSeen`
- TTL: 120 seconds (2 minutes)

### 2. Pub/Sub Architecture
- Redis channel: `presence:updates`
- GraphQL events: `presenceUpdatesEvent`, `presenceStreamEvent`
- Automatic subscription handling via auto-generated resolvers

### 3. Authentication
All presence operations require authentication:
- Queries: `presence`, `presenceOnlineUsers`
- Mutations: `setPresence`, `presenceSet`
- Subscriptions: `presenceUpdates`, `presenceStream`

### 4. Functions

#### `setPresence(userId, status, text)`
- Sets presence for any user (admin function)
- Stores in Redis with TTL
- Publishes to Redis channel and GraphQL subscriptions

#### `presenceSet(status, text)`
- Sets presence for current authenticated user
- Extracts userId from context
- Same storage and publishing as setPresence

#### `getPresence(userId)`
- Retrieves presence data for a specific user
- Returns null if not found or expired

#### `presenceOnlineUsers()`
- Scans all `presence:*` keys in Redis
- Returns array of all online users
- Filters out null/empty results

## Usage Examples

### GraphQL Queries

```graphql
# Get specific user presence
query {
  presence(userId: "user123") {
    userId
    status
    text
    lastSeen
  }
}

# Get all online users
query {
  presenceOnlineUsers {
    userId
    status
    text
    lastSeen
  }
}
```

### GraphQL Mutations

```graphql
# Set presence for current user
mutation {
  presenceSet(status: "online", text: "Working on project") {
    userId
    status
    text
    lastSeen
  }
}

# Set presence for specific user (admin)
mutation {
  setPresence(userId: "user123", status: "away", text: "In meeting") {
    userId
    status
    text
    lastSeen
  }
}
```

### GraphQL Subscriptions

```graphql
# Subscribe to all presence updates
subscription {
  presenceUpdates {
    userId
    status
    text
    lastSeen
  }
}

# Subscribe to specific users
subscription {
  presenceStream(userIds: ["user1", "user2", "user3"]) {
    userId
    status
    text
    lastSeen
  }
}
```

## Testing

Run tests with:
```bash
npm test -- presence.test.js
```

Tests cover:
- Setting presence with TTL
- Getting presence data
- Online users retrieval
- TTL expiry (120 seconds)
- Subscription event publishing
- Error handling
- Authentication requirements

## Environment Variables

Add to `.env`:
```
REDIS_URL=redis://localhost:6379
```

## Dependencies

- `redis`: ^4.0.0 (added to package.json)

## Redis Setup

Ensure Redis is running:
```bash
# Local development
redis-server

# Docker
docker run -d -p 6379:6379 redis:latest
```

## Notes

- Presence data automatically expires after 2 minutes of inactivity
- Redis pub/sub ensures distributed system support
- GraphQL subscriptions use existing pubsub infrastructure
- All operations require user authentication
- Subscription filtering by userIds is handled automatically
