import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'

import Popover from '@material-ui/core/Popover'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import LinearProgress from '@material-ui/core/LinearProgress'

import { GET_USERS } from '@/graphql/query'

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    maxHeight: 240,
  },
  paper: {
    padding: theme.spacing(1),
    overflow: 'hidden',
    marginTop: theme.spacing(1), // Add margin to separate from button
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}))

const MAX_DISPLAY = 5;
const ApproveRejectPopover = (props) => {
  const classes = useStyles()
  // Get admin status from user state
  const { admin } = useSelector((state) => state.user.data || {})
  
  // Query to get user details (admin only - skip for non-admin users)
  const { loading, data, error } = useQuery(GET_USERS, {
    skip: !admin, // Only query if user is admin
    errorPolicy: 'all', // Don't throw error, handle gracefully
  })
  const {
    anchorEl,
    handlePopoverClose,
    type,
    approvedBy = [],
    rejectedBy = [],
    onViewAll,
  } = props
  const typeArray = type === 'approved' ? approvedBy : type === 'rejected' ? rejectedBy : []
  const safeTypeArray = Array.isArray(typeArray) ? typeArray : []
  const typeLabel = type === 'approved' ? 'approved' : type === 'rejected' ? 'rejected' : '';
  let userList = []
  if (data && data.users) {
    userList = data.users.filter((user) => safeTypeArray.includes(user._id))
  }
  const displayList = userList.slice(0, MAX_DISPLAY)
  
  // If user is not admin, show limited info
  if (!admin) {
    return (
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem>
            <ListItemText 
              primary={`${safeTypeArray.length} user(s) ${typeLabel} this post.`}
              secondary="Admin access required to view user details."
            />
          </ListItem>
        </List>
      </Popover>
    )
  }
  
  // If there's an error, show error message
  if (error) {
    return (
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItem>
            <ListItemText primary="Unable to load user details." />
          </ListItem>
        </List>
      </Popover>
    )
  }
  const renderListItems = () => {
    if (displayList.length > 0) {
      return displayList.map((user) => (
        <ListItem button className={classes.nested} key={user._id}>
          {user.avatar && <img src={user.avatar} alt={user.username} style={{ width: 24, height: 24, borderRadius: '50%', marginRight: 8 }} />}
          <ListItemText primary={`@${user.username}`} secondary={user.name} />
        </ListItem>
      ))
    }

    return (
      <ListItem className={classes.nested}>
        <ListItemText primary={`No users ${typeLabel} this post.`} />
      </ListItem>
    )
  }

  return (
    <Popover
      id="mouse-over-popover"
      className={classes.popover}
      classes={{
        paper: classes.paper,
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <ListItem>
          <ListItemText primary={`Users who ${typeLabel} this post:`} />
        </ListItem>
        <Collapse in timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.root}>
            {loading ? <LinearProgress /> : renderListItems()}
            {userList.length > MAX_DISPLAY && (
              <ListItem button onClick={onViewAll} className={classes.nested}>
                <ListItemText primary="View All" />
              </ListItem>
            )}
          </List>
        </Collapse>
      </List>
    </Popover>
  )
}

ApproveRejectPopover.propTypes = {
  anchorEl: PropTypes.object,
  handlePopoverClose: PropTypes.func,
  type: PropTypes.string,
  approvedBy: PropTypes.array,
  rejectedBy: PropTypes.array,
  onViewAll: PropTypes.func,
}

export default ApproveRejectPopover
