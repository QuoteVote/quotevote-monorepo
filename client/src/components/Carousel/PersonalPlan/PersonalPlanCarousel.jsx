import { useState } from 'react'
import { Typography } from '@mui/material'
import PropTypes from 'prop-types'
import Carousel from '../../../shims/react-material-ui-carousel'
import withWidth from 'utils/withWidth'
import Grid from '@mui/material/Grid'
import { isMobile } from 'react-device-detect'
import DoubleArrowIconButton from '../../CustomButtons/DoubleArrowIconButton'
import RequestInviteCarouselButton from '../RequestInviteCarouselButton'

function PersonalCarouselFirstContent(props) {
  const { width, classes } = props
  return (
    <Grid
      container
      direction="row"
      justify="flex-end"
      alignItems="baseline"
      style={{ paddingLeft: 40, paddingRight: 10 }}
    >
      <Grid item xs={12} md={6}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-end"
        >
          <Grid item xs={3}>
            <img
              alt="Personal"
              src="/assets/AvatarGirl.png"
              style={{
                width: isMobile ? 50 : '90%',
                height: isMobile ? 'auto' : '350.51px',
                objectFit: 'contain',
              }}
            />
          </Grid>
          <Grid item xs={9}>
            <img
              alt="Personal"
              src="/assets/PostPage.svg"
              style={{
                height: isMobile ? 'auto' : '350.51px',
                width: isMobile ? 200 : '100%',
                objectFit: 'contain',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <img
          alt="Personal"
          src="/assets/PersonalContent1b.svg"
          style={{
            width: isMobile ? 200 : '100%',
            objectFit: 'cover',
            marginLeft: width === 'xs' ? 20 : 10,
          }}
        />
      </Grid>
      <RequestInviteCarouselButton classes={classes} />
    </Grid>
  )
}

PersonalCarouselFirstContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function PersonalCarouselSecondContent(props) {
  const { width, classes } = props
  // eslint-disable-next-line no-nested-ternary
  const imageWidth = isMobile ? 200 : (width === 'xs' || width === 'sm' ? '400.43px' : '435.43px')
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: 60, paddingRight: width === 'xs' ? 0 : 60 }}
    >
      <Grid item xs={12} md={8}>
        <img
          alt="Personal"
          src="/assets/PersonalContent2.svg"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <div>
          <Typography variant="subtitle1">Comments</Typography>
          <Typography variant="caption">When you comment it will appear here.</Typography>

        </div>
      </Grid>
      <RequestInviteCarouselButton classes={classes} />
    </Grid>
  )
}

PersonalCarouselSecondContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function PersonalCarouselThirdContent({ width, classes, setContentIndex }) {
  // eslint-disable-next-line no-nested-ternary
  const imageWidth = isMobile ? 200 : (width === 'md' ? '365.43px' : '400.43px')
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: 60, paddingRight: width === 'xs' ? 0 : 60 }}
    >
      <Grid item xs={12} md={7}>
        <img
          alt="Personal 3"
          src="/assets/PersonalContent3.png"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography>
          <div className={classes.opinionsText}>
            <p>
              <b> Join a growing community of more than 11047 people</b>
              {' '}
              in honest and informed conversations. Quote is yours to shape.
            </p>
            <br />
            <p>
              <b> Share your opinions with friends and/or strangers.</b>
              {' '}
              Work on projects with your teams.
              Vote transparently.
            </p>
            <br />
          </div>
        </Typography>

        <Typography className={classes.bottomText}>
          {' '}
          What else do
          <span className={classes.greenText}> we have </span>
          for you?
          <DoubleArrowIconButton onClick={() => setContentIndex(3)} />
        </Typography>
      </Grid>
      <RequestInviteCarouselButton classes={classes} />
    </Grid>
  )
}

PersonalCarouselThirdContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
  setContentIndex: PropTypes.func,
}

function PersonalCarouselFourthContent({ width, classes }) {
  // eslint-disable-next-line no-nested-ternary
  const imageWidth = isMobile ? 200 : (width === 'md' ? '365.43px' : '400.43px')

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      style={{ paddingLeft: 60, paddingRight: width === 'xs' ? 0 : 60 }}
    >
      <Grid item xs={12} md={7}>
        <img
          alt="Personal 4"
          src="/assets/PersonalContent4.svg"
          style={{
            width: imageWidth,
            height: isMobile ? 'auto' : '350.51px',
            objectFit: 'contain',
          }}
        />
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography>
          <div className={classes.opinionsText}>
            <p>
              <b>See posts with the most activity.</b>
              {' '}
              Filter by keyword, date range, or follows. See what people are talking about and sharing the most.
            </p>
            <br />
            <p>
              <b>No content is boosted by paid promotion or advertising.</b>
            </p>
            <br />
          </div>
        </Typography>
      </Grid>
      <RequestInviteCarouselButton classes={classes} />
    </Grid>
  )
}

PersonalCarouselFourthContent.propTypes = {
  width: PropTypes.string,
  classes: PropTypes.object,
}

function PersonalPlanCarousel(props) {
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
      <PersonalCarouselFirstContent {...props} />
      <PersonalCarouselSecondContent {...props} />
      <PersonalCarouselThirdContent {...props} setContentIndex={setContentIndex} />
      <PersonalCarouselFourthContent {...props} />
    </Carousel>
  )
}

PersonalPlanCarousel.propTypes = {
  classes: PropTypes.object,
  setCarouselCurrentIndex: PropTypes.func,
}

export default withWidth()(PersonalPlanCarousel)
