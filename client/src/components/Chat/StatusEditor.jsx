import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { UPDATE_PRESENCE } from '../../graphql/mutations';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  statusOption: {
    display: 'flex',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    marginRight: theme.spacing(1),
  },
}));

const statusOptions = [
  { value: 'online', label: 'Online', color: '#4caf50' },
  { value: 'away', label: 'Away', color: '#ff9800' },
  { value: 'dnd', label: 'Do Not Disturb', color: '#f44336' },
  { value: 'invisible', label: 'Invisible', color: '#9e9e9e' },
  { value: 'offline', label: 'Offline', color: '#9e9e9e' },
];

const StatusEditor = ({ open, onClose, currentStatus, currentAwayMessage }) => {
  const classes = useStyles();
  const [status, setStatus] = useState(currentStatus || 'online');
  const [awayMessage, setAwayMessage] = useState(currentAwayMessage || '');

  const [updatePresence, { loading }] = useMutation(UPDATE_PRESENCE, {
    onCompleted: () => {
      onClose();
    },
    onError: (error) => {
      console.error('Error updating presence:', error);
    },
  });

  const handleSave = () => {
    updatePresence({
      variables: {
        presence: {
          status,
          awayMessage: awayMessage.trim(),
        },
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <FormControl className={classes.formControl}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box className={classes.statusOption}>
                    <Box
                      className={classes.statusDot}
                      style={{ backgroundColor: option.color }}
                    />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box mb={2}>
          <TextField
            label="Away Message (Optional)"
            fullWidth
            multiline
            rows={3}
            value={awayMessage}
            onChange={(e) => setAwayMessage(e.target.value)}
            placeholder="e.g., Out for lunch, In a meeting, etc."
            inputProps={{ maxLength: 200 }}
            helperText={`${awayMessage.length}/200 characters`}
          />
        </Box>

        <Typography variant="caption" color="textSecondary">
          Your status and away message will be visible to your contacts.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusEditor;
