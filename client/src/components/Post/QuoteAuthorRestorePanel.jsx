import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, CardContent, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import RestoreIcon from '@material-ui/icons/Restore'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { useMutation } from '@apollo/react-hooks'
import { useDispatch } from 'react-redux'
import SweetAlert from 'react-bootstrap-sweetalert'
import { RESTORE_POST, HARD_DELETE_POST } from '../../graphql/mutations'
import { GET_POST, GET_POST_STATUS } from '../../graphql/query'
import { SET_SNACKBAR } from '../../store/ui'

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(2),
    border: `1px dashed ${theme.palette.divider}`,
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  label: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  restoreBtn: {
    color: '#52b274',
    borderColor: '#52b274',
  },
  deleteBtn: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
  },
}))

function QuoteAuthorRestorePanel({ postId }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [showConfirm, setShowConfirm] = useState(false)

  const refetchOpts = {
    refetchQueries: [
      { query: GET_POST, variables: { postId } },
      { query: GET_POST_STATUS, variables: { postId } },
    ],
  }

  const [restorePost, { loading: restoring }] = useMutation(RESTORE_POST, refetchOpts)
  const [hardDeletePost, { loading: deleting }] = useMutation(HARD_DELETE_POST, refetchOpts)

  const handleRestore = async () => {
    try {
      await restorePost({ variables: { postId } })
      dispatch(SET_SNACKBAR({ open: true, message: 'Post restored', type: 'success' }))
    } catch (err) {
      dispatch(SET_SNACKBAR({ open: true, message: `Restore error: ${err.message}`, type: 'danger' }))
    }
  }

  const handleHardDelete = async () => {
    setShowConfirm(false)
    try {
      await hardDeletePost({ variables: { postId } })
      dispatch(SET_SNACKBAR({ open: true, message: 'Post permanently deleted', type: 'success' }))
    } catch (err) {
      dispatch(SET_SNACKBAR({ open: true, message: `Delete error: ${err.message}`, type: 'danger' }))
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.label}>
            You removed this quote. You can restore it or permanently delete it.
          </Typography>
          <div className={classes.buttonGroup}>
            <Button
              variant="outlined"
              className={classes.restoreBtn}
              startIcon={<RestoreIcon />}
              onClick={handleRestore}
              disabled={restoring || deleting}
            >
              Restore
            </Button>
            <Button
              variant="outlined"
              className={classes.deleteBtn}
              startIcon={<DeleteForeverIcon />}
              onClick={() => setShowConfirm(true)}
              disabled={restoring || deleting}
            >
              Permanently Delete
            </Button>
          </div>
        </CardContent>
      </Card>
      {showConfirm && (
        <SweetAlert
          warning
          showCancel
          confirmBtnText="Yes, delete permanently"
          confirmBtnCssClass="btn btn-danger"
          cancelBtnCssClass="btn btn-default"
          title="Are you sure?"
          onConfirm={handleHardDelete}
          onCancel={() => setShowConfirm(false)}
        >
          This action cannot be undone. The post content will be permanently removed.
        </SweetAlert>
      )}
    </>
  )
}

QuoteAuthorRestorePanel.propTypes = {
  postId: PropTypes.string.isRequired,
}

export default QuoteAuthorRestorePanel
