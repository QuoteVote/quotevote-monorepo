import React from 'react'
import { render, act } from '@testing-library/react'
import { vi } from 'vitest'

// Component being tested
import Notification from './Notification'
import withTestWrapper from '../../hoc/withTestWrapper'

// Provide minimal props the component expects so PropTypes warnings don't appear
const TestNotification = (props) => <Notification {...props} />
const NotificationWrapper = withTestWrapper(TestNotification)

describe('Notification test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <NotificationWrapper loading={false} notifications={[]} />,
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
