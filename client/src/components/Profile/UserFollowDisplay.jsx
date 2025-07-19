import React from 'react'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import FollowButton from 'components/CustomButtons/FollowButton'
import Avatar from 'components/Avatar'

/**
  * Display a user item that can be used in the listings of followers/following
  * @param {Object} avatar
  * @param {string} username
  * @param {Object[]} numFollowers
  * @param {Object[]} numFollowing
  * @param {string} id
  * @param {boolean} isFollowing
  * @returns {JSX.Element}
*/

function UserFollowDisplay({
  avatar, username, numFollowers, numFollowing, id, isFollowing,
}) {
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      id="component-user-follow-display"
    >
      <Grid item sm={3}>
        <Avatar height="50" width="50" {...avatar} />
      </Grid>
      <Grid
        item
        container
        direction="column"
        sm={6}
      >
        <Grid item>
          {username}
        </Grid>
        <Grid item>
          {`${numFollowers} followers ${numFollowing} following`}
        </Grid>
      </Grid>
      <Grid item sm={3}>
        {
          isFollowing ? (
            <FollowButton
              isFollowing={isFollowing}
              profileUserId={id}
              username={username}
            >
              Follow
            </FollowButton>
          ) : (
            <FollowButton
              isFollowing={isFollowing}
              profileUserId={id}
              username={username}
            >
              Unfollow
            </FollowButton>
          )
        }
      </Grid>
    </Grid>
  )
}

UserFollowDisplay.propTypes = {
  avatar: PropTypes.object,
  username: PropTypes.string.isRequired,
  numFollowers: PropTypes.number.isRequired,
  numFollowing: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
}

export default UserFollowDisplay
