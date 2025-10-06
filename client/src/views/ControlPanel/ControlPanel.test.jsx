import React from 'react'
import { render } from '@testing-library/react'

// Component being tested
import ControlPanel from './ControlPanel'
import withTestWrapper from '../../hoc/withTestWrapper'

const ControlPanelWrapper = withTestWrapper(ControlPanel)

describe('ControlPanel test -', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ControlPanelWrapper />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
