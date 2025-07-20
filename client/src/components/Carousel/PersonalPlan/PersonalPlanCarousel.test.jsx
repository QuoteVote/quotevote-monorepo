import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { makeStyles, ThemeProvider as ThemeProvider } from '@mui/material/styles'
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
