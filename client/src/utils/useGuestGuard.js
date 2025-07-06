import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'

export default function useGuestGuard() {
  const dispatch = useDispatch()

  return () => {
    if (!tokenValidator(dispatch)) {
      const fromPath = window.location.pathname
      window.location.href = `https://quote.vote/auth/request-access?from=${fromPath}`
      return false
    }
    return true
  }
}
