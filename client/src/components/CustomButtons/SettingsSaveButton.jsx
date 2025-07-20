import React from 'react'
import { makeStyles } from '@mui/material/styles'
import Button from '@mui/material/Button'
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
    '&:disabled': {
      color: 'rgba(255, 255, 255, 0.6)', // Semi-transparent white for disabled state
    },
    '&.Mui-disabled': {
      color: 'rgba(255, 255, 255, 0.6)', // Ensure Material-UI disabled class also works
    },
  },
}))

function SettingsSaveButton(props) {
  const classes = useStyles()
  const { className } = props

  return (
    <Button
      {...props}
      className={classNames(classes.button, className)}
      type="submit"
    >
      Save
    </Button>
  )
}

SettingsSaveButton.propTypes = {
  className: PropTypes.any,
}

export default SettingsSaveButton
