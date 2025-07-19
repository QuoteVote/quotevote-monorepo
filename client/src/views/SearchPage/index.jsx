import { makeStyles } from '@mui/styles'
import {
  Grid,
  Typography,
  InputBase,
  Paper,
  IconButton,
  Button,
} from '@mui/material'
import { useQuery } from '@apollo/react-hooks'
import { useSelector } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import Search from '@mui/icons-material/Search'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import format from 'date-fns/format'
import { jwtDecode } from 'jwt-decode'
import { GET_TOP_POSTS, GET_FEATURED_POSTS } from '../../graphql/query'
import { serializePost } from '../../utils/objectIdSerializer'
import PostsList from '../../components/Post/PostsList'
import ErrorBoundary from '../../components/ErrorBoundary'
import Carousel from '../../components/Carousel/Carousel'
import PostCard from '../../components/Post/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import Tooltip from '@mui/material/Tooltip'
import SearchGuestSections from '../../components/SearchContainer/SearchGuestSections'
import GuestFooter from '../../components/GuestFooter'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '2rem',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#f0f2f5',
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    marginLeft: '10%',
    marginRight: '10%',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },
  logoImage: {
    width: '100%',
    maxWidth: 500,
    height: 'auto',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(1, 2),
    marginBottom: theme.spacing(2),
    border: '1px solid #ddd',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    color: theme.palette.text.secondary,
  },
  tagline: {
    color: theme.palette.text.secondary,
  },
  iconsContainer: {
    marginTop: theme.spacing(2),
  },
  icon: {
    margin: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
    fontSize: '1.5rem',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: theme.palette.action.hover,
    },
  },
  list: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
  activeFilter: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  datePickerContainer: {
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    '& .DateRangePickerInput': {
      display: 'none !important',
    },
    '& .DateRangePicker_picker': {
      position: 'static !important',
      boxShadow: 'none !important',
      border: 'none !important',
      display: 'block !important',
      visibility: 'visible !important',
      opacity: '1 !important',
    },
    '& .DayPicker': {
      background: 'white !important',
      display: 'block !important',
      visibility: 'visible !important',
      opacity: '1 !important',
    },
    '& .DayPicker_weekHeader': {
      background: 'white !important',
      display: 'table-row !important',
    },
    '& .DayPicker_weekHeader_ul': {
      background: 'white !important',
      display: 'table-row !important',
    },
    '& .DayPicker_transitionContainer': {
      background: 'white !important',
      display: 'block !important',
      visibility: 'visible !important',
      opacity: '1 !important',
    },
    '& .DayPicker_focusRegion': {
      background: 'white !important',
      display: 'block !important',
    },
    '& .DayPicker_weekHeader_li': {
      fontWeight: 'bold',
      color: theme.palette.text.primary,
      display: 'table-cell !important',
    },
    '& .CalendarDay__default': {
      border: 'none',
      color: theme.palette.text.primary,
      fontWeight: '500',
      display: 'table-cell !important',
    },
    '& .CalendarDay__default:hover': {
      background: theme.palette.action.hover,
      border: 'none',
      borderRadius: '50%',
    },
    '& .CalendarDay__selected, .CalendarDay__selected:active, .CalendarDay__selected:hover': {
      background: '#28a745 !important',
      color: 'white !important',
      borderRadius: '50% !important',
    },
    '& .CalendarDay__selected_span': {
      background: '#e9ecef !important',
      color: theme.palette.text.primary,
    },
    '& .CalendarDay__hovered_span, .CalendarDay__hovered_span:hover': {
      background: '#e9ecef !important',
      color: theme.palette.text.primary,
      borderRadius: '0',
    },
    '& .CalendarDay__selected_start.CalendarDay__selected_span, & .CalendarDay__selected_end.CalendarDay__selected_span': {
      background: '#28a745 !important',
      color: 'white !important',
    },
    '& .DateInput_input, & .DateInput_input__focused': {
      borderBottom: 'none',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  },
  filterButton: {
    margin: theme.spacing(1),
  },
  datePickerInput: {
    '& .react-datepicker-wrapper': {
      width: '100%',
    },
    '& .react-datepicker__input-container input': {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: theme.typography.fontFamily,
      '&:focus': {
        outline: 'none',
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
      },
    },
    '& .react-datepicker': {
      fontFamily: theme.typography.fontFamily,
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    },
    '& .react-datepicker__header': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderBottom: '1px solid #ddd',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    '& .react-datepicker__current-month': {
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
    },
    '& .react-datepicker__day-name': {
      color: theme.palette.primary.contrastText,
    },
    '& .react-datepicker__day': {
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
        borderRadius: '50%',
      },
    },
    '& .react-datepicker__day--selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
    },
    '& .react-datepicker__day--in-range': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
    },
    '& .react-datepicker__day--keyboard-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
    },
  },
}))

export default function SearchPage() {
  const classes = useStyles()
  const [showResults, setShowResults] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const hiddenPosts = useSelector((state) => state.ui.hiddenPosts) || []
  const user = useSelector((state) => state.user.data)
  const limit = 12 + hiddenPosts.length
  const [offset, setOffset] = useState(0)
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: null,
    endDate: null,
  })

  // New state for multiple filter modes - now each filter can be active independently
  const [activeFilters, setActiveFilters] = useState({
    friends: false,
    interactions: false,
  })
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // Guest mode state
  const [isGuestMode, setIsGuestMode] = useState(false)

  // Sort order state - null for not toggled, 'desc' for newest first, 'asc' for oldest first
  const [sortOrder, setSortOrder] = useState(null)

  // Simple authentication check that doesn't dispatch Redux actions
  const checkAuthentication = () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) return false

    try {
      const decoded = jwtDecode(storedToken)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      if (decoded.exp && decoded.exp < currentTime) {
        return false
      }

      return true
    } catch (err) {
      return false
    }
  }

  // Check authentication status in useEffect to avoid infinite re-renders
  useEffect(() => {
    const isAuthenticated = checkAuthentication()
    const guestMode = !isAuthenticated || !user || !user._id
    setIsGuestMode(guestMode)
  }, [user])

  const variables = {
    limit,
    offset,
    searchKey,
    startDateRange: dateRangeFilter.startDate
      ? format(dateRangeFilter.startDate, 'yyyy-MM-dd')
      : '',
    endDateRange: dateRangeFilter.endDate
      ? format(dateRangeFilter.endDate, 'yyyy-MM-dd')
      : '',
    friendsOnly: activeFilters.friends,
    interactions: activeFilters.interactions,
    ...(sortOrder ? { sortOrder } : {}),
    // Add a dummy variable that changes when filters change to force refetch
    filterKey: `${activeFilters.friends}-${activeFilters.interactions}-${
      dateRangeFilter.startDate
        ? format(dateRangeFilter.startDate, 'yyyy-MM-dd')
        : ''
    }-${
      dateRangeFilter.endDate
        ? format(dateRangeFilter.endDate, 'yyyy-MM-dd')
        : ''
    }-${sortOrder}`,
  }

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_TOP_POSTS, {
    variables,
    fetchPolicy: 'network-only',
    skip: !showResults && !isGuestMode, // Show results automatically for guest mode
    errorPolicy: 'all', // Allow partial errors
    notifyOnNetworkStatusChange: true,
    pollInterval: 3000, // Poll every 3 seconds
  })

  const { data: featuredData, refetch: refetchFeatured, loading: featuredLoading } = useQuery(GET_FEATURED_POSTS, {
    variables: {
      limit: 10,
      offset: 0,
      searchKey: searchKey,
      startDateRange: dateRangeFilter.startDate
        ? format(dateRangeFilter.startDate, 'yyyy-MM-dd')
        : '',
      endDateRange: dateRangeFilter.endDate
        ? format(dateRangeFilter.endDate, 'yyyy-MM-dd')
        : '',
      friendsOnly: false,
      interactions: activeFilters.interactions,
      // Don't apply sort order for guest mode - let backend use default ordering
    },
    skip: !isGuestMode,
    fetchPolicy: 'cache-first', // Use cache for better performance
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Reduce unnecessary updates
    // Add cache time to reduce refetches
    nextFetchPolicy: 'cache-first',
  })

  // Auto-show results for guest mode
  useEffect(() => {
    if (isGuestMode && !showResults) {
      setShowResults(true)
    }
  }, [isGuestMode, showResults])

  // Function to trigger query refetch when filters change
  const triggerQueryRefetch = () => {
    console.log('Triggering query refetch with variables:', variables)
    if (showResults) {
      refetch(variables)
    }
  }

  // Refetch when active filters change - only for interactions filter
  useEffect(() => {
    if (showResults) {
      console.log('Active filters changed, refetching query')
      refetch(variables)
    }
    // Only refetch featured posts when interactions filter changes
    if (isGuestMode && activeFilters.interactions !== undefined) {
      refetchFeatured()
    }
  }, [activeFilters.interactions, showResults, isGuestMode])

  // Refetch when sort order changes
  useEffect(() => {
    if (showResults) {
      console.log('Sort order changed, refetching query')
      refetch(variables)
    }
    // Don't refetch featured posts when sort order changes for guest mode
    // since we don't apply sort order to featured posts in guest mode
  }, [sortOrder, showResults])

  // Refetch when date range changes
  useEffect(() => {
    if (showResults && (dateRangeFilter.startDate || dateRangeFilter.endDate)) {
      console.log('Date range changed, refetching query')
      refetch(variables)
    }
    // Only refetch featured posts when date range changes
    if (isGuestMode && (dateRangeFilter.startDate || dateRangeFilter.endDate)) {
      refetchFeatured()
    }
  }, [dateRangeFilter.startDate, dateRangeFilter.endDate, showResults, isGuestMode])

  // Refetch featured posts when search key changes in guest mode - with debouncing
  useEffect(() => {
    if (isGuestMode && searchKey) {
      const timeoutId = setTimeout(() => {
        refetchFeatured()
      }, 300) // Debounce search for 300ms
      
      return () => clearTimeout(timeoutId)
    }
  }, [searchKey, isGuestMode])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowResults(true)
  }

  const handleFriendsFilter = () => {
    console.log('Friends filter clicked, current state:', activeFilters.friends)

    if (!user || !user._id) {
      console.log('User not logged in, cannot use friends filter')
      alert('Please log in to use the friends filter')
      return
    }

    setActiveFilters((prev) => ({
      ...prev,
      friends: !prev.friends,
    }))
    setOffset(0)
    setShowResults(true)
  }

  const handleInteractionsFilter = () => {
    console.log(
      'Interactions filter clicked, current state:',
      activeFilters.interactions,
    )
    setActiveFilters((prev) => ({
      ...prev,
      interactions: !prev.interactions,
    }))
    setOffset(0)
    setShowResults(true)
  }

  const handleSortOrderToggle = () => {
    console.log('Sort order toggle clicked, current state:', sortOrder)
    setSortOrder((prev) => {
      if (prev === null) return 'asc'
      if (prev === 'asc') return 'desc'
      return null
    })
    setOffset(0)
    setShowResults(true)
  }

  const handleDateFilterToggle = (event) => {
    const willBeVisible = !isCalendarVisible
    setIsCalendarVisible(willBeVisible)
    setFocusedInput(willBeVisible ? 'startDate' : null)
  }

  const handleDateChange = (dateRange) => {
    const [startDate, endDate] = dateRange
    setDateRangeFilter({ startDate, endDate })
    setOffset(0)
    setTimeout(() => {
      triggerQueryRefetch()
    }, 100)
    if (startDate && endDate) {
      setIsCalendarVisible(false)
      setFocusedInput(null)
    }
    setShowResults(true)
  }

  const clearDateFilter = () => {
    setDateRangeFilter({ startDate: null, endDate: null })
    setOffset(0)
    setTimeout(() => {
      triggerQueryRefetch()
    }, 100)
  }

  const clearDateFilterAndClose = () => {
    clearDateFilter()
    setIsCalendarVisible(false)
    setFocusedInput(null)
  }

  // Helper function to check if any filters are active
  const hasActiveFilters = () => {
    return (
      activeFilters.friends ||
      activeFilters.interactions ||
      dateRangeFilter.startDate ||
      dateRangeFilter.endDate ||
      sortOrder !== null // Consider non-default sort order as an active filter
    )
  }

  // Return data exactly as received from API without any sorting
  const processAndSortData = (rawData) => {
    if (!rawData) return null

    if (!rawData.posts || !rawData.posts.entities) {
      return null
    }

    // Simply serialize the posts and return the data exactly as received
    let processedData = {
      ...rawData,
      posts: {
        ...rawData.posts,
        entities: rawData.posts?.entities?.map((post) => serializePost(post)),
      },
    }

    return processedData
  }

  // Handle GraphQL errors gracefully
  const hasError =
    error && error.graphQLErrors && error.graphQLErrors.length > 0
  const errorMessage = hasError ? error.graphQLErrors[0].message : null

  if (hasError && errorMessage?.includes('friendsOnly')) {
    // If backend doesn't support friendsOnly, fall back to client-side filtering
    console.warn(
      'Backend does not support friendsOnly parameter, using client-side filtering',
    )
  }

  const processedData = processAndSortData(data)

  const featuredPosts = useMemo(() => {
    return (featuredData?.featuredPosts?.entities || []).map((post) =>
      serializePost(post),
    )
  }, [featuredData?.featuredPosts?.entities])

  // Create carousel items from posts for guest mode
  const createCarouselItems = useMemo(() => {
    if (!featuredPosts || !featuredPosts.length) return []

    return featuredPosts.map((post) => (
      <div
        key={post._id}
        style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}
      >
        <PostCard
          _id={post._id}
          text={post.text}
          title={post.title}
          url={post.url}
          bookmarkedBy={post.bookmarkedBy || []}
          created={post.created}
          creator={post.creator}
          activityType={post.activityType || 'POSTED'}
          votes={post.votes || []}
          comments={post.comments || []}
          quotes={post.quotes || []}
          messageRoom={{ messages: post.messageRoom?.messages || [] }}
          groupId={post.groupId}
          limitText={false}
        />
      </div>
    ))
  }, [featuredPosts])

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.container}
          spacing={1}
        >
          <Grid item>
            <div className={classes.logoContainer}>
              <img
                src="/assets/search-quote-vote.png"
                alt="logo"
                className={classes.logoImage}
              />
            </div>
          </Grid>

          <Grid item>
            <Typography
              className={classes.tagline}
              style={{ marginBottom: '1rem' }}
            >
              No algorithms. No ads. Just conversations.
            </Typography>
          </Grid>

          <Grid item style={{ width: '100%', maxWidth: 600 }}>
            <Paper
              component="form"
              className={classes.searchBar}
              onSubmit={handleSearch}
            >
              <InputBase
                className={classes.input}
                placeholder="Search..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <Search />
              </IconButton>
            </Paper>
          </Grid>
          <Grid item className={classes.iconsContainer}>
            <Tooltip
              title={
                user && user._id
                  ? 'Following: Show posts from people you follow only'
                  : 'Following: Please log in to filter by people you follow'
              }
              placement="bottom"
              arrow
            >
              <span>
                <IconButton
                  aria-label="friends"
                  className={`${classes.icon} ${
                    activeFilters.friends ? classes.activeFilter : ''
                  }`}
                  onClick={handleFriendsFilter}
                  disabled={!user || !user._id}
                  style={{ opacity: !user || !user._id ? 0.5 : 1 }}
                >
                  👥
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title="Sort: Arrange posts by most interactions (comments, votes, quotes)"
              placement="bottom"
              arrow
            >
              <IconButton
                aria-label="filter"
                className={`${classes.icon} ${
                  activeFilters.interactions ? classes.activeFilter : ''
                }`}
                onClick={handleInteractionsFilter}
              >
                🧲
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Date Selector: Filter posts by specific date range"
              placement="bottom"
              arrow
            >
              <IconButton
                aria-label="calendar"
                className={`${classes.icon} ${
                  dateRangeFilter.startDate ||
                  dateRangeFilter.endDate ||
                  isCalendarVisible
                    ? classes.activeFilter
                    : ''
                }`}
                onClick={(e) => handleDateFilterToggle(e)}
              >
                📅
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                isGuestMode
                  ? 'Sort: Please log in to use sort filters'
                  : sortOrder === null
                  ? 'Sort: Default order (click to sort by oldest first)'
                  : sortOrder === 'asc'
                  ? 'Sort: Oldest first (click to sort by newest first)'
                  : 'Sort: Newest first (click to clear sort)'
              }
              placement="bottom"
              arrow
            >
              <span>
                <IconButton
                  aria-label="sort"
                  className={`${classes.icon} ${
                    sortOrder !== null ? classes.activeFilter : ''
                  }`}
                  onClick={handleSortOrderToggle}
                  disabled={isGuestMode}
                  style={{ opacity: isGuestMode ? 0.5 : 1 }}
                >
                  <span style={{
                    filter: sortOrder === null ? 'grayscale(1) opacity(0.5)' : 'none',
                    fontSize: '1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                    🕐
                    {sortOrder === 'asc' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        fontSize: '0.6em',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}>
                        ⬆️
                      </span>
                    )}
                    {sortOrder === 'desc' && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-2px',
                        right: '-2px',
                        fontSize: '0.6em',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '50%',
                        width: '12px',
                        height: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                      }}>
                        ⬇️
                      </span>
                    )}
                  </span>
                </IconButton>
              </span>
            </Tooltip>
          </Grid>

          {isCalendarVisible && (
            <Grid
              item
              xs={12}
              style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                background: '#fff',
                border: '1px solid #eee',
                maxWidth: 600,
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'center', gap: 16 }}
              >
                <div style={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    style={{ marginBottom: 8, textAlign: 'center' }}
                  >
                    Start Date
                  </Typography>
                  <div className={classes.datePickerInput}>
                    <DatePicker
                      selected={dateRangeFilter.startDate}
                      onChange={(date) =>
                        handleDateChange([date, dateRangeFilter.endDate])
                      }
                      selectsStart
                      startDate={dateRangeFilter.startDate}
                      endDate={dateRangeFilter.endDate}
                      maxDate={dateRangeFilter.endDate || new Date()}
                      dateFormat="MMM d, yyyy"
                      placeholderText="Select start date"
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    style={{ marginBottom: 8, textAlign: 'center' }}
                  >
                    End Date
                  </Typography>
                  <div className={classes.datePickerInput}>
                    <DatePicker
                      selected={dateRangeFilter.endDate}
                      onChange={(date) =>
                        handleDateChange([dateRangeFilter.startDate, date])
                      }
                      selectsEnd
                      startDate={dateRangeFilter.startDate}
                      endDate={dateRangeFilter.endDate}
                      minDate={dateRangeFilter.startDate}
                      maxDate={new Date()}
                      dateFormat="MMM d, yyyy"
                      placeholderText="Select end date"
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={clearDateFilterAndClose}
                  size="small"
                >
                  Clear and Close
                </Button>
              </div>
            </Grid>
          )}

          {/* Filter Status Display */}
          {showResults && hasActiveFilters() && (
            <Grid item style={{ width: '100%', marginTop: 16 }}>
              <Paper style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2" color="textSecondary">
                  Active Filters:
                  {activeFilters.friends && ' 👥 Friends only'}
                  {activeFilters.interactions && ' 🧲 Sorted by interactions'}
                  {sortOrder === 'asc' && ' 🕐⬆️ Oldest first'}
                  {sortOrder === 'desc' && ' 🕐⬇️ Newest first'}
                  {dateRangeFilter.startDate &&
                    ` 📅 From ${format(
                      dateRangeFilter.startDate,
                      'MMM d, yyyy',
                    )}`}
                  {dateRangeFilter.endDate &&
                    ` to ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`}
                </Typography>
                {activeFilters.friends && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', marginTop: 8 }}
                  >
                    Showing posts from people you follow
                  </Typography>
                )}
                {activeFilters.interactions && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', marginTop: 8 }}
                  >
                    Posts sorted by total interactions (comments + votes +
                    quotes)
                  </Typography>
                )}
                {sortOrder === 'asc' && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', marginTop: 8 }}
                  >
                    Posts sorted by creation date (oldest to newest)
                  </Typography>
                )}
                {sortOrder === 'desc' && (
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: 'block', marginTop: 8 }}
                  >
                    Posts sorted by creation date (newest to oldest)
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}

          {isGuestMode && (
            <>
              {featuredData?.featuredPosts ? (
                featuredPosts.length > 0 ? (
                  <Grid item style={{ width: '100%', maxWidth: '800px' }}>
                    <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      Featured Posts
                      {searchKey && ` - "${searchKey}"`}
                    </Typography>
                    <Carousel navButtonsAlwaysVisible autoplay={false}>
                      {createCarouselItems}
                    </Carousel>
                  </Grid>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                      ⭐
                    </div>
                    <Typography variant="h6" style={{ color: '#666' }}>
                      No featured posts found
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: '#999', marginTop: '0.5rem' }}
                    >
                      {searchKey 
                        ? `No featured posts match "${searchKey}"`
                        : hasActiveFilters()
                        ? 'No featured posts match your filters'
                        : 'Check back later for featured content'
                      }
                    </Typography>
                  </div>
                )
              ) : featuredLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <LoadingSpinner size={60} />
                  <Typography
                    variant="h6"
                    style={{ marginTop: '1rem', color: '#666' }}
                  >
                    Loading featured posts...
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ marginTop: '0.5rem', color: '#999' }}
                  >
                    Please wait while we fetch featured content
                  </Typography>
                </div>
              ) : null}
            </>
          )}

          {!isGuestMode && (
            <Grid item xs={12} className={classes.list}>
              {loading && !processedData && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <LoadingSpinner size={60} />
                  <Typography
                    variant="h6"
                    style={{ marginTop: '1rem', color: '#666' }}
                  >
                    {searchKey
                      ? 'Searching posts...'
                      : hasActiveFilters()
                      ? 'Applying filters...'
                      : 'Loading posts...'}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ marginTop: '0.5rem', color: '#999' }}
                  >
                    {searchKey
                      ? `Please wait while we search for "${searchKey}"`
                      : hasActiveFilters()
                      ? `Please wait while we apply filters: ${
                          activeFilters.friends ? 'Friends only, ' : ''
                        }${
                          activeFilters.interactions
                            ? 'Sorted by interactions, '
                            : ''
                        }${
                          dateRangeFilter.startDate || dateRangeFilter.endDate
                            ? 'Date range, '
                            : ''
                        }`.replace(/,\s*$/, '')
                      : 'Please wait while we fetch the latest conversations'}
                  </Typography>
                </div>
              )}

              {processedData && (
                <PostsList
                  data={processedData}
                  loading={loading}
                  limit={limit}
                  fetchMore={fetchMore}
                  variables={variables}
                  cols={1}
                />
              )}

              {(!processedData ||
                processedData?.posts?.entities?.length === 0) &&
                !loading && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '2rem',
                      marginTop: '2rem',
                    }}
                  >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                      🔍
                    </div>
                    <Typography variant="h6" style={{ color: '#666' }}>
                      No posts found
                    </Typography>
                    <Typography
                      variant="body2"
                      style={{ color: '#999', marginTop: '0.5rem' }}
                    >
                      Try adjusting your search or filters
                    </Typography>
                  </div>
                )}
            </Grid>
          )}

          {isGuestMode && <SearchGuestSections />}

          {/* Guest Footer Section */}
          {isGuestMode && <GuestFooter />}
        </Grid>
      </div>
    </ErrorBoundary>
  );
}

/* Add this to the bottom of the file (outside the component) for responsive flex direction */
if (typeof window !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    .discover-section-flex {
      flex-direction: column;
    }
    @media (min-width: 900px) {
      .discover-section-flex {
        flex-direction: row !important;
      }
    }
    
    /* Guest footer responsive styles */
    .guest-footer {
      flex-direction: column;
      gap: 16px;
      padding: 0 16px;
      align-items: center;
    }
    
    .footer-text {
      text-align: center;
    }
    
    .footer-links {
      justify-content: center;
    }
    
    @media (min-width: 768px) {
      .guest-footer {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 24px;
      }
      
      .footer-text {
        text-align: left;
      }
      
      .footer-links {
        justify-content: flex-end;
      }
    }
    
    /* Touch-friendly link styles for mobile */
    @media (max-width: 767px) {
      .guest-footer a {
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `
  document.head.appendChild(style)
}
