import { Grid } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import LaunchIcon from '@material-ui/icons/Launch'
import { Skeleton } from '@material-ui/lab'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import NotificationLists from './NotificationLists'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    paddingRight: (props) => (props.pageView ? 30 : 0),
    backgroundColor: theme.palette.background.paper,
  },
  skeleton: {
    width: (props) => (props.pageView ? 'auto' : 350),
  },
  content: {
    width: 'inherit',
  },
  moreMenu: {
    position: 'absolute',
    top: 20,
    right: 5,
  },
}))

function Notification({
  loading, notifications, spacing = 0, pageView, setOpenPopUp,
}) {
  const classes = useStyles({ pageView })
  const history = useHistory()
  const handleClick = () => {
    setOpenPopUp(false)
    history.push('/notifications')
  }

  return (
    <Grid
      container
      direction="column"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.root}
      spacing={spacing}
    >
      <Grid item>
        <Typography variant="h5">Notifications</Typography>
        <Divider />
        {!pageView && (
          <Tooltip
            title="Open Notifications"
            arrow
            placement="top"
          >
            <IconButton className={classes.moreMenu} size="small" onClick={handleClick}>
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
      <Grid item className={classes.content}>
        {loading && (
          <List className={classes.skeleton}>
            {Array.from(Array(3).keys()).map(() => (
              <ListItem>
                <ListItemAvatar>
                  <Skeleton animation="wave" variant="circle" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText primary={<Skeleton animation="wave" height={10} width={pageView ? 400 : 45} style={{ marginBottom: 6 }} />} />
              </ListItem>
            ))}
          </List>
        )}
        {!loading && (
          <NotificationLists notifications={notifications} pageView={pageView} />
        )}
      </Grid>

    </Grid>
  )
}

Notification.propTypes = {
  loading: PropTypes.bool.isRequired,
  notifications: PropTypes.array.isRequired,
  spacing: PropTypes.number,
  pageView: PropTypes.bool,
  setOpenPopUp: PropTypes.func,
}

export default Notification
