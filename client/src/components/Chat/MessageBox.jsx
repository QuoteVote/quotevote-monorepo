import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Grid, IconButton, Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import MessageSend from './MessageSend'
import MessageItemList from './MessageItemList'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import AvatarDisplay from '../Avatar'
import { READ_MESSAGES } from '../../graphql/mutations'
import { GET_CHAT_ROOMS } from '../../graphql/query'
import useGuestGuard from '../../utils/useGuestGuard'
import {
  describePresence,
  getPresenceColor,
  getPresenceLabel,
  normalizePresenceStatus,
} from '../../utils/presence'
import { prewarmAudioContext } from '../../utils/sound'

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount

  return windowSize
}

const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: '#FFFFFF',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
  },
  content: {
    backgroundColor: '#F1F1F1',
    width: 380,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    alignContent: 'stretch',
    height: '90%',
  },
  avatarWrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  avatarPresenceDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid #FFFFFF',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  presenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  presenceDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
  presenceLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  presenceDescription: {
    fontSize: '0.75rem',
    color: '#616161',
  },
}))

function Header() {
  const dispatch = useDispatch()
  const handleBack = () => {
    dispatch(SELECTED_CHAT_ROOM(null))
  }

  const { title, avatar, messageType, buddy } = useSelector(
    (state) => state.chat.selectedRoom.room,
  )

  const hasBuddy = messageType === 'USER' && buddy
  const presenceStatus = hasBuddy ? normalizePresenceStatus(buddy.presenceStatus) : 'OFFLINE'
  const presenceColor = hasBuddy ? getPresenceColor(presenceStatus) : 'transparent'
  const presenceLabel = hasBuddy ? getPresenceLabel(presenceStatus) : ''
  const presenceDescription = hasBuddy
    ? describePresence(presenceStatus, buddy.awayMessage, buddy.lastActiveAt)
    : ''
  const classes = useStyles()

  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      spacing={1}
    >
      <Grid item>
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <div className={classes.avatarWrapper}>
          <Avatar>
            {messageType === 'USER' ? (
              <AvatarDisplay height={40} width={40} {...avatar} />
            ) : (
              title[0]
            )}
          </Avatar>
          {hasBuddy && (
            <span
              className={classes.avatarPresenceDot}
              style={{ backgroundColor: presenceColor }}
            />
          )}
        </div>
      </Grid>
      <Grid item>
        <div className={classes.titleBlock}>
          <Typography>{title}</Typography>
          {hasBuddy && (
            <>
              <div className={classes.presenceRow}>
                <span
                  className={classes.presenceDot}
                  style={{ backgroundColor: presenceColor }}
                />
                <Typography className={classes.presenceLabel} component="span">
                  {presenceLabel}
                </Typography>
              </div>
              {presenceDescription && (
                <Typography className={classes.presenceDescription} variant="caption">
                  {presenceDescription}
                </Typography>
              )}
            </>
          )}
        </div>
      </Grid>
    </Grid>
  )
}

function Content() {
  const classes = useStyles()

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="space-between"
        style={{ height: '100%' }}
      >
        <Grid
          item
          style={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: '#F1F1F1',
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <MessageItemList />
        </Grid>
      </Grid>
    </>
  )
}

function MessageBox() {
  const classes = useStyles()
  const ensureAuth = useGuestGuard()

  const [updateMessageReadBy] = useMutation(READ_MESSAGES)
  const { _id: messageRoomId, title, messageType } = useSelector(
    (state) => state.chat.selectedRoom.room || {},
  )

  useEffect(() => {
    if (!ensureAuth()) return
    updateMessageReadBy({
      variables: { messageRoomId },
      refetchQueries: [{ query: GET_CHAT_ROOMS }],
    })
  }, [messageRoomId, updateMessageReadBy, ensureAuth])

  useEffect(() => {
    prewarmAudioContext()
  }, [])

  return (
    <>
      <div className={classes.header}>
        <Header />
      </div>
      <Content />

      <MessageSend
        messageRoomId={messageRoomId}
        type={messageType}
        title={title}
      />  
    </>
  )
}

export default MessageBox
