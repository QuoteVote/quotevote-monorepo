import gql from 'graphql-tag'

export const GROUPS_QUERY = gql`
  query groups($limit: Int!) {
    groups(limit: $limit) {
      _id
      creatorId
      adminIds
      allowedUserIds
      privacy
      title
      url
      description
    }
  }
`

export const USER_INVITE_REQUESTS = gql`
  query userInviteRequests {
    userInviteRequests {
      joined
      email
      status
      _id
    }
  }
`

export const GET_USERS = gql`
  query users {
    users {
      _id
      name
      username
      contributorBadge
    }
  }
`

export const GET_POST = gql`
  query post($postId: String!) {
    post(postId: $postId) {
      _id
      userId
      created
      groupId
      title
      text
      url
      upvotes
      downvotes
      approvedBy
      rejectedBy
      reportedBy
      bookmarkedBy
      enable_voting
      creator {
        _id
        name
        avatar
        username
        contributorBadge
      }
      comments {
        _id
        created
        userId
        content
        startWordIndex
        endWordIndex
        postId
        url
        reaction
        user {
          _id
          username
          name
          avatar
          contributorBadge
        }
      }
      votes {
        _id
        startWordIndex
        endWordIndex
        created
        type
        tags
        content
        user {
          _id
          username
          name
          avatar
          contributorBadge
        }
      }
      quotes {
        _id
        startWordIndex
        endWordIndex
        created
        quote
        user {
          _id
          username
          name
          avatar
          contributorBadge
        }
      }
      messageRoom {
        _id
        users
        postId
        messageType
        created
      }
    }
  }
`

export const SEARCH = gql`
  query search($text: String!) {
    searchContent(text: $text) {
      _id
      title
      creatorId
      domain {
        key
        _id
      }
    }
    searchCreator(text: $text) {
      _id
      name
      avatar
      creator {
        _id
      }
    }
  }
`

export const GET_CHAT_ROOM = gql`
  query messageRoom($otherUserId: String!) {
    messageRoom(otherUserId: $otherUserId) {
      _id
      users
      messageType
      created
      title
      avatar
    }
  }
`
export const GET_CHAT_ROOMS = gql`
  query chatRooms {
    messageRooms {
      _id
      users
      messageType
      created
      title
      avatar
      unreadMessages
    }
  }
`

export const GET_ROOM_MESSAGES = gql`
  query messages($messageRoomId: String!) {
    messages(messageRoomId: $messageRoomId) {
      _id
      messageRoomId
      userName
      userId
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

export const GET_MESSAGE_REACTIONS = gql`
  query messageReactions($messageId: String!) {
    messageReactions(messageId: $messageId) {
      _id
      emoji
      messageId
      userId
    }
  }
`

export const GET_ACTION_REACTIONS = gql`
  query actionReactions($actionId: String!) {
    actionReactions(actionId: $actionId) {
      _id
      emoji
      actionId
      userId
    }
  }
`

export const GET_TOP_POSTS = gql`
  query topPosts(
    $limit: Int!
    $offset: Int!
    $searchKey: String!
    $startDateRange: String
    $endDateRange: String
    $friendsOnly: Boolean
    $interactions: Boolean
    $userId: String
    $groupId: String
    $approved: Boolean
    $sortOrder: String
  ) {
    posts(
      limit: $limit
      offset: $offset
      searchKey: $searchKey
      startDateRange: $startDateRange
      endDateRange: $endDateRange
      friendsOnly: $friendsOnly
      interactions: $interactions
      userId: $userId
      groupId: $groupId
      approved: $approved
      sortOrder: $sortOrder
    ) {
      entities {
        _id
        userId
        groupId
        title
        text
        upvotes
        downvotes
        bookmarkedBy
        created
        url
        rejectedBy
        approvedBy
        creator {
          name
          username
          avatar
          _id
          contributorBadge
        }
        votes {
          _id
          startWordIndex
          endWordIndex
          type
        }
        comments {
          _id
        }
        quotes {
          _id
        }
        messageRoom {
          _id
          messages {
            _id
          }
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

// Paginated version of GET_TOP_POSTS for page-based pagination
export const GET_PAGINATED_POSTS = gql`
  query paginatedPosts(
    $limit: Int!
    $offset: Int!
    $searchKey: String!
    $startDateRange: String
    $endDateRange: String
    $friendsOnly: Boolean
    $interactions: Boolean
    $userId: String
    $groupId: String
    $approved: Boolean
    $sortOrder: String
  ) {
    posts(
      limit: $limit
      offset: $offset
      searchKey: $searchKey
      startDateRange: $startDateRange
      endDateRange: $endDateRange
      friendsOnly: $friendsOnly
      interactions: $interactions
      userId: $userId
      groupId: $groupId
      approved: $approved
      sortOrder: $sortOrder
    ) {
      entities {
        _id
        userId
        groupId
        title
        text
        upvotes
        downvotes
        bookmarkedBy
        created
        url
        rejectedBy
        approvedBy
        creator {
          name
          username
          avatar
          _id
          contributorBadge
        }
        votes {
          _id
          startWordIndex
          endWordIndex
          type
        }
        comments {
          _id
        }
        quotes {
          _id
        }
        messageRoom {
          _id
          messages {
            _id
          }
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

export const GET_FRIENDS_POSTS = gql`
  query friendsPosts(
    $limit: Int!
    $offset: Int!
    $searchKey: String!
    $startDateRange: String
    $endDateRange: String
    $friendsOnly: Boolean
    $interactions: Boolean
  ) {
    posts(
      limit: $limit
      offset: $offset
      searchKey: $searchKey
      startDateRange: $startDateRange
      endDateRange: $endDateRange
      friendsOnly: $friendsOnly
      interactions: $interactions
    ) {
      entities {
        _id
        userId
        title
        text
        upvotes
        downvotes
        bookmarkedBy
        created
        url
        creator {
          name
          username
          avatar
          _id
          contributorBadge
        }
        votes {
          _id
          startWordIndex
          endWordIndex
          type
        }
        comments {
          _id
        }
        quotes {
          _id
        }
        messageRoom {
          _id
          messages {
            _id
          }
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      name
      username
      upvotes
      downvotes
      _followingId
      _followersId
      avatar
      contributorBadge
    }
  }
`

export const GET_USER_ACTIVITY = gql`
  query activities(
    $user_id: String!
    $limit: Int!
    $offset: Int!
    $searchKey: String!
    $startDateRange: String
    $endDateRange: String
    $activityEvent: JSON!
  ) {
    activities(
      user_id: $user_id
      limit: $limit
      offset: $offset
      searchKey: $searchKey
      startDateRange: $startDateRange
      endDateRange: $endDateRange
      activityEvent: $activityEvent
    ) {
      entities {
        created
        postId
        userId
        user {
          _id
          name
          username
          avatar
          contributorBadge
        }
        activityType
        content
        post {
          _id
          title
          text
          url
          upvotes
          downvotes
          votes {
            _id
          }
          quotes {
            _id
          }
          comments {
            _id
          }
          messageRoom {
            _id
            messages {
              _id
            }
          }
          bookmarkedBy
          created
          creator {
            _id
            name
            username
            avatar
            contributorBadge
          }
        }
        voteId
        vote {
          _id
          startWordIndex
          endWordIndex
          created
          type
          tags
        }
        commentId
        comment {
          _id
          created
          userId
          content
          startWordIndex
          endWordIndex
        }
        quoteId
        quote {
          _id
          startWordIndex
          endWordIndex
          created
          quote
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

export const GET_CHECK_DUPLICATE_EMAIL = gql`
  query checkDuplicateEmail($email: String!) {
    checkDuplicateEmail(email: $email)
  }
`
export const VERIFY_PASSWORD_RESET_TOKEN = gql`
  query verifyUserPasswordResetToken($token: String!) {
    verifyUserPasswordResetToken(token: $token)
  }
`

export const GET_FOLLOW_INFO = gql`
  query getUserFollowInfo($username: String!, $filter: String) {
    getUserFollowInfo(username: $username, filter: $filter)
  }
`

export const GET_NOTIFICATIONS = gql`
  query notifications {
    notifications {
      _id
      userId
      userIdBy
      userBy {
        _id
        name
        avatar
        username
        contributorBadge
      }
      label
      status
      created
      notificationType
      post {
        _id
        url
      }
    }
  }
`

export const GET_LATEST_QUOTES = gql`
  query latestQuotes($limit: Int!) {
    latestQuotes(limit: $limit) {
      _id
      quote
      created
      user {
        _id
        username
        contributorBadge
      }
    }
  }
`
export const GET_FEATURED_POSTS = gql`
  query featuredPosts(
    $limit: Int
    $offset: Int
    $searchKey: String
    $startDateRange: String
    $endDateRange: String
    $friendsOnly: Boolean
    $groupId: String
    $userId: String
    $approved: Boolean
    $deleted: Boolean
    $interactions: Boolean
    $sortOrder: String
  ) {
    featuredPosts(
      limit: $limit
      offset: $offset
      searchKey: $searchKey
      startDateRange: $startDateRange
      endDateRange: $endDateRange
      friendsOnly: $friendsOnly
      groupId: $groupId
      userId: $userId
      approved: $approved
      deleted: $deleted
      interactions: $interactions
      sortOrder: $sortOrder
    ) {
      entities {
        _id
        userId
        groupId
        title
        text
        upvotes
        downvotes
        bookmarkedBy
        created
        url
        creator {
          name
          username
          avatar
          _id
          contributorBadge
        }
        votes {
          _id
          startWordIndex
          endWordIndex
          type
        }
        comments {
          _id
        }
        quotes {
          _id
        }
        messageRoom {
          _id
          messages {
            _id
          }
        }
      }
      pagination {
        total_count
        limit
        offset
      }
    }
  }
`

export const SEARCH_USERNAMES = gql`
  query searchUsernames($query: String!) {
    searchUser(queryName: $query) {
      _id
      name
      username
      avatar
      contributorBadge
    }
  }
`
