import React from 'react'
import { userLogin } from 'store/user'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import Login from '../../components/Login/Login'

export default function LoginPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const [loading, setLoading] = React.useState(false)

  // Extract redirect parameter from URL
  const searchParams = new URLSearchParams(location.search)
  const redirectPath = searchParams.get('redirect')

  const handleSubmit = async (values) => {
    const { username, password } = values
    setLoading(true)
    await userLogin(username, password, dispatch, history, redirectPath)
    setLoading(false)
  }

  return <Login onSubmit={handleSubmit} loading={loading} />
}
