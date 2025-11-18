import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog } from '@material-ui/core';
import PaginatedPostsList from '../Post/PaginatedPostsList';
import ErrorBoundary from '../ErrorBoundary';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubmitPost from '../SubmitPost/SubmitPost';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  list: {
    width: '100%',
    marginBottom: 10,
  },
  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    width: '100%',
  },
  loadingText: {
    marginTop: theme.spacing(2),
  },
}))

export default function UserPosts({ userId }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const history = useHistory()
  const loggedIn = useSelector((state) => !!state.user.data._id)
  const currentUser = useSelector((state) => state.user.data)

  // Check if viewing own profile
  const isOwnProfile = userId === currentUser?._id

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <div className={classes.list}>
          <PaginatedPostsList
            userId={userId}
            defaultPageSize={15}
            pageParam="page"
            pageSizeParam="page_size"
            cols={1}
            showPageInfo={true}
            showFirstLast={true}
            maxVisiblePages={5}
          />
        </div>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={false}
        maxWidth="sm"
        fullWidth
      >
        <SubmitPost setOpen={setOpen} />
      </Dialog>
    </ErrorBoundary>
  )
}

UserPosts.propTypes = {
  userId: PropTypes.string.isRequired,
} 