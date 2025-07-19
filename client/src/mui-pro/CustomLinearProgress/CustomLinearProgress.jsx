import React from 'react'
import PropTypes from 'prop-types'

// @material-ui/core components
import { makeStyles } from '@mui/styles'
import LinearProgress from '@mui/material/LinearProgress'

import styles from 'assets/jss/material-dashboard-pro-react/components/customLinearProgressStyle'

const useStyles = makeStyles(styles)

export default function CustomLinearProgress(props) {
  const classes = useStyles()
  const { color, ...rest } = props
  return (
    <LinearProgress
      {...rest}
      classes={{
        root: `${classes.root} ${classes[`${color}Background`]}`,
        bar: `${classes.bar} ${classes[color]}`,
      }}
    />
  )
}

CustomLinearProgress.defaultProps = {
  color: 'gray',
}

CustomLinearProgress.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'warning',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
}
