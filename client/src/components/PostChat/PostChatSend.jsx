import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING } from 'store/chat'
import { useMutation } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SendRoundedIcon from '@material-ui/icons/SendRounded'
import { SEND_MESSAGE } from '../../graphql/mutations'
import { GET_ROOM_MESSAGES } from '../../graphql/query'
import useGuestGuard from '../../utils/useGuestGuard'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: theme.spacing(1, 1.5),
    borderTop: '1px solid',
    borderColor: theme.palette.divider,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    gap: theme.spacing(1),
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: 'rgba(30, 30, 30, 0.85)',
    }),
  },
  inputWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-end',
    borderRadius: 24,
    backgroundColor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#f0f2f5',
    border: '1px solid transparent',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
    '&:focus-within': {
      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#ffffff',
      borderColor: '#1976d2',
      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.12)',
    },
  },
  input: {
    flex: 1,
    padding: theme.spacing(1, 2),
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: theme.palette.text.primary,
    '& .MuiInputBase-input': {
      padding: 0,
      '&::placeholder': {
        opacity: 0.55,
        color: theme.palette.text.secondary,
      },
    },
  },
  sendButton: {
    padding: 8,
    color: theme.palette.text.disabled,
    transition: 'color 0.2s ease, transform 0.15s ease',
  },
  sendButtonActive: {
    color: '#1976d2',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
      transform: 'scale(1.1)',
    },
  },
}))

function PostChatSend(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const commentInputRef = useRef(null)
  const { messageRoomId, title, postId } = props
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

  const handleSubmit = async () => {
    if (!ensureAuth()) return
    if (!text.trim()) return

    dispatch(CHAT_SUBMITTING(true))

    const message = {
      title,
      type,
      messageRoomId: messageRoomId || null,
      componentId: postId || null,
      text: text.trim(),
    }

    const dateSubmitted = new Date()
    await createMessage({
      variables: { message },
      optimisticResponse: {
        __typename: 'Mutation',
        createMessage: {
          __typename: 'Message',
          _id: dateSubmitted,
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
        const data = proxy.readQuery({ query: GET_ROOM_MESSAGES, variables: { messageRoomId } })
        if (data) {
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

    setText('')
  }

  const hasText = text.trim().length > 0

  return (
    <div className={classes.root}>
      <div className={classes.inputWrapper}>
        <InputBase
          multiline
          inputRef={commentInputRef}
          placeholder="Type a message..."
          className={classes.input}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              handleSubmit()
            }
          }}
        />
      </div>
      <IconButton
        className={`${classes.sendButton} ${hasText ? classes.sendButtonActive : ''}`}
        onClick={handleSubmit}
        disabled={!hasText}
        aria-label="Send message"
      >
        <SendRoundedIcon fontSize="small" />
      </IconButton>
    </div>
  )
}

PostChatSend.propTypes = {
  messageRoomId: PropTypes.string,
  title: PropTypes.string,
  postId: PropTypes.string,
}

export default PostChatSend
