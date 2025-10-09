import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert'
import {
  Grid, IconButton, Tooltip, Typography,
} from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@mui/styles'
import * as copy from 'clipboard-copy'
import PropTypes from 'prop-types'
import GridItem from '../../mui-pro/Grid/GridItem'
import buttonStyle from '../../assets/jss/material-dashboard-pro-react/components/buttonStyle'

const useStyles = makeStyles({
  ...buttonStyle,
})

function SubmitPostAlert({
  hideAlert,
  shareableLink,
  error,
  setShowAlert,
  setOpen,
}) {
  const classes = useStyles()
  const history = useHistory()
  const DOMAIN = process.env.REACT_APP_DOMAIN || 'localhost:3000'
  const handleCopy = (shareablePostLink) => {
    copy(shareablePostLink)
  }

  async function goToPost() {
    await history.push(shareableLink.replace(/\?/g, ''))
    setShowAlert(false)
    setOpen(false)
  }

  if (error) {
    return (
      <SweetAlert
        error
        style={{ display: 'block' }}
        title="Error"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={`${classes.button} ${classes.danger}`}
        confirmBtnText="Ok"
      >
        {/* We don't know what, yet let us know and we can find out */}
        Error:
        {' '}
        {error.toString()}
      </SweetAlert>
    )
  }

  return (
    <SweetAlert
      success
      style={{ display: 'block' }}
      title="You Created a Post!"
      onConfirm={() => goToPost()}
      onCancel={() => hideAlert()}
      confirmBtnCssClass={`${classes.button} ${classes.success}`}
      confirmBtnText="Go to Post"
    >
      <Typography variant="caption">
        Share your text to your friends and family.
      </Typography>
      <Grid
        container
        justify="space-around"
        style={{ marginTop: 16 }}
        wrap="nowrap"
      >
        <GridItem style={{ overflow: 'auto' }}>
          <pre>{DOMAIN + shareableLink}</pre>
        </GridItem>
        <GridItem style={{ flex: 1 }}>
          <IconButton onClick={() => handleCopy(DOMAIN + shareableLink.replace(/\?/g, ''))}>
            <Tooltip title="Copy Link to Clip Board">
              <AssignmentIcon />
            </Tooltip>
          </IconButton>
        </GridItem>
      </Grid>
    </SweetAlert>
  )
}

SubmitPostAlert.propTypes = {
  hideAlert: PropTypes.func,
  shareableLink: PropTypes.string,
  error: PropTypes.any,
  setShowAlert: PropTypes.func,
  setOpen: PropTypes.func,
}

export default SubmitPostAlert
