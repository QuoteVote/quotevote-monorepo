import { makeStyles } from '@mui/styles'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import { Typography } from '@mui/material'
import { isMobile } from 'react-device-detect'
import withWidth from '../../utils/withWidth'
import GridItem from '../../mui-pro/Grid/GridItem'
import GridContainer from '../../mui-pro/Grid/GridContainer'

const useStyles = makeStyles(styles)

const greyBackgroundStyle = {
  padding: 32,
  backgroundColor: 'rgba(66,66,66,0.8)', // dark grey, 80% opacity
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  marginTop: 16,
}

const headingStyle = { color: '#00acc1', marginBottom: 8, fontWeight: 600 }
const textStyle = {
  color: '#f5f5f5',
  marginBottom: 24,
  lineHeight: 1.6,
  fontWeight: 400,
}
const lastUpdatedStyle = {
  fontStyle: 'italic',
  marginTop: 24,
  color: '#bdbdbd',
}

function TermsPage() {
  const classes = useStyles({ isMobile })

  return (
    <div
      className={classes.container}
      style={{
        backgroundColor: 'rgba(66,66,66,0.8)',
        minHeight: '100vh',
        marginBottom: 24,
        borderRadius: 5,
      }}
    >
      <GridContainer justify="center" style={{ marginRight: 24 }}>
        <GridItem xs={12}>
          <Typography align="center" className={classes.share}>
            Terms of <span className={classes.greenTitleText}>Service</span>
          </Typography>
        </GridItem>
        <GridItem xs={12}>
          <div
            style={{
              padding: 32,
              marginTop: 16,
            }}
          >
            <Typography
              variant="h6"
              style={{ ...headingStyle, marginBottom: 16 }}
            >
              Welcome to Quote.Vote
            </Typography>
            <Typography style={textStyle}>
              By using this platform, you agree to the following terms and
              conditions:
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              1. No Guarantees
            </Typography>
            <Typography style={textStyle}>
              This service is provided "as is," without warranty of any kind,
              either express or implied. We make no guarantees regarding the
              availability, reliability, or accuracy of the service.
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              2. Respectful Conduct
            </Typography>
            <Typography style={textStyle}>
              Users must refrain from harassment, spam, or posting illegal
              content. We expect all users to maintain respectful and
              appropriate behavior while using our platform.
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              3. Content Ownership
            </Typography>
            <Typography style={textStyle}>
              You retain rights to your own content but grant us permission to
              display it on our platform. You are responsible for ensuring you
              have the right to share any content you post.
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              4. Moderation
            </Typography>
            <Typography style={textStyle}>
              We reserve the right to remove content or restrict access for any
              reason, including but not limited to violations of these terms or
              inappropriate behavior.
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              5. No Liability
            </Typography>
            <Typography style={textStyle}>
              We are not responsible for any harm resulting from use of this
              platform. Users use the service at their own risk.
            </Typography>

            <Typography variant="h6" style={headingStyle}>
              6. Changes
            </Typography>
            <Typography style={textStyle}>
              These terms may change as the platform evolves. We will notify
              users of any significant changes to these terms of service.
            </Typography>

            <Typography variant="body2" style={lastUpdatedStyle}>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withWidth()(TermsPage)
