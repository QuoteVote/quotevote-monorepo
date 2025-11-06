import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 8,
  },
  online: {
    backgroundColor: '#44b700',
    boxShadow: '0 0 0 2px #fff, inset 0 0 0 1px rgba(0,0,0,.1)',
  },
  away: {
    backgroundColor: '#ffc107',
    boxShadow: '0 0 0 2px #fff, inset 0 0 0 1px rgba(0,0,0,.1)',
  },
  dnd: {
    backgroundColor: '#f44336',
    boxShadow: '0 0 0 2px #fff, inset 0 0 0 1px rgba(0,0,0,.1)',
  },
  offline: {
    backgroundColor: '#757575',
    boxShadow: '0 0 0 2px #fff, inset 0 0 0 1px rgba(0,0,0,.1)',
  },
}));

const PresenceIcon = ({ status }) => {
  const classes = useStyles();

  const getStatusClass = () => {
    switch (status) {
      case 'online':
        return classes.online;
      case 'away':
        return classes.away;
      case 'dnd':
        return classes.dnd;
      case 'offline':
      case 'invisible':
      default:
        return classes.offline;
    }
  };

  return <span className={`${classes.root} ${getStatusClass()}`} />;
};

PresenceIcon.propTypes = {
  status: PropTypes.oneOf(['online', 'away', 'dnd', 'offline', 'invisible']).isRequired,
};

export default PresenceIcon;

