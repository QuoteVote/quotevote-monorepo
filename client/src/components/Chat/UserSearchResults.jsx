import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Typography,
  CircularProgress,
  Avatar,
} from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { SEARCH_USERNAMES } from '../../graphql/query'
import AvatarDisplay from '../Avatar'
import { useRosterManagement } from '../../hooks/useRosterManagement'
import { useDispatch } from 'react-redux'
import { SET_SNACKBAR } from '../../store/ui'
import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1, 0),
    '&::-webkit-scrollbar': {
      width: 8,
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.grey[300],
      borderRadius: 4,
      '&:hover': {
        background: theme.palette.grey[400],
      },
    },
  },
  listItem: {
    padding: theme.spacing(1.5, 2),
    margin: theme.spacing(0.5, 2),
    borderRadius: 16,
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#f8fafc',
      boxShadow:
        '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
      transform: 'translateX(2px)',
    },
  },
  avatar: {
    width: 48,
    height: 48,
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
    border: `3px solid ${theme.palette.background.paper}`,
  },
  addButton: {
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    color: 'white',
    borderRadius: 12,
    padding: theme.spacing(0.75, 2),
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 2px 8px rgba(82, 178, 116, 0.3)',
    transition: 'all 0.2s ease',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(82, 178, 116, 0.4)',
      transform: 'translateY(-1px)',
    },
    '&:disabled': {
      opacity: 0.6,
      transform: 'none',
    },
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(8, 3),
    color: theme.palette.text.secondary,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  username: {
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.25),
  },
  name: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}))

const UserSearchResults = ({ searchQuery }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.user?.data)
  const { addBuddy } = useRosterManagement()
  const [addingUserId, setAddingUserId] = useState(null)

  const { data, loading } = useQuery(SEARCH_USERNAMES, {
    variables: { query: searchQuery },
    skip: !searchQuery || searchQuery.length < 2,
  })

  const handleAddBuddy = async (userId) => {
    if (!currentUser || userId === currentUser._id) return

    try {
      setAddingUserId(userId)
      await addBuddy(userId)
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Buddy request sent successfully!',
          type: 'success',
        }),
      )
    } catch (error) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: error.message || 'Failed to send buddy request',
          type: 'danger',
        }),
      )
    } finally {
      setAddingUserId(null)
    }
  }

  const users = data?.searchUser || []

  // Filter out current user
  const filteredUsers = users.filter((user) => user._id !== currentUser?._id)

  if (!searchQuery || searchQuery.length < 2) {
    return (
      <div className={classes.emptyState}>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Type at least 2 characters to search for users...
        </Typography>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size={40} />
      </div>
    )
  }

  if (filteredUsers.length === 0) {
    return (
      <div className={classes.emptyState}>
        <Typography variant="h6" style={{ fontWeight: 600, marginBottom: 8 }}>
          No users found
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          No users found matching "{searchQuery}"
        </Typography>
      </div>
    )
  }

  return (
    <List className={classes.root}>
      {filteredUsers.map((user) => (
        <ListItem key={user._id} className={classes.listItem}>
          <ListItemAvatar>
            <Avatar className={classes.avatar}>
              <AvatarDisplay user={user} size={48} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography className={classes.name}>
                {user.name || user.username}
              </Typography>
            }
            secondary={
              <Typography className={classes.username}>
                @{user.username}
              </Typography>
            }
          />
          <Button
            variant="contained"
            onClick={() => handleAddBuddy(user._id)}
            disabled={addingUserId === user._id}
            className={classes.addButton}
          >
            {addingUserId === user._id ? 'Adding...' : 'Add Buddy'}
          </Button>
        </ListItem>
      ))}
    </List>
  )
}

UserSearchResults.propTypes = {
  searchQuery: PropTypes.string.isRequired,
}

export default UserSearchResults
