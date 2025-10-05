import React from 'react'
import { makeStyles } from '@mui/styles'
import GridContainer from 'mui-pro/Grid/GridContainer'
import styles from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import { useMutation } from '@apollo/react-hooks'
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword'
import EmailSent from '../../components/EmailSent/EmailSent'
import { SEND_PASSWORD_RESET_EMAIL } from '../../graphql/mutations'

const useStyles = makeStyles(styles)

export default function ForgotPasswordPage() {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(false)
  const [emailSent, setEmailSent] = React.useState(false)
  const [error, setError] = React.useState(null)
  const [sendPasswordResetEmail] = useMutation(SEND_PASSWORD_RESET_EMAIL)
  const handleSubmit = async (values) => {
    const { email } = values
    setLoading(true)
    const result = await sendPasswordResetEmail({ variables: { email } })
    if ('errors' in result) {
      setError(result.errors[0].message)
    } else {
      setEmailSent(true)
    }
    setLoading(false)
  }

  return (
    <div className={classes.container}>
      <GridContainer justify="center" style={{ marginRight: 24 }}>
        {!emailSent && <ForgotPassword onSubmit={handleSubmit} loading={loading} error={error} />}
        {emailSent && <EmailSent />}
      </GridContainer>
    </div>
  )
}
