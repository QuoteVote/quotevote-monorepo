// Backward compatibility theme - use the new ThemeContext instead
import { createTheme } from '@material-ui/core/styles'

// This is a fallback theme for components that haven't been updated yet
export default createTheme({
  palette: {
    primary: {
      main: '#52b274',
      contrastText: '#fff',
    },
    secondary: {
      main: '#E91E63',
    },
  },
})
