import React from 'react'
import { Card, CardContent, Grid, IconButton, Typography, Skeleton } from '@mui/material'
import PropTypes from 'prop-types'
import moment from 'moment'
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
          <IconButton style={{ marginLeft: 'auto' }}>
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
