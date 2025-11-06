import { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { Grid, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
    height: '85vh',
    maxHeight: '100vh',
    overflow: 'hidden',
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
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
    flex: '0 0 auto',
    maxHeight: '40vh',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  desktopPostSection: {
    flex: '0 0 50%',
    height: '85vh',
    overflow: 'auto',
    padding: 0,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  mobileInteractionSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    position: 'relative',
  },
  mobileMessagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(8),
  },
  mobileChatInputContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
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
  const [postHeight, setPostHeight] = useState()
  const dispatch = useDispatch()

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
    onSubscriptionData: async () => {
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

  if (isMobile) {
    // Mobile layout - vertical stacking
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
          <div className={classes.mobileInteractionSection}>
            <div className={classes.mobileMessagesContainer}>
              <PostActionList
                loading={loadingPost}
                postActions={postActions}
                postUrl={url}
                refetchPost={refetchPost}
              />
            </div>
            <div className={classes.mobileChatInputContainer}>
              <PostChatSend messageRoomId={messageRoomId} title={title} postId={currentPostId} />
            </div>
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
