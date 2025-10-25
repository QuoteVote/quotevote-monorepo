import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import PropTypes from 'prop-types'
import { Avatar, Typography, Tooltip } from '@material-ui/core'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import { useRef, useState, useEffect, Fragment } from 'react'
import AvatarDisplay from '../Avatar'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import {
  describePresence,
  getPresenceColor,
  getPresenceLabel,
  normalizePresenceStatus,
} from '../../utils/presence'

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
  avatarWrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  presenceDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid #0f2a43',
    backgroundColor: '#9E9E9E',
  },
  presencePill: {
    flexShrink: 0,
    marginLeft: 8,
    padding: '2px 8px',
    borderRadius: 12,
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#FFFFFF',
    display: 'inline-flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  secondaryText: {
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    display: 'block',
  },
  unreadCount: {
    margin: 5,
    color: '#E91E63',
    borderRadius: '50%',
    backgroundColor: 'white',
    minWidth: 40,
    minHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))
const emptyData = [
  {
    Text: 'Car Shark',
    type: 'USER',
    avatar: {},
    buddy: null,
    unreadMessages: 0,
  }, {
    Text: 'Four Aces',
    type: 'Post',
    avatar: {},
    buddy: null,
    unreadMessages: 0,
  }, {
    Text: 'Peter Parker',
    type: 'USER',
    avatar: {},
    buddy: null,
    unreadMessages: 0,
  }, {
    Text: 'Lebron James',
    type: 'USER',
    avatar: {},
    buddy: null,
    unreadMessages: 0,
  }, {
    Text: 'Twitter',
    type: 'Post',
    avatar: {},
    buddy: null,
    unreadMessages: 0,
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
        {itemList.map((item) => {
          const hasBuddy = item.type === 'USER' && item.buddy
          const status = hasBuddy ? normalizePresenceStatus(item.buddy.presenceStatus) : 'OFFLINE'
          const presenceColor = hasBuddy ? getPresenceColor(status) : 'transparent'
          const presenceLabel = hasBuddy ? getPresenceLabel(status) : ''
          const presenceDescription = hasBuddy
            ? describePresence(status, item.buddy.awayMessage, item.buddy.lastActiveAt)
            : ''

          return (
            <Fragment key={item.room?._id || item.Text}>
              <ListItem onClick={() => handleClickItem(item)}>
                <ListItemAvatar>
                  <div className={classes.avatarWrapper}>
                    <Avatar>
                      {item.type === 'USER' && <AvatarDisplay height={40} width={40} {...item.avatar} />}
                      {item.type !== 'USER' && item.Text[0]}
                    </Avatar>
                    {hasBuddy && (
                      <span
                        className={classes.presenceDot}
                        style={{ backgroundColor: presenceColor }}
                      />
                    )}
                  </div>
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary={(
                    <div className={classes.primaryText}>
                      <TruncatedText text={item.Text} className={classes.textContent} />
                      <span className={`${item.type === 'USER' ? classes.friendType : classes.postType} ${classes.typeBadge}`}>
                        {item.type === 'USER' ? 'FRIEND' : 'POST'}
                      </span>
                      {hasBuddy && (
                        <span
                          className={classes.presencePill}
                          style={{ backgroundColor: presenceColor }}
                        >
                          {presenceLabel}
                        </span>
                      )}
                    </div>
                  )}
                  secondary={
                    hasBuddy && presenceDescription ? (
                      <Typography variant="caption" className={classes.secondaryText}>
                        {presenceDescription}
                      </Typography>
                    ) : null
                  }
                />
                <ListItemSecondaryAction>
                  <div className={classes.unreadCount}>
                    {item.unreadMessages || 0}
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider className={classes.divider} />
            </Fragment>
          )
        })}
      </List>
    </>
  )
}

BuddyItemList.propTypes = {
  buddyList: PropTypes.any,
}

export default BuddyItemList
