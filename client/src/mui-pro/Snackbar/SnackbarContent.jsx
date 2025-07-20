import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// @mui/material components
import { makeStyles } from '@mui/material/styles'
import Snack from '@mui/material/SnackbarContent'
import IconButton from '@mui/material/IconButton'

// @mui/icons-material
import Close from '@mui/icons-material/Close'

import styles from 'assets/jss/material-dashboard-pro-react/components/snackbarContentStyle'

const useStyles = makeStyles(styles)

export default function SnackbarContent(props) {
  const classes = useStyles()
  const {
    message, color, close, icon,
  } = props
  let action = []
  const messageClasses = cx({
    [classes.iconMessage]: icon !== undefined,
  })

  console.log("SNACKBARCONTENT",props)
  if (close !== undefined) {
    action = [
      <IconButton
        className={classes.iconButton}
        key="close"
        aria-label="Close"
        color="inherit"
      >
        <Close className={classes.close} />
      </IconButton>,
    ]
  }
  const iconClasses = cx({
    [classes.icon]: classes.icon,
    [classes.infoIcon]: color === 'info',
    [classes.successIcon]: color === 'success',
    [classes.warningIcon]: color === 'warning',
    [classes.dangerIcon]: color === 'danger',
    [classes.primaryIcon]: color === 'primary',
    [classes.roseIcon]: color === 'rose',
  })
  return (
    <Snack
      message={(
        <div>
          {icon !== undefined ? <props.icon className={iconClasses} /> : null}
          <span className={messageClasses}>{message}</span>
        </div>
      )}
      classes={{
        root: `${classes.root} ${classes[color]}`,
        message: classes.message,
      }}
      action={action}
    />
  )
}

SnackbarContent.defaultProps = {
  color: 'info',
}

SnackbarContent.propTypes = {
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    'info',
    'success',
    'warning',
    'danger',
    'primary',
    'rose',
  ]),
  close: PropTypes.bool,
  icon: PropTypes.object,
}
