import { useMutation } from '@apollo/react-hooks'
import { Box } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroller'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { tokenValidator } from 'store/user'
import { CREATE_POST_MESSAGE_ROOM, UPDATE_POST_BOOKMARK } from '../../graphql/mutations'
import {
  GET_CHAT_ROOMS, GET_POST, GET_TOP_POSTS, GET_USER_ACTIVITY,
} from '../../graphql/query'
import { SET_SELECTED_POST } from '../../store/ui'
import { ActivityCard } from '../../ui/ActivityCard'
import { useWidth } from '../../utils/display'
import getActivityContent from '../../utils/getActivityContent'
import getCardBackgroundColor from '../../utils/getCardBackgroundColor'
import AlertSkeletonLoader from '../AlertSkeletonLoader'
import LoadingSpinner from '../LoadingSpinner'
import ActivityEmptyList from './ActivityEmptyList'

function LoadActivityCard({ width, activity }) {
  const {
    post, user, quote, comment, vote, created, activityType,
  } = activity
  
  // Add null check for post before destructuring
  if (!post) {
    return null // or return a placeholder component
  }
  
  const {
    url, bookmarkedBy, upvotes, downvotes, comments, votes, quotes, messageRoom,
  } = post
  const { messages } = messageRoom
  const postId = post._id
  const { username, avatar, name } = user
  const currentUser = useSelector((state) => state.user.data)
  const [createPostMessageRoom] = useMutation(CREATE_POST_MESSAGE_ROOM)
  const [updatePostBookmark] = useMutation(UPDATE_POST_BOOKMARK)
  const limit = 5
  const type = activityType === 'VOTED' ? `${vote.type}${activity.activityType}` : activity.activityType
  const content = getActivityContent(type, post, quote, vote, comment)
  const handleLike = async () => {
    await updatePostBookmark({
      variables: { postId, userId: currentUser._id },
    })

    await createPostMessageRoom({
      variables: { postId },
      refetchQueries: [
        {
          query: GET_CHAT_ROOMS,
        },
        {
          query: GET_POST,
          variables: {
            postId,
          },
        },
        {
          query: GET_USER_ACTIVITY,
          variables: {
            user_id: currentUser._id,
            limit,
            offset: 0,
            searchKey: '',
            activityEvent: [],
          },
        },
        {
          query: GET_TOP_POSTS,
          variables: { limit, offset: 0, searchKey: '', interactions: false },
        },
      ],
    })
  }
  const history = useHistory()
  const handleRedirectToProfile = () => {
    history.push(`/profile/${username}`)
  }
  const isLiked = bookmarkedBy.includes(currentUser._id)
  const dispatch = useDispatch()
  const handleCardClick = () => {
    // Check if user is in guest mode (no valid token)
    if (!tokenValidator(dispatch)) {
      // Redirect to search page for guest users
      history.push('/search')
      return
    }
    
    // For authenticated users, proceed with normal post navigation
    dispatch(SET_SELECTED_POST(postId))
    history.push(url.replace(/\?/g, ''))
  }

  return (
    <ActivityCard
      avatar={avatar}
      cardColor={getCardBackgroundColor(type)}
      name={name}
      username={username}
      date={created}
      upvotes={upvotes}
      downvotes={downvotes}
      comments={comments}
      messages={messages}
      votes={votes}
      quotes={quotes}
      liked={isLiked}
      post={post}
      content={content}
      width={width}
      onLike={handleLike}
      handleRedirectToProfile={handleRedirectToProfile}
      onCardClick={handleCardClick}
      activityType={type}
    />
  )
}
LoadActivityCard.propTypes = {
  width: PropTypes.oneOf(['lg', 'md', 'sm', 'xl', 'xs']),
  activity: PropTypes.object,
}

function LoadActivityList({ data, onLoadMore }) {
  const hiddenPosts = useSelector((state) => state.ui.hiddenPosts) || []
  const width = useWidth()

  if (!data || !data.activities.pagination.total_count) {
    return (
      <ActivityEmptyList />
    )
  }

  const activities = data.activities.entities
    .filter((activity) => !hiddenPosts.includes(activity._id))
  const hasMore = data.activities.pagination.total_count > activities.length
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={onLoadMore}
      hasMore={hasMore}
      loader={<div className="loader" key={0}><LoadingSpinner size={30} /></div>}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={5}
      >
        {activities.map((activity, key) => (
          <Grid item key={key}>
            <Box
              boxShadow={5}
              style={{
                borderRadius: 7,
              }}
            >
              <LoadActivityCard activity={activity} width={width} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  )
}

LoadActivityList.propTypes = {
  data: PropTypes.object.isRequired,
  onLoadMore: PropTypes.func,
}

function ActivityList({
  data, loading, fetchMore, variables,
}) {
  if (loading) return <AlertSkeletonLoader cols={1} />
  const newOffset = data && data.activities.entities.length

  return (
    <LoadActivityList
      data={data}
      onLoadMore={() => fetchMore({
        variables: {
          ...variables,
          offset: newOffset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return {
            ...prev,
            activities: {
              ...fetchMoreResult.activities,
              entities: [
                ...prev.activities.entities,
                ...fetchMoreResult.activities.entities,
              ],
            },
          }
        },
      })}
    />
  )
}

ActivityList.propTypes = {
  data: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fetchMore: PropTypes.func,
  variables: PropTypes.object,
}

export default ActivityList
