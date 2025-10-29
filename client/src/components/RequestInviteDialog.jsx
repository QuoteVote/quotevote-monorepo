import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  Grid,
  Input,
  Typography,
  Button,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { useLocation } from 'react-router-dom'
import { REQUEST_USER_ACCESS_MUTATION } from '@/graphql/mutations'
import { GET_CHECK_DUPLICATE_EMAIL } from '@/graphql/query'

// Email validation regex pattern
const EMAIL_VALIDATION_PATTERN = /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i

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
  missionLink: {
    color: '#52b274',
    textDecoration: 'none',
    fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
    fontWeight: 500,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#4a9f63',
      textDecoration: 'underline',
    },
  },
  requestButton: {
    backgroundColor: '#52b274',
    color: 'white',
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.spacing(1),
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 500,
    width: '100%',
    '&:hover': {
      backgroundColor: '#4a9f63',
    },
  },
  loginLink: {
    color: '#52b274',
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}))

export default function RequestInviteDialog({ open, onClose }) {
  const classes = useStyles()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const timeoutRef = useRef(null)
  const client = useApolloClient()
  const [requestUserAccess, { loading }] = useMutation(
    REQUEST_USER_ACCESS_MUTATION,
  )

  const handleSubmit = async () => {
    setError('')

    if (!EMAIL_VALIDATION_PATTERN.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      const checkDuplicate = await client.query({
        query: GET_CHECK_DUPLICATE_EMAIL,
        variables: { email },
        fetchPolicy: 'network-only',
      })

      if (checkDuplicate && checkDuplicate.data.checkDuplicateEmail.length) {
        setError(
          'This email address has already been used to request an invite.',
        )
        return
      }

      await requestUserAccess({
        variables: { requestUserAccessInput: { email } },
      })
      setSubmitted(true)
      // Auto-close after 3 seconds with cleanup
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.')
      console.error(err)
    }
  }

  const handleClose = () => {
    // Clear timeout if it exists
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setEmail('')
    setError('')
    setSubmitted(false)
    if (onClose) onClose()
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Get current URL path to pass as redirect parameter
  const currentPath = location.pathname + location.search
  const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentPath)}`

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        onClick={handleClose}
        size="small"
      >
        <CloseIcon fontSize="small" />
      </IconButton>
      <DialogContent className={classes.dialogContent}>
        {submitted ? (
          <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="h6"
                align="center"
                style={{ fontWeight: 600, color: '#212121' }}
              >
                Thank you for joining us
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                align="center"
                style={{
                  color: '#666',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: 1.6,
                }}
              >
                When an account becomes available, an invite will be sent to the
                email provided.
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction="column"
            alignItems="center"
            spacing={2}
            style={{ padding: 0 }}
          >
            <Grid item xs={12} style={{ width: '100%' }}>
              <Typography
                variant="body1"
                style={{
                  textAlign: 'center',
                  color: '#212121',
                  marginBottom: '1rem',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                You need an account to contribute. Viewing is public, but
                posting, voting, and quoting require an invite.
              </Typography>

              <div className={classes.emailInputWrapper}>
                <Input
                  disableUnderline
                  placeholder="Enter Your Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  className={classes.emailInput}
                  fullWidth
                />
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#ffebee',
                    border: '1px solid #ffcdd2',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginTop: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    style={{
                      color: '#c62828',
                      fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
                      fontWeight: 500,
                      margin: 0,
                    }}
                  >
                    {error}
                  </Typography>
                </div>
              )}

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                <a
                  href="/auth/request-access#mission"
                  className={classes.missionLink}
                >
                  Learn more about our mission here
                </a>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className={classes.requestButton}
              >
                Request Invite
              </Button>

              <Typography
                align="center"
                style={{
                  marginTop: '1rem',
                  fontSize: 'clamp(0.875rem, 2vw, 0.95rem)',
                  color: '#666',
                }}
              >
                Already have an account?{' '}
                <a href={loginUrl} className={classes.loginLink}>
                  Login
                </a>
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  )
}

RequestInviteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
