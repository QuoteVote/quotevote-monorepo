import { useState } from 'react'
import { IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ChatContent from './ChatContent'
import { SET_CHAT_OPEN } from '../../store/chat'
import { useMobileDetection } from '../../utils/display'
import MobileDrawer from '../Notifications/MobileDrawer'
import Badge from '@mui/material/Badge'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 20,
    top: 20,
  },
}))

function ChatMenu({ fontSize }) {
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

  const drawerPaperStyle = {
    width: { xs: '100%', sm: 400 },
    maxWidth: 400,
    backgroundImage: 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)',
  }

  const titleStyle = {
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
  }

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
        drawerPaperStyle={drawerPaperStyle}
        appBarStyle={appBarStyle}
        titleStyle={titleStyle}
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
