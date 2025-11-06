import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import ScrollableFeed from 'react-scrollable-feed'
import MessageItem from './MessageItem'
import QuoteHeaderMessage from './QuoteHeaderMessage'
import { GET_ROOM_MESSAGES, GET_POST } from '../../graphql/query'
import LoadingSpinner from '../LoadingSpinner'
import { NEW_MESSAGE_SUBSCRIPTION } from '../../graphql/subscription'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    padding: theme.spacing(1, 0),
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0.5, 0),
  },
  inline: {
    display: 'inline',
  },
}))

export default function MessageItemList() {
  const classes = useStyles()
  const selectedRoom = useSelector((state) => state.chat?.selectedRoom)
  const messageRoomId = selectedRoom?.room?._id
  const messageType = selectedRoom?.room?.messageType
  const postDetails = selectedRoom?.room?.postDetails
  const postId = postDetails?._id

  const {
    loading, error, data, refetch,
  } = useQuery(GET_ROOM_MESSAGES, {
    variables: { messageRoomId },
    skip: !messageRoomId,
  })

  // Fetch full post with creator info if this is a POST type room
  const { data: postData } = useQuery(GET_POST, {
    variables: { postId },
    skip: !postId || messageType !== 'POST',
  })

  useSubscription(
    NEW_MESSAGE_SUBSCRIPTION,
    messageRoomId ? {
      variables: { messageRoomId },
      onSubscriptionData: async () => {
        await refetch()
      },
    } : { skip: true },
  )

  if (!messageRoomId) {
    return (
      <div className={classes.root}>
        <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
          Select a conversation to view messages
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={classes.root}>
        <div style={{ padding: 20, textAlign: 'center', color: '#f44336' }}>
          Something went wrong!
        </div>
      </div>
    )
  }

  const messageData = (!loading && data?.messages) || []
  const post = postData?.post
  const postCreator = post?.creator

  // Use post data if available, otherwise fall back to postDetails
  const quoteData = post || postDetails

  // Show quote header for POST type rooms
  const showQuoteHeader = messageType === 'POST' && quoteData

  return (
    <div className={classes.root}>
      <ScrollableFeed>
        <div className={classes.messageList}>
          {loading && <LoadingSpinner size={50} />}
          {showQuoteHeader && (
            <QuoteHeaderMessage 
              postDetails={quoteData} 
              postCreator={postCreator}
            />
          )}
          {messageData.map((message) => (
            <MessageItem key={message._id} message={message} />
          ))}
        </div>
      </ScrollableFeed>
    </div>
  )
}
