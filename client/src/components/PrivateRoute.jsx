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
          // Redirect to invite request page with current URL as query parameter
          const currentPath = props.location.pathname + props.location.search
          const redirectUrl = `/auth/request-access?from=${encodeURIComponent(
            currentPath,
          )}`
          return <Redirect to={redirectUrl} />
        }
        return <Component {...props} />
      }}
    />
  )
}

export default PrivateRoute
