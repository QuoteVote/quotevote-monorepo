import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Box } from '@material-ui/core'
import { useQuery } from '@apollo/client'
import PaginatedList from '../common/PaginatedList'
import { GET_USER_ACTIVITY } from '../../graphql/query'
import {
  createGraphQLVariables,
  extractPaginationData,
} from '../../utils/pagination'
import { usePaginationWithFilters } from '../../hooks/usePagination'
import { useWidth } from '../../utils/display'
import { ActivityCard } from '../../ui/ActivityCard'
import getCardBackgroundColor from '../../utils/getCardBackgroundColor'
import {
  CREATE_POST_MESSAGE_ROOM,
  UPDATE_POST_BOOKMARK,
} from '../../graphql/mutations'
import {
  GET_CHAT_ROOMS,
  GET_POST,
  GET_TOP_POSTS,
  GET_USER_ACTIVITY as GET_USER_ACTIVITY_QUERY,
} from '../../graphql/query'
import { SET_SELECTED_POST } from '../../store/ui'
import getActivityContent from '../../utils/getActivityContent'
import { tokenValidator } from 'store/user'
import useGuestGuard from '../../utils/useGuestGuard'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  activityCard: {
    marginBottom: theme.spacing(2),
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
}))

function LoadActivityCard({ width, activity }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const [createPostMessageRoom] = useMutation(CREATE_POST_MESSAGE_ROOM)
  const [updatePostBookmark] = useMutation(UPDATE_POST_BOOKMARK)
  const { data: chatRooms } = useQuery(GET_CHAT_ROOMS, {
    variables: { userId: user._id },
  })
  const { data: postData } = useQuery(GET_POST, {
    variables: { postId: activity.postId },
    skip: !activity.postId,
  })

  const handleCreatePostMessageRoom = async (postId) => {
    try {
      const result = await createPostMessageRoom({
        variables: { postId },
        refetchQueries: [
          { query: GET_CHAT_ROOMS, variables: { userId: user._id } },
        ],
      })
      return result.data.createPostMessageRoom
    } catch (error) {
      console.error('Error creating post message room:', error)
      return null
    }
  }

  const handleBookmarkPost = async (postId) => {
    try {
      await updatePostBookmark({
        variables: { postId, userId: user._id },
        refetchQueries: [
          { query: GET_POST, variables: { postId } },
          {
            query: GET_TOP_POSTS,
            variables: {
              limit: 5,
              offset: 0,
              searchKey: '',
              interactions: false,
            },
          },
        ],
      })
    } catch (error) {
      console.error('Error updating post bookmark:', error)
    }
  }

  const handlePostClick = (postId) => {
    dispatch(SET_SELECTED_POST(postId))
  }

  const activityContent = getActivityContent(activity)
  const backgroundColor = getCardBackgroundColor(activity.activityType)

  return (
    <ActivityCard
      activity={activity}
      width={width}
      backgroundColor={backgroundColor}
      activityContent={activityContent}
      user={user}
      chatRooms={chatRooms?.chatRooms || []}
      postData={postData?.post}
      onCreatePostMessageRoom={handleCreatePostMessageRoom}
      onBookmarkPost={handleBookmarkPost}
      onPostClick={handlePostClick}
    />
  )
}

LoadActivityCard.propTypes = {
  width: PropTypes.string.isRequired,
  activity: PropTypes.object.isRequired,
}

function PaginatedActivityList({
  // Pagination props
  defaultPageSize = 15,
  pageParam = 'page',
  pageSizeParam = 'page_size',

  // Filter props
  userId,
  searchKey = '',
  startDateRange,
  endDateRange,
  activityEvent = ['POSTED'],

  // Component props
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,

  // Callbacks
  onPageChange,
  onPageSizeChange,
  onRefresh,

  // Styling
  className,
  contentClassName,
  paginationClassName,

  // Other props
  ...otherProps
}) {
  const classes = useStyles()
  const width = useWidth()
  const hiddenPosts = useSelector((state) => state.ui.hiddenPosts) || []

  // Use pagination hook with filter dependencies
  const pagination = usePaginationWithFilters(
    {
      defaultPageSize,
      pageParam,
      pageSizeParam,
      onPageChange,
      onPageSizeChange,
    },
    [userId, searchKey, startDateRange, endDateRange, activityEvent],
  )

  // Create GraphQL variables
  const variables = createGraphQLVariables({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    user_id: userId,
    searchKey,
    startDateRange,
    endDateRange,
    activityEvent: JSON.stringify(activityEvent),
  })

  // Fetch data
  const { loading, error, data, refetch } = useQuery(GET_USER_ACTIVITY_QUERY, {
    variables,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    // Always fetch fresh data when variables change (including page changes)
    nextFetchPolicy: 'cache-and-network',
  })

  // Ensure data is fetched when component mounts with page parameter
  useEffect(() => {
    // If we have a page > 1 and no data, refetch to ensure we load the correct page
    if (pagination.currentPage > 1 && (!data || !data.activities)) {
      refetch()
    }
  }, [pagination.currentPage, data, refetch])

  // Force refetch when component mounts with a page parameter from URL
  useEffect(() => {
    // On initial mount, if we have a page > 1, ensure we fetch data
    if (pagination.currentPage > 1) {
      refetch()
    }
  }, []) // Only run on mount

  // Extract and process data
  const { entities, pagination: paginationData } = extractPaginationData(
    data,
    'activities',
  )

  // Filter out hidden posts
  const processedActivities = entities.filter(
    (activity) => !hiddenPosts.includes(activity._id),
  )

  // Render individual activity
  const renderActivity = (activity) => (
    <Grid item key={activity._id} className={classes.activityCard}>
      <Box
        boxShadow={5}
        style={{
          borderRadius: 7,
        }}
      >
        <LoadActivityCard activity={activity} width={width} />
      </Box>
    </Grid>
  )

  // Render empty state
  const renderEmpty = () => (
    <Box style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
      <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>
        No activities found
      </h3>
      <p style={{ color: '#999' }}>
        {searchKey
          ? `No activities match your search for "${searchKey}"`
          : 'No activities available at the moment'}
      </p>
    </Box>
  )

  // Render error state
  const renderError = (error, onRetry) => (
    <Box style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h3 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>
        Something went wrong
      </h3>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {error.message || 'An error occurred while loading activities'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '8px 16px',
            backgroundColor: '#52b274',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      )}
    </Box>
  )

  // Render loading state
  const renderLoading = () => (
    <Box style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
      <p style={{ color: '#666' }}>Loading activities...</p>
    </Box>
  )

  return (
    <PaginatedList
      data={processedActivities}
      loading={loading}
      error={error}
      totalCount={paginationData.total_count}
      defaultPageSize={defaultPageSize}
      pageParam={pageParam}
      pageSizeParam={pageSizeParam}
      showPageInfo={showPageInfo}
      showFirstLast={showFirstLast}
      maxVisiblePages={maxVisiblePages}
      renderItem={renderActivity}
      renderEmpty={renderEmpty}
      renderError={renderError}
      renderLoading={renderLoading}
      onRefresh={refetch}
      className={`${classes.root} ${className || ''}`}
      contentClassName={contentClassName}
      paginationClassName={paginationClassName}
      {...otherProps}
    >
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="stretch"
        spacing={5}
      >
        {processedActivities.map(renderActivity)}
      </Grid>
    </PaginatedList>
  )
}

PaginatedActivityList.propTypes = {
  // Pagination props
  defaultPageSize: PropTypes.number,
  pageParam: PropTypes.string,
  pageSizeParam: PropTypes.string,

  // Filter props
  userId: PropTypes.string,
  searchKey: PropTypes.string,
  startDateRange: PropTypes.string,
  endDateRange: PropTypes.string,
  activityEvent: PropTypes.array,

  // Component props
  showPageInfo: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,

  // Callbacks
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onRefresh: PropTypes.func,

  // Styling
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  paginationClassName: PropTypes.string,
}

export default PaginatedActivityList
