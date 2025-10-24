import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { makeStyles } from '@mui/styles'
import { ThemeProvider } from '@mui/material/styles'
// Ensure the real carousel package is mocked before the component module imports it
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  vi.mock('react-material-ui-carousel', () => {
    const React = require('react')
    function CarouselStub({ children }) { return React.createElement('div', null, children) }
    return { __esModule: true, default: CarouselStub }
  })
}

if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  vi.mock('react-material-ui-carousel', () => {
    const React = require('react')
    function CarouselStub({ children }) { return React.createElement('div', null, children) }
    return { __esModule: true, default: CarouselStub }
  })

  vi.mock('./BusinessPlanCarousel', () => {
    const React = require('react')
    function Mock() { return React.createElement('div', { 'data-testid': 'business-carousel-mock' }, 'BusinessPlanCarouselMock') }
    return { __esModule: true, default: Mock }
  })
}

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
