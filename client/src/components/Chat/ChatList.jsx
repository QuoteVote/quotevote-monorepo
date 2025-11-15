import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { useDispatch, useSelector } from 'react-redux'
import {
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  Chip,
} from '@material-ui/core'
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline'
import GroupIcon from '@material-ui/icons/Group'
import { GET_CHAT_ROOMS, GET_USER } from '../../graphql/query'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import LoadingSpinner from '../LoadingSpinner'
import AvatarDisplay from '../Avatar'

const useStyles = makeStyles((theme) => ({
  root: {
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
  listItem: {
    padding: theme.spacing(1.75, 2),
    margin: theme.spacing(0.75, 2),
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: `1px solid transparent`,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    '&:hover': {
      backgroundColor: '#f8fafc',
      borderColor: theme.palette.grey[200],
      transform: 'translateX(4px)',
      boxShadow:
        '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
    },
  },
  selectedItem: {
    background:
      'linear-gradient(135deg, rgba(82, 178, 116, 0.1) 0%, rgba(74, 158, 99, 0.08) 100%)',
    borderColor: '#52b274' + '60',
    boxShadow:
      '0 4px 12px rgba(82, 178, 116, 0.15), 0 2px 4px rgba(82, 178, 116, 0.1)',
    '&:hover': {
      background:
        'linear-gradient(135deg, rgba(82, 178, 116, 0.15) 0%, rgba(74, 158, 99, 0.12) 100%)',
      borderColor: '#52b274' + '80',
      transform: 'translateX(4px)',
    },
  },
  noMessages: {
    textAlign: 'center',
    padding: theme.spacing(8, 3),
    color: theme.palette.text.secondary,
    '& svg': {
      fontSize: 64,
      opacity: 0.2,
      marginBottom: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  },
  avatar: {
    width: 48,
    height: 48,
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
    border: `3px solid ${theme.palette.background.paper}`,
    transition: 'all 0.2s ease',
  },
  primaryText: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    letterSpacing: '-0.01em',
  },
  lastMessage: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.25),
    fontWeight: 400,
  },
  unreadBadge: {
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    color: 'white',
    borderRadius: 14,
    minWidth: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0 8px',
    boxShadow:
      '0 3px 10px rgba(82, 178, 116, 0.4), 0 1px 3px rgba(82, 178, 116, 0.3)',
    border: '2px solid white',
  },
  typeChip: {
    marginLeft: theme.spacing(1),
    height: 20,
    fontSize: '0.65rem',
    fontWeight: 600,
  },
  dmChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
  },
  groupChip: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
  primaryTextContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
}))

const ChatList = ({ search, filterType }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user.data)
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  // const [userCache, setUserCache] = useState({})

  const { loading, data, refetch } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: 10000, // Poll every 10 seconds for new messages
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  if (loading && !data) return <LoadingSpinner size={50} />

  const rooms = data?.messageRooms || []

  // Filter by type
  const filteredRooms = rooms.filter((room) => {
    if (filterType === 'chats') {
      // Direct messages - USER type with 2 users
      return room.messageType === 'USER' && room.users?.length === 2
    } else if (filterType === 'groups') {
      // Group chats - POST type or more than 2 users
      return room.messageType === 'POST' || room.users?.length > 2
    }
    return true
  })

  // Filter by search (simplified - just filter by title for now)
  const searchFiltered = search
    ? filteredRooms.filter((room) => {
        const title = room.title || ''
        return title.toLowerCase().includes(search.toLowerCase())
      })
    : filteredRooms

  // Sort by last message time (most recent first), fallback to lastActivity, then created
  const sortedRooms = [...searchFiltered].sort((a, b) => {
    // Use lastMessageTime if available, otherwise use lastActivity, then created
    const aTime = a.lastMessageTime
      ? new Date(a.lastMessageTime).getTime()
      : a.lastActivity
      ? new Date(a.lastActivity).getTime()
      : new Date(a.created).getTime()
    const bTime = b.lastMessageTime
      ? new Date(b.lastMessageTime).getTime()
      : b.lastActivity
      ? new Date(b.lastActivity).getTime()
      : new Date(b.created).getTime()
    return bTime - aTime // Most recent first
  })

  const handleRoomClick = (room) => {
    dispatch(SELECTED_CHAT_ROOM({ room }))
  }

  const getRoomDisplayInfo = (room) => {
    if (room.messageType === 'USER' && room.users?.length === 2) {
      // Direct message - show title or "Chat"
      const otherUserId = room.users?.find(
        (id) => id.toString() !== currentUser?._id.toString(),
      )
      return {
        name: room.title || 'Direct Message',
        avatar: null,
        subtitle: `${room.users?.length || 0} participants`,
      }
    } else if (room.messageType === 'POST') {
      // Group chat for post - show post title
      const postTitle =
        room.postDetails?.title || room.title || 'Quote Discussion'
      const postText = room.postDetails?.text || ''
      const preview =
        postText.length > 50 ? `${postText.substring(0, 50)}...` : postText
      return {
        name: postTitle,
        avatar: null,
        subtitle: preview || `${room.users?.length || 0} participants`,
      }
    } else {
      // Other group chat - show title or default
      return {
        name: room.title || `Group Chat`,
        avatar: null,
        subtitle: `${room.users?.length || 0} members`,
      }
    }
  }

  if (sortedRooms.length === 0) {
    return (
      <div className={classes.noMessages}>
        <ChatBubbleOutlineIcon />
        <Typography
          variant="h6"
          style={{ fontWeight: 600, marginBottom: 8, marginTop: 16 }}
        >
          {search ? `No ${filterType} found` : `No ${filterType} yet`}
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          {search
            ? `Try a different search term`
            : filterType === 'chats'
            ? 'Add a buddy and start a conversation!'
            : 'Create a group or post to start chatting'}
        </Typography>
      </div>
    )
  }

  return (
    <List className={classes.root}>
      {sortedRooms.map((room) => {
        const displayInfo = getRoomDisplayInfo(room)
        const isSelected = selectedRoom?.room?._id === room._id

        return (
          <ListItem
            key={room._id}
            className={`${classes.listItem} ${
              isSelected ? classes.selectedItem : ''
            }`}
            onClick={() => handleRoomClick(room)}
          >
            <ListItemAvatar>
              <Avatar className={classes.avatar}>
                {displayInfo.avatar ? (
                  <AvatarDisplay user={displayInfo.avatar} size={40} />
                ) : (
                  <AvatarDisplay user={{ name: displayInfo.name }} size={40} />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <div className={classes.primaryTextContainer}>
                  <span className={classes.primaryText}>
                    {displayInfo.name}
                  </span>
                  <Chip
                    size="small"
                    icon={
                      room.messageType === 'USER' &&
                      room.users?.length === 2 ? (
                        <ChatBubbleOutlineIcon />
                      ) : (
                        <GroupIcon />
                      )
                    }
                    label={
                      room.messageType === 'USER' && room.users?.length === 2
                        ? 'DM'
                        : 'GROUP'
                    }
                    className={`${classes.typeChip} ${
                      room.messageType === 'USER' && room.users?.length === 2
                        ? classes.dmChip
                        : classes.groupChip
                    }`}
                  />
                </div>
              }
              secondary={
                <span className={classes.lastMessage}>
                  {displayInfo.subtitle}
                </span>
              }
            />
            {room.unreadMessages > 0 && (
              <div className={classes.unreadBadge}>
                {room.unreadMessages > 99 ? '99+' : room.unreadMessages}
              </div>
            )}
          </ListItem>
        )
      })}
    </List>
  )
}

ChatList.propTypes = {
  search: PropTypes.string,
  filterType: PropTypes.oneOf(['chats', 'groups']).isRequired,
}

ChatList.defaultProps = {
  search: '',
}

export default ChatList
