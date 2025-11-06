import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, List, ListItem, ListItemText, ListItemAvatar, Button, Typography, Chip, IconButton, Avatar } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
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
  pendingRequestsContainer: {
    padding: theme.spacing(1, 1.5),
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  pendingRequestItem: {
    padding: theme.spacing(0.75, 1),
    marginBottom: theme.spacing(0.5),
    borderRadius: 8,
    backgroundColor: '#ffffff',
    border: `1px solid ${theme.palette.grey[200]}`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      borderColor: theme.palette.grey[300],
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
  pendingRequestAvatar: {
    width: 32,
    height: 32,
    flexShrink: 0,
  },
  pendingRequestContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.25),
  },
  pendingRequestName: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  pendingRequestLabel: {
    fontSize: '0.6875rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  pendingRequestActions: {
    display: 'flex',
    gap: theme.spacing(0.5),
    flexShrink: 0,
  },
  acceptButton: {
    minWidth: 32,
    width: 32,
    height: 32,
    padding: 0,
    backgroundColor: '#52b274',
    color: '#ffffff',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: '#4a9e63',
    },
  },
  declineButton: {
    minWidth: 32,
    width: 32,
    height: 32,
    padding: 0,
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
      color: theme.palette.error.main,
    },
  },
  pendingRequestsBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 20,
    height: 20,
    padding: '0 6px',
    borderRadius: 10,
    backgroundColor: '#52b274',
    color: '#ffffff',
    fontSize: '0.6875rem',
    fontWeight: 700,
    marginLeft: theme.spacing(0.5),
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
  const { acceptBuddy, blockBuddy } = useRosterManagement();

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

  const handleAcceptBuddy = async (rosterId, buddyId) => {
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

  const handleDeclineBuddy = async (rosterId, buddyId) => {
    try {
      // Block the user to decline the request
      await blockBuddy(buddyId);
      dispatch(SET_SNACKBAR({
        open: true,
        message: 'Buddy request declined',
        type: 'info',
      }));
      refetchRoster();
      refetch();
    } catch (error) {
      dispatch(SET_SNACKBAR({
        open: true,
        message: error.message || 'Failed to decline buddy request',
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
      {/* Pending Requests Section - Compact Design */}
      {pendingRequests.length > 0 && (
        <div className={classes.pendingRequestsContainer}>
          <div className={classes.groupHeader} style={{ padding: 0, marginBottom: 8 }}>
            <Typography variant="caption" style={{ fontWeight: 700, fontSize: '0.75rem' }}>
              Pending Requests
            </Typography>
            <span className={classes.pendingRequestsBadge}>
              {pendingRequests.length}
            </span>
          </div>
          {pendingRequests.map((request) => {
            const buddy = request.buddy || {};
            if (!buddy || !request._id) return null;
            
            // For received requests, the sender is the buddy (the one who initiated)
            const buddyId = buddy._id || request.initiatedBy;
            
            return (
              <div key={request._id} className={classes.pendingRequestItem}>
                <Avatar className={classes.pendingRequestAvatar}>
                  <AvatarDisplay height={32} width={32} {...(buddy.avatar || {})} />
                </Avatar>
                <div className={classes.pendingRequestContent}>
                  <Typography className={classes.pendingRequestName}>
                    {buddy.name || buddy.username || 'Unknown User'}
                  </Typography>
                  <Typography className={classes.pendingRequestLabel}>
                    Wants to be your buddy
                  </Typography>
                </div>
                <div className={classes.pendingRequestActions}>
                  <IconButton
                    size="small"
                    className={classes.acceptButton}
                    onClick={() => handleAcceptBuddy(request._id, buddyId)}
                    title="Accept"
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    className={classes.declineButton}
                    onClick={() => handleDeclineBuddy(request._id, buddyId)}
                    title="Decline"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          })}
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

