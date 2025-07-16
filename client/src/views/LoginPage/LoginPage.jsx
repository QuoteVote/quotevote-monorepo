import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { tokenValidator, userLogin } from 'store/user'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/loginPageStyle'
import Login from '../../components/Login/Login'

const useStyles = makeStyles(styles)

export default function LoginPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = React.useState(false)

  // TODO: Abstract validation into custom hook
  React.useEffect(() => {
    if (tokenValidator(dispatch)) history.push('/Home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const classes = useStyles()
  const handleSubmit = async (values) => {
    const { username, password } = values
    setLoading(true)
    await userLogin(username, password, dispatch, history)
    setLoading(false)
  }

  return <Login onSubmit={handleSubmit} loading={loading} />
}
