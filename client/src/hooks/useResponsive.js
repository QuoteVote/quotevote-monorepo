import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

/**
 * Custom hook to get theme and responsive breakpoint information
 * @returns {Object} Object containing theme and isSmallScreen boolean
 */
export const useResponsive = () => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  return { theme, isSmallScreen }
}

