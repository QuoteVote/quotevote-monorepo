import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import Badge from '@material-ui/core/Badge'
import withStyles from '@material-ui/core/styles/withStyles'
import RichTooltip from '../Chat/RichToolTip'
import NotificationContent from './Notification'
import MobileDrawer from './MobileDrawer'
import { useMobileDetection } from '../../utils/display'
import { GET_NOTIFICATIONS } from '../../graphql/query'
import { NEW_NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscription'

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
    backgroundColor: theme.palette.mode === 'dark' ? '#1F1F1F' : '#ffffff',
    color: theme.palette.text.primary,
  },
  tipColor: {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A2A2A' : '#F1F1F1',
  },
}))

function NotificationMenu({ fontSize }) {
  const classes = useStyles()
  const isMobileDevice = useMobileDetection()
  const [open, setOpen] = React.useState(false)
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const tipColor = classes.tipColor.backgroundColor
  const tipBackgroundImage = classes.tipColor.backgroundColor
  const [isHovered, setIsHovered] = useState(false)

  const { loading, data, refetch, error } = useQuery(GET_NOTIFICATIONS)
  const userId = useSelector((state) => state.user.data._id)
  useSubscription(
    NEW_NOTIFICATION_SUBSCRIPTION,
    {
      variables: { userId },
      onData: async () => {
        await refetch()
      },
    },
  )

  const { notifications } = loading || error || !data ? { notifications: [] } : data

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Desktop popover content
  const popoverContent = (
    <RichTooltip
      content={<NotificationContent loading={loading} notifications={notifications} refetch={refetch} setOpenPopUp={setOpen} />}
      open={open}
      placement="bottom-start"
      onClose={() => setOpen(false)}
      tipColor={tipColor}
      tipBackgroundImage={tipBackgroundImage}
      spacing={selectedRoom ? 0 : 2}
    >
      <StyledBadge
        color="error"
        badgeContent={notifications.length}
        overlap="rectangular"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconButton
          aria-label="Chat"
          color="inherit"
          onClick={handleToggle}
        >
          {isHovered ? (
            <img 
              src="/assets/NotificationsActive.svg" 
              alt="notifications active" 
              style={{width: fontSize === 'large' ? '49px' : '32px', height: fontSize === 'large' ? '46px' : '30px'}} 
            />
          ) : (
            <img 
              src="/assets/Notifications.svg" 
              alt="notifications" 
              style={{fontSize: fontSize, width: fontSize === 'large' ? '49px' : '32px', height: fontSize === 'large' ? '46px' : '30px'}} 
            />
          )}
        </IconButton>
      </StyledBadge>
    </RichTooltip>
  )

  return (
    <div className={classes.root}>
      {isMobileDevice ? (
        <>
          <StyledBadge
            color="error"
            badgeContent={notifications.length}
            overlap="rectangular"
          >
            <IconButton
              aria-label="Notifications"
              color="inherit"
              onClick={handleToggle}
            >
              <img 
                src="/assets/Notifications.svg" 
                alt="notifications" 
                style={{width: fontSize === 'large' ? '49px' : '32px', height: fontSize === 'large' ? '46px' : '30px'}} 
              />
            </IconButton>
          </StyledBadge>
          <MobileDrawer
            open={open}
            onClose={handleClose}
            title="Notifications"
            anchor="right"
          >
            <NotificationContent 
              loading={loading} 
              notifications={notifications} 
              refetch={refetch} 
              setOpenPopUp={setOpen}
              pageView={true}
            />
          </MobileDrawer>
        </>
      ) : (
        popoverContent
      )}
    </div>
  )
}
NotificationMenu.propTypes = {
  fontSize: PropTypes.any,
}

export default NotificationMenu
