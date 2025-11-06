import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Grid, IconButton, Typography, Fade } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import MessageSend from './MessageSend'
import MessageItemList from './MessageItemList'
import TypingIndicator from './TypingIndicator'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import AvatarDisplay from '../Avatar'
import { READ_MESSAGES } from '../../graphql/mutations'
import { GET_CHAT_ROOMS, GET_ROOM_MESSAGES } from '../../graphql/query'
import useGuestGuard from '../../utils/useGuestGuard'

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
  content: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #f5f7fa 0%, #ffffff 50%, #f5f7fa 100%)',
    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)',
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
    boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.06), 0 -1px 4px rgba(0, 0, 0, 0.04)',
  },
}))

function Header() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const handleBack = () => {
    dispatch(SELECTED_CHAT_ROOM(null))
  }

  const { title, avatar, messageType } = useSelector(
    (state) => state.chat?.selectedRoom?.room || {},
  )

  return (
    <Fade in timeout={300}>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <IconButton onClick={handleBack} className={classes.backButton} size="small">
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
            <Typography className={classes.title}>
              {title || 'Chat'}
            </Typography>
            <Typography className={classes.subtitle}>
              {messageType === 'USER' ? 'Direct Message' : 'Group Chat'}
            </Typography>
          </div>
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
  
  const { _id: messageRoomId, title, messageType, users } = selectedRoomData || {}
  
  // Get the other user's ID for DM creation if room doesn't exist yet
  const currentUser = useSelector((state) => state.user?.data)
  const componentId = messageRoomId 
    ? null 
    : users?.find((id) => id?.toString() !== currentUser?._id?.toString())?.toString()

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
        if (room.messageType !== 'USER' || room.users?.length !== 2) return false
        const roomUserIds = room.users.map((id) => id?.toString()).filter(Boolean)
        const selectedUserIds = selectedRoomData.users.map((id) => id?.toString()).filter(Boolean)
        if (roomUserIds.length !== 2 || selectedUserIds.length !== 2) return false
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
              variables: { messageRoomId } 
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
