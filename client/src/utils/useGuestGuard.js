import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { tokenValidator } from 'store/user'

export default function useGuestGuard() {
  const dispatch = useDispatch()
  const location = useLocation()

  return () => {
    if (!tokenValidator(dispatch)) {
      window.location.assign(`https://quote.vote/auth/request-access?from=${location.pathname}`)
      return false
    }
    return true
  }
}
