import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

// @mui styles
import { makeStyles } from '@mui/styles'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

import styles from 'assets/jss/material-dashboard-pro-react/components/instructionStyle'

const useStyles = makeStyles(styles)

export default function Instruction(props) {
  const classes = useStyles()
  const {
    title, text, image, className, imageClassName, imageAlt,
  } = props
  const instructionClasses = cx({
    [classes.instruction]: true,
    [className]: className !== undefined,
  })
  const pictureClasses = cx({
    [classes.picture]: true,
    [imageClassName]: imageClassName !== undefined,
  })
  return (
    <div className={instructionClasses}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <strong>{title}</strong>
          <p>{text}</p>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <div className={pictureClasses}>
            <img src={image} alt={imageAlt} className={classes.image} />
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

Instruction.defaultProps = {
  imageAlt: '...',
}

Instruction.propTypes = {
  title: PropTypes.node.isRequired,
  text: PropTypes.node.isRequired,
  image: PropTypes.string.isRequired,
  imageAlt: PropTypes.string,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
}
