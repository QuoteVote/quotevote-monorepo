import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'
// @mui/material components
import { makeStyles } from '@mui/material/styles'
// @mui/icons-material

// core components
import styles from 'assets/jss/material-dashboard-pro-react/components/cardIconStyle'

const useStyles = makeStyles(styles)

export default function CardIcon(props) {
  const classes = useStyles()
  const {
    className, children, color, ...rest
  } = props
  const cardIconClasses = classNames({
    [classes.cardIcon]: true,
    [classes[`${color}CardHeader`]]: color,
    [className]: className !== undefined,
  })
  return (
    <div className={cardIconClasses} {...rest}>
      {children}
    </div>
  )
}

CardIcon.propTypes = {
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
