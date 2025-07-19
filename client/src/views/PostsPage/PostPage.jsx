import { useEffect, useState, useMemo } from 'react';
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
    marginTop: 10,
  },
  mobileContainer: {
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden',
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  desktopContainer: {
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden',
    marginTop: 10,
  },
  mobilePostSection: {
    flex: '0 0 auto',
    maxHeight: '40vh',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  desktopPostSection: {
    height: '100%',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  mobileInteractionSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0, // Important for flex child
    position: 'relative',
  },
  mobileMessagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
    // Add bottom padding to account for fixed chat input
    paddingBottom: theme.spacing(8), // Adjust based on chat input height
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
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  desktopMessagesContainer: {
    flex: 1,
    overflow: 'auto',
    marginBottom: theme.spacing(2),
  },
  desktopChatInputContainer: {
    flexShrink: 0,
    padding: 0,
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

  // To reset the scroll when the selected post changes
  useEffect(() => {
    window.scrollTo(0, 0)
    if (post) {
      setPostHeight(document.getElementById('post').clientHeight)
    }
  }, [post])

  useEffect(() => {
    refetchPost({ postId: idSelector })
  }, [idSelector, refetchPost])

  let messageRoomId
  let title
  if (post) {
    messageRoomId = postData.post.messageRoom._id
    title = postData.post.title
  }

  const {
    loading: loadingMessages,
    data: messageData,
    refetch: refetchMessages,
  } = useQuery(GET_ROOM_MESSAGES, {
    skip: !messageRoomId, // Allow all users (including guests) to see messages
    variables: { messageRoomId },
  })

  useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
    skip: !messageRoomId, // Allow all users (including guests) to see new messages
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

  const postActions = useMemo(() => {
    let postActions = []

    if (!isEmpty(comments)) {
      const commentsWithContent = comments.map((comment) => ({
        ...comment,
        commentQuote: post.text
          .substring(comment.startWordIndex, comment.endWordIndex)
          .replace(/(\r\n|\n|\r)/gm, ''),
      }))
      postActions = postActions.concat(commentsWithContent)
    }

    if (!isEmpty(votes)) {
      // Add voted text content to each vote based on startWordIndex and endWordIndex
      const votesWithContent = votes.map((vote) => ({
        ...vote,
        content: post.text
          .substring(vote.startWordIndex, vote.endWordIndex)
          .replace(/(\r\n|\n|\r)/gm, ''),
      }))
      postActions = postActions.concat(votesWithContent)
    }

    if (!isEmpty(quotes)) {
      postActions = postActions.concat(quotes)
    }

    // Include messages for all users (guests can view but not interact)
    if (!isEmpty(messages)) {
      postActions = postActions.concat(messages)
    }

    return postActions
  }, [comments, votes, quotes, messages, post, isAuthenticated])

  if (!loadingPost && !post) {
    return <Redirect to="/error" />
  }

  const { url } = (!loadingPost && post) || {}

  return (
    <Grid
      container
      direction={{ xs: 'column', md: 'row' }}
      justify={{ xs: 'flex-start', md: 'space-around' }}
      alignItems={{ xs: 'stretch', md: 'flex-start' }}
      spacing={4}
      className={isMobile ? classes.mobileContainer : classes.desktopContainer}
      style={{ position: 'relative' }}
    >
      <Grid 
        item 
        xs={12} 
        md={6} // Always use 6 columns for post section
        id="post"
        className={isMobile ? classes.mobilePostSection : classes.desktopPostSection}
      >
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
      </Grid>
      {/* Show interaction section for all users (guests can view but not interact) */}
        <Grid 
          item 
          xs={12} 
          md={6}
          className={isMobile ? classes.mobileInteractionSection : classes.desktopInteractionSection}
        >
          <div className={isMobile ? classes.mobileMessagesContainer : classes.desktopMessagesContainer}>
            <PostActionList
              loading={loadingPost}
              postActions={postActions}
              postUrl={url}
            />
          </div>
          <div className={isMobile ? classes.mobileChatInputContainer : classes.desktopChatInputContainer}>
            <PostChatSend messageRoomId={messageRoomId} title={title} />
          </div>
        </Grid>
    </Grid>
  )
}

PostPage.propTypes = {
  postId: PropTypes.string,
}

export default PostPage
