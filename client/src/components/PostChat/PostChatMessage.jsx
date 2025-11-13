import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Grid, Paper, Typography, Avatar, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation } from '@apollo/client'
import AvatarDisplay from '../Avatar'
import PostChatReactions from './PostChatReactions'
import { GET_MESSAGE_REACTIONS } from '../../graphql/query'
import { DELETE_MESSAGE } from '../../graphql/mutations'
import { SET_SNACKBAR } from '../../store/ui'

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
  deleteIcon: {
    color: '#f44336',
    fontSize: '16px',
  },
  messageContainer: {
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: '50%',
    padding: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
}))

function PostChatMessage(props) {
  const { message } = props
  const { username, name } = message.user
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const userId = user._id
  const isDefaultDirection = message.userId !== userId
  const direction = isDefaultDirection ? 'row' : 'row-reverse'

  const { loading, data } = useQuery(GET_MESSAGE_REACTIONS, {
    variables: { messageId: message._id },
  })

  const { messageReactions } = (!loading && data) || []

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update(cache, { data: { deleteMessage } }) {
      cache.modify({
        fields: {
          messages(existing = [], { readField }) {
            return existing.filter(
              (messageRef) =>
                readField('_id', messageRef) !== deleteMessage._id,
            )
          },
        },
      })
    },
  })

  const handleDelete = async () => {
    try {
      await deleteMessage({ variables: { messageId: message._id } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Message deleted successfully',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Delete Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  const handleRedirectToProfile = () => {
    history.push(`/Profile/${username}`)
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
      <Grid item xs={10} className={classes.messageContainer}>
        <Paper
          elevation={0}
          className={
            isDefaultDirection ? classes.bubble : classes.bubbleReverse
          }
        >
          <Typography className={classes.text}>{message.text}</Typography>
          <PostChatReactions
            created={message.created}
            messageId={message._id}
            reactions={messageReactions}
            isDefaultDirection={isDefaultDirection}
            userName={name}
            username={username}
          />
        </Paper>
        {(user._id === message.userId || user.admin) && (
          <IconButton
            onClick={handleDelete}
            className={classes.deleteButton}
            size="small"
          >
            <Delete className={classes.deleteIcon} />
          </IconButton>
        )}
      </Grid>
    </Grid>
  )
}

PostChatMessage.propTypes = {
  message: PropTypes.object,
}

export default PostChatMessage
