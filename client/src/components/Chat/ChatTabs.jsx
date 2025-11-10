import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Tabs, Tab, Badge } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import GroupIcon from '@material-ui/icons/Group';
import PeopleIcon from '@material-ui/icons/People';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    background: '#ffffff',
    '& .MuiTabs-indicator': {
      height: 4,
      borderRadius: '4px 4px 0 0',
      background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
      boxShadow: `0 -2px 12px rgba(82, 178, 116, 0.4)`,
    },
  },
  tab: {
    minWidth: 0,
    minHeight: 56,
    textTransform: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    padding: theme.spacing(1.75, 2),
    color: theme.palette.text.secondary,
    opacity: 0.7,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      color: '#52b274',
      opacity: 1,
      background: 'linear-gradient(135deg, rgba(82, 178, 116, 0.08) 0%, rgba(74, 158, 99, 0.05) 100%)',
    },
    '&.Mui-selected': {
      color: '#52b274',
      fontWeight: 700,
      opacity: 1,
      background: 'linear-gradient(135deg, rgba(82, 178, 116, 0.12) 0%, rgba(74, 158, 99, 0.08) 100%)',
    },
    '& .MuiTab-iconWrapper': {
      color: 'inherit',
      opacity: 'inherit',
      marginBottom: theme.spacing(0.5),
      transition: 'transform 0.3s ease',
    },
    '&.Mui-selected .MuiTab-iconWrapper': {
      transform: 'scale(1.15)',
      color: '#52b274',
    },
  },
  badge: {
    marginLeft: theme.spacing(0.5),
    fontSize: '0.7rem',
    '& .MuiBadge-badge': {
      backgroundColor: '#52b274',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: '0.6875rem',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 10,
      boxShadow: '0 2px 4px rgba(82, 178, 116, 0.3)',
    },
  },
  tabLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: 'inherit',
    '& span': {
      color: 'inherit',
    },
  },
}));

const ChatTabs = ({ value, onChange, dmCount, groupCount, onlineCount }) => {
  const classes = useStyles();

  return (
    <Tabs
      value={value}
      onChange={onChange}
      className={classes.root}
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
    >
      <Tab
        className={classes.tab}
        value="chats"
        icon={<ChatIcon />}
        label={
          <span className={classes.tabLabel}>
            <span>Chats</span>
            {dmCount > 0 && (
              <Badge
                badgeContent={dmCount}
                className={classes.badge}
                max={99}
              />
            )}
          </span>
        }
      />
      <Tab
        className={classes.tab}
        value="groups"
        icon={<GroupIcon />}
        label={
          <span className={classes.tabLabel}>
            <span>Groups</span>
            {groupCount > 0 && (
              <Badge
                badgeContent={groupCount}
                className={classes.badge}
                max={99}
              />
            )}
          </span>
        }
      />
      <Tab
        className={classes.tab}
        value="buddies"
        icon={<PeopleIcon />}
        label={
          <span className={classes.tabLabel}>
            <span>Buddies</span>
            {onlineCount > 0 && (
              <Badge
                badgeContent={onlineCount}
                className={classes.badge}
                max={99}
              />
            )}
          </span>
        }
      />
    </Tabs>
  );
};

ChatTabs.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  dmCount: PropTypes.number,
  groupCount: PropTypes.number,
  onlineCount: PropTypes.number,
};

ChatTabs.defaultProps = {
  dmCount: 0,
  groupCount: 0,
  onlineCount: 0,
};

export default ChatTabs;

