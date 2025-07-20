import PropTypes from 'prop-types'
import Tooltip from '@mui/material/Tooltip'
import { makeStyles, withStyles } from '@mui/material/styles'
import { Grid, Typography } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 10,
    height: '85px',
    borderRadius: '6px',
  },
  headerName: {
    color: '#424556',
    font: 'Montserrat',
    fontWeight: 'bold',
    height: '28px',
    fontSize: '24px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: '18px',
      paddingLeft: 5,
      textAlign: 'left',
    },
  },
}))

const StyledTooltip = withStyles({
  tooltip: {
    backgroundColor: '#20e08e',
  },
})(Tooltip)

const ValueLabelComponent = (props) => {
  const { children, open, value } = props
  const prefix = value < 0 ? '-' : '+'
  return (
    <StyledTooltip open={open} enterTouchDelay={0} placement="top" title={`${prefix} ${value}`} arrow>
      {children}
    </StyledTooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
}

export default function SubHeader({ headerName, showFilterIconButton = true, setOffset }) {
  const classes = useStyles()

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.header}
    >
      <Grid item xs={12} sm={3} md={3}>
        <Typography className={classes.headerName}>
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
