import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'
// @material-ui/core components
import { makeStyles } from '@mui/styles'
// @material-ui/icons
// core components

import styles from 'assets/jss/material-dashboard-pro-react/components/cardAvatarStyle'

const useStyles = makeStyles(styles)

export default function CardAvatar(props) {
  const classes = useStyles()
  const {
    children,
    className,
    plain,
    profile,
    testimonial,
    testimonialFooter,
    ...rest
  } = props
  const cardAvatarClasses = classNames({
    [classes.cardAvatar]: true,
    [classes.cardAvatarProfile]: profile,
    [classes.cardAvatarPlain]: plain,
    [classes.cardAvatarTestimonial]: testimonial,
    [classes.cardAvatarTestimonialFooter]: testimonialFooter,
    [className]: className !== undefined,
  })
  return (
    <div className={cardAvatarClasses} {...rest}>
      {children}
    </div>
  )
}

CardAvatar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool,
  testimonial: PropTypes.bool,
  testimonialFooter: PropTypes.bool,
}
