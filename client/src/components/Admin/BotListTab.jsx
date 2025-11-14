import React, { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  Box,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_BOT_REPORTED_USERS } from '@/graphql/query'
import { DISABLE_USER, ENABLE_USER } from '@/graphql/mutations'
import Skeleton from '@material-ui/lab/Skeleton'
import moment from 'moment'
import AvatarDisplay from '../Avatar'
import { useResponsive } from '@/hooks/useResponsive'
import controlPanelStyles from '@/views/ControlPanel/controlPanelStyles'
import cx from 'classnames'

const useStyles = makeStyles((theme) => ({
  ...controlPanelStyles(theme),
  sortControl: {
    marginBottom: theme.spacing(2),
    minWidth: 200,
    [theme.breakpoints.down('sm')]: {
      minWidth: '100%',
      marginBottom: theme.spacing(1),
    },
  },
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  statusChip: {
    fontWeight: 500,
  },
  actionButton: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginRight: 0,
    },
  },
  disabledRow: {
    backgroundColor: theme.palette.grey[100],
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
}))

const BotListTab = () => {
  const classes = useStyles()
  const { isSmallScreen } = useResponsive()
  const [sortBy, setSortBy] = useState('botReports')
  
  const { data, loading, error, refetch } = useQuery(GET_BOT_REPORTED_USERS, {
    variables: {
      sortBy,
      limit: 100,
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  })

  const [disableUser, { loading: disableLoading }] = useMutation(DISABLE_USER)
  const [enableUser, { loading: enableLoading }] = useMutation(ENABLE_USER)

  const handleDisableUser = async (userId) => {
    try {
      await disableUser({
        variables: { userId },
      })
      refetch()
    } catch (error) {
      console.error('Error disabling user:', error)
    }
  }

  const handleEnableUser = async (userId) => {
    try {
      await enableUser({
        variables: { userId },
      })
      refetch()
    } catch (error) {
      console.error('Error enabling user:', error)
    }
  }

  if (error) {
    if (error.message && error.message.includes('Authentication required')) {
      return (
        <Card>
          <CardContent>
            <Typography className={classes.cardHeader}>Bot Reports</Typography>
            <Typography color="error">Authentication required. Please log in.</Typography>
          </CardContent>
        </Card>
      )
    }
    if (error.message && error.message.includes('Admin access required')) {
      return (
        <Card>
          <CardContent>
            <Typography className={classes.cardHeader}>Bot Reports</Typography>
            <Typography color="error">Admin access required to view bot reports.</Typography>
          </CardContent>
        </Card>
      )
    }
    return (
      <Card>
        <CardContent>
          <Typography className={classes.cardHeader}>Bot Reports</Typography>
          <Typography color="error">Error loading bot reports: {error.message}</Typography>
        </CardContent>
      </Card>
    )
  }

  if (loading || !data) {
    return (
      <Card>
        <CardContent>
          <Skeleton animation="wave" height={200} />
        </CardContent>
      </Card>
    )
  }

  const reportedUsers = data.getBotReportedUsers || []

  const renderEmptyState = () => (
    <Box className={classes.emptyState}>
      <Typography variant="body1" style={{ marginBottom: 8 }}>
        No bot reports found
      </Typography>
      <Typography variant="body2">
        Bot reports will appear here when users are reported
      </Typography>
    </Box>
  )

  return (
    <Card>
      <CardContent>
        <Box className={classes.headerContainer}>
          <Typography className={classes.cardHeader}>
            Bot Reports ({reportedUsers.length})
          </Typography>
          <FormControl className={classes.sortControl} variant="outlined" size="small">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="botReports">Most Reports</MenuItem>
              <MenuItem value="lastReportDate">Most Recent Report</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {reportedUsers.length === 0 ? (
          renderEmptyState()
        ) : isSmallScreen ? (
          <div className={classes.responsiveList}>
            {reportedUsers.map((user) => (
              <Box
                key={user._id}
                className={cx(classes.responsiveCard, {
                  [classes.disabledRow]: user.accountStatus === 'disabled',
                })}
              >
                <div className={classes.responsiveCardRow}>
                  <Typography className={classes.responsiveCardLabel}>User</Typography>
                  <Box display="flex" alignItems="center" style={{ flex: 1, justifyContent: 'flex-end' }}>
                    <Avatar className={classes.avatar}>
                      <AvatarDisplay height={40} width={40} {...user.avatar} />
                    </Avatar>
                    <Box ml={1} style={{ textAlign: 'right' }}>
                      <Typography variant="body2" style={{ fontWeight: 500, margin: 0 }}>
                        {user.username}
                      </Typography>
                      {user.name && (
                        <Typography variant="caption" color="textSecondary">
                          {user.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </div>
                <div className={classes.responsiveCardRow}>
                  <Typography className={classes.responsiveCardLabel}>Email</Typography>
                  <Typography className={classes.responsiveCardValue}>{user.email}</Typography>
                </div>
                <div className={classes.responsiveCardRow}>
                  <Typography className={classes.responsiveCardLabel}>Reports</Typography>
                  <div className={classes.statusWrapper}>
                    <Chip
                      label={user.botReports}
                      color={user.botReports >= 5 ? 'secondary' : 'default'}
                      size="small"
                    />
                  </div>
                </div>
                <div className={classes.responsiveCardRow}>
                  <Typography className={classes.responsiveCardLabel}>Last Report</Typography>
                  <Box style={{ textAlign: 'right' }}>
                    <Typography variant="body2" style={{ margin: 0 }}>
                      {user.lastBotReportDate
                        ? moment(user.lastBotReportDate).format('MMM D, YYYY')
                        : 'N/A'}
                    </Typography>
                    {user.lastBotReportDate && (
                      <Typography variant="caption" color="textSecondary">
                        {moment(user.lastBotReportDate).fromNow()}
                      </Typography>
                    )}
                  </Box>
                </div>
                <div className={classes.responsiveCardRow}>
                  <Typography className={classes.responsiveCardLabel}>Status</Typography>
                  <div className={classes.statusWrapper}>
                    <Chip
                      label={user.accountStatus === 'active' ? 'Active' : 'Disabled'}
                      color={user.accountStatus === 'active' ? 'primary' : 'default'}
                      size="small"
                      className={classes.statusChip}
                    />
                  </div>
                </div>
                <div className={classes.responsiveCardActions}>
                  {user.accountStatus === 'active' ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      className={classes.actionButton}
                      onClick={() => handleDisableUser(user._id)}
                      disabled={disableLoading}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      className={classes.actionButton}
                      onClick={() => handleEnableUser(user._id)}
                      disabled={enableLoading}
                    >
                      Enable
                    </Button>
                  )}
                </div>
              </Box>
            ))}
          </div>
        ) : (
          <TableContainer className={classes.tableContainer}>
            <Table className={classes.table} stickyHeader aria-label="bot reports table">
              <TableHead classes={{ head: classes.columnHeader }}>
                <TableRow>
                  <TableCell className={classes.columnHeader}>User</TableCell>
                  <TableCell className={classes.columnHeader}>Email</TableCell>
                  <TableCell align="center" className={classes.columnHeader}>Reports</TableCell>
                  <TableCell className={classes.columnHeader}>Last Report</TableCell>
                  <TableCell className={classes.columnHeader}>Status</TableCell>
                  <TableCell align="right" className={classes.columnHeader}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportedUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className={user.accountStatus === 'disabled' ? classes.disabledRow : ''}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar className={classes.avatar}>
                          <AvatarDisplay height={40} width={40} {...user.avatar} />
                        </Avatar>
                        <Box ml={2}>
                          <Typography variant="body2" style={{ fontWeight: 500 }}>
                            {user.username}
                          </Typography>
                          {user.name && (
                            <Typography variant="caption" color="textSecondary">
                              {user.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.botReports}
                        color={user.botReports >= 5 ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastBotReportDate
                          ? moment(user.lastBotReportDate).format('MMM D, YYYY')
                          : 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {user.lastBotReportDate
                          ? moment(user.lastBotReportDate).fromNow()
                          : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.accountStatus === 'active' ? 'Active' : 'Disabled'}
                        color={user.accountStatus === 'active' ? 'primary' : 'default'}
                        size="small"
                        className={classes.statusChip}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {user.accountStatus === 'active' ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          className={classes.actionButton}
                          onClick={() => handleDisableUser(user._id)}
                          disabled={disableLoading}
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          className={classes.actionButton}
                          onClick={() => handleEnableUser(user._id)}
                          disabled={enableLoading}
                        >
                          Enable
                        </Button>
                      )}
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

export default BotListTab

