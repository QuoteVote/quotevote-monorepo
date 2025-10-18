import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import {
  TrendingUp,
  People,
  Security,
  Timeline,
  Refresh,
  Info,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  reputationCard: {
    marginBottom: theme.spacing(2),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  scoreContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  scoreValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginRight: theme.spacing(1),
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    '& .MuiLinearProgress-bar': {
      backgroundColor: '#4caf50',
    },
  },
  metricCard: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  metricValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const ReputationDisplay = ({ reputation, onRefresh, loading = false }) => {
  const classes = useStyles();

  if (!reputation) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            No reputation data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 800) return '#4caf50'; // Green
    if (score >= 600) return '#ff9800'; // Orange
    if (score >= 400) return '#ff5722'; // Red-Orange
    return '#f44336'; // Red
  };

  const getScoreLabel = (score) => {
    if (score >= 800) return 'Excellent';
    if (score >= 600) return 'Good';
    if (score >= 400) return 'Fair';
    return 'Poor';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box>
      {/* Main Reputation Card */}
      <Card className={classes.reputationCard}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" gutterBottom>
                Reputation Score
              </Typography>
              <Box className={classes.scoreContainer}>
                <Typography className={classes.scoreValue}>
                  {reputation.overallScore}
                </Typography>
                <Chip
                  label={getScoreLabel(reputation.overallScore)}
                  style={{ backgroundColor: getScoreColor(reputation.overallScore), color: 'white' }}
                  size="small"
                />
              </Box>
              <LinearProgress
                className={classes.progressBar}
                variant="determinate"
                value={(reputation.overallScore / 1000) * 100}
              />
              <Typography variant="caption" style={{ opacity: 0.8 }}>
                Last updated: {formatDate(reputation.lastCalculated)}
              </Typography>
            </Box>
            <Box>
              <Tooltip title="Refresh reputation">
                <IconButton onClick={onRefresh} disabled={loading} style={{ color: 'white' }}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Score Breakdown
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box className={classes.metricCard}>
                <People color="primary" />
                <Typography className={classes.metricValue}>
                  {reputation.inviteNetworkScore}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Invite Network
                </Typography>
                <Tooltip title="Based on quality of invited users and acceptance rate">
                  <Info fontSize="small" style={{ color: '#ccc', marginTop: 4 }} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box className={classes.metricCard}>
                <Security color="primary" />
                <Typography className={classes.metricValue}>
                  {reputation.conductScore}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Conduct
                </Typography>
                <Tooltip title="Based on reports received and voting behavior">
                  <Info fontSize="small" style={{ color: '#ccc', marginTop: 4 }} />
                </Tooltip>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box className={classes.metricCard}>
                <Timeline color="primary" />
                <Typography className={classes.metricValue}>
                  {reputation.activityScore}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Activity
                </Typography>
                <Tooltip title="Based on content creation and platform engagement">
                  <Info fontSize="small" style={{ color: '#ccc', marginTop: 4 }} />
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detailed Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalInvitesSent}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Invites Sent
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalInvitesAccepted}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Invites Accepted
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalPosts}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Posts Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalComments}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Comments Made
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalUpvotes}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Upvotes Given
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalReportsReceived}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Reports Received
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.averageInviteeReputation}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Avg Invitee Rep
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className={classes.metricCard}>
                <Typography className={classes.metricValue}>
                  {reputation.metrics.totalReportsResolved}
                </Typography>
                <Typography className={classes.metricLabel}>
                  Reports Resolved
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReputationDisplay;
