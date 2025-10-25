import { useEffect, useMemo, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Typography,
  TextField,
  Button,
  Paper,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import {
  CHAT_MESSAGES,
  CHAT_RECEIPTS,
} from '../../graphql/query'
import {
  SEND_CHAT_MESSAGE,
  SET_TYPING,
  MARK_CHAT_READ,
} from '../../graphql/mutations'
import {
  MESSAGE_ADDED,
  TYPING_UPDATED,
  RECEIPT_UPDATED,
} from '../../graphql/subscription'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import LoadingSpinner from '../LoadingSpinner'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    gap: theme.spacing(1),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: theme.spacing(1),
  },
  title: {
    fontWeight: 600,
  },
  messagesWrapper: {
    flex: 1,
    overflowY: 'auto',
    padding: theme.spacing(2),
    backgroundColor: '#F7F9FB',
    borderRadius: 12,
  },
  messageRow: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  mine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    padding: theme.spacing(1),
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  myBubble: {
    backgroundColor: '#d6ecff',
  },
  composer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  typing: {
    color: '#7f8c8d',
    fontSize: 12,
    paddingLeft: theme.spacing(1),
  },
  receipts: {
    color: '#7f8c8d',
    fontSize: 12,
    paddingTop: theme.spacing(0.5),
  },
}))

function MessageBox() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const rawUserId = useSelector((state) => state.user.data?._id)
  const myUserId = rawUserId ? rawUserId.toString() : undefined
  const [composer, setComposer] = useState('')
  const [typingMap, setTypingMap] = useState({})
  const bottomRef = useRef(null)
  const typingTimeout = useRef(null)

  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  const conversation = selectedRoom?.conversation
  const conversationId = conversation?._id
  const label = selectedRoom?.label || 'Conversation'
  const participants = selectedRoom?.participants || {}

  const {
    data: messageData,
    loading: messageLoading,
    subscribeToMore,
  } = useQuery(CHAT_MESSAGES, {
    variables: { conversationId, limit: 100 },
    skip: !conversationId,
    fetchPolicy: 'network-only',
  })

  const {
    data: receiptData,
    subscribeToMore: subscribeReceipts,
  } = useQuery(CHAT_RECEIPTS, {
    variables: { conversationId },
    skip: !conversationId,
    fetchPolicy: 'cache-and-network',
  })

  const [sendMessage] = useMutation(SEND_CHAT_MESSAGE)
  const [setTyping] = useMutation(SET_TYPING)
  const [markRead] = useMutation(MARK_CHAT_READ)

  useEffect(() => {
    if (!conversationId || typeof subscribeToMore !== 'function' || typeof subscribeReceipts !== 'function') {
      return () => {}
    }

    const unsubscribeMessage = subscribeToMore({
      document: MESSAGE_ADDED,
      variables: { conversationId },
      updateQuery: (prev = { chatMessages: [] }, { subscriptionData }) => {
        const newMessage = subscriptionData.data?.messageAdded
        if (!newMessage) return prev
        const exists = prev.chatMessages.some((msg) => msg._id === newMessage._id)
        const nextMessages = exists
          ? prev.chatMessages
          : [...prev.chatMessages, newMessage]
        if (newMessage.senderId !== myUserId) {
          markRead({
            variables: {
              conversationId,
              lastSeenMessageId: newMessage._id,
            },
          })
        }
        return { ...prev, chatMessages: nextMessages }
      },
    })

    const unsubscribeTyping = subscribeToMore({
      document: TYPING_UPDATED,
      variables: { conversationId },
      updateQuery: (prev) => prev,
      onSubscriptionData: ({ subscriptionData }) => {
        const event = subscriptionData.data?.typingUpdated
        if (!event) return
        setTypingMap((current) => {
          const next = { ...current }
          const until = new Date(event.until).getTime()
          if (event.isTyping) {
            next[event.userId] = until
          } else {
            delete next[event.userId]
          }
          return next
        })
      },
    })

    const unsubscribeReceipts = subscribeReceipts({
      document: RECEIPT_UPDATED,
      variables: { conversationId },
      updateQuery: (prev = { chatReceipts: [] }, { subscriptionData }) => {
        const receipt = subscriptionData.data?.receiptUpdated
        if (!receipt) return prev
        const filtered = prev.chatReceipts.filter(
          (item) => item.userId !== receipt.userId,
        )
        return { ...prev, chatReceipts: [...filtered, receipt] }
      },
    })

    return () => {
      unsubscribeMessage()
      unsubscribeTyping()
      if (typeof unsubscribeReceipts === 'function') {
        unsubscribeReceipts()
      }
    }
  }, [conversationId, markRead, myUserId, subscribeReceipts, subscribeToMore])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      setTypingMap((current) => {
        const next = { ...current }
        Object.entries(next).forEach(([key, value]) => {
          if (value < now) {
            delete next[key]
          }
        })
        return next
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messageData?.chatMessages?.length])

  useEffect(() => {
    if (!conversationId) return
    const messages = messageData?.chatMessages || []
    if (!messages.length) return
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.senderId !== myUserId) {
      markRead({
        variables: {
          conversationId,
          lastSeenMessageId: lastMessage._id,
        },
      })
    }
  }, [conversationId, markRead, messageData, myUserId])

  const handleBack = () => {
    dispatch(SELECTED_CHAT_ROOM(null))
  }

  const handleSend = async () => {
    if (!composer.trim() || !conversationId) return
    await sendMessage({
      variables: { conversationId, body: composer.trim() },
    })
    setComposer('')
    setTyping({ variables: { conversationId, isTyping: false } })
  }

  const handleComposerChange = (event) => {
    setComposer(event.target.value)
    if (!conversationId) return
    setTyping({ variables: { conversationId, isTyping: true } })
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current)
    }
    typingTimeout.current = setTimeout(() => {
      setTyping({ variables: { conversationId, isTyping: false } })
    }, 2000)
  }

  const messages = messageData?.chatMessages || []
  const receipts = receiptData?.chatReceipts || []
  const lastMessageId = messages.length
    ? messages[messages.length - 1]._id
    : null

  const seenBy = useMemo(() => {
    if (!lastMessageId) return []
    return receipts
      .filter(
        (receipt) =>
          receipt.userId !== myUserId &&
          receipt.lastSeenMessageId === lastMessageId,
      )
      .map((receipt) =>
        participants[receipt.userId]?.username || `User ${receipt.userId.slice(-4)}`,
      )
  }, [receipts, lastMessageId, myUserId, participants])

  const typingUsers = Object.keys(typingMap)
    .filter((id) => id !== myUserId && typingMap[id] > Date.now())
    .map((id) => participants[id]?.username || 'Someone')

  if (!conversationId) {
    return (
      <Paper elevation={1} className={classes.container}>
        <Typography variant="body1" style={{ padding: 16 }}>
          Select a conversation to start chatting.
        </Typography>
      </Paper>
    )
  }

  if (messageLoading) {
    return <LoadingSpinner size={40} />
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <IconButton onClick={handleBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="subtitle1" className={classes.title}>
          {label}
        </Typography>
      </div>

      <div className={classes.messagesWrapper}>
        {messages.map((message) => {
          const isMine = message.senderId === myUserId
          const senderName = participants[message.senderId]?.username || 'Unknown'
          return (
            <div
              key={message._id}
              className={`${classes.messageRow} ${isMine ? classes.mine : ''}`}
            >
              <div className={`${classes.bubble} ${isMine ? classes.myBubble : ''}`}>
                {!isMine && (
                  <Typography variant="caption" color="textSecondary">
                    {senderName}
                  </Typography>
                )}
                <Typography variant="body2">{message.body}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {typingUsers.length > 0 && (
        <Typography className={classes.typing}>
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing…
        </Typography>
      )}

      {seenBy.length > 0 && (
        <Typography className={classes.receipts}>
          Seen by: {seenBy.join(', ')}
        </Typography>
      )}

      <div className={classes.composer}>
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Type a message and hit enter"
          value={composer}
          onChange={handleComposerChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSend()
            }
          }}
          multiline
          minRows={1}
          maxRows={4}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={!composer.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  )
}

export default MessageBox
