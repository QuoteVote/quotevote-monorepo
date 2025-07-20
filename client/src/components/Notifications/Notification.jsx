import React from 'react'
import { Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/material/styles'
import { Skeleton } from '@mui/lab'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import PropTypes from 'prop-types'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LaunchIcon from '@mui/icons-material/Launch'
import { useHistory } from 'react-router-dom'
import NotificationLists from './NotificationLists'
import { useMobileDetection } from '../../utils/display'

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
