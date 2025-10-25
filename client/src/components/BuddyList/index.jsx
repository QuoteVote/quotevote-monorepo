import React, { useEffect, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { GET_CHAT_ROOMS } from '../../graphql/query'
import LoadingSpinner from '../LoadingSpinner'
import BuddyItemList from './BuddyItemList'
import { presenceSortValue } from '../../utils/presence'
import { SELECTED_CHAT_ROOM } from '../../store/chat'

function BuddyList({ search }) {
  const dispatch = useDispatch()
  const selectedRoomEntry = useSelector((state) => state.chat.selectedRoom)
  const selectedRoom = selectedRoomEntry?.room
  const { loading, error, data } = useQuery(GET_CHAT_ROOMS, {
    fetchPolicy: 'cache-and-network',
  })

  const buddyList = useMemo(() => {
    if (error || loading || !data?.messageRooms) {
      return []
    }

    const presenceRank = (room) => {
      if (room.messageType !== 'USER' || !room.buddy) {
        return Number.MAX_SAFE_INTEGER
      }
      return presenceSortValue(room.buddy.presenceStatus)
    }

    return data.messageRooms
      .slice()
      .sort((a, b) => {
        const presenceDelta = presenceRank(a) - presenceRank(b)
        if (presenceDelta !== 0) {
          return presenceDelta
        }

        const unreadDelta = (b.unreadMessages || 0) - (a.unreadMessages || 0)
        if (unreadDelta !== 0) {
          return unreadDelta
        }

        return new Date(b.created) - new Date(a.created)
      })
      .map((item) => ({
        room: item,
        Text: item.title,
        color: '#191919',
        type: item.messageType,
        avatar: item.avatar,
        unreadMessages: item.unreadMessages,
        buddy: item.buddy,
      }))
  }, [data, error, loading])

  const filteredBuddyList = useMemo(() => {
    if (!search) {
      return buddyList
    }

    const query = search.trim().toLowerCase()
    if (!query) {
      return buddyList
    }

    return buddyList.filter((buddy) => {
      const nameMatch = buddy.Text?.toLowerCase().includes(query)
      const usernameMatch = buddy.buddy?.username?.toLowerCase().includes(query)
      const awayMessageMatch = buddy.buddy?.awayMessage?.toLowerCase().includes(query)
      return nameMatch || usernameMatch || awayMessageMatch
    })
  }, [buddyList, search])

  useEffect(() => {
    if (!selectedRoomEntry || !selectedRoom || !data?.messageRooms) {
      return
    }

    const updatedRoom = data.messageRooms.find((room) => room._id === selectedRoom._id)
    if (!updatedRoom) {
      return
    }

    const currentBuddy = selectedRoom?.buddy || {}
    const nextBuddy = updatedRoom?.buddy || {}

    const buddyChanged =
      (currentBuddy.presenceStatus || '') !== (nextBuddy.presenceStatus || '') ||
      (currentBuddy.awayMessage || '') !== (nextBuddy.awayMessage || '') ||
      (currentBuddy.lastActiveAt || '') !== (nextBuddy.lastActiveAt || '') ||
      (currentBuddy.name || '') !== (nextBuddy.name || '') ||
      (currentBuddy.username || '') !== (nextBuddy.username || '')

    const unreadChanged = (selectedRoom.unreadMessages || 0) !== (updatedRoom.unreadMessages || 0)

    if (buddyChanged || unreadChanged) {
      dispatch(
        SELECTED_CHAT_ROOM({
          ...selectedRoomEntry,
          room: updatedRoom,
          Text: updatedRoom.title,
          avatar: updatedRoom.avatar,
          unreadMessages: updatedRoom.unreadMessages,
          buddy: updatedRoom.buddy,
        }),
      )
    }
  }, [data, dispatch, selectedRoom, selectedRoomEntry])

  if (loading) return <LoadingSpinner size={50} />

  return <BuddyItemList buddyList={filteredBuddyList} />
}

BuddyList.propTypes = {
  search: PropTypes.string,
}

export default BuddyList
