import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import Badge from '@mui/material/Badge'
import RichTooltip from '../Chat/RichToolTip'
import NotificationContent from './Notification'
import MobileDrawer from './MobileDrawer'
import { useMobileDetection } from '../../utils/display'
import { GET_NOTIFICATIONS } from '../../graphql/query'
import { NEW_NOTIFICATION_SUBSCRIPTION } from '../../graphql/subscription'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 20,
    top: 20,
  },
}))

const Root = styled('div')(() => ({
  display: 'flex',
}))

function NotificationMenu({ fontSize }) {
  const isMobileDevice = useMobileDetection()
  const [open, setOpen] = React.useState(false)
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const tipColor = '#F1F1F1'
  const tipBackgroundImage = '#F1F1F1'
  const [isHovered, setIsHovered] = useState(false)

  const { loading, data, refetch, error } = useQuery(GET_NOTIFICATIONS)
  const userId = useSelector((state) => state.user.data._id)
  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    variables: { userId },
    onSubscriptionData: async () => {
      await refetch()
    },
  })

  const { notifications } =
    loading || error || !data ? { notifications: [] } : data

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(false)
  }

  // Desktop popover content
  const popoverContent = (
    <RichTooltip
      content={
        <NotificationContent
          loading={loading}
          notifications={notifications}
          refetch={refetch}
          setOpenPopUp={setOpen}
        />
      }
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <IconButton aria-label="Chat" color="inherit" onClick={handleToggle}>
          {isHovered ? (
            <img
              src="/assets/NotificationsActive.svg"
              alt="notifications active"
              style={{
                width: fontSize === 'large' ? '49px' : '32px',
                height: fontSize === 'large' ? '46px' : '30px',
              }}
            />
          ) : (
            <img
              src="/assets/Notifications.svg"
              alt="notifications"
              style={{
                fontSize: fontSize,
                width: fontSize === 'large' ? '49px' : '32px',
                height: fontSize === 'large' ? '46px' : '30px',
              }}
            />
          )}
        </IconButton>
      </StyledBadge>
    </RichTooltip>
  )

  return (
    <Root>
      {isMobileDevice ? (
        <>
          <StyledBadge
            color="error"
            badgeContent={notifications.length}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <IconButton
              aria-label="Notifications"
              color="inherit"
              onClick={handleToggle}
            >
              {isHovered ? (
                <img
                  src="/assets/NotificationsActive.svg"
                  alt="notifications active"
                  style={{
                    width: fontSize === 'large' ? '49px' : '32px',
                    height: fontSize === 'large' ? '46px' : '30px',
                  }}
                />
              ) : (
                <img
                  src="/assets/Notifications.svg"
                  alt="notifications"
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
    </Root>
  )
}
NotificationMenu.propTypes = {
  fontSize: PropTypes.any,
}

export default NotificationMenu
