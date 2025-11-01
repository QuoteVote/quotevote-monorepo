import React from 'react';
import { Box, Typography, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import RoomIcon from '@material-ui/icons/Room';

const useStyles = makeStyles((theme) => ({
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  chip: {
    borderRadius: 16,
    height: 24,
    '& .MuiChip-icon': {
      marginLeft: 8,
      marginRight: -4,
    },
    '& .MuiChip-label': {
      paddingLeft: 8,
      paddingRight: 8,
      fontSize: '0.8125rem',
    },
  },
  locationIcon: {
    fontSize: 16,
    color: theme.palette.primary.main,
  },
  distanceText: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.5),
  },
  inline: {
    display: 'inline-flex',
    alignItems: 'center',
  },
}));

const LocationBadge = ({ placeLabel, distance, variant = 'default', size = 'medium' }) => {
  const classes = useStyles();

  if (!placeLabel) {
    return null;
  }

  // Format distance
  const formattedDistance = distance
    ? distance < 1
      ? `${Math.round(distance * 1000)}m away`
      : `${distance.toFixed(1)}km away`
    : null;

  if (variant === 'chip') {
    return (
      <Chip
        icon={<RoomIcon />}
        label={
          <Box className={classes.inline}>
            {placeLabel}
            {formattedDistance && (
              <Typography className={classes.distanceText}>
                • {formattedDistance}
              </Typography>
            )}
          </Box>
        }
        size={size}
        variant="outlined"
        className={classes.chip}
      />
    );
  }

  return (
    <Box className={classes.badge}>
      <LocationOnIcon className={classes.locationIcon} />
      <Typography variant="body2" component="span" color="textSecondary">
        {placeLabel}
      </Typography>
      {formattedDistance && (
        <Typography variant="caption" component="span" className={classes.distanceText}>
          • {formattedDistance}
        </Typography>
      )}
    </Box>
  );
};

export default LocationBadge;
