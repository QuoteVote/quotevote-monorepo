import React from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  DialogTitle,
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
  dialogTitle: {
    paddingRight: '0px',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 1, 0.5, 1),
    },
  },
  dialogContent: {
    padding: theme.spacing(2, 3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5, 2),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    [theme.breakpoints.down('xs')]: {
      right: theme.spacing(0.5),
      top: theme.spacing(0.5),
      padding: theme.spacing(1),
    },
  },  
}))

export default  function RequestInviteDialog({ open, onClose }) {
  const classes = useStyles()

  const handleSuccess = () => {
    //implement a success message or action after successful request
    //for now, just close the dialog to test the flow
    setTimeout(() => {
      onClose()}, 3000)
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
        <DialogTitle className={classes.dialogTitle}>
          <div></div>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
            size="small"
          >
            <CloseIcon fontSize="small" /> 
          </IconButton>
        </DialogTitle>
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