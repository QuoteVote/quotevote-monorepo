import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'
import { useAuthModal } from '@/Context/AuthModalContext'

/**
 * Hook to guard guest interactions by showing invite modal instead of redirecting
 * @returns {Function} Function that returns false if user is not authenticated
 */
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
