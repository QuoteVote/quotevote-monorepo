import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: 400,
      maxWidth: 500,
    },
  },
  dialogTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    position: 'relative',
  },
  closeButton: {
    color: theme.palette.primary.contrastText,
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  dialogContent: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    textAlign: 'center',
  },
  donationText: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}))

export default function StripePaymentDialog({ open, onClose }) {
  const classes = useStyles()
  const [stripeLoaded, setStripeLoaded] = useState(false)

  useEffect(() => {
    // Load Stripe script if not already loaded
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/buy-button.js'
      script.async = true
      script.onload = () => setStripeLoaded(true)
      document.body.appendChild(script)
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    } else {
      setStripeLoaded(true)
    }
  }, [])

  const handleClose = () => {
    // Only allow closing if user clicks the close button
    if (onClose) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {}} // Prevent closing by clicking outside or pressing escape
      className={classes.dialog}
      disableEscapeKeyDown
      disableBackdropClick
    >
      <DialogTitle className={classes.dialogTitle}>
        <span>Support Our Mission</span>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.donationText}>
          <h3>Your contribution helps us continue building amazing features and supporting our community.</h3>
        </div>
        {stripeLoaded && (
          <stripe-buy-button
            buy-button-id="buy_btn_1RY6bhP3PjIJfZEbu5CpTDjo"
            publishable-key="pk_live_51RXriSP3PjIJfZEb1tqnEGBOGFZBHREUxqWHeO22GASJ5It6MKfpakOE3oDtL7II20j5idUR6NuXrBlaKXvszY6q00nn8KxROy"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

StripePaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
} 