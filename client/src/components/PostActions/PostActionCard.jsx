import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card, CardActions, CardContent, IconButton, Typography,
} from '@mui/material'
import { InsertLink, Delete } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { get, isEmpty } from 'lodash'
import copy from 'clipboard-copy'
import SweetAlert from 'react-bootstrap-sweetalert'
import AvatarDisplay from '../Avatar'
import { parseCommentDate } from '../../utils/momentUtils'
import { SET_FOCUSED_COMMENT, SET_SHARED_COMMENT, SET_SNACKBAR } from '../../store/ui'
import { DELETE_VOTE, DELETE_COMMENT, DELETE_QUOTE } from '../../graphql/mutations'
import { GET_ACTION_REACTIONS } from '../../graphql/query'
import CommentReactions from '../Comment/CommentReactions'
import PostChatMessage from '../PostChat/PostChatMessage'
import LikeIcon from '../../assets/svg/Like.jsx'
import DislikeIcon from '../../assets/svg/Dislike.jsx'
import { SvgIcon } from '@mui/material'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  selectedRoot: {
    backgroundColor: '#f1e8c1',
    width: '100%',
  },
  content: {
    marginLeft: 60,
    marginRight: 40,
    marginTop: -20,
    marginBottom: -20,
  },
  expand: {
    marginLeft: 'auto',
  },
  userContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto auto',
    columnGap: 0,
    alignItems: 'start',
    '& > .MuiIconButton-root': {
      gridRow: '1 / 3',
      gridColumn: 1,
      padding: 0,
    },
  },
  userInfo: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridRow: '1 / 3',
    gridColumn: 2,
  },
  userName: {
    padding: '0.5em 0em 0em 0em',
    fontWeight: 600,
    color: '#52b274',
    gridRow: 1,
    gridColumn: 1,
    cursor: 'pointer',
  },
  date: {
    gridRow: 2,
    gridColumn: 1,
    fontSize: '0.85em',
    color: '#888',
  },
  deleteIcon: {
    color: '#f44336',
  },
  ...buttonStyle,
}))

function PostActionCard({ postAction, postUrl, selected, refetchPost }) {
  const [commentSelected, setCommentSelected] = useState()
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const { user: actionUser, content, created, _id } = postAction
  const { username, avatar, name } = actionUser
  const parsedDate = parseCommentDate(created)
  const voteType = get(postAction, 'type')
  const quote = get(postAction, 'quote')
  const sharedComment = useSelector((state) => state.ui.sharedComment)
  const { loading, data } = useQuery(GET_ACTION_REACTIONS, {
    variables: { actionId: _id },
  })

  const { actionReactions } = (!loading && data) || []

  const baseUrl = window.location.origin
  const handleCopy = async () => {
    await copy(`${baseUrl}${postUrl}/comment#${_id}`)
    setOpen(true)
  }
  const [open, setOpen] = useState(false)
  const hideAlert = () => {
    setOpen(false)
  }
  const type = postAction.__typename
  let postContent = content
  let svgIcon
  let voteTags = ''

  const [deleteVote] = useMutation(DELETE_VOTE, {
    update(cache, { data: { deleteVote } }) {
      cache.modify({
        fields: {
          votes(existing = [], { readField }) {
            return existing.filter(
              (voteRef) => readField('_id', voteRef) !== deleteVote._id,
            )
          },
        },
      })
    },
  })

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update(cache, { data: { deleteComment } }) {
      cache.modify({
        fields: {
          comments(existing = [], { readField }) {
            return existing.filter(
              (commentRef) => readField('_id', commentRef) !== deleteComment._id,
            )
          },
        },
      })
    },
  })

  const [deleteQuote] = useMutation(DELETE_QUOTE, {
    update(cache, { data: { deleteQuote } }) {
      cache.modify({
        fields: {
          quotes(existing = [], { readField }) {
            return existing.filter(
              (quoteRef) => readField('_id', quoteRef) !== deleteQuote._id,
            )
          },
        },
      })
    },
  })

  const handleDelete = async () => {
    try {
      if (type === 'Vote') {
        await deleteVote({ variables: { voteId: _id } })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Vote deleted successfully',
            type: 'success',
          }),
        )
        if (refetchPost) refetchPost()
      } else if (type === 'Comment') {
        await deleteComment({ variables: { commentId: _id } })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Comment deleted successfully',
            type: 'success',
          }),
        )
        if (refetchPost) refetchPost()
      } else if (type === 'Quote') {
        await deleteQuote({ variables: { quoteId: _id } })
        dispatch(
          SET_SNACKBAR({
            open: true,
            message: 'Quote deleted successfully',
            type: 'success',
          }),
        )
        if (refetchPost) refetchPost()
      }
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

  const handleClick = useCallback(() => {
    if (!commentSelected) {
      dispatch(SET_FOCUSED_COMMENT(postAction))
      setCommentSelected(true)
    } else {
      dispatch(SET_FOCUSED_COMMENT(sharedComment))
      setCommentSelected(false)
    }
  }, [commentSelected, dispatch, postAction, sharedComment])

  const handleRedirectToProfile = () => {
    history.push(`/Profile/${username}`)
  }

  if (voteType) {
    const isUpvote = voteType === 'up'
    const defaultTag = isUpvote ? '#agree' : '#disagree'
    svgIcon = isUpvote ? LikeIcon : DislikeIcon
    voteTags = get(postAction, 'tags') || defaultTag
  }

  if (quote) {
    postContent = quote.length ? quote : 'Quoted this post.'
  }

  useEffect(() => {
    if (selected) {
      dispatch(SET_SHARED_COMMENT(postAction))
      dispatch(SET_FOCUSED_COMMENT(postAction))
    }
  }, [postAction, selected, dispatch])

  if (postAction.text) {
    return <PostChatMessage message={postAction} key={postAction._id} />
  }

  return (
    <Card
      onClick={() => handleClick()}
      className={selected ? classes.selectedRoot : classes.root}
    >
      <div className={classes.userContainer}>
        <IconButton onClick={() => handleRedirectToProfile()}>
          <AvatarDisplay height={20} width={20} {...avatar} />
        </IconButton>

        <Typography display="inline" className={classes.userInfo}>
          <span
            className={classes.userName}
            onClick={(e) => {
              e.stopPropagation();
              handleRedirectToProfile();
            }}
          >
            {name}
            {type === 'Vote' && username}
          </span>
          <span className={classes.date}>{parsedDate}</span>
        </Typography>
      </div>
      {type === 'Vote' && (
        <CardContent className={classes.content}>
          <Typography display="inline">
            {`❝ ${postAction.content ? postAction.content : '(no text selected)'} ❞`}
          </Typography>
        </CardContent>
      )}
      {!voteType && (
        <CardContent className={classes.content}>
          <p>
            {type === 'Quote' && '❝ '}
            {postContent}
            {username}
            {type === 'Quote' && ' ❞'}
          </p>
          <p>
            {type === 'Comment' &&
              postAction.commentQuote &&
              `❝ ${postAction.commentQuote} ❞`}
          </p>
        </CardContent>
      )}
      <CardActions disableSpacing>
        <SvgIcon
          component={svgIcon}
          fontSize="large"
          viewBox="-10 -10 50 50"
          htmlColor="black"
        />
        <Typography display="inline">{voteTags}</Typography>
        <div className={classes.expand}>
          <CommentReactions actionId={_id} reactions={actionReactions} />
        </div>
        <IconButton onClick={handleCopy}>
          <InsertLink />
        </IconButton>
        {(user._id === actionUser._id || user.admin) && (
          <IconButton onClick={handleDelete} className={classes.deleteIcon}>
            <Delete />
          </IconButton>
        )}
      </CardActions>
      {open && (
        <SweetAlert
          confirmBtnCssClass={`${classes.button} ${classes.success}`}
          success
          onConfirm={hideAlert}
          onCancel={hideAlert}
          title="Link copied!"
          timeout={1000}
        />
      )}
    </Card>
  )
}

PostActionCard.propTypes = {
  postAction: PropTypes.object.isRequired,
  postUrl: PropTypes.string,
  selected: PropTypes.bool,
}

export default PostActionCard