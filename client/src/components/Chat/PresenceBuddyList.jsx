import { Fragment, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { MY_BUDDY_LIST, MY_CONVERSATIONS } from '../../graphql/query'
import { HEARTBEAT, ENSURE_DIRECT } from '../../graphql/mutations'
import { PRESENCE_UPDATED } from '../../graphql/subscription'
import { SELECTED_CHAT_ROOM } from '../../store/chat'
import LoadingSpinner from '../LoadingSpinner'

const useStyles = makeStyles(() => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  list: {
    maxHeight: 260,
    overflowY: 'auto',
  },
  presenceDot: {
    display: 'inline-block',
    width: 10,
    height: 10,
    borderRadius: '50%',
    marginRight: 8,
  },
  offline: {
    backgroundColor: '#bdc3c7',
  },
  online: {
    backgroundColor: '#2ecc71',
  },
  away: {
    backgroundColor: '#f1c40f',
  },
  dnd: {
    backgroundColor: '#e74c3c',
  },
  invisible: {
    backgroundColor: '#7f8c8d',
  },
  statusText: {
    color: '#7f8c8d',
    fontSize: 12,
    marginTop: 4,
  },
}))

const presenceOrder = ['online', 'away', 'dnd', 'invisible', 'offline']

function PresenceBuddyList({ search }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const rawUserId = useSelector((state) => state.user.data?._id)
  const myUserId = rawUserId ? rawUserId.toString() : undefined

  const {
    data: buddyData,
    loading: buddyLoading,
    subscribeToMore,
  } = useQuery(MY_BUDDY_LIST, { fetchPolicy: 'cache-and-network' })

  const {
    data: conversationData,
    loading: conversationLoading,
    refetch: refetchConversations,
  } = useQuery(MY_CONVERSATIONS, { fetchPolicy: 'cache-and-network' })

  const [heartbeat] = useMutation(HEARTBEAT)
  const [ensureDirect] = useMutation(ENSURE_DIRECT)

  useEffect(() => {
    heartbeat({ variables: { state: 'online' } })
    const interval = setInterval(() => {
      heartbeat({ variables: { state: 'online' } })
    }, 45000)
    return () => clearInterval(interval)
  }, [heartbeat])

  useEffect(() => {
    const interval = setInterval(() => {
      refetchConversations()
    }, 60000)
    return () => clearInterval(interval)
  }, [refetchConversations])

  useEffect(() => {
    const list = buddyData?.myBuddyList || []
    if (!list.length) {
      return () => {}
    }

    const unsubscribers = list.map((buddy) =>
      subscribeToMore({
        document: PRESENCE_UPDATED,
        variables: { userId: buddy.userId },
        updateQuery: (prev, { subscriptionData }) => {
          const updated = subscriptionData.data?.presenceUpdated
          if (!updated) return prev
          const nextList = prev.myBuddyList.map((item) =>
            item.userId === updated.userId
              ? {
                  ...item,
                  presence: updated,
                  statusText: updated.statusText || item.statusText,
                }
              : item,
          )
          return { ...prev, myBuddyList: nextList }
        },
      }),
    )

    return () => {
      unsubscribers.forEach((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, [buddyData, subscribeToMore])

  const buddyList = buddyData?.myBuddyList || []

  const buddyMap = useMemo(() => {
    return buddyList.reduce((acc, item) => {
      acc.set(item.userId, item)
      return acc
    }, new Map())
  }, [buddyList])

  const filteredBuddies = useMemo(() => {
    const term = search?.toLowerCase() || ''
    return buddyList
      .filter((buddy) =>
        term ? buddy.username.toLowerCase().includes(term) : true,
      )
      .sort((a, b) => {
        const stateA = a.presence?.state || 'offline'
        const stateB = b.presence?.state || 'offline'
        return (
          presenceOrder.indexOf(stateA) - presenceOrder.indexOf(stateB)
        )
      })
  }, [buddyList, search])

  const conversations = useMemo(() => {
    const term = search?.toLowerCase() || ''
    const list = conversationData?.myConversations || []
    return list
      .map((conversation) => {
        const memberIds = (conversation.memberIds || []).map((id) =>
          id?.toString(),
        )
        const participants = memberIds.reduce((acc, id) => {
          if (id === myUserId) {
            acc[id] = { username: 'You' }
          } else if (buddyMap.has(id)) {
            acc[id] = { username: buddyMap.get(id).username }
          } else {
            acc[id] = { username: `User ${id?.slice(-4)}` }
          }
          return acc
        }, {})

        let label = 'Conversation'
        if (conversation.type === 'dm') {
          const otherId = memberIds.find((id) => id !== myUserId)
          label = buddyMap.get(otherId)?.username || 'Direct Message'
        } else if (conversation.type === 'room') {
          label = conversation.postId
            ? `Room #${conversation.postId.slice(-6)}`
            : 'Group Room'
        }

        return {
          ...conversation,
          label,
          participants,
        }
      })
      .filter((conversation) =>
        term ? conversation.label.toLowerCase().includes(term) : true,
      )
      .sort((a, b) => {
        const dateA = a.lastMsgAt || a.createdAt
        const dateB = b.lastMsgAt || b.createdAt
        return new Date(dateB) - new Date(dateA)
      })
  }, [conversationData, search, myUserId, buddyMap])

  const handleBuddySelect = async (buddy) => {
    try {
      const { data } = await ensureDirect({
        variables: { withUserId: buddy.userId },
      })
      const conversation = data?.ensureDirect
      if (conversation) {
        await refetchConversations()
        const participants = {}
        ;(conversation.memberIds || []).forEach((id) => {
          const idStr = id?.toString()
          if (idStr === myUserId) {
            participants[idStr] = { username: 'You' }
          } else if (buddyMap.has(idStr)) {
            participants[idStr] = { username: buddyMap.get(idStr).username }
          }
        })
        dispatch(
          SELECTED_CHAT_ROOM({
            conversation,
            label: buddy.username,
            buddy,
            participants,
          }),
        )
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to start conversation', error)
    }
  }

  const handleConversationSelect = (conversation) => {
    dispatch(
      SELECTED_CHAT_ROOM({
        conversation,
        label: conversation.label,
        participants: conversation.participants,
      }),
    )
  }

  if (buddyLoading || conversationLoading) {
    return <LoadingSpinner size={40} />
  }

  return (
    <div className={classes.wrapper}>
      <Card className={classes.section} elevation={2}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Buddies
          </Typography>
          <List className={classes.list}>
            {filteredBuddies.length === 0 && (
              <Typography color="textSecondary">
                No buddies found. Follow people to start a conversation.
              </Typography>
            )}
            {filteredBuddies.map((buddy) => {
              const state = buddy.presence?.state || 'offline'
              return (
                <Fragment key={`buddy-${buddy.userId}`}>
                  <ListItem button onClick={() => handleBuddySelect(buddy)}>
                    <ListItemText
                      primary={
                        <span>
                          <span
                            className={`${classes.presenceDot} ${classes[state] || classes.offline}`}
                          />
                          {buddy.username}
                        </span>
                      }
                      secondary={
                        buddy.statusText ? (
                          <span className={classes.statusText}>
                            {buddy.statusText}
                          </span>
                        ) : null
                      }
                    />
                  </ListItem>
                  <Divider />
                </Fragment>
              )
            })}
          </List>
        </CardContent>
      </Card>

      <Card className={classes.section} elevation={2}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Conversations
          </Typography>
          <List className={classes.list}>
            {conversations.length === 0 && (
              <Typography color="textSecondary">
                No conversations yet.
              </Typography>
            )}
            {conversations.map((conversation) => (
              <Fragment key={`conversation-${conversation._id}`}>
                <ListItem
                  button
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <ListItemText
                    primary={conversation.label}
                    secondary={
                      conversation.lastMsgAt
                        ? `Last message ${new Date(
                            conversation.lastMsgAt,
                          ).toLocaleString()}`
                        : null
                    }
                  />
                </ListItem>
                <Divider />
              </Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  )
}

PresenceBuddyList.propTypes = {
  search: PropTypes.string,
}

export default PresenceBuddyList
