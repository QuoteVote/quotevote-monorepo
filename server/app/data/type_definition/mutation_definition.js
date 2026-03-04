// eslint-disable-next-line import/prefer-default-export
export const Mutation = `type Mutation {

  # Mutation for creating new post
  addPost(post: PostInput!): Post

  # Mutation for approving a post
  approvePost(postId: String!, userId: String!, remove: Boolean): Post

  # Mutation for rejecting a post
  rejectPost(postId: String!, userId: String!, remove: Boolean): Post

  # Mutation for adding or removing a post bookmark
  updatePostBookmark(postId: String!, userId: String!): Post

  # Mutation for updating a post's featured slot
  updateFeaturedSlot(postId: String!, featuredSlot: Int): Post

  # Mutation for creating a group
  createGroup(group: GroupInput!): Group

  # Mutation for updating/inserting votes
  addVote(vote: VoteInput!): Vote

  # Mutation for deleting a vote
  deleteVote(voteId: String!): DeletedVote

  # Mutation for creating new comments
  addComment(comment: CommentInput!): Comment

  # Mutation for deleting a comment
  deleteComment(commentId: String!): DeletedComment

  # Mutation for creating new quote
  addQuote(quote: QuoteInput!): Quote

  # Mutation for deleting a quote
  deleteQuote(quoteId: String!): DeletedQuote

  # Mutation for adding a message
   createMessage(message: MessageInput!): Message

  # Mutation for deleting a message
   deleteMessage(messageId: String!): DeletedMessage

  # Mutation for creating a post chat room
   createPostMessageRoom(postId: String!): MessageRoom
   
  # Mutation for adding a message
   updateMessageReadBy(messageRoomId: String!): [Message]

  # Mutation for adding a message
   addStripeCustomer(stripeCustomer: StripeCustomerInput!): JSON

  # Mutation for toggling follow of user
    followUser(user_id: String!, action: String!): User

  # Mutation for request user access
    requestUserAccess(requestUserAccessInput: RequestUserAccessInput!): User

  # Mutation for send investor email
    sendInvestorMail(email: String!): JSON

  # Mutation for send email password reset link
    sendPasswordResetEmail(email: String!): JSON

  # Mutation for sending a magic login link
    sendMagicLoginLink(email: String!): JSON

  # Mutation for updating user password
    updateUserPassword(username: String, password: String, token: String): JSON

  # Mutation for updating user details
    updateUser(user: UserInput!): User

  # Mutation for updating user details
    sendUserInviteApproval(userId: String!, inviteStatus: String!): JSON

  # Mutation for updating a users avatar
    updateUserAvatar(user_id: String!, avatarQualities: JSON): User
    
  # Mutation for removing user notification
    removeNotification(notificationId: String!): Notification

  # Mutation for adding a message reaction
    addMessageReaction(reaction: ReactionInput!): Reaction

  # Mutation for adding an action reaction
    addActionReaction(reaction: ReactionInput!): Reaction

  # Mutation for updating a message reaction
    updateReaction(_id: String! emoji: String!): Reaction

  # Mutation for updating an action reaction
    updateActionReaction(_id: String! emoji: String!): Reaction

  # Mutation for reporting a post
    reportPost(postId: String!, userId: String!): Post

  # Mutation for deleting a post
    deletePost(postId: String!): DeletedPost

  # Mutation for sending user invite
    sendUserInvite(email: String!): JSON

  # Mutation for reporting a user
    reportUser(reportUserInput: ReportUserInput!): JSON

  # Mutation for recalculating user reputation
    recalculateReputation(userId: String!): JSON

  # Mutation for toggling voting on a post
    toggleVoting(postId: String!): Post

  # Mutation for reporting a user as a bot
    reportBot(userId: String!, reporterId: String!): JSON

  # Mutation for disabling a user account (admin only)
    disableUser(userId: String!): User

  # Mutation for enabling a user account (admin only)
    enableUser(userId: String!): User

  # ===== Presence Management =====
  # Mutation for updating user presence status
    updatePresence(presence: PresenceInput!): Presence
  
  # Mutation for heartbeat to keep presence alive
    heartbeat: HeartbeatResponse
  
  # Mutation for clearing presence (logout)
    clearPresence: Boolean

  # ===== Roster Management =====
  # Mutation for adding a buddy
    addBuddy(roster: RosterInput!): Roster
  
  # Mutation for accepting a buddy request
    acceptBuddy(rosterId: String!): Roster
  
  # Mutation for declining a buddy request
    declineBuddy(rosterId: String!): DeletedRoster
  
  # Mutation for blocking a user
    blockBuddy(buddyId: String!): Roster
  
  # Mutation for unblocking a user
    unblockBuddy(buddyId: String!): Roster
  
  # Mutation for removing a buddy
    removeBuddy(buddyId: String!): DeletedRoster

  # ===== Typing Indicators =====
  # Mutation for updating typing status
    updateTyping(typing: TypingInput!): TypingResponse

}`;
