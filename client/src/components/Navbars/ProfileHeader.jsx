import _ from 'lodash'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

//  MUI
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles, MuiThemeProvider as ThemeProvider } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ChatIcon from '@material-ui/icons/Chat'

//  Local
import { useQuery } from '@apollo/react-hooks'
import { Avatar } from '@material-ui/core'
import FollowButton from 'components/CustomButtons/FollowButton'
import { GET_CHAT_ROOM } from '../../graphql/query'
import { SELECTED_CHAT_ROOM, SET_CHAT_OPEN } from '../../store/chat'
import mainTheme from '../../themes/MainTheme'
import AvatarDisplay from '../Avatar'

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
}))

export default function ProfileHeader(props) {
  const classes = useStyles()
  const history = useHistory()
  const {
    profileUser,
  } = props
  const loggedInUserId = useSelector((state) => state.user.data._id)
  const dispatch = useDispatch()

  const {
    username,
    _id,
    _followingId,
    _followersId,
    avatar,
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
    dispatch(SELECTED_CHAT_ROOM({
      room,
      Text: room.title,
      type: 'USER',
      avatar: room.avatar,
    }))
    dispatch(SET_CHAT_OPEN(true))
  }
  return (
    <ThemeProvider theme={mainTheme}>
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
                  <Avatar className={classes.avatar}>
                    <AvatarDisplay height={75} width={75} {...avatar} />
                  </Avatar>
                </Grid>
                <Grid item>
                  <Typography variant="h6" noWrap>
                    {username}
                  </Typography>
                  <Typography
                    onClick={() => history.push(`/profile/${username}/followers`)}
                    variant="overline"
                    noWrap
                  >
                    <span className={classes.points}>
                      {`${_followersId ? _followersId.length : 0} Followers`}
                    </span>
                  </Typography>
                  <Typography
                    onClick={() => history.push(`/profile/${username}/following`)}
                    variant="overline"
                    noWrap
                  >
                    <span className={classes.points}>
                      {`${_followingId ? _followingId.length : 0} Following`}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {
              //  Are we viewing our own profile?
              //  If viewing another user, do we follow them already?
              sameUser ? (
                <Grid item xs={12} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push(`/profile/${username}/avatar`)}
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
              )
            }
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
