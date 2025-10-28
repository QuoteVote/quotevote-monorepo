import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Fab,
  Badge,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';
import BuddyListPanel from './BuddyListPanel';
import StatusEditor from './StatusEditor';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 360,
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  drawerPaper: {
    width: 360,
    top: 64,
    height: 'calc(100% - 64px)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      top: 56,
      height: 'calc(100% - 56px)',
    },
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  drawerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1000,
    background: 'linear-gradient(90deg, #2AE6B2, #27C4E1)',
    color: '#ffffff',
    '&:hover': {
      background: 'linear-gradient(90deg, #27C4E1, #178BE1)',
      transform: 'scale(1.1)',
    },
  },
  statusButton: {
    marginLeft: 'auto',
    color: theme.palette.primary.contrastText,
  },
}));

const ChatSidebar = ({ open: externalOpen, onClose: externalOnClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const loggedIn = useSelector((state) => state.user?.data?._id);
  
  const [internalOpen, setInternalOpen] = useState(false);
  const [statusEditorOpen, setStatusEditorOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const handleClose = externalOnClose || (() => setInternalOpen(false));

  const handleToggle = () => {
    if (externalOpen === undefined) {
      setInternalOpen(!internalOpen);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    // TODO: Open chat window with selected contact
    console.log('Selected contact:', contact);
  };

  // Only show chat for logged-in users
  if (!loggedIn) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button - Mobile */}
      {isMobile && !open && (
        <Fab
          className={classes.fab}
          onClick={handleToggle}
          aria-label="Open chat"
        >
          <Badge badgeContent={0} color="error">
            <ChatIcon />
          </Badge>
        </Fab>
      )}

      {/* Chat Drawer */}
      <Drawer
        className={classes.drawer}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="right"
        open={open}
        onClose={handleClose}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        <Box className={classes.drawerContent}>
          <Box className={classes.drawerHeader}>
            <Typography variant="h6">Chat</Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                size="small"
                onClick={() => setStatusEditorOpen(true)}
                className={classes.statusButton}
                aria-label="Update status"
              >
                <Typography variant="caption" style={{ marginRight: 4 }}>
                  Status
                </Typography>
              </IconButton>
              <IconButton
                onClick={handleClose}
                className={classes.statusButton}
                aria-label="Close chat"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <BuddyListPanel onSelectContact={handleSelectContact} />
        </Box>
      </Drawer>

      {/* Status Editor Dialog */}
      <StatusEditor
        open={statusEditorOpen}
        onClose={() => setStatusEditorOpen(false)}
        currentStatus="online"
        currentAwayMessage=""
      />
    </>
  );
};

export default ChatSidebar;
