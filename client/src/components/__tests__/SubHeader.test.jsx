/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
import React from 'react'
import { render } from '@testing-library/react'
import SubHeader from '../SubHeader'
import withTestWrapper from '../../hoc/withTestWrapper'

const SubHeaderWrapper = withTestWrapper((props) => <SubHeader headerName="" {...props} />)

describe('SubHeader test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <SubHeaderWrapper />,
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
