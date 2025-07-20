import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks'
import { useParams, useHistory } from 'react-router'
import { GET_FOLLOW_INFO } from '@/graphql/query'
import UserFollowDisplay from 'components/Profile/UserFollowDisplay'

import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'

// import NoFollowing from 'components/Profile/NoFollowing'
import NoFollowers from 'components/Profile/NoFollowers'

export default FollowInfo

FollowInfo.propTypes = {
  filter: PropTypes.string.isRequired,
}
/*  eslint no-underscore-dangle: ["error", { "allow": ["_followingId", "_id"] }] */
/**
  * Display list of followers OR following (if 0, we'll display something else)
  * @param {string} filter - following / followers
  * @returns {JSX.element}
*/

function FollowInfo({ filter }) {
  const { username } = useParams()
  const userData = useSelector((state) => state.user.data)
  const { data, error, loading } = useQuery(GET_FOLLOW_INFO, {
    variables: { username, filter },
  })
  const history = useHistory()

  //  boolFol will equal true if the state user is following the iterated user

  if (loading) return <div>Loading</div>
  if (error) return <div>{JSON.stringify(error)}</div>

  if (data) {
    const { getUserFollowInfo } = data
    if (getUserFollowInfo.length === 0) {
      return (
        <>
          <div id="component-followers-display">
            <Grid
              id="component-banner"
              container
            >
              <Grid item>
                <IconButton
                  onClick={() => history.goBack()}
                  aria-label="GoBack"
                >
                  <KeyboardBackspaceIcon />
                </IconButton>
              </Grid>
              <Grid item>
                {
                  filter === 'followers' ? <p>{`${getUserFollowInfo.length} Followers`}</p> : <p>{`${getUserFollowInfo.length} Following`}</p>
                }
              </Grid>
            </Grid>
            {
              filter === 'followers' ? <NoFollowers filter="followers" /> : <NoFollowers filter="following" />
            }
          </div>
        </>
      )
    }
    return (
      <>
        <div id="component-followers-display">
          <div id="component-banner">
            <IconButton
              onClick={() => history.goBack()}
              aria-label="add an alarm"
            >
              <KeyboardBackspaceIcon />
            </IconButton>
            {
              filter === 'followers' ? <p>{`${getUserFollowInfo.length} Followers`}</p> : <p>{`${getUserFollowInfo.length} Following`}</p>
            }
            <div id="component-follows-list">
              {
                getUserFollowInfo.map((f) => (
                  <UserFollowDisplay
                    profileUserId={userData._id}
                    username={username}
                    isFollowing={_.includes(userData._followingId, f.id)}
                    {...f}
                    key={f.id}
                  />
                ))
              }
            </div>
          </div>
        </div>
      </>
    )
  }
}
