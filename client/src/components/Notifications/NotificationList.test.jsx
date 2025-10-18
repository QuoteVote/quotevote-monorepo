import React from 'react'
import { render, act } from '@testing-library/react'

// Component being tested
import NotificationLists from './NotificationLists'
import withTestWrapper from '../../hoc/withTestWrapper'

const NotificationListsWrapper = withTestWrapper(NotificationLists)

describe('NotificationLists test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <NotificationListsWrapper notifications={[]} />
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
