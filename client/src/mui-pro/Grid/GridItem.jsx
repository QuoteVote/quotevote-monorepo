import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @mui/material components
import { makeStyles } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

const styles = {
  grid: {
    padding: '0 15px !important',
  },
}

const useStyles = makeStyles(styles)

export default function GridItem(props) {
  const classes = useStyles()
  const { children, className, ...rest } = props
  const classNameDefined = className ? className : ''
  return (
    <Grid item {...rest} className={`${classes.grid} ${classNameDefined}`}>
      {children}
    </Grid>
  )
}

GridItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
