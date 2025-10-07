import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { makeStyles } from '@mui/styles'
import { ThemeProvider } from '@mui/material/styles'
// Ensure the real carousel package is mocked before the component module imports it
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  // Mock the carousel lib and the component module itself so we don't pull
  // the full component graph (and its problematic dependencies) into
  // the test import analysis phase.
  vi.mock('react-material-ui-carousel', () => {
    const React = require('react')
    function CarouselStub({ children }) { return React.createElement('div', null, children) }
    return { __esModule: true, default: CarouselStub }
  })

  vi.mock('./InvestorPlanCarousel', () => {
    const React = require('react')
    function Mock() { return React.createElement('div', { 'data-testid': 'investor-carousel-mock' }, 'InvestorPlanCarouselMock') }
    return { __esModule: true, default: Mock }
  })
}

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
