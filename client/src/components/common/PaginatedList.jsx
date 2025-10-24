import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Box, CircularProgress, Typography } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import Pagination from './Pagination'
import StickyPaginationWrapper from './StickyPaginationWrapper'
import { usePagination } from '../../hooks/usePagination'

const useStyles = makeStyles((theme) => ({
  content: {
    position: 'relative',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
    minHeight: '200px',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    minHeight: '200px',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    textAlign: 'center',
    color: theme.palette.error.main,
    minHeight: '200px',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent', // No background overlay to avoid graying out content
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50, // Lower than pagination (1000) but higher than content
    flexDirection: 'column',
    paddingBottom: theme.spacing(12), // Leave space for pagination
    pointerEvents: 'none', // Allow clicks to pass through to content
  },
}))

/**
 * Higher-order component for paginated lists
 * Handles pagination state, loading, and error states
 */
function PaginatedList({
  // Data props
  data,
  loading,
  error,
  totalCount,
  
  // Pagination props
  defaultPageSize = 20,
  pageParam = 'page',
  pageSizeParam = 'page_size',
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  
  // Render props
  renderItem,
  renderEmpty,
  renderError,
  renderLoading,
  
  // Callbacks
  onPageChange,
  onPageSizeChange,
  onRefresh,
  
  // Styling
  className,
  contentClassName,
  paginationClassName,
  
  // Other props
  children,
  ...otherProps
}) {
  const classes = useStyles()
  
  const pagination = usePagination({
    defaultPageSize,
    pageParam,
    pageSizeParam,
    onPageChange,
    onPageSizeChange,
  })

  const paginationData = pagination.calculatePagination(totalCount || 0)

  // Always show pagination if there are multiple pages, regardless of loading/error/empty states
  const shouldShowPagination = paginationData.totalPages > 1

  // Create pagination component - always show if there are multiple pages
  const paginationComponent = shouldShowPagination ? (
    <Pagination
      currentPage={paginationData.currentPage}
      totalPages={paginationData.totalPages}
      totalCount={paginationData.totalCount}
      pageSize={paginationData.pageSize}
      onPageChange={pagination.handlePageChange}
      showPageInfo={showPageInfo}
      showFirstLast={showFirstLast}
      maxVisiblePages={maxVisiblePages}
      disabled={false} // Never disable pagination - let it handle its own loading state
    />
  ) : null

  return (
    <StickyPaginationWrapper 
      className={className} 
      pagination={paginationComponent}
      {...otherProps}
    >
      {/* Content */}
      <Box className={`${classes.content} ${contentClassName || ''}`}>
        {/* Handle loading state */}
        {loading && (!data || data.length === 0) ? (
          renderLoading ? (
            renderLoading()
          ) : (
            <Box className={classes.loading}>
              <Box style={{ width: '100%', maxWidth: '600px' }}>
                <Skeleton variant="rect" height={200} style={{ borderRadius: '8px' }} />
              </Box>
            </Box>
          )
        ) : error ? (
          /* Handle error state */
          renderError ? (
            renderError(error, onRefresh)
          ) : (
            <Box className={classes.error}>
              <Typography variant="h6" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {error.message || 'An error occurred while loading the data.'}
              </Typography>
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  style={{
                    marginTop: 16,
                    padding: '8px 16px',
                    backgroundColor: '#52b274',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              )}
            </Box>
          )
        ) : !loading && (!data || data.length === 0) ? (
          /* Handle empty state - only show when not loading and no data */
          renderEmpty ? (
            renderEmpty()
          ) : (
            <Box className={classes.empty}>
              <Typography variant="h6" color="textSecondary">
                No items found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Try adjusting your search or filters
              </Typography>
            </Box>
          )
        ) : (
          /* Show content */
          children || data.map((item, index) => renderItem(item, index))
        )}

        {/* Show loading overlay when loading with existing data (page change) */}
        {loading && data && data.length > 0 && (
          <Box className={classes.loadingOverlay}>
            <Box style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              border: '2px solid #52b274',
              position: 'relative',
              zIndex: 50, // Lower than pagination (1000) but higher than content
              minWidth: '200px',
              pointerEvents: 'auto', // Make the loading card itself interactive
            }}>
              <CircularProgress size={50} style={{ color: '#52b274' }} />
              <Typography variant="h6" style={{ marginTop: 20, color: '#52b274', fontWeight: 600 }}>
                Loading new page...
              </Typography>
              <Typography variant="body2" style={{ marginTop: 8, color: '#666', textAlign: 'center' }}>
                Please wait while we fetch the latest posts
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </StickyPaginationWrapper>
  )
}

PaginatedList.propTypes = {
  // Data props
  data: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.object,
  totalCount: PropTypes.number.isRequired,
  
  // Pagination props
  defaultPageSize: PropTypes.number,
  pageParam: PropTypes.string,
  pageSizeParam: PropTypes.string,
  showPageInfo: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  
  // Render props
  renderItem: PropTypes.func,
  renderEmpty: PropTypes.func,
  renderError: PropTypes.func,
  renderLoading: PropTypes.func,
  
  // Callbacks
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onRefresh: PropTypes.func,
  
  // Styling
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  paginationClassName: PropTypes.string,
  
  // Other props
  children: PropTypes.node,
}

export default PaginatedList
