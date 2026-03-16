import {
  useState, useRef, useEffect, useCallback,
} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Input,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { CHECK_EMAIL_STATUS } from '@/graphql/query'
import {
  REQUEST_USER_ACCESS_MUTATION,
  SEND_MAGIC_LOGIN_LINK,
  SEND_ONBOARDING_COMPLETION_LINK,
} from '@/graphql/mutations'

const EMAIL_VALIDATION_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar + 1,
    background:
      'linear-gradient(135deg, #2AE6B2 0%, #27C4E1 50%, #178BE1 100%)',
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      padding: theme.spacing(1.5, 2),
      gap: theme.spacing(1),
    },
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 12,
    color: '#fff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: 0,
    '&:hover': {
      opacity: 0.85,
    },
  },
  prompt: {
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.8rem',
      textAlign: 'center',
    },
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      flexDirection: 'column',
    },
  },
  emailInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: theme.spacing(0.5, 2),
    fontSize: '0.875rem',
    minWidth: 240,
    '& input': {
      padding: theme.spacing(0.5, 0),
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      minWidth: 'unset',
    },
  },
  continueButton: {
    backgroundColor: '#fff',
    color: '#178BE1',
    borderRadius: 20,
    padding: theme.spacing(0.5, 3),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  responseArea: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      width: '100%',
    },
  },
  message: {
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: '#fff',
    color: '#178BE1',
    borderRadius: 20,
    padding: theme.spacing(0.5, 2.5),
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.8rem',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
  linkButton: {
    color: '#fff',
    textDecoration: 'underline',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    '&:hover': {
      opacity: 0.85,
    },
  },
  errorText: {
    color: '#ffcdd2',
    fontSize: '0.8rem',
    fontWeight: 500,
  },
}))

export default function EyebrowBar() {
  const classes = useStyles()
  const history = useHistory()
  const client = useApolloClient()
  const loggedIn = useSelector((state) => !!state.user.data._id)
  const barRef = useRef(null)
  const [isDismissed, setIsDismissed] = useState(false)

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isLoginOptionsModalOpen, setIsLoginOptionsModalOpen] = useState(false)
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
  const [isOnboardingLinkLoading, setIsOnboardingLinkLoading] = useState(false)

  const [requestUserAccess] = useMutation(REQUEST_USER_ACCESS_MUTATION)
  const [sendMagicLink] = useMutation(SEND_MAGIC_LOGIN_LINK)
  const [sendOnboardingCompletionLink] = useMutation(
    SEND_ONBOARDING_COMPLETION_LINK,
  )

  const updateHeight = useCallback(() => {
    if (barRef.current) {
      const height = barRef.current.offsetHeight
      document.documentElement.style.setProperty(
        '--eyebrow-height',
        `${height}px`,
      )
    }
  }, [])

  // Set/clear the CSS variable based on visibility
  useEffect(() => {
    const isVisible = !(loggedIn || isDismissed)

    if (!isVisible) {
      document.documentElement.style.setProperty('--eyebrow-height', '0px')
    } else {
      updateHeight()
      window.addEventListener('resize', updateHeight)
    }

    return () => {
      if (isVisible) {
        window.removeEventListener('resize', updateHeight)
      }
      document.documentElement.style.setProperty('--eyebrow-height', '0px')
    }
  }, [loggedIn, isDismissed, isLoading, feedback, updateHeight])

  if (loggedIn || isDismissed) return null

  const handleContinue = async () => {
    const normalizedEmail = email.trim()

    setError('')
    setFeedback('')
    setIsLoginOptionsModalOpen(false)
    setIsOnboardingModalOpen(false)

    if (!EMAIL_VALIDATION_PATTERN.test(normalizedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    if (normalizedEmail !== email) {
      setEmail(normalizedEmail)
    }

    setIsLoading(true)

    try {
      const { data } = await client.query({
        query: CHECK_EMAIL_STATUS,
        variables: { email: normalizedEmail },
        fetchPolicy: 'network-only',
      })

      const emailStatus = data?.checkEmailStatus?.status

      switch (emailStatus) {
        case 'not_requested':
          // Auto-submit invite request
          await requestUserAccess({
            variables: { requestUserAccessInput: { email: normalizedEmail } },
          })
          setFeedback(
            "Your request has been received! You'll be notified once approved.",
          )
          break

        case 'requested_pending':
          setFeedback('Your invite request is still waiting for approval.')
          break

        case 'approved_no_password':
          setFeedback('')
          setIsOnboardingModalOpen(true)
          break

        case 'registered':
          setFeedback('')
          setIsLoginOptionsModalOpen(true)
          break

        default:
          setFeedback('An error has occurred')
          break
      }
    } catch (err) {
      setError(err.message || 'An error has occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMagicLink = async () => {
    setError('')

    try {
      setFeedback('Sending login link...')
      const { data } = await sendMagicLink({ variables: { email } })
      const result = data?.sendMagicLoginLink

      if (!result?.success) {
        setIsLoginOptionsModalOpen(false)
        setIsOnboardingModalOpen(true)
        setFeedback('')

        if (
          result?.message &&
          result.message !== 'This account has not completed signup yet.'
        ) {
          setError(result.message)
        }

        return
      }

      setIsLoginOptionsModalOpen(false)
      setFeedback(result?.message || 'Login link sent! Check your email.')
    } catch (err) {
      setError(err.message || 'Failed to send login link.')
    }
  }

  const handleSendOnboardingLink = async () => {
    setError('')
    setIsOnboardingLinkLoading(true)

    try {
      setFeedback('Sending onboarding link...')
      const { data } = await sendOnboardingCompletionLink({
        variables: { email },
      })
      const result = data?.sendOnboardingCompletionLink

      if (result?.success === false) {
        setError(result.message || 'Failed to send onboarding link.')
        setFeedback('')
        return
      }

      setIsOnboardingModalOpen(false)
      setFeedback(result?.message || 'Onboarding link sent! Check your email.')
    } catch (err) {
      setError(err.message || 'Failed to send onboarding link.')
    } finally {
      setIsOnboardingLinkLoading(false)
    }
  }

  const handleReset = () => {
    setEmail('')
    setFeedback('')
    setError('')
    setIsLoginOptionsModalOpen(false)
    setIsOnboardingModalOpen(false)
  }

  return (
    <div className={classes.root} ref={barRef}>
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className={classes.closeButton}
        aria-label="Close banner"
      >
        Close
      </button>
      <Typography className={classes.prompt}>Join Quote Vote</Typography>
      <div className={classes.inputWrapper}>
        <Input
          disableUnderline
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
          className={classes.emailInput}
        />
        <Button
          onClick={handleContinue}
          className={classes.continueButton}
          disabled={isLoading}
        >
          {isLoading ? 'Checking...' : 'Continue'}
        </Button>
      </div>

      {error && <Typography className={classes.errorText}>{error}</Typography>}

      {!!feedback && (
        <div className={classes.responseArea}>
          <Typography className={classes.message}>{feedback}</Typography>
          <button
            type="button"
            onClick={handleReset}
            className={classes.linkButton}
          >
            Try another email
          </button>
        </div>
      )}

      <Dialog
        open={isLoginOptionsModalOpen}
        onClose={() => setIsLoginOptionsModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>We recognize this email.</DialogTitle>
        <DialogContent>
          <Typography>Choose how you&apos;d like to log in</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendMagicLink} color="primary">
            Send me a login link
          </Button>
          <Button
            onClick={() => {
              setIsLoginOptionsModalOpen(false)
              history.push('/auth/login')
            }}
            color="default"
          >
            Login with password
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Your invite is approved!</DialogTitle>
        <DialogContent>
          <Typography>Let&apos;s finish setting up your account.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSendOnboardingLink}
            color="primary"
            disabled={isOnboardingLinkLoading}
          >
            {isOnboardingLinkLoading ?
              'Sending...' :
              'Send me a link to finish onboarding'}
          </Button>
          <Button onClick={handleReset} color="default">
            Try another email
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
