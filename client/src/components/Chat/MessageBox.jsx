import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Avatar,
  IconButton,
  Typography,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import SettingsIcon from '@material-ui/icons/Settings'
import BlockIcon from '@material-ui/icons/Block'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/client'
import MessageSend from './MessageSend'
import MessageItemList from './MessageItemList'
import TypingIndicator from './TypingIndicator'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import AvatarDisplay from '../Avatar'
import { READ_MESSAGES } from '../../graphql/mutations'
import {
  GET_CHAT_ROOMS,
  GET_ROOM_MESSAGES,
  GET_ROSTER,
} from '../../graphql/query'
import useGuestGuard from '../../utils/useGuestGuard'
import { useRosterManagement } from '../../hooks/useRosterManagement'
import { SET_SNACKBAR as SET_UI_SNACKBAR } from '../../store/ui'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

const useStyles = makeStyles((theme) => ({
  header: {
    background: 'linear-gradient(to bottom, #ffffff 0%, #fafbfc 100%)',
    padding: theme.spacing(1.75, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    backdropFilter: 'blur(10px)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  backButton: {
    padding: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'scale(1.05)',
    },
  },
  avatar: {
    width: 44,
    height: 44,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: 700,
    fontSize: '1rem',
    color: theme.palette.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.25),
    fontWeight: 400,
  },
  settingsButton: {
    padding: theme.spacing(0.75),
    color: theme.palette.text.secondary,
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: '#52b274',
      transform: 'scale(1.05)',
    },
  },
  menuItem: {
    padding: theme.spacing(1.25, 2),
    fontSize: '0.875rem',
  },
  menuItemDanger: {
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.light + '20',
    },
  },
  menuItemIcon: {
    minWidth: 40,
    color: 'inherit',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background:
      'linear-gradient(to bottom, #f5f7fa 0%, #ffffff 50%, #f5f7fa 100%)',
    backgroundImage:
      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
    position: 'relative',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1, 0),
    position: 'relative',
    zIndex: 0,
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.grey[400],
      borderRadius: 4,
      border: '2px solid transparent',
      backgroundClip: 'padding-box',
      '&:hover': {
        background: theme.palette.grey[500],
        backgroundClip: 'padding-box',
      },
    },
  },
  footer: {
    background: 'linear-gradient(to top, #ffffff 0%, #fafbfc 100%)',
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.75, 2),
    boxShadow:
      '0 -2px 12px rgba(0, 0, 0, 0.06), 0 -1px 4px rgba(0, 0, 0, 0.04)',
  },
}))

function Header() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user?.data)
  const selectedRoom = useSelector((state) => state.chat?.selectedRoom?.room)
  const [anchorEl, setAnchorEl] = useState(null)
  const { blockBuddy, unblockBuddy, removeBuddy } = useRosterManagement()
  const { refetch: refetchChatRooms } = useQuery(GET_CHAT_ROOMS, { skip: true })
  const { data: rosterData } = useQuery(GET_ROSTER, { skip: !currentUser })

  const { title, avatar, messageType, users, _id: messageRoomId } =
    selectedRoom || {}

  // Get the other user's ID for USER type rooms
  const otherUserId =
    messageType === 'USER' && users?.length === 2
      ? users
          .find((id) => id?.toString() !== currentUser?._id?.toString())
          ?.toString()
      : null

  // Check if user is blocked
  const isBlocked =
    otherUserId &&
    rosterData?.getRoster?.some((r) => {
      const rUserId = r.userId?.toString()
      const rBuddyId = r.buddyId?.toString()
      const currentUserId = currentUser?._id?.toString()
      const otherId = otherUserId.toString()

      return (
        (rUserId === currentUserId &&
          rBuddyId === otherId &&
          r.status === 'blocked') ||
        (rUserId === otherId &&
          rBuddyId === currentUserId &&
          r.status === 'blocked')
      )
    })

  const handleBack = () => {
    dispatch(SELECTED_CHAT_ROOM(null))
  }

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleBlockUser = async () => {
    if (!otherUserId) return

    try {
      if (isBlocked) {
        await unblockBuddy(otherUserId)
        // Refetch chat rooms to update the list (chat will reappear after unblocking)
        await refetchChatRooms()
        dispatch(
          SET_UI_SNACKBAR({
            open: true,
            message: 'User unblocked successfully',
            type: 'success',
          }),
        )
      } else {
        await blockBuddy(otherUserId)
        // Refetch chat rooms to update the list (chat remains visible for both users)
        await refetchChatRooms()
        dispatch(
          SET_UI_SNACKBAR({
            open: true,
            message:
              'User blocked successfully. Chat history is preserved, but they cannot send new messages.',
            type: 'success',
          }),
        )
        // Keep chat open so both users can see their chat history
        // Only close the menu
      }
      handleMenuClose()
    } catch (error) {
      dispatch(
        SET_UI_SNACKBAR({
          open: true,
          message:
            error.message ||
            `Failed to ${isBlocked ? 'unblock' : 'block'} user`,
          type: 'danger',
        }),
      )
    }
  }

  const handleRemoveBuddy = async () => {
    if (!otherUserId) return

    try {
      await removeBuddy(otherUserId)
      // Refetch chat rooms to update the list
      await refetchChatRooms()
      dispatch(
        SET_UI_SNACKBAR({
          open: true,
          message: 'Buddy removed successfully',
          type: 'success',
        }),
      )
      handleMenuClose()
    } catch (error) {
      dispatch(
        SET_UI_SNACKBAR({
          open: true,
          message: error.message || 'Failed to remove buddy',
          type: 'danger',
        }),
      )
    }
  }

  const handleDeleteChat = () => {
    // For now, just close the chat
    // In the future, this could archive or delete the chat room
    dispatch(SELECTED_CHAT_ROOM(null))
    dispatch(
      SET_UI_SNACKBAR({
        open: true,
        message: 'Chat closed',
        type: 'info',
      }),
    )
    handleMenuClose()
  }

  const menuOpen = Boolean(anchorEl)

  return (
    <Fade in timeout={300}>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <IconButton
            onClick={handleBack}
            className={classes.backButton}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>

          <Avatar className={classes.avatar}>
            {messageType === 'USER' ? (
              <AvatarDisplay height={40} width={40} {...avatar} />
            ) : (
              title?.[0] || '?'
            )}
          </Avatar>

          <div className={classes.headerText}>
            <Typography className={classes.title}>{title || 'Chat'}</Typography>
            <Typography className={classes.subtitle}>
              {messageType === 'USER' ? 'Direct Message' : 'Group Chat'}
            </Typography>
          </div>

          <IconButton
            onClick={handleSettingsClick}
            className={classes.settingsButton}
            size="small"
            aria-label="Chat settings"
          >
            <SettingsIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              style: {
                minWidth: 200,
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
              },
            }}
          >
            {messageType === 'USER' && otherUserId && (
              <>
                <MenuItem
                  onClick={handleBlockUser}
                  className={`${classes.menuItem} ${classes.menuItemDanger}`}
                >
                  <ListItemIcon className={classes.menuItemIcon}>
                    <BlockIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={isBlocked ? 'Unblock User' : 'Block User'}
                  />
                </MenuItem>
                <MenuItem
                  onClick={handleRemoveBuddy}
                  className={`${classes.menuItem} ${classes.menuItemDanger}`}
                >
                  <ListItemIcon className={classes.menuItemIcon}>
                    <RemoveCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Remove Buddy" />
                </MenuItem>
                <Divider />
              </>
            )}
            <MenuItem
              onClick={handleDeleteChat}
              className={`${classes.menuItem} ${classes.menuItemDanger}`}
            >
              <ListItemIcon className={classes.menuItemIcon}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Close Chat" />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </Fade>
  )
}

function Content() {
  const classes = useStyles()

  return (
    <div className={classes.content}>
      <div className={classes.messagesContainer}>
        <MessageItemList />
      </div>
    </div>
  )
}

function MessageBox() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const ensureAuth = useGuestGuard()

  const [updateMessageReadBy] = useMutation(READ_MESSAGES)
  const selectedRoomData = useSelector(
    (state) => state.chat?.selectedRoom?.room || {},
  )

  if (!selectedRoomData) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
        No room selected
      </div>
    )
  }

  const { _id: messageRoomId, title, messageType, users } =
    selectedRoomData || {}

  // Get the other user's ID for DM creation if room doesn't exist yet
  const currentUser = useSelector((state) => state.user?.data)
  const componentId = messageRoomId
    ? null
    : users
        ?.find((id) => id?.toString() !== currentUser?._id?.toString())
        ?.toString()

  // Refetch chat rooms to get updated room data (especially when room doesn't exist yet)
  const { data: roomsData, error: roomsError } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: 'cache-and-network',
    pollInterval: !messageRoomId ? 2000 : 0, // Poll every 2 seconds if room doesn't exist yet
    onError: (err) => {
      console.error('Error fetching chat rooms:', err)
    },
  })

  if (roomsError) {
    console.error('Chat rooms query error:', roomsError)
  }

  // Update selected room when a new room is found in the chat rooms list
  useEffect(() => {
    if (!messageRoomId && roomsData?.messageRooms && selectedRoomData?.users) {
      // Find the room that matches our users
      const matchingRoom = roomsData.messageRooms.find((room) => {
        if (room.messageType !== 'USER' || room.users?.length !== 2)
          return false
        const roomUserIds = room.users
          .map((id) => id?.toString())
          .filter(Boolean)
        const selectedUserIds = selectedRoomData.users
          .map((id) => id?.toString())
          .filter(Boolean)
        if (roomUserIds.length !== 2 || selectedUserIds.length !== 2)
          return false
        return (
          roomUserIds.includes(selectedUserIds[0]) &&
          roomUserIds.includes(selectedUserIds[1])
        )
      })

      if (matchingRoom) {
        dispatch(SELECTED_CHAT_ROOM({ room: matchingRoom }))
      }
    }
  }, [roomsData, messageRoomId, selectedRoomData, dispatch])

  useEffect(() => {
    if (!ensureAuth() || !messageRoomId) return

    // Update read receipts when room is opened
    const updateReadReceipts = async () => {
      try {
        await updateMessageReadBy({
          variables: { messageRoomId },
          refetchQueries: [
            { query: GET_CHAT_ROOMS },
            {
              query: GET_ROOM_MESSAGES,
              variables: { messageRoomId },
            },
          ],
        })
      } catch (err) {
        console.error('Error updating message read by:', err)
      }
    }

    updateReadReceipts()

    // Also update read receipts periodically (every 5 seconds) to catch updates from other users
    const interval = setInterval(() => {
      updateReadReceipts()
    }, 5000)

    return () => clearInterval(interval)
  }, [messageRoomId, updateMessageReadBy, ensureAuth])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Content />
      <div className={classes.footer}>
        <TypingIndicator messageRoomId={messageRoomId} />
        <MessageSend
          messageRoomId={messageRoomId}
          type={messageType}
          title={title}
          componentId={componentId}
        />
      </div>
    </div>
  )
}

export default MessageBox
