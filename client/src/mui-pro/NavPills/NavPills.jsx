import React from 'react'
// nod library that concatenates classes
import classNames from 'classnames'
// nod library to set properties for components
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'

// material-ui components
import { makeStyles } from '@mui/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

// core components
import GridContainer from 'mui-pro/Grid/GridContainer'
import GridItem from 'mui-pro/Grid/GridItem'

import styles from 'assets/jss/material-dashboard-pro-react/components/navPillsStyle'

const useStyles = makeStyles(styles)

export default function NavPills(props) {
  const [active, setActive] = React.useState(props.active)
  const handleChange = (event, active) => {
    setActive(active)
  }
  const handleChangeIndex = (index) => {
    setActive(index)
  }
  const classes = useStyles()
  const {
    tabs, direction, color, horizontal, alignCenter,
  } = props
  const flexContainerClasses = classNames({
    [classes.flexContainer]: true,
    [classes.horizontalDisplay]: horizontal !== undefined,
  })
  const tabButtons = (
    <Tabs
      classes={{
        root: classes.root,
        fixed: classes.fixed,
        flexContainer: flexContainerClasses,
        indicator: classes.displayNone,
      }}
      value={active}
      onChange={handleChange}
      centered={alignCenter}
    >
      {tabs.map((prop, key) => {
        const icon = {}
        if (prop.tabIcon !== undefined) {
          icon.icon = <prop.tabIcon className={classes.tabIcon} />
        }
        const pillsClasses = classNames({
          [classes.pills]: true,
          [classes.horizontalPills]: horizontal !== undefined,
          [classes.pillsWithIcons]: prop.tabIcon !== undefined,
        })
        return (
          <Tab
            label={prop.tabButton}
            key={key}
            {...icon}
            classes={{
              root: pillsClasses,
              selected: classes[color],
            }}
          />
        )
      })}
    </Tabs>
  )
  const tabContent = (
    <div className={classes.contentWrapper}>
      <SwipeableViews
        axis={direction === 'rtl' ? 'x-reverse' : 'x'}
        index={active}
        onChangeIndex={handleChangeIndex}
        style={{ overflowY: 'hidden' }}
      >
        {tabs.map((prop, key) => (
          <div className={classes.tabContent} key={key}>
            {prop.tabContent}
          </div>
        ))}
      </SwipeableViews>
    </div>
  )
  return horizontal !== undefined ? (
    <GridContainer>
      <GridItem {...horizontal.tabsGrid}>{tabButtons}</GridItem>
      <GridItem {...horizontal.contentGrid}>{tabContent}</GridItem>
    </GridContainer>
  ) : (
    <div>
      {tabButtons}
      {tabContent}
    </div>
  )
}

NavPills.defaultProps = {
  active: 0,
  color: 'primary',
}

NavPills.propTypes = {
  // index of the default active pill
  active: PropTypes.number,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      tabButton: PropTypes.string,
      tabIcon: PropTypes.object,
      tabContent: PropTypes.node,
    })
  ).isRequired,
  color: PropTypes.oneOf([
    'primary',
    'warning',
    'danger',
    'success',
    'info',
    'rose',
  ]),
  direction: PropTypes.string,
  horizontal: PropTypes.shape({
    tabsGrid: PropTypes.object,
    contentGrid: PropTypes.object,
  }),
  alignCenter: PropTypes.bool,
}
