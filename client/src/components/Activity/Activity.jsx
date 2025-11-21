import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Grid } from '@material-ui/core'
import SubHeader from '../SubHeader'
import PaginatedActivityList from './PaginatedActivityList'
import { FILTER_VALUE } from '../../store/filter'
import ErrorBoundary from '../ErrorBoundary'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
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
          <PaginatedActivityList
            userId={userId}
            searchKey=""
            startDateRange={dateRangeFilter.startDate}
            endDateRange={dateRangeFilter.endDate}
            activityEvent={selectedEvent}
            defaultPageSize={15}
            pageParam="page"
            pageSizeParam="page_size"
            showPageInfo={true}
            showFirstLast={true}
            maxVisiblePages={5}
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
