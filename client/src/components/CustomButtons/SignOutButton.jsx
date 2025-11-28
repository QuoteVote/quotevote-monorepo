import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
const useStyles = makeStyles((theme) => ({
  button: {
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 'normal',
    fontStretch: 'normal',
    fontStyle: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'right',
    color: theme.palette.error.main,
    '&:hover': {
      backgroundColor: 'rgba(244, 67, 54, 0.08)',
    },
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
