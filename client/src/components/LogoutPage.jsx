import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

function LogoutPage() {
  const client = useApolloClient()
  useEffect(() => {
    localStorage.removeItem('token')
    client.resetStore()
  }, [client])

  return <Redirect to="/auth/login" />
}

export default LogoutPage
