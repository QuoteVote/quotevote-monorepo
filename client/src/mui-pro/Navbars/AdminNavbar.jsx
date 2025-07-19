import React from 'react'
// nod library to set properties for components
import PropTypes from 'prop-types'
import cx from 'classnames'

// @material-ui/core components
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'

// material-ui icons
import Menu from '@mui/icons-material/Menu'
import MoreVert from '@mui/icons-material/MoreVert'
import ViewList from '@mui/icons-material/ViewList'

// core components
import Button from 'mui-pro/CustomButtons/Button'

import styles from 'assets/jss/material-dashboard-pro-react/components/adminNavbarStyle'
import AdminNavbarLinks from './AdminNavbarLinks'

const useStyles = makeStyles(styles)

export default function AdminNavbar(props) {
  const classes = useStyles()
  const { color, rtlActive, brandText } = props
  const appBarClasses = cx({
    [` ${classes[color]}`]: color,
  })
  const sidebarMinimize =
    `${classes.sidebarMinimize
    } ${
      cx({
        [classes.sidebarMinimizeRTL]: rtlActive,
      })}`
  return (
    <AppBar className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown implementation="css">
          <div className={sidebarMinimize}>
            {props.miniActive ? (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <ViewList className={classes.sidebarMiniIcon} />
              </Button>
            ) : (
              <Button
                justIcon
                round
                color="white"
                onClick={props.sidebarMinimize}
              >
                <MoreVert className={classes.sidebarMiniIcon} />
              </Button>
            )}
          </div>
        </Box>
        <div className={classes.flex}>
          {/* Here we create navbar brand, based on route name */}
          <Button href="#" className={classes.title} color="transparent">
            {brandText}
          </Button>
        </div>
        <Hidden smDown implementation="css">
          <AdminNavbarLinks rtlActive={rtlActive} />
        </Box>
        <Hidden mdUp implementation="css">
          <Button
            className={classes.appResponsive}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={props.handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

AdminNavbar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  rtlActive: PropTypes.bool,
  brandText: PropTypes.string,
  miniActive: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  sidebarMinimize: PropTypes.func,
}
