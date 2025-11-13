import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Box } from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { SET_HIDDEN_POSTS } from 'store/ui'
import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import PaginatedList from '../common/PaginatedList'
import { GET_TOP_POSTS } from '../../graphql/query'
import {
  createGraphQLVariables,
  extractPaginationData,
} from '../../utils/pagination'
import { usePaginationWithFilters } from '../../hooks/usePagination'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
  postCard: {
    marginBottom: theme.spacing(-3.125), // -25px to match original spacing
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
  },
}))

function PaginatedPostsList({
  // Pagination props
  defaultPageSize = 20,
  pageParam = 'page',
  pageSizeParam = 'page_size',

  // Filter props
  searchKey = '',
  startDateRange,
  endDateRange,
  friendsOnly = false,
  interactions = false,
  userId,
  sortOrder,
  groupId,
  approved,

  // Component props
  cols = 1,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  // Optional display label for empty state (e.g., '@lou')
  displaySearch,

  // Callbacks
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onTotalCountChange,

  // Styling
  className,
  contentClassName,
  paginationClassName,

  // Other props
  ...otherProps
}) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
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
    [
      searchKey,
      startDateRange,
      endDateRange,
      friendsOnly,
      interactions,
      userId,
      sortOrder,
      groupId,
      approved,
    ],
  )

  // Create GraphQL variables
  const variables = createGraphQLVariables({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    searchKey,
    startDateRange,
    endDateRange,
    friendsOnly,
    interactions,
    userId,
    sortOrder,
    groupId,
    approved,
  })

  // Fetch data
  const { loading, error, data, refetch } = useQuery(GET_TOP_POSTS, {
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
    if (pagination.currentPage > 1 && (!data || !data.posts)) {
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

  // Handle hide post
  const handleHidePost = (post) => {
    dispatch(SET_HIDDEN_POSTS(post._id))
  }

  // Extract and process data
  const { entities, pagination: paginationData } = extractPaginationData(
    data,
    'posts',
  )

  // Notify parent of total count changes
  useEffect(() => {
    if (onTotalCountChange && paginationData.total_count !== undefined) {
      onTotalCountChange(paginationData.total_count)
    }
  }, [paginationData.total_count, onTotalCountChange])

  // Filter out hidden posts and add rank
  const processedPosts = entities
    .map((post, index) => ({ ...post, rank: index + 1 }))
    .filter((post) => !hiddenPosts.includes(post._id))

  // Render individual post
  const renderPost = (post) => (
    <Grid
      item
      key={post._id}
      className={classes.postCard}
      style={{ width: '100%', maxWidth: '100%' }}
    >
      <PostCard {...post} onHidePost={handleHidePost} user={user} />
    </Grid>
  )

  // Render empty state
  const renderEmpty = () => {
    const label = displaySearch ?? searchKey
    const isUserFilter = !!userId
    const message = isUserFilter
      ? label && label.startsWith('@')
        ? `No posts from ${label} yet`
        : 'No posts from this user yet'
      : label
      ? `No posts match your search for "${label}"`
      : 'No posts available at the moment'

    return (
      <Box style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
        <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>
          No posts found
        </h3>
        <p style={{ color: '#999' }}>{message}</p>
      </Box>
    )
  }

  // Render error state
  const renderError = (error, onRetry) => (
    <Box style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
      <h3 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>
        Something went wrong
      </h3>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        {error.message || 'An error occurred while loading posts'}
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
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="stretch"
      spacing={2}
    >
      <Grid
        item
        className={classes.postCard}
        style={{ width: '100%', maxWidth: '100%' }}
      >
        <PostSkeleton />
      </Grid>
    </Grid>
  )

  return (
    <PaginatedList
      data={processedPosts}
      loading={loading}
      error={error}
      totalCount={paginationData.total_count}
      defaultPageSize={defaultPageSize}
      pageParam={pageParam}
      pageSizeParam={pageSizeParam}
      showPageInfo={showPageInfo}
      showFirstLast={showFirstLast}
      maxVisiblePages={maxVisiblePages}
      renderItem={renderPost}
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
        spacing={0}
      >
        {processedPosts.map(renderPost)}
      </Grid>
    </PaginatedList>
  )
}

PaginatedPostsList.propTypes = {
  // Pagination props
  defaultPageSize: PropTypes.number,
  pageParam: PropTypes.string,
  pageSizeParam: PropTypes.string,

  // Filter props
  searchKey: PropTypes.string,
  startDateRange: PropTypes.string,
  endDateRange: PropTypes.string,
  friendsOnly: PropTypes.bool,
  interactions: PropTypes.bool,
  userId: PropTypes.string,
  sortOrder: PropTypes.string,
  groupId: PropTypes.string,
  approved: PropTypes.number,

  // Component props
  cols: PropTypes.number,
  showPageInfo: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  displaySearch: PropTypes.string,

  // Callbacks
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onRefresh: PropTypes.func,
  onTotalCountChange: PropTypes.func,

  // Styling
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  paginationClassName: PropTypes.string,
}

export default PaginatedPostsList
