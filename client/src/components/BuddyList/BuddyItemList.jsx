import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import PropTypes from 'prop-types'
import {
  Avatar,
  Typography,
  Tooltip,
  Badge,
  Chip,
  Fade,
} from '@material-ui/core'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import GroupIcon from '@material-ui/icons/Group'
import AvatarDisplay from '../Avatar'
import PresenceIcon from '../Chat/PresenceIcon'
import StatusMessage from '../Chat/StatusMessage'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import { SEND_MESSAGE } from '../../graphql/mutations'
import { GET_CHAT_ROOMS } from '../../graphql/query'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(0.5, 0),
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.grey[300],
      borderRadius: 4,
      '&:hover': {
        background: theme.palette.grey[400],
      },
    },
  },
  blur: {
    opacity: 0.6,
    pointerEvents: 'none',
  },
  listItem: {
    padding: theme.spacing(1.5, 2),
    margin: theme.spacing(0.5, 1.5),
    borderRadius: 12,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: `1px solid transparent`,
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      borderColor: theme.palette.grey[200],
      transform: 'translateX(2px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    },
    '&:active': {
      backgroundColor: theme.palette.primary.light + '15',
      borderColor: theme.palette.primary.light + '40',
      transform: 'translateX(0)',
    },
  },
  divider: {
    display: 'none', // Modern design without dividers
  },
  unreadBadge: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    fontWeight: 700,
    minWidth: 22,
    height: 22,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    padding: '0 7px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
  friendChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 600,
    fontSize: '0.65rem',
    height: 22,
    '& .MuiChip-icon': {
      color: 'white',
      fontSize: '0.9rem',
    },
  },
  postChip: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    fontWeight: 600,
    fontSize: '0.65rem',
    height: 22,
    '& .MuiChip-icon': {
      color: 'white',
      fontSize: '0.9rem',
    },
  },
  hint: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: theme.spacing(4),
    fontSize: '0.95rem',
    lineHeight: 1.8,
    '& strong': {
      color: theme.palette.text.primary,
      display: 'block',
      fontSize: '1.1rem',
      marginBottom: theme.spacing(1),
    },
  },
  listItemText: {
    flex: '1 1 auto',
    minWidth: 0,
    marginRight: theme.spacing(6),
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 0,
  },
  textContent: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1 1 auto',
    minWidth: 0,
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '0.875rem',
  },
  avatar: {
    width: 44,
    height: 44,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(6, 3),
    color: theme.palette.text.secondary,
    '& svg': {
      fontSize: 64,
      opacity: 0.3,
      marginBottom: theme.spacing(2),
    },
  },
}))

const emptyData = [
  {
    Text: 'Car Shark',
    type: 'USER',
    avatar: {},
  },
  {
    Text: 'Four Aces',
    type: 'POST',
    avatar: {},
  },
  {
    Text: 'Peter Parker',
    type: 'USER',
    avatar: {},
  },
  {
    Text: 'Lebron James',
    type: 'USER',
    avatar: {},
  },
  {
    Text: 'Twitter',
    type: 'POST',
    avatar: {},
  },
]

// Component to handle text overflow detection and tooltip
const TruncatedText = ({ text, className }) => {
  const textRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current
        setIsOverflowing(element.scrollWidth > element.clientWidth)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text])

  const textElement = (
    <div ref={textRef} className={className}>
      {text}
    </div>
  )

  return isOverflowing ? (
    <Tooltip title={text} placement="top" arrow>
      {textElement}
    </Tooltip>
  ) : (
    textElement
  )
}

TruncatedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

function BuddyItemList({ buddyList }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user?.data)
  const [createMessageRoom] = useMutation(SEND_MESSAGE, {
    refetchQueries: [{ query: GET_CHAT_ROOMS }],
  })
  const itemList = buddyList && buddyList.length ? buddyList : emptyData

  const handleClickItem = async (item) => {
    if (!buddyList.length || !currentUser) return

    // If item has a room, use it
    if (item.room) {
      dispatch(SELECTED_CHAT_ROOM({ room: item.room }))
      return
    }

    // If item has a user (from buddy list), create a message room
    if (item.user && item.user._id) {
      try {
        // Create message room by sending an empty message (or we could create a separate mutation)
        // For now, create a room structure that will be created when first message is sent
        const roomData = {
          _id: null, // Will be created on first message
          users: [currentUser._id, item.user._id],
          messageType: 'USER',
          title: item.user.name || item.user.username,
          avatar: item.user.avatar,
          isDirect: true,
        }
        dispatch(SELECTED_CHAT_ROOM({ room: roomData }))
      } catch (error) {
        console.error('Error creating message room:', error)
      }
    }
  }

  if (!buddyList.length) {
    return (
      <Fade in timeout={500}>
        <div>
          <div className={classes.hint}>
            <ChatBubbleOutlineIcon
              style={{ fontSize: 64, opacity: 0.2, marginBottom: 16 }}
            />
            <Typography variant="h6" gutterBottom>
              <strong>No Conversations Yet</strong>
            </Typography>
            <Typography variant="body2">
              Start chatting by adding friends!
              <br />
              Follow users to see them here.
            </Typography>
          </div>
          <List className={classNames(classes.root, classes.blur)}>
            {emptyData.map((item, index) => (
              <Fade in timeout={300 + index * 100} key={index}>
                <ListItem className={classes.listItem}>
                  <ListItemAvatar>
                    <Avatar className={classes.avatar}>
                      {item.type === 'USER' && (
                        <AvatarDisplay
                          height={40}
                          width={40}
                          {...item.avatar}
                        />
                      )}
                      {item.type !== 'USER' && item.Text[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    className={classes.listItemText}
                    primary={
                      <div className={classes.primaryText}>
                        <TruncatedText
                          text={item.Text}
                          className={classes.textContent}
                        />
                        <Chip
                          size="small"
                          icon={
                            item.type === 'USER' ? (
                              <ChatBubbleOutlineIcon />
                            ) : (
                              <GroupIcon />
                            )
                          }
                          label={item.type === 'USER' ? 'FRIEND' : 'POST'}
                          className={
                            item.type === 'USER'
                              ? classes.friendChip
                              : classes.postChip
                          }
                        />
                      </div>
                    }
                  />
                </ListItem>
              </Fade>
            ))}
          </List>
        </div>
      </Fade>
    )
  }

  return (
    <List className={classes.root}>
      {itemList &&
        itemList.length > 0 &&
        itemList.map((item, index) => {
          if (!item) return null

          const itemText =
            item.Text || item.user?.name || item.user?.username || 'Unknown'
          const itemType = item.type || (item.user ? 'USER' : 'POST')
          const itemKey = item.room?._id || item.user?._id || item._id || index

          return (
            <Fade in timeout={200 + index * 50} key={itemKey}>
              <ListItem
                className={classes.listItem}
                onClick={() => handleClickItem(item)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    invisible={
                      !item.unreadMessages || item.unreadMessages === 0
                    }
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#44b700',
                        color: '#44b700',
                        boxShadow: `0 0 0 2px #fff`,
                      },
                    }}
                  >
                    <Avatar className={classes.avatar}>
                      {itemType === 'USER' && item.user && (
                        <AvatarDisplay
                          height={40}
                          width={40}
                          {...(item.user.avatar || {})}
                        />
                      )}
                      {itemType !== 'USER' && itemText && itemText[0]}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary={
                    <div className={classes.primaryText}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {item.presence && (
                          <PresenceIcon
                            status={item.presence.status || 'offline'}
                          />
                        )}
                        <TruncatedText
                          text={itemText}
                          className={classes.textContent}
                        />
                      </div>
                      <Chip
                        size="small"
                        icon={
                          itemType === 'USER' ? (
                            <ChatBubbleOutlineIcon />
                          ) : (
                            <GroupIcon />
                          )
                        }
                        label={itemType === 'USER' ? 'FRIEND' : 'POST'}
                        className={
                          itemType === 'USER'
                            ? classes.friendChip
                            : classes.postChip
                        }
                      />
                    </div>
                  }
                  secondary={
                    item.statusMessage ? (
                      <StatusMessage message={item.statusMessage} />
                    ) : item.presence?.status === 'away' ? (
                      <Typography
                        variant="caption"
                        style={{ fontStyle: 'italic', color: '#ffc107' }}
                      >
                        Away
                      </Typography>
                    ) : item.presence?.status === 'dnd' ? (
                      <Typography
                        variant="caption"
                        style={{ fontStyle: 'italic', color: '#f44336' }}
                      >
                        Do Not Disturb
                      </Typography>
                    ) : null
                  }
                />
                {item.unreadMessages > 0 && (
                  <ListItemSecondaryAction>
                    <div className={classes.unreadBadge}>
                      {item.unreadMessages > 99 ? '99+' : item.unreadMessages}
                    </div>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Fade>
          )
        })}
    </List>
  )
}

BuddyItemList.propTypes = {
  buddyList: PropTypes.any,
}

export default BuddyItemList
