import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { tokenValidator } from 'store/user'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import {
  AppBar,
  Box,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  ListItem,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { isMobile } from 'react-device-detect'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import EmailIcon from '@material-ui/icons/Email'
import GridContainer from '../../mui-pro/Grid/GridContainer'
import GridItem from '../../mui-pro/Grid/GridItem'
import Button from '../../mui-pro/CustomButtons/Button'

const useStyles = makeStyles((theme) => ({
  ...styles(theme),
  navbar: {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
      flexDirection: 'column',
      gap: theme.spacing(2),
    },
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
  },
  logoImage: {
    height: 40,
    width: 40,
  },
  brandText: {
    marginLeft: theme.spacing(1),
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#0A2342',
    fontSize: '1.25rem',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      width: '100%',
      gap: theme.spacing(1),
    },
  },
  navButton: {
    color: '#0A2342',
    fontWeight: 500,
    textTransform: 'none',
    padding: theme.spacing(1, 2),
    transition: 'all 0.2s',
    '&:hover': {
      background: 'rgba(42, 230, 178, 0.1)',
      transform: 'translateY(-1px)',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      justifyContent: 'center',
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
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
      background: 'rgba(42, 230, 178, 0.1)',
      transform: 'translateY(-1px)',
      border: '2px solid #2AE6B2',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  footer: {
    background: 'linear-gradient(135deg, #0A2342 0%, #1a3a5c 100%)',
    color: '#ffffff',
    padding: theme.spacing(6, 0, 3),
    marginTop: theme.spacing(8),
  },
  footerContent: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: theme.spacing(0, 3),
  },
  footerSection: {
    marginBottom: theme.spacing(4),
  },
  footerTitle: {
    fontWeight: 700,
    fontSize: '1.125rem',
    marginBottom: theme.spacing(2),
    color: '#2AE6B2',
  },
  footerLink: {
    color: '#ffffff',
    textDecoration: 'none',
    display: 'block',
    marginBottom: theme.spacing(1),
    transition: 'all 0.2s',
    '&:hover': {
      color: '#2AE6B2',
      transform: 'translateX(4px)',
    },
  },
  socialIcons: {
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  socialIcon: {
    color: '#ffffff',
    transition: 'all 0.2s',
    '&:hover': {
      color: '#2AE6B2',
      transform: 'scale(1.1)',
    },
  },
  footerBottom: {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
    textAlign: 'center',
  },
  tagline: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing(2),
  },
}))

export const MOBILE_IMAGE_WIDTH = 250

export default function LandingPage() {
  const classes = useStyles({ isMobile })
  const dispatch = useDispatch()
  const history = useHistory()

  React.useEffect(() => {
    if (tokenValidator(dispatch)) history.push('/search')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced Navbar */}
      <AppBar position="sticky" className={classes.navbar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          {/* Logo */}
          <Box className={classes.logo} onClick={() => history.push('/')}>
            <img
              src="/assets/QuoteVoteLogo.png"
              alt="Quote.Vote Logo"
              className={classes.logoImage}
            />
            <Typography variant="h6" className={classes.brandText}>
              QUOTE.VOTE
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box className={classes.navLinks}>
            <Button
              className={classes.navButton}
              onClick={() => history.push('/')}
              aria-label="Home"
            >
              Home
            </Button>
            <Button
              className={classes.navButton}
              onClick={() => {
                const aboutSection = document.getElementById('about-section')
                aboutSection?.scrollIntoView({ behavior: 'smooth' })
              }}
              aria-label="About"
            >
              About
            </Button>
            <Button
              className={classes.navButton}
              href="mailto:admin@quote.vote"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Donate"
            >
              Donate
            </Button>
            <Button
              className={classes.outlinedButton}
              onClick={() => history.push('/auth/login')}
              aria-label="Login to your account"
            >
              Login
            </Button>
            <Button
              className={classes.primaryButton}
              onClick={() => history.push('/auth/request-access')}
              aria-label="Request an invite to join"
            >
              Request Invite
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <GridContainer
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.container}
        style={{ flex: 1 }}
      >
        <GridItem xs={12} className={classes.listContainer}>
          <ListItem className={classes.listItem}>
            <img alt="Quote.Vote" src="/assets/QuoteVoteLogo.png" className={classes.voxPop} />
          </ListItem>

          <ListItem className={classes.listItem} id="about-section">
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
        </GridItem>
      </GridContainer>

      {/* Enhanced Footer */}
      <Box component="footer" className={classes.footer} role="contentinfo">
        <Container className={classes.footerContent}>
          <Grid container spacing={4}>
            {/* About Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Box className={classes.footerSection}>
                <Typography variant="h6" className={classes.footerTitle}>
                  About
                </Typography>
                <Typography variant="body2" className={classes.tagline}>
                  Empowering thoughtful discourse and community engagement through democratic quote voting.
                </Typography>
                <Link
                  href="mailto:admin@quote.vote"
                  className={classes.footerLink}
                  aria-label="Contact us via email"
                >
                  <EmailIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 8 }} />
                  admin@quote.vote
                </Link>
              </Box>
            </Grid>

            {/* Quick Links Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Box className={classes.footerSection}>
                <Typography variant="h6" className={classes.footerTitle}>
                  Quick Links
                </Typography>
                <Link
                  href="/auth/request-access"
                  className={classes.footerLink}
                  aria-label="Request an invite"
                >
                  Request Invite
                </Link>
                <Link
                  href="/auth/login"
                  className={classes.footerLink}
                  aria-label="Login to your account"
                >
                  Login
                </Link>
                <Link
                  href="mailto:admin@quote.vote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.footerLink}
                  aria-label="Donate to support us"
                >
                  Donate
                </Link>
                <Link
                  href="mailto:admin@quote.vote"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.footerLink}
                  aria-label="Volunteer with us"
                >
                  Volunteer
                </Link>
              </Box>
            </Grid>

            {/* Resources Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Box className={classes.footerSection}>
                <Typography variant="h6" className={classes.footerTitle}>
                  Resources
                </Typography>
                <Link
                  href="/TERMS.md"
                  className={classes.footerLink}
                  aria-label="Read our terms of service"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/quote_vote_code_of_conduct.md"
                  className={classes.footerLink}
                  aria-label="Read our code of conduct"
                >
                  Code of Conduct
                </Link>
                <Link
                  href="/CONTRIBUTING.md"
                  className={classes.footerLink}
                  aria-label="Learn how to contribute"
                >
                  Contributing
                </Link>
              </Box>
            </Grid>

            {/* Social Section */}
            <Grid item xs={12} sm={6} md={3}>
              <Box className={classes.footerSection}>
                <Typography variant="h6" className={classes.footerTitle}>
                  Connect With Us
                </Typography>
                <Box className={classes.socialIcons}>
                  <IconButton
                    href="https://github.com/QuoteVote/quotevote-monorepo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.socialIcon}
                    aria-label="Visit our GitHub repository"
                  >
                    <GitHubIcon />
                  </IconButton>
                  <IconButton
                    href="https://twitter.com/quotevote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.socialIcon}
                    aria-label="Follow us on Twitter"
                  >
                    <TwitterIcon />
                  </IconButton>
                  <IconButton
                    href="https://linkedin.com/company/quotevote"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes.socialIcon}
                    aria-label="Connect with us on LinkedIn"
                  >
                    <LinkedInIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Footer Bottom */}
          <Box className={classes.footerBottom}>
            <Typography variant="body2" style={{ marginBottom: 8 }}>
              Made with <span style={{ color: '#e25555' }}>❤️</span> on Earth
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.8 }}>
              © {new Date().getFullYear()} Quote.Vote. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
