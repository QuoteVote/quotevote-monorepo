import React from 'react'
import PropTypes from 'prop-types'

// @mui/material components
import { makeStyles } from '@mui/material/styles'

import styles from 'assets/jss/material-dashboard-pro-react/components/typographyStyle'

const useStyles = makeStyles(styles)

export default function Warning(props) {
  const classes = useStyles()
  const { children } = props
  return (
    <div className={`${classes.defaultFontStyle} ${classes.warningText}`}>
      {children}
    </div>
  )
}

Warning.propTypes = {
  children: PropTypes.node,
}
