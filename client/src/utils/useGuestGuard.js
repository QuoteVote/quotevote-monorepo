import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { tokenValidator } from 'store/user'

export default function useGuestGuard() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  return () => {
    if (!tokenValidator(dispatch)) {
      const from = encodeURIComponent(location.pathname + location.search)
      history.push(`/auth/request-access?from=${from}`)
      return false
    }
    return true
  }
}
