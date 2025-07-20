import { useState } from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import Grid from '@mui/material/Grid'
import Carousel from 'react-material-ui-carousel'
import withWidth from '../../../utils/withWidth'
import { isMobile } from 'react-device-detect'
import RequestInviteCarouselButton from '../RequestInviteCarouselButton'
import { MOBILE_IMAGE_WIDTH } from '../../../views/LandingPage/LandingPage'

function BusinessCarouselFirstContent(props) {
  const { width, classes } = props
  const browserWidth = width === 'xs' ? '400px' : '80%'
  const imageWidth = isMobile ? MOBILE_IMAGE_WIDTH : browserWidth
  const padding = width === 'xs' ? 20 : 60

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <Grid item sm={12} md={8} lg={7}>
        <img
          alt="Business"
          src="/assets/BusinessContent1.svg"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item sm={12} md={4} lg={5}>
        <Typography>
          <div className={classes.opinionsText}>
            <p>
              <b>Talk to your team</b>
              {' '}
              , poll the entire company, assess their feedback,
              plan the next big company initiative that will knock it
              out of the park.
            </p>
            <br />
          </div>
        </Typography>
      </Grid>
      <RequestInviteCarouselButton classes={classes} />
    </Grid>
  )
}

BusinessCarouselFirstContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function BusinessCarouselSecondContent(props) {
  const { width, classes } = props
  const browserWidth = width === 'xs' ? '400px' : '80%'
  const imageWidth = isMobile ? 200 : browserWidth
  const padding = width === 'xs' ? 20 : 60
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <Grid item sm={12} md={8} lg={7}>
        <img
          alt="Business 2"
          src="/assets/BusinessContent2.svg"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item sm={12} md={4} lg={5}>
        <Typography>
          <div className={classes.opinionsText}>
            <p style={{ marginTop: width === 'xs' ? 0 : 20 }}>
              <b>Promote democracy and transparency</b>
              {' '}
              within your team. Quote makes it so the whole team
              can see progress in real time.
            </p>
            <br />
          </div>
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        sm={12}
      >
        <RequestInviteCarouselButton classes={classes} />
      </Grid>
    </Grid>
  )
}

BusinessCarouselSecondContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function BusinessCarouselThirdContent(props) {
  const { width, classes } = props
  const browserWidth = width === 'xs' ? '400px' : '70%'
  const imageWidth = isMobile ? 200 : browserWidth
  const padding = width === 'xs' ? 20 : 60
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: padding, paddingRight: padding }}
    >
      <Grid item sm={12} md={8} lg={7}>
        <img
          alt="Business 2"
          src="/assets/BusinessContent3.png"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item sm={12} md={4} lg={5}>
        <Typography>
          <div className={classes.opinionsText}>
            <p style={{ marginTop: width === 'xs' ? 0 : 20 }}>
              <b>
                Join 345 companies in creating a workspace in
                which everyone has a voice.
              </b>
              {' '}
              Poll to see what your employees value the most,
              converse to make the next big decision, and more.
            </p>
            <br />
            <p>
              <span className={classes.greenText}>Quote</span>
              {' '}
              is yours to shape.
            </p>
          </div>
        </Typography>
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        sm={12}
      >
        <RequestInviteCarouselButton classes={classes} />
      </Grid>
    </Grid>
  )
}

BusinessCarouselThirdContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function BusinessPlanCarousel(props) {
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
      <BusinessCarouselFirstContent {...props} setContentIndex={setContentIndex} />
      <BusinessCarouselSecondContent {...props} setContentIndex={setContentIndex} />
      <BusinessCarouselThirdContent {...props} setContentIndex={setContentIndex} />
    </Carousel>
  )
}

BusinessPlanCarousel.propTypes = {
  classes: PropTypes.object,
  setCarouselCurrentIndex: PropTypes.func,
}

export default withWidth()(BusinessPlanCarousel)
