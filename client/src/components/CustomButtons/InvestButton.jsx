import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { isMobile } from 'react-device-detect'

const InvestButtonStyle = withStyles((theme) => ({
  root: {
    color: 'green',
    backgroundColor: 'white',
    '&:hover': {
      color: 'white',
      boxShadow: '1px 2px #FAFAFA',
    },
    padding: '10px 15px 10px 15px',
    borderRadius: '8px',
    boxShadow: '1px 2px #52b274',
    [theme.breakpoints.down('sm')]: {
      minWidth: ((props) => props.isMobile ? 250 : 300),
      marginLeft: ((props) => props.isMobile ? 25 : 60),
    },
  },
}))(Button)

function InvestButton({ handleClick, width }) {
  return (
    <InvestButtonStyle
      variant="contained"
      color="primary"
      onClick={handleClick}
      isMobile={isMobile}
    >
      {width === 'xs' || width === 'sm' ? 'Invest' : 'Invest for change'}
    </InvestButtonStyle>
  )
}

InvestButton.propTypes = {
  handleClick: PropTypes.func,
  width: PropTypes.string,
}
export default InvestButton
