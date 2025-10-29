import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from '@material-ui/core'
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1.5),
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      gap: theme.spacing(0.25),
    },
  },
  pageButton: {
    minWidth: '36px',
    height: '36px',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: '13px',
    transition: 'background-color 0.3s cubic-bezier(0.4,0,0.2,1), color 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    [theme.breakpoints.down('sm')]: {
      minWidth: '32px',
      height: '32px',
      fontSize: '12px',
    },
    '&.MuiButton-contained': {
      backgroundColor: '#52b274',
      color: 'white',
      boxShadow: '0 2px 8px rgba(82, 178, 116, 0.3)',
      '&:hover': {
        backgroundColor: '#45a069',
        boxShadow: '0 4px 12px rgba(82, 178, 116, 0.4)',
        transform: 'translateY(-1px)',
      },
      '&:disabled': {
        backgroundColor: '#e0e0e0',
        color: '#999',
        boxShadow: 'none',
        transform: 'none',
      },
    },
    '&.MuiButton-outlined': {
      borderColor: 'rgba(224, 224, 224, 0.8)',
      color: '#666',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        borderColor: '#52b274',
        color: '#52b274',
        backgroundColor: 'rgba(82, 178, 116, 0.06)',
        boxShadow: '0 2px 8px rgba(82, 178, 116, 0.15)',
        transform: 'translateY(-1px)',
      },
      '&:disabled': {
        borderColor: '#e0e0e0',
        color: '#ccc',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transform: 'none',
      },
    },
  },
  navigationButton: {
    minWidth: '36px',
    height: '36px',
    borderRadius: '8px',
    transition: 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    [theme.breakpoints.down('sm')]: {
      minWidth: '32px',
      height: '32px',
    },
    '&.MuiIconButton-root': {
      color: '#666',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        backgroundColor: 'rgba(82, 178, 116, 0.1)',
        color: '#52b274',
        boxShadow: '0 2px 8px rgba(82, 178, 116, 0.2)',
        transform: 'translateY(-1px)',
      },
      '&:disabled': {
        color: '#ccc',
        backgroundColor: 'rgba(240, 240, 240, 0.5)',
        cursor: 'not-allowed',
        boxShadow: 'none',
        transform: 'none',
      },
    },
  },
  pageInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    margin: `0 ${theme.spacing(1)}px`,
    [theme.breakpoints.down('sm')]: {
      margin: `0 ${theme.spacing(0.5)}px`,
      gap: theme.spacing(0.25),
    },
  },
  pageNumbers: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.25),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.125),
    },
  },
  ellipsis: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    color: '#999',
    fontSize: '13px',
    fontWeight: 500,
    [theme.breakpoints.down('sm')]: {
      minWidth: '32px',
      height: '32px',
      fontSize: '12px',
    },
  },
  mobileHidden: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mobileOnly: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
}))

function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  showPageInfo = true,
  showFirstLast = true,
  maxVisiblePages = 5,
  disabled = false,
}) {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Calculate visible page numbers
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  const [isChangingPage, setIsChangingPage] = useState(false)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !disabled) {
      setIsChangingPage(true)
      onPageChange(page)
      // Reset loading state after a longer delay to ensure it's visible
      setTimeout(() => setIsChangingPage(false), 2000)
    }
  }

  const getPageInfo = () => {
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalCount)
    return `${startItem}-${endItem} of ${totalCount}`
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <Box className={classes.root}>
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          {/* Navigation Row */}
          <Box style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            {/* First Page Button */}
            {showFirstLast && (
              <IconButton
                className={classes.navigationButton}
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || disabled || isChangingPage}
                aria-label="Go to first page"
                size="small"
              >
                <FirstPageIcon fontSize="small" />
              </IconButton>
            )}

            {/* Previous Page Button */}
            <IconButton
              className={classes.navigationButton}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || disabled || isChangingPage}
              aria-label="Go to previous page"
              size="small"
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            {/* Page Numbers */}
            <Box className={classes.pageNumbers}>
              {visiblePages.map((page) => (
                <Button
                  key={page}
                  className={classes.pageButton}
                  variant={page === currentPage ? 'contained' : 'outlined'}
                  onClick={() => handlePageChange(page)}
                  disabled={disabled || isChangingPage}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                  size="small"
                >
                  {page}
                </Button>
              ))}
            </Box>

            {/* Next Page Button */}
            <IconButton
              className={classes.navigationButton}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || disabled || isChangingPage}
              aria-label="Go to next page"
              size="small"
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>

            {/* Last Page Button */}
            {showFirstLast && (
              <IconButton
                className={classes.navigationButton}
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || disabled || isChangingPage}
                aria-label="Go to last page"
                size="small"
              >
                <LastPageIcon fontSize="small" />
              </IconButton>
            )}
          </Box>

          {/* Page Info Row */}
          <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body2" color="textSecondary" style={{ fontSize: '11px' }}>
              Page {currentPage} of {totalPages}
            </Typography>
            {isChangingPage && (
              <Box style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginLeft: 8,
                backgroundColor: '#52b274',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #45a069'
              }}>
                <CircularProgress size={14} style={{ color: '#fff' }} />
                <Typography variant="body2" style={{ marginLeft: 6, fontSize: '11px', color: '#fff', fontWeight: 500 }}>
                  Loading...
                </Typography>
              </Box>
            )}
          </Box>
        </>
      ) : (
        /* Desktop Layout */
        <>
          {/* First Page Button */}
          {showFirstLast && (
            <IconButton
              className={classes.navigationButton}
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || disabled || isChangingPage}
              aria-label="Go to first page"
            >
              <FirstPageIcon />
            </IconButton>
          )}

          {/* Previous Page Button */}
          <IconButton
            className={classes.navigationButton}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled || isChangingPage}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Page Numbers */}
          <Box className={classes.pageNumbers}>
            {/* Start Ellipsis */}
            {showStartEllipsis && (
              <>
                <Button
                  className={classes.pageButton}
                  variant="outlined"
                  onClick={() => handlePageChange(1)}
                  disabled={disabled || isChangingPage}
                  aria-label="Go to page 1"
                >
                  1
                </Button>
                <Box className={classes.ellipsis}>...</Box>
              </>
            )}

            {/* Visible Page Numbers */}
            {visiblePages.map((page) => (
              <Button
                key={page}
                className={classes.pageButton}
                variant={page === currentPage ? 'contained' : 'outlined'}
                onClick={() => handlePageChange(page)}
                disabled={disabled || isChangingPage}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </Button>
            ))}

            {/* End Ellipsis */}
            {showEndEllipsis && (
              <>
                <Box className={classes.ellipsis}>...</Box>
                <Button
                  className={classes.pageButton}
                  variant="outlined"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={disabled || isChangingPage}
                  aria-label={`Go to page ${totalPages}`}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </Box>

          {/* Next Page Button */}
          <IconButton
            className={classes.navigationButton}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled || isChangingPage}
            aria-label="Go to next page"
          >
            <ChevronRightIcon />
          </IconButton>

          {/* Last Page Button */}
          {showFirstLast && (
            <IconButton
              className={classes.navigationButton}
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || disabled || isChangingPage}
              aria-label="Go to last page"
            >
              <LastPageIcon />
            </IconButton>
          )}

          {/* Page Info */}
          {showPageInfo && (
            <Box className={classes.pageInfo}>
              <Typography variant="body2" color="textSecondary">
                {getPageInfo()}
              </Typography>
            </Box>
          )}

          {/* Loading Indicator */}
          {isChangingPage && (
            <Box style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginLeft: 16,
              backgroundColor: '#52b274',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #45a069'
            }}>
              <CircularProgress size={18} style={{ color: '#fff' }} />
              <Typography variant="body2" style={{ marginLeft: 8, fontSize: '13px', color: '#fff', fontWeight: 500 }}>
                Loading...
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  showPageInfo: PropTypes.bool,
  showFirstLast: PropTypes.bool,
  maxVisiblePages: PropTypes.number,
  disabled: PropTypes.bool,
}

export default Pagination
