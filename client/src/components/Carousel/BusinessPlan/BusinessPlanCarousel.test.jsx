import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import BusinessPlanCarousel from './BusinessPlanCarousel'
import theme from '../../../themes/MainTheme'
import styles from '../../../assets/jss/material-dashboard-pro-react/views/landingPageStyle'

const useStyles = makeStyles(styles)

function BusinessPlanCarouselWrapper() {
  const classes = useStyles()
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  return (

    <ThemeProvider theme={theme}>
      <BusinessPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} carouselCurrentIndex={carouselCurrentIndex} />
    </ThemeProvider>
  )
}

describe('BusinessPlanCarousel test -', () => {
  it('renders correctly', () => {
    const { container } = render(<BusinessPlanCarouselWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
