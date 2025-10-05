import React from 'react'
import PropTypes from 'prop-types'

// @material-ui/core components
import { makeStyles } from '@mui/styles'

import styles from 'assets/jss/material-dashboard-pro-react/components/infoStyle'

const useStyles = makeStyles(styles)

export default function InfoArea(props) {
  const classes = useStyles()
  const { title, description, iconColor } = props
  return (
    <div className={classes.infoArea}>
      <div className={`${classes.iconWrapper} ${classes[iconColor]}`}>
        <props.icon className={classes.icon} />
      </div>
      <div className={classes.descriptionWrapper}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.description}>{description}</p>
      </div>
    </div>
  )
}

InfoArea.defaultProps = {
  iconColor: 'gray',
}

InfoArea.propTypes = {
  icon: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  iconColor: PropTypes.oneOf([
    'primary',
    'warning',
    'danger',
    'success',
    'info',
    'rose',
    'gray',
  ]),
}
