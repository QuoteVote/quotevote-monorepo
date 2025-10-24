import { makeStyles } from '@mui/styles'
import styles from 'assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import { Typography } from '@mui/material'
import { isMobile } from 'react-device-detect'
import Carousel from 'react-material-ui-carousel'
import withWidth from '../../utils/withWidth'
import GridItem from '../../mui-pro/Grid/GridItem'
import GridContainer from '../../mui-pro/Grid/GridContainer'

const useStyles = makeStyles(styles)

export const MOBILE_IMAGE_WIDTH = 250

const images = ['/assets/AboutUs1.svg', '/assets/AboutUs2.svg', '/assets/AboutUs3.svg', '/assets/AboutUs4.svg', '/assets/AboutUs5.svg']

function AboutPage() {
  const classes = useStyles({ isMobile })
  return (
    <div className={classes.container}>
      <GridContainer justify="center" style={{ marginRight: 24 }}>
        <GridItem xs={12}>
          <Typography
            align="center"
            className={classes.share}
          >
            About
            {' '}
            <span className={classes.greenTitleText}>
              Us
            </span>
          </Typography>
        </GridItem>
        <GridItem>
          <Carousel
            activeIndicatorProps={{
              className: classes.activeIndicator,
            }}
            indicatorProps={{
              className: classes.inactiveIndicator,
            }}
          >
            {images.map((image, i) => (
              <div>
                <img
                  alt="About us"
                  src={image}
                  key={i}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    margin: 'auto',
                    display: 'block',
                  }}
                />
              </div>
            ))}
          </Carousel>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withWidth()(AboutPage)
