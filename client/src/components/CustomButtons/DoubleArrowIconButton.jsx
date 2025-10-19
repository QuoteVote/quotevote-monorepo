import IconButton from '@mui/material/IconButton'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#52b274',
    },
  },
})

function DoubleArrowIconButton({ onClick }) {
  return (
  <ThemeProvider theme={customTheme}>
      <IconButton color="primary" size="small">
        <DoubleArrowIcon onClick={onClick} />
      </IconButton>
  </ThemeProvider>
  )
}

DoubleArrowIconButton.propTypes = {
  onClick: PropTypes.func,
}
export default DoubleArrowIconButton
