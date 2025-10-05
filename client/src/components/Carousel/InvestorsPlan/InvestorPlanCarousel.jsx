import { useState } from 'react'
import { CircularProgress, TextField, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import PropTypes from 'prop-types'
import InputAdornment from '@mui/material/InputAdornment'
import { useHistory } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { useMutation } from '@apollo/react-hooks'
import { useForm } from 'react-hook-form'
import Carousel from 'react-material-ui-carousel'
import Grid from '@mui/material/Grid'
import withWidth from 'utils/withWidth'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import GridItem from '../../../mui-pro/Grid/GridItem'
import InvestButton from '../../CustomButtons/InvestButton'
import { SEND_INVESTOR_EMAIL } from '../../../graphql/mutations'
import DoubleArrowIconButton from '../../CustomButtons/DoubleArrowIconButton'
import { MOBILE_IMAGE_WIDTH } from '../../../views/LandingPage/LandingPage'

InvestorCarouselFirstContent.propTypes = {
  classes: PropTypes.object,
  setContentIndex: PropTypes.func,
  width: PropTypes.string,
}

function InvestorCarouselFirstContent({ classes, setContentIndex, width }) {
  const { opinionsText, bottomText, greenText } = classes
  const theme = useTheme()
  const showMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const showMdDown = !showMdUp
  const browserWidth = '400.43px'
  const imageWidth = isMobile ? MOBILE_IMAGE_WIDTH : browserWidth
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{
        paddingLeft: width === 'xs' ? 20 : 60,
        paddingRight: width === 'xs' ? 0 : 60,
      }}
    >
      <Grid item xs={12} sm={12} md={6}>
        <img
          alt="Investor"
          src="/assets/InvestorContent1.png"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <GridItem xs={12} sm={12} md={6}>
        <Typography>
          <div className={opinionsText}>
            We created Quote Vote with promoting
            {' '}
            <b>democracy and community as our pillar.</b>
            <br />
            <br />
            This is why we reject investment from VC firms, and encourage users to invest and become a part of the
            change.
            <b>Invest up to $2000 to grow with us. </b>
            <br />
            <br />
          </div>
        </Typography>
        {showMdDown && (
          <InvestButton
            width={width}
            handleClick={() => {
              setContentIndex(2)
            }}
          />
        )}
        <Typography className={bottomText}>
          {showMdUp && (
            <InvestButton
              width={width}
              handleClick={() => {
                setContentIndex(2)
              }}
            />
          )}
          {' '}
          What is
          <span className={greenText}> the deal </span>
          <DoubleArrowIconButton onClick={() => setContentIndex(1)} />
        </Typography>
      </GridItem>
    </Grid>
  )
}

InvestorCarouselSecondContent.propTypes = {
  classes: PropTypes.object,
  setContentIndex: PropTypes.func,
  width: PropTypes.string,
}

function InvestorCarouselSecondContent({ classes, setContentIndex, width }) {
  const { opinionsText, bottomText, greenText } = classes
  const browserWidth = '435.43px'
  const imageWidth = isMobile ? MOBILE_IMAGE_WIDTH : browserWidth
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{
        paddingLeft: width === 'xs' ? 20 : 60,
        paddingRight: width === 'xs' ? 0 : 60,
      }}
    >
      <Grid item xs={12} sm={12} md={7} lg={6}>
        <img
          alt="Investor 2"
          src="/assets/InvestorContent2.svg"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={5} lg={6}>
        <Typography>
          <div className={opinionsText}>
            By capping individual investments at $2000,
            {' '}
            <b>we ensure shareholders have an equal voice, and provide a more inclusive opportunity to invest. </b>
            <br />
            <br />
            We keep growth organized and open through Quote Vote and
            {' '}
            <b>all shareholder opinions hold the same weight. </b>
            <br />
            <br />
          </div>
        </Typography>
        <Hidden mdUp>
          <InvestButton
            width={width}
            handleClick={() => {
              setContentIndex(2)
            }}
          />
        </Hidden>
        <Typography className={bottomText}>
          <Hidden smDown>
            <InvestButton
              width={width}
              handleClick={() => {
                setContentIndex(2)
              }}
            />
          </Hidden>
          {'  '}
          I want to
          {' '}
          <span className={greenText}> to know details</span>
          <DoubleArrowIconButton onClick={() => setContentIndex(2)} />
        </Typography>
      </Grid>
    </Grid>
  )
}

InvestorCarouselThirdContent.propTypes = {
  classes: PropTypes.object,
  width: PropTypes.object,
}

function InvestorCarouselThirdContent({ classes, width }) {
  const history = useHistory()
  const [sendInvestorMail, { data, error, loading }] = useMutation(SEND_INVESTOR_EMAIL)
  const {
    register, errors, handleSubmit, getValues,
  } = useForm()

  const handleSendEmail = async () => {
    const { email } = getValues()
    await sendInvestorMail({ variables: { email } })
  }
  const browserWidth = width === 'md' ? '400.43px' : '435.43px'
  const imageWidth = isMobile ? MOBILE_IMAGE_WIDTH : browserWidth

  if (data) {
    history.push('/auth/investor-thanks')
  }

  return (
    <form onSubmit={handleSubmit(handleSendEmail)}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{
          paddingLeft: width === 'xs' ? 20 : 60,
          paddingRight: width === 'xs' ? 0 : 60,
        }}
      >
        <Grid item xs={12} sm={12} md={8} lg={7}>
          <img
            alt="Investor"
            src="/assets/InvestorContent3.svg"
            style={{
              width: imageWidth,
              height: isMobile ? 'auto' : '350.51px',
              objectFit: 'contain',
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={5}>
          <Typography>
            <div className={classes.opinionsText}>
              <b>There are 10,000,000 shares of stock</b>
              <br />
              Join us in creating a truly open and equal community
              where civil conversation is the main objective.
              <br />
              <br />
              <br />
            </div>
          </Typography>
          <div className={classes.sendEmail}>
            <TextField
              variant="filled"
              required
              label="Email"
              name="email"
              id="email"
              error={errors.email}
              helperText={errors.email && errors.email.message}
              fullWidth
              inputRef={register({
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      aria-label="Send"
                      className={classes.sendEmailButton}
                      onClick={handleSendEmail}
                      disabled={loading || error || errors.email}
                    >
                      Send
                      {loading && (<CircularProgress size={20} className={classes.loadingProgress} />)}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Grid>
      </Grid>
    </form>
  );
}

function InvestorPlanCarousel(props) {
  const [contentIndex, setContentIndex] = useState(0)
  const { setCarouselCurrentIndex, classes } = props
  return (
    <Carousel
      navButtonsAlwaysVisible
      index={contentIndex}
      onChange={(index) => {
        setCarouselCurrentIndex(index)
      }}
      activeIndicatorProps={{
        className: classes.activeIndicator,
      }}
      indicatorProps={{
        className: classes.inactiveIndicator,
      }}
    >
      <InvestorCarouselFirstContent {...props} setContentIndex={setContentIndex} />
      <InvestorCarouselSecondContent {...props} setContentIndex={setContentIndex} />
      <InvestorCarouselThirdContent {...props} />
    </Carousel>
  )
}

InvestorPlanCarousel.propTypes = {
  classes: PropTypes.object,
  setCarouselCurrentIndex: PropTypes.func,
}

export default withWidth()(InvestorPlanCarousel)
