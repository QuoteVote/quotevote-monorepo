import React from 'react'
import { Grid } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import PropTypes from 'prop-types'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import LaunchIcon from '@material-ui/icons/Launch'
import { useHistory } from 'react-router-dom'
import NotificationLists from './NotificationLists'
import { useMobileDetection } from '../../utils/display'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 10,
    paddingRight: (props) => (props.pageView ? 30 : 0),
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
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
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}))

function Notification({
  loading, notifications, spacing = 0, pageView, setOpenPopUp,
}) {
  const isMobileDevice = useMobileDetection()
  const classes = useStyles({ pageView })
  const history = useHistory()
  const handleClick = () => {
    setOpenPopUp(false)
    history.push('/Notifications')
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
        {!isMobileDevice && <Typography variant="h5">Notifications</Typography>}
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
            {Array.from(Array(3).keys()).map((index) => (
              <ListItem key={`skeleton-${index}`}>
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
