import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'
// @mui/material components
import { makeStyles } from '@mui/material/styles'
// @mui/icons-material

// core components
import styles from 'assets/jss/material-dashboard-pro-react/components/cardFooterStyle'

const useStyles = makeStyles(styles)

export default function CardFooter(props) {
  const classes = useStyles()
  const {
    className,
    children,
    plain,
    profile,
    pricing,
    testimonial,
    stats,
    chart,
    product,
    ...rest
  } = props
  const cardFooterClasses = classNames({
    [classes.cardFooter]: true,
    [classes.cardFooterPlain]: plain,
    [classes.cardFooterProfile]: profile || testimonial,
    [classes.cardFooterPricing]: pricing,
    [classes.cardFooterTestimonial]: testimonial,
    [classes.cardFooterStats]: stats,
    [classes.cardFooterChart]: chart || product,
    [className]: className !== undefined,
  })
  return (
    <div className={cardFooterClasses} {...rest}>
      {children}
    </div>
  )
}

CardFooter.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  pricing: PropTypes.bool,
  testimonial: PropTypes.bool,
  stats: PropTypes.bool,
  chart: PropTypes.bool,
  product: PropTypes.bool,
  children: PropTypes.node,
}
