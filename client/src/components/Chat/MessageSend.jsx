import React from 'react'
import { makeStyles } from '@mui/material/styles'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch, useSelector } from 'react-redux'
import { CHAT_SUBMITTING } from 'store/chat'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import { Typography } from '@mui/material'
import { GET_ROOM_MESSAGES } from '../../graphql/query'
import { SEND_MESSAGE } from '../../graphql/mutations'

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
  const { error, setError } = React.useState('')
  const [createMessage, { loading }] = useMutation(SEND_MESSAGE, {
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

  const handleSubmit = async () => {
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
