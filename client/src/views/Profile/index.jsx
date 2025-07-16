import FollowInfo from 'components/Profile/FollowInfo'
import Profile from 'components/Profile/ProfileController'
import SimpleAvatarEditor from 'components/Profile/SimpleAvatarEditor'
import { useEffect } from 'react'
import { Route } from 'react-router-dom'

export default function ProfileRouter() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div style={{ margin: '0 10%' }}>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route exact path="/profile/:username/">
        <Profile />
      </Route>
      <Route exact path="/profile/:username/avatar">
        <SimpleAvatarEditor />
      </Route>
      <Route exact path="/profile/:username/following">
        <FollowInfo filter="following" />
      </Route>
      <Route exact path="/profile/:username/followers">
        <FollowInfo filter="followers" />
      </Route>
    </div>
  )
}
