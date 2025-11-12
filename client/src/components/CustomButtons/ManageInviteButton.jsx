import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import PropTypes from 'prop-types'

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

function ManageInviteButton(props) {
  const classes = useStyles()
  const { className } = props
  return (
    <Button
      {...props}
      className={classNames(classes.button, className)}
    >
      Admin Panel
    </Button>
  )
}

ManageInviteButton.propTypes = {
  className: PropTypes.any,
}

export default ManageInviteButton
