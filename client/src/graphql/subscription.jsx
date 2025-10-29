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

export const MSG_TYPING_UPDATE = gql`
  subscription msgTypingUpdate($conversationId: ID!) {
    msgTypingUpdate(conversationId: $conversationId) {
      conversationId
      userId
      isTyping
      lastUpdated
    }
  }
`

export const RECEIPT_UPDATE = gql`
  subscription receiptUpdate($conversationId: ID!) {
    receiptUpdate(conversationId: $conversationId) {
      conversationId
      userId
      lastSeenMessageId
      lastSeenAt
    }
  }
`