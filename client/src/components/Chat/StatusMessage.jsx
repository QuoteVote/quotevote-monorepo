import React from 'react';
import PropTypes from 'prop-types';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

const StatusMessage = ({ message }) => {
  const classes = useStyles();

  if (!message) return null;

  return (
    <Typography className={classes.root} title={message}>
      {message}
    </Typography>
  );
};

StatusMessage.propTypes = {
  message: PropTypes.string,
};

StatusMessage.defaultProps = {
  message: '',
};

export default StatusMessage;

