import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import { IconButton, SvgIcon } from '@mui/material'
import PropTypes from 'prop-types'
import RichTooltip from '../Chat/RichToolTip'
import SettingsContent from './SettingsContent'
import MobileDrawer from '../Notifications/MobileDrawer'
import { useMobileDetection } from '../../utils/display'
import SettingsActiveSvg from '../../assets/svg/SettingsActive'
import SettingsSvg from '../../assets/svg/Settings'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  tipColor: {
    backgroundColor: '',
    backgroundImage: '',
  },
  drawerPaperStyle: {
    width: '100%',
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: {
      width: 400,
    },
    backgroundImage: 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)',
  },
  titleStyle: {
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
  },
  tooltipPopper: {
    marginTop: '-8px',
  },
}))

function SettingsMenu({ fontSize }) {
  const classes = useStyles()
  const isMobileDevice = useMobileDetection()
  const [open, setOpen] = React.useState(false)
  const tipColor = '#1BB5D8'
  const tipBackgroundImage = 'linear-gradient(224.94deg, #1BB5D8 1.63%, #4066EC 97.6%)'
  const [svgIcon, setSvgIcon] = useState(SettingsSvg)
  const [viewBox, setViewBox] = useState('0 0 49 46')

  const handleMouseEnter = () => {
    setSvgIcon(SettingsActiveSvg)
    setViewBox('0 0 49 60')
  }

  const handleMouseLeave = () => {
    setSvgIcon(SettingsSvg)
    setViewBox('0 0 49 46')
  }

  const handleToggle = () => {
    setOpen(!open)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const appBarStyle = {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  }

  const backButtonStyle = {
    color: '#ffffff',
  }

  // Desktop popover content
  const popoverContent = (
    <RichTooltip
      content={<SettingsContent setOpen={setOpen} />}
      open={open}
      placement="bottom-start"
      onClose={() => setOpen(false)}
      tipColor={tipColor}
      tipBackgroundImage={tipBackgroundImage}
      spacing={0}
      style={{ marginTop: '-8px' }}
    >
      <IconButton
        aria-label="Settings"
        color="inherit"
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SvgIcon
          component={svgIcon}
          fontSize={fontSize}
          viewBox={viewBox}
        />
      </IconButton>
    </RichTooltip>
  )

  return (
    <div className={classes.root}>
      {isMobileDevice ? (
        <>
          <IconButton
            aria-label="Settings"
            color="inherit"
            onClick={handleToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SvgIcon
              component={svgIcon}
              fontSize={fontSize}
              viewBox={viewBox}
            />
          </IconButton>
          <MobileDrawer
            open={open}
            onClose={handleClose}
            title="Settings"
            anchor="right"
            drawerPaperStyle={classes.drawerPaperStyle}
            appBarStyle={appBarStyle}
            titleStyle={classes.titleStyle}
            backButtonStyle={backButtonStyle}
          >
            <SettingsContent setOpen={setOpen} />
          </MobileDrawer>
        </>
      ) : (
        popoverContent
      )}
    </div>
  )
}

SettingsMenu.propTypes = {
  fontSize: PropTypes.any.isRequired,
}

export default SettingsMenu
