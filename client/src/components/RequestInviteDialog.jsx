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
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      top: 0,
      margin: 0,
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      borderRadius: 0,
    },
  },
  dialogTitle: {
    paddingRight: '0px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
        classes={{ paper: classes.dialogWrapper }}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div></div>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon /> 
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <RequestAccessForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    )
}

RequestInviteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
} 