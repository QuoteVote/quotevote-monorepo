import { Avatar, Grid, Paper, IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import AvatarDisplay from '../Avatar'
import { DELETE_MESSAGE } from '../../graphql/mutations'
import { SET_SNACKBAR } from '../../store/ui'
import AutoLinkText from '../common/AutoLinkText'

const useStyles = makeStyles(() => ({
  bubble: {
    position: 'relative',
    background: '#ffffff',
    minHeight: 30,
    minWidth: 250,
    marginLeft: '10px',
    borderRadius: '2px',
    padding: 5,
    '&::after': {
      content: "''",
      position: 'absolute',
      border: '10px solid transparent',
      borderTop: '10px solid #ffffff',
      top: '0px',
      left: '-10px',
    },
  },
  bubbleReverse: {
    position: 'relative',
    background: '#52b274',
    minHeight: 30,
    minWidth: 250,
    color: 'white',
    marginRight: '10px',
    borderRadius: '2px',
    padding: 5,
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

function MessageItem({ message }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const userId = user._id
  const isDefaultDirection = message.userId !== userId
  const direction = isDefaultDirection ? 'row' : 'row-reverse'

  const [deleteMessage] = useMutation(DELETE_MESSAGE, {
    update(cache, { data: { deleteMessage } }) {
      cache.modify({
        fields: {
          messages(existing = [], { readField }) {
            return existing.filter(
              (messageRef) => readField('_id', messageRef) !== deleteMessage._id,
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

  return (
    <Grid
      container
      direction={direction}
      justify="center"
      alignItems="flex-start"
    >
      <Grid item>
        <Avatar>
          <AvatarDisplay height={40} width={40} {...message.user.avatar} />
        </Avatar>
      </Grid>
      <Grid item className={classes.messageContainer}>
        <Paper
          className={isDefaultDirection ? classes.bubble : classes.bubbleReverse}
        >
          <AutoLinkText text={message.text} />
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

MessageItem.propTypes = {
  direction: PropTypes.any,
  message: PropTypes.any,
}

export default MessageItem
