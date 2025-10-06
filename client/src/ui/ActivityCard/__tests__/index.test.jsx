import React from 'react'
import { render } from '@testing-library/react'

import { ActivityCard } from '..'

describe('<ActivityCard  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ActivityCard />)
    expect(loadingIndicator.container.firstChild).toMatchSnapshot()
  })
})
