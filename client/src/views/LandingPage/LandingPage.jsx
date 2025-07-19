import React from 'react'
import { makeStyles } from '@mui/styles'
import { tokenValidator } from 'store/user'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import {
  Card,
  Link,
  ListItem,
  Typography,
} from '@mui/material'
import { isMobile } from 'react-device-detect'
import GridContainer from '../../mui-pro/Grid/GridContainer'
import GridItem from '../../mui-pro/Grid/GridItem'
import Button from '../../mui-pro/CustomButtons/Button'

const useStyles = makeStyles(styles)

export const MOBILE_IMAGE_WIDTH = 250

export default function LandingPage() {
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const history = useHistory()

  React.useEffect(() => {
    if (tokenValidator(dispatch)) history.push('/Home')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GridContainer
      direction="column"
      alignItems="center"
      justify="center"
      className={classes.container}
    >
      <GridItem xs={12} className={classes.listContainer}>
        <ListItem className={classes.listItem}>
          <img alt="quoteVote" src="/assets/QuoteVoteLogo.png" className={classes.voxPop} />
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button
            variant="outlined"
            className={classes.listItemTextLogin}
            type="submit"
            onClick={() => history.push('/auth/login')}
          >
            Login
          </Button>
          <Button
            variant="contained"
            className={classes.listItemTextRequestInvite}
            type="submit"
            onClick={() => history.push('/auth/request-access')}
          >
            Request Invite
          </Button>
        </ListItem>
        {/* <ListItem className={classes.listItem}>
        </ListItem> */}
        <ListItem className={classes.listItem}>
          <Card className={classes.card}>
            <Typography variant="h4" className={classes.listItemHeaderText}>
              Welcome to Quote.Vote
            </Typography>
            <Typography className={classes.listItemText}>
              Quote Vote is a non-for-profit project, and encourages users to donate their money or time, to be an active part of the change we&apos;d all like to see in the world.
            </Typography>
            <Typography className={classes.listItemText}>
              We understand the delicate balance between fostering freedom of expression and curbing harmful behavior.
            </Typography>
            <Typography className={classes.listItemText}>
              Our moderation policies aim to maximize the benefits of free speech while minimizing the potential for harm.
            </Typography>
            <Typography className={classes.listItemText}>
              We believe that thoughtful, respectful discourse leads to stronger communities and richer dialogue.
            </Typography>
          </Card>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Button
            variant="contained"
            className={classes.listItemTextDonate}
            type="submit"
          >
            Donate
          </Button>
        </ListItem>
        <ListItem className={classes.contact}>
          Contact
          {' '}
          <Link target="_black" rel="noreferrer" href="mailto:admin@quote.vote">admin@quote.vote</Link>
        </ListItem>
        <ListItem className={classes.listItem}>
          <Typography className={classes.listItemMakeWithLove}>
            Made with
            {' '}
            <span>&#9829;</span>
            {' '}
            on Earth
          </Typography>
        </ListItem>
      </GridItem>
    </GridContainer>
  )
}
