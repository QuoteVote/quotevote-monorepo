import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/react-hooks'
import { makeStyles } from '@mui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import SubHeader from '../SubHeader'
import ActivityList from './ActivityList'
import { GET_USER_ACTIVITY } from '../../graphql/query'
import { FILTER_VALUE } from '../../store/filter'
import ErrorBoundary from '../ErrorBoundary'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  list: {
    marginRight: 10,
    maxWidth: '70%',
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      marginRight: 5,
      marginLeft: 5,
      maxWidth: '100%',
    },
  },
}))

export default function Activity({ showSubHeader = true, userId = '' }) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const limit = 15
  const [offset, setOffset] = useState(0)
  // const conditions = ['POSTED', 'VOTED', 'COMMENTED', 'QUOTED', 'LIKED']
  const conditions = ['POSTED']
  const [selectedEvent, setSelectedEvent] = useState(conditions)
  const [dateRangeFilter, setDateRangeFilter] = useState({ startDate: '', endDate: '' })
  const [selectAll, setSelectAll] = useState('ALL')
  const handleSelectAll = (event, newSelectAll) => {
    if (newSelectAll.length) {
      setSelectedEvent(conditions)
      dispatch(FILTER_VALUE(conditions))
    }
    setSelectAll(newSelectAll)
  }
  const handleActivityEvent = (event, newActivityEvent) => {
    if (selectAll.length) {
      const newFilter = conditions.filter((condition) => !newActivityEvent.includes(condition))
      setSelectAll([])
      setSelectedEvent(newFilter)
      dispatch(FILTER_VALUE(newFilter))
    } else if (!newActivityEvent.length) {
      setSelectAll(['ALL'])
      setSelectedEvent(conditions)
      dispatch(FILTER_VALUE(conditions))
    } else {
      const isAllToggled = newActivityEvent.length === 4
      setSelectAll(isAllToggled ? ['ALL'] : [])
      setSelectedEvent(newActivityEvent)
      dispatch(FILTER_VALUE(newActivityEvent))
    }
  }

  const searchKey = ''
  const variables = {
    limit,
    offset,
    searchKey,
    activityEvent: JSON.stringify(selectedEvent),
    user_id: userId,
    startDateRange: dateRangeFilter.startDate,
    endDateRange: dateRangeFilter.endDate,
  }
  const { loading, data, fetchMore } = useQuery(GET_USER_ACTIVITY, {
    variables,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filterState = useSelector((state) => state.filter)
  return (
    <ErrorBoundary>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.root}
        spacing={2}
      >
        {showSubHeader && (
          <Grid item xs={12}>
            <SubHeader
              showFilterIconButton={false}
              headerName="Activity Feed"
              setOffset={setOffset}
              showSubHeader={showSubHeader}
            />
          </Grid>
        )}

        <Grid item xs={12} className={classes.list}>
          <ActivityList
            data={data}
            loading={loading}
            limit={limit}
            selectAll={selectAll}
            handleSelectAll={handleSelectAll}
            handleActivityEvent={handleActivityEvent}
            fetchMore={fetchMore}
            variables={variables}
          />
        </Grid>
      </Grid>
    </ErrorBoundary>
  )
}

Activity.propTypes = {
  showSubHeader: PropTypes.bool.isRequired,
  userId: PropTypes.string,
}
