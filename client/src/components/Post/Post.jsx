import { useMutation } from '@apollo/react-hooks'
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControlLabel,
  IconButton,
} from '@material-ui/core'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import BlockIcon from '@material-ui/icons/Block'
import DeleteIcon from '@material-ui/icons/Delete'
import LinkIcon from '@material-ui/icons/Link'
import copy from 'clipboard-copy'
import FollowButton from 'components/CustomButtons/FollowButton'
import { cloneDeep, findIndex, includes } from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useState } from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import useGuestGuard from 'utils/useGuestGuard'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'
import {
  ADD_COMMENT,
  ADD_QUOTE,
  APPROVE_POST,
  DELETE_POST,
  REJECT_POST,
  REPORT_POST,
  VOTE
} from '../../graphql/mutations'
import {
  GET_POST,
  GET_TOP_POSTS,
  GET_USER_ACTIVITY,
} from '../../graphql/query'
import { SET_SNACKBAR } from '../../store/ui'
import { serializeVotedBy } from '../../utils/objectIdSerializer'
import ApproveRejectPopover from '../ApproveRejectPopver/ApproveRejectPopover'
import AvatarDisplay from '../Avatar'
import ApproveButton from '../CustomButtons/ApproveButton'
import BookmarkIconButton from '../CustomButtons/BookmarkIconButton'
import RejectButton from '../CustomButtons/RejectButton'
import RequestInviteDialog from '../RequestInviteDialog'
import VotingBoard from '../VotingComponents/VotingBoard'
import VotingPopup from '../VotingComponents/VotingPopup'

const useStyles = makeStyles(() => ({
  header2: {
    padding: 0,
    marginLeft: 10,
  },
  title: {
    color: '#00cf6e',
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
    color: '#00cf6e',
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
  ...buttonStyle,
}))

function Post({
  post,
  user,
  postHeight,
  postActions,
}) {
  const classes = useStyles()
  const {
    title, creator, created, _id, userId,
  } = post
  const { name, avatar, username } = creator
  const { _followingId } = user
  const dispatch = useDispatch()
  const history = useHistory()
  const ensureAuth = useGuestGuard()
  const parsedCreated = moment(created).format('LLL')
  
  // State declarations
  const [selectedText, setSelectedText] = useState('')
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [popoverType, setPopoverType] = useState('')
  const [openInvite, setOpenInvite] = useState(false)
  const [showVoteButtons, setShowVoteButtons] = useState(() => {
    const stored = localStorage.getItem(`showVoteButtons-${_id}`)
    return stored ? JSON.parse(stored) : false
  })
  
  const isFollowing = includes(_followingId, userId)

  const handlePopoverOpen = (event, type) => {
    console.log('Popover open:', { type, anchor: event.currentTarget });
    setAnchorEl(event.currentTarget);
    setPopoverType(type);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setPopoverType('')
  }

  const handleToggleVoteButtons = () => {
    if (!showVoteButtons) {
      setShowVoteButtons(true)
      localStorage.setItem(`showVoteButtons-${_id}`, 'true')
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
      const data = cache.readQuery({
        query: GET_POST,
        variables: { postId: _id },
      })
      const clonedPost = cloneDeep(data)

      const index = findIndex(
        clonedPost.post.votedBy,
        (vote) => vote.userId === user._id,
      )
      if (index !== -1) {
        clonedPost.post.votedBy[index].type = voteData.type
        clonedPost.post.upvotes =
          voteData.type === 'up' ?
            clonedPost.post.upvotes + 1 :
            clonedPost.post.upvotes - 1

        clonedPost.post.downvotes =
          voteData.type === 'down' ?
            clonedPost.post.downvotes + 1 :
            clonedPost.post.downvotes - 1
      } else {
        clonedPost.post.votedBy.push({ type: voteData.type, userId: user._id })
        if (voteData.type === 'up') {
          clonedPost.post.upvotes++
        } else {
          clonedPost.post.downvotes++
        }
      }
      cache.writeQuery({
        query: GET_POST,
        variables: { postId: _id },
        data: { ...clonedPost },
      })
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
      { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
    ],
  });
  const [rejectPost] = useMutation(REJECT_POST, {
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
    ],
  });

  const userIdStr = user._id?.toString();
  const hasApproved = Array.isArray(post.approvedBy) && post.approvedBy.some(id => id?.toString() === userIdStr);
  const hasRejected = Array.isArray(post.rejectedBy) && post.rejectedBy.some(id => id?.toString() === userIdStr);

  const [removeApprove] = useMutation(APPROVE_POST, {
    variables: { postId: _id, userId: user._id },
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
    ],
  });
  const [removeReject] = useMutation(REJECT_POST, {
    variables: { postId: _id, userId: user._id },
    refetchQueries: [
      { query: GET_POST, variables: { postId: _id } },
      { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
    ],
  });

  const [deletePost] = useMutation(DELETE_POST, {
    refetchQueries: [
      { query: GET_TOP_POSTS, variables: { limit: 5, offset: 0, searchKey: '', interactions: false } },
    ],
  });

  const handleReportPost = async () => {
    if (!ensureAuth()) return
    try {
      const res = await reportPost({ variables: { postId: _id, userId: user._id } })
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
    const vote = {
      content: selectedText.text,
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

  const handleRedirectToProfile = (profileUsername) => {
    history.push(`/profile/${profileUsername}`)
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

  const cardTitle = (
    <div>
      <span className={classes.title}>{title}</span>
      <IconButton size="small" id="copyBtn" onClick={copyToClipBoard}>
        <LinkIcon />
      </IconButton>
      <IconButton size="small" onClick={handleReportPost}>
        <BlockIcon className={classes.blockIcon} />
      </IconButton>
    </div>
  )

  const handleApprovePost = async () => {
    if (!ensureAuth()) return
    if (hasApproved) {
      // Remove approval (toggle off)
      try {
        await removeApprove({ variables: { postId: _id, userId: user._id, remove: true } });
        dispatch(
          SET_SNACKBAR({ open: true, message: 'Approval removed', type: 'success' })
        );
      } catch (err) {
        dispatch(
          SET_SNACKBAR({ open: true, message: `Approve Error: ${err.message}`, type: 'danger' })
        );
      }
    } else {
      // Approve (and override reject if needed)
      try {
        await approvePost({ variables: { postId: _id, userId: user._id } });
        dispatch(
          SET_SNACKBAR({ open: true, message: 'Post Approved', type: 'success' })
        );
      } catch (err) {
        dispatch(
          SET_SNACKBAR({ open: true, message: `Approve Error: ${err.message}`, type: 'danger' })
        );
      }
    }
  };

  const handleRejectPost = async () => {
    if (!ensureAuth()) return
    if (hasRejected) {
      // Remove rejection (toggle off)
      try {
        await removeReject({ variables: { postId: _id, userId: user._id, remove: true } });
        dispatch(
          SET_SNACKBAR({ open: true, message: 'Rejection removed', type: 'success' })
        );
      } catch (err) {
        dispatch(
          SET_SNACKBAR({ open: true, message: `Reject Error: ${err.message}`, type: 'danger' })
        );
      }
    } else {
      // Reject (and override approve if needed)
      try {
        await rejectPost({ variables: { postId: _id, userId: user._id } });
        dispatch(
          SET_SNACKBAR({ open: true, message: 'Post Rejected', type: 'success' })
        );
      } catch (err) {
        dispatch(
          SET_SNACKBAR({ open: true, message: `Reject Error: ${err.message}`, type: 'danger' })
        );
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost({ variables: { postId: _id } });
      dispatch(
        SET_SNACKBAR({ open: true, message: 'Post deleted', type: 'success' }),
      );
      history.push('/home');
    } catch (err) {
      dispatch(
        SET_SNACKBAR({ open: true, message: `Delete Error: ${err.message}`, type: 'danger' }),
      );
    }
  };

  return (
    <>
      <Card
        style={{
          height: postHeight >= 742 ? '83vh' : 'auto',
          overflow: 'auto',
        }}
      >
        <CardHeader
          className={classes.header1}
          title={cardTitle}
          action={pointsHeader}
        />
        <CardHeader
          className={classes.header2}
          avatar={(
            <IconButton
              size="small"
              onClick={() => handleRedirectToProfile(creator.username)}
            >
              <AvatarDisplay height={40} width={40} {...avatar} />
            </IconButton>
          )}
          title={name}
          subheader={parsedCreated}
        />
        <CardContent style={{ fontSize: '16px' }}>
          <VotingBoard
            content={post.text}
            onSelect={setSelectedText}
            selectedText={selectedText}
            highlights
          >
            {({ text }) => (
              <VotingPopup
                onVote={handleVoting}
                onAddComment={handleAddComment}
                onAddQuote={handleAddQuote}
                text={text}
                selectedText={selectedText}
                votedBy={serializeVotedBy(post.votedBy)}
              />
            )}
          </VotingBoard>
        </CardContent>

        {user._id === userId && !showVoteButtons && (
          <FormControlLabel
            control={(
              <Switch
                checked={showVoteButtons}
                onChange={handleToggleVoteButtons}
                color="primary"
              />
            )}
            label="Enable Voting"
            style={{ marginLeft: 20 }}
          />
        )}

        <CardActions disableSpacing style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: 20 }}>
          {showVoteButtons && (
          <div style={{ display: 'flex', gap: 8 }}>
            <RejectButton
              onMouseOver={(e) => handlePopoverOpen(e, 'rejected')}
              onClick={handleRejectPost}
              selected={hasRejected}
            />
            <ApproveButton
              onMouseOver={(e) => handlePopoverOpen(e, 'approved')}
              onClick={handleApprovePost}
              selected={hasApproved}
            />
            <ApproveRejectPopover
              anchorEl={anchorEl}
              handlePopoverClose={handlePopoverClose}
              type={popoverType}
              rejectedBy={post.rejectedBy}
            />
          </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <FollowButton
              isFollowing={isFollowing}
              profileUserId={userId}
              username={username}
              showIcon
            />
            <BookmarkIconButton post={post} user={user} />
            {(user._id === userId || user.admin) && (
              <IconButton onClick={handleDelete} size="small">
                <DeleteIcon />
              </IconButton>
            )}
            {/* Add chat, person, and heart icons here as needed */}
          </div>
        </CardActions>
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
      </Card>
      <RequestInviteDialog open={openInvite} onClose={() => setOpenInvite(false)} />
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
