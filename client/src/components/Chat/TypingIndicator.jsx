import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import { useSubscription } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { TYPING_SUBSCRIPTION } from '../../graphql/subscription';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 2.5),
    minHeight: 24,
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  text: {
    fontStyle: 'italic',
    color: theme.palette.text.secondary,
    fontSize: '0.8125rem',
    fontWeight: 500,
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  dots: {
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: theme.spacing(0.75),
    gap: 4,
    '& span': {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: '#52b274',
      animation: '$pulse 1.4s ease-in-out infinite',
      '&:nth-child(1)': {
        animationDelay: '0s',
      },
      '&:nth-child(2)': {
        animationDelay: '0.2s',
      },
      '&:nth-child(3)': {
        animationDelay: '0.4s',
      },
    },
  },
  '@keyframes pulse': {
    '0%, 60%, 100%': {
      transform: 'scale(0.8)',
      opacity: 0.4,
    },
    '30%': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
  },
}));

const TypingIndicator = ({ messageRoomId }) => {
  const classes = useStyles();
  const currentUser = useSelector((state) => state.user.data);
  const [typingUsers, setTypingUsers] = useState([]);

  // Subscribe to typing events
  const { data } = useSubscription(
    TYPING_SUBSCRIPTION,
    messageRoomId
      ? {
          variables: { messageRoomId },
          skip: !messageRoomId,
          onSubscriptionData: ({ subscriptionData }) => {
            if (subscriptionData?.data?.typing) {
              const typingEvent = subscriptionData.data.typing;
              const userId = typingEvent.userId;

              // Don't show typing indicator for current user
              if (userId === currentUser?._id) {
                return;
              }

              setTypingUsers((prev) => {
                if (typingEvent.isTyping) {
                  // Add user if not already in list
                  if (!prev.find((u) => u.userId === userId)) {
                    return [
                      ...prev,
                      {
                        userId,
                        user: typingEvent.user,
                        timestamp: typingEvent.timestamp,
                      },
                    ];
                  }
                  return prev;
                } else {
                  // Remove user from list
                  return prev.filter((u) => u.userId !== userId);
                }
              });
            }
          },
        }
      : { skip: true },
  );

  // Auto-remove typing users after 10 seconds (TTL on backend)
  useEffect(() => {
    if (typingUsers.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers((prev) =>
        prev.filter((user) => {
          const timestamp = new Date(user.timestamp).getTime();
          return now - timestamp < 10000; // 10 seconds
        }),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [typingUsers.length]);

  if (!messageRoomId || typingUsers.length === 0) {
    return <div className={classes.root} />;
  }

  const getTypingMessage = () => {
    if (typingUsers.length === 1) {
      const userName = typingUsers[0].user?.name || typingUsers[0].user?.username || 'Someone';
      return `${userName} is typing...`;
    } else if (typingUsers.length === 2) {
      return '2 people are typing...';
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="caption" className={classes.text}>
        {getTypingMessage()}
        <span className={classes.dots}>
          <span />
          <span />
          <span />
        </span>
      </Typography>
    </div>
  );
};

TypingIndicator.propTypes = {
  messageRoomId: PropTypes.string,
};

export default TypingIndicator;
