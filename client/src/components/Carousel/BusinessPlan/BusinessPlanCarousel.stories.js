import React, { useState } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import BusinessPlanCarousel from './BusinessPlanCarousel'
import styles from '../../../assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import theme from '../../../themes/MainTheme'

const useStyles = makeStyles(styles)

export default {
  component: BusinessPlanCarousel,
  title: 'Landing Page',
}
function Wrapper() {
  const classes = useStyles()
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  return (

    <ThemeProvider theme={theme}>
      <BusinessPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} carouselCurrentIndex={carouselCurrentIndex} />
    </ThemeProvider>
  )
}

export const BusinessPlanCarouselContent = () => <Wrapper />

BusinessPlanCarouselContent.story = {
  parameters: {
    jest: ['BusinessPlanCarousel.test.js'],
  },
}
