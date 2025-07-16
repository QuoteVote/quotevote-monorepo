import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useHistory, useLocation } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import { useQuery } from '@apollo/react-hooks'
import SignupForm from '../../components/SignupForm/SignupForm'
import { VERIFY_PASSWORD_RESET_TOKEN } from '../../graphql/query'
import LoadingSpinner from '../../components/LoadingSpinner'

const useStyles = makeStyles(styles)

export default function SignupPage() {
  const history = useHistory()
  const { search } = useLocation()
  const params = Object.fromEntries(new URLSearchParams(search))
  const { token } = params || {}
  const { data, loading: loadingData } = useQuery(VERIFY_PASSWORD_RESET_TOKEN, {
    variables: { token },
  })
  const user = (data && data.verifyUserPasswordResetToken) || false
  const classes = useStyles()

  React.useEffect(() => {
    if (!loadingData && !user) history.push('/error')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingData, user])

  if (loadingData) return <LoadingSpinner />

  return (
    <div className={classes.container}>
      <SignupForm user={user} token={token} />
    </div>
  )
}
