import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Badge,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import {
  GET_USER_ROSTER,
  GET_BUDDY_LIST_PRESENCE,
  GET_PENDING_ROSTER_REQUESTS,
} from '../../graphql/query';
import gql from 'graphql-tag';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflowY: 'auto',
  },
  header: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
  online: {
    color: '#4caf50',
  },
  away: {
    color: '#ff9800',
  },
  dnd: {
    color: '#f44336',
  },
  offline: {
    color: '#9e9e9e',
  },
  awayMessage: {
    fontSize: '0.75rem',
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
  },
  section: {
    marginTop: theme.spacing(2),
  },
  sectionTitle: {
    padding: theme.spacing(1, 2),
    fontWeight: 'bold',
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  badge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#4caf50',
      color: '#4caf50',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  },
}));

const PRESENCE_UPDATE_SUBSCRIPTION = gql`
  subscription presenceUpdate($userId: String!) {
    presenceUpdate(userId: $userId) {
      _id
      userId
      status
      awayMessage
      lastHeartbeat
      lastSeen
      updatedAt
    }
  }
`;

const BuddyListPanel = ({ onSelectContact }) => {
  const classes = useStyles();
  const [presenceMap, setPresenceMap] = useState({});

  const { data: rosterData, loading: rosterLoading } = useQuery(GET_USER_ROSTER);
  const { data: pendingData } = useQuery(GET_PENDING_ROSTER_REQUESTS);

  const roster = rosterData?.getUserRoster || [];
  const pendingRequests = pendingData?.getPendingRosterRequests || [];

  const userIds = roster.map((r) => r.contactUserId);

  const { data: presenceData, refetch: refetchPresence } = useQuery(
    GET_BUDDY_LIST_PRESENCE,
    {
      variables: { userIds },
      skip: userIds.length === 0,
      pollInterval: 30000, // Poll every 30 seconds
    }
  );

  // Subscribe to presence updates for all contacts
  useEffect(() => {
    if (presenceData?.getBuddyListPresence) {
      const newPresenceMap = {};
      presenceData.getBuddyListPresence.forEach((p) => {
        newPresenceMap[p.userId] = p;
      });
      setPresenceMap(newPresenceMap);
    }
  }, [presenceData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return classes.online;
      case 'away':
        return classes.away;
      case 'dnd':
        return classes.dnd;
      default:
        return classes.offline;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'dnd':
        return 'Do Not Disturb';
      case 'invisible':
        return 'Invisible';
      default:
        return 'Offline';
    }
  };

  const groupedContacts = {
    online: [],
    away: [],
    offline: [],
  };

  roster.forEach((contact) => {
    const presence = presenceMap[contact.contactUserId] || { status: 'offline' };
    const group = presence.status === 'online' ? 'online' : 
                  presence.status === 'away' || presence.status === 'dnd' ? 'away' : 
                  'offline';
    groupedContacts[group].push({ ...contact, presence });
  });

  if (rosterLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <Typography variant="h6">Buddy List</Typography>
      </Box>

      {pendingRequests.length > 0 && (
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Pending Requests ({pendingRequests.length})
          </Typography>
          <List>
            {pendingRequests.map((request) => (
              <ListItem key={request._id} className={classes.listItem}>
                <ListItemAvatar>
                  <Avatar src={request.contact?.avatar?.avatarURL}>
                    {request.contact?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={request.contact?.name || request.contact?.username}
                  secondary="Wants to add you"
                />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      )}

      {groupedContacts.online.length > 0 && (
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Online ({groupedContacts.online.length})
          </Typography>
          <List>
            {groupedContacts.online.map((contact) => (
              <ListItem
                key={contact._id}
                className={classes.listItem}
                onClick={() => onSelectContact(contact)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    className={classes.badge}
                  >
                    <Avatar src={contact.contact?.avatar?.avatarURL}>
                      {contact.contact?.name?.charAt(0)}
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <FiberManualRecordIcon
                        className={getStatusColor(contact.presence.status)}
                        style={{ fontSize: 12, marginRight: 8 }}
                      />
                      {contact.contact?.name || contact.contact?.username}
                    </Box>
                  }
                  secondary={
                    contact.presence.awayMessage && (
                      <Typography className={classes.awayMessage}>
                        {contact.presence.awayMessage}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {groupedContacts.away.length > 0 && (
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Away ({groupedContacts.away.length})
          </Typography>
          <List>
            {groupedContacts.away.map((contact) => (
              <ListItem
                key={contact._id}
                className={classes.listItem}
                onClick={() => onSelectContact(contact)}
              >
                <ListItemAvatar>
                  <Avatar src={contact.contact?.avatar?.avatarURL}>
                    {contact.contact?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <FiberManualRecordIcon
                        className={getStatusColor(contact.presence.status)}
                        style={{ fontSize: 12, marginRight: 8 }}
                      />
                      {contact.contact?.name || contact.contact?.username}
                    </Box>
                  }
                  secondary={
                    contact.presence.awayMessage && (
                      <Typography className={classes.awayMessage}>
                        {contact.presence.awayMessage}
                      </Typography>
                    )
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {groupedContacts.offline.length > 0 && (
        <Box className={classes.section}>
          <Typography className={classes.sectionTitle}>
            Offline ({groupedContacts.offline.length})
          </Typography>
          <List>
            {groupedContacts.offline.map((contact) => (
              <ListItem
                key={contact._id}
                className={classes.listItem}
                onClick={() => onSelectContact(contact)}
              >
                <ListItemAvatar>
                  <Avatar src={contact.contact?.avatar?.avatarURL}>
                    {contact.contact?.name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={contact.contact?.name || contact.contact?.username}
                  secondary={getStatusText('offline')}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {roster.length === 0 && (
        <Box p={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            No contacts yet. Add friends to start chatting!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BuddyListPanel;
