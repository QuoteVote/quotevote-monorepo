import React, { useState } from 'react'

import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import InvestorPlanCarousel from './InvestorPlanCarousel'
import styles from '../../../assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import theme from '../../../themes/MainTheme'

const useStyles = makeStyles(styles)

export default {
  component: InvestorPlanCarousel,
  title: 'Landing Page',
}
function Wrapper() {
  const classes = useStyles()
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  return (

    <ThemeProvider theme={theme}>
      <InvestorPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} carouselCurrentIndex={carouselCurrentIndex} />
    </ThemeProvider>
  )
}

export const InvestorPlanCarouselContent = () => <Wrapper />

InvestorPlanCarouselContent.story = {
  parameters: {
    jest: ['InvestorPlanCarousel.test.js'],
  },
}
