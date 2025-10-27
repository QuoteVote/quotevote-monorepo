import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { SET_SELECTED_PLAN } from 'store/ui'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'

// @material-ui/icons

import SelectPlansButton from '../../components/CustomButtons/SelectPlansButton'
import styles from 'assets/jss/material-dashboard-pro-react/components/authNavbarStyle'

const useStyles = makeStyles(styles)

export default function AuthNavbar(props) {
  const dispatch = useDispatch()
  const selectedPlan = useSelector((state) => state.ui.selectedPlan)
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) =>
    window.location.href.indexOf(routeName) > -1
  const classes = useStyles()
  const { color } = props
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
        <Hidden smDown>
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
        </Hidden>
      )}
    </div>
  )

  const list = (
    <List className={classes.list}>
      {activeRoute('/auth/request-access') && (
        <>
          <ListItem className={classes.listItem}>
            <button
              type="button"
              onClick={() => history.push('/search')}
              className={classes.goBackButton}
            >
              Go Back
            </button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <button
              type="button"
              onClick={() => history.push('/auth/login')}
              className={classes.loginButton}
            >
              Login
            </button>
          </ListItem>
        </>
      )}
      {activeRoute('/auth/learn-more') && (
        <ListItem className={classes.listItem}>
          <button
            type="button"
            onClick={() => history.push('/auth/login')}
            className={classes.loginButton}
          >
            Login
          </button>
        </ListItem>
      )}
      {activeRoute('/auth/login') && (
        <ListItem className={classes.listItem}>
          <button
            type="button"
            onClick={() => history.push('/auth/request-access')}
            className={classes.getAccessButton}
          >
            Get Access
          </button>
        </ListItem>
      )}
      {activeRoute('/search') && (
        <ListItem className={classes.listItem}>
          <button
            type="button"
            onClick={() => history.push('/auth/login')}
            className={classes.loginButton}
          >
            Login
          </button>
        </ListItem>
      )}

      {activeRoute('/auth/investor-thanks') && (
        <>
          <ListItem className={classes.listItem}>
            <button
              type="button"
              onClick={() => history.push('/search')}
              className={classes.getAccessButton}
            >
              Invest Now
            </button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <button
              type="button"
              onClick={() => history.push('/auth/login')}
              className={classes.loginButton}
            >
              Login
            </button>
          </ListItem>
        </>
      )}
    </List>
  )

  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        <Hidden smDown>
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
        </Hidden>
        <Hidden mdUp>
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
        </Hidden>
        {planButtons}
        {list}
      </Toolbar>
    </AppBar>
  )
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
}
