import { Avatar, Paper, IconButton, Tooltip, Typography } from '@material-ui/core'
import { Delete, Done, DoneAll } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import AvatarDisplay from '../Avatar'
import { DELETE_MESSAGE } from '../../graphql/mutations'
import { SET_SNACKBAR } from '../../store/ui'

const useStyles = makeStyles((theme) => ({
  messageWrapper: {
    marginBottom: theme.spacing(1.75),
    display: 'flex',
    width: '100%',
    padding: theme.spacing(0, 2),
    '&:hover': {
      '& $deleteButton': {
        opacity: 1,
      },
    },
  },
  messageWrapperOwn: {
    justifyContent: 'flex-end',
  },
  messageWrapperOther: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: theme.spacing(1.25),
    marginLeft: theme.spacing(1.25),
    flexShrink: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  avatarOwn: {
    order: 2,
    marginRight: theme.spacing(1.25),
    marginLeft: 0,
  },
  bubbleContainer: {
    maxWidth: '75%',
    minWidth: '120px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  bubble: {
    position: 'relative',
    background: theme.palette.mode === 'dark' ? '#2A2A2A' : '#ffffff',
    borderRadius: '20px 20px 20px 6px',
    padding: theme.spacing(1.25, 1.75),
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)'
      : '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    wordWrap: 'break-word',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    color: theme.palette.text.primary,
    border: theme.palette.mode === 'dark'
      ? `1px solid ${theme.palette.divider}`
      : `1px solid ${theme.palette.grey[200]}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)'
        : '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  },
  bubbleReverse: {
    position: 'relative',
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    borderRadius: '20px 20px 6px 20px',
    padding: theme.spacing(1.25, 1.75),
    boxShadow: '0 4px 12px rgba(82, 178, 116, 0.35), 0 2px 4px rgba(82, 178, 116, 0.2)',
    wordWrap: 'break-word',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    color: '#ffffff',
    border: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 6px 16px rgba(82, 178, 116, 0.4), 0 3px 6px rgba(82, 178, 116, 0.25)',
    },
  },
  deleteIcon: {
    color: '#f44336',
    fontSize: '18px',
  },
  messageContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  deleteButton: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    zIndex: 10,
    backgroundColor: theme.palette.mode === 'dark' ? '#3A3A3A' : '#ffffff',
    borderRadius: '50%',
    padding: '6px',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 3px 10px rgba(0,0,0,0.4)'
      : '0 3px 10px rgba(0,0,0,0.2)',
    width: 28,
    height: 28,
    opacity: 0,
    transition: 'opacity 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#4A4A4A' : '#f5f5f5',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 14px rgba(0,0,0,0.5)'
        : '0 4px 14px rgba(0,0,0,0.25)',
      transform: 'scale(1.1)',
    },
  },
  readReceipt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(0.75),
    paddingRight: theme.spacing(0.5),
    minHeight: 16,
  },
  readReceiptSent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.75),
    paddingLeft: theme.spacing(0.5),
    minHeight: 16,
  },
  receiptIcon: {
    fontSize: '1.1rem',
    transition: 'all 0.2s ease',
  },
  receiptIconRead: {
    color: '#52b274',
    opacity: 1,
    filter: 'drop-shadow(0 1px 2px rgba(82, 178, 116, 0.3))',
    fontSize: '1.15rem',
    fontWeight: 'bold',
  },
  receiptIconSent: {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    opacity: 1,
    fontSize: '1rem',
  },
  receiptIconSentOther: {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    opacity: 1,
  },
  timestamp: {
    fontSize: '0.6875rem',
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    marginTop: theme.spacing(0.25),
    paddingLeft: theme.spacing(0.5),
    fontWeight: 500,
  },
  timestampOwn: {
    fontSize: '0.6875rem',
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    marginTop: theme.spacing(0.25),
    paddingRight: theme.spacing(0.5),
    textAlign: 'right',
    fontWeight: 500,
  },
  senderName: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(0.25),
    paddingLeft: theme.spacing(0.5),
  },
}))

function MessageItem({ message }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user?.data)
  const selectedRoom = useSelector((state) => state.chat?.selectedRoom?.room)
  
  if (!user || !message) return null
  
  const userId = user._id
  const isDefaultDirection = message.userId !== userId
  const isOwnMessage = user._id === message.userId

  // Get other user ID for DM read receipt check
  const getOtherUserId = () => {
    if (!selectedRoom || !selectedRoom.users) return null
    const otherUser = selectedRoom.users.find((id) => id.toString() !== userId.toString())
    return otherUser?.toString()
  }

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update(cache, { data: { deleteMessage } }) {
      cache.modify({
        fields: {
          messages(existing = [], { readField }) {
            return existing.filter(
              (messageRef) => readField('_id', messageRef) !== deleteMessage._id,
            )
          },
        },
      })
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMessage({ variables: { messageId: message._id } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Message deleted successfully',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Delete Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  // Check if message is read - for DMs, check if the other user has read it
  const readBy = message.readBy || []
  const otherUserId = getOtherUserId()
  
  // Normalize IDs to strings for comparison
  const normalizeId = (id) => {
    if (!id) return null
    return id.toString ? id.toString() : String(id)
  }
  
  const normalizedReadBy = readBy.map(normalizeId).filter(Boolean)
  const normalizedOtherUserId = normalizeId(otherUserId)
  
  // For DMs: check if the recipient (other user) has read it
  // For groups: check if anyone has read it
  const isRead = selectedRoom?.messageType === 'USER' && normalizedOtherUserId
    ? normalizedReadBy.includes(normalizedOtherUserId)
    : normalizedReadBy.length > 0

  // Format timestamp
  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Get read receipt icon with better styling
  const getReadReceiptIcon = () => {
    if (!isOwnMessage) return null
    
    if (isRead) {
      return (
        <Tooltip title="Read" placement="top" arrow>
          <DoneAll 
            className={`${classes.receiptIcon} ${classes.receiptIconRead}`}
            style={{ fontSize: '1.15rem' }}
          />
        </Tooltip>
      )
    }
    return (
      <Tooltip title="Sent" placement="top" arrow>
        <Done 
          className={`${classes.receiptIcon} ${classes.receiptIconSent}`}
          style={{ fontSize: '1rem' }}
        />
      </Tooltip>
    )
  }

  return (
    <div className={`${classes.messageWrapper} ${isDefaultDirection ? classes.messageWrapperOther : classes.messageWrapperOwn}`}>
      {isDefaultDirection && (
        <Avatar className={classes.avatar}>
          <AvatarDisplay height={40} width={40} {...message.user.avatar} />
        </Avatar>
      )}
      <div className={classes.bubbleContainer}>
        {isDefaultDirection && message.user?.name && (
          <Typography className={classes.senderName}>
            {message.user.name || message.user.username}
          </Typography>
        )}
        <div className={classes.messageContainer}>
          <Paper
            elevation={0}
            className={isDefaultDirection ? classes.bubble : classes.bubbleReverse}
          >
            <Typography 
              variant="body2" 
              style={{ 
                color: isDefaultDirection ? 'inherit' : '#ffffff',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
              }}
            >
              {message.text}
            </Typography>
          </Paper>
          {(user._id === message.userId || user.admin) && (
            <IconButton 
              onClick={handleDelete} 
              className={classes.deleteButton}
              size="small"
            >
              <Delete className={classes.deleteIcon} />
            </IconButton>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start', gap: 6 }}>
          {isOwnMessage && getReadReceiptIcon()}
          <Typography 
            className={isOwnMessage ? classes.timestampOwn : classes.timestamp}
            style={{ 
              color: 'rgba(0, 0, 0, 0.65)',
            }}
          >
            {formatTime(message.created)}
          </Typography>
        </div>
      </div>
      {!isDefaultDirection && (
        <Avatar className={`${classes.avatar} ${classes.avatarOwn}`}>
          <AvatarDisplay height={40} width={40} {...message.user.avatar} />
        </Avatar>
      )}
    </div>
  )
}

MessageItem.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    user: PropTypes.object,
    readBy: PropTypes.array,
    created: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
}

export default MessageItem
