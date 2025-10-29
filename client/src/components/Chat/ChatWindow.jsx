import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useSubscription, useMutation } from '@apollo/client';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  InputBase,
  IconButton,
  List,
  ListItem,
  Typography,
  Divider,
  Snackbar
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import ScrollableFeed from 'react-scrollable-feed';
import { GET_ROOM_MESSAGES, GET_CONVERSATION } from '../../graphql/query';
import { SEND_MESSAGE, MSG_TYPING, MSG_READ } from '../../graphql/mutations';
import { NEW_MESSAGE_SUBSCRIPTION, MSG_TYPING_UPDATE, RECEIPT_UPDATE } from '../../graphql/subscription';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: theme.spacing(1),
    backgroundColor: 'white',
    borderBottom: '1px solid #e0e0e0',
  },
  typingIndicator: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  messageItem: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 4,
    backgroundColor: 'white',
    position: 'relative',
  },
  ownMessage: {
    backgroundColor: '#e3f2fd',
  },
  inputContainer: {
    padding: theme.spacing(1),
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: theme.spacing(1),
  },
  author: {
    fontWeight: 'bold',
    fontSize: '0.8rem',
    marginBottom: theme.spacing(0.5),
  },
  timestamp: {
    fontSize: '0.7rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
  },
  messageBody: {
    fontSize: '0.9rem',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  readIndicator: {
    marginLeft: theme.spacing(0.5),
    fontSize: '0.8rem',
  },
  blockedMessage: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const ChatWindow = ({ conversationId }) => {
  const classes = useStyles();
  const [messageText, setMessageText] = useState('');
  const user = useSelector((state) => state.user.data);
  const [typingUsers, setTypingUsers] = useState([]);
  const [readReceipts, setReadReceipts] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const messagesEndRef = useRef(null);

  // Use the typing indicator hook
  const { handleInputFocus, handleInputBlur, handleInputChange } = useTypingIndicator(conversationId);

  // Fetch messages for the conversation
  const {
    loading: messagesLoading,
    error: messagesError,
    data: messagesData,
    refetch: refetchMessages
  } = useQuery(GET_ROOM_MESSAGES, {
    variables: { messageRoomId: conversationId },
    skip: !conversationId,
  });

  // Fetch conversation details to check if user is blocked
  const {
    loading: conversationLoading,
    error: conversationError,
    data: conversationData
  } = useQuery(GET_CONVERSATION, {
    variables: { conversationId },
    skip: !conversationId,
    onCompleted: (data) => {
      // Check if current user is blocked by any participant
      if (data?.conversation?.participants) {
        const isCurrentUserBlocked = data.conversation.participants.some(
          participant => 
            participant._id !== user._id && 
            participant.blockedUserIds?.includes(user._id)
        );
        setIsBlocked(isCurrentUserBlocked);
      }
    }
  });

  // Subscribe to new messages
  useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    variables: { messageRoomId: conversationId },
    skip: !conversationId,
    onSubscriptionData: () => {
      // Automatically scroll to bottom when new message arrives
      refetchMessages();
    },
  });

  // Subscribe to typing updates
  useSubscription(MSG_TYPING_UPDATE, {
    variables: { conversationId },
    skip: !conversationId,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const { msgTypingUpdate } = subscriptionData.data;
        const { userId, isTyping } = msgTypingUpdate;

        // Don't show typing indicator for current user
        if (userId === user._id) return;

        setTypingUsers(prev => {
          if (isTyping) {
            // Add user to typing list if not already there
            if (!prev.some(u => u.userId === userId)) {
              return [...prev, { userId, lastUpdated: Date.now() }];
            }
            return prev.map(u => 
              u.userId === userId ? { ...u, lastUpdated: Date.now() } : u
            );
          } else {
            // Remove user from typing list
            return prev.filter(u => u.userId !== userId);
          }
        });
      }
    },
  });

  // Subscribe to receipt updates
  useSubscription(RECEIPT_UPDATE, {
    variables: { conversationId },
    skip: !conversationId,
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.data) {
        const { receiptUpdate } = subscriptionData.data;
        const { userId, lastSeenMessageId } = receiptUpdate;

        // Don't show read receipts for current user
        if (userId === user._id) return;

        setReadReceipts(prev => ({
          ...prev,
          [lastSeenMessageId]: {
            ...prev[lastSeenMessageId],
            [userId]: receiptUpdate.lastSeenAt
          }
        }));
      }
    },
  });

  // Mutation to send a message
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      // Clear input after successful send
      setMessageText('');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      // Handle rate limiting error
      if (error.message.includes('Rate limit exceeded')) {
        setSnackbarMessage('You are sending messages too quickly. Please wait.');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Error sending message: ' + error.message);
        setSnackbarOpen(true);
      }
    },
    refetchQueries: [{
      query: GET_ROOM_MESSAGES,
      variables: { messageRoomId: conversationId },
    }],
  });

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !conversationId || isBlocked) return;
    
    sendMessage({
      variables: {
        message: {
          messageRoomId: conversationId,
          text: messageText.trim(),
          type: 'TEXT',
        }
      }
    });
  };

  // Handle Enter key press (but allow Shift+Enter for new lines)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Send read receipt when messages are loaded and scrolled to bottom
  useEffect(() => {
    if (messagesData?.messages?.length > 0) {
      const lastMessage = messagesData.messages[messagesData.messages.length - 1];
      if (lastMessage) {
        // Send read receipt for the last message
        const sendReadReceipt = async () => {
          try {
            await msgRead({
              variables: {
                conversationId,
                messageId: lastMessage._id
              }
            });
          } catch (error) {
            console.error('Error sending read receipt:', error);
          }
        };
        sendReadReceipt();
      }
    }
  }, [messagesData, conversationId, msgRead]);

  // Clean up old typing indicators (older than 10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => 
        prev.filter(u => now - u.lastUpdated < 10000)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!conversationId) {
    return (
      <div className={classes.root}>
        <Typography>Select a conversation to start chatting</Typography>
      </div>
    );
  }

  if (messagesLoading || conversationLoading) {
    return (
      <div className={classes.root}>
        <Typography>Loading messages...</Typography>
      </div>
    );
  }

  if (messagesError || conversationError) {
    return (
      <div className={classes.root}>
        <Typography>Error loading messages: {messagesError?.message || conversationError?.message}</Typography>
      </div>
    );
  }

  const messages = messagesData?.messages || [];

  // Get names of typing users
  const typingUserNames = typingUsers
    .map(tu => {
      const userMessage = messages.find(m => m.userId === tu.userId);
      return userMessage ? (userMessage.user?.name || userMessage.userName) : 'User';
    })
    .filter(Boolean);

  // Format typing indicator text
  let typingText = '';
  if (typingUserNames.length > 0) {
    if (typingUserNames.length === 1) {
      typingText = `${typingUserNames[0]} is typing...`;
    } else if (typingUserNames.length === 2) {
      typingText = `${typingUserNames[0]} and ${typingUserNames[1]} are typing...`;
    } else {
      typingText = `${typingUserNames[0]} and ${typingUserNames.length - 1} others are typing...`;
    }
  }

  return (
    <div className={classes.root}>
      {/* Chat header with typing indicator */}
      <div className={classes.header}>
        {typingText && (
          <Typography className={classes.typingIndicator}>
            {typingText}
          </Typography>
        )}
      </div>
      
      {/* Messages container */}
      <div className={classes.messagesContainer}>
        {isBlocked ? (
          <div className={classes.blockedMessage}>
            <Typography>You cannot send messages to this user.</Typography>
          </div>
        ) : (
          <ScrollableFeed>
            <List>
              {messages.map((message) => {
                const isOwnMessage = message.userId === user._id;
                const hasBeenRead = readReceipts[message._id];
                
                return (
                  <ListItem 
                    key={message._id} 
                    className={`${classes.messageItem} ${isOwnMessage ? classes.ownMessage : ''}`}
                    alignItems="flex-start"
                  >
                    <div>
                      <div className={classes.author}>
                        {message.user?.name || message.userName}
                      </div>
                      <div className={classes.messageBody}>
                        {message.text}
                      </div>
                      <div className={classes.timestamp}>
                        {new Date(message.created).toLocaleString()}
                        {isOwnMessage && hasBeenRead && (
                          <span className={classes.readIndicator}>
                            <DoneAllIcon style={{ fontSize: '1rem', color: 'green' }} />
                          </span>
                        )}
                        {isOwnMessage && !hasBeenRead && (
                          <span className={classes.readIndicator}>
                            <DoneIcon style={{ fontSize: '1rem', color: 'grey' }} />
                          </span>
                        )}
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </List>
          </ScrollableFeed>
        )}
      </div>
      
      {/* Divider */}
      <Divider />
      
      {/* Input area */}
      <Paper className={classes.inputContainer}>
        {isBlocked ? (
          <div className={classes.blockedMessage}>
            <Typography>You cannot send messages to this user.</Typography>
          </div>
        ) : (
          <>
            <InputBase
              className={classes.input}
              multiline
              rowsMax={4}
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleInputChange();
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              disabled={isBlocked}
            />
            <IconButton 
              color="primary" 
              onClick={handleSendMessage}
              disabled={!messageText.trim() || isBlocked}
            >
              <SendIcon />
            </IconButton>
          </>
        )}
      </Paper>
      
      {/* Snackbar for error messages */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default ChatWindow;