import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING } from 'store/chat'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import SendIcon from '@material-ui/icons/Send'
import { Typography } from '@material-ui/core'
import { GET_ROOM_MESSAGES } from '../../graphql/query'
import { SEND_MESSAGE } from '../../graphql/mutations'
import useGuestGuard from '../../utils/useGuestGuard'
import { playOutgoingMessageTone, playErrorTone } from '../../utils/sound'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    padding: 10,
    borderRadius: '10px',
  },
}))

// eslint-disable-next-line react/prop-types
export default function MessageSend({ messageRoomId, type, title }) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [text, setText] = React.useState('')
  const user = useSelector((state) => state.user.data)
  const [error, setError] = React.useState('')
  const ensureAuth = useGuestGuard()
  const [createMessage, { loading }] = useMutation(SEND_MESSAGE, {
    onError: (err) => {
      setError(err)
      playErrorTone()
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
    if (!text.trim()) return // Don't submit empty messages
    
    dispatch(CHAT_SUBMITTING(true))

    const message = {
      title,
      type,
      messageRoomId,
      text: text.trim(),
    }

    const dateSubmitted = new Date()
    try {
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

      playOutgoingMessageTone()
      // Clear the text input after successful submission
      setText('')
    } catch (err) {
      // The onError handler already surfaced the failure state for the user
    }
  }
  return (
    <Paper className={classes.root}>
      {error && <Typography>Unable to send a message.</Typography>}
      <InputBase
        placeholder="Aa"
        inputProps={{ 'aria-label': 'Aa' }}
        fullWidth
        multiline
        rowsMin={1}
        rowsMax={5}
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
        type="submit"
        aria-label="Send"
        disabled={loading}
        onClick={handleSubmit}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  )
}
