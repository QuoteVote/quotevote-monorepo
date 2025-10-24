import React from 'react'
import PropTypes from 'prop-types'
import { Grid, CircularProgress } from '@mui/material'

export default function LoadingSpinner({ size = 80, marginTop = '15px' }) {
  return (
    <Grid container justify="center" style={{ marginTop: { marginTop } }}>
      <CircularProgress color="secondary" size={size} />
    </Grid>
  )
}

LoadingSpinner.propTypes = {
  size: PropTypes.number.isRequired,
  marginTop: PropTypes.string,
}
