import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { SET_HIDDEN_POSTS } from 'store/ui'
import InfiniteScroll from 'react-infinite-scroller'
import { Grid } from '@material-ui/core'
import PostCard from './PostCard'
import PostSkeleton from './PostSkeleton'
import AlertSkeletonLoader from '../AlertSkeletonLoader'
import LoadingSpinner from '../LoadingSpinner'

export function LoadPostsList({
  data, onLoadMore, loading = false,
}) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)
  const hiddenPosts = useSelector((state) => state.ui.hiddenPosts) || []
  const handleHidePost = (post) => {
    dispatch(SET_HIDDEN_POSTS(post._id))
  }

  // Show loading state when loading and no data yet
  if (loading && (!data || !data.posts || data.posts.entities.length === 0)) {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item>
          <PostSkeleton />
        </Grid>
      </Grid>
    )
  }

  // Only show empty state when not loading and no data
  if (!loading && (!data || data.posts === 0)) {
    return (
      <div style={{ width: '90%', textAlign: 'center' }}>
        <span>No posts found.</span>
        <br />
      </div>
    )
  }

  const rankedPosts = data.posts.entities
    .map((post, index) => ({ ...post, rank: index + 1 }))
    .filter((post) => !hiddenPosts.includes(post._id))

  const hasMore = data.posts.pagination.total_count > rankedPosts.length
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
        justifyContent="center"
        alignItems="stretch"
        spacing={0}
      >
        {rankedPosts.map((prop) => (
          <Grid item style={{ marginBottom: -25 }} key={prop._id}>
            <PostCard
              {...prop}
              onHidePost={handleHidePost}
              user={user}
              key={prop._id}
            />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  )
}

LoadPostsList.propTypes = {
  data: PropTypes.object,
  onLoadMore: PropTypes.func.isRequired,
  loading: PropTypes.bool,
}

export default function PostList({
  data, loading, limit, fetchMore, variables, cols,
}) {
  if (loading && !data) {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="stretch"
        spacing={2}
      >
        <Grid item>
          <PostSkeleton />
        </Grid>
      </Grid>
    )
  }

  const newOffset = data && data.posts.entities.length
  return (
    <LoadPostsList
      data={data}
      loading={loading}
      onLoadMore={() => fetchMore({
        variables: {
          ...variables,
          offset: newOffset,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return {
            ...prev,
            posts: {
              ...fetchMoreResult.posts,
              entities: [
                ...prev.posts.entities,
                ...fetchMoreResult.posts.entities,
              ],
            },
          }
        },
      })}
    />
  )
}

PostList.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  limit: PropTypes.number.isRequired,
  fetchMore: PropTypes.func.isRequired,
  variables: PropTypes.object.isRequired,
  cols: PropTypes.number.isRequired,
}
