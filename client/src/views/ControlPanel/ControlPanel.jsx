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
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import HomeIcon from '@material-ui/icons/Home'

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
import { useSelector } from 'react-redux'
import controlPanelStylwa from './controlPanelStyles'
import Unauthorized from '@/components/Unauthorized/Unauthorized'
import useGuestGuard from '../../utils/useGuestGuard'

const useStyles = makeStyles(controlPanelStylwa)

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

const ActionButtons = ({ status, id }) => {
  const classes = useStyles()
  const ensureAuth = useGuestGuard()
  const [sendUserInviteApproval, { loading }] = useMutation(
    UPDATE_USER_INVITE_STATUS,
  )
  const submitData = async (selectedStatus) => {
    if (!ensureAuth()) return
    await sendUserInviteApproval({
      variables: {
        userId: id,
        inviteStatus: `${selectedStatus}`,
      },
      refetchQueries: [
        {
          query: USER_INVITE_REQUESTS,
        },
      ],
    })
  }

  const handleDecline = async () => {
    await submitData(2)
  }

  const handleAccept = async () => {
    await submitData(4)
  }

  const handleReset = async () => {
    await submitData(1)
  }

  switch (Number(status)) {
    case 1: // pending
      return (
        <div style={{ width: 200 }}>
          <Button
            variant="contained"
            color="secondary"
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
            color="primary"
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
      )
    case 4: // active
      return (
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
      )
    default:
      return null
  }
}

const FeaturedPostsTable = () => {
  const classes = useStyles()
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
        />
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
              {filteredPosts.map((post) => (
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
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (n) => (
                            <MenuItem
                              key={n}
                              value={n}
                              disabled={
                                usedSlots[n] && usedSlots[n] !== post._id
                              }
                            >
                              {n}
                            </MenuItem>
                          ),
                        )}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSave(post._id)}
                      disabled={loading}
                    >
                      {post.featuredSlot ? 'Update' : 'Assign'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

// User Invitation Requests Tab Component
const UserInvitationRequestsTab = ({ data }) => {
  const classes = useStyles()
  const [sortConfig, setSortConfig] = React.useState({
    key: 'joined',
    direction: 'desc'
  })
  const [emailFilter, setEmailFilter] = React.useState('')
  
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

  return (
    <Card>
      <CardContent>
        <Typography className={classes.cardHeader}>
          User Invitation Requests
        </Typography>
        <TextField
          placeholder="Search by email..."
          variant="outlined"
          size="small"
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          style={{ marginBottom: 16, width: '100%', maxWidth: 300 }}
          InputProps={{
            startAdornment: (
              <span style={{ marginRight: 8, color: '#666' }}>🔍</span>
            ),
          }}
        />
        <TableContainer className={classes.tableContainer}>
          <Table
            className={classes.table}
            aria-label="simple table"
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
              {data?.userInviteRequests && filterAndSortData(data.userInviteRequests).map((row) => (
                <TableRow key={row._id}>
                  <TableCell align="left">{row.email}</TableCell>
                  <TableCell align="center">
                    {moment(row.joined).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      className={cx({
                        [classes.pendingStatus]: row.status === '1',
                        [classes.declinedStatus]: row.status === '2',
                        [classes.acceptedStatus]: row.status === '4',
                      })}
                      disableRipple
                      disableElevation
                    >
                      {getStatusValue(row.status)}
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <ActionButtons status={row.status} id={row._id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

// Statistics Tab Component
const StatisticsTab = ({ data }) => {
  const classes = useStyles()
  const activeUsersCount = 0
  
  if (!data || !data.userInviteRequests || !Array.isArray(data.userInviteRequests)) {
    return <div>No data available</div>
  }
  
  const inviteRequestCount = data.userInviteRequests.filter(
    (user) => parseInt(user.status) === 1,
  ).length
  const totalUsers = data.userInviteRequests.length
  const result = data.userInviteRequests.reduce((_r, { joined }) => {
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
  const chartOptions = {
    lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0,
    }),
    low: 0,
    high: totalUsers + 5,
    chartPadding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  }

  return (
    <Card>
      <CardContent>
        <Typography className={classes.cardHeader} display="inline">
          User Invitation Statistics
        </Typography>
        <Typography
          className={classes.graphText}
          display="inline"
          style={{ float: 'right' }}
        >
          Invite Requests: {inviteRequestCount || 0}
        </Typography>
        <ChartistGraph
          className="ct-chart-white-colors"
          style={{
            backgroundColor: '#00bcd4',
            marginTop: 10,
            marginBottom: 15,
          }}
          data={chartData}
          type="Line"
          options={chartOptions}
          listener={dailySalesChart.animation}
        />
        <Typography className={classes.graphText} display="inline">
          Total Users: {totalUsers || 0}
        </Typography>
        <Typography
          className={classes.graphText}
          display="inline"
          style={{ float: 'right' }}
        >
          Active Users Today: {activeUsersCount}
        </Typography>
      </CardContent>
    </Card>
  )
}

const UserManagementTab = () => {
  const classes = useStyles()
  const ensureAuth = useGuestGuard()
  const { data, loading, refetch } = useQuery(GET_USERS)
  const [updateUser] = useMutation(UPDATE_USER)

  if (loading || !data) return <Skeleton animation="wave" height={200} />

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
        <TableContainer className={classes.tableContainer}>
          <Table stickyHeader aria-label="user management table">
            <TableHead classes={{ head: classes.columnHeader }}>
              <TableRow>
                <TableCell align="center" className={classes.columnHeader}>User ID</TableCell>
                <TableCell align="center" className={classes.columnHeader}>Username</TableCell>
                <TableCell align="center" className={classes.columnHeader}>Name</TableCell>
                <TableCell align="center" className={classes.columnHeader}>Contributor Badge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell align="center">{user._id}</TableCell>
                  <TableCell align="center">{user.username}</TableCell>
                  <TableCell align="center">{user.name}</TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={!!user.contributorBadge}
                      onChange={() => handleToggle(user)}
                      color="primary"
                      inputProps={{ 'aria-label': 'toggle contributor badge' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

const ControlPanelContainer = ({ data }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Grid container spacing={2} className={classes.panelContainer}>
      <Grid container className={classes.breadcrumb}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          <Link color="inherit" href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon style={{ marginRight: 4, fontSize: 20 }} />
            {!isMobile && 'Home'}
          </Link>
          <Typography color="textPrimary" style={{ fontWeight: 'bold' }}>
            Admin Panel
          </Typography>
        </Breadcrumbs>
      </Grid>
      
      <Grid container>
        <Typography className={classes.panelHeader}>
          Admin Control Panel
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="control panel tabs"
          className={classes.tabsContainer}
          indicatorColor="secondary"
          textColor="secondary"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "on" : "auto"}
        >
          <Tab label={isMobile ? "Invites" : "User Invitation Requests"} />
          <Tab label="Statistics" />
          <Tab label={isMobile ? "Featured" : "Featured Posts"} />
          <Tab label={isMobile ? "Users" : "User Management"} />
        </Tabs>
      </Grid>

      <Grid item xs={12}>
        <TabPanel value={tabValue} index={0}>
          <UserInvitationRequestsTab data={data} />
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
  const { data, loading, error } = useQuery(USER_INVITE_REQUESTS)
  const classes = useStyles()
  const { admin } = useSelector((state) => state.user.data)
  if (!admin) {
    return <Unauthorized />
  }
  if (loading) {
    return (
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
  }
  if (error) {
    console.error('Error fetching user invite requests:', error)
    return <div>Error loading invite requests: {error.message}</div>
  }
  if (data && data.userInviteRequests) {
    return <ControlPanelContainer data={data} />
  }
  return (
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
}

ControlPanelContainer.propTypes = {
  data: PropTypes.object.isRequired,
}

UserInvitationRequestsTab.propTypes = {
  data: PropTypes.object.isRequired,
}

StatisticsTab.propTypes = {
  data: PropTypes.object.isRequired,
}

ActionButtons.propTypes = {
  status: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default ControlPanel
