import React from 'react'
import {
  Card, CardContent, Grid, IconButton, Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import moment from 'moment'
import Skeleton from '@mui/material/Skeleton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import { useLocation } from 'react-router-dom'
import { Filter as FilterIcon } from '../Icons'
import Comment from './Comment'

function CommentList({ comments, loading, postUrl }) {
  const location = useLocation()
  const { hash } = location
  React.useEffect(() => {
    if (!loading && comments.length && hash) {
      const element = document.getElementById(hash)
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, loading, comments])
  return (
    <>
      <Grid
        container
        item
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <Typography variant="h6">
            Comments
          </Typography>
        </Grid>
        <Grid item>
          <IconButton 
            style={{ 
              marginLeft: 'auto',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              padding: '12px',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
              e.target.style.border = '1px solid rgba(0, 0, 0, 0.24)';
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
              e.target.style.border = '1px solid rgba(0, 0, 0, 0.12)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <FilterIcon
              width="32"
              height="32"
              viewBox="0 0 32 32"
            />
          </IconButton>
        </Grid>
      </Grid>
      {loading && (
        <>
          <Skeleton variant="rect" height={118} />
          <br />
          <Skeleton variant="rect" height={118} />
          <br />
          <Skeleton variant="rect" height={118} />
        </>
      )}
      {comments ? (
        <List
          style={{
            height: comments.length > 2 ? '75vh' : 'auto',
            marginTop: 5,
            width: '100%',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          {comments.sort((a, b) => moment(b.created).diff(moment(a.created))).map((comment) => (
            <ListItem
              id={`#${comment._id}`}
              key={comment._id}
              style={{ height: 'auto' }}
              autoFocus={`#${comment._id}` === hash}
            >
              <Comment
                comment={comment}
                postUrl={postUrl}
                selected={`#${comment._id}` === hash}
              />
            </ListItem>
          ))}
        </List>
      ) : <Card><CardContent>Start the discussion... </CardContent></Card>}

    </>
  )
}

CommentList.propTypes = {
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  postUrl: PropTypes.string,
}

export default CommentList
