import { Typography } from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar'
import Dialog from '@material-ui/core/Dialog'
import Grid from '@material-ui/core/Grid'
import withWidth from '@material-ui/core/withWidth'
import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory } from 'react-router-dom'

import { useApolloClient } from '@apollo/react-hooks'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import { SET_SELECTED_PAGE } from 'store/ui'
import AvatarPreview from '../Avatar'
import NotificationMenu from '../Notifications/NotificationMenu'
import SettingsMenu from '../Settings/SettingsMenu'
import SubmitPost from '../SubmitPost/SubmitPost'

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

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Grid container alignItems="center" wrap="nowrap" justifyContent="space-between">
        {/* Left: Logo */}
        <Grid item>
          <NavLink to="/search" onClick={handleQuoteVote}>
            <img
              alt="Quote"
              src="/icons/android-chrome-192x192.png"
              className={classes.quote}
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
                  href="https://donate.stripe.com/28E5kF6Egdaz9ZF6nhdfG00"
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
                  href="mailto:volunteer@quote.vote"
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
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: '#2ecc71', color: 'white' }}
                  onClick={() => {
                    handleMenu(2)
                    setOpen(true)
                  }}
                  className={classes.rightMenuButton}
                >
                  Create Quote
                </Button>
              </Grid>

              <Grid item>
                <Grid
                  container
                  direction="row"
                  justify="space-around"
                  alignItems="center"
                >
                  <Grid item>
                    <NavLink to="/profile">
                      <Hidden mdDown>
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
                      </Hidden>
                      <Hidden lgUp>
                        <Avatar height="35" width="35">
                          <AvatarPreview {...avatar} />
                        </Avatar>
                      </Hidden>
                    </NavLink>
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
