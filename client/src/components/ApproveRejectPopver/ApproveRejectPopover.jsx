import PropTypes from 'prop-types'

import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'

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
  const { loading, data } = useQuery(GET_USERS)
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
  if (data) {
    userList = data.users.filter((user) => safeTypeArray.includes(user._id))
  }
  const displayList = userList.slice(0, MAX_DISPLAY)
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
