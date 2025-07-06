import { Route, Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'

function PrivateRoute({ component: Component, requiresAuth, ...rest }) {
  const dispatch = useDispatch()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (requiresAuth && !tokenValidator(dispatch)) {
          const from = encodeURIComponent(props.location.pathname + props.location.search)
          return <Redirect to={`/auth/request-access?from=${from}`} />
        }
        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute
