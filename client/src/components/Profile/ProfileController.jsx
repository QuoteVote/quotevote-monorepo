import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '@/graphql/query'
import ProfileView from 'views/Profile/ProfileView'
import { SET_SELECTED_PAGE } from 'store/ui'

function ProfileController() {
  //  Set state for events and use viewModel props for redux/apollo?
  const conditions = ['POSTED', 'VOTED', 'COMMENTED', 'QUOTED', 'LIKED']
  const [selectedEvent, setSelectedEvent] = useState(conditions)
  const [selectAll, setSelectAll] = useState('ALL')
  const [offset, setOffset] = useState(1)
  const limit = 5
  const { username } = useParams()
  const [userInfo, setUserInfo] = useState({})
  const loggedInUser = useSelector((state) => state.user.data)

  const dispatch = useDispatch()
  const filterState = useSelector((state) => state.filter)
  const handleActivityEvent = (event, newActivityEvent) => {
    if (!newActivityEvent.length) {
      setSelectAll(['ALL'])
      setSelectedEvent(conditions)
    } else {
      const isAllToggled = newActivityEvent.length === conditions.length
      setSelectAll(isAllToggled ? ['ALL'] : [])
      setSelectedEvent(newActivityEvent)
    }
  }

  const handleSelectAll = (event, newSelectAll) => {
    if (newSelectAll.length) {
      setSelectedEvent(conditions)
    }
    setSelectAll(newSelectAll)
  }

  const { data: userData } = useQuery(GET_USER, {
    variables: { username: username || loggedInUser.username },
  })
  useEffect(() => {
    dispatch(SET_SELECTED_PAGE(null))
  }, [dispatch])

  useEffect(() => {
    if (userData) {
      setUserInfo(userData.user)
    }
  }, [userData])

  return (
    <ProfileView
      handleActivityEvent={handleActivityEvent}
      handleSelectAll={handleSelectAll}
      selectAll={selectAll}
      filterState={filterState}
      dispatch={dispatch}
      setOffset={setOffset}
      profileUser={userInfo}
      limit={limit}
      offset={offset}
      selectedEvent={selectedEvent}
    />
  )
}

export default ProfileController
