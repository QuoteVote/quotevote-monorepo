import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import AdminPanelSettingsIcon from '@material-ui/icons/AdminPanelSettings'

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
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      padding: theme.spacing(1),
    },
  },
  icon: {
    fontSize: '20px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
    },
  },
}))

function AdminPanelButton(props) {
  const classes = useStyles()
  const { className } = props
  return (
    <Button
      {...props}
      className={classNames(classes.button, className)}
      startIcon={<AdminPanelSettingsIcon className={classes.icon} />}
    >
      Admin
    </Button>
  )
}

AdminPanelButton.propTypes = {
  className: PropTypes.any,
}

export default AdminPanelButton
