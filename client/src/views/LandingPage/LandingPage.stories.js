import React from 'react'
import LandingPage from './LandingPage'

export default {
  component: LandingPage,
  title: 'Landing Page',
}

export const Base = () => <LandingPage />
Base.story = {
  parameters: {
    jest: ['LandingPage.test.jsx'],
  },
}
