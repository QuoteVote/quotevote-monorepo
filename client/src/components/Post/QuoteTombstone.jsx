import PropTypes from 'prop-types'
import { Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle'
import RateReviewIcon from '@material-ui/icons/RateReview'
import GavelIcon from '@material-ui/icons/Gavel'

const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.type === 'dark' ? '#2a2a2a' : '#f5f5f5',
    border: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    padding: theme.spacing(3),
  },
  icon: {
    fontSize: 48,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  message: {
    color: theme.palette.text.secondary,
    fontSize: '16px',
  },
  reason: {
    color: theme.palette.text.secondary,
    fontSize: '14px',
    marginTop: theme.spacing(1),
    fontStyle: 'italic',
  },
}))

const STATUS_CONFIG = {
  SOFT_DELETED_BY_AUTHOR: {
    message: 'This quote has been removed by the user.',
    Icon: DeleteIcon,
  },
  HARD_DELETED_BY_AUTHOR: {
    message: 'This quote has been permanently deleted by the user.',
    Icon: RemoveCircleIcon,
  },
  UNDER_REVIEW: {
    message: 'This quote is under review by moderators.',
    Icon: RateReviewIcon,
  },
  REMOVED_BY_MODERATOR: {
    message: 'This quote has been removed by moderators.',
    Icon: GavelIcon,
  },
}

function QuoteTombstone({ status, moderationInfo }) {
  const classes = useStyles()
  const config = STATUS_CONFIG[status]

  if (!config) return null

  const { message, Icon } = config

  return (
    <Card className={classes.card}>
      <CardContent>
        <Icon className={classes.icon} />
        <Typography className={classes.message}>{message}</Typography>
        {status === 'REMOVED_BY_MODERATOR' && moderationInfo?.reasonCode && (
          <Typography className={classes.reason}>
            Reason: {moderationInfo.reasonCode.replace(/_/g, ' ').toLowerCase()}
            {moderationInfo.reasonText ? ` — ${moderationInfo.reasonText}` : ''}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

QuoteTombstone.propTypes = {
  status: PropTypes.string.isRequired,
  moderationInfo: PropTypes.shape({
    reasonCode: PropTypes.string,
    reasonText: PropTypes.string,
    moderatedAt: PropTypes.string,
  }),
}

export default QuoteTombstone
