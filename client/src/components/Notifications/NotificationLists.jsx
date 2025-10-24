import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import {
  Avatar,
  Badge,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from '@mui/material'
import { withStyles, makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import moment from 'moment'
import stringLimit from 'string-limit'
import { DELETE_NOTIFICATION } from '../../graphql/mutations'
import { GET_NOTIFICATIONS } from '../../graphql/query'
import DisplayAvatar from '../Avatar'
import { SET_SELECTED_POST } from '../../store/ui'
import { tokenValidator } from 'store/user'
import useGuestGuard from '../../utils/useGuestGuard'

const NotificationBadge = withStyles(() => ({
  badge: {
    right: 15,
  },
}))(Badge)

const useStyles = makeStyles((theme) => ({
  root: {
    width: (props) => (props.pageView ? '100%' : 350),
    backgroundColor: theme.palette.background.paper,
    height: '75vh',
    position: 'relative',
    overflow: 'auto',
  },
  rootMin: {
    width: (props) => (props.pageView ? '100%' : 350),
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
  },
  rootNoNotification: {
    width: 'inherit',
    height: (props) => (props.pageView ? '100%' : '30vh'),
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  close: {
    position: 'absolute',
    top: 20,
  },
  listItem: {
    paddingTop: 10,
  },
}))

const getBadgeIcon = (notificationType) => {
  switch (notificationType) {
    case 'FOLLOW':
      return '/assets/PlusSign.svg'
    case 'UPVOTED':
      return '/assets/UpVoteBadge.png'
    case 'DOWNVOTED':
      return '/assets/DownVoteBadge.png'
    case 'COMMENTED':
      return '/assets/CommentBadge.png'
    case 'QUOTED':
      return '/assets/QouteBadge.png'
    default:
      return ''
  }
}

function NotificationLists({ notifications, pageView }) {
  const classes = useStyles({ pageView })
  const client = useApolloClient()
  const dispatch = useDispatch()
  const history = useHistory()
  const ensureAuth = useGuestGuard()

  const [removeNotification] = useMutation(DELETE_NOTIFICATION)

  const handleDelete = async (notificationId) => {
    if (!ensureAuth()) return
    const newNotifications = notifications.filter((notification) => notification._id !== notificationId)

    client.writeQuery({
      query: GET_NOTIFICATIONS,
      data: { notifications: newNotifications },
    })

    await removeNotification({
      variables: {
        notificationId,
      },
      refetchQueries: [{
        query: GET_NOTIFICATIONS,
      }],
    })
  }

  const handleNotificationClick = (notificationType, userBy, post) => {
    if (notificationType === 'FOLLOW') {
      history.push(`/Profile/${userBy.username}`)
    } else {
      // Check if user is in guest mode (no valid token)
      if (!tokenValidator(dispatch)) {
        // Redirect to search page for guest users
        history.push('/search')
        return
      }
      
      // For authenticated users, proceed with normal post navigation
      dispatch(SET_SELECTED_POST(post._id))
      history.push(post.url.replace(/\?/g, ''))
    }
  }

  if (!notifications || !notifications.length) {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.rootNoNotification}
      >
        <Grid item>
          <img src="/assets/ZeroNotificationsBG.png" alt="" />
        </Grid>
        <Grid item>
          <Typography
            component="span"
            variant="body2"
          >
            Relax, you don't have any alerts right now.
          </Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <List className={notifications.length < 5 ? classes.rootMin : classes.root}>
      {notifications.map(({
        notificationType, label, created, userBy, _id, post,
      }) => (
        <>
          <ListItem
            button
            alignItems="flex-start"
            onClick={() => handleNotificationClick(notificationType, userBy, post)}
          >
            <ListItemAvatar>
              <NotificationBadge
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                badgeContent={<img src={getBadgeIcon(notificationType)} alt="Commented" />}
              >
                <IconButton
                  size="small"
                >
                  <Avatar alt={userBy.name}>
                    <DisplayAvatar height={75} width={75} {...userBy.avatar} />
                  </Avatar>
                </IconButton>
              </NotificationBadge>
            </ListItemAvatar>
            <ListItemText
              primary={(
                <>
                  <b>
                    {notificationType}
                    .
                  </b>
                  {' '}
                  {`"${stringLimit(label, pageView ? 1000 : 50)}"`}
                </>
              )}
              secondary={(
                <>
                  {moment(created).calendar(null, {
                    sameDay: '[Today]',
                    nextDay: '[Tomorrow]',
                    nextWeek: 'dddd',
                    lastDay: '[Yesterday]',
                    lastWeek: '[Last] dddd',
                    sameElse: 'MMM DD, YYYY',
                  })}
                  {` @ ${moment(created).format('h:mm A')}`}
                </>
              )}
            />
            <ListItemSecondaryAction className={classes.close}>
              <IconButton
                size="small"
                onClick={() => {
                  handleDelete(_id)
                }}
              >
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </>
      ))}
    </List>
  );
}

NotificationLists.propTypes = {
  notifications: PropTypes.array.isRequired,
  pageView: PropTypes.bool,
}
export default NotificationLists
