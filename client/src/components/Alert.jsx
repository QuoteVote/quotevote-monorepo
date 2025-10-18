import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: (props) => props.color,
    minHeight: '75px',
    display: 'flex',
    color: 'white',
    borderRadius: 7,
    padding: 10,
  },
  [theme.breakpoints.down('sm')]: {
    avatarStyle: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
  [theme.breakpoints.up('md')]: {
    avatarStyle: {
      width: theme.spacing(5),
      height: theme.spacing(5),
    },
  },
  [theme.breakpoints.up('lg')]: {
    avatarStyle: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  },
  titleWrapper: {
    marginLeft: 10,
  },
  favoriteIcon: {
    color: 'white',
    height: '55px',
  },
  closeIcon: {
    color: 'white',
    height: '15px',
  },
}))

export default function Alert(props) {
  const classes = useStyles(props)
  const {
    AlertTitle, AlertBody, creator, time,
  } = props

  return (
    <Box boxShadow={3} className={classes.root}>
      <Grid container direction="row">
        <Grid className={classes.titleWrapper} item xs={10}>
          <Typography variant="overline">
            {`${AlertTitle} - ${AlertBody}`}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          <CloseIcon className={classes.closeIcon} />
        </Grid>

        <Grid
          item
          alignItems="center"
          container
          direction="row"
          xs={12}
        >
          <Grid item xs={3}>
            <Avatar alt={creator.name} src={creator.profileImageUrl} className={classes.avatarStyle} />
          </Grid>
          <Grid
            container
            direction="column"
            alignItems="center"
            item
            xs={8}
          >
            <Grid item>
              <Typography variant="subtitle2">
                {creator.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="overline">
                {time}
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <FavoriteBorderIcon className={classes.favoriteIcon} />
          </Grid>
        </Grid>

      </Grid>
    </Box>
  )
}

Alert.propTypes = {
  AlertTitle: PropTypes.string.isRequired,
  creator: PropTypes.object.isRequired,
  time: PropTypes.string.isRequired,
  AlertBody: PropTypes.string.isRequired,
}
