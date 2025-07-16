import IconButton from '@material-ui/core/IconButton'
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow'
import PropTypes from 'prop-types'
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles'

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
        <DoubleArrowIcon onClick={onClick} />
      </IconButton>
    </MuiThemeProvider>
  )
}

DoubleArrowIconButton.propTypes = {
  onClick: PropTypes.func,
}
export default DoubleArrowIconButton
