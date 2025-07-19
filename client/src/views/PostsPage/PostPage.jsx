import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Grid, useMediaQuery } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { Redirect } from 'react-router-dom';
import Post from '../../components/Post/Post';
import PostActionList from '../../components/PostActions/PostActionList';
import PostSkeleton from '../../components/Post/PostSkeleton';
import { GET_ROOM_MESSAGES, GET_POST } from '../../graphql/query';
import { NEW_MESSAGE_SUBSCRIPTION } from '../../graphql/subscription';
import PostChatSend from '../../components/PostChat/PostChatSend';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 10,
  },
  mobileContainer: {
    height: '100vh',
    maxHeight: '100vh',
    overflow: 'hidden',
    marginTop: 0,
  },
  desktopContainer: {
    marginTop: 10,
  },
  mobilePostSection: {
    height: '50vh',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  mobileInteractionSection: {
    height: '50vh',
    overflow: 'auto',
    padding: theme.spacing(2),
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

  const idSelector = useSelector((state) => state.ui.selectedPost.id)
  const user = useSelector((state) => state.user.data)

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
    skip: !messageRoomId,
    variables: { messageRoomId },
  })

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

    if (!isEmpty(messages)) {
      postActions = postActions.concat(messages)
    }

    return postActions
  }, [comments, votes, quotes, messages, post])

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
        md={6} 
        id="post"
        className={isMobile ? classes.mobilePostSection : ''}
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
      <Grid 
        item 
        xs={12} 
        md={6}
        className={isMobile ? classes.mobileInteractionSection : ''}
      >
        <PostChatSend messageRoomId={messageRoomId} title={title} />
        <PostActionList
          loading={loadingPost}
          postActions={postActions}
          postUrl={url}
        />
      </Grid>
    </Grid>
  )
}

PostPage.propTypes = {
  postId: PropTypes.string,
}

export default PostPage
