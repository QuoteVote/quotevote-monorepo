import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { NavLink, useLocation } from 'react-router-dom'

// MUI core components
import { makeStyles } from '@mui/styles'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Hidden from '@mui/material/Hidden'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

// MUI icons
import Menu from '@mui/icons-material/Menu'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Fingerprint from '@mui/icons-material/Fingerprint'
import LockOpen from '@mui/icons-material/LockOpen'

// core components
import Button from 'mui-pro/CustomButtons/Button'

import styles from 'assets/jss/material-dashboard-pro-react/components/authNavbarStyle'

// Logo color palette
const BRAND_COLORS = {
  teal: '#2AE6B2',
  aqua: '#27C4E1', 
  cyan: '#178BE1',
  navy: '#0A2342',
  overlay: 'rgba(14, 17, 22, 0.06)'
}

import theme from '../../themes/MainTheme'
const useStyles = makeStyles((theme) => ({
  ...styles,
  // Enhanced styles with brand colors
  appBar: {
    backgroundColor: '#ffffff',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    borderBottom: `2px solid transparent`,
    borderImage: `linear-gradient(90deg, ${BRAND_COLORS.teal}, ${BRAND_COLORS.aqua}, ${BRAND_COLORS.cyan}) 1`,
    backdropFilter: 'blur(10px)',
  },
  container: {
    minHeight: 70,
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0, 2),
    },
  },
  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  logo: {
    height: 32,
    width: 'auto',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  brandText: {
    fontWeight: 600,
    color: BRAND_COLORS.navy,
    fontSize: '1.25rem',
  },
  navList: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    margin: 0,
    padding: 0,
  },
  listItem: {
    width: 'auto',
    padding: 0,
    margin: 0,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    textDecoration: 'none',
    color: BRAND_COLORS.navy,
    transition: 'all 0.3s ease',
    fontWeight: 500,
    fontSize: '0.9rem',
    position: 'relative',
    overflow: 'hidden',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      width: 0,
      height: 2,
      background: `linear-gradient(90deg, ${BRAND_COLORS.teal}, ${BRAND_COLORS.aqua})`,
      transition: 'all 0.3s ease',
      transform: 'translateX(-50%)',
      borderRadius: 2,
    },
    '&:hover': {
      backgroundColor: BRAND_COLORS.overlay,
      color: BRAND_COLORS.cyan,
      transform: 'translateY(-1px)',
      '&:after': {
        width: '80%',
      },
    },
  },
  navLinkActive: {
    background: `linear-gradient(135deg, ${BRAND_COLORS.teal}, ${BRAND_COLORS.aqua})`,
    color: 'white',
    '&:hover': {
      background: `linear-gradient(135deg, ${BRAND_COLORS.aqua}, ${BRAND_COLORS.cyan})`,
      color: 'white',
      '&:after': {
        display: 'none',
      },
    },
  },
  listItemIcon: {
    minWidth: 'auto',
    marginRight: theme.spacing(1),
    color: 'inherit',
  },
  listItemText: {
    margin: 0,
    fontWeight: 'inherit',
    color: 'inherit',
  },
  // Mobile menu enhancements
  drawerPaper: {
    width: 280,
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  },
  mobileMenuButton: {
    color: BRAND_COLORS.navy,
    padding: theme.spacing(1),
    borderRadius: 6,
    border: `1px solid ${BRAND_COLORS.teal}`,
    '&:hover': {
      backgroundColor: BRAND_COLORS.overlay,
      borderColor: BRAND_COLORS.aqua,
    },
  },
  mobileBrand: {
    padding: theme.spacing(2),
    borderBottom: `2px solid transparent`,
    borderImage: `linear-gradient(90deg, ${BRAND_COLORS.teal}, ${BRAND_COLORS.aqua}) 1`,
    textAlign: 'center',
  },
}))

export default function AuthNavbar(props) {
  const [open, setOpen] = React.useState(false)
  const location = useLocation()
  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const activeRoute = (routeName) => location.pathname.includes(routeName)
  
  const classes = useStyles()
  const { color, brandText } = props
  
  const appBarClasses = cx({
    [` ${classes[color]}`]: color,
  })

  const navigationItems = [
    {
      name: 'Register',
      href: '/auth/register-page',
      icon: PersonAdd,
      showInMobile: true
    },
    {
      name: 'Login',
      href: '/auth/login',
      icon: Fingerprint,
      showInMobile: true
    },
    {
      name: 'Lock',
      href: '/auth/lock-screen-page',
      icon: LockOpen,
      showInMobile: true
    },
  ]

  // Desktop navigation list
  const desktopList = (
    <List className={classes.navList}>
      {navigationItems.map((item) => (
        <ListItem key={item.name} className={classes.listItem}>
          <NavLink
            to={item.href}
            className={cx(classes.navLink, {
              [classes.navLinkActive]: activeRoute(item.href),
            })}
          >
            <item.icon className={classes.listItemIcon} />
            <ListItemText
              primary={item.name}
              disableTypography
              className={classes.listItemText}
            />
          </NavLink>
        </ListItem>
      ))}
    </List>
  )

  // Mobile navigation list
  const mobileList = (
    <List>
      {/* Brand header in mobile menu */}
      <ListItem className={classes.mobileBrand}>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
          <img
            alt="QuoteVote"
            src="/icons/android-chrome-192x192.png"
            className={classes.logo}
            style={{ marginRight: 12 }}
          />
          <Typography variant="h6" className={classes.brandText}>
            {brandText || 'QuoteVote'}
          </Typography>
        </Box>
      </ListItem>
      
      <Divider style={{ background: `linear-gradient(90deg, ${BRAND_COLORS.teal}, ${BRAND_COLORS.aqua})`, height: 2 }} />
      
      {navigationItems.map((item) => (
        <ListItem 
          key={item.name} 
          button 
          component={NavLink}
          to={item.href}
          onClick={handleDrawerToggle}
          className={cx(classes.navLink, {
            [classes.navLinkActive]: activeRoute(item.href),
          })}
          style={{ 
            margin: '4px 8px', 
            borderRadius: 8,
            display: item.showInMobile ? 'flex' : 'none'
          }}
        >
          <ListItemIcon>
            <item.icon className={classes.listItemIcon} />
          </ListItemIcon>
          <ListItemText
            primary={item.name}
            disableTypography
            className={classes.listItemText}
          />
        </ListItem>
      ))}
    </List>
  )

  return (
    <AppBar position="static" className={classes.appBar + appBarClasses}>
      <Toolbar className={classes.container}>
        {/* Brand Section */}
        <Hidden smDown>
          <div className={classes.brandSection}>
            <NavLink to="/">
              <img
                alt="QuoteVote"
                src="/icons/android-chrome-192x192.png"
                className={classes.logo}
              />
            </NavLink>
            <Button href="#" className={classes.title} color="transparent">
              <Typography variant="h6" className={classes.brandText}>
                {brandText}
              </Typography>
            </Button>
          </div>
        </Hidden>
        
        <Hidden mdUp>
          <div className={classes.brandSection}>
            <Button href="#" className={classes.title} color="transparent">
              <Typography variant="h6" className={classes.brandText}>
                QuoteVote
              </Typography>
            </Button>
          </div>
        </Hidden>

        {/* Desktop Navigation */}
        <Hidden smDown>
          <Box display="flex" alignItems="center" flexGrow={1} justifyContent="flex-end">
            {desktopList}
          </Box>
        </Hidden>

        {/* Mobile Menu Button */}
        <Hidden mdUp>
          <Button
            className={classes.mobileMenuButton}
            color="transparent"
            justIcon
            aria-label="open drawer"
            onClick={handleDrawerToggle}
          >
            <Menu />
          </Button>
        </Hidden>

        {/* Mobile Drawer */}
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="right"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {mobileList}
          </Drawer>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

AuthNavbar.propTypes = {
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  brandText: PropTypes.string,
}