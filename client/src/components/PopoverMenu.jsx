import React from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

function PopoverMenu({
  appRoutes, handleClick, handleClose, anchorEl, page,
}) {
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  return (
    isMdDown && (
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {appRoutes.map((appRoute) => (
              <MenuItem
                selected={appRoute.name === page}
                component={Link}
                to={`${appRoute.layout}${appRoute.path}`}
                onClick={handleClose}
              >
                {appRoute.name}
              </MenuItem>
            ))}
          </Menu>
          <Typography variant="h6">
            {page}
          </Typography>
        </Toolbar>
      </AppBar>
    )
  )
}
PopoverMenu.propTypes = {
  appRoutes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.any.isRequired,
  page: PropTypes.string.isRequired,
}

export default PopoverMenu
