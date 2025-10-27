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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useMutation } from '@apollo/react-hooks';
import { REPORT_USER } from '@/graphql/mutations';

const ReportUserDialog = ({ open, onClose, reportedUser }) => {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [reportUser, { loading }] = useMutation(REPORT_USER, {
    onCompleted: (data) => {
      if (data.reportUser.code === 'SUCCESS') {
        setSuccess('User report submitted successfully!');
        setTimeout(() => {
          onClose();
          setSuccess('');
        }, 2000);
      } else {
        setError(data.reportUser.message || 'Failed to submit report');
      }
    },
    onError: (error) => {
      setError(error.message || 'Failed to submit report');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!reason) {
      setError('Please select a reason for the report');
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description of the issue');
      return;
    }

    try {
      await reportUser({
        variables: {
          reportUserInput: {
            _reportedUserId: reportedUser._id,
            reason,
            description: description.trim(),
            severity,
          },
        },
      });
    } catch (err) {
      // Error handled in onError callback
    }
  };

  const handleClose = () => {
    setReason('');
    setDescription('');
    setSeverity('medium');
    setError('');
    setSuccess('');
    onClose();
  };

  const reportReasons = [
    { value: 'spam', label: 'Spam' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'fake_account', label: 'Fake Account' },
    { value: 'other', label: 'Other' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report User</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Reporting user: <strong>{reportedUser?.username || reportedUser?.name}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please provide details about why you're reporting this user. False reports may affect your own reputation.
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

          <FormControl fullWidth margin="dense" required>
            <InputLabel>Reason for Report</InputLabel>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            >
              {reportReasons.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Severity Level</InputLabel>
            <Select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              disabled={loading}
            >
              {severityLevels.map((level) => (
                <MenuItem key={level.value} value={level.value}>
                  {level.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            required
            placeholder="Please provide specific details about the issue..."
            error={!!error && !success}
          />

          <Box mt={2}>
            <Typography variant="caption" color="textSecondary">
              <strong>Important:</strong> False or malicious reports may negatively impact your reputation score. Please only report users for legitimate violations of community guidelines.
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
            color="error"
            disabled={loading || !reason || !description.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ReportUserDialog;
