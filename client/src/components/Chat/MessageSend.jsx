import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING, SELECTED_CHAT_ROOM } from '../../store/chat'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import { Typography } from '@material-ui/core'
import { GET_ROOM_MESSAGES, GET_CHAT_ROOMS } from '../../graphql/query'
import { SEND_MESSAGE } from '../../graphql/mutations'
import useGuestGuard from '../../utils/useGuestGuard'
import { useTypingIndicator } from '../../hooks/useTypingIndicator'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: theme.spacing(1, 1.5),
    borderRadius: 28,
    border: `2px solid ${theme.palette.grey[300]}`,
    backgroundColor: '#ffffff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
    '&:focus-within': {
      borderColor: '#52b274',
      boxShadow: `0 0 0 3px rgba(82, 178, 116, 0.25), 0 4px 16px rgba(82, 178, 116, 0.15)`,
      transform: 'translateY(-1px)',
    },
  },
  input: {
    flex: 1,
    fontSize: '0.9375rem',
    '& textarea': {
      padding: theme.spacing(0.875, 1.25),
      maxHeight: 140,
      overflowY: 'auto',
      lineHeight: 1.5,
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.6,
      },
      '&::-webkit-scrollbar': {
        width: 6,
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[400],
        borderRadius: 3,
        '&:hover': {
          background: theme.palette.grey[500],
        },
      },
    },
  },
  sendButton: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(0.75),
    color: '#ffffff',
    backgroundColor: '#52b274',
    borderRadius: '50%',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 8px rgba(82, 178, 116, 0.3)',
    '&:hover': {
      backgroundColor: '#4a9e63',
      transform: 'scale(1.08)',
      boxShadow: '0 4px 12px rgba(82, 178, 116, 0.4)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&:disabled': {
      color: theme.palette.text.disabled,
      backgroundColor: theme.palette.grey[300],
      boxShadow: 'none',
      transform: 'none',
      opacity: 0.5,
    },
  },
}))

// eslint-disable-next-line react/prop-types
export default function MessageSend({ messageRoomId, type, title, componentId }) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [text, setText] = React.useState('')
  const [error, setError] = React.useState(null)
  const user = useSelector((state) => state.user?.data)
  const ensureAuth = useGuestGuard()
  
  // Typing indicator - only if room exists
  const { handleTyping, stopTyping } = useTypingIndicator(messageRoomId)
  const [createMessage, { loading }] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to send message')
      dispatch(CHAT_SUBMITTING(false))
    },
    onCompleted: (data) => {
      dispatch(CHAT_SUBMITTING(false))
      setError(null) // Clear any previous errors
      
      // If room was just created, update the selected room with the new room ID
      if (!messageRoomId && data?.createMessage?.messageRoomId) {
        const newRoomId = data.createMessage.messageRoomId
        // Refetch chat rooms to get the full room data
        // The room will be updated via refetchQueries
      }
    },
    refetchQueries: [
      {
        query: GET_CHAT_ROOMS,
      },
      ...(messageRoomId ? [{
        query: GET_ROOM_MESSAGES,
        variables: {
          messageRoomId,
        },
      }] : []),
    ],
  })

  const handleSubmit = async () => {
    if (!ensureAuth()) return
    if (!text.trim()) return // Don't submit empty messages
    
    // Stop typing indicator when sending
    stopTyping()
    
    dispatch(CHAT_SUBMITTING(true))

    const message = {
      title,
      type,
      messageRoomId: messageRoomId || null, // null if room doesn't exist yet
      componentId: componentId || null, // recipient ID for creating new DM room
      text: text.trim(),
    }

    const dateSubmitted = new Date()
    await createMessage({
      variables: { message },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          _id: dateSubmitted, // dummy
          messageRoomId,
          userName: user.name,
          userId: user._id,
          title,
          text: text.trim(),
          type,
          created: dateSubmitted,
          user: {
            __typename: 'User',
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          },
        },
      },
      // eslint-disable-next-line no-shadow
      update: (proxy, { data: { createMessage } }) => {
        // Only update cache if we have a messageRoomId
        // If room was just created, the refetchQueries will handle it
        if (messageRoomId && createMessage?.messageRoomId) {
          try {
            const data = proxy.readQuery({ 
              query: GET_ROOM_MESSAGES, 
              variables: { messageRoomId: createMessage.messageRoomId } 
            })
            if (data) {
              proxy.writeQuery({
                query: GET_ROOM_MESSAGES,
                variables: { messageRoomId: createMessage.messageRoomId },
                data: {
                  ...data,
                  messages: [...(data.messages || []), createMessage],
                },
              })
            }
          } catch (error) {
            // Cache might not exist yet for new rooms, that's okay
            console.log('Cache update skipped for new room:', error)
          }
        }
      },
    })
    
    // Clear the text input after successful submission
    setText('')
  }
  return (
    <Paper className={classes.root} elevation={0}>
      {error && (
        <Typography variant="caption" color="error" style={{ marginBottom: 8 }}>
          Unable to send a message.
        </Typography>
      )}
      <InputBase
        className={classes.input}
        placeholder="Type a message..."
        inputProps={{ 'aria-label': 'message input' }}
        fullWidth
        multiline
        rowsMin={1}
        rowsMax={5}
        value={text}
        onChange={(event) => {
          const { value } = event.target
          setText(value)
          // Trigger typing indicator
          if (value.length > 0) {
            handleTyping()
          } else {
            stopTyping()
          }
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit()
          }
        }}
      />
      <IconButton
        type="submit"
        aria-label="Send"
        disabled={loading || !text.trim()}
        onClick={handleSubmit}
        className={classes.sendButton}
        size="small"
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Paper>
  )
}
