import React from 'react'
import { Card, CardContent, Grid, List, ListItem, Skeleton } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import moment from 'moment'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PostActionCard from './PostActionCard'
import { SET_FOCUSED_COMMENT, SET_SHARED_COMMENT } from '../../store/ui'

const useStyles = makeStyles((theme) => ({
  actionList: {
    height: 'auto',
    marginTop: 5,
    width: '100%',
    position: 'relative',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      height: (props) => props.postActions && props.postActions.length > 2 ? '75vh' : 'auto',
    },
  },
}))

function PostActionList({
  postActions,
  loading,
  postUrl,
}) {
  const classes = useStyles({ postActions })
  const location = useLocation()
  const { hash } = location
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!hash) {
      dispatch(SET_FOCUSED_COMMENT(null))
      dispatch(SET_SHARED_COMMENT(null))
    }
    if (!loading && postActions.length && hash) {
      const element = document.getElementById(hash)
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, loading, postActions, dispatch])

  return (
    <>
      <Grid
        container
        item
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
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
      {!isEmpty(postActions) ? (
        <List className={classes.actionList}>
          {postActions.sort((a, b) => moment(b.created).diff(moment(a.created))).map((action) => (
            <ListItem
              id={`#${action._id}`}
              key={action._id}
              style={{ height: 'auto' }}
              autoFocus={`#${postActions._id}` === hash}
            >
              <PostActionCard
                postAction={action}
                postUrl={postUrl}
                selected={`#${action._id}` === hash}
              />
            </ListItem>
          ))}
        </List>
      ) : !loading && <Card><CardContent>Start the discussion... </CardContent></Card>}

    </>
  )
}

PostActionList.propTypes = {
  postActions: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  postUrl: PropTypes.string,
}

export default PostActionList
