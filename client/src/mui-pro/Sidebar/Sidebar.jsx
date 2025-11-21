import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { NavLink, withRouter } from 'react-router-dom'
import cx from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import sidebarStyle from 'assets/jss/material-dashboard-pro-react/components/sidebarStyle'
import { SET_SELECTED_PAGE } from '../../store/ui'
import NotificationMenu from '../../components/Notifications/NotificationMenu'
import SettingsMenu from '../../components/Settings/SettingsMenu'
import Button from '@material-ui/core/Button'
import ChatMenu from '../../components/Chat/ChatMenu'
import AddIcon from '@material-ui/icons/Add'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import SubmitPost from '../../components/SubmitPost/SubmitPost'
import Avatar from '@material-ui/core/Avatar'
import AvatarPreview from '../../components/Avatar'
import Typography from '@material-ui/core/Typography'
import { useSelector } from 'react-redux'
import Hidden from '@material-ui/core/Hidden'
import { useMobileDetection } from '../../utils/display'

// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.

function SidebarWrapper(props) {
  const { className, user, headerLinks, links } = props
  return (
    <Grid container direction="row">
      <div className={className}>
        {user}
        {headerLinks}
        {links}
      </div>
    </Grid>
  )
}

const MenuSidebar = (props) => {
  const {
    classes,
    routes,
    bgColor,
    rtlActive,
    currentRoute,
    open,
    handleDrawerToggle,
    dispatch,
    history,
    miniActive: propsMiniActive,
    color,
  } = props

  const theme = useTheme()

  // Get user data from Redux like MainNavBar
  const avatar = useSelector((state) => state.user.data.avatar)
  const name = useSelector((state) => state.user.data.name)
  const loggedIn = useSelector((state) => !!state.user.data._id)
  const isMobile = useMobileDetection()

  // State management
  const [openAvatar, setOpenAvatar] = useState(false)
  const [miniActive, setMiniActive] = useState(true)
  const [MessageDisplay, setMessageDisplay] = useState(null)
  const [collapseStates, setCollapseStates] = useState({})
  const [openCreateQuote, setOpenCreateQuote] = useState(false)

  // Initialize collapse states on mount
  useEffect(() => {
    setCollapseStates(getCollapseStates(routes))
  }, [routes])

  // Helper functions
  const getCollapseStates = (routes) => {
    let initialState = {}
    routes.forEach((prop) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        }
      }
    })
    return initialState
  }

  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularFormsx - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true
      }
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true
      }
    }
    return false
  }

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) =>
    window.location.href.indexOf(routeName) > -1 ? 'active' : ''

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createGuestLinks = () => {
    return [
      <ListItem key="logo">
        <NavLink to="/" style={{ display: 'inline-block', width: '100%' }}>
          <img
            src="/icons/android-chrome-192x192.png"
            alt="QuoteVote Logo"
            style={{ height: '30px', width: 'auto', cursor: 'pointer' }}
          />
        </NavLink>
      </ListItem>,
      <ListItem key="donate" style={{ padding: '4px 8px' }}>
        <a
          href="mailto:admin@quote.vote"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🤲</span>
          <span>Donate</span>
        </a>
      </ListItem>,
      <ListItem key="volunteer" style={{ padding: '4px 8px' }}>
        <a
          href="mailto:admin@quote.vote"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>🫱</span>
          <span>Volunteer</span>
        </a>
      </ListItem>,
      <ListItem key="github" style={{ padding: '4px 8px' }}>
        <a
          href="https://github.com/QuoteVote/quotevote-monorepo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          style={{
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <i
            className="fab fa-github"
            style={{ fontSize: 16, marginRight: '8px' }}
          />
          <span>GitHub</span>
        </a>
      </ListItem>,
      <ListItem key="request-invite" style={{ padding: '4px 8px' }}>
        <NavLink
          to="/auth/request-access"
          onClick={() => handleDrawerToggle(false)}
          style={{
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>💌</span>
          <span>Request Invite</span>
        </NavLink>
      </ListItem>,
      <ListItem key="login" style={{ padding: '4px 8px' }}>
        <NavLink
          to="/auth/login"
          onClick={() => handleDrawerToggle(false)}
          style={{
            color: 'inherit',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            padding: '8px 12px',
            fontSize: '14px',
          }}
        >
          <span style={{ fontSize: '16px', marginRight: '8px' }}>👤</span>
          <span>Login</span>
        </NavLink>
      </ListItem>,
    ]
  }

  const createLinks = (routes) => {
    const guestLinks = !loggedIn ? createGuestLinks() : []
    const routeLinks = loggedIn
      ? [
        // Profile Section
        <ListItem key="profile" style={{ padding: '8px 12px' }}>
          <NavLink
            to="/Profile"
            onClick={() => handleDrawerToggle(false)}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              width: '100%',
              display: 'block',
            }}
          >
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar style={{ height: 32, width: 32 }}>
                  <AvatarPreview height="32" width="32" {...avatar} />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography
                  variant="body2"
                  style={{ margin: 0, fontSize: '14px' }}
                >
                  {name || 'Profile'}
                </Typography>
              </Grid>
            </Grid>
          </NavLink>
        </ListItem>,
        // Divider
        <ListItem key="divider" style={{ padding: '4px 12px' }}>
          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          />
        </ListItem>,
        // Search
        <ListItem key="search" style={{ padding: '4px 8px' }}>
          <NavLink
            to="/search"
            onClick={() => handleDrawerToggle(false)}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              width: '100%',
              display: 'block',
              padding: '8px 12px',
              fontSize: '14px',
            }}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
            <span>Search</span>
          </NavLink>
        </ListItem>,

        // Profile (simplified)
        <ListItem key="profile-simple" style={{ padding: '4px 8px' }}>
          <NavLink
            to="/Profile"
            onClick={() => handleDrawerToggle(false)}
            style={{
              color: 'inherit',
              textDecoration: 'none',
              width: '100%',
              display: 'block',
              padding: '8px 12px',
              fontSize: '14px',
            }}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>👤</span>
            <span>Profile</span>
          </NavLink>
        </ListItem>,

        // GitHub
        <ListItem key="github" style={{ padding: '4px 8px' }}>
          <a
            href="https://github.com/QuoteVote/quotevote-monorepo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              width: '100%',
              display: 'block',
              padding: '8px 12px',
              fontSize: '14px',
            }}
          >
            <i
              className="fab fa-github"
              style={{ fontSize: 16, marginRight: '8px' }}
            />
            <span>GitHub</span>
          </a>
        </ListItem>,
        // Divider before sign out
        <ListItem key="signout-divider" style={{ padding: '4px 12px' }}>
          <hr
            style={{
              width: '100%',
              border: 'none',
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          />
        </ListItem>,
        // Sign Out
        <ListItem key="signout" style={{ padding: '4px 8px' }}>
          <Button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.reload()
              handleDrawerToggle(false)
            }}
            fullWidth
            style={{
              justifyContent: 'flex-start',
              padding: '8px 12px',
              fontSize: '14px',
              minHeight: 'auto',
              color: '#f44336',
              textTransform: 'none',
            }}
          >
            <span style={{ fontSize: '16px', marginRight: '8px' }}>🚪</span>
            Sign Out
          </Button>
        </ListItem>,
      ]
      : []
    return [...guestLinks, ...routeLinks]
  }

  const links = <List className={classes.list}>{createLinks(routes)}</List>

  const guestLinks = <List className={classes.list}>{createGuestLinks()}</List>

  const drawerPaper = `${classes.drawerPaper} ${cx({
    [classes.drawerPaperMini]: propsMiniActive && miniActive,
    [classes.drawerPaperRTL]: rtlActive,
  })}`
  const sidebarWrapper = `${classes.sidebarWrapper} ${cx({
    [classes.drawerPaperMini]: propsMiniActive && miniActive,
    [classes.sidebarWrapperWithPerfectScrollbar]:
      navigator.platform.indexOf('Win') > -1,
  })}`

  const handleDrawerOpen = () => {
    handleDrawerToggle(true)
  }

  const handleLogoClick = (e) => {
    if (isMobile) {
      e.preventDefault()
      handleDrawerOpen()
    }
  }

  const handleVoxPop = () => {
    dispatch(SET_SELECTED_PAGE(0))
    history.push('/search')
  }

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Grid container alignItems="center" justifyContent="space-between">
            {/* Left: Only menu icon */}
            <Grid
              item
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                style={{ padding: 0 }}
              >
                <MenuIcon />
              </IconButton>
              <NavLink to="/" style={{ display: 'inline-block' }} onClick={handleLogoClick}>
                <img
                  src="/icons/android-chrome-192x192.png"
                  alt="QuoteVote Logo"
                  style={{ height: '30px', width: 'auto', cursor: 'pointer' }}
                />
              </NavLink>
            </Grid>

            {!loggedIn && (
              <Grid item style={{ display: 'flex', gap: 8 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => history.push('/auth/request-access')}
                  className={classes.rightMenuButton}
                  size="small"
                >
                  Request Invite
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => history.push('/auth/login')}
                  className={classes.rightMenuButton}
                  size="small"
                >
                  Login
                </Button>
              </Grid>
            )}

            {/* Right: Empty for guests, user menu for logged in */}

            {loggedIn && (
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Tooltip title="Create Quote">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenCreateQuote(true)}
                        size="small"
                        style={{ height: '30px', width: '30px' }}
                      >
                        <AddIcon />
                      </Button>
                    </Tooltip>
                  </Grid>
                  <Hidden smDown>
                    <Grid item>
                      <a
                        href="https://github.com/QuoteVote/quotevote-monorepo"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        style={{
                          color: theme.palette.text.primary,
                          textDecoration: 'none',
                          width: '100%',
                          display: 'block',
                          padding: '8px 12px',
                          fontSize: '18px',
                        }}
                      >
                        <i
                          className="fab fa-github"
                          style={{ fontSize: 28, marginRight: '8px', color: theme.palette.text.primary }}
                        />
                      </a>
                    </Grid>
                  </Hidden>
                  <Grid item>
                    <ChatMenu />
                  </Grid>
                  <Grid item>
                    <NotificationMenu />
                  </Grid>
                  <Grid item>
                    <SettingsMenu />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        anchor={rtlActive ? 'left' : 'right'}
        open={open}
        classes={{
          paper: `${drawerPaper} ${classes[bgColor + 'Background']}`,
        }}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        SlideProps={{
          direction: 'right',
        }}
      >
        <Grid container direction="row">
          <SidebarWrapper
            className={sidebarWrapper}
            MiniActive={MessageDisplay}
            links={loggedIn ? links : guestLinks}
            currentRoute={currentRoute}
            isLoggedIn={loggedIn}
          />
        </Grid>
      </Drawer>

      <Dialog
        open={openCreateQuote}
        onClose={() => setOpenCreateQuote(false)}
        fullScreen
      >
        <SubmitPost setOpen={setOpenCreateQuote} />
      </Dialog>
    </>
  )
}

MenuSidebar.defaultProps = {
  bgColor: 'blue',
}

MenuSidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(['white', 'black', 'blue']),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    'white',
    'red',
    'orange',
    'green',
    'blue',
    'purple',
    'rose',
  ]),
  routes: PropTypes.arrayOf(PropTypes.object),
  miniActive: PropTypes.bool,
  open: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  currentRoute: PropTypes.any,
}

SidebarWrapper.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  headerLinks: PropTypes.object,
  links: PropTypes.object,
}

export default withRouter(withStyles(sidebarStyle)(MenuSidebar))
