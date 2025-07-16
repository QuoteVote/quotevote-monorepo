import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CheckIcon from '@material-ui/icons/Check'

const useStyles = makeStyles(() => ({
  button: {
    color: '#4caf50',
    borderColor: '#4caf50',
  },
  contained: {
    backgroundColor: '#4caf50',
    color: '#fff',
    borderColor: '#4caf50',
    '&:hover': {
      backgroundColor: '#43a047',
    },
  },
  outlined: {
    backgroundColor: 'transparent',
    color: '#4caf50',
    borderColor: '#4caf50',
  },
  buttonText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  count: {
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '4px',
  },
}))

function ApproveButton(props) {
  const { selected, count = 0, ...rest } = props;
  const classes = useStyles();

  return (
    <Button
      {...rest}
      variant={selected ? 'contained' : 'outlined'}
      className={selected ? `${classes.button} ${classes.contained}` : `${classes.button} ${classes.outlined}`}
      startIcon={<CheckIcon style={{ width: 24, height: 24 }} />}
    >
      <div className={classes.buttonText}>
        SUPPORT
        {count > 0 && <span className={classes.count}>👍 {count}</span>}
      </div>
    </Button>
  );
}

ApproveButton.propTypes = {
  selected: PropTypes.bool,
  count: PropTypes.number,
}

ApproveButton.defaultProps = {
  selected: false,
  count: 0,
}

export default ApproveButton
