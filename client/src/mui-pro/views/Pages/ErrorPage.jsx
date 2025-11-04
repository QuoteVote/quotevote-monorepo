import React from 'react'

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { useHistory, useLocation } from 'react-router-dom'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

import styles from 'assets/jss/material-dashboard-pro-react/views/errorPageStyles'

const useStyles = makeStyles(styles)

export default function ErrorPage() {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  // Check if user came from signup page (expired/invalid token)
  const fromSignup = location.state?.from === 'signup'

  const handleBack = () => {
    history.push('/search')
  }

  const handleRequestAccess = () => {
    history.push('/auth/request-access')
  }

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <h1 className={classes.title}>{fromSignup ? 'Link Expired' : '404'}</h1>
        <h2 className={classes.subTitle}>
          {fromSignup ? 'Invalid or Expired Link' : 'Page not found'}
        </h2>
        <p className={classes.description}>
          {fromSignup
            ? 'Your invitation link has expired or is invalid. Invitation links are valid for 24 hours. Please request a new invitation or contact support.'
            : 'Oooops! Looks like you got lost.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {fromSignup ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRequestAccess}
                className={classes.button}
              >
                Request New Invite
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBack}
                className={classes.button}
              >
                Go to Search
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleBack}
              className={classes.button}
            >
              Go to Search
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
