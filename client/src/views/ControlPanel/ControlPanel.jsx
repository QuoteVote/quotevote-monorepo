import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TablePagination from '@material-ui/core/TablePagination'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Skeleton from '@material-ui/lab/Skeleton'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Switch from '@material-ui/core/Switch'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useResponsive } from '../../hooks/useResponsive'

import { useMutation, useQuery } from '@apollo/react-hooks'
import { USER_INVITE_REQUESTS, GET_TOP_POSTS, GET_USERS } from '@/graphql/query'
import {
  UPDATE_USER_INVITE_STATUS,
  UPDATE_FEATURED_SLOT,
  UPDATE_USER,
} from '@/graphql/mutations'

// react plugin for creating charts
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist'
import { dailySalesChart } from '@/variables/charts'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from 'mui-pro/Snackbar/Snackbar'
import controlPanelStyles from './controlPanelStyles'
import { SET_SNACKBAR } from '@/store/ui'
import Unauthorized from '@/components/Unauthorized/Unauthorized'
import useGuestGuard from '../../utils/useGuestGuard'

const useStyles = makeStyles(controlPanelStyles)

// TabPanel component for organizing content
const TabPanel = ({ children, value, index, ...other }) => {
  const classes = useStyles()
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

const ActionButtons = ({ status, id, onActionComplete }) => {
  const classes = useStyles()
  const ensureAuth = useGuestGuard()
  const dispatch = useDispatch()
  const [sendUserInviteApproval, { loading }] = useMutation(
    UPDATE_USER_INVITE_STATUS,
  )
  const submitData = async (selectedStatus, successMessage) => {
    if (!ensureAuth()) return
    try {
      await sendUserInviteApproval({
        variables: {
          userId: id,
          inviteStatus: `${selectedStatus}`,
        },
      })
      if (onActionComplete) {
        await onActionComplete()
      }
      dispatch(
        SET_SNACKBAR({
          open: true,
          type: 'success',
          message: successMessage,
        }),
      )
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating invite status:', error)
      }
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message?.replace('GraphQL error: ', '') ||
        'Failed to update invite status'
      dispatch(
        SET_SNACKBAR({
          open: true,
          type: 'danger',
          message: errorMessage,
        }),
      )
    }
  }

  const handleDecline = async () => {
    await submitData(2, 'Invitation declined')
  }

  const handleAccept = async () => {
    await submitData(4, 'Invitation approved')
  }

  const handleReset = async () => {
    await submitData(1, 'Invitation reset to pending')
  }

  switch (Number(status)) {
    case 1: // pending
      return (
        <div className={classes.actionButtonGroup}>
          <Button
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: '#f44336',
            }}
            onClick={handleDecline}
            disabled={loading}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: '#52b274',
            }}
            onClick={handleAccept}
            disabled={loading}
          >
            Accept
          </Button>
        </div>
      )
    case 2: // declined
      return (
        <div className={classes.singleActionButton}>
          <Button
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: '#f44336',
            }}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      )
    case 4: // active
      return (
        <div className={classes.singleActionButton}>
          <Button
            variant="contained"
            className={classes.button}
            style={{
              backgroundColor: '#52b274',
            }}
            onClick={handleAccept}
            disabled={loading}
          >
            Resend
          </Button>
        </div>
      )
    default:
      return null
  }
}

const FeaturedPostsTable = () => {
  const classes = useStyles()
  const { theme, isSmallScreen } = useResponsive()
  const ensureAuth = useGuestGuard()
  const queryVars = {
    limit: 50,
    offset: 0,
    searchKey: '',
    startDateRange: null,
    endDateRange: null,
    friendsOnly: false,
    interactions: false,
  }
  const { data, refetch } = useQuery(GET_TOP_POSTS, {
    variables: queryVars,
  })
  const [updateSlot, { loading }] = useMutation(UPDATE_FEATURED_SLOT)
  const [selection, setSelection] = React.useState({})
  const [filter, setFilter] = React.useState('')

  if (!data) {
    return <Skeleton animation="wave" height={200} />
  }

  const posts = data.posts.entities
  const usedSlots = {}
  posts.forEach((p) => {
    if (p.featuredSlot) usedSlots[p.featuredSlot] = p._id
  })

  const filteredPosts = posts.filter((p) => {
    const q = filter.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      (p.text || '').toLowerCase().includes(q) ||
      p._id.includes(q)
    )
  })

  const handleSelect = (id) => (e) => {
    setSelection({ ...selection, [id]: e.target.value })
  }

  const handleSave = async (id) => {
    if (!ensureAuth()) return
    const slot = selection[id]
    await updateSlot({
      variables: { postId: id, featuredSlot: slot ? Number(slot) : null },
    })
    refetch()
  }

  return (
    <Card>
      <CardContent>
        <Typography className={classes.cardHeader}>Featured Posts</Typography>
        <TextField
          placeholder="Filter posts"
          variant="outlined"
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={classes.filterInput}
          fullWidth
        />
        {isSmallScreen ? (
          filteredPosts.length > 0 ? (
            <div className={classes.responsiveList}>
              {filteredPosts.map((post) => {
                const isAssigned = Boolean(post.featuredSlot)
                const label = isAssigned ? 'Update' : 'Assign'
                return (
                  <Box
                    key={post._id}
                    className={cx(classes.responsiveCard, {
                      [classes.featuredRow]: post.featuredSlot,
                    })}
                  >
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Post ID
                      </Typography>
                      <Typography className={classes.responsiveCardValue}>
                        {post._id}
                      </Typography>
                    </div>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Title
                      </Typography>
                      <Typography className={classes.responsiveCardValue}>
                        {post.title}
                      </Typography>
                    </div>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Summary
                      </Typography>
                      <Typography className={classes.responsiveCardValue}>
                        {(post.text || '').slice(0, 140) || '—'}
                      </Typography>
                    </div>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Featured Slot
                      </Typography>
                      <FormControl className={cx(classes.slotSelect, classes.responsiveSelect)}>
                        <Select
                          value={selection[post._id] ?? post.featuredSlot ?? ''}
                          onChange={handleSelect(post._id)}
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                            <MenuItem
                              key={n}
                              value={n}
                              disabled={usedSlots[n] && usedSlots[n] !== post._id}
                            >
                              {n}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.responsiveCardActions}>
                      <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        style={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        }}
                        onClick={() => handleSave(post._id)}
                        disabled={loading}
                      >
                        {label}
                      </Button>
                    </div>
                  </Box>
                )
              })}
            </div>
          ) : (
            <Box className={classes.emptyState}>
              <Typography variant="body1" style={{ marginBottom: 8 }}>
                No posts match the current filter
              </Typography>
              <Typography variant="body2">
                Try a different search term to find posts
              </Typography>
            </Box>
          )
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader aria-label="featured posts table">
              <TableHead classes={{ head: classes.columnHeader }}>
                <TableRow>
                  <TableCell align="center" className={classes.columnHeader}>
                    Post ID
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Title
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Summary
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Featured Slot
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPosts.map((post) => {
                  const isAssigned = Boolean(post.featuredSlot)
                  const label = isAssigned ? 'Update' : 'Assign'
                  return (
                    <TableRow
                      key={post._id}
                      className={post.featuredSlot ? classes.featuredRow : ''}
                    >
                      <TableCell align="center">{post._id}</TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{(post.text || '').slice(0, 100)}</TableCell>
                      <TableCell align="center">
                        <FormControl className={classes.slotSelect}>
                          <Select
                            value={selection[post._id] ?? post.featuredSlot ?? ''}
                            onChange={handleSelect(post._id)}
                            displayEmpty
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                              <MenuItem
                                key={n}
                                value={n}
                                disabled={usedSlots[n] && usedSlots[n] !== post._id}
                              >
                                {n}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                          }}
                          onClick={() => handleSave(post._id)}
                          disabled={loading}
                        >
                          {label}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filteredPosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ padding: '40px 20px' }}>
                      <Typography variant="body1" style={{ color: '#666', marginBottom: 8 }}>
                        No posts match the current filter
                      </Typography>
                      <Typography variant="body2" style={{ color: '#999' }}>
                        Try a different search term to find posts
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

// User Invitation Requests Tab Component
const UserInvitationRequestsTab = ({ data, onRefresh }) => {
  const classes = useStyles()
  const { theme, isSmallScreen } = useResponsive()
  const [sortConfig, setSortConfig] = React.useState({
    key: 'joined',
    direction: 'desc'
  })
  const [emailFilter, setEmailFilter] = React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage] = React.useState(10) // rows per page
  
  const header = [
    { key: 'email', label: 'Email' },
    { key: 'joined', label: 'Joined Date' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: 'Action' }
  ]
  
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }))
  }
  
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let aValue, bValue
      
      switch (sortConfig.key) {
        case 'email':
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case 'joined':
          aValue = new Date(a.joined)
          bValue = new Date(b.joined)
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        default:
          return 0
      }
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }
  
  const filterAndSortData = (data) => {
    const filteredData = emailFilter 
      ? data.filter(row => 
          row.email.toLowerCase().includes(emailFilter.toLowerCase())
        )
      : data
    
    return sortData(filteredData)
  }
  
  const getStatusValue = (status) => {
    switch (Number(status)) {
      case 1:
        return 'Pending'
      case 2:
        return 'Declined'
      case 4:
        return 'Accepted'
      default:
        return ''
    }
  }

  const renderStatusChip = (status) => (
    <Button
      variant="contained"
      disableRipple
      disableElevation
      className={cx(classes.statusButton, {
        [classes.pendingStatus]: status === '1',
        [classes.declinedStatus]: status === '2',
        [classes.acceptedStatus]: status === '4',
      })}
    >
      {getStatusValue(status)}
    </Button>
  )

  const renderEmptyState = () => (
    <Box className={classes.emptyState}>
      <Typography variant="body1" style={{ marginBottom: 8 }}>
        {emailFilter ? 'No invite requests match your search' : 'No invite requests'}
      </Typography>
      <Typography variant="body2">
        {emailFilter ? 'Try a different search term' : 'Invite requests will appear here'}
      </Typography>
    </Box>
  )

  // Check if there are any invite requests
  const hasInviteRequests = data?.userInviteRequests && Array.isArray(data.userInviteRequests) && data.userInviteRequests.length > 0
  const filteredData = hasInviteRequests ? filterAndSortData(data.userInviteRequests) : []
  
  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  
  // Get paginated data
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleActionComplete = React.useCallback(async () => {
    if (typeof onRefresh === 'function') {
      await onRefresh()
    }
  }, [onRefresh])

  return (
    <Card>
      <CardContent>
        <Typography className={classes.cardHeader}>
          User Invitation Requests
        </Typography>
        {hasInviteRequests && (
          <TextField
            placeholder="Search by email..."
            variant="outlined"
            size="small"
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className={classes.filterInput}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span role="img" aria-label="search" className={classes.searchIcon}>
                    🔍
                  </span>
                </InputAdornment>
              ),
            }}
          />
        )}
        {isSmallScreen
          ? paginatedData.length > 0
            ? (
              <div className={classes.responsiveList}>
                {paginatedData.map((row) => (
                  <Box key={row._id} className={classes.responsiveCard}>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Email
                      </Typography>
                      <Typography className={classes.responsiveCardValue}>
                        {row.email}
                      </Typography>
                    </div>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Joined
                      </Typography>
                      <Typography className={classes.responsiveCardValue}>
                        {moment(row.joined).format('MMM DD, YYYY')}
                      </Typography>
                    </div>
                    <div className={classes.responsiveCardRow}>
                      <Typography className={classes.responsiveCardLabel}>
                        Status
                      </Typography>
                      <div className={classes.statusWrapper}>{renderStatusChip(row.status)}</div>
                    </div>
                    <div className={classes.responsiveCardActions}>
                      <ActionButtons
                        status={row.status}
                        id={row._id}
                        onActionComplete={handleActionComplete}
                      />
                    </div>
                  </Box>
                ))}
              </div>
            )
            : renderEmptyState()
          : (
            <TableContainer className={classes.tableContainer}>
              <Table
                className={classes.table}
                aria-label="user invitation requests table"
                stickyHeader
              >
                <TableHead classes={{ head: classes.columnHeader }}>
                  <TableRow>
                    {header.map((column) => (
                      <TableCell
                        key={column.key}
                        align="center"
                        className={classes.columnHeader}
                        style={{ cursor: column.key !== 'action' ? 'pointer' : 'default' }}
                        onClick={() => column.key !== 'action' && handleSort(column.key)}
                      >
                        {column.label}
                        {sortConfig.key === column.key && column.key !== 'action' && (
                          <span style={{ marginLeft: 5 }}>
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="center">
                          {moment(row.joined).format('MMM DD, YYYY')}
                        </TableCell>
                        <TableCell align="center">
                          <div className={classes.statusCell}>{renderStatusChip(row.status)}</div>
                        </TableCell>
                        <TableCell align="center">
                          <ActionButtons
                            status={row.status}
                            id={row._id}
                            onActionComplete={handleActionComplete}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" style={{ padding: '40px 20px' }}>
                        <Typography variant="body1" style={{ color: '#666', marginBottom: 8 }}>
                          {emailFilter
                            ? 'No invite requests match your search'
                            : 'No invite requests'}
                        </Typography>
                        <Typography variant="body2" style={{ color: '#999' }}>
                          {emailFilter
                            ? 'Try a different search term'
                            : 'Invite requests will appear here'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        {filteredData.length > 0 && (
          <TablePagination
            component="div"
            className={classes.pagination}
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`
            }
          />
        )}
      </CardContent>
    </Card>
  )
}

// Statistics Tab Component
const StatisticsTab = ({ data }) => {
  const classes = useStyles()
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, {
    variables: {
      limit: 1000, // Get a large number to count all users
      offset: 0,
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })
  
  if (!data || !data.userInviteRequests || !Array.isArray(data.userInviteRequests)) {
    return <div>No data available</div>
  }
  
  // Calculate invitation statistics based on status
  const pendingInvitations = data.userInviteRequests.filter(
    (user) => parseInt(user.status) === 1,
  ).length
  const declinedUsers = data.userInviteRequests.filter(
    (user) => parseInt(user.status) === 2,
  ).length
  const totalInvitations = data.userInviteRequests.length // All invitation requests
  
  // Get total active users from GET_USERS query
  const totalActiveUsers = usersData?.users && Array.isArray(usersData.users) 
    ? usersData.users.length 
    : 0
  
  // Chart data for active users over time - use all users from GET_USERS
  // Since we don't have joined date in GET_USERS, we'll use invitation data for the chart
  // but only show it if we have data
  const result = data.userInviteRequests.reduce((_r, { joined }) => {
    if (!joined) return _r
    const dateObj = moment(joined).format('yyyy-MM-01')
    const objectKey = dateObj.toLocaleString('en-us', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    })
    const r = { ..._r } // decouple instance
    if (!r[objectKey]) r[objectKey] = { objectKey, entries: 1 }
    else r[objectKey].entries++
    return r
  }, {})
  const labels = Object.keys(result).sort((a, b) => new Date(a) - new Date(b))
  const lineSeries = labels.map((label) => result[label].entries)
  const formatLabels = labels.map((label) => {
    const dateObj = new Date(label)
    return dateObj.toLocaleString('en-us', {
      month: 'numeric',
      year: 'numeric',
    })
  })
  const chartData = {
    labels: formatLabels,
    series: [lineSeries],
  }
  const maxChartValue = Math.max(...lineSeries, totalActiveUsers) || totalActiveUsers || 1
  const chartOptions = {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0,
    }),
    low: 0,
    high: maxChartValue + 5,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }

  if (usersLoading) {
    return (
      <Card>
        <CardContent>
          <Skeleton animation="wave" height={200} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Box className={classes.statsHeader}>
          <Typography className={classes.cardHeader}>
            User Statistics
          </Typography>
          <Typography className={classes.graphText}>
            Total Users: {totalActiveUsers || 0}
          </Typography>
        </Box>
        <ChartistGraph
          className="ct-chart-white-colors"
          style={{
            backgroundColor: '#00bcd4',
            marginTop: 10,
            marginBottom: 15,
            borderRadius: 8,
          }}
          data={chartData}
          type="Line"
          options={chartOptions}
          listener={dailySalesChart.animation}
        />
        <Box className={classes.statsFooter}>
          <Typography className={classes.graphText}>
            Pending Invitations: {pendingInvitations || 0}
          </Typography>
          <Typography className={classes.graphText}>
            Declined Invitations: {declinedUsers || 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

const UserManagementTab = () => {
  const classes = useStyles()
  const { theme, isSmallScreen } = useResponsive()
  const ensureAuth = useGuestGuard()
  const { data, loading, error, refetch } = useQuery(GET_USERS, {
    variables: {
      limit: 100, // Use max limit for admin panel
      offset: 0,
    },
    errorPolicy: 'all', // Handle errors gracefully
    fetchPolicy: 'cache-and-network',
  })
  
  // Handle errors
  if (error) {
    if (error.message && error.message.includes('Authentication required')) {
      return (
        <Card>
          <CardContent>
            <Typography className={classes.cardHeader}>User Management</Typography>
            <Typography color="error">Authentication required. Please log in.</Typography>
          </CardContent>
        </Card>
      )
    }
    if (error.message && error.message.includes('Admin access required')) {
      return (
        <Card>
          <CardContent>
            <Typography className={classes.cardHeader}>User Management</Typography>
            <Typography color="error">Admin access required to view users.</Typography>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <CardContent>
          <Typography className={classes.cardHeader}>User Management</Typography>
          <Typography color="error">Error loading users: {error.message}</Typography>
        </CardContent>
      </Card>
    )
  }
  const [updateUser] = useMutation(UPDATE_USER)

  if (loading || !data) return <Skeleton animation="wave" height={200} />

  const hasUsers = Array.isArray(data.users) && data.users.length > 0

  const handleToggle = async (user) => {
    if (!ensureAuth()) return
    await updateUser({
      variables: {
        user: {
          _id: user._id,
          contributorBadge: !user.contributorBadge,
        },
      },
    })
    refetch()
  }

  return (
    <Card>
      <CardContent>
        <Typography className={classes.cardHeader}>User Management</Typography>
        {isSmallScreen ? (
          hasUsers ? (
            <div className={classes.responsiveList}>
              {data.users.map((user) => (
                <Box key={user._id} className={classes.responsiveCard}>
                  <div className={classes.responsiveCardRow}>
                    <Typography className={classes.responsiveCardLabel}>User ID</Typography>
                    <Typography className={classes.responsiveCardValue}>{user._id}</Typography>
                  </div>
                  <div className={classes.responsiveCardRow}>
                    <Typography className={classes.responsiveCardLabel}>Username</Typography>
                    <Typography className={classes.responsiveCardValue}>{user.username}</Typography>
                  </div>
                  <div className={classes.responsiveCardRow}>
                    <Typography className={classes.responsiveCardLabel}>Name</Typography>
                    <Typography className={classes.responsiveCardValue}>{user.name || '—'}</Typography>
                  </div>
                  <div className={classes.responsiveCardRow}>
                    <Typography className={classes.responsiveCardLabel}>Contributor Badge</Typography>
                    <div className={classes.statusWrapper}>
                      <Switch
                        checked={!!user.contributorBadge}
                        onChange={() => handleToggle(user)}
                        color="primary"
                        inputProps={{ 'aria-label': 'toggle contributor badge' }}
                      />
                    </div>
                  </div>
                </Box>
              ))}
            </div>
          ) : (
            <Box className={classes.emptyState}>
              <Typography variant="body1" style={{ marginBottom: 8 }}>
                No users found
              </Typography>
              <Typography variant="body2">Users will appear once they join.</Typography>
            </Box>
          )
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table stickyHeader aria-label="user management table">
              <TableHead classes={{ head: classes.columnHeader }}>
                <TableRow>
                  <TableCell align="center" className={classes.columnHeader}>
                    User ID
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Username
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Name
                  </TableCell>
                  <TableCell align="center" className={classes.columnHeader}>
                    Contributor Badge
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell align="center">{user._id}</TableCell>
                    <TableCell align="center">{user.username}</TableCell>
                    <TableCell align="center">{user.name}</TableCell>
                    <TableCell align="center">
                      <div className={classes.switchWrapper}>
                        <Switch
                          checked={!!user.contributorBadge}
                          onChange={() => handleToggle(user)}
                          color="primary"
                          inputProps={{ 'aria-label': 'toggle contributor badge' }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  )
}

const ControlPanelContainer = ({ data, onRefresh }) => {
  const classes = useStyles()
  const { isSmallScreen } = useResponsive()
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Grid container spacing={2} className={classes.panelContainer}>
      <Grid container>
        <Typography className={classes.panelHeader}>
          Control Panel
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        {isSmallScreen ? (
          <FormControl variant="outlined" size="small" className={classes.mobileTabSelect}>
            <Select
              value={tabValue}
              onChange={(event) => handleTabChange(event, event.target.value)}
              displayEmpty
            >
              <MenuItem value={0}>User Invitation Requests</MenuItem>
              <MenuItem value={1}>Statistics</MenuItem>
              <MenuItem value={2}>Featured Posts</MenuItem>
              <MenuItem value={3}>User Management</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <Box className={classes.tabsWrapper}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="control panel tabs"
              className={classes.tabsContainer}
              indicatorColor="secondary"
              textColor="secondary"
              variant="fullWidth"
            >
              <Tab label="User Invitation Requests" classes={{ root: classes.tabRoot }} />
              <Tab label="Statistics" classes={{ root: classes.tabRoot }} />
              <Tab label="Featured Posts" classes={{ root: classes.tabRoot }} />
              <Tab label="User Management" classes={{ root: classes.tabRoot }} />
            </Tabs>
          </Box>
        )}
      </Grid>

      <Grid item xs={12}>
        <TabPanel value={tabValue} index={0}>
          <UserInvitationRequestsTab data={data} onRefresh={onRefresh} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <StatisticsTab data={data} />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <FeaturedPostsTable />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <UserManagementTab />
        </TabPanel>
      </Grid>
    </Grid>
  )
}

const ControlPanel = () => {
  const { data, loading, error, refetch } = useQuery(USER_INVITE_REQUESTS)
  const classes = useStyles()
  const dispatch = useDispatch()
  const snackbar = useSelector((state) => state.ui.snackbar)
  const { admin } = useSelector((state) => state.user.data)

  const renderSkeleton = () => (
      <Grid container spacing={2} className={classes.panelContainer}>
        <Grid item xs={12}>
          <Skeleton animation="wave" style={{ width: '25%' }} />
        </Grid>
        <Grid container item xs={12}>
          <Grid container item xs={6} className={classes.sectionBorder}>
            <Skeleton animation="wave" height={300} style={{ width: '80%' }} />
          </Grid>
          <Grid container item xs={6} justify="flex-end">
            <Skeleton animation="wave" height={300} style={{ width: '80%' }} />
          </Grid>
        </Grid>
      </Grid>
    )

  const renderContent = () => {
    if (!admin) {
      return <Unauthorized />
    }
    if (loading) {
      return renderSkeleton()
    }
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user invite requests:', error)
      }
      return <div>Error loading invite requests: {error.message}</div>
    }
    if (data && data.userInviteRequests) {
      return <ControlPanelContainer data={data} onRefresh={refetch} />
    }
    return renderSkeleton()
  }

  return (
    <>
      {renderContent()}
      {snackbar ? (
        <Snackbar
          place="bc"
          color={snackbar.type}
          message={snackbar.message}
          open={snackbar.open}
          closeNotification={() =>
            dispatch(SET_SNACKBAR({ open: false, message: '', type: '' }))
          }
          close
        />
      ) : null}
    </>
  )
}

ControlPanelContainer.propTypes = {
  data: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
}

ControlPanelContainer.defaultProps = {
  onRefresh: null,
}

UserInvitationRequestsTab.propTypes = {
  data: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
}

UserInvitationRequestsTab.defaultProps = {
  onRefresh: null,
}

StatisticsTab.propTypes = {
  data: PropTypes.object.isRequired,
}

ActionButtons.propTypes = {
  status: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onActionComplete: PropTypes.func,
}

ActionButtons.defaultProps = {
  onActionComplete: null,
}

export default ControlPanel
