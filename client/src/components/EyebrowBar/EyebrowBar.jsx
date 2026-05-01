import React, { useState, useRef, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Input, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { CHECK_EMAIL_STATUS } from '@/graphql/query'
import { REQUEST_USER_ACCESS_MUTATION, SEND_MAGIC_LOGIN_LINK } from '@/graphql/mutations'

const EMAIL_VALIDATION_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar + 1,
    background: 'linear-gradient(135deg, #2AE6B2 0%, #27C4E1 50%, #178BE1 100%)',
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

  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('input') // input | loading | result
  const [status, setStatus] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  const [requestUserAccess] = useMutation(REQUEST_USER_ACCESS_MUTATION)
  const [sendMagicLink] = useMutation(SEND_MAGIC_LOGIN_LINK)

  const updateHeight = useCallback(() => {
    if (barRef.current) {
      const height = barRef.current.offsetHeight
      document.documentElement.style.setProperty('--eyebrow-height', `${height}px`)
    }
  }, [])

  // Set/clear the CSS variable based on visibility
  useEffect(() => {
    if (loggedIn) {
      document.documentElement.style.setProperty('--eyebrow-height', '0px')
      return
    }
    // Measure after render
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
      document.documentElement.style.setProperty('--eyebrow-height', '0px')
    }
  }, [loggedIn, phase, updateHeight])

  if (loggedIn) return null

  const handleContinue = async () => {
    setError('')

    if (!EMAIL_VALIDATION_PATTERN.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setPhase('loading')

    try {
      const { data } = await client.query({
        query: CHECK_EMAIL_STATUS,
        variables: { email },
        fetchPolicy: 'network-only',
      })

      const emailStatus = data?.checkEmailStatus?.status
      setStatus(emailStatus)

      switch (emailStatus) {
        case 'not_requested':
          // Auto-submit invite request
          await requestUserAccess({
            variables: { requestUserAccessInput: { email } },
          })
          setFeedback('Invite requested! We\'ll email you when a spot opens up.')
          setPhase('result')
          break

        case 'requested_pending':
          setFeedback('Your invite request is pending approval. Hang tight!')
          setPhase('result')
          break

        case 'approved_no_password':
          setFeedback('Your invite is approved! Complete your signup to get started.')
          setPhase('result')
          break

        case 'registered':
          setPhase('result')
          break

        default:
          setFeedback('Something went wrong. Please try again.')
          setPhase('result')
          break
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('input')
    }
  }

  const handleSendMagicLink = async () => {
    try {
      setFeedback('Sending login link...')
      await sendMagicLink({ variables: { email } })
      setFeedback('Login link sent! Check your email.')
    } catch (err) {
      setError(err.message || 'Failed to send login link.')
    }
  }

  const handleReset = () => {
    setEmail('')
    setPhase('input')
    setStatus(null)
    setFeedback('')
    setError('')
  }

  return (
    <div className={classes.root} ref={barRef}>
      {phase === 'input' && (
        <>
          <Typography className={classes.prompt}>
            Join Quote Vote
          </Typography>
          <div className={classes.inputWrapper}>
            <Input
              disableUnderline
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
              className={classes.emailInput}
            />
            <Button
              onClick={handleContinue}
              className={classes.continueButton}
            >
              Continue
            </Button>
          </div>
          {error && (
            <Typography className={classes.errorText}>{error}</Typography>
          )}
        </>
      )}

      {phase === 'loading' && (
        <Typography className={classes.message}>Checking...</Typography>
      )}

      {phase === 'result' && status === 'registered' && (
        <div className={classes.responseArea}>
          <Typography className={classes.message}>
            Welcome back! How would you like to sign in?
          </Typography>
          <Button
            onClick={handleSendMagicLink}
            className={classes.actionButton}
          >
            Email me a login link
          </Button>
          <button
            type="button"
            onClick={() => history.push(`/auth/login`)}
            className={classes.linkButton}
          >
            Login with password
          </button>
        </div>
      )}

      {phase === 'result' && status === 'approved_no_password' && (
        <div className={classes.responseArea}>
          <Typography className={classes.message}>{feedback}</Typography>
          <Button
            onClick={() => history.push('/auth/signup')}
            className={classes.actionButton}
          >
            Complete Signup
          </Button>
        </div>
      )}

      {phase === 'result' && status !== 'registered' && status !== 'approved_no_password' && (
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

      {error && phase === 'result' && (
        <Typography className={classes.errorText}>{error}</Typography>
      )}
    </div>
  )
}
