import React from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
const useStyles = makeStyles(() => ({
  button: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'right',
    color: '#ffffff',
  },
}))

function SignOutButton(props) {
  const classes = useStyles()
  const { className } = props

  return (
    <Button
      {...props}
      className={classNames(classes.button, className)}
      startIcon={<ExitToAppIcon />}
    >
      Sign out
    </Button>
  )
}

SignOutButton.propTypes = {
  className: PropTypes.any,
}

export default SignOutButton
