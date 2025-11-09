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

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  sortControl: {
    marginBottom: theme.spacing(2),
    minWidth: 200,
  },
  table: {
    minWidth: 650,
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
  },
  disabledRow: {
    backgroundColor: theme.palette.grey[100],
  },
}))

const BotListTab = () => {
  const classes = useStyles()
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

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography className={classes.cardHeader}>
            Bot Reports ({reportedUsers.length})
          </Typography>
          <FormControl className={classes.sortControl}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="botReports">Most Reports</MenuItem>
              <MenuItem value="lastReportDate">Most Recent Report</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {reportedUsers.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No bot reports found.
          </Typography>
        ) : (
          <TableContainer>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="center">Reports</TableCell>
                  <TableCell>Last Report</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
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

