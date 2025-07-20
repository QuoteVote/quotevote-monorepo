import React, { useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { makeStyles } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import SvgIcon from '@mui/material/SvgIcon'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import SettingsSvg from '../../assets/svg/Settings'
import SettingsActiveSvg from '../../assets/svg/SettingsActive'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}))

export default function SettingsIconButton({ fontSize }) {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)
  const history = useHistory()
  const client = useApolloClient()
  const user = useSelector((state) => state.user.data)
  const [svgIcon, setSvgIcon] = useState(SettingsSvg)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const handleLogout = () => {
    setOpen(false)
    localStorage.removeItem('token')
    client.stop()
    client.resetStore()
    history.push('/auth/login')
  }

  const handleInviteControlPanel = () => {
    history.push('/hhsb/ControlPanel')
    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open)
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }

    prevOpen.current = open
  }, [open])

  return (
    <>
      <IconButton
        aria-label="Settings"
        color="inherit"
        className={classes.rightMenuButton}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        onMouseEnter={() => setSvgIcon(SettingsActiveSvg)}
        onMouseLeave={() => setSvgIcon(SettingsSvg)}
      >
        <SvgIcon
          component={svgIcon}
          fontSize={fontSize}
          viewBox="0 0 49 46"
          className={classes.rightMenuButton}
        />
      </IconButton>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {user.admin && <MenuItem onClick={handleInviteControlPanel}>Invite Control Panel</MenuItem>}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

SettingsIconButton.propTypes = {
  fontSize: PropTypes.string,
}
