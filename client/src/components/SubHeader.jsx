import PropTypes from 'prop-types'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { Grid, Typography } from '@mui/material'

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#20e08e',
  },
}))

const ValueLabelComponent = (props) => {
  const { children, open, value } = props
  const prefix = value < 0 ? '-' : '+'
  return (
    <StyledTooltip
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={`${prefix} ${value}`}
      arrow
    >
      {children}
    </StyledTooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
}

export default function SubHeader({
  headerName,
  showFilterIconButton = true,
  setOffset,
}) {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      sx={{ mt: 1, height: '85px', borderRadius: '6px' }}
    >
      <Grid item xs={12} sm={3} md={3}>
        <Typography
          sx={{
            color: '#424556',
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            height: '28px',
            fontSize: { xs: '18px', sm: '24px' },
            textAlign: { xs: 'left', sm: 'center' },
            pl: { xs: 0.625, sm: 0 },
          }}
        >
          {headerName}
        </Typography>
      </Grid>
      <Grid item xs={8} sm={5} md={6} />
      <Grid item xs={4} sm={3} md={3} />
    </Grid>
  )
}

SubHeader.propTypes = {
  headerName: PropTypes.string.isRequired,
  showFilterIconButton: PropTypes.bool,
  setOffset: PropTypes.any,
}
