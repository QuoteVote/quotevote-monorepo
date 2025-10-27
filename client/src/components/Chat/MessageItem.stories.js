import React from 'react'

import MessageItem from './MessageItem'

export default {
  component: MessageItem,
  title: 'Chat',
}

const message = {
  userId: '123123',
  text: 'Test',
  user: {
    avatar: 'J',
  },
}

export const Message = () => <MessageItem message={message} />
