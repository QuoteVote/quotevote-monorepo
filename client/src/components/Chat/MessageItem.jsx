import { Avatar, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import AvatarDisplay from '../Avatar'

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
}))
function MessageItem({ message }) {
  const classes = useStyles()
  const userId = useSelector((state) => state.user.data._id)
  const isDefaultDirection = message.userId !== userId
  const direction = isDefaultDirection ? 'row' : 'row-reverse'
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
      <Grid item>
        <Paper
          className={isDefaultDirection ? classes.bubble : classes.bubbleReverse}
        >
          {message.text}
        </Paper>
      </Grid>
    </Grid>
  )
}

MessageItem.propTypes = {
  direction: PropTypes.any,
  message: PropTypes.any,
}

export default MessageItem
