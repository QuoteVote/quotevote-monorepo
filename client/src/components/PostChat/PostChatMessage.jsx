import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
    Grid, Paper, Typography, Avatar,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { GET_MESSAGE_REACTIONS } from '../../graphql/query'
import AvatarDisplay from '../Avatar'
import PostChatReactions from './PostChatReactions'

const useStyles = makeStyles(() => ({
  avatar: {
    marginLeft: 'auto',
    marginRight: 'auto',
    height: '50px',
    width: '50px',
    cursor: 'pointer',
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 16,
    letterSpacing: 0.5,
    lineHeight: 1.43,
  },
  bubble: {
    position: 'relative',
    background: '#ffffff',
    minHeight: 30,
    borderRadius: '6px',
    padding: '14px 14px 0px 14px',
    '&::after': {
      content: "''",
      position: 'absolute',
      border: '10px solid transparent',
      borderTop: '10px solid #ffffff',
      top: '0px',
      left: '-10px',
    },
    color: '#474646',
  },
  bubbleReverse: {
    position: 'relative',
    background: '#52b274',
    minHeight: 30,
    color: 'white',
    borderRadius: '6px',
    padding: '14px 14px 0px 14px',
    '&::after': {
      content: "''",
      position: 'absolute',
      border: '10px solid transparent',
      borderTop: '10px solid #52b274',
      top: '0px',
      right: '-10px',
    },
  },
}))

function PostChatMessage(props) {
  const { message } = props
  const { username } = message.user
  const history = useHistory()
  const classes = useStyles()
  const userId = useSelector((state) => state.user.data._id)
  const isDefaultDirection = message.userId !== userId
  const direction = isDefaultDirection ? 'row' : 'row-reverse'

  const { loading, data } = useQuery(GET_MESSAGE_REACTIONS, {
    variables: { messageId: message._id },
  })

  const { messageReactions } = (!loading && data) || []

  const handleRedirectToProfile = () => {
    history.push(`/profile/${username}`)
  }

  return (
    <Grid
      container
      direction={direction}
      justify={isDefaultDirection ? 'center' : 'flex-start'}
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={2}>
        <Avatar
          className={classes.avatar}
          onClick={() => handleRedirectToProfile()}
        >
          <AvatarDisplay {...message.user.avatar} />
        </Avatar>
      </Grid>
      <Grid item xs={10}>
        <Paper elevation={0} className={isDefaultDirection ? classes.bubble : classes.bubbleReverse}>
          <Typography className={classes.text}>
            {message.text}
          </Typography>
          <PostChatReactions created={message.created} messageId={message._id} reactions={messageReactions} isDefaultDirection={isDefaultDirection} />
        </Paper>
      </Grid>
    </Grid>
  )
}

PostChatMessage.propTypes = {
  message: PropTypes.object,
}

export default PostChatMessage
