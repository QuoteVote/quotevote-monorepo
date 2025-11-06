import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_PRESENCE } from '../../graphql/mutations';
import { SET_USER_STATUS } from '../../store/chat';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
  statusIcon: {
    marginRight: theme.spacing(1),
  },
  saveButton: {
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
    padding: theme.spacing(0.75, 2.5),
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(82, 178, 116, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #5fc085 0%, #52b274 100%)',
      boxShadow: '0 4px 12px rgba(82, 178, 116, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      background: theme.palette.grey[300],
      color: theme.palette.text.disabled,
      boxShadow: 'none',
      transform: 'none',
      opacity: 0.6,
    },
  },
}));

const StatusEditor = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentStatus = useSelector((state) => state.chat.userStatus);
  const currentMessage = useSelector((state) => state.chat.userStatusMessage);

  const [status, setStatus] = useState(currentStatus || 'online');
  const [statusMessage, setStatusMessage] = useState(currentMessage || '');
  const [updatePresence, { loading }] = useMutation(UPDATE_PRESENCE);

  const handleSave = async () => {
    try {
      await updatePresence({
        variables: {
          presence: { status, statusMessage },
        },
      });
      dispatch(SET_USER_STATUS({ status, statusMessage }));
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const statusOptions = [
    { value: 'online', label: '🟢 Online', icon: '🟢' },
    { value: 'away', label: '🟡 Away', icon: '🟡' },
    { value: 'dnd', label: '🔴 Do Not Disturb', icon: '🔴' },
    { value: 'invisible', label: '⚫ Invisible', icon: '⚫' },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Your Status</DialogTitle>
      <DialogContent>
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel>Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <span className={classes.statusIcon}>{option.icon}</span>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          label="Status Message"
          placeholder="What are you up to?"
          value={statusMessage}
          onChange={(e) => setStatusMessage(e.target.value)}
          inputProps={{ maxLength: 200 }}
          helperText={`${statusMessage.length}/200 characters`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className={classes.saveButton}
          variant="contained"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

StatusEditor.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StatusEditor;

