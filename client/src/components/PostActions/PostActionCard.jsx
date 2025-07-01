import { useQuery } from '@apollo/react-hooks'
import {
  Card, CardActions, CardContent, IconButton,
  SvgIcon,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { InsertLink } from '@material-ui/icons'
import copy from 'clipboard-copy'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'
import DislikeIcon from '../../assets/svg/Dislike.jsx'
import LikeIcon from '../../assets/svg/Like.jsx'
import { GET_ACTION_REACTIONS } from '../../graphql/query'
import { SET_FOCUSED_COMMENT, SET_SHARED_COMMENT } from '../../store/ui'
import { parseCommentDate } from '../../utils/momentUtils'
import AvatarDisplay from '../Avatar'
import CommentReactions from '../Comment/CommentReactions'
import PostChatMessage from '../PostChat/PostChatMessage'

const useStyles = makeStyles((theme) => ({
  content: {
    marginLeft: 10,
    marginRight: 40,
    marginBottom: -20,
    fontSize: 16,
  },
  expand: {
    marginLeft: 'auto',
  },
  created: {
    verticalAlign: 'middle',
    marginTop: 20,
    marginRight: 10,
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
  selectedRoot: {
    backgroundColor: '#f1e8c1',
    width: '100%',
  },
  ...buttonStyle,
  date: {
    color: '#949292',
  },
}))

function PostActionCard({ postAction, postUrl, selected }) {
  const [commentSelected, setCommentSelected] = useState()
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const {
    user, content, created, _id,
  } = postAction
  const { username, avatar, name } = user
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

  let postContent = content
  let svgIcon
  let voteTags = ''

  const handleClick = () => {
    if (!commentSelected) {
      dispatch(SET_FOCUSED_COMMENT(postAction))
      setCommentSelected(true)
    } else {
      dispatch(SET_FOCUSED_COMMENT(sharedComment))
      setCommentSelected(false)
    }
  }

  const handleRedirectToProfile = () => {
    history.push(`/profile/${username}`)
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
    return (
      <PostChatMessage message={postAction} key={postAction._id} />
    )
  }

  return (
    <Card
      onClick={() => handleClick()}
      className={selected ? classes.selectedRoot : classes.root}
    >
      <IconButton
        onClick={() => handleRedirectToProfile()}
      >
        <AvatarDisplay height={20} width={20} {...avatar} />
      </IconButton>
      <Typography display="inline">
        {name}
        {' '}
        <span className={classes.date}>{parsedDate}</span>
      </Typography>
      {!voteType && (
        <CardContent
          className={classes.content}
        >
          <p>
            {postContent}
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
      </CardActions>
      {open && (
        <SweetAlert
          confirmBtnCssClass={`${classes.button} ${classes.success}`}
          success
          onConfirm={hideAlert}
          onCancel={hideAlert}
          title="Comment URL copied!"
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
