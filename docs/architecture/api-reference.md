# Quote Vote - API Specifications (GraphQL Schema Overview)

This document provides a high-level overview and examples of the GraphQL schema used by the `monorepo/server/` backend.

## Design Principles

### Relationship Storage Strategy

This API follows a **hybrid relationship storage approach** optimized for different access patterns:

- **Direct array storage** (`buddyIds`): Used for small, frequently accessed lists with bidirectional mutual consent
- **Separate collection storage**: Used for potentially large, one-directional relationships that need scalability

**Rationale:**

- Buddy relationships are mutual, limited in size (~150 per user), and frequently accessed together
- Follow relationships are one-directional, potentially unlimited, and often queried with pagination
- Comments, votes, and messages use separate collections for auditability and complex querying

## Custom Scalars

```graphql
scalar Date
scalar ObjectId # Custom scalar representing MongoDB ObjectIds
```

## Core Types

```graphql
type User {
  id: ObjectId!
  username: String!
  name: String
  email: String!
  bio: String
  avatarUrl: String
  createdAt: Date!

  # Relationship fields - all resolved via GraphQL resolvers for consistency
  # Note: Storage implementation varies by relationship type (see Design Principles)
  posts(limit: Int = 20, cursor: String): PostConnection!
  following(limit: Int = 20, cursor: String): UserConnection!
  followers(limit: Int = 20, cursor: String): UserConnection!
  buddies(limit: Int = 20, cursor: String): UserConnection!
  votes(limit: Int = 20, cursor: String): VoteConnection!
  comments(limit: Int = 20, cursor: String): CommentConnection!
  notifications(limit: Int = 20, cursor: String): NotificationConnection!
  messageRooms(limit: Int = 20, cursor: String): MessageRoomConnection!

  # Aggregate counts for performance
  postCount: Int!
  followingCount: Int!
  followerCount: Int!
  buddyCount: Int!
}

type Post {
  id: ObjectId!
  author: User!
  group: Group
  title: String!
  text: String!
  createdAt: Date!
  updatedAt: Date
  chatroomUrl: String
  messageRoomId: String

  # Voting and highlighting
  highlightedSections: [HighlightedSection!]!

  # Aggregate counts
  upvotes: Int!
  downvotes: Int!
  commentCount: Int!
  reportedCount: Int!

  # Relationships
  comments(limit: Int = 20, cursor: String): CommentConnection!
  votes(limit: Int = 20, cursor: String): VoteConnection!
}

type HighlightedSection {
  id: String!
  post: Post!
  startIndex: Int!
  endIndex: Int!
  textSnippet: String!
  upvoteCount: Int!
  downvoteCount: Int!
  comments(limit: Int = 20, cursor: String): CommentConnection!
  voters(type: VoteType): [User!]!
}

type Vote {
  id: ObjectId!
  post: Post!
  voter: User!
  type: VoteType!
  startIndex: Int!
  endIndex: Int!
  createdAt: Date!
}

enum VoteType {
  UP
  DOWN
}

type Comment {
  id: ObjectId!
  post: Post!
  author: User!
  content: String!
  createdAt: Date!
  updatedAt: Date
  startWordIndex: Int
  endWordIndex: Int
  parentComment: Comment
  replies(limit: Int = 10, cursor: String): CommentConnection!
  replyCount: Int!
}

type Message {
  id: ObjectId!
  messageRoom: MessageRoom!
  sender: User!
  text: String!
  createdAt: Date!
  readBy: [User!]!
  isRead: Boolean! # For current user context
}

type MessageRoom {
  id: ObjectId!
  participants: [User!]!
  post: Post # Optional - null for DMs
  messageType: MessageRoomType!
  messages(limit: Int = 50, cursor: String): MessageConnection!
  lastMessage: Message
  unreadCount: Int! # For current user context
  createdAt: Date!
  updatedAt: Date!
}

enum MessageRoomType {
  POST_CHAT
  DIRECT_MESSAGE
  GROUP_CHAT
}

type Notification {
  id: ObjectId!
  recipient: User!
  sender: User
  notificationType: NotificationType!
  post: Post
  comment: Comment
  message: Message
  label: String
  status: NotificationStatus!
  createdAt: Date!
  readAt: Date
}

enum NotificationType {
  NEW_FOLLOWER
  POST_REPLY
  COMMENT_MENTION
  NEW_DM
  BUDDY_REQUEST
  BUDDY_ACCEPTED
  POST_VOTE
  COMMENT_VOTE
}

enum NotificationStatus {
  NEW
  READ
  ARCHIVED
}

type Group {
  id: ObjectId!
  name: String!
  description: String
  createdBy: User!
  members: [User!]!
  posts(limit: Int = 20, cursor: String): PostConnection!
  memberCount: Int!
  createdAt: Date!
}
```

## Pagination Types

```graphql
type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type UserEdge {
  node: User!
  cursor: String!
}

type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type CommentEdge {
  node: Comment!
  cursor: String!
}

type CommentConnection {
  edges: [CommentEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type VoteEdge {
  node: Vote!
  cursor: String!
}

type VoteConnection {
  edges: [VoteEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type MessageEdge {
  node: Message!
  cursor: String!
}

type MessageConnection {
  edges: [MessageEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type MessageRoomEdge {
  node: MessageRoom!
  cursor: String!
}

type MessageRoomConnection {
  edges: [MessageRoomEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}

type NotificationEdge {
  node: Notification!
  cursor: String!
}

type NotificationConnection {
  edges: [NotificationEdge!]!
  pageInfo: PageInfo!
  totalCount: Int
}
```

## Input Types

```graphql
input CreatePostInput {
  groupId: ObjectId
  title: String!
  text: String!
}

input UpdatePostInput {
  title: String
  text: String
}

input CreateCommentInput {
  postId: ObjectId!
  content: String!
  startWordIndex: Int
  endWordIndex: Int
  parentCommentId: ObjectId
}

input UpdateCommentInput {
  content: String!
}

input VoteOnHighlightInput {
  postId: ObjectId!
  startIndex: Int!
  endIndex: Int!
  type: VoteType!
}

input SendMessageInput {
  messageRoomId: ObjectId
  recipientId: ObjectId # For new DMs
  text: String!
}

input UpdateProfileInput {
  name: String
  bio: String
  avatarUrl: String
}

input CreateGroupInput {
  name: String!
  description: String
}
```

## Queries

```graphql
type Query {
  # Current user
  me: User

  # Users
  user(id: ObjectId, username: String): User
  searchUsers(query: String!, limit: Int = 10): [User!]!

  # Posts
  post(id: ObjectId!): Post
  feed(limit: Int = 20, cursor: String): PostConnection!
  postsByUser(
    userId: ObjectId!
    limit: Int = 20
    cursor: String
  ): PostConnection!
  postsByGroup(
    groupId: ObjectId!
    limit: Int = 20
    cursor: String
  ): PostConnection!
  trendingPosts(limit: Int = 10): [Post!]!

  # Comments
  comment(id: ObjectId!): Comment
  commentsByPost(
    postId: ObjectId!
    limit: Int = 20
    cursor: String
  ): CommentConnection!

  # Messages
  messageRoom(id: ObjectId!): MessageRoom
  messageRooms(limit: Int = 20, cursor: String): MessageRoomConnection!
  messages(
    messageRoomId: ObjectId!
    limit: Int = 50
    cursor: String
  ): MessageConnection!

  # Notifications
  notifications(
    status: NotificationStatus
    limit: Int = 20
    cursor: String
  ): NotificationConnection!
  unreadNotificationCount: Int!

  # Groups
  group(id: ObjectId!): Group
  myGroups(limit: Int = 20, cursor: String): [Group!]!

  # Relationships
  buddyRequests(limit: Int = 20, cursor: String): UserConnection! # Pending buddy requests
}
```

## Mutations

```graphql
type Mutation {
  # Posts
  createPost(input: CreatePostInput!): Post!
  updatePost(id: ObjectId!, input: UpdatePostInput!): Post!
  deletePost(id: ObjectId!): Boolean!
  reportPost(id: ObjectId!, reason: String!): Boolean!

  # Comments
  createComment(input: CreateCommentInput!): Comment!
  updateComment(id: ObjectId!, input: UpdateCommentInput!): Comment!
  deleteComment(id: ObjectId!): Boolean!

  # Voting
  voteOnHighlight(input: VoteOnHighlightInput!): Vote!
  removeVote(postId: ObjectId!, startIndex: Int!, endIndex: Int!): Boolean!

  # Relationships - Consistent interface despite different storage
  followUser(userId: ObjectId!): User!
  unfollowUser(userId: ObjectId!): User!
  sendBuddyRequest(userId: ObjectId!): User! # Creates pending relationship
  acceptBuddyRequest(userId: ObjectId!): User! # Converts to mutual buddy relationship
  rejectBuddyRequest(userId: ObjectId!): Boolean!
  removeBuddy(userId: ObjectId!): User!

  # Messages
  sendMessage(input: SendMessageInput!): Message!
  markMessageRead(messageId: ObjectId!): Message!
  markConversationRead(messageRoomId: ObjectId!): Boolean!

  # Notifications
  markNotificationRead(id: ObjectId!): Notification!
  markAllNotificationsRead: Boolean!

  # Profile
  updateProfile(input: UpdateProfileInput!): User!

  # Groups
  createGroup(input: CreateGroupInput!): Group!
  joinGroup(groupId: ObjectId!): Group!
  leaveGroup(groupId: ObjectId!): Boolean!
}
```

## Subscriptions

```graphql
type Subscription {
  # Real-time updates
  newMessage(messageRoomId: ObjectId!): Message!
  newNotification: Notification!
  newComment(postId: ObjectId!): Comment!
  userTyping(messageRoomId: ObjectId!): TypingIndicator!

  # Relationship updates
  buddyRequestReceived: User!
  buddyRequestAccepted: User!
  newFollower: User!
}

type TypingIndicator {
  userId: ObjectId!
  username: String!
  isTyping: Boolean!
}
```

## Error Handling

```graphql
interface Error {
  message: String!
  code: String!
}

type ValidationError implements Error {
  message: String!
  code: String!
  field: String!
}

type AuthenticationError implements Error {
  message: String!
  code: String!
}

type AuthorizationError implements Error {
  message: String!
  code: String!
  resource: String!
}

type NotFoundError implements Error {
  message: String!
  code: String!
  resourceType: String!
  resourceId: String!
}
```

## Usage Examples

### Query a user's relationships

```graphql
query GetUserRelationships($userId: ObjectId!) {
  user(id: $userId) {
    id
    username
    buddies(limit: 50) {
      edges {
        node {
          id
          username
          avatarUrl
        }
      }
      totalCount
    }
    following(limit: 20) {
      edges {
        node {
          id
          username
          avatarUrl
        }
      }
      totalCount
    }
    followers(limit: 20) {
      edges {
        node {
          id
          username
          avatarUrl
        }
      }
      totalCount
    }
  }
}
```

### Send a buddy request

```graphql
mutation SendBuddyRequest($userId: ObjectId!) {
  sendBuddyRequest(userId: $userId) {
    id
    username
    # This will show the pending request in the UI
  }
}
```

## Implementation Notes

### Relationship Storage Implementation

1. **Buddy Relationships** (`buddyIds` array on User document):

   - Mutual consent required
   - Limited size (~150 max recommended)
   - Fast lookup for buddy list display
   - Atomic updates for mutual adds/removes

2. **Follow Relationships** (separate `follows` collection):

   - One-directional
   - Unlimited scalability
   - Efficient pagination
   - Separate indexes for followers/following queries

3. **Other Relationships** (separate collections):
   - Comments, votes, messages use dedicated collections
   - Better for complex queries and aggregations
   - Audit trail preservation
   - Flexible schema evolution

This hybrid approach optimizes for the specific access patterns and scalability requirements of each relationship type while maintaining a consistent GraphQL interface.
