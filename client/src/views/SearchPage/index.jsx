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
import { useSelector } from 'react-redux'
import {
  useState, useEffect, useMemo, useRef, useCallback,
} from 'react'
import SearchIcon from '@material-ui/icons/Search'
import DatePicker from 'react-datepicker'
import { useHistory } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import format from 'date-fns/format'
import { jwtDecode } from 'jwt-decode'
import Tooltip from '@material-ui/core/Tooltip'
import {
  GET_TOP_POSTS,
  GET_FEATURED_POSTS,
  GET_USER,
  SEARCH_USERNAMES,
} from '../../graphql/query'
import { serializePost } from '../../utils/objectIdSerializer'
import PaginatedPostsList from '../../components/Post/PaginatedPostsList'
import ErrorBoundary from '../../components/ErrorBoundary'
import Carousel from '../../components/Carousel/Carousel'
import PostCard from '../../components/Post/PostCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import SearchGuestSections from '../../components/SearchContainer/SearchGuestSections'
import UsernameResults from '../../components/SearchContainer/UsernameResults'
import GuestFooter from '../../components/GuestFooter'
import SEOHead from '../../components/common/SEOHead'
import AvatarDisplay from '../../components/Avatar'
import {
  generateCanonicalUrl,
  generatePaginationUrls,
  generatePageTitle,
  generatePageDescription,
  extractUrlParams,
} from '../../utils/seo'

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
    transition: 'border-color 0.2s ease',
  },
  searchBarUsernameMode: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
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
  quickSelectButton: {
    padding: '8px 16px',
    margin: '4px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    borderRadius: '20px',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    color: theme.palette.text.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(0, 0, 0, 0.24)',
      transform: 'scale(1.02)',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      padding: '6px 12px',
      margin: '2px',
    },
  },
  quickSelectActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      border: `1px solid ${theme.palette.primary.dark}`,
    },
  },
}))

export default function SearchPage() {
  const classes = useStyles()
  const history = useHistory()
  const [showResults, setShowResults] = useState(true)
  const [searchKey, setSearchKey] = useState('')
  const user = useSelector((state) => state.user.data)
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: null,
    endDate: null,
  })
  const [selectedQuickRange, setSelectedQuickRange] = useState(null)

  // New state for multiple filter modes - now each filter can be active independently
  const [activeFilters, setActiveFilters] = useState({
    friends: false,
    interactions: false,
  })
  const [isCalendarVisible, setIsCalendarVisible] = useState(false)

  // Guest mode state
  const [isGuestMode, setIsGuestMode] = useState(false)

  // Sort order state - 'desc' for newest first (default), 'asc' for oldest first, null for no sort
  const [sortOrder, setSortOrder] = useState('desc')

  // Track if user has ever interacted with filters - once true, never show featured posts again
  const [
    hasEverInteractedWithFilters,
    setHasEverInteractedWithFilters,
  ] = useState(false)

  // Track total count for results
  const [totalCount, setTotalCount] = useState(0)

  // Username search states
  const [isUsernameSearch, setIsUsernameSearch] = useState(false)
  const [usernameQuery, setUsernameQuery] = useState('')
  const [showUsernameResults, setShowUsernameResults] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  // Ref for the search container to handle click outside
  const searchContainerRef = useRef(null)

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

  const {
    data: featuredData,
    refetch: refetchFeatured,
    loading: featuredLoading,
  } = useQuery(GET_FEATURED_POSTS, {
    variables: {
      limit: 10,
      offset: 0,
      searchKey,
      startDateRange: dateRangeFilter.startDate ?
        format(dateRangeFilter.startDate, 'yyyy-MM-dd') :
        '',
      endDateRange: dateRangeFilter.endDate ?
        format(dateRangeFilter.endDate, 'yyyy-MM-dd') :
        '',
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

  // Username search query
  const {
    data: usernameData,
    loading: usernameLoading,
    error: usernameError,
  } = useQuery(SEARCH_USERNAMES, {
    variables: { query: usernameQuery },
    skip: !isUsernameSearch || !usernameQuery || usernameQuery.length === 0,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  // If user typed @username and pressed enter without selecting from dropdown,
  // resolve that username to a userId so posts can be filtered correctly.
  const usernameFromSearch =
    searchKey && searchKey.startsWith('@') ? searchKey.slice(1).trim() : ''
  const shouldResolveUserFromSearch =
    !!usernameFromSearch &&
    !selectedUserId &&
    !isUsernameSearch &&
    showResults

  const {
    data: resolvedUserData,
    loading: resolvingUser,
  } = useQuery(GET_USER, {
    variables: { username: usernameFromSearch },
    skip: !shouldResolveUserFromSearch,
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
  })

  useEffect(() => {
    if (resolvedUserData?.user) {
      setSelectedUserId(resolvedUserData.user._id)
      setSelectedUser(resolvedUserData.user)
    } else if (shouldResolveUserFromSearch && !resolvingUser) {
      // Clear any previously selected user if resolution failed
      setSelectedUserId(null)
      setSelectedUser(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedUserData, resolvingUser, shouldResolveUserFromSearch])

  // Auto-show results for guest mode and when filters are active
  useEffect(() => {
    if (isGuestMode && !showResults) {
      setShowResults(true)
    }
  }, [isGuestMode, showResults])

  // Show results when any filter is active
  useEffect(() => {
    const anyActive =
      activeFilters.friends ||
      activeFilters.interactions ||
      dateRangeFilter.startDate ||
      dateRangeFilter.endDate ||
      sortOrder === 'asc'

    if (anyActive) {
      setShowResults(true)
    }
  }, [activeFilters, sortOrder, dateRangeFilter])

  // Reset username search and selected user when search key changes or is cleared
  useEffect(() => {
    if (!searchKey || searchKey.trim() === '') {
      setIsUsernameSearch(false)
      setUsernameQuery('')
      setShowUsernameResults(false)
      setSelectedUserId(null)
      setSelectedUser(null)
    }
  }, [searchKey])

  // Handle click outside to hide username results
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowUsernameResults(false)
      }
    }

    if (showUsernameResults) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showUsernameResults])

  const handleSearch = (e) => {
    e.preventDefault()
    // Mark that user has interacted with filters (search is also a filter interaction)
    setHasEverInteractedWithFilters(true)

    setShowResults(true)
  }

  // New handler for search input changes to detect @ symbol
  const handleSearchInputChange = (e) => {
    const { value } = e.target
    setSearchKey(value)

    // Check if user is typing @ for username search
    if (value.startsWith('@')) {
      const query = value.substring(1) // Remove @ symbol
      setIsUsernameSearch(true)
      setUsernameQuery(query)
      setShowUsernameResults(query.length > 0) // Only show results if there's text after @
      // Clear selected user when in username search mode
      setSelectedUserId(null)
    } else {
      setIsUsernameSearch(false)
      setUsernameQuery('')
      setShowUsernameResults(false)
      // Clear selected user when not in username search mode
      setSelectedUserId(null)
    }
  }

  const handleFriendsFilter = () => {
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    if (!user || !user._id) {
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
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    setActiveFilters((prev) => ({
      ...prev,
      interactions: !prev.interactions,
    }))
    setShowResults(true)
  }

  const handleSortOrderToggle = () => {
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    setSortOrder((prev) => {
      const newSortOrder = prev === 'desc' ? 'asc' : 'desc'
      return newSortOrder
    })
    setShowResults(true)
  }

  const handleDateFilterToggle = () => {
    const willBeVisible = !isCalendarVisible
    setIsCalendarVisible(willBeVisible)
  }

  const handleDateChange = useCallback((dateRange) => {
    const [startDate, endDate] = dateRange
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    setDateRangeFilter({ startDate, endDate })
    // Clear quick range selection when manually selecting dates
    setSelectedQuickRange(null)
    if (startDate && endDate) {
      setIsCalendarVisible(false)
    }
    setShowResults(true)
  }, [])

  const handleQuickRangeSelect = useCallback((range) => {
    // Mark that user has interacted with filters
    setHasEverInteractedWithFilters(true)

    const now = new Date()
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    let startDate

    switch (range) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0)
        break
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0)
        break
      case 'month': {
        let targetMonth = now.getMonth() - 1
        let targetYear = now.getFullYear()
        if (targetMonth < 0) {
          targetMonth = 11
          targetYear -= 1
        }
        startDate = new Date(targetYear, targetMonth, now.getDate(), 0, 0, 0, 0)

        // If the target month doesn't have the current day (e.g., Feb 30), fallback to last day of target month
        if (startDate.getMonth() !== targetMonth) {
          startDate = new Date(targetYear, targetMonth + 1, 0, 0, 0, 0, 0)
        }
        break
      }
      default:
        return
    }

    setSelectedQuickRange(range)
    setDateRangeFilter({ startDate, endDate })
    setIsCalendarVisible(false)
    setShowResults(true)
  }, [])

  const clearDateFilter = useCallback(() => {
    setDateRangeFilter({ startDate: null, endDate: null })
    setSelectedQuickRange(null)
  }, [])

  const clearDateFilterAndClose = useCallback(() => {
    clearDateFilter()
    setIsCalendarVisible(false)
  }, [clearDateFilter])

  // Helper function to determine if we should show the landing page for guest users
  const shouldShowGuestLandingPage = () => {
    if (!isGuestMode) return false

    const { page } = extractUrlParams({ search: window.location.search })
    const hasPageParam = Boolean(page)

    // Show landing page only when no search, no filters, no interactions, and no page params
    return !searchKey.trim() && !hasActiveFilters() && !hasEverInteractedWithFilters && !hasPageParam
  }

  // Helper function to check if any filters are active
  const hasActiveFilters = () => (
    activeFilters.friends ||
      activeFilters.interactions ||
      dateRangeFilter.startDate ||
      dateRangeFilter.endDate ||
      sortOrder === 'asc' // Consider 'asc' (oldest first) as an active filter since 'desc' is default
  )

  const featuredPosts = useMemo(() => (featuredData?.featuredPosts?.entities || []).map((post) => serializePost(post),), [featuredData?.featuredPosts?.entities])

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
    startDateRange: dateRangeFilter.startDate ?
      format(dateRangeFilter.startDate, 'yyyy-MM-dd') :
      '',
    endDateRange: dateRangeFilter.endDate ?
      format(dateRangeFilter.endDate, 'yyyy-MM-dd') :
      '',
  })

  const pageTitle = generatePageTitle(
    'Search Posts - QuoteVote',
    urlParams.page,
    1, // We don't have total pages here, but it's not critical for title
    searchKey,
  )

  const pageDescription = generatePageDescription(
    'Search and discover posts, quotes, and conversations on QuoteVote. Find interesting discussions and join the conversation.',
    urlParams.page,
    1,
    searchKey,
    0, // We don't have total count here
    urlParams.pageSize,
  )

  // Summary text for selected date range (for lint: avoided nested ternaries)
  let dateRangeSummary = ''
  if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
    dateRangeSummary = `${format(dateRangeFilter.startDate, 'MMM d')} - ${format(
      dateRangeFilter.endDate,
      'MMM d, yyyy',
    )}`
  } else if (dateRangeFilter.startDate) {
    dateRangeSummary = `From ${format(dateRangeFilter.startDate, 'MMM d, yyyy')}`
  } else if (dateRangeFilter.endDate) {
    dateRangeSummary = `Until ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`
  }

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

          <Grid
            item
            style={{ width: '100%', maxWidth: 600, position: 'relative' }}
            ref={searchContainerRef}
          >
            <Paper
              component="form"
              className={`${classes.searchBar} ${
                isUsernameSearch ? classes.searchBarUsernameMode : ''
              }`}
              onSubmit={handleSearch}
            >
              <InputBase
                className={classes.input}
                placeholder={
                  isUsernameSearch ? 'Search usernames...' : 'Search...'
                }
                inputProps={{ 'aria-label': 'search' }}
                value={searchKey}
                onChange={handleSearchInputChange}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Paper>

            {/* Username search results dropdown */}
            {showUsernameResults && (
              <UsernameResults
                users={usernameData?.searchUser || []}
                loading={usernameLoading}
                error={usernameError}
                query={usernameQuery}
                onUserSelect={(user) => {
                  // Set search to show posts from selected user
                  setSearchKey(`@${user.username}`)
                  setSelectedUserId(user._id)
                  setSelectedUser(user)
                  setIsUsernameSearch(false)
                  setShowUsernameResults(false)
                  setShowResults(true)
                  setHasEverInteractedWithFilters(true)
                }}
              />
            )}
          </Grid>
          <Grid
            item
            className={classes.iconsContainer}
            style={{ width: '100%' }}
          >
            <Tooltip
              title={
                user && user._id ?
                  'Following: Show posts from people you follow only' :
                  'Following: Show all posts (login to filter by people you follow)'
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
                sortOrder === null ?
                  'Sort: Default order (click to sort by oldest first)' :
                  sortOrder === 'asc' ?
                    'Sort: Oldest first (click to sort by newest first)' :
                    'Sort: Newest first (click to clear sort)'
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
                  <span
                    style={{
                      fontSize: '1.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
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
                  isCalendarVisible ?
                    classes.activeFilter :
                    ''
                }`}
                onClick={handleDateFilterToggle}
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
              <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <Typography
                  variant="subtitle2"
                  style={{ marginBottom: 8, fontWeight: 600, color: '#555' }}
                >
                  Quick Select
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  <Button
                    className={`${classes.quickSelectButton} ${selectedQuickRange === 'day' ? classes.quickSelectActive : ''}`}
                    onClick={() => handleQuickRangeSelect('day')}
                    size="small"
                  >
                    Past Day
                  </Button>
                  <Button
                    className={`${classes.quickSelectButton} ${selectedQuickRange === 'week' ? classes.quickSelectActive : ''}`}
                    onClick={() => handleQuickRangeSelect('week')}
                    size="small"
                  >
                    Past Week
                  </Button>
                  <Button
                    className={`${classes.quickSelectButton} ${selectedQuickRange === 'month' ? classes.quickSelectActive : ''}`}
                    onClick={() => handleQuickRangeSelect('month')}
                    size="small"
                  >
                    Past Month
                  </Button>
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  backgroundColor: '#e0e0e0',
                  margin: '16px 0',
                }}
              />
              <Typography
                variant="subtitle2"
                style={{
                  marginBottom: 12,
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#555',
                }}
              >
                Or Select Custom Range
              </Typography>
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
                      onChange={(date) => handleDateChange([date, dateRangeFilter.endDate])}
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
                      onChange={(date) => handleDateChange([dateRangeFilter.startDate, date])}
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
              <Paper
                style={{
                  padding: 20,
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  style={{ marginBottom: 12, color: '#333', fontWeight: 600 }}
                >
                  📋 Current Filter Rules
                </Typography>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: 12,
                    justifyContent: 'center',
                  }}
                >
                  {/* Friends Filter */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: activeFilters.friends ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '20px',
                      border: activeFilters.friends ? '1px solid #2196f3' : '1px solid #e0e0e0',
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>👥</span>
                    <Typography
                      variant="body2"
                      style={{
                        color: activeFilters.friends ? '#1976d2' : '#666',
                        fontWeight: activeFilters.friends ? 600 : 400,
                      }}
                    >
                      {activeFilters.friends ? 'Friends Only' : 'All Posts'}
                    </Typography>
                  </div>

                  {/* Interactions Filter */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      backgroundColor: activeFilters.interactions ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '20px',
                      border: activeFilters.interactions ? '1px solid #2196f3' : '1px solid #e0e0e0',
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>🧲</span>
                    <Typography
                      variant="body2"
                      style={{
                        color: activeFilters.interactions ? '#1976d2' : '#666',
                        fontWeight: activeFilters.interactions ? 600 : 400,
                      }}
                    >
                      {activeFilters.interactions ? 'By Interactions' : 'By Date'}
                    </Typography>
                  </div>

                  {/* Sort Order */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 12px',
                      backgroundColor:
                        sortOrder === 'asc' ? '#e3f2fd' : '#f5f5f5',
                      borderRadius: '20px',
                      border: sortOrder === 'asc' ? '1px solid #2196f3' : '1px solid #e0e0e0',
                      minWidth: '120px',
                    }}
                  >
                    <span style={{ marginRight: '6px' }}>
                      {sortOrder === 'asc' ? '⏳' : '⌛'}
                    </span>
                    <Typography
                      variant="body2"
                      style={{
                        color: sortOrder === 'asc' ? '#1976d2' : '#666',
                        fontWeight: sortOrder === 'asc' ? 600 : 400,
                        textAlign: 'center',
                      }}
                    >
                      {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </Typography>
                  </div>

                  {/* Date Range */}
                  {(dateRangeFilter.startDate || dateRangeFilter.endDate) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '20px',
                        border: '1px solid #2196f3',
                      }}
                    >
                      <span style={{ marginRight: '6px' }}>📅</span>
                      <Typography
                        variant="body2"
                        style={{
                          color: '#1976d2',
                          fontWeight: 600,
                        }}
                      >
                        {dateRangeSummary}
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Summary Text */}
                <Typography
                  variant="body2"
                  style={{ color: '#666', lineHeight: 1.5 }}
                >
                  {activeFilters.friends &&
                    'Showing posts from people you follow. '}
                  {activeFilters.interactions &&
                    'Posts are sorted by total interactions (comments + votes + quotes). '}
                  {sortOrder === 'asc' &&
                    'Posts are sorted by creation date (oldest to newest). '}
                  {sortOrder === 'desc' &&
                    'Posts are sorted by creation date (newest to oldest). '}
                  {dateRangeFilter.startDate &&
                    dateRangeFilter.endDate &&
                    `Showing posts from ${format(
                      dateRangeFilter.startDate,
                      'MMM d, yyyy',
                    )} to ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}. `}
                  {!activeFilters.friends &&
                    !activeFilters.interactions &&
                    sortOrder === 'desc' &&
                    !dateRangeFilter.startDate &&
                    !dateRangeFilter.endDate &&
                    'Showing all posts sorted by newest first (default).'}
                </Typography>
              </Paper>
            </Grid>
          )}

          {/* Show featured posts only when no filters are active, no search, and user has never interacted with filters */}
          {isGuestMode &&
            !searchKey.trim() &&
            !hasActiveFilters() &&
            !hasEverInteractedWithFilters && (
            <>
              {featuredData?.featuredPosts ? (
                featuredPosts.length > 0 ? (
                  <Grid item style={{ width: '100%', maxWidth: '800px' }}>
                    <Typography
                      variant="h6"
                      style={{ marginBottom: '1rem', textAlign: 'center' }}
                    >
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
            const { page } = extractUrlParams({
              search: window.location.search,
            })
            const hasPageParam = window.location.search.includes('page=')
            const shouldShowDbResults =
              !isGuestMode ||
              searchKey.trim() ||
              hasActiveFilters() ||
              hasEverInteractedWithFilters ||
              hasPageParam
            return shouldShowDbResults
          })() && (
            <>
              {/* Selected/Searched User Header */}
              {(selectedUser || resolvedUserData?.user) &&
                (() => {
                  const displayUser = selectedUser || resolvedUserData.user
                  return (
                    <Grid
                      item
                      style={{ width: '100%', maxWidth: 600, marginTop: 8 }}
                    >
                      <Paper
                        onClick={() =>
                          history.push(`/Profile/${displayUser.username}/`)
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: 12,
                          cursor: 'pointer',
                          border: '1px solid #e0e0e0',
                          borderRadius: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AvatarDisplay
                            height={48}
                            width={48}
                            {...(displayUser.avatar || {})}
                          />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <Typography
                            variant="subtitle1"
                            style={{ lineHeight: 1.1, fontWeight: 600 }}
                          >
                            {displayUser.name || displayUser.username}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ color: '#666', marginTop: 2 }}
                          >
                            @{displayUser.username}
                          </Typography>
                        </div>
                      </Paper>
                    </Grid>
                  )
                })()}

              {/* Total Count Display */}
              {totalCount > 0 && (
                <Grid
                  item
                  style={{ width: '100%', textAlign: 'center', marginTop: 16 }}
                >
                  <Typography
                    variant="h6"
                    style={{ color: '#666', fontWeight: 500 }}
                  >
                    {totalCount.toLocaleString()}
                    {' '}
                    {totalCount === 1 ? 'result' : 'results'}
                    {' '}
                    found
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12} className={classes.list}>
                <PaginatedPostsList
                  searchKey={selectedUserId ? '' : searchKey}
                  startDateRange={
                    dateRangeFilter.startDate ?
                      format(dateRangeFilter.startDate, 'yyyy-MM-dd') :
                      ''
                  }
                  endDateRange={
                    dateRangeFilter.endDate ?
                      format(dateRangeFilter.endDate, 'yyyy-MM-dd') :
                      ''
                  }
                  friendsOnly={user && user._id ? activeFilters.friends : false}
                  interactions={activeFilters.interactions}
                  userId={selectedUserId}
                  sortOrder={sortOrder === 'asc' ? sortOrder : undefined}
                  defaultPageSize={20}
                  pageParam="page"
                  pageSizeParam="page_size"
                  cols={1}
                  showPageInfo
                  showFirstLast
                  maxVisiblePages={5}
                  onTotalCountChange={setTotalCount}
                />
              </Grid>
            </>
          )}

          {/* Show landing page content only when no filters are active and user has never interacted with filters */}
          {isGuestMode &&
            !hasActiveFilters() &&
            !hasEverInteractedWithFilters && <SearchGuestSections />}

          {/* Guest Footer Section - only show when no filters are active and user has never interacted with filters */}
          {isGuestMode &&
            !hasActiveFilters() &&
            !hasEverInteractedWithFilters && <GuestFooter />}
        </Grid>
      </div>
    </ErrorBoundary>
  )
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
