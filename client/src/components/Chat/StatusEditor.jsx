import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { SET_STATUS } from '../../graphql/mutations'

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  field: {
    flex: 1,
  },
}))

function StatusEditor() {
  const classes = useStyles()
  const [value, setValue] = useState('')
  const [setStatus, { loading }] = useMutation(SET_STATUS)

  const handleSave = async () => {
    const statusText = value.trim()
    await setStatus({ variables: { statusText: statusText || null } })
  }

  const handleClear = async () => {
    setValue('')
    await setStatus({ variables: { statusText: null } })
  }

  return (
    <div className={classes.container}>
      <TextField
        className={classes.field}
        label="Away message"
        variant="outlined"
        size="small"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        inputProps={{ maxLength: 140 }}
        placeholder="Let people know what you're up to"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={loading}
      >
        Save
      </Button>
      <Button variant="outlined" onClick={handleClear} disabled={loading}>
        Clear
      </Button>
    </div>
  )
}

export default StatusEditor
