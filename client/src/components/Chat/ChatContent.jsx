import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector, useDispatch } from 'react-redux'
import { Fade, Slide, Typography, Paper, Box, Divider } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import ChatSearchInput from './ChatSearchInput'
import MessageBox from './MessageBox'
import ChatTabs from './ChatTabs'
import ChatList from './ChatList'
import BuddyListWithPresence from '../BuddyList/BuddyListWithPresence'
import UserSearchResults from './UserSearchResults'
import { Button, IconButton, Tooltip, Avatar } from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import SettingsIcon from '@material-ui/icons/Settings'
import { usePresenceHeartbeat } from '../../hooks/usePresenceHeartbeat'
import StatusEditor from './StatusEditor'
import { SET_STATUS_EDITOR_OPEN } from '../../store/chat'
import { GET_CHAT_ROOMS } from '../../graphql/query'
import PresenceIcon from './PresenceIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 400,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
    boxShadow: '2px 0 12px rgba(0, 0, 0, 0.04), 1px 0 4px rgba(0, 0, 0, 0.02)',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      borderRight: 'none',
    },
  },
  sidebarHeader: {
    padding: theme.spacing(2.5, 2.5, 2, 2.5),
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(82, 178, 116, 0.1) 0%, rgba(74, 158, 99, 0.1) 100%)',
      opacity: 0.5,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: -50,
      right: -50,
      width: 200,
      height: 200,
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      filter: 'blur(40px)',
    },
  },
  headerContent: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1.5),
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  sidebarTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: theme.spacing(0.75),
    letterSpacing: '-0.02em',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  userStatusCard: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.25),
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    marginTop: theme.spacing(0.5),
  },
  userStatusText: {
    fontSize: '0.8125rem',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: 500,
  },
  settingsButton: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    padding: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(1.05)',
    },
  },
  searchContainer: {
    padding: theme.spacing(2, 2.5),
    background: '#ffffff',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  tabsContainer: {
    background: '#ffffff',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
  },
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #fafbfc 0%, #ffffff 50%, #f5f7fa 100%)',
    position: 'relative',
  },
  addBuddyContainer: {
    padding: theme.spacing(2, 2.5),
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
  },
  addBuddyButton: {
    textTransform: 'none',
    borderRadius: 14,
    padding: theme.spacing(1.5, 3),
    fontSize: '0.9375rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(82, 178, 116, 0.35), 0 2px 4px rgba(82, 178, 116, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      boxShadow: '0 6px 20px rgba(82, 178, 116, 0.45), 0 4px 8px rgba(82, 178, 116, 0.3)',
      transform: 'translateY(-2px)',
      background: 'linear-gradient(135deg, #5fc085 0%, #52b274 100%)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  conversationView: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: 200,
  },
  emptyStateIcon: {
    fontSize: 64,
    opacity: 0.3,
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
}))

// Component to display current user's status
function UserStatusDisplay() {
  const classes = useStyles()
  const userStatus = useSelector((state) => state.chat?.userStatus || 'online')
  const userStatusMessage = useSelector((state) => state.chat?.userStatusMessage || '')

  return (
    <div className={classes.userStatusCard}>
      <PresenceIcon status={userStatus} />
      {userStatusMessage ? (
        <Typography variant="caption" className={classes.userStatusText} style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {userStatusMessage}
        </Typography>
      ) : (
        <Typography variant="caption" className={classes.userStatusText}>
          {userStatus === 'dnd' ? 'Do Not Disturb' : userStatus.charAt(0).toUpperCase() + userStatus.slice(1)}
        </Typography>
      )}
    </div>
  )
}

function ChatContent() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const selectedRoom = useSelector((state) => state.chat?.selectedRoom)
  const statusEditorOpen = useSelector((state) => state.chat?.statusEditorOpen || false)
  const buddyList = useSelector((state) => state.chat?.buddyList || [])
  const [search, setSearch] = useState('')
  const [addBuddyMode, setAddBuddyMode] = useState(false)
  const [activeTab, setActiveTab] = useState('chats')

  // Initialize presence heartbeat
  usePresenceHeartbeat()

  // Calculate counts for badges
  const onlineCount = Array.isArray(buddyList)
    ? buddyList.filter((b) => {
        const status = b?.presence?.status || 'offline'
        return status === 'online' || status === 'away' || status === 'dnd'
      }).length
    : 0

  // Get DM and Group counts
  const { data: roomsData, loading: roomsLoading, error: roomsError } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: 'cache-and-network',
    onError: (err) => {
      console.error('Error fetching chat rooms:', err)
    },
  })
  
  if (roomsError) {
    console.error('Chat rooms query error:', roomsError)
  }
  
  const rooms = roomsData?.messageRooms || []
  const dmCount = rooms.filter((r) => r?.messageType === 'USER' && r?.users?.length === 2).length
  const groupCount = rooms.filter((r) => r?.messageType === 'POST' || (r?.messageType === 'USER' && r?.users?.length > 2)).length

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    // Exit add buddy mode when switching tabs
    if (addBuddyMode) {
      setAddBuddyMode(false)
      setSearch('')
    }
  }

  const handleAddBuddyModeChange = (mode) => {
    setAddBuddyMode(mode)
    if (!mode) {
      // Clear search when exiting add buddy mode
      setSearch('')
    }
  }

  const handleAddBuddyClick = () => {
    // Switch to buddies tab if not already there
    if (activeTab !== 'buddies') {
      setActiveTab('buddies')
    }
    setAddBuddyMode(true)
    // Focus the search input
    setTimeout(() => {
      const input = document.querySelector('input[aria-label="search users to add"]')
      if (input) input.focus()
    }, 100)
  }

  // Safety check - if selectedRoom is null or doesn't have room, show sidebar
  if (!selectedRoom || !selectedRoom?.room) {
    return (
      <Fade in timeout={300}>
        <div className={classes.root}>
          {/* Beautiful Gradient Header */}
          <div className={classes.sidebarHeader}>
            <div className={classes.headerContent}>
              <div className={classes.headerLeft}>
                <Typography className={classes.sidebarTitle}>Messages</Typography>
                <UserStatusDisplay />
              </div>
              <Tooltip title="Set Status" arrow>
                <IconButton
                  size="small"
                  onClick={() => dispatch(SET_STATUS_EDITOR_OPEN(true))}
                  className={classes.settingsButton}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className={classes.searchContainer}>
            <ChatSearchInput 
              setSearch={setSearch} 
              addBuddyMode={addBuddyMode}
              onAddBuddyModeChange={handleAddBuddyModeChange}
            />
          </div>

          {/* Tabs */}
          <div className={classes.tabsContainer}>
            <ChatTabs
              value={activeTab}
              onChange={handleTabChange}
              dmCount={dmCount}
              groupCount={groupCount}
              onlineCount={onlineCount}
            />
          </div>

          {/* Add Buddy Button (only for buddies tab, hide when in add buddy mode) */}
          {activeTab === 'buddies' && !addBuddyMode && (
            <div className={classes.addBuddyContainer}>
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                className={classes.addBuddyButton}
                onClick={handleAddBuddyClick}
                fullWidth
              >
                Add New Buddy
              </Button>
            </div>
          )}

          {/* Content Area */}
          <div className={classes.contentArea}>
            {addBuddyMode ? (
              <UserSearchResults searchQuery={search} />
            ) : (
              <>
                {activeTab === 'chats' && <ChatList search={search} filterType="chats" />}
                {activeTab === 'groups' && <ChatList search={search} filterType="groups" />}
                {activeTab === 'buddies' && <BuddyListWithPresence search={search} />}
              </>
            )}
          </div>

          {/* Dialogs */}
          <StatusEditor 
            open={statusEditorOpen} 
            onClose={() => dispatch(SET_STATUS_EDITOR_OPEN(false))} 
          />
        </div>
      </Fade>
    )
  }

  return (
    <Slide direction="left" in timeout={300}>
      <div className={classes.root}>
        <div className={classes.conversationView}>
          <MessageBox />
        </div>
      </div>
    </Slide>
  )
}

export default ChatContent
