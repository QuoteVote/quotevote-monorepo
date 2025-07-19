import React from 'react'
import Button from '@mui/material/Button'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'

function RequestInviteCarouselButton({ classes }) {
  const history = useHistory()
  return (
    <Box sx={{ display: { md: 'none' } }}>
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
    </Box>
  )
}

RequestInviteCarouselButton.propTypes = {
  classes: PropTypes.object,
}
export default RequestInviteCarouselButton
