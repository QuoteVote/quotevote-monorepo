import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { makeStyles, ThemeProvider as ThemeProvider } from '@mui/material/styles'
import InvestorPlanCarousel from './InvestorPlanCarousel'
import styles from '../../../assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import theme from '../../../themes/MainTheme'

const useStyles = makeStyles(styles)

function InvestorPlanCarouselWrapper() {
  const classes = useStyles()
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  return (

    <ThemeProvider theme={theme}>
      <InvestorPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} carouselCurrentIndex={carouselCurrentIndex} />
    </ThemeProvider>
  )
}

describe('InvestorPlanCarousel test -', () => {
  it('renders correctly', () => {
    const { container } = render(<InvestorPlanCarouselWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
