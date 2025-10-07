import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import CloseIcon from '@material-ui/icons/Close';
import LockIcon from '@material-ui/icons/Lock';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: 12,
      padding: theme.spacing(2),
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
  locationIcon: {
    fontSize: 60,
    color: theme.palette.primary.main,
  },
  content: {
    textAlign: 'center',
  },
  privacyBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.grey[100],
    borderRadius: 8,
    padding: theme.spacing(1.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  lockIcon: {
    fontSize: 18,
    marginRight: theme.spacing(1),
    color: theme.palette.success.main,
  },
  privacyText: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  actions: {
    padding: theme.spacing(2),
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  allowButton: {
    minWidth: 120,
  },
  denyButton: {
    minWidth: 120,
  },
}));

const LocationPermissionDialog = ({ open, onAllow, onDeny, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className={classes.dialog}
    >
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle disableTypography>
        <div className={classes.iconContainer}>
          <LocationOnIcon className={classes.locationIcon} />
        </div>
        <Typography variant="h5" align="center" gutterBottom>
          Enable Location Access
        </Typography>
      </DialogTitle>

      <DialogContent className={classes.content}>
        <Typography variant="body1" color="textSecondary" paragraph>
          Share your location to post and discover quotes from your area.
        </Typography>

        <Box className={classes.privacyBox}>
          <LockIcon className={classes.lockIcon} />
          <Typography className={classes.privacyText}>
            <strong>Privacy Protected:</strong> We only store your approximate location
            (city/neighborhood level). Your exact address is never saved.
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary">
          You can change this permission anytime in your browser settings.
        </Typography>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button
          onClick={onDeny}
          color="default"
          variant="outlined"
          className={classes.denyButton}
        >
          Not Now
        </Button>
        <Button
          onClick={onAllow}
          color="primary"
          variant="contained"
          className={classes.allowButton}
          autoFocus
        >
          Allow
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationPermissionDialog;
