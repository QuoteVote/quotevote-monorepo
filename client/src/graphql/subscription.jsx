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

export const PRESENCE_UPDATED = gql`
  subscription presenceUpdated($userId: ObjectId!) {
    presenceUpdated(userId: $userId) {
      userId
      state
      statusText
      updatedAt
    }
  }
`

export const MESSAGE_ADDED = gql`
  subscription messageAdded($conversationId: ObjectId!) {
    messageAdded(conversationId: $conversationId) {
      _id
      conversationId
      senderId
      body
      createdAt
    }
  }
`

export const TYPING_UPDATED = gql`
  subscription typingUpdated($conversationId: ObjectId!) {
    typingUpdated(conversationId: $conversationId) {
      conversationId
      userId
      isTyping
      until
    }
  }
`

export const RECEIPT_UPDATED = gql`
  subscription receiptUpdated($conversationId: ObjectId!) {
    receiptUpdated(conversationId: $conversationId) {
      _id
      conversationId
      userId
      lastSeenMessageId
      lastSeenAt
    }
  }
`
