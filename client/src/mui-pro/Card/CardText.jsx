import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import { makeStyles } from '@mui/styles'
// @material-ui/icons

// core components
import styles from 'assets/jss/material-dashboard-pro-react/components/cardTextStyle'

const useStyles = makeStyles(styles)

export default function CardText(props) {
  const classes = useStyles()
  const {
    className, children, color, ...rest
  } = props
  const cardTextClasses = classNames({
    [classes.cardText]: true,
    [classes[`${color}CardHeader`]]: color,
    [className]: className !== undefined,
  })
  return (
    <div className={cardTextClasses} {...rest}>
      {children}
    </div>
  )
}

CardText.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf([
    'warning',
    'success',
    'danger',
    'info',
    'primary',
    'rose',
  ]),
  children: PropTypes.node,
}
