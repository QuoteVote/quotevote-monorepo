import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ChatContent from './ChatContent'
import { SET_CHAT_OPEN } from '../../store/chat'
import { useMobileDetection } from '../../utils/display'
import MobileDrawer from '../Notifications/MobileDrawer'
import { withStyles } from '@material-ui/core/styles'
import Badge from '@material-ui/core/Badge'

const StyledBadge = withStyles(() => ({
  badge: {
    right: 20,
    top: 20,
  },
}))(Badge)

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  tipColor: {
    backgroundColor: '',
    backgroundImage: '',
  },
  drawerPaperStyle: {
    width: '100%',
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
    backgroundImage: 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)',
  },
  titleStyle: {
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
  },
  tooltipPopper: {
    marginTop: '-8px',
  },
}))
function ChatMenu({ fontSize }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const setOpen = (open) => {
    dispatch(SET_CHAT_OPEN(open))
  }
  const open = useSelector((state) => state.chat.open)
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const tipColor = !selectedRoom ? '#1BB5D8' : '#EEF4F9'
  const tipBackgroundImage = !selectedRoom
    ? 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)'
    : '#EEF4F9'

  const [isHovered, setIsHovered] = useState(false)

  const isMobileDevice = useMobileDetection()

  const appBarStyle = {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  }

  const backButtonStyle = {
    color: '#ffffff',
  }
  return (
    <>
      <StyledBadge
        color="error"
        badgeContent={0}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconButton
          aria-label="Chat"
          color="inherit"
          onClick={() => setOpen(!open)}
        >
          {isHovered ? (
            <img
              src="/assets/ChatActive.svg"
              alt="chat active"
              style={{
                width: fontSize === 'large' ? '49px' : '32px',
                height: fontSize === 'large' ? '46px' : '30px',
              }}
            />
          ) : (
            <img
              src="/assets/ChatActive.svg"
              alt="chat active"
              style={{
                fontSize: fontSize,
                width: fontSize === 'large' ? '49px' : '32px',
                height: fontSize === 'large' ? '46px' : '30px',
              }}
            />
          )}
        </IconButton>
      </StyledBadge>
      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Chat"
        anchor="right"
        drawerPaperStyle={classes.drawerPaperStyle}
        appBarStyle={appBarStyle}
        titleStyle={classes.titleStyle}
        backButtonStyle={backButtonStyle}
      >
        <ChatContent />
      </MobileDrawer>
    </>
  )
}
ChatMenu.propTypes = {
  fontSize: PropTypes.any,
}

export default ChatMenu
