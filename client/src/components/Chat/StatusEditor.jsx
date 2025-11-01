import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box
} from '@material-ui/core';
import { SET_PRESENCE } from '../../graphql/presence';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  statusPreview: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.spacing(1),
  },
}));

/**
 * StatusEditor component for setting user presence status and away messages
 */
function StatusEditor({ open, onClose, currentStatus, currentText }) {
  const classes = useStyles();
  const [status, setStatus] = useState(currentStatus || 'online');
  const [text, setText] = useState(currentText || '');
  const [setPresence] = useMutation(SET_PRESENCE);

  const handleSave = async () => {
    try {
      await setPresence({
        variables: {
          status,
          text: text || null,
        },
      });
      onClose();
    } catch (error) {
      console.error('Error setting presence:', error);
    }
  };

  const handleClear = async () => {
    try {
      await setPresence({
        variables: {
          status: 'online',
          text: null,
        },
      });
      setStatus('online');
      setText('');
      onClose();
    } catch (error) {
      console.error('Error clearing presence:', error);
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'online':
        return '#4caf50';
      case 'away':
        return '#ff9800';
      case 'dnd':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Status</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Set your presence status and optional away message.
        </DialogContentText>
        
        <FormControl className={classes.formControl} fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="online">
              <Box display="flex" alignItems="center">
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  bgcolor={getStatusColor('online')}
                  marginRight={1}
                />
                Online
              </Box>
            </MenuItem>
            <MenuItem value="away">
              <Box display="flex" alignItems="center">
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  bgcolor={getStatusColor('away')}
                  marginRight={1}
                />
                Away
              </Box>
            </MenuItem>
            <MenuItem value="dnd">
              <Box display="flex" alignItems="center">
                <Box
                  width={12}
                  height={12}
                  borderRadius="50%"
                  bgcolor={getStatusColor('dnd')}
                  marginRight={1}
                />
                Do Not Disturb
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          autoFocus
          margin="dense"
          label="Away Message (Optional)"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g., Out for lunch, In meeting"
        />
        
        <Box className={classes.statusPreview}>
          <Typography variant="subtitle2">Status Preview:</Typography>
          <Box display="flex" alignItems="center" mt={1}>
            <Box
              width={12}
              height={12}
              borderRadius="50%"
              bgcolor={getStatusColor(status)}
              marginRight={1}
            />
            <Typography>
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {text && ` - ${text}`}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear} color="secondary">
          Clear Status
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default StatusEditor;