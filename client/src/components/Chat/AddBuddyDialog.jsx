import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { useQuery } from '@apollo/client'
import { useDispatch } from 'react-redux'
import { SEARCH_USERNAMES } from '../../graphql/query'
import AvatarDisplay from '../Avatar'
import { useRosterManagement } from '../../hooks/useRosterManagement'
import { SET_SNACKBAR } from '../../store/ui'

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: theme.spacing(2),
  },
  userList: {
    maxHeight: 400,
    overflow: 'auto',
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  addButton: {
    marginLeft: 'auto',
  },
}))

const AddBuddyDialog = ({ open, onClose }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [searchQuery, setSearchQuery] = useState('')
  const { addBuddy } = useRosterManagement()
  const [addingUserId, setAddingUserId] = useState(null)

  const { data, loading } = useQuery(SEARCH_USERNAMES, {
    variables: { query: searchQuery },
    skip: !searchQuery || searchQuery.length < 2,
  })

  const handleAddBuddy = async (userId) => {
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
      // Optionally close dialog after successful request
      // onClose();
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Buddy</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Search by name or username"
          placeholder="Type at least 2 characters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={classes.searchField}
        />

        {loading && (
          <div className={classes.noResults}>
            <CircularProgress size={40} />
          </div>
        )}

        {!loading && searchQuery.length >= 2 && users.length === 0 && (
          <Typography className={classes.noResults}>
            No users found matching "{searchQuery}"
          </Typography>
        )}

        {!loading && users.length > 0 && (
          <List className={classes.userList}>
            {users.map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <AvatarDisplay user={user} size={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name || user.username}
                  secondary={`@${user.username}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleAddBuddy(user._id)}
                  disabled={addingUserId === user._id}
                  className={classes.addButton}
                >
                  {addingUserId === user._id ? 'Adding...' : 'Add'}
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        {searchQuery.length > 0 && searchQuery.length < 2 && (
          <Typography className={classes.noResults}>
            Type at least 2 characters to search...
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

AddBuddyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default AddBuddyDialog
