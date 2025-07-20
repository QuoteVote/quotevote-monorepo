import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

//  MUI
import {
  makeStyles,
  ThemeProvider as ThemeProvider,
} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import ChatIcon from '@mui/icons-material/Chat'
import { Tooltip } from '@mui/material'

//  Local
import FollowButton from 'components/CustomButtons/FollowButton'
import { Avatar } from '@mui/material'
import { useQuery } from '@apollo/react-hooks'
import mainTheme from '../../themes/MainTheme'
import AvatarDisplay from '../Avatar'
import { GET_CHAT_ROOM } from '../../graphql/query'
import { SELECTED_CHAT_ROOM, SET_CHAT_OPEN } from '../../store/chat'

const useStyles = makeStyles((theme) => ({
  button: {
    width: 130,
    margin: 5,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
    },
  },
  points: {
    marginRight: 10,
    fontSize: '14px',
    fontWeight: 500,
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    [theme.breakpoints.down('sm')]: {
      marginLeft: 15,
    },
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    backgroundColor: '#ea4c89', // green, or pick your brand color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    border: '2px solid #fff',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    objectFit: 'contain',
  },
  avatarWrapper: {
    position: 'relative',
    display: 'inline-block',
  },
}))

export default function ProfileHeader(props) {
  const classes = useStyles()
  const history = useHistory()
  const { profileUser } = props
  const loggedInUserId = useSelector((state) => state.user.data._id)
  const dispatch = useDispatch()

  const {
    username,
    _id,
    _followingId,
    _followersId,
    avatar,
    contributorBadge,
  } = profileUser

  const sameUser = profileUser._id === loggedInUserId

  const isFollowing = _.includes(_followersId, loggedInUserId)

  const { data, loading } = useQuery(GET_CHAT_ROOM, {
    variables: {
      otherUserId: profileUser._id,
    },
    fetchPolicy: 'network-only',
  })

  const room = !loading && data && data.messageRoom
  const handleMessageUser = async () => {
    dispatch(
      SELECTED_CHAT_ROOM({
        room,
        Text: room.title,
        type: 'USER',
        avatar: room.avatar,
      }),
    )
    dispatch(SET_CHAT_OPEN(true))
  }
  return (
    <ThemeProvider theme={mainTheme}>
      <Grid container direction="row" alignItems="center" justifyContent="flex-start" spacing={2}>
        <Grid item>
          <Avatar className={classes.avatar}>
            <AvatarDisplay height={75} width={75} {...avatar} />
          </Avatar>
        </Grid>
        <Grid item>
          <Typography variant="h6" noWrap>
            {username}
          </Typography>
          <Typography
            onClick={() => history.push(`/Profile/${username}/followers`)}
            variant="overline"
            noWrap
          >
            <span className={classes.points}>
              {`${_followersId ? _followersId.length : 0} Followers`}
            </span>
          </Typography>
          <Typography
            onClick={() => history.push(`/Profile/${username}/following`)}
            variant="overline"
            noWrap
          >
            <span className={classes.points}>
              {`${_followingId ? _followingId.length : 0} Following`}
            </span>
          </Typography>
        </Grid>
        {contributorBadge && (
          <Grid item style={{ marginLeft: 16, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Founders Badge" placement="top">
              <div className={classes.badgeCircle}>
                <img
                  src={process.env.PUBLIC_URL + '/assets/badge.png'}
                  alt="Contributor Badge"
                  className={classes.badgeIcon}
                />
              </div>
            </Tooltip>
          </Grid>
        )}
      </Grid>
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
        <Grid item>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={12} md={sameUser ? 8 : 6}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Grid item>
                      <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={2}>
                        <Grid item>
                          {//  Are we viewing our own profile?
                          //  If viewing another user, do we follow them already?
                          sameUser ? (
                            <Grid item xs={12} md={3}>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  history.push(`/Profile/${username}/avatar`)
                                }
                                className={classes.button}
                              >
                                Change Photo
                              </Button>
                            </Grid>
                          ) : (
                            <>
                              <Grid item xs={12} sm={3} md={3}>
                                <FollowButton
                                  isFollowing={isFollowing}
                                  profileUserId={_id}
                                  username={username}
                                  className={classes.button}
                                />
                              </Grid>
                              <Grid item xs={12} sm={3} md={3}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  size="medium"
                                  className={classes.button}
                                  startIcon={<ChatIcon />}
                                  onClick={handleMessageUser}
                                >
                                  Message
                                </Button>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

ProfileHeader.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
  profileUser: PropTypes.object.isRequired,
}
