import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Typography,
  InputBase,
  Paper,
  IconButton,
  Button,
} from '@material-ui/core'
import { useQuery } from '@apollo/react-hooks'
import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useMemo } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import format from 'date-fns/format'
import { jwtDecode } from 'jwt-decode'
import { GET_TOP_POSTS, GET_FEATURED_POSTS, LOCAL_QUOTES } from '../../graphql/query'
import { serializePost } from '../../utils/objectIdSerializer'
import { fetchLocation, selectLocation, selectIsLoading as selectLocationLoading, selectError as selectLocationError } from '../../store/location'
import { checkPermission } from '../../utils/geolocationService'
import LocationPermissionDialog from '../../components/LocationPermissionDialog'
import LocationBadge from '../../components/LocationBadge'
import PaginatedPostsList from '../../components/Post/PaginatedPostsList'
import ErrorBoundary from '../../components/ErrorBoundary'
import Carousel from '../../components/Carousel/Carousel'
import PostCard from '../../components/Post/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import Tooltip from '@material-ui/core/Tooltip'
import SearchGuestSections from '../../components/SearchContainer/SearchGuestSections'
import GuestFooter from '../../components/GuestFooter'
import SEOHead from '../../components/common/SEOHead'
import { generateCanonicalUrl, generatePaginationUrls, generatePageTitle, generatePageDescription, extractUrlParams } from '../../utils/seo'

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
    [theme.breakpoints.down('sm')]: {
      marginLeft: '5px',
      marginRight: '5px',
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: '2px',
      marginRight: '2px',
    },
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: theme.spacing(4),
    minWidth: '280px',
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2.5),
      minWidth: '240px',
    },
    [theme.breakpoints.down('xs')]: {
      gap: theme.spacing(2),
      minWidth: '200px',
    },
  },
  icon: {
    margin: 0,
    color: theme.palette.text.secondary,
    fontSize: '1.5rem',
    transition: 'all 0.2s ease-in-out',
    minWidth: 'auto',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
      padding: theme.spacing(1.5),
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.5rem',
      padding: theme.spacing(1.25),
    },
    '&:hover': {
      transform: 'scale(1.02)',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.24)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    },
  },
  list: {
    marginTop: theme.spacing(4),
    width: '100%',
  },
  activeFilter: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      border: `1px solid ${theme.palette.primary.dark}`,
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.24)',
      transform: 'scale(1.02)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    },
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
  const dispatch = useDispatch()
  const [showResults, setShowResults] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const user = useSelector((state) => state.user.data)
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: null,
    endDate: null,
  })

  // New state for multiple filter modes - now each filter can be active independently
  const [activeFilters, setActiveFilters] = useState({
    friends: false,
    interactions: false,
    local: false,
  })
  
  // Location permission dialog state
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)
  
  // Get location state from Redux
  const userLocation = useSelector(selectLocation)
  const isLocationLoading = useSelector(selectLocationLoading)
  const locationError = useSelector(selectLocationError)
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null)

  // Guest mode state
  const [isGuestMode, setIsGuestMode] = useState(false)

  // Sort order state - 'desc' for newest first (default), 'asc' for oldest first, null for no sort
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Track if user has ever interacted with filters - once true, never show featured posts again
  const [hasEverInteractedWithFilters, setHasEverInteractedWithFilters] = useState(false)

  // Track total count for results
  const [totalCount, setTotalCount] = useState(0)

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


  // Query for local quotes when local filter is active
  const { data: localQuotesData, loading: localQuotesLoading, error: localQuotesError } = useQuery(LOCAL_QUOTES, {
    variables: {
      near: userLocation ? {
        latitude: userLocation.lat,
        longitude: userLocation.lng,
      } : null,
      radiusKm: 10, // Default 10km radius
      limit: 50,
      offset: 0,
    },
    skip: !activeFilters.local || !userLocation,
    fetchPolicy: 'network-only',
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
      ...(sortOrder === 'asc' ? { sortOrder } : {}), // Only include sortOrder if it's 'asc' (non-default)
      // Allow sort order for all users now
    },
    skip: !isGuestMode || hasEverInteractedWithFilters, // Don't show featured posts if user has ever interacted with filters
    fetchPolicy: 'cache-first', // Use cache for better performance
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false, // Reduce unnecessary updates
    // Add cache time to reduce refetches
    nextFetchPolicy: 'cache-first',
  })

  // Auto-show results for guest mode and when filters are active
  useEffect(() => {
    if (isGuestMode && !showResults) {
      setShowResults(true)
    }
  }, [isGuestMode, showResults])

  // Show results when any filter is active
  useEffect(() => {
    if (hasActiveFilters()) {
      setShowResults(true)
    }
  }, [activeFilters, sortOrder, dateRangeFilter])


  const handleSearch = (e) => {
    e.preventDefault()
    // Mark that user has interacted with filters (search is also a filter interaction)
    setHasEverInteractedWithFilters(true)
    
    setShowResults(true)
  }

  const handleFriendsFilter = () => {
    console.log('Friends filter clicked, current state:', activeFilters.friends)
    
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    if (!user || !user._id) {
      console.log('User not logged in, friends filter will show all posts')
      // Allow unauthenticated users to toggle the filter, but it will show all posts
      setActiveFilters((prev) => ({
        ...prev,
        friends: !prev.friends,
      }))
      setShowResults(true)
      return
    }

    setActiveFilters((prev) => ({
      ...prev,
      friends: !prev.friends,
    }))
    setShowResults(true)
  }

  const handleInteractionsFilter = () => {
    console.log(
      'Interactions filter clicked, current state:',
      activeFilters.interactions,
    )
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)
    
    setActiveFilters((prev) => ({
      ...prev,
      interactions: !prev.interactions,
    }))
    setShowResults(true)
  }

  const handleLocalFilter = async () => {
    console.log('Local filter clicked, current state:', activeFilters.local)
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)
    
    const newLocalState = !activeFilters.local
    
    if (newLocalState) {
      // User is turning on local filter
      try {
        const permissionState = await checkPermission()
        
        if (permissionState === 'denied') {
          // Show error - permission was denied
          console.warn('Location permission denied')
          setShowPermissionDialog(true)
          return
        }
        
        if (permissionState === 'prompt' || !userLocation) {
          // Show permission dialog
          setShowPermissionDialog(true)
          return
        }
        
        // Permission already granted and we have location
        setActiveFilters((prev) => ({
          ...prev,
          local: true,
        }))
        setShowResults(true)
      } catch (error) {
        console.error('Error checking location permission:', error)
      }
    } else {
      // User is turning off local filter
      setActiveFilters((prev) => ({
        ...prev,
        local: false,
      }))
      setShowResults(true)
    }
  }

  const handleSortOrderToggle = () => {
    console.log('Sort order toggle clicked, current state:', sortOrder)
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)
    
    setSortOrder((prev) => {
      const newSortOrder = prev === 'desc' ? 'asc' : 'desc'
      console.log('Sort order changing from', prev, 'to', newSortOrder)
      return newSortOrder
    })
    setShowResults(true)
  }

  const handleDateFilterToggle = (event) => {
    const willBeVisible = !isCalendarVisible
    setIsCalendarVisible(willBeVisible)
    setFocusedInput(willBeVisible ? 'startDate' : null)
  }

  const handleDateChange = (dateRange) => {
    const [startDate, endDate] = dateRange
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)
    
    setDateRangeFilter({ startDate, endDate })
    if (startDate && endDate) {
      setIsCalendarVisible(false)
      setFocusedInput(null)
    }
    setShowResults(true)
  }

  const clearDateFilter = () => {
    setDateRangeFilter({ startDate: null, endDate: null })
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
      sortOrder === 'asc' // Consider 'asc' (oldest first) as an active filter since 'desc' is default
    )
  }



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

  // Generate SEO meta tags
  const urlParams = extractUrlParams({ search: window.location.search })
  const baseUrl = window.location.origin + window.location.pathname
  const canonicalUrl = generateCanonicalUrl(baseUrl, {
    ...urlParams,
    searchKey,
    sortOrder,
    friendsOnly: activeFilters.friends,
    interactions: activeFilters.interactions,
    startDateRange: dateRangeFilter.startDate ? format(dateRangeFilter.startDate, 'yyyy-MM-dd') : '',
    endDateRange: dateRangeFilter.endDate ? format(dateRangeFilter.endDate, 'yyyy-MM-dd') : '',
  })

  const pageTitle = generatePageTitle(
    'Search Posts - QuoteVote',
    urlParams.page,
    1, // We don't have total pages here, but it's not critical for title
    searchKey
  )

  const pageDescription = generatePageDescription(
    'Search and discover posts, quotes, and conversations on QuoteVote. Find interesting discussions and join the conversation.',
    urlParams.page,
    1,
    searchKey,
    0, // We don't have total count here
    urlParams.pageSize
  )

  return (
    <ErrorBoundary>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonicalUrl={canonicalUrl}
        keywords="search, posts, quotes, conversations, discussions, social media"
        ogImage="/assets/search-quote-vote.png"
        ogType="website"
      />
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
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
          <Grid item className={classes.iconsContainer} style={{ width: '100%' }}>
            <Tooltip
              title={
                user && user._id
                  ? 'Following: Show posts from people you follow only'
                  : 'Following: Show all posts (login to filter by people you follow)'
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
              title={
                isGuestMode
                  ? 'Local: Login to filter posts by your location'
                  : activeFilters.local
                  ? 'Local: Showing posts near you (click to show all)'
                  : 'Local: Show posts near your location'
              }
              placement="bottom"
              arrow
            >
              <span>
                <IconButton
                  aria-label="local"
                  className={`${classes.icon} ${
                    activeFilters.local ? classes.activeFilter : ''
                  }`}
                  onClick={handleLocalFilter}
                  disabled={isGuestMode}
                  style={{ opacity: isGuestMode ? 0.5 : 1 }}
                >
                  <LocationOnIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                sortOrder === null
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
                    sortOrder === 'asc' ? classes.activeFilter : ''
                  }`}
                  onClick={handleSortOrderToggle}
                >
                  <span style={{
                    fontSize: '1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}>
                    {sortOrder === 'asc' && '⏳'}
                    {sortOrder === 'desc' && '⌛'}
                  </span>
                </IconButton>
              </span>
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

          {/* Filter Rules Display - Always show after any filter interaction */}
          {showResults && hasEverInteractedWithFilters && (
            <Grid item style={{ width: '100%', marginTop: 16 }}>
              <Paper style={{ 
                padding: 20, 
                backgroundColor: '#f8f9fa', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <Typography variant="h6" style={{ marginBottom: 12, color: '#333', fontWeight: 600 }}>
                  📋 Current Filter Rules
                </Typography>
                
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: 12, justifyContent: 'center' }}>
                  {/* Friends Filter */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px 12px', 
                    backgroundColor: activeFilters.friends ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '20px',
                    border: activeFilters.friends ? '1px solid #2196f3' : '1px solid #e0e0e0'
                  }}>
                    <span style={{ marginRight: '6px' }}>👥</span>
                    <Typography variant="body2" style={{ 
                      color: activeFilters.friends ? '#1976d2' : '#666',
                      fontWeight: activeFilters.friends ? 600 : 400
                    }}>
                      {activeFilters.friends ? 'Friends Only' : 'All Posts'}
                    </Typography>
                  </div>

                  {/* Interactions Filter */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '8px 12px', 
                    backgroundColor: activeFilters.interactions ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '20px',
                    border: activeFilters.interactions ? '1px solid #2196f3' : '1px solid #e0e0e0'
                  }}>
                    <span style={{ marginRight: '6px' }}>🧲</span>
                    <Typography variant="body2" style={{ 
                      color: activeFilters.interactions ? '#1976d2' : '#666',
                      fontWeight: activeFilters.interactions ? 600 : 400
                    }}>
                      {activeFilters.interactions ? 'By Interactions' : 'By Date'}
                    </Typography>
                  </div>

                  {/* Sort Order */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    padding: '8px 12px', 
                    backgroundColor: sortOrder === 'asc' ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '20px',
                    border: sortOrder === 'asc' ? '1px solid #2196f3' : '1px solid #e0e0e0',
                    minWidth: '120px'
                  }}>
                    <span style={{ marginRight: '6px' }}>
                      {sortOrder === 'asc' ? '⏳' : '⌛'}
                    </span>
                    <Typography variant="body2" style={{ 
                      color: sortOrder === 'asc' ? '#1976d2' : '#666',
                      fontWeight: sortOrder === 'asc' ? 600 : 400,
                      textAlign: 'center'
                    }}>
                      {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </Typography>
                  </div>

                  {/* Date Range */}
                  {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      backgroundColor: '#e3f2fd',
                      borderRadius: '20px',
                      border: '1px solid #2196f3'
                    }}>
                      <span style={{ marginRight: '6px' }}>📅</span>
                      <Typography variant="body2" style={{ 
                        color: '#1976d2',
                        fontWeight: 600
                      }}>
                        {dateRangeFilter.startDate && dateRangeFilter.endDate 
                          ? `${format(dateRangeFilter.startDate, 'MMM d')} - ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`
                          : dateRangeFilter.startDate 
                          ? `From ${format(dateRangeFilter.startDate, 'MMM d, yyyy')}`
                          : `Until ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`
                        }
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Summary Text */}
                <Typography variant="body2" style={{ color: '#666', lineHeight: 1.5 }}>
                  {activeFilters.friends && 'Showing posts from people you follow. '}
                  {activeFilters.interactions && 'Posts are sorted by total interactions (comments + votes + quotes). '}
                  {sortOrder === 'asc' && 'Posts are sorted by creation date (oldest to newest). '}
                  {sortOrder === 'desc' && 'Posts are sorted by creation date (newest to oldest). '}
                  {dateRangeFilter.startDate && dateRangeFilter.endDate && 
                    `Showing posts from ${format(dateRangeFilter.startDate, 'MMM d, yyyy')} to ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}. `
                  }
                  {!activeFilters.friends && !activeFilters.interactions && sortOrder === 'desc' && !dateRangeFilter.startDate && !dateRangeFilter.endDate &&
                    'Showing all posts sorted by newest first (default).'
                  }
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Show featured posts only when no filters are active, no search, and user has never interacted with filters */}
          {isGuestMode && !searchKey.trim() && !hasActiveFilters() && !hasEverInteractedWithFilters && (
            <>
              {featuredData?.featuredPosts ? (
                featuredPosts.length > 0 ? (
                  <Grid item style={{ width: '100%', maxWidth: '800px' }}>
                    <Typography variant="h6" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                      Featured Posts
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
                      Check back later for featured content
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

          {/* Show database results when authenticated, searching, any filter is active, user has ever interacted with filters, */}
          {/* OR when the URL contains a page parameter. This ensures back-navigation with ?page works. */}
          {(() => {
            const { page } = extractUrlParams({ search: window.location.search })
            const hasPageParam = window.location.search.includes('page=')
            const shouldShowDbResults = !isGuestMode || searchKey.trim() || hasActiveFilters() || hasEverInteractedWithFilters || hasPageParam
            return shouldShowDbResults
          })() && (
            <>
              {/* Total Count Display */}
              {totalCount > 0 && (
                <Grid item style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>
                  <Typography variant="h6" style={{ color: '#666', fontWeight: 500 }}>
                    {totalCount.toLocaleString()} {totalCount === 1 ? 'result' : 'results'} found
                  </Typography>
                </Grid>
              )}
              
              <Grid item xs={12} className={classes.list}>
                {activeFilters.local && userLocation ? (
                  <>
                    {isLocationLoading && (
                      <Typography variant="body1" style={{ padding: '20px', textAlign: 'center' }}>
                        Getting your location...
                      </Typography>
                    )}
                    {localQuotesError && (
                      <Typography variant="body1" color="error" style={{ padding: '20px', textAlign: 'center' }}>
                        Error loading local quotes: {localQuotesError.message}
                      </Typography>
                    )}
                    {localQuotesLoading && !isLocationLoading && (
                      <LoadingSpinner />
                    )}
                    {localQuotesData && localQuotesData.localQuotes && (
                      <div style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                          {localQuotesData.localQuotes.length} quotes near you
                        </Typography>
                        {localQuotesData.localQuotes.length === 0 ? (
                          <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
                            No quotes found nearby. Try expanding your search radius or check back later.
                          </Typography>
                        ) : (
                          <div>
                            {localQuotesData.localQuotes.map((quote) => (
                              <Paper key={quote._id} style={{ padding: '16px', marginBottom: '12px' }}>
                                <Typography variant="body1" gutterBottom>
                                  "{quote.quote}"
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  by {quote.user?.username || 'Anonymous'}
                                </Typography>
                                {quote.placeLabel && (
                                  <div style={{ marginTop: '8px' }}>
                                    <LocationBadge 
                                      placeLabel={quote.placeLabel}
                                      distance={quote.distanceFromUser}
                                      variant="chip"
                                      size="small"
                                    />
                                  </div>
                                )}
                              </Paper>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <PaginatedPostsList
                    searchKey={searchKey}
                    startDateRange={dateRangeFilter.startDate ? format(dateRangeFilter.startDate, 'yyyy-MM-dd') : ''}
                    endDateRange={dateRangeFilter.endDate ? format(dateRangeFilter.endDate, 'yyyy-MM-dd') : ''}
                    friendsOnly={(user && user._id) ? activeFilters.friends : false}
                    interactions={activeFilters.interactions}
                    sortOrder={sortOrder === 'asc' ? sortOrder : undefined}
                    defaultPageSize={20}
                    pageParam="page"
                    pageSizeParam="page_size"
                    cols={1}
                    showPageInfo={true}
                    showFirstLast={true}
                    maxVisiblePages={5}
                    onTotalCountChange={setTotalCount}
                  />
                )}
              </Grid>
            </>
          )}

          {/* Show landing page content only when no filters are active and user has never interacted with filters */}
          {isGuestMode && !hasActiveFilters() && !hasEverInteractedWithFilters && <SearchGuestSections />}

          {/* Guest Footer Section - only show when no filters are active and user has never interacted with filters */}
          {isGuestMode && !hasActiveFilters() && !hasEverInteractedWithFilters && <GuestFooter />}
        </Grid>
      </div>

      <LocationPermissionDialog
        open={showPermissionDialog}
        onAllow={async () => {
          try {
            await dispatch(fetchLocation())
            setShowPermissionDialog(false)
            setActiveFilters((prev) => ({ ...prev, local: true }))
            setShowResults(true)
          } catch (error) {
            console.error('Error fetching location:', error)
            setShowPermissionDialog(false)
          }
        }}
        onDeny={() => {
          setShowPermissionDialog(false)
          setActiveFilters((prev) => ({ ...prev, local: false }))
        }}
        onClose={() => {
          setShowPermissionDialog(false)
        }}
      />
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
