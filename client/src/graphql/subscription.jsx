import gql from 'graphql-tag'

export const NEW_MESSAGE_SUBSCRIPTION = gql`
subscription newMessage($messageRoomId: String!) {
  message(messageRoomId: $messageRoomId) {
    _id
    messageRoomId
    userId
    userName
    title
    text
    created
    type
    mutation_type
  }
}
`

export const NEW_NOTIFICATION_SUBSCRIPTION = gql`
  subscription notification($userId: String!) {
    notification(userId: $userId) {
      _id
      userId
      userIdBy
      userBy{
        name
        avatar
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

// ===== Presence Subscriptions =====
export const PRESENCE_SUBSCRIPTION = gql`
  subscription presence($userId: String) {
    presence(userId: $userId) {
      userId
      status
      statusMessage
      lastSeen
    }
  }
`

// ===== Roster Subscriptions =====
export const ROSTER_SUBSCRIPTION = gql`
  subscription roster($userId: String!) {
    roster(userId: $userId) {
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
    }
  }
`

// ===== Typing Subscriptions =====
export const TYPING_SUBSCRIPTION = gql`
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
`
