import { makeStyles } from '@mui/styles'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import PropTypes from 'prop-types'
import { Avatar, Typography, Tooltip } from '@mui/material'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import AvatarDisplay from '../Avatar'
import { SELECTED_CHAT_ROOM } from '../../store/chat'

const useStyles = makeStyles(() => ({
  root: {
    width: 380,
    backgroundColor: 'transparent',
    color: 'white',
    height: '60vh',
    position: 'relative',
    overflow: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  blur: {
    opacity: 0.5,
  },
  inline: {
    display: 'inline',
  },
  divider: {
    backgroundColor: 'white',
  },
  count: {
    margin: 5,
    color: '#E91E63',
    borderRadius: '50%',
    backgroundColor: 'white',
    width: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  friendType: {
    margin: 5,
    padding: 5,
    background: '#52b274',
    borderRadius: '5px',
  },
  postType: {
    padding: 5,
    margin: 5,
    background: '#791E89',
    borderRadius: '5px',
  },
  hint: {
    color: 'white',
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 10,
  },
  listItemText: {
    flex: '1 1 auto',
    minWidth: 0, // This is crucial for text truncation to work
    marginRight: 60, // Give space for the secondary action
  },
  primaryText: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0, // Allow flex item to shrink below content size
  },
  textContent: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: '1 1 auto',
    minWidth: 0, // Allow text to shrink
  },
  typeBadge: {
    flexShrink: 0, // Prevent badge from shrinking
    marginLeft: 8,
  },
}))
const emptyData = [
  {
    Text: 'Car Shark',
    type: 'USER',
    avatar: {},
  }, {
    Text: 'Four Aces',
    type: 'Post',
    avatar: {},
  }, {
    Text: 'Peter Parker',
    type: 'USER',
    avatar: {},
  }, {
    Text: 'Lebron James',
    type: 'USER',
    avatar: {},
  }, {
    Text: 'Twitter',
    type: 'Post',
    avatar: {},
  },
]

// Component to handle text overflow detection and tooltip
const TruncatedText = ({ text, className }) => {
  const textRef = useRef(null)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current
        setIsOverflowing(element.scrollWidth > element.clientWidth)
      }
    }

    checkOverflow()
    // Re-check on window resize
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [text])

  const textElement = (
    <div ref={textRef} className={className}>
      {text}
    </div>
  )

  return isOverflowing ? (
    <Tooltip title={text} placement="top">
      {textElement}
    </Tooltip>
  ) : (
    textElement
  )
}

TruncatedText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

function BuddyItemList({ buddyList }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const itemList = buddyList.length ? buddyList : emptyData
  const handleClickItem = (room) => {
    if (buddyList.length) {
      dispatch(SELECTED_CHAT_ROOM(room))
    }
  }

  return (
    <>
      {!buddyList.length && (
        <Typography className={classes.hint}>
          You can add friend by following them.
          <br />
          You will see them on this section.
        </Typography>
      )}
      <List className={buddyList.length ? classes.root : classNames(classes.root, classes.blur)}>
        {itemList.map((item) => (
          <>
            <ListItem onClick={() => handleClickItem(item)}>
              <ListItemAvatar>
                <Avatar>
                  {item.type === 'USER' && <AvatarDisplay height={40} width={40} {...item.avatar} />}
                  {item.type !== 'USER' && item.Text[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                className={classes.listItemText}
                primary={(
                  <div className={classes.primaryText}>
                    <TruncatedText text={item.Text} className={classes.textContent} />
                    <span className={`${item.type === 'USER' ? classes.friendType : classes.postType} ${classes.typeBadge}`}>
                      {item.type === 'USER' ? 'FRIEND' : 'POST'}
                    </span>
                  </div>
                )}
              />
              <ListItemSecondaryAction>
                <div className={classes.count}>
                  {item.unreadMessages}
                </div>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider className={classes.divider} />
          </>
        ))}
      </List>
    </>
  )
}

BuddyItemList.propTypes = {
  buddyList: PropTypes.any,
}

export default BuddyItemList
