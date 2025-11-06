import gql from 'graphql-tag'

export const CREATE_GROUP = gql`
  mutation createGroup($group: GroupInput!) {
    createGroup(group: $group) {
      _id
      title
      description
      url
      created
    }
  }
`

export const SUBMIT_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      _id
      url
    }
  }
`

export const APPROVE_POST = gql`
  mutation approvePost($postId: String!, $userId: String!, $remove: Boolean) {
    approvePost(postId: $postId, userId: $userId, remove: $remove) {
      _id
    }
  }
`

export const REJECT_POST = gql`
  mutation rejectPost($postId: String!, $userId: String!, $remove: Boolean) {
    rejectPost(postId: $postId, userId: $userId, remove: $remove) {
      _id
    }
  }
`

export const UPDATE_USER_INVITE_STATUS = gql`
  mutation sendUserInviteApproval($userId: String!, $inviteStatus: String!) {
    sendUserInviteApproval(userId: $userId, inviteStatus: $inviteStatus)
  }
`

export const VOTE = gql`
  mutation addVote($vote: VoteInput!) {
    addVote(vote: $vote) {
      postId
      type
    }
  }
`

export const DELETE_VOTE = gql`
  mutation deleteVote($voteId: String!) {
    deleteVote(voteId: $voteId) {
      _id
    }
  }
`

export const ADD_COMMENT = gql`
  mutation addComment($comment: CommentInput!) {
    addComment(comment: $comment) {
      _id
    }
  }
`

export const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: String!) {
    deleteComment(commentId: $commentId) {
      _id
    }
  }
`

export const ADD_QUOTE = gql`
  mutation addQuote($quote: QuoteInput!) {
    addQuote(quote: $quote) {
      _id
    }
  }
`

export const DELETE_QUOTE = gql`
  mutation deleteQuote($quoteId: String!) {
    deleteQuote(quoteId: $quoteId) {
      _id
    }
  }
`

export const UPDATE_POST_BOOKMARK = gql`
  mutation updatePostBookmark($postId: String!, $userId: String!) {
    updatePostBookmark(postId: $postId, userId: $userId) {
      _id
      bookmarkedBy
    }
  }
`
export const SEND_MESSAGE = gql`
  mutation chat($message: MessageInput!) {
    createMessage(message: $message) {
      _id
      userId
      userName
      messageRoomId
      title
      text
      type
      created
      user {
        _id
        name
        username
        avatar
        contributorBadge
      }
    }
  }
`

export const DELETE_MESSAGE = gql`
  mutation deleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId) {
      _id
    }
  }
`

export const FOLLOW_MUTATION = gql`
  mutation followUser($user_id: String!, $action: String!) {
    followUser(user_id: $user_id, action: $action) {
      _id
      name
    }
  }
`

export const REQUEST_USER_ACCESS_MUTATION = gql`
  mutation requestUserAccess($requestUserAccessInput: RequestUserAccessInput!) {
    requestUserAccess(requestUserAccessInput: $requestUserAccessInput) {
      _id
      email
    }
  }
`

export const SEND_INVESTOR_EMAIL = gql`
  mutation sendInvestorMail($email: String!) {
    sendInvestorMail(email: $email)
  }
`

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation sendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email)
  }
`

export const UPDATE_USER_PASSWORD = gql`
  mutation updateUserPassword(
    $username: String!
    $password: String!
    $token: String!
  ) {
    updateUserPassword(username: $username, password: $password, token: $token)
  }
`
export const UPDATE_USER = gql`
  mutation updateUser($user: UserInput!) {
    updateUser(user: $user) {
      _id
      username
      name
      email
      avatar
      admin
    }
  }
`

export const UPDATE_USER_AVATAR = gql`
  mutation updateUserAvatar($user_id: String!, $avatarQualities: JSON) {
    updateUserAvatar(user_id: $user_id, avatarQualities: $avatarQualities) {
      _id
      username
      name
      email
      avatar
    }
  }
`

export const CREATE_POST_MESSAGE_ROOM = gql`
  mutation createPostMessageRoom($postId: String!) {
    createPostMessageRoom(postId: $postId) {
      _id
      users
      messageType
      created
      title
      avatar
    }
  }
`

export const READ_MESSAGES = gql`
  mutation updateMessageReadBy($messageRoomId: String!) {
    updateMessageReadBy(messageRoomId: $messageRoomId) {
      messageRoomId
      title
      text
      created
      readBy
    }
  }
`

export const DELETE_NOTIFICATION = gql`
  mutation removeNotification($notificationId: String!) {
    removeNotification(notificationId: $notificationId) {
      _id
      status
    }
  }
`

export const ADD_MESSAGE_REACTION = gql`
  mutation addMessageReaction($reaction: ReactionInput!) {
    addMessageReaction(reaction: $reaction) {
      userId
      messageId
      emoji
    }
  }
`

export const ADD_ACTION_REACTION = gql`
  mutation addActionReaction($reaction: ReactionInput!) {
    addActionReaction(reaction: $reaction) {
      userId
      actionId
      emoji
    }
  }
`

export const UPDATE_MESSAGE_REACTION = gql`
  mutation updateReaction($_id: String!, $emoji: String!) {
    updateReaction(_id: $_id, emoji: $emoji) {
      _id
      emoji
    }
  }
`

export const UPDATE_ACTION_REACTION = gql`
  mutation updateReaction($_id: String!, $emoji: String!) {
    updateReaction(_id: $_id, emoji: $emoji) {
      _id
      emoji
    }
  }
`

export const REPORT_POST = gql`
  mutation reportPost($postId: String!, $userId: String!) {
    reportPost(postId: $postId, userId: $userId) {
      _id
      reportedBy
    }
  }
`

export const DELETE_POST = gql`
  mutation deletePost($postId: String!) {
    deletePost(postId: $postId) {
      _id
    }
  }
`

export const UPDATE_FEATURED_SLOT = gql`
  mutation updateFeaturedSlot($postId: String!, $featuredSlot: Int) {
    updateFeaturedSlot(postId: $postId, featuredSlot: $featuredSlot) {
      _id
      featuredSlot
    }
  }
`

export const TOGGLE_VOTING = gql`
  mutation toggleVoting($postId: String!) {
    toggleVoting(postId: $postId) {
      _id
      enable_voting
    }
  }
`

export const SEND_USER_INVITE = gql`
  mutation sendUserInvite($email: String!) {
    sendUserInvite(email: $email) {
      code
      message
    }
  }
`

export const REPORT_USER = gql`
  mutation reportUser($reportUserInput: ReportUserInput!) {
    reportUser(reportUserInput: $reportUserInput) {
      code
      message
    }
  }
`

export const RECALCULATE_REPUTATION = gql`
  mutation recalculateReputation($userId: String!) {
    recalculateReputation(userId: $userId) {
      code
      message
    }
  }
`

// ===== Presence Mutations =====
export const UPDATE_PRESENCE = gql`
  mutation updatePresence($presence: PresenceInput!) {
    updatePresence(presence: $presence) {
      _id
      userId
      status
      statusMessage
      lastHeartbeat
      lastSeen
    }
  }
`

export const HEARTBEAT = gql`
  mutation heartbeat {
    heartbeat {
      success
      timestamp
    }
  }
`

export const CLEAR_PRESENCE = gql`
  mutation clearPresence {
    clearPresence
  }
`

// ===== Roster Mutations =====
export const ADD_BUDDY = gql`
  mutation addBuddy($roster: RosterInput!) {
    addBuddy(roster: $roster) {
      _id
      userId
      buddyId
      status
      created
      updated
    }
  }
`

export const ACCEPT_BUDDY = gql`
  mutation acceptBuddy($rosterId: String!) {
    acceptBuddy(rosterId: $rosterId) {
      _id
      userId
      buddyId
      status
      updated
    }
  }
`

export const BLOCK_BUDDY = gql`
  mutation blockBuddy($buddyId: String!) {
    blockBuddy(buddyId: $buddyId) {
      _id
      userId
      buddyId
      status
    }
  }
`

export const UNBLOCK_BUDDY = gql`
  mutation unblockBuddy($buddyId: String!) {
    unblockBuddy(buddyId: $buddyId) {
      _id
      userId
      buddyId
      status
    }
  }
`

export const REMOVE_BUDDY = gql`
  mutation removeBuddy($buddyId: String!) {
    removeBuddy(buddyId: $buddyId) {
      _id
      success
    }
  }
`

// ===== Typing Mutations =====
export const UPDATE_TYPING = gql`
  mutation updateTyping($typing: TypingInput!) {
    updateTyping(typing: $typing) {
      success
    }
  }
`
