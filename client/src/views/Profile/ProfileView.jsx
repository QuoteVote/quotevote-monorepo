import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import AppBar from 'components/Navbars/ProfileHeader'
import LoadingSpinner from 'components/LoadingSpinner'
import { Link, Typography } from '@material-ui/core'
import UserPosts from '../../components/UserPosts'
import ReputationDisplay from '../../components/Profile/ReputationDisplay'

const useStyles = makeStyles(({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  header: {
    marginTop: 20,
    width: '100%',
    maxWidth: '800px',
  },
  content: {
    width: '100%',
    maxWidth: '800px',
    marginTop: '20px',
  },
  emptyProfile: {
    marginTop: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link: {
    color: '#00bcd4',
  },
}))

function ProfileView({
  handleActivityEvent,
  handleSelectAll,
  selectAll,
  filterState,
  setOffset,
  profileUser,
  loading,
}) {
  const classes = useStyles()

  if (loading) return <LoadingSpinner />

  if (!profileUser) {
    return (
      <div className={classes.root}>
        <div className={classes.emptyProfile}>
          <Typography variant="h6" align="center">
            Invalid user
          </Typography>
          <Link href="/search" className={classes.link}>
            Return to homepage.
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <AppBar
          handleActivityEvent={handleActivityEvent}
          handleSelectAll={handleSelectAll}
          selectAll={selectAll}
          filterState={filterState}
          setOffset={setOffset}
          profileUser={profileUser}
        />
      </div>

      <div className={classes.content}>
        {profileUser.reputation && (
          <ReputationDisplay 
            reputation={profileUser.reputation}
            onRefresh={() => window.location.reload()}
          />
        )}
        <UserPosts userId={profileUser._id} />
      </div>
    </div>
  )
}

ProfileView.propTypes = {
  handleActivityEvent: PropTypes.func.isRequired,
  handleSelectAll: PropTypes.func.isRequired,
  selectAll: PropTypes.string.isRequired,
  filterState: PropTypes.object.isRequired,
  setOffset: PropTypes.func.isRequired,
  profileUser: PropTypes.object,
  loading: PropTypes.bool,
}

export default ProfileView
