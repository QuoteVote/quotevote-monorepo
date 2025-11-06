import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, List, ListItem, ListItemText, ListItemAvatar, Button, Typography } from '@material-ui/core';
import { GET_BUDDY_LIST, GET_ROSTER } from '../../graphql/query';
import { SET_BUDDY_LIST, SET_PENDING_REQUESTS } from '../../store/chat';
import { usePresenceSubscription } from '../../hooks/usePresenceSubscription';
import { useRosterManagement } from '../../hooks/useRosterManagement';
import LoadingSpinner from '../LoadingSpinner';
import BuddyItemList from './BuddyItemList';
import AvatarDisplay from '../Avatar';
import PresenceIcon from '../Chat/PresenceIcon';
import StatusMessage from '../Chat/StatusMessage';
import { SET_SNACKBAR } from '../../store/ui';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: 'auto',
  },
  groupHeader: {
    padding: theme.spacing(1.25, 2),
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
  },
  onlineIndicator: {
    backgroundColor: '#44b700',
    boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(68, 183, 0, 0.2)',
  },
  awayIndicator: {
    backgroundColor: '#ffc107',
    boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(255, 193, 7, 0.2)',
  },
  dndIndicator: {
    backgroundColor: '#f44336',
    boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(244, 67, 54, 0.2)',
  },
  offlineIndicator: {
    backgroundColor: '#757575',
    boxShadow: '0 0 0 2px #fff',
  },
  pendingRequest: {
    backgroundColor: theme.palette.action.hover,
    marginBottom: theme.spacing(0.5),
  },
  acceptButton: {
    marginLeft: 'auto',
    marginRight: theme.spacing(1),
  },
}));

const BuddyListWithPresence = ({ search }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.data);
  const { loading, data, refetch, error: buddyListError } = useQuery(GET_BUDDY_LIST, {
    fetchPolicy: 'cache-and-network',
    skip: !currentUser, // Skip if user is not loaded
  });

  // Query for pending requests - get all rosters where user is involved
  const { data: rosterData, refetch: refetchRoster, error: rosterError } = useQuery(GET_ROSTER, {
    fetchPolicy: 'cache-and-network',
    skip: !currentUser, // Skip if user is not loaded
  });

  const presenceMap = useSelector((state) => state.chat?.presenceMap || {});
  const { acceptBuddy } = useRosterManagement();

  // Subscribe to presence updates
  usePresenceSubscription();

  useEffect(() => {
    if (data?.getBuddyList) {
      dispatch(SET_BUDDY_LIST(data.getBuddyList));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (rosterData?.getRoster && currentUser) {
      // Get pending requests that the user RECEIVED (not sent)
      // Received requests are where:
      // - status is 'pending'
      // - current user is the buddyId (someone wants to be buddies with current user)
      // - OR current user is userId but didn't initiate (edge case)
      const pending = rosterData.getRoster.filter((r) => {
        if (r.status !== 'pending') return false;
        if (!currentUser || !r.initiatedBy) return false;
        
        // Received request: current user is buddyId (someone sent request to current user)
        const isReceivedRequest = r.buddyId?.toString() === currentUser._id?.toString() &&
                                  r.initiatedBy?.toString() !== currentUser._id?.toString();
        
        // Edge case: current user is userId but didn't initiate (shouldn't happen but handle it)
        const isReceivedAsUserId = r.userId?.toString() === currentUser._id?.toString() &&
                                   r.initiatedBy?.toString() !== currentUser._id?.toString();
        
        return isReceivedRequest || isReceivedAsUserId;
      });
      dispatch(SET_PENDING_REQUESTS(pending));
    }
  }, [rosterData, dispatch, currentUser]);

  const handleAcceptBuddy = async (rosterId) => {
    try {
      await acceptBuddy(rosterId);
      dispatch(SET_SNACKBAR({
        open: true,
        message: 'Buddy request accepted!',
        type: 'success',
      }));
      refetchRoster();
      refetch();
    } catch (error) {
      dispatch(SET_SNACKBAR({
        open: true,
        message: error.message || 'Failed to accept buddy request',
        type: 'danger',
      }));
    }
  };

  // Show loading only if user exists and we're loading
  if (!currentUser) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
        Please log in to view your buddy list
      </div>
    );
  }

  if (loading && !data) return <LoadingSpinner size={50} />;

  // Show error if there's a query error
  if (buddyListError || rosterError) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#f44336' }}>
        Error loading buddy list. Please try refreshing.
      </div>
    );
  }

  const buddies = data?.getBuddyList || [];
  const roster = rosterData?.getRoster || [];
  
  // Filter pending requests that the user RECEIVED (not sent)
  // Received requests are where current user is the buddyId
  const pendingRequests = roster.filter((r) => {
    if (r.status !== 'pending') return false;
    if (!currentUser || !r.initiatedBy) return false;
    
    // Received request: current user is buddyId (someone sent request to current user)
    const isReceivedRequest = r.buddyId?.toString() === currentUser._id?.toString() &&
                              r.initiatedBy?.toString() !== currentUser._id?.toString();
    
    return isReceivedRequest;
  });

  // Group by presence status
  const groupedBuddies = {
    online: [],
    away: [],
    dnd: [],
    offline: [],
  };

  buddies.forEach((buddy) => {
    if (!buddy || !buddy.user) return;
    
    const presence = presenceMap[buddy.user._id] || buddy.presence;
    const status = presence?.status || 'offline';

    // Don't show invisible users
    if (status === 'invisible') return;

    const buddyWithPresence = {
      ...buddy,
      presence: presence || { status: 'offline' },
      Text: buddy.user?.name || buddy.user?.username || 'Unknown',
      statusMessage: presence?.statusMessage || '',
      room: null, // For compatibility with existing BuddyItemList
    };

    if (groupedBuddies[status]) {
      groupedBuddies[status].push(buddyWithPresence);
    } else {
      groupedBuddies.offline.push(buddyWithPresence);
    }
  });

  // Filter by search
  const filterBuddies = (buddyList) => {
    if (!buddyList || !Array.isArray(buddyList)) return [];
    if (!search) return buddyList;
    return buddyList.filter((b) => {
      if (!b || !b.user) return false;
      const name = (b.user.name || b.user.username || '').toLowerCase();
      return name.includes(search.toLowerCase());
    });
  };

  return (
    <div className={classes.root}>
      {/* Pending Requests Section */}
      {pendingRequests.length > 0 && (
        <div>
          <div className={classes.groupHeader}>
            Pending Requests ({pendingRequests.length})
          </div>
          <List>
            {pendingRequests.map((request) => {
              const buddy = request.buddy || request.user || {};
              if (!buddy || !request._id) return null;
              
              return (
                <ListItem key={request._id} className={classes.pendingRequest}>
                  <ListItemAvatar>
                    <AvatarDisplay user={buddy} size={40} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={buddy.name || buddy.username || 'Unknown User'}
                    secondary="wants to be your buddy"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.acceptButton}
                    onClick={() => handleAcceptBuddy(request._id)}
                  >
                    Accept
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </div>
      )}

      {/* Buddy List Grouped by Status */}
      {['online', 'away', 'dnd', 'offline'].map((status) => {
        const filtered = filterBuddies(groupedBuddies[status]);
        if (filtered.length === 0) return null;

        const getStatusIndicatorClass = () => {
          switch (status) {
            case 'online': return classes.onlineIndicator;
            case 'away': return classes.awayIndicator;
            case 'dnd': return classes.dndIndicator;
            default: return classes.offlineIndicator;
          }
        };

        return (
          <div key={status}>
            <div className={classes.groupHeader}>
              <span className={`${classes.statusIndicator} ${getStatusIndicatorClass()}`} />
              <Typography variant="caption" style={{ fontWeight: 700 }}>
                {status === 'dnd' ? 'Do Not Disturb' : status.charAt(0).toUpperCase() + status.slice(1)} ({filtered.length})
              </Typography>
            </div>
            <BuddyItemList buddyList={filtered} />
          </div>
        );
      })}
    </div>
  );
};

BuddyListWithPresence.propTypes = {
  search: PropTypes.string,
};

BuddyListWithPresence.defaultProps = {
  search: '',
};

export default BuddyListWithPresence;

