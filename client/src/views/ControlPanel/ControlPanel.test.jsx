import React from 'react'
import { render, waitFor } from '@testing-library/react'

// Component being tested
import ControlPanel from './ControlPanel'
import withTestWrapper from '../../hoc/withTestWrapper'

const ControlPanelWrapper = withTestWrapper(ControlPanel)

describe('ControlPanel test -', () => {
  it('renders correctly', async () => {
    const { container } = render(
      <ControlPanelWrapper />,
    )
    // Wait for any asynchronous updates triggered on mount to complete
    // This avoids React's "not wrapped in act(...)" warning in tests.
    await waitFor(() => {
      expect(container.firstChild).toMatchSnapshot()
    })
  })
})
