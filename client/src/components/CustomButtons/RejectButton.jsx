import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import Close from '@mui/icons-material/Close'

const useStyles = makeStyles(() => ({
  button: {
    color: '#f44336',
    borderColor: '#f44336',
  },
  contained: {
    backgroundColor: '#f44336',
    color: '#fff',
    borderColor: '#f44336',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  outlined: {
    backgroundColor: 'transparent',
    color: '#f44336',
    borderColor: '#f44336',
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

function RejectButton(props) {
  const { selected, count = 0, ...rest } = props;
  const classes = useStyles();

  return (
    <Button
      {...rest}
      variant={selected ? 'contained' : 'outlined'}
      className={selected ? `${classes.button} ${classes.contained}` : `${classes.button} ${classes.outlined}`}
      startIcon={<Close style={{ width: 24, height: 24 }} />}
    >
      <div className={classes.buttonText}>
        DISAGREE
        {count > 0 && <span className={classes.count}>👎 {count}</span>}
      </div>
    </Button>
  );
}

RejectButton.propTypes = {
  selected: PropTypes.bool,
  count: PropTypes.number,
}

RejectButton.defaultProps = {
  selected: false,
  count: 0,
}

export default RejectButton
