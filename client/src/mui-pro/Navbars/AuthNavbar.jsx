import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SET_SELECTED_PLAN } from 'store/ui'

// @mui components
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'

// @material-ui/icons
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// core components
import Button from 'mui-pro/CustomButtons/Button'

import SelectPlansButton from '../../components/CustomButtons/SelectPlansButton'
import styles from 'assets/jss/material-dashboard-pro-react/components/authNavbarStyle'

const useStyles = makeStyles(styles)

export default function AuthNavbar(props) {
  const [open, setOpen] = React.useState(false)
  const handleDrawerToggle = () => {
    setOpen(!open)
  }
  const dispatch = useDispatch()
  const selectedPlan = useSelector((state) => state.ui.selectedPlan)
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) =>
    window.location.href.indexOf(routeName) > -1
  const classes = useStyles()
  const { color } = props
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))
  const appBarClasses = cx({
    [` ${classes[color]}`]: color,
  })
  const history = useHistory()

  const isPersonal = selectedPlan === 'personal'
  const isBusiness = selectedPlan === 'business'
  const isInvestors = selectedPlan === 'investors'

  const setSelectedPlan = (type) => {
    dispatch(SET_SELECTED_PLAN(type))
  }

  const planButtons = (
    <div>
      {activeRoute('/auth/plans') && (
        isSmUp && (
          <div className={classes.buttonSpacing}>
            <SelectPlansButton
              variant={isPersonal ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setSelectedPlan('personal')}
              style={{ background: isPersonal ? '#1D6CE7' : '' }}
            >
              Personal
            </SelectPlansButton>
            <SelectPlansButton
              variant={isBusiness ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setSelectedPlan('business')}
              style={{ background: isBusiness ? '#791E89' : '' }}
            >
              Business
            </SelectPlansButton>
            <SelectPlansButton
              variant={isInvestors ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setSelectedPlan('investors')}
              style={{ background: isInvestors ? '#E91E63' : '' }}
            >
              Investors
            </SelectPlansButton>
          </div>
        )
      )}
    </div>
  )

  const list = (
    <List className={classes.list}>
      {activeRoute('/auth/request-access') && (
        <ListItem className={classes.listItem}>
          <NavLink to="/search">
            <ListItemText disableTypography>
              <Button variant="outlined" color="primary" onClick={() => history.push('/search')}>
                Go Back
              </Button>
            </ListItemText>
          </NavLink>
        </ListItem>
      )}
      {activeRoute('/auth/learn-more') && (
        <div className={classes.buttonDisplay}>
          <ListItem className={classes.listItem}>
            <NavLink
              to="/auth/login"
              className={cx(classes.navLink, {
                [classes.navLinkActive]: activeRoute('/auth/login'),
              })}
            >
              <ListItemText
                primary="Login"
                disableTypography
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        </div>
      )}
      {activeRoute('/auth/request-access') && (
        <div className={classes.buttonDisplay}>
          <ListItem className={classes.listItem}>
            <NavLink
              to="/auth/login"
              className={cx(classes.navLink, {
                [classes.navLinkActive]: activeRoute('/auth/login'),
              })}
            >
              <ListItemText
                primary="Login"
                disableTypography
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        </div>
      )}
      {activeRoute('/auth/login') && (
        <React.Fragment>
          <ListItem className={classes.listItem}>
            <NavLink
              to="/auth/request-access"
              className={cx(classes.navLinkAccess, {
                [classes.navLinkActiveAccess]: activeRoute('/auth/login'),
              })}
            >
              <ListItemText
                primary="Get Access"
                disableTypography
                className={classes.listItemTextAccess}
              />
            </NavLink>
          </ListItem>
        </React.Fragment>
      )}

      {activeRoute('/search') && (
        <React.Fragment>
          <ListItem className={classes.listItem}>
            <NavLink
              to="/auth/login"
              className={cx(classes.navLink, {
                [classes.navLinkActive]: activeRoute('/auth/login'),
              })}
            >
              <ListItemText
                primary="Login"
                disableTypography
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        </React.Fragment>
      )}

      {activeRoute('/auth/investor-thanks') && (
        <React.Fragment>
          <ListItem className={classes.listItem}>
            <NavLink
              to="search"
              className={cx(classes.navLinkInvestNow, {
                [classes.navLinkActiveAccess]: activeRoute(
                  '/auth/investor-thanks',
                ),
              })}
            >
              <ListItemText
                primary="Invest Now"
                disableTypography
                className={classes.listItemTextAccess}
              />
            </NavLink>
          </ListItem>

          <ListItem className={classes.listItem}>
            <NavLink
              to="/auth/login"
              className={cx(classes.navLink, {
                [classes.navLinkActive]: activeRoute('/auth/investor-thanks'),
              })}
            >
              <ListItemText
                primary="Login"
                disableTypography
                className={classes.listItemText}
              />
            </NavLink>
          </ListItem>
        </React.Fragment>
      )}
    </List>
  )
  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.display}>
        {isSmUp && (
          <div className={classes.flex}>
            <IconButton
              color="primary"
              aria-label="Quote Vote"
              component="span"
              onClick={() => history.push('/search')}
            >
              <img
                alt="Quote Vote"
                src="/icons/android-chrome-192x192.png"
                className={classes.voxPop}
              />
            </IconButton>
          </div>
        )}
        {isMdDown && (
          <div className={classes.flex}>
            <IconButton
              color="primary"
              aria-label="Quote Vote"
              component="span"
              className={classes.title}
              onClick={() => history.push('/search')}
            >
              <img
                alt="Quote Vote"
                src="/icons/android-chrome-192x192.png"
                className={classes.voxPop}
              />
            </IconButton>
          </div>
        )}
        {planButtons}
        {list}
      </Toolbar>
    </AppBar>
  )
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
}
