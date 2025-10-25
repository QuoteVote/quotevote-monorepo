import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import ChatSearchInput from './ChatSearchInput'
import PresenceBuddyList from './PresenceBuddyList'
import MessageBox from './MessageBox'
import StatusEditor from './StatusEditor'
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

  if (!selectedRoom || !selectedRoom.conversation) {
    return (
      <div className={classes.root}>
        <StatusEditor />
        <ChatSearchInput setSearch={setSearch} />
        <PresenceBuddyList search={search} />
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
