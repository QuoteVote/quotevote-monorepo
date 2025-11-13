import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridContainer from 'mui-pro/Grid/GridContainer'
import { tokenValidator } from 'store/user'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import { useMutation, useQuery } from '@apollo/client'
import PasswordReset from '../../components/PasswordReset/PasswordReset'
import { VERIFY_PASSWORD_RESET_TOKEN } from '../../graphql/query'
import { UPDATE_USER_PASSWORD } from '../../graphql/mutations'

const useStyles = makeStyles(styles)

export default function PasswordResetPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const { search } = useLocation()
  const params = Object.fromEntries(new URLSearchParams(search))
  const { token, username } = params || {}
  const [passwordUpdated, setPasswordUpdated] = React.useState(false)
  const { data, loading: loadingData } = useQuery(VERIFY_PASSWORD_RESET_TOKEN, {
    variables: { token },
  })
  const [updateUserPassword] = useMutation(UPDATE_USER_PASSWORD)
  const isValidToken = data && data.verifyUserPasswordResetToken
  // TODO: Abstract validation into custom hook
  React.useEffect(() => {
    if (tokenValidator(dispatch)) history.push('/search')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const classes = useStyles()
  const handleSubmit = async (values) => {
    const { password } = values
    setLoading(true)
    const result = await updateUserPassword({
      variables: {
        username,
        password,
        token,
      },
    })
    if ('errors' in result) {
      setError(result.errors[0].message)
    } else {
      setPasswordUpdated(true)
    }

    setLoading(false)
  }

  return (
    <div className={classes.container}>
      <GridContainer justify="center" style={{ marginRight: 24 }}>
        <PasswordReset
          onSubmit={handleSubmit}
          loadingData={loadingData}
          loading={loading}
          passwordUpdated={passwordUpdated}
          isValidToken={isValidToken}
          error={error}
        />
      </GridContainer>
    </div>
  )
}
