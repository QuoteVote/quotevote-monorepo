import PropTypes from 'prop-types'
// MUI
import { makeStyles } from '@mui/styles'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ThemeProvider } from '@mui/material'

//  Local
import mainTheme from '../../themes/MainTheme'

const useStyles = makeStyles((theme) => ({
  buttonPrimary: {
    color: theme.subHeader.followButton.color,
    backgroundColor: theme.subHeader.followButton.backgroundColor,
  },
  buttonSecondary: {
    color: theme.palette.primary,
    backgroundColor: theme.subHeader.followButton.backgroundColor,
  },
}))

export default NoFollowers

/**
  * Component to display when there are no followers
  @param {props} filter - Followers or Following
  @returns {JSX.element}
*/
function NoFollowers({ filter }) {
  const classes = useStyles()

  return (
    <ThemeProvider theme={mainTheme}>
      <Grid
        container
        className={classes.followDisplay}
        id="component-followers-display"
      >
        <Grid
          item
          container
          direction="column"
          className={classes.followDisplayWrapper}
          align="center"
          xs={12}
          md={8}
          id="component-banner"
        >
          <div id="component-empty-follow-verbiage">
            {
              filter === 'following' ? (
                <Typography variant="p">
                  Here you are going to see people that you like their ideas.  You could search for new people to follow or find some friends.
                </Typography>
              ) : (
                <Typography variant="p">
                  Here you are going to see people that like your ideas.  Start writing to attract people to follow you.
                </Typography>
              )
            }
          </div>
          <div id="component-empty-follow-image">
            {
              filter === 'following' ? (
                <img
                  alt="EmptyFollowing"
                  src="/assets/EmptyFollowing.png"
                />
              ) : (
                <img
                  alt="EmptyFollowers"
                  src="/assets/EmptyFollowers.png"
                />
              )
            }

          </div>
          <div id="component-empty-follow-actions">
            {
              filter === 'following' ? (
                <>
                  <Button variant="contained" color="secondary">
                    Find Friends
                  </Button>
                  <Button variant="contained" color="primary">
                    Go to Search
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" color="secondary">
                    Create a Post
                  </Button>
                </>
              )
            }

          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

NoFollowers.propTypes = {
  filter: PropTypes.string.isRequired,
}
