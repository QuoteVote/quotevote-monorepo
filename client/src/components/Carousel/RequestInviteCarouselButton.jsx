import React from 'react'
import Button from '@mui/material/Button'
import { useHistory } from 'react-router'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

function RequestInviteCarouselButton({ classes }) {
  const history = useHistory()
  const theme = useTheme()
  const showOnMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    showOnMobile && (
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
    )
  )
}

RequestInviteCarouselButton.propTypes = {
  classes: PropTypes.object,
}
export default RequestInviteCarouselButton
