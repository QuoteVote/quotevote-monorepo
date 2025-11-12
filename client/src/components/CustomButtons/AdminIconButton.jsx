import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { IconButton } from '@material-ui/core'
import SecurityIcon from '@material-ui/icons/Security'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  iconButton: {
    color: '#0A2342',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#52b274',
      transform: 'scale(1.1)',
    },
  },
}))

export default function AdminIconButton({ fontSize, onNavigate }) {
  const classes = useStyles()
  const history = useHistory()
  const admin = useSelector((state) => state.user.data?.admin)

  const handleClick = () => {
    history.push('/ControlPanel')
    // Call onNavigate callback if provided (e.g., to close mobile drawer)
    if (onNavigate) {
      onNavigate()
    }
  }

  // Only render if user is admin
  if (!admin) {
    return null
  }

  return (
    <IconButton
      aria-label="Admin Panel"
      color="inherit"
      className={classes.iconButton}
      onClick={handleClick}
    >
      <SecurityIcon fontSize={fontSize || 'default'} />
    </IconButton>
  )
}

AdminIconButton.propTypes = {
  fontSize: PropTypes.string,
  onNavigate: PropTypes.func,
}

