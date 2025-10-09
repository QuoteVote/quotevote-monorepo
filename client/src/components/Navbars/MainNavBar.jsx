import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import { NavLink, useHistory } from 'react-router-dom'
import { Tooltip, Typography } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import withWidth from 'utils/withWidth'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { SET_SELECTED_PAGE } from 'store/ui'
import { useApolloClient } from '@apollo/react-hooks'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import AvatarPreview from '../Avatar'
import NotificationMenu from '../Notifications/NotificationMenu'
import SettingsMenu from '../Settings/SettingsMenu'
import SubmitPost from '../SubmitPost/SubmitPost'
import ChatMenu from '../Chat/ChatMenu'

import { useMobileDetection } from '../../utils/display'

function MainNavBar(props) {
  const { classes, width } = props
  const selectedPage = useSelector((state) => state.ui.selectedPage)
  const avatar = useSelector((state) => state.user.data.avatar)
  const name = useSelector((state) => state.user.data.name)
  const [open, setOpen] = React.useState(false)
  const fontSize = width === 'md' ? 'medium' : 'large'
  const dispatch = useDispatch()
  const client = useApolloClient()
  const history = useHistory()
  const loggedIn = useSelector((state) => !!state.user.data._id)
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

  const isMobile = useMobileDetection()
  const theme = useTheme()
  const showOnLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const showOnLgDown = !showOnLgUp

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
        justifyContent="space-between"
      >
        {/* Left: Logo */}
        <Grid item>
          <NavLink to="/search" onClick={handleQuoteVote}>
            <img
              alt="Quote"
              src="/icons/android-chrome-192x192.png"
              style={{ height: '30px', marginLeft: 30, width: 'auto' }}
            />
          </NavLink>
        </Grid>
        {/* Center: Guest Action Buttons */}
        {!loggedIn && (
          <Grid item xs>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Button
                  variant="outlined"
                  color="inherit"
                  href="mailto:admin@quote.vote"
                  target="_blank"
                  className={classes.rightMenuButton}
                  style={{ borderWidth: 2, borderStyle: 'solid' }}
                >
                  Donate
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="inherit"
                  href="mailto:admin@quote.vote"
                  className={classes.rightMenuButton}
                  style={{ borderWidth: 2, borderStyle: 'solid' }}
                >
                  Volunteer
                </Button>
              </Grid>
              <Grid item>
                <Button
                  href="https://github.com/QuoteVote/quotevote-monorepo"
                  target="_blank"
                  className={classes.rightMenuButton}
                  aria-label="GitHub"
                >
                  <i className="fab fa-github" style={{ fontSize: 38 }} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {/* Right: Login and Create Quote */}
        {!loggedIn ? (
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginLeft: 8 }}
              onClick={() => history.push('/auth/request-access')}
              className={classes.rightMenuButton}
            >
              Request Invite
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => history.push('/auth/login')}
              className={classes.rightMenuButton}
            >
              Login
            </Button>
          </Grid>
        ) : (
          <>
            <Grid
              item
              style={{
                display: 'flex',
                direction: 'row',
                justifyContent: 'space-around',
                gap: 4,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  backgroundColor: '#52b274',
                  color: 'white',
                  minWidth: 150,
                }}
                onClick={() => {
                  handleMenu(2)
                  setOpen(true)
                }}
              >
                Create Quote
              </Button>

              <Tooltip title="Contribute">
                <a
                  href="https://github.com/QuoteVote/quotevote-monorepo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{
                    color: 'black',
                    textDecoration: 'none',
                    width: '100%',
                    display: 'block',
                    padding: '8px 12px',
                    fontSize: '18px',
                  }}
                >
                  <i
                    className="fab fa-github"
                    style={{ fontSize: 28, marginRight: '8px', color: 'black' }}
                  />
                </a>
              </Tooltip>
            </Grid>

            <Grid item>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <Grid item>
                  <NavLink to="/Profile">
                    {showOnLgUp && (
                      <Button
                        aria-label="Profile"
                        color="inherit"
                        onClick={handleProfileClick}
                        className={classes.avatarRoundedButton}
                      >
                        <Avatar>
                          <AvatarPreview height="50" width="50" {...avatar} />
                        </Avatar>
                        <Typography
                          variant="h6"
                          className={classes.profileBlockName}
                        >
                          {name}
                        </Typography>
                      </Button>
                    )}
                    {showOnLgDown && (
                      <Avatar height="35" width="35">
                        <AvatarPreview {...avatar} />
                      </Avatar>
                    )}
                  </NavLink>
                </Grid>
                <Grid item>
                  <ChatMenu fontSize={fontSize} />
                </Grid>
                <Grid item>
                  <NotificationMenu fontSize={fontSize} />
                </Grid>
                <Grid item>
                  <SettingsMenu fontSize={fontSize} />
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <SubmitPost setOpen={setOpen} />
      </Dialog>
    </AppBar>
  )
}

MainNavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
}

export default withWidth()(MainNavBar)
