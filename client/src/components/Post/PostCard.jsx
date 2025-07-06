import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { IconButton, Tooltip } from '@material-ui/core'
import Card from 'mui-pro/Card/Card'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { SET_SELECTED_POST } from 'store/ui'
import { useHistory } from 'react-router-dom'
import AvatarDisplay from 'components/Avatar'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import CardContent from '@material-ui/core/CardContent'
import stringLimit from 'string-limit'
import withWidth from '@material-ui/core/withWidth'
import getTopPostsVoteHighlights from '../../utils/getTopPostsVoteHighlights'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { tokenValidator } from 'store/user'
import { useState, useMemo } from 'react'

const GET_GROUP = gql`
  query getGroup($groupId: String!) {
    group(groupId: $groupId) {
      _id
      title
    }
  }
`

const useStyles = makeStyles((theme) => ({
  cardRootStyle: {
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    borderRadius: 7,
    border: '1px solid',
    borderBottom: '10px solid',
    '&:hover': {
      animationName: 'post',
      animationDuration: '0.25s',
      boxShadow:
        '10px 7px 10px 0 rgba(0, 188, 212, 0.4), 0 4px 20px 0 rgba(0, 0, 0, 0.14)',
    },
  },
  postedBg: {
    borderColor: '#56b3ff',
  },
  commentedBg: {
    borderColor: '#fdd835',
  },
  upVotedBg: {
    borderColor: '#52b274',
  },
  downVotedBg: {
    borderColor: '#ff6060',
  },
  likedPostBg: {
    borderColor: '#56b3ff',
  },
  quotedPostBg: {
    borderColor: '#e36dfa',
  },
  cardHeaderStyle: {
    paddingBottom: 0,
    paddingTop: 10,
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  cardBodyStyle: {
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
    color: '#000000',
    position: 'relative',
    paddingTop: '5px',
  },
  interactions: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  bottomInfo: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  voteCounts: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '8px 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  },
  voteSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  voteItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  voteIcon: {
    fontSize: '18px',
  },
  voteNumber: {
    fontSize: '14px',
    fontWeight: 500,
  },
  upvoteIcon: {
    color: '#52b274',
  },
  downvoteIcon: {
    color: '#ff6060',
  },
  divider: {
    margin: '0 8px',
    color: 'rgba(0, 0, 0, 0.38)',
  },
  username: {
    font: 'Roboto',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#000000',
    whiteSpace: 'nowrap',
    padding: 0,
    top: 16,
  },
  dateTime: {
    opacity: 0.8,
    font: 'Roboto',
    fontSize: '10px',
    color: '#000000',
    padding: 0,
  },
  postTitle: {
    font: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18,
    },
  },
  rankNumber: {
    font: 'Roboto',
    fontSize: 96,
    fontWeight: 'bold',
    color: 'grey',
    top: 0,
    right: 35,
  },
  postContent: {
    font: 'Roboto',
    fontSize: 16,
    fontWeight: 300,
    color: '#000000',
    display: '-webkit-box',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineHeight: '1.5',
    maxHeight: '72px',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: 14,
    },
  },
  postContentExpanded: {
    display: 'block',
    WebkitLineClamp: 'unset',
    maxHeight: 'none',
    overflow: 'visible',
  },
  toggleButton: {
    padding: '4px',
    marginTop: '8px',
    color: '#666',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  votes: {
    height: 12,
    font: 'Roboto',
    fontSize: 10,
    fontWeight: 500,
    color: '#000000',
    paddingLeft: 10,
  },
  bookmark: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  fontColor: {
    color: '#000000',
  },
  groupName: {
    fontSize: '14px',
    color: '#666',
    padding: '4px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    '&:before': {
      content: '"•"',
      marginRight: '4px',
    },
  },
}))

const getCardBg = (activityType = 'POSTED') => {
  switch (activityType.toUpperCase()) {
    case 'POSTED':
      return 'postedBg'
    case 'COMMENTED':
      return 'commentedBg'
    case 'UPVOTED':
      return 'upVotedBg'
    case 'DOWNVOTED':
      return 'downVotedBg'
    case 'LIKED':
      return 'likedPostBg'
    case 'QOUTED':
      return 'quotedPostBg'
    default:
      return 'postedBg'
  }
}

function PostCard(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.user.data)
  const classes = useStyles(props)
  const { width } = props
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const {
    _id,
    text,
    title,
    url,
    bookmarkedBy,
    approvedBy,
    rejectedBy,
    created,
    creator,
    activityType,
    limitText,
    votes,
    comments,
    quotes,
    messageRoom,
    groupId,
  } = props
  const { messages } = messageRoom
  const contentLimit = limitText ? 20 : 200
  let postText = stringLimit(text, contentLimit)

  let interactions = []

  if (!isEmpty(comments)) {
    interactions = interactions.concat(comments)
  }

  if (!isEmpty(votes)) {
    interactions = interactions.concat(votes)
    postText = getTopPostsVoteHighlights(votes, postText, text)
  }

  if (!isEmpty(quotes)) {
    interactions = interactions.concat(quotes)
  }

  if (!isEmpty(messages)) {
    interactions = interactions.concat(messages)
  }

  const cardBg = getCardBg(activityType)
  const postTitleStringLimit = width === 'xs' ? 25 : 50
  const handleRedirectToProfile = (username) => {
    history.push(`/Profile/${username}`)
  }

  // TODO: show quote up/down
  const { upQuote, downQuote } = useMemo(() => {
    if (!votes || votes?.length === 0) {
      return {
        upQuote: 0,
        downQuote: 0,
      }
    }

    return {
      upQuote: votes.filter((vote) => vote.type === 'UPVOTE' || vote.type?.toUpperCase() === 'UP').length,
      downQuote: votes.filter((vote) => vote.type === 'DOWNVOTE' || vote.type?.toUpperCase() === 'DOWN').length,
    }
  }, [votes])

  const { data: groupData } = useQuery(GET_GROUP, {
    variables: { groupId },
    skip: !groupId,
  })

  const handleCardClick = () => {
    dispatch(SET_SELECTED_POST(_id))
    history.push(url.replace(/\?/g, ''))
  }

  const handleToggleContent = (e) => {
    e.stopPropagation()
    setIsContentExpanded(!isContentExpanded)
  }

  const truncatedTitle = stringLimit(
    title,
    limitText ? 20 : postTitleStringLimit,
  )
  const isTitleTruncated =
    title.length > (limitText ? 20 : postTitleStringLimit)

  return (
    <Card
      className={classNames(
        classes.cardRootStyle,
        classes[cardBg],
        classes.fontColor,
      )}
      onClick={handleCardClick}
    >
      <CardContent className={classes.cardBodyStyle}>
        <div className={classes.voteCounts}>
          <div className={classes.voteSection}>
            <div className={classes.voteItem}>
              <ArrowUpwardIcon
                className={classNames(classes.voteIcon, classes.upvoteIcon)}
              />
              <Typography className={classes.voteNumber}>{approvedBy?.length}</Typography>
            </div>
            <div className={classes.voteItem}>
              <ArrowDownwardIcon
                className={classNames(classes.voteIcon, classes.downvoteIcon)}
              />
              <Typography className={classes.voteNumber}>
                {rejectedBy?.length}
              </Typography>
            </div>
            {groupData?.group && (
              <Typography className={classes.groupName}>
                {groupData.group.title}
              </Typography>
            )}
          </div>
          <div className={classes.interactions}>
            <Typography>{interactions.length} interactions</Typography>
          </div>
        </div>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12}>
            <Tooltip
              title={isTitleTruncated ? title : ''}
              placement="top"
              arrow
            >
              <Typography className={classes.postTitle}>
                {truncatedTitle}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.contentSection}>
              <Typography
                className={classNames(
                  classes.postContent,
                  isContentExpanded && classes.postContentExpanded,
                )}
              >
                {isContentExpanded ? text : postText}
              </Typography>
              {text.length > contentLimit && (
                <Tooltip
                  title={isContentExpanded ? 'Show less' : 'Show more'}
                  placement="bottom"
                  arrow
                >
                  <IconButton
                    className={classes.toggleButton}
                    onClick={handleToggleContent}
                    size="small"
                  >
                    {isContentExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
      <div className={classes.bottomInfo}>
        <div className={classes.profileSection}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation()
              handleRedirectToProfile(creator.username)
            }}
          >
            <Avatar>
              <AvatarDisplay
                height="64"
                width="64"
                className={classes.avatarStyle}
                {...creator.avatar}
              />
            </Avatar>
          </IconButton>
          <Typography className={classes.username}>
            {creator ? creator.username : 'Anonymous'}
          </Typography>
        </div>
        <Typography className={classes.divider}>|</Typography>
        <Typography className={classes.dateTime}>
          {moment(created).calendar(null, {
            sameDay: '[Today]',
            nextDay: '[Tomorrow]',
            nextWeek: 'dddd',
            lastDay: '[Yesterday]',
            lastWeek: '[Last] dddd',
            sameElse: 'MMM DD, YYYY',
          })}
          {` @ ${moment(created).format('h:mm A')}`}
        </Typography>
      </div>
    </Card>
  )
}
PostCard.defaultProps = {
  activityType: 'POSTED',
}

PostCard.propTypes = {
  _id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  votes: PropTypes.array.isRequired,
  comments: PropTypes.array.isRequired,
  quotes: PropTypes.array.isRequired,
  messageRoom: PropTypes.array.isRequired,
  url: PropTypes.string.isRequired,
  bookmarkedBy: PropTypes.array.isRequired,
  created: PropTypes.string.isRequired,
  onBookmark: PropTypes.func,
  creator: PropTypes.any,
  activityType: PropTypes.string,
  avatar: PropTypes.object,
  width: PropTypes.any,
  limitText: PropTypes.bool,
  groupId: PropTypes.string,
}

export default withWidth()(PostCard)
