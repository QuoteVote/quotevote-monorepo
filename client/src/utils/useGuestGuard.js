import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { tokenValidator } from 'store/user'

export default function useGuestGuard() {
  const dispatch = useDispatch()
  const history = useHistory()

  return () => {
    if (!tokenValidator(dispatch)) {
      history.push('/auth/request-access')
      return false
    }
    return true
  }
}
