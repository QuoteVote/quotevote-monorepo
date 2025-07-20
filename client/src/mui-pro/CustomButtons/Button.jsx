import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'

// material-ui components
import { makeStyles } from '@mui/material/styles'
import Button from '@mui/material/Button'

import styles from 'assets/jss/material-dashboard-pro-react/components/buttonStyle'

const useStyles = makeStyles(styles)

const RegularButton = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const {
    color,
    round,
    children,
    fullWidth,
    disabled,
    simple,
    size,
    block,
    link,
    justIcon,
    className,
    muiClasses,
    ...rest
  } = props
  const btnClasses = classNames({
    [classes.button]: true,
    [classes[size]]: size,
    [classes[color]]: color,
    [classes.round]: round,
    [classes.fullWidth]: fullWidth,
    [classes.disabled]: disabled,
    [classes.simple]: simple,
    [classes.block]: block,
    [classes.link]: link,
    [classes.justIcon]: justIcon,
    [className]: className,
  })
  return (
    <Button {...rest} ref={ref} classes={muiClasses} className={btnClasses}>
      {children}
    </Button>
  )
})

RegularButton.propTypes = {
  color: PropTypes.oneOf([
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'rose',
    'white',
    'twitter',
    'facebook',
    'google',
    'linkedin',
    'pinterest',
    'youtube',
    'tumblr',
    'github',
    'behance',
    'dribbble',
    'reddit',
    'transparent',
  ]),
  size: PropTypes.oneOf(['sm', 'lg']),
  simple: PropTypes.bool,
  round: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  link: PropTypes.bool,
  justIcon: PropTypes.bool,
  className: PropTypes.string,
  muiClasses: PropTypes.object,
  children: PropTypes.node,
}

export default RegularButton
