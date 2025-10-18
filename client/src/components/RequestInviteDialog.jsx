import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import Input from '@mui/material/Input'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import { REQUEST_USER_ACCESS_MUTATION } from '@/graphql/mutations'
import { GET_CHECK_DUPLICATE_EMAIL } from '@/graphql/query'

export default function RequestInviteDialog({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const client = useApolloClient()
  const [requestUserAccess] = useMutation(REQUEST_USER_ACCESS_MUTATION)

  const handleSubmit = async () => {
    const pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i)
    if (!pattern.test(email)) {
      setError('This is not a valid email address')
      return
    }
    const checkDuplicate = await client.query({
      query: GET_CHECK_DUPLICATE_EMAIL,
      variables: { email },
      fetchPolicy: 'network-only',
    })
    if (checkDuplicate && checkDuplicate.data.checkDuplicateEmail.length) {
      setError('This email already exists')
      return
    }
    await requestUserAccess({ variables: { requestUserAccessInput: { email } } })
    setSubmitted(true)
  }

  const handleClose = () => {
    setEmail('')
    setError('')
    setSubmitted(false)
    if (onClose) onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Grid container direction="column" alignItems="center" style={{ padding: 24 }}>
        {submitted ? (
          <>
            <Typography align="center">Thank you for joining us</Typography>
            <Typography align="center" style={{ marginTop: 8 }}>
              When an account becomes available, an invite will be sent to the email provided.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleClose} style={{ marginTop: 16 }}>
              Close
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" align="center">Request Invite</Typography>
            <Input
              autoFocus
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginTop: 16 }}
            />
            {error && (
              <Typography color="error" style={{ marginTop: 8 }}>
                {error}
              </Typography>
            )}
            <Button variant="contained" color="secondary" onClick={handleSubmit} style={{ marginTop: 16 }}>
              Submit
            </Button>
          </>
        )}
      </Grid>
    </Dialog>
  )
}

RequestInviteDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
}
