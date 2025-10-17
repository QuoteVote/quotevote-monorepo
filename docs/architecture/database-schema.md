# Quote Vote - Database Schema Design (MongoDB / Mongoose)

This document outlines the conceptual schema design for the MongoDB collections used by the `monorepo/server/` backend, based on analysis of the existing Mongoose models and incorporating requirements from the V1 PRD.

**Note:** Field names reflect potential standardization (e.g., `followingIds` instead of `_followingId`). Existing model files (`resolvers/models/*`) should be updated accordingly during implementation.

## Collection: `users` (Corresponds to `UserModel.js`)

```javascript
{
  _id: ObjectId, // Auto-generated MongoDB ID
  username: { type: String, unique: true, lowercase: true, trim: true, required: true, index: true },
  name: String, // Optional display name
  email: { type: String, unique: true, lowercase: true, trim: true, required: true, index: true },
  hash_password: String, // If using local password auth strategy
  authProviderId: { type: String, index: true }, // Optional: If using external auth (e.g., Google ID)
  bio: String, // New field needed for PRD
  avatarUrl: String, // Store URL, potentially update from UserModel.avatar JSON
  status: Number, // Meaning needs clarification (e.g., 0=pending, 1=active, 2=banned)
  plan: { type: String, default: 'personal' }, // e.g., 'personal', 'org_admin'
  stripeCustomerId: String, // For potential future payments
  // Follows & Buddies
  /**
   * Relationship Storage Pattern:
   * - buddyIds: Stored directly on the user document. The buddy list contains users that this user has followed (i.e., users whose IDs appear in following relationships). Once a user follows someone, that followed user appears in their buddy list.
   * - follower relationships: Managed in the separate 'follows' collection. This design supports scalability, as the number of followers/following can grow very large and requires efficient querying (e.g., "who follows whom?"). Storing these relationships separately enables better indexing, avoids bloating the user document, and supports performant queries for social graph features.
   * If future requirements change (e.g., buddies become high-cardinality or require complex queries), consider migrating buddy relationships to a separate collection for consistency.
   */
  buddyIds: [ObjectId],     // Buddy List feature: contains IDs of users this user has followed
  // Follower relationships are stored in the separate 'follows' collection for scalability.
  favoritedPostIds: [ObjectId], // Array of Post IDs user favorited (from UserModel.favorited)
  notificationSettings: { // Example embedded settings
    newFollower: { type: Boolean, default: true },
    newDm: { type: Boolean, default: true },
    postReply: { type: Boolean, default: true },
    commentMention: { type: Boolean, default: true }, // Example
  },
  admin: { type: Boolean, default: false }, // Role check
  joined: { type: Date, default: Date.now }, // Corresponds to 'created'
  // Deprecate? These counts can be derived via aggregation unless performance demands caching.
  // upvotes: { type: Number, default: 0 }, // Total upvotes received?
  // downvotes: { type: Number, default: 0 }, // Total downvotes received?
  // tokens: Number, // Meaning needs clarification (from UserModel)
  // _wallet: String, // Meaning needs clarification (from UserModel)
  // companyName: String, // From UserModel - relevant for Org features?
}
```

## Collection: `follows` (New)

```javascript
{
  _id: ObjectId,
  userId: { type: ObjectId, required: true, index: true }, // The user who is following
  followingId: { type: ObjectId, required: true, index: true }, // The user being followed
  createdAt: { type: Date, default: Date.now, index: true },
}
// Compound index for querying follows
// schema.index({ userId: 1, followingId: 1 }, { unique: true });
```

## Collection: `posts` (Corresponds to `PostModel.js`)

```javascript
{
  _id: ObjectId,
  authorId: { type: ObjectId, required: true, index: true }, // Renamed from 'userId' for clarity
  groupId: { type: ObjectId, index: true }, // Optional: If post belongs to a Group/Domain
  title: { type: String, required: true },
  text: { type: String, required: true }, // Text content of the post
  createdAt: { type: Date, default: Date.now, index: true }, // For sorting feeds
  updatedAt: { type: Date, default: Date.now }, // Should be updated on edit
  // URL / Linking
  url: String, // Optional external URL associated with post?
  urlId: String, // Meaning? (from PostModel) - maybe slug for post URL?
  messageRoomId: { type: ObjectId, index: true }, // Link to the associated MessageRoom for chat
  // Status / Moderation
  reportedCount: { type: Number, default: 0 }, // Renamed from 'reported'
  reportedBy: [ObjectId], // Users who reported this post
  // Vote/Reaction Cache (Consider if needed for performance vs. aggregation)
  // upvotes: { type: Number, default: 0 }, // Total upvotes on the post (potentially derived from VoteModel)
  // downvotes: { type: Number, default: 0 }, // Total downvotes on the post (potentially derived)
  // Derived/Calculated Fields (Potentially populated by background jobs or aggregation)
  // commentCount: { type: Number, default: 0},
  // trendingScore: Number, // Example
  // pointTimestamp: Date, // Meaning? (from PostModel) - timestamp for trending score calculation?
  // dayPoints: Number, // Meaning? (from PostModel) - trending score?
  // Deprecate? These arrays store who took an action, better queried from VoteModel/BookmarkModel
  // approvedBy: [ObjectId],
  // rejectedBy: [ObjectId],
  // votedBy: [ObjectId], // Ambiguous if VoteModel exists
  // bookmarkedBy: [ObjectId], // Consider a dedicated BookmarkModel if needed
}
// Text index for searching post content
// schema.index({ title: 'text', text: 'text' }); // Example text index
```

## Collection: `comments` (Corresponds to `CommentModel.js`)

```javascript
{
  _id: ObjectId,
  postId: { type: ObjectId, required: true, index: true }, // Link to the Post
  authorId: { type: ObjectId, required: true, index: true }, // Renamed from 'userId'
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  parentCommentId: { type: ObjectId, index: true }, // For threading replies
  // Fields for comments on highlighted text ranges
  startWordIndex: Number, // Optional: index from CommentModel
  endWordIndex: Number, // Optional: index from CommentModel
  // url: String, // Meaning? External link related to comment? (from CommentModel)
  // reactions: [ EmbeddedReactionSubdocument ], // Optional: if comments can be reacted to
}
// schema.index({ content: 'text' }); // Text index
```

## Collection: `votes` (Corresponds to `VoteModel.js`)

```javascript
{
  _id: ObjectId,
  postId: { type: ObjectId, required: true, index: true },
  userId: { type: ObjectId, required: true, index: true }, // User casting the vote
  type: { type: String, enum: ['up', 'down'], required: true }, // Vote direction
  // Context for the vote (specific text range)
  startWordIndex: { type: Number, required: true },
  endWordIndex: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  // content: String, // Snippet of voted text? Likely redundant if start/end index present (from VoteModel)
  // tags: String, // Meaning? (from VoteModel)
}
// Compound index for finding votes by user on a specific post range
// schema.index({ postId: 1, userId: 1, startWordIndex: 1, endWordIndex: 1 }); // No unique constraint; allows overlapping ranges
```

## Collection: `message_rooms` (Corresponds to `MessageRoomModel.js`)

```javascript
{
  _id: ObjectId,
  participants: { type: [ObjectId], required: true, index: true }, // Renamed from 'users'
  postId: { type: ObjectId, index: true }, // Optional: Link if this is a post's chatroom
  messageType: { type: String, enum: ['post_chat', 'direct_message'], required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  // Optional cache fields for performance
  lastMessageId: { type: ObjectId },
  lastMessageAt: { type: Date, index: true }, // For sorting conversations
  lastMessageSnippet: String,
  // unreadCounts: [ { userId: ObjectId, count: Number } ] // Cache unread count per participant?
}
```

## Collection: `messages` (Corresponds to `MessageModel.js`)

```javascript
{
  _id: ObjectId,
  messageRoomId: { type: ObjectId, required: true, index: true },
  senderId: { type: ObjectId, required: true, index: true }, // Renamed from 'userId'
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true }, // For sorting messages
  readBy: { type: [ObjectId], default: [], index: true } // Users who have read this message
  // title: String, // Use case unclear (from MessageModel) - Subject?
  // reactions: [ EmbeddedReactionSubdocument ], // Optional message reactions (using ReactionModel?)
}
```

## Collection: `notifications` (Corresponds to `NotificationModel.js`)

```javascript
{
  _id: ObjectId,
  recipientId: { type: ObjectId, required: true, index: true }, // Renamed from 'userId'
  senderId: { type: ObjectId, index: true }, // User causing notification (renamed from userIdBy)
  notificationType: {
      type: String,
      required: true,
      enum: ['new_follower', 'post_reply', 'comment_reply', 'post_mention', 'comment_mention', 'new_dm'], // Example types
      index: true
  },
  postId: { type: ObjectId, index: true }, // Optional reference
  commentId: { type: ObjectId, index: true }, // Optional reference (Need to add field)
  messageId: { type: ObjectId, index: true }, // Optional reference (Need to add field)
  messageRoomId: { type: ObjectId, index: true }, // Optional reference (Need to add field)
  label: String, // Short description/text of the notification
  status: { type: String, enum: ['new', 'read'], default: 'new', index: true },
  createdAt: { type: Date, default: Date.now, index: true },
}
```

## Other Existing Models (Brief Notes - Purpose/V1 Relevance Needs Clarification)

- **`ActivityModel`**: Logs user actions. Useful for auditing or generating feeds/analytics.
- **`CollectionModel`**: Groups content. Might be post-V1 or relate to Org features.
- **`ContentModel`**: Generic content type? Relation to `PostModel` unclear. May relate to Org features/Domains.
- **`CreatorModel`**: User profile focused on content creation? Relation to `UserModel` unclear.
- **`DomainModel`**: Likely for Org/self-hosted instances, managing access by domain.
- **`GroupModel`**: Similar to Domains, possibly for finer-grained communities within a domain.
- **`QuoteModel`**: Seems related to highlighting text, but role needs clarification vs. `VoteModel` and `CommentModel`.
- **`ReactionModel`**: Appears tied to _messages_ (`messageId`) and uses emojis. Separate from `VoteModel` for post highlights.
- **`VoteLogModel`**: Auditing votes? Potentially redundant if `VoteModel` captures the necessary info.

**Recommendation:** Focus V1 implementation on refining and using `users`, `posts`, `comments`, `votes`, `message_rooms`, `messages`, `notifications`. Clarify or defer refinement of other models unless essential for a core V1 feature.
