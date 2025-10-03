import BookmarkIcon from '@material-ui/icons/Bookmark'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import { IconButton } from '@material-ui/core'
import PropTypes from 'prop-types'
import { useMutation } from '@apollo/react-hooks'
import useGuestGuard from 'utils/useGuestGuard'
import {
  CREATE_POST_MESSAGE_ROOM,
  UPDATE_POST_BOOKMARK,
} from '../../graphql/mutations'
import {
  GET_CHAT_ROOMS,
  GET_POST,
  GET_TOP_POSTS,
  GET_USER_ACTIVITY,
} from '../../graphql/query'

function BookmarkIconButton(props) {
  const {
    post: { _id, bookmarkedBy },
    user,
    limit,
  } = props
  const ensureAuth = useGuestGuard()
  const [createPostMessageRoom] = useMutation(CREATE_POST_MESSAGE_ROOM)

  const [updatePostBookmark] = useMutation(UPDATE_POST_BOOKMARK)
  const handleClick = async (e) => {
    e.stopPropagation()
    if (!ensureAuth()) return

    await updatePostBookmark({
      variables: { postId: _id, userId: user._id },
    })

    await createPostMessageRoom({
      variables: { postId: _id },
      refetchQueries: [
        {
          query: GET_CHAT_ROOMS,
        },
        {
          query: GET_POST,
          variables: {
            postId: _id,
          },
        },
        {
          query: GET_USER_ACTIVITY,
          variables: {
            user_id: user._id,
            limit: limit || 5,
            offset: 0,
            searchKey: '',
            activityEvent: [],
          },
        },
        {
          query: GET_TOP_POSTS,
          variables: {
            limit: limit || 5,
            offset: 0,
            searchKey: '',
            interactions: false,
          },
        },
      ],
    })
  }

  const isBookmarked = bookmarkedBy && bookmarkedBy.includes(user._id)
  return (
    <>
      <IconButton {...props} onClick={handleClick}>
        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
      </IconButton>
    </>
  )
}

BookmarkIconButton.propTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  limit: PropTypes.number,
}

export default BookmarkIconButton
