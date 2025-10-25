import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import ChatSearchInput from './ChatSearchInput'
import BuddyList from '../BuddyList'
import MessageBox from './MessageBox'
import PresenceControls from './PresenceControls'
import { useMobileDetection } from '../../utils/display'

const useStyles = makeStyles((theme) => ({
  title: {
    color: 'white',
  },
  root: {
    width: 380,
    [theme.breakpoints.down('lg')]: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
    },
  },
}))

function ChatContent() {
  const classes = useStyles()
  const selectedRoom = useSelector((state) => state.chat.selectedRoom)
  const [search, setSearch] = useState('')
  const isMobileDevice = useMobileDetection()

  if (!selectedRoom || !selectedRoom.room) {
    return (
      <div className={classes.root}>
        <PresenceControls />
        <ChatSearchInput setSearch={setSearch} />
        <BuddyList search={search} />
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <MessageBox />
    </div>
  )
}

export default ChatContent
