import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  FormControlLabel,
  Tooltip,
  Chip,
  Button,
  Divider,
} from '@material-ui/core'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import BlockIcon from '@material-ui/icons/Block'
import LinkIcon from '@material-ui/icons/Link'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'
import { includes, without, concat } from 'lodash'
import copy from 'clipboard-copy'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'
import { updateFollowing, tokenValidator } from 'store/user'
import VotingBoard from '../VotingComponents/VotingBoard'
import VotingPopup from '../VotingComponents/VotingPopup'
import { SET_SNACKBAR } from '../../store/ui'
import RequestInviteDialog from '../RequestInviteDialog'
import {
  ADD_COMMENT,
  ADD_QUOTE,
  REPORT_POST,
  VOTE,
  APPROVE_POST,
  REJECT_POST,
  DELETE_POST,
  TOGGLE_VOTING,
  FOLLOW_MUTATION,
  UPDATE_POST_BOOKMARK,
  CREATE_POST_MESSAGE_ROOM,
} from '../../graphql/mutations'
import {
  GET_POST,
  GET_TOP_POSTS,
  GET_USER_ACTIVITY,
  GET_USERS,
  GET_USER,
  GET_CHAT_ROOMS,
} from '../../graphql/query'
import AvatarDisplay from '../Avatar'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'
import ApproveButton from '../CustomButtons/ApproveButton'
import RejectButton from '../CustomButtons/RejectButton'
import { serializeVotedBy } from '../../utils/objectIdSerializer'

const useStyles = makeStyles((theme) => ({
  header2: {
    padding: 0,
    marginLeft: 10,
  },
  title: {
    color: '#52b274',
    marginRight: 5,
    fontFamily: 'Montserrat',
    fontSize: '20px',
  },
  blockIcon: {
    color: 'red',
  },
  avatar: {
    marginLeft: 20,
  },
  votes: {
    color: '#52b274',
  },
  downVote: {
    color: 'red',
  },
  points: {
    marginTop: 10,
    marginRight: 20,
    fontSize: 20,
    fontWeight: 'bolder',
    fontFamily: 'Montserrat',
  },
  content: {},
  expand: {
    marginLeft: 'auto',
  },
  button: {
    margin: 10,
  },
  postCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    [theme.breakpoints.down('sm')]: {
      height: (props) => (props.postHeight >= 742 ? '83vh' : 'auto'),
    },
  },
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  actionBarSentiment: {
    display: 'flex',
    flex: 1,
    gap: theme.spacing(1),
  },
  actionBarDisagree: {
    flex: 1,
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 700,
    borderColor: 'rgba(211, 47, 47, 0.2)',
    color: '#d32f2f',
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.04)',
      borderColor: '#d32f2f',
    },
  },
  actionBarDisagreeSelected: {
    flex: 1,
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#b71c1c',
      borderColor: '#b71c1c',
    },
  },
  actionBarSupport: {
    flex: 1,
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#2e7d32',
    color: '#fff',
    boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.39)',
    '&:hover': {
      backgroundColor: '#1b5e20',
    },
  },
  actionBarSupportSelected: {
    flex: 1,
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 700,
    backgroundColor: '#1b5e20',
    color: '#fff',
    boxShadow: '0 4px 14px 0 rgba(46, 125, 50, 0.39)',
    '&:hover': {
      backgroundColor: '#0a3d0a',
    },
  },
  actionBarUtilities: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  actionBarEmojiBtn: {
    fontSize: '1.2rem',
    filter: 'grayscale(0.8) opacity(0.6)',
    transition: 'filter 0.2s ease',
    '&:hover': {
      filter: 'none',
    },
  },
  actionBarEmojiBtnActive: {
    fontSize: '1.2rem',
    transition: 'filter 0.2s ease',
  },
  actionBarDivider: {
    height: 24,
    alignSelf: 'center',
    margin: theme.spacing(0, 0.5),
  },
  actionBarDeleteBtn: {
    fontSize: '1.2rem',
    filter: 'grayscale(1) opacity(0.6)',
    transition: 'filter 0.2s ease',
    '&:hover': {
      filter: 'none',
      backgroundColor: 'rgba(211, 47, 47, 0.04)',
    },
  },
  actionBarVotingToggle: {
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#666',
    },
    '& .MuiSwitch-root': {
      marginRight: -4,
    },
  },
  ...buttonStyle,
}))

function Post({ post, user, postHeight, postActions, refetchPost }) {
  const classes = useStyles({ postHeight })
  const { title, creator, created, _id, userId, citationUrl } = post
  const { name, avatar, username } = creator
  const { _followingId } = user
  const dispatch = useDispatch()
  const history = useHistory()
  const parsedCreated = moment(created).format('LLL')

  // Helper to extract domain from URL
  const getDomain = (url) => {
    try {
      const hostname = new URL(url).hostname
      return hostname.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  // State declarations
  const [selectedText, setSelectedText] = useState({
    text: '',
    startIndex: 0,
    endIndex: 0,
  })
  const [open, setOpen] = useState(false)
  const [openInvite, setOpenInvite] = useState(false)

  const isFollowing = includes(_followingId, userId)

  // Guest guard function that opens modal instead of redirecting
  const ensureAuth = useCallback(() => {
    if (!tokenValidator(dispatch)) {
      setOpenInvite(true)
      return false
    }
    return true
  }, [dispatch])

  // Get admin status from user state
  const { admin } = useSelector((state) => state.user.data || {})
  
  // Query to get user details for tooltips (admin only - skip for non-admin users)
  const { loading: usersLoading, data: usersData, error: usersError } = useQuery(GET_USERS, {
    skip: !admin, // Only query if user is admin
    errorPolicy: 'all', // Don't throw error, handle gracefully
  })

  const getRejectTooltipContent = () => {
    if (!post.rejectedBy || post.rejectedBy.length === 0) {
      return 'No users rejected this post.'
    }

    // If user is not admin, show limited info
    if (!admin) {
      return `${post.rejectedBy.length} user(s) rejected this post.`
    }

    if (usersLoading || !usersData) {
      return 'Loading...'
    }

    if (usersError) {
      return 'Unable to load user details.'
    }

    const rejectedUsers = usersData.users.filter((user) =>
      post.rejectedBy.includes(user._id),
    )

    if (rejectedUsers.length === 0) {
      return 'No users rejected this post.'
    }

    const MAX_DISPLAY = 5
    const displayUsers = rejectedUsers.slice(0, MAX_DISPLAY)
    const remaining = rejectedUsers.length - MAX_DISPLAY

    let content = `Users who rejected this post:\n`
    displayUsers.forEach((user) => {
      content += `• @${user.username}\n`
    })

    if (remaining > 0) {
      content += `\n... and ${remaining} more`
    }

    return content
  }

  const getApproveTooltipContent = () => {
    if (!post.approvedBy || post.approvedBy.length === 0) {
      return 'No users approved this post.'
    }

    // If user is not admin, show limited info
    if (!admin) {
      return `${post.approvedBy.length} user(s) approved this post.`
    }

    if (usersLoading || !usersData) {
      return 'Loading...'
    }

    if (usersError) {
      return 'Unable to load user details.'
    }

    const approvedUsers = usersData.users.filter((user) =>
      post.approvedBy.includes(user._id),
    )

    if (approvedUsers.length === 0) {
      return 'No users approved this post.'
    }

    const MAX_DISPLAY = 5
    const displayUsers = approvedUsers.slice(0, MAX_DISPLAY)
    const remaining = approvedUsers.length - MAX_DISPLAY

    let content = `Users who approved this post:\n`
    displayUsers.forEach((user) => {
      content += `• @${user.username}\n`
    })

    if (remaining > 0) {
      content += `\n... and ${remaining} more`
    }

    return content
  }

  const RejectTooltipContent = () => (
    <div style={{ whiteSpace: 'pre-line' }}>{getRejectTooltipContent()}</div>
  )

  const ApproveTooltipContent = () => (
    <div style={{ whiteSpace: 'pre-line' }}>{getApproveTooltipContent()}</div>
  )

  const handleToggleVoteButtons = async () => {
    if (!ensureAuth()) return
    try {
      await toggleVoting({ variables: { postId: _id } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: post.enable_voting ? 'Voting disabled' : 'Voting enabled',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Toggle voting error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  const [addVote] = useMutation(VOTE, {
    update(
      cache,
      {
        // eslint-disable-next-line no-shadow
        data: { addVote: voteData },
      },
    ) {
      refetchPost?.() // refetch the post to update the votes
    },
    refetchQueries: [
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '' },
      },
      {
        query: GET_POST,
        variables: { postId: _id },
      },
    ],
  })
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '' },
      },
      {
        query: GET_POST,
        variables: { postId: _id },
      },
    ],
  })
  const [addQuote] = useMutation(ADD_QUOTE, {
    refetchQueries: [
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '' },
      },
      {
        query: GET_POST,
        variables: { postId: _id },
      },
      {
        query: GET_USER_ACTIVITY,
        variables: {
          limit: 15,
          offset: 0,
          searchKey: '',
          activityEvent: ['POSTED', 'VOTED', 'COMMENTED', 'QUOTED', 'LIKED'],
          user_id: user._id,
          startDateRange: '',
          endDateRange: '',
        },
      },
    ],
  })

  const [reportPost] = useMutation(REPORT_POST, {
    refetchQueries: [
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '' },
      },
      {
        query: GET_POST,
        variables: { postId: _id },
      },
    ],
  })

  const [approvePost] = useMutation(APPROVE_POST, {
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })
  const [rejectPost] = useMutation(REJECT_POST, {
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })

  const userIdStr = user._id?.toString()
  const hasApproved =
    Array.isArray(post.approvedBy) &&
    post.approvedBy.some((id) => id?.toString() === userIdStr)
  const hasRejected =
    Array.isArray(post.rejectedBy) &&
    post.rejectedBy.some((id) => id?.toString() === userIdStr)

  // Check if user has already voted on this post (ignore deleted votes)
  const hasVoted =
    Array.isArray(post.votedBy) &&
    post.votedBy.some(
      (vote) => vote.userId?.toString() === userIdStr && vote.deleted !== true,
    )

  // Get the user's vote type if they have voted (ignore deleted votes)
  const getUserVoteType = () => {
    if (!hasVoted) return null
    const userVote = post.votedBy.find(
      (vote) => vote.userId?.toString() === userIdStr && vote.deleted !== true,
    )
    return userVote ? userVote.type : null
  }

  const [removeApprove] = useMutation(APPROVE_POST, {
    variables: { postId: _id, userId: user._id },
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })
  const [removeReject] = useMutation(REJECT_POST, {
    variables: { postId: _id, userId: user._id },
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })

  const [deletePost] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }) {
      cache.modify({
        fields: {
          posts(existing = {}, { readField }) {
            if (!existing.entities) return existing
            return {
              ...existing,
              entities: existing.entities.filter(
                (postRef) => readField('_id', postRef) !== deletePost._id,
              ),
            }
          },
          featuredPosts(existing = {}, { readField }) {
            if (!existing.entities) return existing
            return {
              ...existing,
              entities: existing.entities.filter(
                (postRef) => readField('_id', postRef) !== deletePost._id,
              ),
            }
          },
        },
      })
      cache.evict({
        id: cache.identify({ __typename: 'Post', _id: deletePost._id }),
      })
      cache.gc()
    },
    refetchQueries: [
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })

  const [toggleVoting] = useMutation(TOGGLE_VOTING, {
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      {
        query: GET_TOP_POSTS,
        variables: { limit: 5, offset: 0, searchKey: '', interactions: false },
      },
    ],
  })

  // Follow mutation
  const [followMutation] = useMutation(FOLLOW_MUTATION, {
    refetchQueries: [{ query: GET_USER, variables: { username } }],
  })

  const handleFollow = async () => {
    if (!ensureAuth()) return
    const action = isFollowing ? 'un-follow' : 'follow'
    const followingArray = _followingId || []
    const newFollowingArray = isFollowing
      ? without(followingArray, userId)
      : concat(followingArray, userId)
    await updateFollowing(dispatch, newFollowingArray)
    await followMutation({ variables: { user_id: userId, action } })
  }

  // Bookmark mutations
  const [updatePostBookmark] = useMutation(UPDATE_POST_BOOKMARK)
  const [createPostMessageRoom] = useMutation(CREATE_POST_MESSAGE_ROOM)

  const isBookmarked = post.bookmarkedBy && post.bookmarkedBy.includes(user._id)

  const handleBookmark = async () => {
    if (!ensureAuth()) return
    await updatePostBookmark({
      variables: { postId: _id, userId: user._id },
    })
    await createPostMessageRoom({
      variables: { postId: _id },
      refetchQueries: [
        { query: GET_CHAT_ROOMS },
        { query: GET_POST, variables: { postId: _id } },
        { query: GET_USER_ACTIVITY, variables: { user_id: user._id, limit: 5, offset: 0, searchKey: '', activityEvent: [] } },
        { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
      ],
    })
  }

  const handleReportPost = async () => {
    if (!ensureAuth()) return
    try {
      const res = await reportPost({
        variables: { postId: _id, userId: user._id },
      })
      const { reportedBy } = res.data.reportPost
      const reported = reportedBy.length
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Post Reported. Total Reports: ${reported}`,
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  const handleAddComment = async (comment, commentWithQuote = false) => {
    if (!ensureAuth()) return
    let startIndex
    let endIndex
    let quoteText
    if (selectedText) {
      startIndex = selectedText.startIndex
      endIndex = selectedText.endIndex
      quoteText = selectedText.text
    } else {
      startIndex = 0
      endIndex = 0
      quoteText = ''
    }

    const newComment = {
      userId: user._id,
      content: comment,
      startWordIndex: startIndex,
      endWordIndex: endIndex,
      postId: _id,
      url: post.url,
      // hashtags,
      quote: commentWithQuote ? quoteText : '',
    }

    try {
      await addComment({ variables: { comment: newComment } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Commented Successfully',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Comment Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }
  const handleVoting = async (obj) => {
    if (!ensureAuth()) return
    // Check if user has already voted
    if (hasVoted) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'You have already voted on this post',
          type: 'warning',
        }),
      )
      return
    }

    const vote = {
      content: selectedText.text || '',
      postId: post._id,
      userId: user._id,
      type: obj.type,
      tags: obj.tags,
      startWordIndex: selectedText.startIndex,
      endWordIndex: selectedText.endIndex,
    }
    try {
      await addVote({ variables: { vote } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Voted Successfully',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Vote Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }
  const handleAddQuote = async () => {
    if (!ensureAuth()) return
    const quote = {
      quote: selectedText.text,
      postId: post._id,
      quoter: user._id,
      quoted: userId,
      startWordIndex: selectedText.startIndex,
      endWordIndex: selectedText.endIndex,
    }
    try {
      await addQuote({ variables: { quote } })
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: 'Quoted Successfully',
          type: 'success',
        }),
      )
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Quote Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  const handleRedirectToProfile = () => {
    history.push(`/Profile/${username}`)
  }

  const pointsHeader = (
    <div className={classes.points}>
      <span className={classes.votes}>
        {postActions ? postActions.length : '0'}
      </span>
    </div>
  )

  const copyToClipBoard = async () => {
    const baseUrl = window.location.origin
    await copy(`${baseUrl}${history.location.pathname}`)
    setOpen(true)
    // navigator.clipboard.writeText(`www.quote.vote${history.location.pathname}`)
  }

  const hideAlert = () => {
    setOpen(false)
  }

  const handleApprovePost = async () => {
    if (!ensureAuth()) return
    if (hasApproved) {
      // Remove approval (toggle off)
      try {
        await removeApprove({
          variables: { postId: _id, userId: user._id, remove: true },
        })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Approval removed',
            type: 'success',
          }),
        )
      } catch (err) {
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: `Approve Error: ${err.message}`,
            type: 'danger',
          }),
        )
      }
    } else {
      // Approve (and override reject if needed)
      try {
        await approvePost({ variables: { postId: _id, userId: user._id } })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Post Approved',
            type: 'success',
          }),
        )
      } catch (err) {
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: `Approve Error: ${err.message}`,
            type: 'danger',
          }),
        )
      }
    }
  }

  const handleRejectPost = async () => {
    if (!ensureAuth()) return
    if (hasRejected) {
      // Remove rejection (toggle off)
      try {
        await removeReject({
          variables: { postId: _id, userId: user._id, remove: true },
        })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Rejection removed',
            type: 'success',
          }),
        )
      } catch (err) {
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: `Reject Error: ${err.message}`,
            type: 'danger',
          }),
        )
      }
    } else {
      // Reject (and override approve if needed)
      try {
        await rejectPost({ variables: { postId: _id, userId: user._id } })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Post Rejected',
            type: 'success',
          }),
        )
      } catch (err) {
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: `Reject Error: ${err.message}`,
            type: 'danger',
          }),
        )
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deletePost({ variables: { postId: _id } })
      dispatch(
        SET_SNACKBAR({ open: true, message: 'Post deleted', type: 'success' }),
      )
      history.push('/search')
    } catch (err) {
      dispatch(
        SET_SNACKBAR({
          open: true,
          message: `Delete Error: ${err.message}`,
          type: 'danger',
        }),
      )
    }
  }

  return (
    <>
      <Card className={classes.postCard}>
        <CardHeader
          className={classes.header1}
          title={
            <div>
              <span className={classes.title}>{title}</span>
              <IconButton size="small" id="copyBtn" onClick={copyToClipBoard}>
                <LinkIcon />
              </IconButton>
              <IconButton size="small" onClick={handleReportPost}>
                <BlockIcon className={classes.blockIcon} />
              </IconButton>
              {citationUrl && (
                <Chip
                  icon={<LinkIcon style={{ color: '#52b274' }} />}
                  label={`Source: ${getDomain(citationUrl)}`}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => window.open(citationUrl, '_blank', 'noopener,noreferrer')}
                  style={{
                    marginLeft: 8,
                    borderColor: '#52b274',
                    color: '#52b274',
                  }}
                />
              )}
            </div>
          }
          subheader={
            <div>
              <span
                style={{ cursor: 'pointer', fontWeight: 600, color: '#52b274' }}
                onClick={handleRedirectToProfile}
              >
                {name}
              </span>
              <span style={{ color: '#888', marginLeft: 8 }}>
                {parsedCreated}
              </span>
            </div>
          }
          avatar={
            <IconButton size="small" onClick={handleRedirectToProfile}>
              <AvatarDisplay height={40} width={40} {...avatar} />
            </IconButton>
          }
          action={pointsHeader}
        />

        {/* Interaction Header — above the fold, glassmorphism sticky bar */}
        <div className={classes.actionBar}>
          {post.enable_voting && (
            <div className={classes.actionBarSentiment}>
              <Button
                variant={hasRejected ? 'contained' : 'outlined'}
                color="secondary"
                fullWidth
                className={hasRejected ? classes.actionBarDisagreeSelected : classes.actionBarDisagree}
                onClick={handleRejectPost}
                startIcon={<span role="img" aria-label="disagree">&#x274C;</span>}
              >
                Disagree{post.rejectedBy?.length > 0 ? ` (${post.rejectedBy.length})` : ''}
              </Button>
              <Button
                variant="contained"
                fullWidth
                disableElevation
                className={hasApproved ? classes.actionBarSupportSelected : classes.actionBarSupport}
                onClick={handleApprovePost}
                startIcon={<span role="img" aria-label="support">&#x2705;</span>}
              >
                Support{post.approvedBy?.length > 0 ? ` (${post.approvedBy.length})` : ''}
              </Button>
            </div>
          )}
          <div className={classes.actionBarUtilities}>
            <Tooltip title={isFollowing ? 'Unfollow Author' : 'Follow Author'}>
              <IconButton
                size="small"
                className={isFollowing ? classes.actionBarEmojiBtnActive : classes.actionBarEmojiBtn}
                onClick={handleFollow}
              >
                <span role="img" aria-label="follow">&#x1F464;</span>
              </IconButton>
            </Tooltip>
            <Tooltip title={isBookmarked ? 'Bookmarked' : 'Bookmark'}>
              <IconButton
                size="small"
                className={isBookmarked ? classes.actionBarEmojiBtnActive : classes.actionBarEmojiBtn}
                onClick={handleBookmark}
              >
                <span role="img" aria-label="bookmark">&#x1F4BE;</span>
              </IconButton>
            </Tooltip>
            {user._id === userId && (
              <>
                <Divider orientation="vertical" flexItem className={classes.actionBarDivider} />
                <Tooltip title={post.enable_voting ? 'Disable voting on this post' : 'Enable voting on this post'}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={post.enable_voting}
                        onChange={handleToggleVoteButtons}
                        color="primary"
                        size="small"
                      />
                    }
                    label={post.enable_voting ? 'Voting' : 'Voting'}
                    className={classes.actionBarVotingToggle}
                  />
                </Tooltip>
              </>
            )}
            {(user._id === userId || user.admin) && (
              <>
                <Divider orientation="vertical" flexItem className={classes.actionBarDivider} />
                <Tooltip title="Delete Post">
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    className={classes.actionBarDeleteBtn}
                  >
                    <span role="img" aria-label="delete">&#x1F5D1;&#xFE0F;</span>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </div>

        <CardContent
          style={{
            fontSize: '16px',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {hasVoted && (
            <div
              style={{
                backgroundColor: '#e3f2fd',
                padding: '8px 12px',
                borderRadius: '4px',
                marginBottom: '12px',
                border: '1px solid #2196f3',
                color: '#1976d2',
                fontSize: '14px',
              }}
            >
              ✓ You have already{' '}
              {getUserVoteType() === 'up' ? 'upvoted' : 'downvoted'} this post
            </div>
          )}
          <VotingBoard
            content={post.text}
            onSelect={setSelectedText}
            selectedText={selectedText}
            highlights
            votes={post.votes}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            {({ text }) => (
              <VotingPopup
                onVote={handleVoting}
                onAddComment={handleAddComment}
                onAddQuote={handleAddQuote}
                text={text}
                selectedText={selectedText}
                votedBy={serializeVotedBy(post.votedBy)}
                hasVoted={hasVoted}
                userVoteType={getUserVoteType()}
              />
            )}
          </VotingBoard>
        </CardContent>

        {open && (
          <SweetAlert
            confirmBtnCssClass={`${classes.button} ${classes.success}`}
            success
            onConfirm={hideAlert}
            onCancel={hideAlert}
            title="Post URL copied!"
            timeout={1000}
          />
        )}
        <RequestInviteDialog
          open={openInvite}
          onClose={() => setOpenInvite(false)}
        />
      </Card>
    </>
  )
}

Post.propTypes = {
  postActions: PropTypes.array,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  postHeight: PropTypes.number,
}

export default Post
