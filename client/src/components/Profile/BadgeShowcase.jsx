import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper, Grid } from '@material-ui/core'
import ProfileBadge from './ProfileBadge'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  badgeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
      gap: theme.spacing(1.5),
    },
  },
  badgeItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  badgeLabel: {
    fontSize: '0.75rem',
    fontWeight: 500,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    lineHeight: 1.2,
  },
  emptyState: {
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

// Badge type to label mapping
const BADGE_LABELS = {
  contributor: 'Founder',
  verified: 'Verified',
  moderator: 'Moderator',
  topContributor: 'Top Contributor',
  earlyAdopter: 'Early Adopter',
}

function BadgeShowcase({ badges, title = 'Achievements' }) {
  const classes = useStyles()

  if (!badges || badges.length === 0) {
    return (
      <Paper className={classes.root} elevation={1}>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <div className={classes.emptyState}>
          <Typography variant="body2">
            No badges earned yet. Keep contributing to earn achievements!
          </Typography>
        </div>
      </Paper>
    )
  }

  return (
    <Paper className={classes.root} elevation={1}>
      <Typography variant="h6" className={classes.title}>
        {title} ({badges.length})
      </Typography>
      <div className={classes.badgeGrid}>
        {badges.map((badge, index) => (
          <div key={`${badge.type}-${index}`} className={classes.badgeItem}>
            <ProfileBadge
              type={badge.type}
              customLabel={badge.customLabel}
              customDescription={badge.customDescription}
              customIcon={badge.customIcon}
            />
            <Typography variant="caption" className={classes.badgeLabel}>
              {badge.customLabel || BADGE_LABELS[badge.type] || badge.type}
            </Typography>
          </div>
        ))}
      </div>
    </Paper>
  )
}

BadgeShowcase.propTypes = {
  badges: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      customLabel: PropTypes.string,
      customDescription: PropTypes.string,
      customIcon: PropTypes.string,
    })
  ),
  title: PropTypes.string,
}

export default BadgeShowcase
