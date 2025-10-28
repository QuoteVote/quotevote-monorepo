import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import Box from '@material-ui/core/Box'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import GitHubIcon from '@material-ui/icons/GitHub'
import ChatIcon from '@material-ui/icons/Chat'
import Dialog from '@material-ui/core/Dialog'
import Avatar from '@material-ui/core/Avatar'
import { NavLink, useHistory } from 'react-router-dom'
import { useApolloClient } from '@apollo/react-hooks'

import AvatarPreview from '../Avatar'
import NotificationMenu from '../Notifications/NotificationMenu'
import SettingsMenu from '../Settings/SettingsMenu'
import SubmitPost from '../SubmitPost/SubmitPost'
import ChatMenu from '../Chat/ChatMenu'
import { SET_SELECTED_PAGE } from 'store/ui'
import { useMobileDetection } from '../../utils/display'

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderBottom: '2px solid transparent',
    borderImage: 'linear-gradient(90deg, #2AE6B2, #27C4E1, #178BE1) 1',
  },
  toolbar: {
    minHeight: 64,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 3),
    [theme.breakpoints.down('sm')]: {
      minHeight: 56,
      padding: theme.spacing(0, 2),
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.9,
    },
  },
  logoImage: {
    height: 28,
    width: 28,
  },
  brandText: {
    marginLeft: theme.spacing(1),
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#0A2342',
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      fontSize: '1rem',
    },
  },
  primaryButton: {
    background: 'linear-gradient(90deg, #2AE6B2, #27C4E1)',
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
    padding: theme.spacing(1, 3),
    transition: 'all 0.2s',
    '&:hover': {
      background: 'linear-gradient(90deg, #27C4E1, #178BE1)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(42, 230, 178, 0.3)',
    },
  },
  outlinedButton: {
    border: '2px solid #2AE6B2',
    color: '#0A2342',
    fontWeight: 600,
    textTransform: 'none',
    padding: theme.spacing(1, 3),
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(14, 17, 22, 0.06)',
      transform: 'translateY(-1px)',
      border: '2px solid #2AE6B2',
    },
  },
  textButton: {
    color: '#20b087ff',
    fontWeight: 500,
    textTransform: 'none',
    padding: theme.spacing(1, 2),
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(14, 17, 22, 0.06)',
      transform: 'translateY(-1px)',
    },
  },
  iconButton: {
    color: '#0A2342',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#2AE6B2',
      transform: 'scale(1.1)',
    },
  },
  chatButton: {
    color: '#0A2342',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#2AE6B2',
      transform: 'scale(1.1)',
    },
  },
  drawer: {
    width: 320,
  },
  drawerPaper: {
    width: 320,
    padding: theme.spacing(2.5),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  drawerTitle: {
    fontWeight: 700,
    color: '#0A2342',
  },
  divider: {
    height: 2,
    background: 'linear-gradient(90deg, #2AE6B2, #27C4E1, #178BE1)',
    margin: theme.spacing(2, 0),
  },
  drawerButton: {
    width: '100%',
    justifyContent: 'flex-start',
    textTransform: 'none',
    padding: theme.spacing(1.5, 2.5),
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateX(4px)',
    },
  },
  drawerPrimaryButton: {
    background: 'linear-gradient(90deg, #2AE6B2, #27C4E1)',
    color: '#ffffff',
    fontWeight: 600,
    '&:hover': {
      background: 'linear-gradient(90deg, #27C4E1, #178BE1)',
      boxShadow: '0 4px 12px rgba(42, 230, 178, 0.3)',
    },
  },
  drawerOutlinedButton: {
    border: '2px solid #2AE6B2',
    color: '#0A2342',
    fontWeight: 600,
    '&:hover': {
      background: 'rgba(14, 17, 22, 0.06)',
      border: '2px solid #2AE6B2',
    },
  },
  drawerTextButton: {
    color: '#0A2342',
    fontWeight: 500,
    '&:hover': {
      background: 'rgba(14, 17, 22, 0.06)',
    },
  },
  desktopActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  profileButton: {
    textTransform: 'none',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(3),
    '&:hover': {
      background: 'rgba(14, 17, 22, 0.06)',
    },
  },
  profileName: {
    marginLeft: theme.spacing(1),
    color: '#0A2342',
    fontWeight: 600,
  },
  loggedInActions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  createQuoteButton: {
    background: '#52b274',
    color: '#ffffff',
    fontWeight: 600,
    textTransform: 'none',
    minWidth: 150,
    '&:hover': {
      background: '#459963',
    },
  },
}))

function MainNavBar(props) {
  const { onChatToggle } = props
  const classes = useStyles()
  const avatar = useSelector((state) => state.user.data.avatar)
  const name = useSelector((state) => state.user.data.name)
  const loggedIn = useSelector((state) => !!state.user.data._id)
  const [open, setOpen] = React.useState(false)
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const dispatch = useDispatch()
  const client = useApolloClient()
  const history = useHistory()
  const isMobile = useMobileDetection()

  const handleMenu = (newSelectedMenu) => {
    client.stop()
    dispatch(SET_SELECTED_PAGE(newSelectedMenu))
  }

  const handleProfileClick = () => {
    dispatch(SET_SELECTED_PAGE(null))
  }

  const handleQuoteVote = () => {
    dispatch(SET_SELECTED_PAGE(0))
  }

  const toggleDrawer = () => setDrawerOpen((prev) => !prev)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          {/* Logo */}
          <NavLink to="/search" onClick={handleQuoteVote} className={classes.logo}>
            <img
              src="/icons/android-chrome-192x192.png"
              alt="Quote.Vote"
              className={classes.logoImage}
              crossOrigin="anonymous"
            />
            {/* <Typography variant="h6" className={classes.brandText}>
              QUOTE.VOTE
            </Typography> */}
          </NavLink>

          {/* Desktop Actions - Not Logged In */}
          {!loggedIn && (
            <Hidden smDown>
              <Box className={classes.desktopActions}>
                <Button
                  href="mailto:admin@quote.vote"
                  target="_blank"
                  className={classes.textButton}
                >
                  Donate
                </Button>
                <Button
                  href="mailto:admin@quote.vote"
                  target="_blank"
                  className={classes.textButton}
                >
                  Volunteer
                </Button>
                <IconButton
                  href="https://github.com/QuoteVote/quotevote-monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={classes.iconButton}
                >
                  <GitHubIcon />
                </IconButton>

                <Button
                  className={classes.primaryButton}
                  onClick={() => history.push('/auth/request-access')}
                >
                  Request Invite
                </Button>
                <Button
                  className={classes.outlinedButton}
                  onClick={() => history.push('/auth/login')}
                >
                  Login
                </Button>

              </Box>
            </Hidden>
          )}

          {/* Desktop Actions - Logged In */}
          {loggedIn && (
            <Hidden smDown>
              <Box className={classes.desktopActions}>
                <Button
                  className={classes.createQuoteButton}
                  onClick={() => {
                    handleMenu(2)
                    setOpen(true)
                  }}
                >
                  Create Quote
                </Button>
                <IconButton
                  onClick={onChatToggle}
                  aria-label="Open chat"
                  className={classes.chatButton}
                >
                  <ChatIcon />
                </IconButton>
                <IconButton
                  href="https://github.com/QuoteVote/quotevote-monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className={classes.iconButton}
                >
                  <GitHubIcon />
                </IconButton>
                <NavLink to="/Profile" style={{ textDecoration: 'none' }}>
                  <Button className={classes.profileButton} onClick={handleProfileClick}>
                    <Avatar>
                      <AvatarPreview height="40" width="40" {...avatar} />
                    </Avatar>
                    <Typography variant="body1" className={classes.profileName}>
                      {name}
                    </Typography>
                  </Button>
                </NavLink>
                <Box className={classes.loggedInActions}>
                  <ChatMenu fontSize="large" />
                  <NotificationMenu fontSize="large" />
                  <SettingsMenu fontSize="large" />
                </Box>
              </Box>
            </Hidden>
          )}

          {/* Mobile Hamburger */}
          <Hidden mdUp>
            <IconButton
              edge="end"
              aria-label="Open menu"
              onClick={toggleDrawer}
            >
              <MenuIcon style={{ color: '#0A2342' }} />
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        classes={{ paper: classes.drawerPaper }}
      >
        <Box className={classes.drawerHeader}>
          <Typography variant="h6" className={classes.drawerTitle}>
            Menu
          </Typography>
          <IconButton onClick={closeDrawer} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider className={classes.divider} />

        {!loggedIn ? (
          <List>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerPrimaryButton}`}
                onClick={() => {
                  history.push('/auth/request-access')
                  closeDrawer()
                }}
              >
                Request Invite
              </Button>
            </ListItem>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerOutlinedButton}`}
                onClick={() => {
                  history.push('/auth/login')
                  closeDrawer()
                }}
              >
                Login
              </Button>
            </ListItem>

            <Divider className={classes.divider} />

            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                href="mailto:admin@quote.vote"
                target="_blank"
                onClick={closeDrawer}
              >
                Donate
              </Button>
            </ListItem>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                href="mailto:admin@quote.vote"
                target="_blank"
                onClick={closeDrawer}
              >
                Volunteer
              </Button>
            </ListItem>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                href="https://github.com/QuoteVote/quotevote-monorepo"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<GitHubIcon />}
                onClick={closeDrawer}
              >
                GitHub Repository
              </Button>
            </ListItem>
          </List>
        ) : (
          <List>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerPrimaryButton}`}
                onClick={() => {
                  handleMenu(2)
                  setOpen(true)
                  closeDrawer()
                }}
              >
                Create Quote
              </Button>
            </ListItem>

            <Divider className={classes.divider} />

            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                onClick={() => {
                  onChatToggle()
                  closeDrawer()
                }}
                startIcon={<ChatIcon />}
              >
                Chat
              </Button>
            </ListItem>
            <ListItem disableGutters>
              <NavLink to="/Profile" style={{ width: '100%', textDecoration: 'none' }}>
                <Button
                  className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                  onClick={() => {
                    handleProfileClick()
                    closeDrawer()
                  }}
                  startIcon={
                    <Avatar>
                      <AvatarPreview height="35" width="35" {...avatar} />
                    </Avatar>
                  }
                >
                  {name}
                </Button>
              </NavLink>
            </ListItem>
            <ListItem disableGutters>
              <Button
                className={`${classes.drawerButton} ${classes.drawerTextButton}`}
                href="https://github.com/QuoteVote/quotevote-monorepo"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<GitHubIcon />}
                onClick={closeDrawer}
              >
                GitHub Repository
              </Button>
            </ListItem>
          </List>
        )}
      </Drawer>

      {/* Create Quote Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <SubmitPost setOpen={setOpen} />
      </Dialog>
    </>
  )
}

MainNavBar.propTypes = {
  classes: PropTypes.object,
  onChatToggle: PropTypes.func,
}

export default MainNavBar