import { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import PostController from 'components/Post/PostController'
import { useLocation } from 'react-router'
import { useDispatch } from 'react-redux'
import { tokenValidator } from 'store/user'
import SubmitPost from '../../components/SubmitPost/SubmitPost'
import { Redirect } from 'react-router-dom'

export default function PostRouter() {
  const [, setOpen] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/post' && !tokenValidator(dispatch)) {
      // trigger redirect below
    }
  }, [location.pathname, dispatch])

  if (location.pathname === '/post') {
    if (!tokenValidator(dispatch)) {
      // Redirect to invite request page with current URL as query parameter
      const currentPath = location.pathname + location.search
      const redirectUrl = `/auth/request-access?from=${encodeURIComponent(currentPath)}`
      return <Redirect to={redirectUrl} />
    }
    return <SubmitPost setOpen={setOpen} />
  }

  return (
    <>
      <Route path="/post/:group/:title/:postId">
        <PostController />
      </Route>
    </>
  )
}
