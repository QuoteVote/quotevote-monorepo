/**
 *
 * ActivityCard
 *
 */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { loadCSS } from 'fg-loadcss'

import { makeStyles } from '@mui/material/styles'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import moment from 'moment'
import { isEmpty } from 'lodash'
import stringLimit from 'string-limit'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import AvatarDisplay from '../../components/Avatar'

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.typography.pxToRem(350),
    minHeight: theme.typography.pxToRem(200),
    borderRadius: '6px',
    backgroundColor: (props) => (props.cardColor ? props.cardColor : '#FFF'),
    width: (props) => (props.width ? props.width : '100%'),
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      minWidth: '100%',
      width: '100%',
    },
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: theme.typography.pxToRem(20),
    marginBottom: 10,
  },
  activityBody: {
    marginLeft: theme.typography.pxToRem(20),
    cursor: 'pointer',
    marginBottom: theme.typography.pxToRem(10),
  },
  avatar: {
    cursor: 'pointer',
  },
  expand: {
    marginLeft: 'auto',
    padding: 0,
  },
  content: {
    minHeight: theme.typography.pxToRem(130),
  },
  iconButton: {
    backgroundColor: 'transparent !important',
    padding: 0,
  },
}))

function ActivityHeader({ name, date, handleRedirectToProfile = null }) {
  const classes = useStyles()
  return (
    <div className={classes.activityHeader}>
      <IconButton
        className={classes.iconButton}
        onClick={(e) => {
          e.stopPropagation()
          handleRedirectToProfile(name)
        }}
      >
        <Typography color="textPrimary" variant="subtitle2">
          {name}
        </Typography>
      </IconButton>
      <Typography color="textPrimary" variant="caption">
        {moment(date).calendar(null, {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] dddd',
          sameElse: 'MMM DD, YYYY',
        })}
        {` @ ${moment(date).format('h:mm A')}`}
      </Typography>
    </div>
  )
}

ActivityHeader.propTypes = {
  name: PropTypes.string,
  date: PropTypes.string,
  handleRedirectToProfile: PropTypes.func,
}

function ActivityContent({
  date, content, avatar, width, handleRedirectToProfile, username,
  post, activityType,
}) {
  const classes = useStyles()
  const contentLength = width > 500 ? 1000 : 500
  const isPosted = activityType.toUpperCase() === 'POSTED'
  const title = post.title ? stringLimit(post.title, isPosted ? 1000 : 100) : ''
  return (
    <Box display="flex" className={classes.content}>
      <Avatar
        onClick={(e) => {
          e.stopPropagation()
          handleRedirectToProfile(username)
        }}
        className={classes.avatar}
      >
        <AvatarDisplay
          height="40"
          width="40"
          className={classes.avatarStyle}
          {...avatar}
        />
      </Avatar>
      <Box flexGrow={1}>
        <ActivityHeader name={username} date={date} handleRedirectToProfile={handleRedirectToProfile} />
        {isPosted && (
          <Typography className={classes.activityBody} variant="body1">
            <b>
              {title}
            </b>
          </Typography>
        )}
        {!isPosted && (
          <Typography className={classes.activityBody} variant="body1">
            <b>
              {activityType.toUpperCase()}
            </b>
            {' on '}
            <i>
              {title}
            </i>
          </Typography>
        )}
        <Typography className={classes.activityBody} variant="body1">
          &quot;
          {content.length > 1000 ?
            `${content.slice(0, contentLength)}...` :
            content}
          &quot;
        </Typography>
      </Box>
    </Box>
  )
}

ActivityContent.propTypes = {
  // name: PropTypes.string,
  username: PropTypes.string,
  date: PropTypes.string,
  content: PropTypes.string,
  avatar: PropTypes.any,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']),
  handleRedirectToProfile: PropTypes.func,
  // onCardClick: PropTypes.func,
  post: PropTypes.object,
  activityType: PropTypes.string,
}

function ActivityActions({
  liked, onLike, interactions,
}) {
  const classes = useStyles()
  return (
    <>
      <Typography variant="caption" style={{ paddingLeft: 5 }}>{interactions.length}</Typography>
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          onLike(liked, e)
        }}
        className={classes.expand}
      >
        {liked ? (
          <BookmarkIcon />
        ) : (
          <BookmarkBorderIcon />
        )}
      </IconButton>
    </>
  )
}

ActivityActions.propTypes = {
  interactions: PropTypes.array,
  liked: PropTypes.bool,
  onLike: PropTypes.func,
}

export const ActivityCard = memo(
  ({
    avatar = '',
    cardColor,
    name = 'Username',
    date = 'Today @ 3:35PM',
    content = '',
    comments,
    quotes,
    messages,
    votes,
    liked = false,
    width,
    onLike = () => { },
    onCardClick = () => { },
    handleRedirectToProfile = () => { },
    username,
    post = {},
    activityType = '',
  }) => {
    React.useEffect(() => {
      const node = loadCSS(
        'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
        document.querySelector('#font-awesome-css')
      )

      return () => {
        node.parentNode.removeChild(node)
      }
    }, [])

    let interactions = []

    if (!isEmpty(comments)) {
      interactions = interactions.concat(comments)
    }

    if (!isEmpty(votes)) {
      interactions = interactions.concat(votes)
    }

    if (!isEmpty(quotes)) {
      interactions = interactions.concat(quotes)
    }

    if (!isEmpty(messages)) {
      interactions = interactions.concat(messages)
    }

    const classes = useStyles({ cardColor, width })
    return (
      <Card className={classes.root} onClick={onCardClick}>
        <CardContent>
          <ActivityContent
            name={name}
            date={date}
            content={content}
            avatar={avatar}
            username={username}
            handleRedirectToProfile={handleRedirectToProfile}
            // onCardClick={onCardClick}
            post={post}
            activityType={activityType}
          />
        </CardContent>
        <CardActions disableSpacing>
          <ActivityActions
            interactions={interactions}
            liked={liked}
            onLike={onLike}
          />
        </CardActions>
      </Card>
    )
  }
)

ActivityCard.propTypes = {
  avatar: PropTypes.any,
  comments: PropTypes.array,
  messages: PropTypes.array,
  votes: PropTypes.array,
  quotes: PropTypes.array,
  content: PropTypes.string,
  cardColor: PropTypes.string,
  name: PropTypes.string,
  username: PropTypes.string,
  date: PropTypes.string,
  liked: PropTypes.bool,
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']),
  onLike: PropTypes.func,
  onCardClick: PropTypes.func,
  handleRedirectToProfile: PropTypes.func,
  post: PropTypes.object,
  activityType: PropTypes.string,
}
