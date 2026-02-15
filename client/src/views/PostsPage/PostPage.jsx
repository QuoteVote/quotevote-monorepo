import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { Grid, useMediaQuery, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { Redirect } from 'react-router-dom';
import Post from '../../components/Post/Post';
import PostActionList from '../../components/PostActions/PostActionList';
import PostSkeleton from '../../components/Post/PostSkeleton';
import { GET_ROOM_MESSAGES, GET_POST } from '../../graphql/query';
import { NEW_MESSAGE_SUBSCRIPTION } from '../../graphql/subscription';
import PostChatSend from '../../components/PostChat/PostChatSend';
import { tokenValidator } from 'store/user';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '85vh',
    overflow: 'hidden',
    marginTop: 0,
    width: '100% !important',
    marginLeft: '0 !important',
    marginRight: '0 !important',
    padding: '0 !important',
  },
  mobileContainer: {
    height: '100vh',
    overflow: 'hidden',
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  desktopContainer: {
    height: '85vh',
    maxHeight: '85vh',
    overflow: 'hidden',
    marginTop: 0,
    marginLeft: '0 !important',
    marginRight: '0 !important',
    padding: '0 !important',
    display: 'flex',
    width: '100% !important',
  },
  mobilePostSection: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingBottom: 72,
  },
  desktopPostSection: {
    flex: '0 0 50%',
    height: '85vh',
    overflow: 'auto',
    padding: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  mobileDrawer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'height',
  },
  mobileDrawerCollapsed: {
    height: 56,
  },
  mobileDrawerExpanded: {
    height: '75vh',
  },
  mobileDrawerHandle: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    cursor: 'pointer',
    flexShrink: 0,
    minHeight: 56,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },
  mobileDrawerHandleBar: {
    width: 36,
    height: 4,
    backgroundColor: theme.palette.divider,
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  mobileDrawerLabel: {
    flex: 1,
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  mobileDrawerCount: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(1),
  },
  mobileDrawerContent: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  mobileDrawerInput: {
    flexShrink: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  mobileDrawerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
    transition: 'opacity 0.3s ease',
  },
  desktopInteractionSection: {
    flex: '0 0 50%',
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  desktopMessagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: 0,
    paddingBottom: theme.spacing(1),
  },
  desktopChatInputContainer: {
    marginLeft: 0,
    flexShrink: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  landscapeContainer: {
    height: 'calc(100vh - 80px)',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    boxSizing: 'border-box',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 56px)',
    },
  },
  landscapePostSection: {
    flex: '0 0 50%',
    maxWidth: '50%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: theme.spacing(1),
    boxSizing: 'border-box',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  landscapeRightPanel: {
    flex: '0 0 50%',
    maxWidth: '50%',
    height: '100%',
    position: 'relative',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    overflowY: 'auto',
    paddingBottom: 56,
  },
  landscapeDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px 12px 0 0',
    boxShadow: '0 -2px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'height',
  },
  landscapeDrawerCollapsed: {
    height: 48,
  },
  landscapeDrawerExpanded: {
    height: '80%',
  },
  landscapeDrawerHandle: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    cursor: 'pointer',
    flexShrink: 0,
    minHeight: 48,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: -2,
    },
  },
  landscapeDrawerHandleBar: {
    width: 32,
    height: 3,
    backgroundColor: theme.palette.divider,
    borderRadius: 2,
    position: 'absolute',
    top: 6,
    left: '50%',
    transform: 'translateX(-50%)',
  },
  landscapeDrawerLabel: {
    flex: 1,
    fontWeight: 600,
    fontSize: '0.8rem',
  },
  landscapeDrawerCount: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(0.5),
  },
  landscapeDrawerContent: {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: theme.spacing(1),
  },
  landscapeDrawerInput: {
    flexShrink: 0,
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0.5, 1),
    '& .MuiGrid-container': {
      flexWrap: 'nowrap',
      alignItems: 'flex-end',
      padding: 0,
    },
    '& .MuiPaper-root': {
      display: 'flex',
      alignItems: 'flex-end',
      width: '100%',
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    '& .MuiInputBase-root': {
      width: '100%',
      minHeight: 36,
      maxHeight: 'none',
      borderRadius: 18,
      fontSize: '0.85rem',
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(1),
    },
    '& .MuiIconButton-root': {
      padding: theme.spacing(0.5),
      color: theme.palette.primary.main,
    },
  },
  emptyPost: {
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#00bcd4',
  },
}))

function PostPage({ postId }) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isLandscapeMobile = useMediaQuery(
    '(orientation: landscape) and (max-height: 500px)'
  )
  const [postHeight, setPostHeight] = useState()
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const touchStartY = useRef(null)
  const drawerContentRef = useRef(null)
  const dispatch = useDispatch()

  const toggleChat = useCallback(() => {
    setIsChatExpanded((prev) => !prev)
  }, [])

  const handleDrawerTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleDrawerTouchEnd = useCallback((e) => {
    if (touchStartY.current === null) return
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    touchStartY.current = null
    // Swipe down to collapse (threshold 50px)
    if (deltaY > 50 && isChatExpanded) {
      setIsChatExpanded(false)
    }
    // Swipe up to expand (threshold 50px)
    if (deltaY < -50 && !isChatExpanded) {
      setIsChatExpanded(true)
    }
  }, [isChatExpanded])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleChat()
    }
  }, [toggleChat])

  const idSelector = useSelector((state) => state.ui.selectedPost.id)
  const user = useSelector((state) => state.user.data)

  // Check if user is authenticated
  const isAuthenticated = user && user._id && tokenValidator(dispatch)

  const {
    loading: loadingPost,
    error: postError,
    data: postData,
    refetch: refetchPost,
  } = useQuery(GET_POST, {
    variables: { postId },
  })

  const { post } = (!loadingPost && postData) || {}

  // Open Graph/Twitter meta values
  const ogTitle = post?.title || 'Quote.Vote – The Internet\'s Quote Board';
  const ogDescription = post?.text ? post.text.substring(0, 140) : 'Discover, share, and vote on the best quotes. Join the Quote.Vote community!';
  const ogImage = post?.imageUrl || 'https://quote.vote/og-default.jpg';
  const ogUrl = post ? `https://quote.vote/post/${post._id}` : 'https://quote.vote/';

  // To reset the scroll when the selected post changes
  useEffect(() => {
    window.scrollTo(0, 0)
    if (post) {
      setPostHeight(document.getElementById('post')?.clientHeight)
    }
  }, [post])

  useEffect(() => {
    refetchPost({ postId: idSelector })
  }, [idSelector, refetchPost])

  let messageRoomId
  let title
  let currentPostId
  if (post) {
    messageRoomId = postData.post.messageRoom?._id
    title = postData.post.title
    currentPostId = post._id || postData.post._id
  }

  const {
    loading: loadingMessages,
    error: messageError,
    data: messageData,
    refetch: refetchMessages,
  } = useQuery(GET_ROOM_MESSAGES, {
    skip: !messageRoomId,
    variables: { messageRoomId },
  })

  // Add error logging
  if (messageError) {
    console.error('[CLIENT] PostPage - message query error:', messageError);
  }

  useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    skip: !messageRoomId,
    variables: { messageRoomId },
    onData: async () => {
      await refetchMessages()
    },
  })

  if (postError) return <Redirect to="/error" />

  const { messages } = (!loadingMessages && messageData) || []

  const { comments, votes, quotes } = post || {
    comments: [],
    votes: [],
    quotes: [],
  }

  // Filter out deleted comments
  const filteredComments = comments.filter((c) => !c.deleted)
  // Filter out deleted quotes
  const filteredQuotes = quotes.filter((q) => !q.deleted)
  // Filter out deleted votes
  const filteredVotes = votes.filter((v) => !v.deleted)

  const postActions = useMemo(() => {
    let postActions = []

    if (!isEmpty(filteredComments)) {
      postActions = postActions.concat(
        filteredComments.map((comment) => ({
          ...comment,
          __typename: 'Comment',
          commentQuote:
            comment.endWordIndex > comment.startWordIndex
              ? post.text
                  .substring(comment.startWordIndex, comment.endWordIndex)
                  .replace(/(\r\n|\n|\r)/gm, '')
              : null,
        }))
      )
    }

    if (!isEmpty(filteredVotes)) {
      postActions = postActions.concat(
        filteredVotes.map((vote) => ({
          ...vote,
          __typename: 'Vote',
        }))
      )
    }

    if (!isEmpty(filteredQuotes)) {
      postActions = postActions.concat(
        filteredQuotes.map((quote) => ({
          ...quote,
          __typename: 'Quote',
        }))
      )
    }

    // Add messages to postActions so they get displayed
    if (!isEmpty(messages)) {
      postActions = postActions.concat(
        messages.map((message) => ({
          ...message,
          __typename: 'Message',
          text: message.text, // Ensure text field is present for PostActionCard to recognize it as a message
        }))
      )
    }

    return postActions
  }, [comments, votes, quotes, messages])

  const { url } = (!loadingPost && post) || {}

  if (isLandscapeMobile) {
    // Landscape mobile layout - side by side with collapsible chat drawer
    const discussionCount = postActions.length
    return (
      <>
        <Helmet>
          <title>{ogTitle}</title>
          <meta property="og:title" content={ogTitle} />
          <meta property="og:description" content={ogDescription} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:url" content={ogUrl} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={ogTitle} />
          <meta name="twitter:description" content={ogDescription} />
          <meta name="twitter:image" content={ogImage} />
        </Helmet>
        <div className={classes.landscapeContainer} role="main" aria-label="Post view">
          {/* Left Panel - Post Content */}
          <div className={classes.landscapePostSection} id="post" role="region" aria-label="Post content">
            {loadingPost ? (
              <PostSkeleton />
            ) : (
              <Post
                post={post}
                loading={loadingPost}
                user={user}
                postHeight={postHeight}
                postActions={postActions}
                refetchPost={refetchPost}
              />
            )}
          </div>
          {/* Right Panel - with collapsible chat drawer */}
          <div className={classes.landscapeRightPanel}>
            <PostActionList
              loading={loadingPost}
              postActions={postActions}
              postUrl={url}
              refetchPost={refetchPost}
            />

            {/* Collapsible chat drawer */}
            <div
              className={`${classes.landscapeDrawer} ${
                isChatExpanded ? classes.landscapeDrawerExpanded : classes.landscapeDrawerCollapsed
              }`}
              id="landscape-chat-drawer"
              role="region"
              aria-label="Discussion drawer"
              onTouchStart={handleDrawerTouchStart}
              onTouchEnd={handleDrawerTouchEnd}
            >
              <div className={classes.landscapeDrawerHandleBar} />
              <div
                className={classes.landscapeDrawerHandle}
                onClick={toggleChat}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                aria-expanded={isChatExpanded}
                aria-controls="landscape-chat-drawer-content"
                aria-label={`${isChatExpanded ? 'Collapse' : 'Expand'} discussion. ${discussionCount} items.`}
              >
                <Typography className={classes.landscapeDrawerLabel}>
                  Open Discussion
                </Typography>
                <span className={classes.landscapeDrawerCount}>
                  {discussionCount > 0 ? discussionCount : ''}
                </span>
                {isChatExpanded ? (
                  <KeyboardArrowDown style={{ fontSize: 18 }} />
                ) : (
                  <KeyboardArrowUp style={{ fontSize: 18 }} />
                )}
              </div>

              {isChatExpanded && (
                <>
                  <div
                    className={classes.landscapeDrawerContent}
                    id="landscape-chat-drawer-content"
                  >
                    <PostActionList
                      loading={loadingPost}
                      postActions={postActions}
                      postUrl={url}
                      refetchPost={refetchPost}
                    />
                  </div>
                  <div className={classes.landscapeDrawerInput}>
                    <PostChatSend messageRoomId={messageRoomId} title={title} postId={currentPostId} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }

  if (isMobile) {
    // Mobile portrait layout - collapsible chat drawer
    const discussionCount = postActions.length
    return (
      <>
        <Helmet>
          <title>{ogTitle}</title>
          <meta property="og:title" content={ogTitle} />
          <meta property="og:description" content={ogDescription} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:url" content={ogUrl} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={ogTitle} />
          <meta name="twitter:description" content={ogDescription} />
          <meta name="twitter:image" content={ogImage} />
        </Helmet>
        <div className={classes.mobileContainer}>
          <div className={classes.mobilePostSection} id="post">
            {loadingPost ? (
              <PostSkeleton />
            ) : (
              <Post
                post={post}
                loading={loadingPost}
                user={user}
                postHeight={postHeight}
                postActions={postActions}
                refetchPost={refetchPost}
              />
            )}
          </div>

          {/* Overlay backdrop when drawer is expanded */}
          {isChatExpanded && (
            <div
              className={classes.mobileDrawerOverlay}
              onClick={() => setIsChatExpanded(false)}
              aria-hidden="true"
            />
          )}

          {/* Collapsible chat drawer */}
          <div
            className={`${classes.mobileDrawer} ${
              isChatExpanded ? classes.mobileDrawerExpanded : classes.mobileDrawerCollapsed
            }`}
            id="chat-drawer"
            role="region"
            aria-label="Discussion drawer"
            onTouchStart={handleDrawerTouchStart}
            onTouchEnd={handleDrawerTouchEnd}
          >
            <div className={classes.mobileDrawerHandleBar} />
            <div
              className={classes.mobileDrawerHandle}
              onClick={toggleChat}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-expanded={isChatExpanded}
              aria-controls="chat-drawer-content"
              aria-label={`${isChatExpanded ? 'Collapse' : 'Expand'} discussion. ${discussionCount} items.`}
            >
              <Typography className={classes.mobileDrawerLabel}>
                Open Discussion
              </Typography>
              <span className={classes.mobileDrawerCount}>
                {discussionCount > 0 ? discussionCount : ''}
              </span>
              {isChatExpanded ? (
                <KeyboardArrowDown fontSize="small" />
              ) : (
                <KeyboardArrowUp fontSize="small" />
              )}
            </div>

            {isChatExpanded && (
              <>
                <div
                  className={classes.mobileDrawerContent}
                  id="chat-drawer-content"
                  ref={drawerContentRef}
                >
                  <PostActionList
                    loading={loadingPost}
                    postActions={postActions}
                    postUrl={url}
                    refetchPost={refetchPost}
                  />
                </div>
                <div className={classes.mobileDrawerInput}>
                  <PostChatSend messageRoomId={messageRoomId} title={title} postId={currentPostId} />
                </div>
              </>
            )}
          </div>
        </div>
      </>
    )
  }

  // Desktop layout - side by side panels
  return (
    <>
      <Helmet>
        <title>{ogTitle}</title>
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className={classes.desktopContainer}>
        {/* Left Panel - Post Content */}
        <div className={classes.desktopPostSection} id="post">
          {loadingPost ? (
            <PostSkeleton />
          ) : (
            <Post
              post={post}
              loading={loadingPost}
              user={user}
              postHeight={postHeight}
              postActions={postActions}
              refetchPost={refetchPost}
            />
          )}
        </div>
        {/* Right Panel - Actions, Chat Messages, and Chat Input */}
        <div className={classes.desktopInteractionSection}>
          <div className={classes.desktopMessagesContainer}>
            <PostActionList
              loading={loadingPost}
              postActions={postActions}
              postUrl={url}
              refetchPost={refetchPost}
            />
          </div>
          <div className={classes.desktopChatInputContainer}>
            <PostChatSend messageRoomId={messageRoomId} title={title} postId={currentPostId} />
          </div>
        </div>
      </div>
    </>
  )
}

PostPage.propTypes = {
  postId: PropTypes.string,
}

export default PostPage
