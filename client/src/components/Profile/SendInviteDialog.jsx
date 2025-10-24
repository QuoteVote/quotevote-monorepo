import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useMutation } from '@apollo/react-hooks';
import { SEND_USER_INVITE } from '@/graphql/mutations';

const SendInviteDialog = ({ open, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [sendInvite, { loading }] = useMutation(SEND_USER_INVITE, {
    onCompleted: (data) => {
      if (data.sendUserInvite.code === 'SUCCESS') {
        setSuccess('Invitation sent successfully!');
        setEmail('');
        if (onSuccess) onSuccess();
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        setError(data.sendUserInvite.message || 'Failed to send invitation');
      }
    },
    onError: (error) => {
      setError(error.message || 'Failed to send invitation');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await sendInvite({
        variables: { email },
      });
    } catch (err) {
      // Error handled in onError callback
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send User Invitation</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Invite someone to join Quote.Vote. Your reputation score may be affected by the quality of users you invite.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={!!error && !success}
          />

          <Box mt={2}>
            <Typography variant="caption" color="textSecondary">
              <strong>Note:</strong> Inviting high-quality users who contribute positively to the platform will improve your reputation score. Conversely, inviting users who receive reports or behave poorly may negatively impact your reputation.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !email}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SendInviteDialog;
