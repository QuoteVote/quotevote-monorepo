import React from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import RequestAccessForm from './RequestAccess/RequestAccessForm'

const useStyles = makeStyles((theme) => ({
  dialogWrapper: {
    borderRadius: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3),
      minHeight: 'auto',
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
      borderRadius: theme.spacing(1.5),
      maxHeight: '90vh',
    },
  },
  dialogContent: {
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5, 2),
    },
  },
  emailInputWrapper: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: theme.spacing(1.5),
    padding: theme.spacing(2.5),
    margin: theme.spacing(1.5, 0),
    border: '2px solid #e0e0e0',
    transition: 'all 0.3s ease',
    '&:focus-within': {
      border: '2px solid #52b274',
      boxShadow: '0 0 0 4px rgba(82, 178, 116, 0.1)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      margin: theme.spacing(1, 0),
    },
  },
  emailInput: {
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
    color: '#2c3e50',
    fontWeight: 500,
    '&::placeholder': {
      color: '#6c757d',
      fontWeight: 400,
    },
    '&:focus': {
      color: '#1a252f',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    zIndex: 1,
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(0.5),
      top: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },
}))

export default function RequestInviteDialog({ open, onClose }) {
  const classes = useStyles()

  const handleSuccess = () => {
    // Auto-close modal after 3 seconds on successful submission
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="body"
      classes={{ paper: classes.dialogWrapper }}
      PaperProps={{
        style: {
          backgroundColor: '#fff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <DialogContent className={classes.dialogContent}>
        <RequestAccessForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}

RequestInviteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

RequestInviteDialog.defaultProps = {
  open: false,
  onClose: () => {},
}
