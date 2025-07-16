export const Query = `
type Query {

  " This will give the public news feed "
  activities(offset: Int, limit: Int, searchKey: String, startDateRange: String, endDateRange: String, user_id: String, activityEvent: JSON): Activities

  " Get all groups "
  groups(created: String, key: String, title: String, limit: Int): [Group]

  " Get a specific group by ID "
  group(groupId: String!): Group

  " This will query the list of user invite requests "
  userInviteRequests: [UserInvite]

  " This will query a post "
  post(postId: String!): Post

  " This will query the list of posts "
  posts(offset: Int, limit: Int, searchKey: String, startDateRange: String, endDateRange: String, friendsOnly: Boolean, groupId: String, userId: String, approved: Boolean, deleted: Boolean, interactions: Boolean, sortOrder: String): Posts

  " Posts selected for homepage carousel "
  featuredPosts(offset: Int, limit: Int, searchKey: String, startDateRange: String, endDateRange: String, friendsOnly: Boolean, groupId: String, userId: String, approved: Boolean, deleted: Boolean, interactions: Boolean, sortOrder: String): Posts

  " This will query a post message room"
  postMessageRoom(postId: String!): MessageRoom

  " This will query the list of available users "
  users: [User]

  " This will query the user "
  user(user_id: String, username: String, creatorId: String): User

  " This will query the user follow info "
  getUserFollowInfo(username: String, filter: String): JSON

  " This will query the user messages by Message Room ID"
  messages(messageRoomId: String!): [Message]

  " This will query the list user message rooms"
  messageRooms: [MessageRoom]
  
  " This will query the user message room"
  messageRoom(otherUserId: String!): MessageRoom

  " This will query duplicate email"
  checkDuplicateEmail(email: String!): JSON

  " This will query user info if token is valid"
  verifyUserPasswordResetToken(token: String!): JSON
  
  " This will query user notifications"
  notifications: [Notification]

  " This will query the message Reactions"
  messageReactions(messageId: String!): [Reaction]

  " This will query the action Reactions"
  actionReactions(actionId: String!): [Reaction]
}`;
