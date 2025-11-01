import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Zoom } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import StarIcon from '@material-ui/icons/Star'
import EmojiEventsIcon from '@material-ui/icons/EmojiEvents'
import SecurityIcon from '@material-ui/icons/Security'

const useStyles = makeStyles((theme) => ({
  badgeContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      marginTop: theme.spacing(1),
      justifyContent: 'center',
    },
  },
  badge: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: (props) => props.backgroundColor || '#ea4c89',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    border: '2px solid #fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    },
    '&:focus': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: '2px',
    },
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
    },
  },
  badgeIcon: {
    width: 28,
    height: 28,
    objectFit: 'contain',
    [theme.breakpoints.down('sm')]: {
      width: 24,
      height: 24,
    },
  },
  materialIcon: {
    fontSize: 28,
    color: '#fff',
    [theme.breakpoints.down('sm')]: {
      fontSize: 24,
    },
  },
  tooltip: {
    fontSize: '0.875rem',
    padding: theme.spacing(1, 1.5),
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
  },
  tooltipArrow: {
    color: 'rgba(0, 0, 0, 0.87)',
  },
}))

// Badge type configurations
const BADGE_CONFIGS = {
  contributor: {
    label: 'Founder Badge',
    description: 'Early contributor and supporter of Quote.Vote',
    backgroundColor: '#ea4c89',
    icon: 'custom', // Uses custom image
  },
  verified: {
    label: 'Verified User',
    description: 'Verified member of the Quote.Vote community',
    backgroundColor: '#1DA1F2',
    icon: VerifiedUserIcon,
  },
  moderator: {
    label: 'Moderator',
    description: 'Community moderator helping maintain quality discussions',
    backgroundColor: '#7C3AED',
    icon: SecurityIcon,
  },
  topContributor: {
    label: 'Top Contributor',
    description: 'Recognized for exceptional contributions to the community',
    backgroundColor: '#F59E0B',
    icon: EmojiEventsIcon,
  },
  earlyAdopter: {
    label: 'Early Adopter',
    description: 'Joined Quote.Vote in its early days',
    backgroundColor: '#10B981',
    icon: StarIcon,
  },
}

function ProfileBadge({ type, customIcon, customLabel, customDescription }) {
  const config = BADGE_CONFIGS[type] || {}
  const backgroundColor = config.backgroundColor
  const classes = useStyles({ backgroundColor })

  const label = customLabel || config.label || 'Badge'
  const description = customDescription || config.description || ''
  const IconComponent = config.icon

  const renderBadgeContent = () => {
    // Custom image badge (like contributor badge)
    if (type === 'contributor' || customIcon) {
      return (
        <img
          src={customIcon || `${process.env.PUBLIC_URL}/assets/badge.png`}
          alt={label}
          className={classes.badgeIcon}
        />
      )
    }

    // Material-UI icon badge
    if (IconComponent && IconComponent !== 'custom') {
      return <IconComponent className={classes.materialIcon} />
    }

    // Fallback to star icon
    return <StarIcon className={classes.materialIcon} />
  }

  return (
    <Tooltip
      title={
        <div>
          <strong>{label}</strong>
          {description && (
            <>
              <br />
              {description}
            </>
          )}
        </div>
      }
      placement="top"
      arrow
      TransitionComponent={Zoom}
      classes={{
        tooltip: classes.tooltip,
        arrow: classes.tooltipArrow,
      }}
      enterDelay={200}
      leaveDelay={100}
    >
      <div
        className={classes.badge}
        role="img"
        aria-label={`${label}: ${description}`}
        tabIndex={0}
      >
        {renderBadgeContent()}
      </div>
    </Tooltip>
  )
}

ProfileBadge.propTypes = {
  type: PropTypes.oneOf([
    'contributor',
    'verified',
    'moderator',
    'topContributor',
    'earlyAdopter',
  ]).isRequired,
  customIcon: PropTypes.string,
  customLabel: PropTypes.string,
  customDescription: PropTypes.string,
}

// Container component for multiple badges
export function ProfileBadgeContainer({ children }) {
  const classes = useStyles({})

  return (
    <div className={classes.badgeContainer} role="list" aria-label="User badges">
      {children}
    </div>
  )
}

ProfileBadgeContainer.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProfileBadge
