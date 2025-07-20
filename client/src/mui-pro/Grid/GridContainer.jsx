import React from 'react'
// nodejs library to set properties for components
import PropTypes from 'prop-types'
// @mui/material components
import { makeStyles } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

const styles = {
  grid: {
    margin: '0 -15px',
    width: 'calc(100% + 30px)',
    // '&:before,&:after':{
    //   display: 'table',
    //   content: '" "',
    // },
    // '&:after':{
    //   clear: 'both',
    // }
  },
}

const useStyles = makeStyles(styles)

export default function GridContainer(props) {
  const classes = useStyles()
  const { children, className, ...rest } = props
  return (
    <Grid container {...rest} className={`${classes.grid} ${className}`}>
      {children}
    </Grid>
  )
}

GridContainer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
}
