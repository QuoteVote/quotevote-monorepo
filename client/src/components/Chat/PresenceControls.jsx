import { useEffect, useMemo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_PRESENCE_STATUS } from '../../graphql/mutations'
import { GET_CHAT_ROOMS } from '../../graphql/query'
import { SET_USER_DATA } from '../../store/user'
import {
  describePresence,
  getPresenceLabel,
  isAwayStatus,
  normalizePresenceStatus,
} from '../../utils/presence'

const STATUS_OPTIONS = [
  { value: 'ONLINE', label: 'Available' },
  { value: 'AWAY', label: 'Away' },
  { value: 'OFFLINE', label: 'Invisible' },
]

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'rgba(10, 26, 43, 0.55)',
    borderRadius: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    color: '#FFFFFF',
    backdropFilter: 'blur(6px)',
  },
  header: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  summary: {
    marginBottom: theme.spacing(2),
    opacity: 0.85,
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    alignItems: 'flex-end',
  },
  formControl: {
    minWidth: 160,
  },
  awayField: {
    flexGrow: 1,
    minWidth: 200,
  },
  actionButton: {
    alignSelf: 'center',
    marginLeft: 'auto',
  },
}))

function PresenceControls() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data || {})

  const normalizedUserStatus = useMemo(
    () => normalizePresenceStatus(user.presenceStatus),
    [user.presenceStatus],
  )

  const [status, setStatus] = useState(normalizedUserStatus)
  const [awayMessage, setAwayMessage] = useState(user.awayMessage || '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setStatus(normalizedUserStatus)
    setAwayMessage(user.awayMessage || '')
    setDirty(false)
  }, [normalizedUserStatus, user.awayMessage, user._id])

  const [mutatePresence, { loading }] = useMutation(UPDATE_PRESENCE_STATUS, {
    onCompleted: (result) => {
      if (result?.updatePresenceStatus) {
        dispatch(SET_USER_DATA({ ...user, ...result.updatePresenceStatus }))
      }
      setDirty(false)
    },
  })

  const handleStatusChange = (event) => {
    const newStatus = normalizePresenceStatus(event.target.value)
    setStatus(newStatus)
    setDirty(true)
    if (!isAwayStatus(newStatus)) {
      setAwayMessage('')
    }
  }

  const handleAwayMessageChange = (event) => {
    setAwayMessage(event.target.value)
    setDirty(true)
  }

  const isAway = isAwayStatus(status)
  const trimmedAwayMessage = awayMessage.trim()
  const statusLabel = getPresenceLabel(status)
  const summary = describePresence(status, isAway ? trimmedAwayMessage : '', user.lastActiveAt)

  const handleSubmit = (event) => {
    event.preventDefault()
    mutatePresence({
      variables: {
        presence: {
          status,
          awayMessage: isAway ? trimmedAwayMessage : '',
        },
      },
      refetchQueries: [{ query: GET_CHAT_ROOMS }],
    })
  }

  const disableButton =
    !dirty || loading || (isAway && trimmedAwayMessage.length === 0)

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <Typography variant="subtitle2" className={classes.header}>
        Instant Messenger Status
      </Typography>
      <Typography variant="body2" className={classes.summary}>
        You are currently <strong>{statusLabel.toLowerCase()}</strong>. {summary}
      </Typography>
      <div className={classes.controls}>
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel id="presence-status-label">Availability</InputLabel>
          <Select
            labelId="presence-status-label"
            value={status}
            onChange={handleStatusChange}
            label="Availability"
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          className={classes.awayField}
          variant="outlined"
          size="small"
          label="Away message"
          value={awayMessage}
          onChange={handleAwayMessageChange}
          disabled={!isAway}
          helperText={
            isAway
              ? 'Let your friends know what you are up to.'
              : 'Set an away message when you switch to Away.'
          }
          inputProps={{ maxLength: 140 }}
        />
        <Button
          className={classes.actionButton}
          type="submit"
          color="secondary"
          variant="contained"
          disabled={disableButton}
        >
          Update status
        </Button>
      </div>
    </form>
  )
}

export default PresenceControls
