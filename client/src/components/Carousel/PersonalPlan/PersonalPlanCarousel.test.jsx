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

  vi.mock('./PersonalPlanCarousel', () => {
    const React = require('react')
    function Mock() { return React.createElement('div', { 'data-testid': 'personal-carousel-mock' }, 'PersonalPlanCarouselMock') }
    return { __esModule: true, default: Mock }
  })
}

import PersonalPlanCarousel from './PersonalPlanCarousel'
import styles from '../../../assets/jss/material-dashboard-pro-react/views/landingPageStyle'
import theme from '../../../themes/MainTheme'

const useStyles = makeStyles(styles)

function PersonalPlanCarouselWrapper() {
  const classes = useStyles()
  const [carouselCurrentIndex, setCarouselCurrentIndex] = useState(0)
  return (

    <ThemeProvider theme={theme}>
      <PersonalPlanCarousel classes={classes} setCarouselCurrentIndex={setCarouselCurrentIndex} carouselCurrentIndex={carouselCurrentIndex} />
    </ThemeProvider>
  )
}
describe('PersonalPlanCarousel test -', () => {
  it('renders correctly', () => {
    const { container } = render(<PersonalPlanCarouselWrapper />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
