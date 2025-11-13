import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/client'
import PropTypes from 'prop-types'
import React from 'react'
import { GROUPS_QUERY } from '../../graphql/query'
import SubmitPostSkeleton from './SubmitPostSkeleton'
import SubmitPostForm from './SubmitPostForm'

function SubmitPost(props) {
  const { setOpen } = props
  const user = useSelector((state) => state.user.data)
  const { loading, error, data } = useQuery(GROUPS_QUERY, {
    variables: { limit: 0 },
  })

  if (error) {
    return <div> Something went wrong!</div>
  }

  if (loading) {
    return <SubmitPostSkeleton />
  }

  const groupsOptions =
    (data &&
      data.groups.filter((group) => {
        const isUserAllowed = group.allowedUserIds.find((id) => id === user._id)
        return (
          group.privacy === 'public' ||
          (group.privacy === 'private' && isUserAllowed)
        )
      })) ||
    []

  return (
    <SubmitPostForm options={groupsOptions} user={user} setOpen={setOpen} />
  )
}

SubmitPost.propTypes = {
  setOpen: PropTypes.func,
}

export default SubmitPost
