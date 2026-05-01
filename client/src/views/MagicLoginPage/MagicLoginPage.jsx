import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useApolloClient } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Button, CircularProgress } from '@material-ui/core'
import { VERIFY_PASSWORD_RESET_TOKEN } from '@/graphql/query'
import { USER_LOGIN_SUCCESS } from 'store/user'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  message: {
    marginBottom: theme.spacing(3),
    color: '#fff',
    fontWeight: 500,
  },
  loginButton: {
    backgroundColor: '#fff',
    color: '#178BE1',
    borderRadius: 20,
    padding: theme.spacing(1, 4),
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
}))

export default function MagicLoginPage() {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const client = useApolloClient()
  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')

    if (!token) {
      setStatus('error')
      setErrorMsg('No login token provided.')
      return
    }

    const verifyAndLogin = async () => {
      try {
        // Store token first so Apollo client sends it with the verify request
        localStorage.setItem('token', token)

        const { data } = await client.query({
          query: VERIFY_PASSWORD_RESET_TOKEN,
          variables: { token },
          fetchPolicy: 'network-only',
        })

        const user = data?.verifyUserPasswordResetToken
        if (!user || !user._id) {
          localStorage.removeItem('token')
          setStatus('error')
          setErrorMsg('Invalid or expired login link.')
          return
        }

        // Dispatch login success with user data
        dispatch(USER_LOGIN_SUCCESS({
          data: user,
          loading: false,
          loginError: null,
        }))

        setStatus('success')

        // Redirect to search page after brief delay
        setTimeout(() => {
          history.push('/search')
        }, 1000)
      } catch (err) {
        localStorage.removeItem('token')
        setStatus('error')
        setErrorMsg(
          err.message?.includes('expired')
            ? 'This login link has expired. Please request a new one.'
            : 'Invalid or expired login link.',
        )
      }
    }

    verifyAndLogin()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={classes.root}>
      {status === 'verifying' && (
        <>
          <CircularProgress style={{ color: '#fff', marginBottom: 16 }} />
          <Typography variant="h6" className={classes.message}>
            Signing you in...
          </Typography>
        </>
      )}

      {status === 'success' && (
        <Typography variant="h6" className={classes.message}>
          You're in! Redirecting...
        </Typography>
      )}

      {status === 'error' && (
        <>
          <Typography variant="h6" className={classes.message}>
            {errorMsg}
          </Typography>
          <Button
            onClick={() => history.push('/auth/login')}
            className={classes.loginButton}
          >
            Go to Login
          </Button>
        </>
      )}
    </div>
  )
}
