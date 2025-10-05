import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
// import { Manager, Target, Popper } from "react-popper";

// MUI components
import { makeStyles } from '@mui/styles'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Paper from '@mui/material/Paper'
import Grow from '@mui/material/Grow'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Popper from '@mui/material/Popper'
import Divider from '@mui/material/Divider'

// @material-ui/icons
import Person from '@mui/icons-material/Person'
import Notifications from '@mui/icons-material/Notifications'
import Dashboard from '@mui/icons-material/Dashboard'
import Search from '@mui/icons-material/Search'

// core components
import CustomInput from 'mui-pro/CustomInput/CustomInput'
import Button from 'mui-pro/CustomButtons/Button'

import styles from 'assets/jss/material-dashboard-pro-react/components/adminNavbarLinksStyle'

const useStyles = makeStyles(styles)

export default function HeaderLinks(props) {
  const [openNotification, setOpenNotification] = React.useState(null)
  const handleClickNotification = (event) => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null)
    } else {
      setOpenNotification(event.currentTarget)
    }
  }
  const handleCloseNotification = () => {
    setOpenNotification(null)
  }
  const [openProfile, setOpenProfile] = React.useState(null)
  const handleClickProfile = (event) => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null)
    } else {
      setOpenProfile(event.currentTarget)
    }
  }
  const handleCloseProfile = () => {
    setOpenProfile(null)
  }
  const classes = useStyles()
  const { rtlActive } = props
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const searchButton =
    `${classes.top
    } ${
      classes.searchButton
    } ${
      classNames({
        [classes.searchRTL]: rtlActive,
      })}`
  const dropdownItem = classNames(classes.dropdownItem, classes.primaryHover, {
    [classes.dropdownItemRTL]: rtlActive,
  })
  const wrapper = classNames({
    [classes.wrapperRTL]: rtlActive,
  })
  const managerClasses = classNames({
    [classes.managerClasses]: true,
  })
  return (
    <div className={wrapper}>
      <CustomInput
        rtlActive={rtlActive}
        formControlProps={{
          className: `${classes.top} ${classes.search}`,
        }}
        inputProps={{
          placeholder: rtlActive ? 'بحث' : 'Search',
          inputProps: {
            'aria-label': rtlActive ? 'بحث' : 'Search',
            className: classes.searchInput,
          },
        }}
      />
      <Button
        color="white"
        aria-label="edit"
        justIcon
        round
        className={searchButton}
      >
        <Search className={`${classes.headerLinksSvg} ${classes.searchIcon}`} />
      </Button>
      <Button
        color="transparent"
        simple
        aria-label="Dashboard"
        justIcon
        className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
        muiClasses={{
          label: rtlActive ? classes.labelRTL : '',
        }}
      >
        <Dashboard
          className={
            `${classes.headerLinksSvg
            } ${
              rtlActive ? `${classes.links} ${classes.linksRTL}` : classes.links}`
          }
        />
        {!isMdUp && (
          <span className={classes.linkText}>
            {rtlActive ? 'لوحة القيادة' : 'Dashboard'}
          </span>
        )}
      </Button>
      <div className={managerClasses}>
        <Button
          color="transparent"
          justIcon
          aria-label="Notifications"
          aria-owns={openNotification ? 'notification-menu-list' : null}
          aria-haspopup="true"
          onClick={handleClickNotification}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : '',
          }}
        >
          <Notifications
            className={
              `${classes.headerLinksSvg
              } ${
                rtlActive ?
                  `${classes.links} ${classes.linksRTL}` :
                  classes.links}`
            }
          />
          <span className={classes.notifications}>5</span>
          {!isMdUp && (
            <span
              onClick={handleClickNotification}
              className={classes.linkText}
            >
              {rtlActive ? 'إعلام' : 'Notification'}
            </span>
          )}
        </Button>
        <Popper
          open={Boolean(openNotification)}
          anchorEl={openNotification}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openNotification,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="notification-menu-list"
              style={{ transformOrigin: '0 0 0' }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseNotification}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ?
                        'إجلاء أوزار الأسيوي حين بل, كما' :
                        'Mike John responded to your email'}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ?
                        'شعار إعلان الأرضية قد ذلك' :
                        'You have 5 new tasks'}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ?
                        'ثمّة الخاصّة و على. مع جيما' :
                        "You're now friend with Andrew"}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ? 'قد علاقة' : 'Another Notification'}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNotification}
                      className={dropdownItem}
                    >
                      {rtlActive ? 'قد فاتّبع' : 'Another One'}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

      <div className={managerClasses}>
        <Button
          color="transparent"
          aria-label="Person"
          justIcon
          aria-owns={openProfile ? 'profile-menu-list' : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={rtlActive ? classes.buttonLinkRTL : classes.buttonLink}
          muiClasses={{
            label: rtlActive ? classes.labelRTL : '',
          }}
        >
          <Person
            className={
              `${classes.headerLinksSvg
              } ${
                rtlActive ?
                  `${classes.links} ${classes.linksRTL}` :
                  classes.links}`
            }
          />
          {!isMdUp && (
            <span onClick={handleClickProfile} className={classes.linkText}>
              {rtlActive ? 'الملف الشخصي' : 'Profile'}
            </span>
          )}
        </Button>
        <Popper
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          placement="bottom"
          className={classNames({
            [classes.popperClose]: !openProfile,
            [classes.popperResponsive]: true,
            [classes.popperNav]: true,
          })}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list"
              style={{ transformOrigin: '0 0 0' }}
            >
              <Paper className={classes.dropdown}>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={dropdownItem}
                    >
                      {rtlActive ? 'الملف الشخصي' : 'Profile'}
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={dropdownItem}
                    >
                      {rtlActive ? 'الإعدادات' : 'Settings'}
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={dropdownItem}
                    >
                      {rtlActive ? 'الخروج' : 'Log out'}
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  )
}

HeaderLinks.propTypes = {
  rtlActive: PropTypes.bool,
}
