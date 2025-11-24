import React from 'react'
import { makeStyles, Paper, Typography, Avatar, Chip } from '@material-ui/core'
import QuoteIcon from '@material-ui/icons/FormatQuote'
import { useSelector } from 'react-redux'
import AvatarDisplay from '../Avatar'
import PropTypes from 'prop-types'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2, 2, 1.5, 2),
    padding: 0,
  },
  quoteCard: {
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1F1F1F 0%, #1A1A1A 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
    border: `2px solid ${theme.palette.mode === 'dark' ? 'rgba(82, 178, 116, 0.3)' : 'rgba(82, 178, 116, 0.25)'}`,
    borderRadius: 16,
    padding: theme.spacing(2, 2.5),
    position: 'relative',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 4px 12px rgba(82, 178, 116, 0.15), 0 2px 4px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(82, 178, 116, 0.1), 0 2px 4px rgba(82, 178, 116, 0.05)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
      borderRadius: '16px 0 0 16px',
    },
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
  avatar: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.background.paper}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  authorName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(0.25),
  },
  quoteLabel: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  quoteIcon: {
    fontSize: '1rem',
    color: '#52b274',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
    lineHeight: 1.4,
    letterSpacing: '-0.01em',
  },
  text: {
    fontSize: '0.9375rem',
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  chip: {
    marginTop: theme.spacing(1),
    height: 24,
    fontSize: '0.75rem',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #52b274 0%, #4a9e63 100%)',
    color: 'white',
    '& .MuiChip-icon': {
      color: 'white',
    },
  },
}))

const QuoteHeaderMessage = ({ postDetails, postCreator }) => {
  const classes = useStyles()
  const currentUser = useSelector((state) => state.user?.data)

  if (!postDetails) return null

  const { title, text, userId } = postDetails
  const isCurrentUser = currentUser?._id?.toString() === userId?.toString()

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.quoteCard}>
        <div className={classes.header}>
          {postCreator && (
            <Avatar className={classes.avatar}>
              <AvatarDisplay user={postCreator} size={40} />
            </Avatar>
          )}
          <div className={classes.headerText}>
            <Typography className={classes.authorName}>
              {postCreator?.name || postCreator?.username || 'Unknown User'}
            </Typography>
            <div className={classes.quoteLabel}>
              <QuoteIcon className={classes.quoteIcon} />
              <span>Original Quote</span>
            </div>
          </div>
        </div>
        
        {title && (
          <Typography className={classes.title}>
            {title}
          </Typography>
        )}
        
        {text && (
          <Typography className={classes.text}>
            {text}
          </Typography>
        )}
        
        <Chip
          icon={<QuoteIcon />}
          label="Discussion Topic"
          className={classes.chip}
          size="small"
        />
      </Paper>
    </div>
  )
}

QuoteHeaderMessage.propTypes = {
  postDetails: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    userId: PropTypes.string,
    url: PropTypes.string,
  }),
  postCreator: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    username: PropTypes.string,
    avatar: PropTypes.object,
  }),
}

QuoteHeaderMessage.defaultProps = {
  postDetails: null,
  postCreator: null,
}

export default QuoteHeaderMessage

