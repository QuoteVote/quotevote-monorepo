/* eslint-disable react/prop-types */
import { makeStyles } from '@material-ui/core/styles'
import { useState, useEffect } from 'react'

import {
    Paper,
    Input,
    InputAdornment,
    IconButton,
    Button,
    ButtonGroup,
    Zoom,
    Tooltip,
    SvgIcon,
    Grid,
} from '@material-ui/core'
import { isEmpty, findIndex } from 'lodash'
import { useSelector } from 'react-redux'
import DislikeIcon from '../../assets/svg/Dislike.jsx'
import LikeIcon from '../../assets/svg/Like.jsx'
import CommentIcon from '../../assets/svg/Comment.jsx'
import QuoteIcon from '../../assets/svg/Quote.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paperExpaned: {
    margin: theme.spacing(1),
    backgroundColor: 'white',
    padding: '33px 15px 10px 15px',
    width: 310,
    position: 'absolute',
    top: 205,
  },
  paperExpanedSmall: {
    margin: theme.spacing(1),
    backgroundColor: 'white',
    padding: '33px 15px 10px 15px',
    width: 270,
    position: 'absolute',
    top: 205,
  },
  icon: { fontSize: 40 },
  input: {
    color: '#3c4858cc',
    paddingBottom: 1,
    '&::before': {
      pointerEvents: 'auto',
    },
  },
  button: {
    backgroundColor: '#52b274',
    color: 'white',
  },
  btnGroup: {
    textTransform: 'none',
  },
}))

const VotingPopup = ({
  votedBy, onVote, onAddComment, onAddQuote, selectedText, hasVoted, userVoteType,
}) => {
  const classes = useStyles()
  const { user } = useSelector((state) => state)
  const [expand, setExpand] = useState({ open: false, type: '' })
  const [comment, setComment] = useState('')
  const [checkWindowWidth, setCheckWindowWidth] = useState(true)

  const handleWindowSizeChange = () => {
    if (window.innerWidth < 400) {
      setCheckWindowWidth(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  let voteOptions = []

  if (expand.type === 'up') {
    voteOptions = ['#true', '#agree', '#like']
  }

  if (expand.type === 'down') {
    voteOptions = ['#false', '#disagree', '#dislike']
  }

  let showUpvoteTooltip = false
  let showDownvoteTooltip = false
  const index = findIndex(votedBy, (vote) => vote.userId === user._id)
  if (index !== -1) {
    if (votedBy[index].type === 'up') {
      showUpvoteTooltip = true
    } else {
      showDownvoteTooltip = true
    }
  }
  const handleVote = (tags) => {
    if (hasVoted) {
      return // Don't allow voting if user has already voted
    }
    onVote({ type: expand.type, tags })
    setExpand({ open: false, type: '' })
  }

  const handleAddComment = () => {
    const withQuote = !isEmpty(selectedText.text)
    onAddComment(comment, withQuote)
    /* setTimeout(() => { this.setState({ isCommenting: false })}, 500) */
    setComment('')
    setExpand({ open: false, type: '' })
  }

  const handleAddQuote = () => {
    onAddQuote()
    setExpand({ open: false, type: '' })
  }

  useEffect(() => {
    const selectionPopover = document.querySelector('#popButtons')
    selectionPopover.addEventListener('mousedown', (e) => {
      e.preventDefault()
    })
  })

  let inputValue = comment

  const isComment = expand.type === 'comment'

  if (!isComment) {
    if (expand.type === 'up') {
      inputValue = '#true | #agree | #like'
    } else {
      inputValue = '#false | #disagree | #dislike'
    }
  }

  return (
    <>
      <Paper
        style={{
          backgroundImage: 'linear-gradient(to top, #1bb5d8, #4066ec)',
          width: checkWindowWidth ? 285 : 240,
          zIndex: 1,
          top: expand.open ? 181 : 170,
          left: 20,
          position: 'absolute',
        }}
      >
        <Grid container>
          <Grid item xs={3} style={{ backgroundColor: expand.type === 'up' ? '#2475b0' : 'transparent' }}>
            {hasVoted ? (
              <Tooltip title={`You have already ${userVoteType === 'up' ? 'upvoted' : 'downvoted'} this post`} placement="bottom" arrow>
                <span>
                  <IconButton disabled>
                    <SvgIcon
                      component={LikeIcon}
                      fontSize="large"
                      viewBox="0 0 30 30"
                      style={{ opacity: 0.5 }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            ) : showUpvoteTooltip ? (
              <Tooltip title="Upvoted" placement="bottom" arrow>
                <IconButton>
                  <SvgIcon
                    component={LikeIcon}
                    fontSize="large"
                    viewBox="0 0 30 30"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton 
                onClick={() => {
                  if (!hasVoted) {
                    setExpand({ open: expand.type !== 'up' || !expand.open, type: 'up' })
                  }
                }}
              >
                <SvgIcon
                  component={LikeIcon}
                  fontSize="large"
                  viewBox="0 0 30 30"
                />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={3} style={{ backgroundColor: expand.type === 'down' ? '#2475b0' : 'transparent' }}>
            {hasVoted ? (
              <Tooltip title={`You have already ${userVoteType === 'up' ? 'upvoted' : 'downvoted'} this post`} placement="bottom" arrow>
                <span>
                  <IconButton disabled>
                    <SvgIcon
                      component={DislikeIcon}
                      fontSize="large"
                      viewBox="0 0 30 30"
                      style={{ opacity: 0.5 }}
                    />
                  </IconButton>
                </span>
              </Tooltip>
            ) : showDownvoteTooltip ? (
              <Tooltip title="Downvoted" placement="bottom" arrow>
                <IconButton>
                  <SvgIcon
                    component={DislikeIcon}
                    fontSize="large"
                    viewBox="0 0 30 30"
                  />
                </IconButton>
              </Tooltip>
            ) : (
              <IconButton 
                onClick={() => {
                  if (!hasVoted) {
                    setExpand({ open: expand.type !== 'down' || !expand.open, type: 'down' })
                  }
                }}
              >
                <SvgIcon
                  component={DislikeIcon}
                  fontSize="large"
                  viewBox="0 0 30 30"
                />
              </IconButton>
            )}
          </Grid>
          <Grid item xs={3} style={{ backgroundColor: expand.type === 'comment' ? '#2475b0' : 'transparent' }}>
            <IconButton onClick={() => setExpand({ open: expand.type !== 'comment' || !expand.open, type: 'comment' })}>
              <SvgIcon
                component={CommentIcon}
                fontSize="large"
                viewBox="0 0 30 30"
              />
            </IconButton>
          </Grid>
          <Grid item xs={3} style={{ backgroundColor: expand.type === 'quote' ? '#2475b0' : 'transparent' }}>
            <IconButton
              onClick={() => {
                const newQuote = expand.type !== 'quote'
                setExpand({ open: false, type: newQuote ? 'quote' : '' })
                if (newQuote) {
                  handleAddQuote()
                }
              }}
            >
              <SvgIcon
                component={QuoteIcon}
                fontSize="large"
                viewBox="0 0 25 15"
                htmlColor="white"
              />
            </IconButton>
          </Grid>
        </Grid>
      </Paper>
      <Zoom in={expand.open}>
        <Paper id="popButtons" elevation={4} className={checkWindowWidth ? classes.paperExpaned : classes.paperExpanedSmall}>
          {isComment ? (
            <Input
              placeholder="Type comment here"
              className={classes.input}
              endAdornment={(
                <InputAdornment position="end">
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={handleAddComment}
                  >
                    Send
                  </Button>
                </InputAdornment>
              )}
              value={inputValue}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleAddComment()
                }
              }}
            />
          ) : (
            <div className={classes.root}>
              <ButtonGroup variant="text" color="inherit" size="small">
                {voteOptions.map((option) => <Button key={option} className={classes.btnGroup} onClick={() => handleVote(option)}>{option}</Button>)}
              </ButtonGroup>
            </div>
          )}
        </Paper>
      </Zoom>
    </>
  )
}

export default VotingPopup
