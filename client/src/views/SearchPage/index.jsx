import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, InputBase, Paper, IconButton, Button } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import format from 'date-fns/format';
import { jwtDecode } from 'jwt-decode';
import { GET_TOP_POSTS, GET_FEATURED_POSTS } from '../../graphql/query';
import { serializePost } from '../../utils/objectIdSerializer';
import PostsList from '../../components/Post/PostsList';
import ErrorBoundary from '../../components/ErrorBoundary';
import Carousel from '../../components/Carousel/Carousel';
import PostCard from '../../components/Post/PostCard';
import Divider from '@material-ui/core/Divider';
import LatestQuotes from '../../components/Quotes/LatestQuotes';
import { SET_GLOBAL_LOADING } from '../../store/ui';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '2rem',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#f0f2f5',
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
}));

export default function SearchPage() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [showResults, setShowResults] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const hiddenPosts = useSelector((state) => state.ui.hiddenPosts) || []
  const user = useSelector((state) => state.user.data)
  const limit = 12 + hiddenPosts.length
  const [offset, setOffset] = useState(0)
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: null,
    endDate: null,
  })
  
  // New state for filter modes
  const [filterMode, setFilterMode] = useState('all') // 'all', 'friends', 'interactions'
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Add a query key that changes when filters change to force refetch
  const [queryKey, setQueryKey] = useState(0)
  
  // Carousel state for guest mode
  const [activeStep, setActiveStep] = useState(0)
  
  // Guest mode state
  const [isGuestMode, setIsGuestMode] = useState(false)

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
    startDateRange: dateRangeFilter.startDate ? format(dateRangeFilter.startDate, 'yyyy-MM-dd') : '',
    endDateRange: dateRangeFilter.endDate ? format(dateRangeFilter.endDate, 'yyyy-MM-dd') : '',
    friendsOnly: filterMode === 'friends',
    // Add a dummy variable that changes when filters change to force refetch
    filterKey: `${filterMode}-${dateRangeFilter.startDate ? format(dateRangeFilter.startDate, 'yyyy-MM-dd') : ''}-${dateRangeFilter.endDate ? format(dateRangeFilter.endDate, 'yyyy-MM-dd') : ''}`,
  }

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_TOP_POSTS, {
    variables,
    fetchPolicy: 'network-only',
    skip: !showResults && !isGuestMode, // Show results automatically for guest mode
    errorPolicy: 'all', // Allow partial errors
    notifyOnNetworkStatusChange: true,
    pollInterval: 3000, // Poll every 3 seconds
  })

  const { data: featuredData } = useQuery(GET_FEATURED_POSTS)

  // Dispatch global loading state
  useEffect(() => {
    dispatch(SET_GLOBAL_LOADING(loading))
  }, [loading, dispatch])

  // Auto-show results for guest mode
  useEffect(() => {
    if (isGuestMode && !showResults) {
      setShowResults(true)
    }
  }, [isGuestMode, showResults])

  // Function to trigger query refetch when filters change
  const triggerQueryRefetch = () => {
    console.log('Triggering query refetch with variables:', variables)
    setQueryKey(prev => prev + 1)
    if (showResults) {
      refetch(variables)
    }
  }

  // Refetch when filter mode changes
  useEffect(() => {
    if (showResults) {
      console.log('Filter mode changed, refetching query')
      refetch(variables)
    }
  }, [filterMode, showResults])

  // Refetch when date range changes
  useEffect(() => {
    if (showResults && (dateRangeFilter.startDate || dateRangeFilter.endDate)) {
      console.log('Date range changed, refetching query')
      refetch(variables)
    }
  }, [dateRangeFilter.startDate, dateRangeFilter.endDate, showResults])

  const handleSearch = (e) => {
    e.preventDefault()
    setShowResults(true)
  }

  const handleFriendsFilter = () => {
    console.log('Friends filter clicked, current mode:', filterMode)
    
    if (!user || !user._id) {
      console.log('User not logged in, cannot use friends filter')
      alert('Please log in to use the friends filter')
      return
    }
    
    setFilterMode(filterMode === 'friends' ? 'all' : 'friends')
    setOffset(0)
    triggerQueryRefetch()
    setShowResults(true)
  }

  const handleInteractionsFilter = () => {
    console.log('Interactions filter clicked, current mode:', filterMode)
    setFilterMode(filterMode === 'interactions' ? 'all' : 'interactions')
    setOffset(0)
    triggerQueryRefetch()
    setShowResults(true)
  }

  const handleDateFilterToggle = (event) => {
    const willBeVisible = !isCalendarVisible;
    setIsCalendarVisible(willBeVisible);
    setFocusedInput(willBeVisible ? 'startDate' : null);
  };

  const handleDateChange = (dateRange) => {
    const [startDate, endDate] = dateRange;
    setDateRangeFilter({ startDate, endDate });
    setOffset(0);
    setTimeout(() => {
      triggerQueryRefetch();
    }, 100);
    if (startDate && endDate) {
      setIsCalendarVisible(false);
      setFocusedInput(null);
    }
    setShowResults(true);
  };

  const clearDateFilter = () => {
    setDateRangeFilter({ startDate: null, endDate: null });
    setOffset(0);
    setTimeout(() => {
      triggerQueryRefetch();
    }, 100);
  };

  const clearDateFilterAndClose = () => {
    clearDateFilter();
    setIsCalendarVisible(false);
    setFocusedInput(null);
  };

  // Sort posts by interactions if interactions filter is active
  const processAndSortData = (rawData) => {
    if (!rawData) return null

    console.log('Processing data with filter mode:', filterMode)
    console.log('Raw data:', rawData)

    let processedData = {
      ...rawData,
      posts: {
        ...rawData.posts,
        entities: rawData.posts.entities.map((post) => serializePost(post)),
      },
    }

    // Sort by interactions if interactions filter is active
    if (filterMode === 'interactions') {
      console.log('Sorting by interactions')
      console.log('Posts before sorting:', processedData.posts.entities.map(p => ({
        id: p._id,
        title: p.title,
        comments: p.comments?.length || 0,
        votes: p.votes?.length || 0,
        quotes: p.quotes?.length || 0,
        total: (p.comments?.length || 0) + (p.votes?.length || 0) + (p.quotes?.length || 0)
      })))
      
      processedData.posts.entities.sort((a, b) => {
        const aInteractions = (a.comments?.length || 0) + (a.votes?.length || 0) + (a.quotes?.length || 0)
        const bInteractions = (b.comments?.length || 0) + (b.votes?.length || 0) + (b.quotes?.length || 0)
        console.log(`Post ${a._id}: ${aInteractions} interactions, Post ${b._id}: ${bInteractions} interactions`)
        return bInteractions - aInteractions
      })
      
      console.log('Posts after sorting:', processedData.posts.entities.map(p => ({
        id: p._id,
        title: p.title,
        total: (p.comments?.length || 0) + (p.votes?.length || 0) + (p.quotes?.length || 0)
      })))
    }

    return processedData
  }

  // Handle GraphQL errors gracefully
  const hasError = error && error.graphQLErrors && error.graphQLErrors.length > 0
  const errorMessage = hasError ? error.graphQLErrors[0].message : null

  if (hasError && errorMessage?.includes('friendsOnly')) {
    // If backend doesn't support friendsOnly, fall back to client-side filtering
    console.warn('Backend does not support friendsOnly parameter, using client-side filtering')
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Error loading posts</h3>
        <p>{error.message}</p>
        <pre style={{ textAlign: 'left', overflow: 'auto' }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }

  const processedData = processAndSortData(data)

  const featuredPosts = (featuredData?.featuredPosts || [])
    .map((post) => serializePost(post))

  // Create carousel items from posts for guest mode
  const createCarouselItems = (posts) => {
    if (!posts || !posts.length) return []
    
    return posts.map((post) => (
      <div key={post._id} style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
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
  }

  // Guest mode carousel
  if (isGuestMode && processedData && processedData.posts && processedData.posts.entities.length > 0) {
    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <Grid
            container
            direction="column"
            alignItems="center"
            className={classes.container}
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
              <Typography className={classes.tagline} style={{ marginBottom: '1rem' }}>
                No algorithms. No ads. Just conversations.
              </Typography>
            </Grid>

            {/* Action Buttons Row */}
            <Grid item style={{ marginTop: 32, marginBottom: 16, width: '100%' }}>
              <Grid container justifyContent="center" spacing={4}>
                <Grid item>
                  <Button variant="outlined" href="/auth/request-access" target="_blank">Request Invite</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" href="https://donate.stripe.com/28E5kF6Egdaz9ZF6nhdfG00" target="_blank">Donate</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" href="mailto:volunteer@quote.vote">Volunteer</Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" href="https://github.com/QuoteVote/quotevote-monorepo" target="_blank">GitHub</Button>
                </Grid>
              </Grid>
            </Grid>
            {/** Divider   */}  
            <Grid item style={{ width: '100%', marginTop: 16, marginBottom: 16 }}>
              <Divider />
            </Grid>

            {/* Search Bar - Always visible */}
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

            {isGuestMode && featuredPosts.length > 0 && (
              <Grid item style={{ width: '100%', maxWidth: '800px' }}>
                <Carousel navButtonsAlwaysVisible autoplay={false}>
                  {createCarouselItems(featuredPosts)}
                </Carousel>
              </Grid>
            )}

            {/* Filter Buttons - Always visible */}
            <Grid item className={classes.iconsContainer}>
              <IconButton 
                aria-label="friends" 
                className={`${classes.icon} ${filterMode === 'friends' ? classes.activeFilter : ''}`}
                onClick={handleFriendsFilter}
                title={user && user._id ? "Show posts from friends only" : "Please log in to use friends filter"}
                disabled={!user || !user._id}
                style={{ opacity: (!user || !user._id) ? 0.5 : 1 }}
              >
                👥
              </IconButton>
              <IconButton 
                aria-label="filter" 
                className={`${classes.icon} ${filterMode === 'interactions' ? classes.activeFilter : ''}`}
                onClick={handleInteractionsFilter}
                title="Sort by most interactions"
              >
                🧲
              </IconButton>
              <IconButton 
                aria-label="calendar" 
                className={`${classes.icon} ${(dateRangeFilter.startDate || dateRangeFilter.endDate || isCalendarVisible) ? classes.activeFilter : ''}`}
                onClick={e => handleDateFilterToggle(e)}
                title="Filter by date range"
              >
                📅
              </IconButton>
            </Grid>
            
            {/* Date Picker - Always visible when calendar is open */}
            {isCalendarVisible && (
              <Grid item xs={12} style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', background: '#fff', border: '1px solid #eee', maxWidth: 600 }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle2" style={{ marginBottom: 8, textAlign: 'center' }}>
                      Start Date
                    </Typography>
                    <div className={classes.datePickerInput}>
                      <DatePicker
                        selected={dateRangeFilter.startDate}
                        onChange={date => handleDateChange([date, dateRangeFilter.endDate])}
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
                    <Typography variant="subtitle2" style={{ marginBottom: 8, textAlign: 'center' }}>
                      End Date
                    </Typography>
                    <div className={classes.datePickerInput}>
                      <DatePicker
                        selected={dateRangeFilter.endDate}
                        onChange={date => handleDateChange([dateRangeFilter.startDate, date])}
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
            {(filterMode !== 'all' || dateRangeFilter.startDate || dateRangeFilter.endDate) && (
              <Grid item style={{ width: '100%', marginTop: 16 }}>
                <Paper style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="body2" color="textSecondary">
                    Active Filters:
                    {filterMode === 'friends' && ' 👥 Friends only'}
                    {filterMode === 'interactions' && ' 🧲 Sorted by interactions'}
                    {dateRangeFilter.startDate && ` 📅 From ${format(dateRangeFilter.startDate, 'MMM d, yyyy')}`}
                    {dateRangeFilter.endDate && ` to ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`}
                  </Typography>
                  {filterMode === 'friends' && (
                    <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
                      Showing posts from people you follow
                    </Typography>
                  )}
                  {filterMode === 'interactions' && (
                    <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
                      Posts sorted by total interactions (comments + votes + quotes)
                    </Typography>
                  )}
                </Paper>
              </Grid>
            )}

            {!isGuestMode && (
              <Grid item style={{ width: '100%', maxWidth: 600 }}>
                <LatestQuotes limit={5} />
              </Grid>
            )}
            
            <Grid item style={{ width: '100%', maxWidth: '800px' }}>
              {processedData && (
                <Carousel
                  navButtonsAlwaysVisible
                  autoplay={false}
                  activeStepProp={activeStep}
                  setActiveStepProp={setActiveStep}
                >
                  {createCarouselItems(processedData.posts.entities)}
                </Carousel>
              )}
            </Grid>

            {/* New Section: Discover without bias (matching provided image) */}
            <Grid item style={{ width: '100%', maxWidth: 1200, margin: '2rem auto 0 auto', padding: '0 5vw' }}>
                <Typography variant="h4" style={{ fontWeight: 700, marginBottom: 8 }}>
                    <span style={{ color: '#2ecc71' }}>Discover</span> <span style={{ color: '#111' }}>without bias</span>
                </Typography>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 32,
                    flexDirection: 'column',
                    width: '100%',
                    boxSizing: 'border-box',
                    marginTop: '2rem',
                  }}
                >
                  {/* Left: Image */}
                  <div style={{ flex: '1 1 320px', minWidth: 220, maxWidth: 480, width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <img
                      src={process.env.PUBLIC_URL + '/assets/three-short-posts.png'}
                      alt="Example posts"
                      style={{
                        width: '100%',
                        maxWidth: 600,
                        height: 'auto',
                      }}
                    />
                  </div>
                  {/* Right: Text and Button */}
                  <div style={{ flex: '2 1 340px', minWidth: 220, maxWidth: 600, width: '100%', textAlign: 'left', marginLeft: 0 }}>
                    <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: 16, color: '#222' }}>
                      All conversations are searchable without ads,<br />
                      and discovered through exploration, not algorithms.
                    </Typography>
                    <ul style={{ color: '#333', fontSize: 16, margin: '0 0 24px 18px', padding: 0, lineHeight: 1.7 }}>
                      <li>Filter by keyword, only show following, sort by most interactions, or select a date range.</li>
                      <li>Find what people are talking about now, or during a historical event in the past.</li>
                    </ul>
                    <Button
                      variant="contained"
                      style={{
                        background: '#2ecc71',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        borderRadius: 8,
                        padding: '10px 32px',
                        textTransform: 'none',
                        boxShadow: '0 2px 8px rgba(46,204,113,0.08)'
                      }}
                      href="/auth/request-access"
                    >
                      Request Invite
                    </Button>
                  </div>
                </div>
            </Grid>

            <Grid item style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Sign up to join the conversation and create your own posts!
              </Typography>
            </Grid>
          </Grid>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          alignItems="center"
          className={classes.container}
        >
          {!showResults && (
            <Grid item>
              <div className={classes.logoContainer}>
                <img
                  src="/assets/search-quote-vote.png"
                  alt="logo"
                  className={classes.logoImage}
                />
              </div>
            </Grid>
          )}
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

          {isGuestMode && featuredPosts.length > 0 && (
            <Grid item style={{ width: '100%', maxWidth: '800px' }}>
              <Carousel navButtonsAlwaysVisible autoplay={false}>
                {createCarouselItems(featuredPosts)}
              </Carousel>
            </Grid>
          )}
          {!showResults && (
            <Grid item>
              <Typography className={classes.tagline}>
                No algorithms. No ads. Just conversations.
              </Typography>
            </Grid>
          )}
          <Grid item className={classes.iconsContainer}>
            <IconButton 
              aria-label="friends" 
              className={`${classes.icon} ${filterMode === 'friends' ? classes.activeFilter : ''}`}
              onClick={handleFriendsFilter}
              title={user && user._id ? "Show posts from friends only" : "Please log in to use friends filter"}
              disabled={!user || !user._id}
              style={{ opacity: (!user || !user._id) ? 0.5 : 1 }}
            >
              👥
            </IconButton>
            <IconButton 
              aria-label="filter" 
              className={`${classes.icon} ${filterMode === 'interactions' ? classes.activeFilter : ''}`}
              onClick={handleInteractionsFilter}
              title="Sort by most interactions"
            >
              🧲
            </IconButton>
            <IconButton 
              aria-label="calendar" 
              className={`${classes.icon} ${(dateRangeFilter.startDate || dateRangeFilter.endDate || isCalendarVisible) ? classes.activeFilter : ''}`}
              onClick={e => handleDateFilterToggle(e)}
              title="Filter by date range"
            >
              📅
            </IconButton>
          </Grid>
          
          {isCalendarVisible && (
            <Grid item xs={12} style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.10)', background: '#fff', border: '1px solid #eee', maxWidth: 600 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <Typography variant="subtitle2" style={{ marginBottom: 8, textAlign: 'center' }}>
                    Start Date
                  </Typography>
                  <div className={classes.datePickerInput}>
                    <DatePicker
                      selected={dateRangeFilter.startDate}
                      onChange={date => handleDateChange([date, dateRangeFilter.endDate])}
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
                  <Typography variant="subtitle2" style={{ marginBottom: 8, textAlign: 'center' }}>
                    End Date
                  </Typography>
                  <div className={classes.datePickerInput}>
                    <DatePicker
                      selected={dateRangeFilter.endDate}
                      onChange={date => handleDateChange([dateRangeFilter.startDate, date])}
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
          {showResults && (filterMode !== 'all' || dateRangeFilter.startDate || dateRangeFilter.endDate) && (
            <Grid item style={{ width: '100%', marginTop: 16 }}>
              <Paper style={{ padding: 16, backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2" color="textSecondary">
                  Active Filters:
                  {filterMode === 'friends' && ' 👥 Friends only'}
                  {filterMode === 'interactions' && ' 🧲 Sorted by interactions'}
                  {dateRangeFilter.startDate && ` 📅 From ${format(dateRangeFilter.startDate, 'MMM d, yyyy')}`}
                  {dateRangeFilter.endDate && ` to ${format(dateRangeFilter.endDate, 'MMM d, yyyy')}`}
                </Typography>
                {filterMode === 'friends' && (
                  <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
                    Showing posts from people you follow
                  </Typography>
                )}
                {filterMode === 'interactions' && (
                  <Typography variant="caption" color="textSecondary" style={{ display: 'block', marginTop: 8 }}>
                    Posts sorted by total interactions (comments + votes + quotes)
                  </Typography>
                )}
              </Paper>
            </Grid>
          )}

          {showResults && (
            <Grid item xs={12} className={classes.list}>
              {loading && !processedData && <div>Loading...</div>}
              {loading && processedData && null}
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
            </Grid>
          )}
        </Grid>
      </div>
    </ErrorBoundary>
  )
}

/* Add this to the bottom of the file (outside the component) for responsive flex direction */
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (min-width: 900px) {
      .discover-section-flex {
        flex-direction: row !important;
      }
    }
  `;
  document.head.appendChild(style);
}

