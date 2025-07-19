import IconButton from '@mui/material/IconButton'
import DoubleArrow from '@mui/icons-material/DoubleArrow'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#52b274',
    },
  },
})

function DoubleArrowIconButton({ onClick }) {
  return (
    <MuiThemeProvider theme={customTheme}>
      <IconButton color="primary" size="small">
        <DoubleArrow onClick={onClick} />
      </IconButton>
    </MuiThemeProvider>
  )
}

DoubleArrowIconButton.propTypes = {
  onClick: PropTypes.func,
}
export default DoubleArrowIconButton
