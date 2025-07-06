import { Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'

function PrivateRoute({ component: Component, requiresAuth, ...rest }) {
  const dispatch = useDispatch()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (requiresAuth && !tokenValidator(dispatch)) {
          const fromPath = props.location.pathname
          window.location.href = `https://quote.vote/auth/request-access?from=${fromPath}`
          return null
        }
        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute
