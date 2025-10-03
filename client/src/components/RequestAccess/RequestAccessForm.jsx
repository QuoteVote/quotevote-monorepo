import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useForm } from 'react-hook-form'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'

import { REQUEST_USER_ACCESS_MUTATION } from '@/graphql/mutations'
import { GET_CHECK_DUPLICATE_EMAIL } from '@/graphql/query'

import Grid from '@material-ui/core/Grid'
import Input from '@material-ui/core/Input'
import { Typography } from '@material-ui/core'

import Button from '../../mui-pro/CustomButtons/Button'
import PersonalForm from 'components/RequestAccess/PersonalForm/PersonalForm'

const useStyles = makeStyles(styles)

/**
 * Form component for requesting platform access via email invitation
 */
export default function RequestAccessForm({ onSuccess }) {
  const classes = useStyles()
  const [userDetails, setUserDetails] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [requestInviteSuccessful, setRequestInviteSuccessful] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const client = useApolloClient()
  const [requestUserAccess, { loading }] = useMutation(
    REQUEST_USER_ACCESS_MUTATION,
  )

  const onSubmit = async () => {
    setErrorMessage('')
    const pattern = new RegExp(
      /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i,
    )

    const isValidEmail = pattern.test(String(userDetails).toLowerCase())
    if (!isValidEmail) {
      setErrorMessage('Please enter a valid email address')
      return
    }

    try {
      const { data } = await client.query({
        query: GET_CHECK_DUPLICATE_EMAIL,
        variables: { email: userDetails },
        fetchPolicy: 'network-only',
      })

      const hasDuplicatedEmail = data?.checkDuplicateEmail?.length > 0
      if (hasDuplicatedEmail) {
        setErrorMessage(
          'This email address has already been used to request an invite.',
        )
        return
      }

      if (!Object.keys(errors).length) {
        const requestUserAccessInput = { email: userDetails }
        await requestUserAccess({ variables: { requestUserAccessInput } })
        setRequestInviteSuccessful(true)
        if (onSuccess) onSuccess()
      }
    } catch (err) {
      if (err.message.includes('email: Path `email` is required.')) {
        setErrorMessage('Email is required')
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.')
        console.error(err)
      }
    }
  }

  if (requestInviteSuccessful) {
    return <PersonalForm requestInviteSuccessful={requestInviteSuccessful} />
  }

  const duplicate = (
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
        {errorMessage}
      </Typography>
    </div>
  )

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
      spacing={2}
      style={{ padding: '0' }}
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
          You need an account to contribute. Viewing is public, but posting,
          voting, and quoting require an invite.
        </Typography>

        <div
          style={{
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
            borderRadius: '12px',
            padding: '20px',
            margin: '12px 0',
            border: '2px solid #e0e0e0',
            transition: 'all 0.3s ease',
            position: 'relative',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '2px solid #52b274'
            e.currentTarget.style.boxShadow =
              '0 0 0 4px rgba(82, 178, 116, 0.1)'
            e.currentTarget.style.background =
              'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '2px solid #e0e0e0'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.background =
              'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
          }}
        >
          <Input
            disableUnderline
            placeholder="Enter Your Email Address"
            type="email"
            className={classes.input}
            value={userDetails}
            onChange={(event) => setUserDetails(event.target.value)}
            onKeyPress={(event) => event.key === 'Enter' && onSubmit()}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#2c3e50',
              fontWeight: 500,
              padding: 0,
            }}
            inputProps={{
              style: {
                '::placeholder': {
                  color: '#6c757d',
                  fontWeight: 400,
                },
              },
            }}
          />
        </div>
        <Button
          className={classes.requestAccessBtn}
          onClick={onSubmit}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '1.5rem',
            padding: '14px 24px',
            fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
            fontWeight: 600,
            backgroundColor: loading ? '#ccc' : '#52b274',
            color: '#fff',
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(82, 178, 116, 0.3)',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            '&:hover': {
              backgroundColor: loading ? '#ccc' : '#4a9f63',
              boxShadow: loading
                ? 'none'
                : '0 6px 16px rgba(82, 178, 116, 0.4)',
              transform: loading ? 'none' : 'translateY(-1px)',
            },
          }}
        >
          {loading ? 'Sending...' : 'Request Invite'}
        </Button>
        {errorMessage && duplicate}
      </Grid>
    </Grid>
  )
}

RequestAccessForm.propTypes = {
  onSuccess: PropTypes.func,
}
