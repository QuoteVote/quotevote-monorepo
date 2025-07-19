import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { tokenValidator } from 'store/user'

export default function useGuestGuard() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  return () => {
    if (!tokenValidator(dispatch)) {
      // Redirect to invite request page with current URL as query parameter
      const currentPath = location.pathname + location.search
      const redirectUrl = `/auth/request-access?from=${encodeURIComponent(currentPath)}`
      history.push(redirectUrl)
      return false
    }
    return true
  }
}
