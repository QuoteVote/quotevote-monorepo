import PropTypes from 'prop-types'
import cx from 'classnames'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

import styles from 'assets/jss/material-dashboard-pro-react/components/footerStyle'
import { Grid } from '@material-ui/core'

const useStyles = makeStyles(styles)

export default function Footer(props) {
  const classes = useStyles()
  const { fluid, white } = props
  const container = cx({
    [classes.container]: !fluid,
    [classes.containerFluid]: fluid,
    [classes.whiteColor]: white,
  })
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <footer className={classes.footer}>
      <div className={container}>
        {isMobile ? (
          <Grid container direction="column" alignItems="center">
            <Grid item xs={12} style={{ textAlign: 'center', marginBottom: 16 }}>
              <Typography>
                Quote.Vote made with ❤️ on Earth
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              <Link href="/auth/request-access" color="inherit">
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  Request Invite
                </Typography>
              </Link>
              <Link href="https://opencollective.com/quotevote-duplicate/donate" color="inherit">
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  Donate
                </Typography>
              </Link>
              <Link href="https://github.com/QuoteVote/quotevote-monorepo" color="inherit">
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  GitHub
                </Typography>
              </Link>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={12} sm={9}>
              <Typography>
                Quote.Vote made with ❤️ on Earth
                <div className={classes.grow} />
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              lg={3}
              style={{
                fontSize: '14px',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexDirection: 'row',
                gap: 0,
                textAlign: 'right',
              }}
            >
              <Link
                href="/auth/request-access"
                color="inherit"
                style={{ marginRight: '1rem' }}
              >
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  Request Invite
                </Typography>
              </Link>
              <Link
                href="https://opencollective.com/quotevote-duplicate/donate"
                color="inherit"
                style={{ marginLeft: '1rem' }}
              >
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  Donate
                </Typography>
              </Link>
              <Link
                href="https://github.com/QuoteVote/quotevote-monorepo"
                color="inherit"
                style={{ marginLeft: '1rem' }}
              >
                <Typography style={{ fontSize: '14px', fontWeight: 400 }}>
                  GitHub
                </Typography>
              </Link>
            </Grid>
          </Grid>
        )}
      </div>
    </footer>
  )
}

Footer.propTypes = {
  fluid: PropTypes.bool,
  white: PropTypes.bool,
  rtlActive: PropTypes.bool,
}
