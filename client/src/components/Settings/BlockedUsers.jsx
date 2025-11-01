import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Button, 
  TextField, 
  Paper,
  makeStyles
} from '@material-ui/core';
import { GET_USERS } from '../../graphql/query';
import { BLOCK_USER, UNBLOCK_USER, GET_BLOCKED_USERS } from '../../graphql/mutations';

const useStyles = makeStyles((theme) => ({
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  blockedUsersList: {
    maxHeight: 200,
    overflow: 'auto',
  },
  blockUserSection: {
    marginTop: theme.spacing(2),
  },
  userItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const BlockedUsers = () => {
  const classes = useStyles();
  const [blockedUserIds, setBlockedUserIds] = useState([]);
  const [blockUserId, setBlockUserId] = useState('');
  const [users, setUsers] = useState([]);
  
  // Fetch all users
  const { data: usersData } = useQuery(GET_USERS);
  
  // Fetch blocked users
  const [getBlockedUsers, { data: blockedUsersData }] = useMutation(GET_BLOCKED_USERS);
  
  // Block user mutation
  const [blockUser] = useMutation(BLOCK_USER, {
    onCompleted: () => {
      // Refresh blocked users list
      getBlockedUsers();
      setBlockUserId('');
    },
    onError: (error) => {
      console.error('Error blocking user:', error);
    }
  });
  
  // Unblock user mutation
  const [unblockUser] = useMutation(UNBLOCK_USER, {
    onCompleted: () => {
      // Refresh blocked users list
      getBlockedUsers();
    },
    onError: (error) => {
      console.error('Error unblocking user:', error);
    }
  });
  
  useEffect(() => {
    if (usersData?.users) {
      setUsers(usersData.users);
    }
  }, [usersData]);
  
  useEffect(() => {
    // Fetch initial blocked users list
    getBlockedUsers();
  }, [getBlockedUsers]);
  
  useEffect(() => {
    if (blockedUsersData?.getBlockedUsers) {
      setBlockedUserIds(blockedUsersData.getBlockedUsers);
    }
  }, [blockedUsersData]);
  
  const handleBlockUser = () => {
    if (blockUserId) {
      blockUser({ variables: { userId: blockUserId } });
    }
  };
  
  const handleUnblockUser = (userId) => {
    unblockUser({ variables: { userId } });
  };
  
  return (
    <>
      <Typography className={classes.sectionTitle}>
        Blocked Users
      </Typography>
      <Paper className={classes.paper}>
        <div className={classes.blockUserSection}>
          <TextField
            label="User ID to block"
            value={blockUserId}
            onChange={(e) => setBlockUserId(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleBlockUser}
            disabled={!blockUserId}
          >
            Block User
          </Button>
        </div>
        
        {blockedUserIds.length > 0 && (
          <div className={classes.blockedUsersList}>
            <List>
              {blockedUserIds.map((userId) => {
                const user = users.find(u => u._id === userId);
                return (
                  <ListItem key={userId} className={classes.userItem}>
                    <ListItemText
                      primary={user ? `${user.name} (${user.username})` : userId}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        size="small"
                        onClick={() => handleUnblockUser(userId)}
                        color="secondary"
                      >
                        Unblock
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </div>
        )}
        
        {blockedUserIds.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            You haven't blocked any users yet.
          </Typography>
        )}
      </Paper>
    </>
  );
};

export default BlockedUsers;