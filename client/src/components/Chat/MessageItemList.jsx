import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import ScrollableFeed from 'react-scrollable-feed'
import MessageItem from './MessageItem'
import { GET_ROOM_MESSAGES } from '../../graphql/query'
import LoadingSpinner from '../LoadingSpinner'
import { NEW_MESSAGE_SUBSCRIPTION } from '../../graphql/subscription'

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    maxHeight: 470,
  },
  inline: {
    display: 'inline',
  },
}))

export default function MessageItemList() {
  const classes = useStyles()
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const { _id: messageRoomId } = selectedRoom.room
  const {
    loading, error, data, refetch,
  } = useQuery(GET_ROOM_MESSAGES, {
    variables: { messageRoomId },
  })

  useSubscription(
    NEW_MESSAGE_SUBSCRIPTION,
    {
      variables: { messageRoomId },
      onSubscriptionData: async () => {
        await refetch()
      },
    },
  )

  if (error) return 'Something went wrong!'

  const messageData = (!loading && data.messages) || []

  return (
    <List className={classes.root} dense>
      <ScrollableFeed>
        {loading && <LoadingSpinner size={50} />}
        {messageData.map((message) => (
          <ListItem alignItems="flex-start" key={message._id}>
            <MessageItem message={message} />
          </ListItem>
        ))}
      </ScrollableFeed>
    </List>
  )
}
