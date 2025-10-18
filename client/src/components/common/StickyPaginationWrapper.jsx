import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing(12), // More space for fixed pagination
    overflow: 'auto',
    marginBottom: theme.spacing(2), // Additional margin to ensure content is visible
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden', // Prevent horizontal scrolling
    boxSizing: 'border-box',
  },
  paginationContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(224, 224, 224, 0.5)',
    zIndex: 1000,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
    padding: theme.spacing(1.5),
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
  },
}))

/**
 * Wrapper component that provides sticky pagination at the bottom
 * This ensures pagination is always visible regardless of content length
 */
function StickyPaginationWrapper({ children, pagination, className }) {
  const classes = useStyles()

  return (
    <Box className={`${classes.root} ${className || ''}`}>
      {/* Main content */}
      <Box className={classes.content}>
        {children}
      </Box>
      
      {/* Sticky pagination */}
      {pagination && (
        <Box className={classes.paginationContainer}>
          {pagination}
        </Box>
      )}
    </Box>
  )
}

StickyPaginationWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  pagination: PropTypes.node,
  className: PropTypes.string,
}

export default StickyPaginationWrapper
