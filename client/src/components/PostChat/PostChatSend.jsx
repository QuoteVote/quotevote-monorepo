import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING } from 'store/chat'
import { useMutation } from '@apollo/react-hooks'
import { Grid, InputBase } from '@mui/material'
import { makeStyles } from '@mui/styles'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { SEND_MESSAGE } from '../../graphql/mutations'
import { GET_ROOM_MESSAGES } from '../../graphql/query'
import useGuestGuard from '../../utils/useGuestGuard'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 10,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
    },
  },
  chat: {
    fontWeight: 600,
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderRadius: 6,
    background: '#ffffff',
    height: 45,
    paddingLeft: 10,
    width: '80%',
    [theme.breakpoints.up('md')]: {
      width: '85%',
    },
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
  const ensureAuth = useGuestGuard()
  const [createMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      setError(err)
      dispatch(CHAT_SUBMITTING(false))
    },
    onCompleted: () => {
      dispatch(CHAT_SUBMITTING(false))
    },
    refetchQueries: [{
      query: GET_ROOM_MESSAGES,
      variables: {
        messageRoomId,
      },
    }],
  })

  // Test hook: if a test provides a global override for the mutation function
  // (window.__TEST_CREATE_MESSAGE), use that instead of the real hook. This
  // allows tests to avoid relying on Apollo's runtime while exercising the
  // component's submit flow.
  // eslint-disable-next-line no-underscore-dangle
  const createMessageFn = (typeof window !== 'undefined' && window.__TEST_CREATE_MESSAGE) ? window.__TEST_CREATE_MESSAGE : createMessage

  const handleSubmit = async () => {
    if (!ensureAuth()) return
    if (!text.trim()) return // Don't submit empty messages
    
    dispatch(CHAT_SUBMITTING(true))

    const message = {
      title,
      type,
      messageRoomId,
      text: text.trim(),
    }

    const dateSubmitted = new Date()
    await createMessageFn({
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
          text: text.trim(),
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
    
    // Clear the text input after successful submission
    setText('')
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
            value={text}
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
