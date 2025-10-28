import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery, useSubscription } from '@apollo/client';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from '@material-ui/core';
import DisplayAvatar from '../Avatar';
import { usePresence } from '../../hooks/usePresence';
import {
  GET_ONLINE_USERS,
  PRESENCE_UPDATES_SUBSCRIPTION,
} from '../../graphql/presence';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.spacing(1),
    overflow: 'hidden',
  },
  header: {
    padding: theme.spacing(2),
    background: 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)',
    color: '#ffffff',
    fontWeight: 600,
  },
  listContainer: {
    maxHeight: 400,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  listItem: {
    padding: theme.spacing(1.5, 2),
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  avatarContainer: {
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid white',
  },
  online: {
    backgroundColor: '#4caf50',
  },
  away: {
    backgroundColor: '#ff9800',
  },
  offline: {
    backgroundColor: '#9e9e9e',
  },
  userInfo: {
    marginLeft: theme.spacing(1),
  },
  displayName: {
    fontWeight: 500,
    fontSize: '0.95rem',
  },
  statusText: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  emptyState: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
  },
}));

function BuddyListPanel() {
  const classes = useStyles();

  // Use presence hook to manage online/offline status and heartbeat
  usePresence();

  // GraphQL hooks
  const { data, loading, error } = useQuery(GET_ONLINE_USERS, {
    pollInterval: 60000, // Poll every minute as backup
  });

  // Subscribe to presence updates
  const { data: subscriptionData } = useSubscription(PRESENCE_UPDATES_SUBSCRIPTION);

  // Merge query data with subscription updates
  const onlineUsers = React.useMemo(() => {
    const users = data?.presenceOnlineUsers || [];
    
    // If we have subscription data, update the user list
    if (subscriptionData?.presenceUpdates) {
      const updatedUser = subscriptionData.presenceUpdates;
      const existingUserIndex = users.findIndex(
        (user) => user.userId === updatedUser.userId
      );

      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedUsers = [...users];
        updatedUsers[existingUserIndex] = updatedUser;
        return updatedUsers;
      } else if (updatedUser.status !== 'offline') {
        // Add new online user
        return [...users, updatedUser];
      }
    }

    return users;
  }, [data, subscriptionData]);

  // Get status indicator class
  const getStatusClass = (status) => {
    switch (status) {
      case 'online':
        return classes.online;
      case 'away':
        return classes.away;
      case 'offline':
        return classes.offline;
      default:
        return classes.offline;
    }
  };

  // Format last seen time
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    const date = new Date(lastSeen);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <Paper className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h6">Online Users</Typography>
        </Box>
        <Box className={classes.loadingContainer}>
          <CircularProgress size={40} />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper className={classes.root}>
        <Box className={classes.header}>
          <Typography variant="h6">Online Users</Typography>
        </Box>
        <Box className={classes.emptyState}>
          <Typography variant="body2">
            Unable to load online users
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6">
          Online Users ({onlineUsers.length})
        </Typography>
      </Box>
      <Box className={classes.listContainer}>
        {onlineUsers.length === 0 ? (
          <Box className={classes.emptyState}>
            <Typography variant="body2">
              No users online
            </Typography>
          </Box>
        ) : (
          <List>
            {onlineUsers.map((user) => (
              <ListItem key={user.userId} className={classes.listItem}>
                <ListItemAvatar>
                  <Box className={classes.avatarContainer}>
                    <DisplayAvatar
                      topType={user.topType || 'ShortHairShortFlat'}
                      accessoriesType={user.accessoriesType || 'Blank'}
                      hairColor={user.hairColor || 'BrownDark'}
                      facialHairType={user.facialHairType || 'Blank'}
                      clotheType={user.clotheType || 'Hoodie'}
                      clotheColor={user.clotheColor || 'Blue03'}
                      eyeType={user.eyeType || 'Default'}
                      eyebrowType={user.eyebrowType || 'Default'}
                      mouthType={user.mouthType || 'Smile'}
                      skinColor={user.skinColor || 'Light'}
                      height={40}
                    />
                    <Box
                      className={`${classes.statusIndicator} ${getStatusClass(
                        user.status
                      )}`}
                    />
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  className={classes.userInfo}
                  primary={
                    <Typography className={classes.displayName}>
                      {user.displayName || `User ${user.userId.substring(0, 8)}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      {user.text && (
                        <Typography
                          component="span"
                          className={classes.statusText}
                        >
                          {user.text}
                        </Typography>
                      )}
                      {!user.text && (
                        <Typography
                          component="span"
                          variant="body2"
                          color="textSecondary"
                        >
                          {formatLastSeen(user.lastSeen)}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
}

export default BuddyListPanel;
