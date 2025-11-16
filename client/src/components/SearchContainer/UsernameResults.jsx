import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import AvatarDisplay from '../Avatar'

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 300,
    overflowY: 'auto',
    zIndex: 1000,
    marginTop: theme.spacing(1),
    boxShadow: theme.shadows[8],
  },
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  username: {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  name: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  noResults: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  badge: {
    marginLeft: theme.spacing(1),
    fontSize: '0.75rem',
    padding: theme.spacing(0.25, 0.5),
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: theme.shape.borderRadius,
  },
}))

export default function UsernameResults({
  users = [],
  loading = false,
  error = null,
  onUserSelect,
  query = '',
}) {
  const classes = useStyles()

  if (!loading && (!users || users.length === 0) && query.length > 0) {
    return (
      <Paper className={classes.container}>
        <Box className={classes.noResults}>
          <Typography variant="body2">
            No users found matching "@{query}"
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (loading) {
    return (
      <Paper className={classes.container}>
        <Box className={classes.loadingContainer}>
          <CircularProgress size={24} />
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            Searching users...
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper className={classes.container}>
        <Box className={classes.noResults}>
          <Typography variant="body2" color="error">
            Error searching users
          </Typography>
        </Box>
      </Paper>
    )
  }

  if (!users || users.length === 0) {
    return null
  }

  return (
    <Paper className={classes.container}>
      <List disablePadding>
        {users.map((user) => (
          <ListItem
            key={user._id}
            className={classes.listItem}
            onClick={() => onUserSelect(user)}
            button
          >
            <ListItemAvatar>
              <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Use AvatarDisplay (avataaars) which is how profiles render site-wide */}
                <AvatarDisplay height={40} width={40} {...(user.avatar || {})} />
              </div>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center">
                  <Typography className={classes.username}>
                    @{user.username}
                  </Typography>
                  {user.contributorBadge && (
                    <span className={classes.badge}>Contributor</span>
                  )}
                </Box>
              }
              secondary={
                <Typography className={classes.name}>{user.name}</Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
