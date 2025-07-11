import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING } from 'store/chat'
import { useMutation } from '@apollo/react-hooks'
import { Grid, InputBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import useGuestGuard from 'utils/useGuestGuard'
import { SEND_MESSAGE } from '../../graphql/mutations'
import { GET_ROOM_MESSAGES } from '../../graphql/query'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    padding: 10,
  },
  chat: {
    width: 59,
    height: 30,
    fontSize: '1.7rem',
    lineHeight: 1.25,
    letterSpacing: 0.25,
    color: '#474646',
    fontFamily: 'Montserrat',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  input: {
    borderRadius: 6,
    background: '#ffffff',
    height: 45,
    paddingLeft: 10,
    width: '80%',
  },
  send: {
    float: 'right',
  },
}))

function PostChatSend(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const commentInputRef = useRef(null)
  const { messageRoomId, title } = props
  const type = 'POST'
  const [text, setText] = useState('')
  const [error, setError] = useState(null) // eslint-disable-line no-unused-vars
  const user = useSelector((state) => state.user.data)
  const [createMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      setError(err)
    },
    refetchQueries: [{
      query: GET_ROOM_MESSAGES,
      variables: {
        messageRoomId,
      },
    }],
  })

  const ensureAuth = useGuestGuard()

  const handleSubmit = async () => {
    if (!ensureAuth()) return
    dispatch(CHAT_SUBMITTING(true))

    const message = {
      title,
      type,
      messageRoomId,
      text,
    }

    setText('')

    const dateSubmitted = new Date()
    await createMessage({
      variables: { message },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          _id: dateSubmitted, // dummy
          messageRoomId,
          userName: user.name,
          userId: user._id,
          title,
          text,
          type,
          created: dateSubmitted,
          user: {
            __typename: 'User',
            name: user.name,
            username: user.username,
            avatar: user.avatar,
          },
        },
      },
      // eslint-disable-next-line no-shadow
      update: (proxy, { data: { createMessage } }) => {
        // Read the data from our cache for this query.
        const data = proxy.readQuery({ query: GET_ROOM_MESSAGES, variables: { messageRoomId } })
        if (data) {
          if (commentInputRef && commentInputRef.current) {
            // clear the input field
            commentInputRef.current.children[0].value = ''
          }
          // Write our data back to the cache with the new message in it
          proxy.writeQuery({
            query: GET_ROOM_MESSAGES,
            variables: { messageRoomId },
            data: {
              ...data,
              messages: [...data.messages, createMessage],
            },
          })
        }
      },
    })
  }

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      <Hidden only={['xs']}>
        <Grid item sm={2}>
          <Typography className={classes.chat}>Chat</Typography>
        </Grid>
      </Hidden>
      <Grid item sm={10} xs={12}>
        <Paper elevation={0}>
          <InputBase
            ref={commentInputRef}
            placeholder="type a message..."
            className={classes.input}
            onChange={(event) => {
              const { value } = event.target
              setText(value)
            }}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleSubmit()
              }
            }}
          />
          <IconButton
            className={classes.send}
            onClick={() => {
              handleSubmit()
            }}
          >
            <img src="/assets/SendIcon.svg" alt="send"></img>
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  )
}

PostChatSend.propTypes = {
  messageRoomId: PropTypes.string,
  title: PropTypes.string,
}

export default PostChatSend
