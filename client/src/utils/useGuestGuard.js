import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'
import { useAuthModal } from '@/Context/AuthModalContext'


export default function useGuestGuard() {
  const dispatch = useDispatch()

  const { openAuthModal } = useAuthModal()

  return () => {
    if (!tokenValidator(dispatch)) {
      openAuthModal()
      return false
    }
    return true
  }
  
}
