import React from 'react'
import Button from '@mui/material/Button'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import Hidden from '@mui/material/Hidden'
import Grid from '@mui/material/Grid'

function RequestInviteCarouselButton({ classes }) {
  const history = useHistory()
  return (
    <Hidden mdUp>
      <Grid item xs={12}>
        <Button
          variant="contained"
          className={classes.requestInvite}
          type="submit"
          onClick={() => history.push('/auth/request-access')}
        >
          Request Invite
        </Button>
      </Grid>
    </Hidden>
  )
}

RequestInviteCarouselButton.propTypes = {
  classes: PropTypes.object,
}
export default RequestInviteCarouselButton
