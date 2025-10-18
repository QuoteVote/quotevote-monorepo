// Provide a default mock for useMutation to prevent the real Apollo hooks
// from being imported during module initialization.
if (typeof vi !== 'undefined' && typeof vi.mock === 'function') {
  vi.mock('@apollo/react-hooks', async (importOriginal) => {
    const actual = await importOriginal()
    return { ...actual, useMutation: () => [vi.fn(), { loading: false, error: null, data: undefined }] }
  })
}

import React from 'react'
import { render } from '@testing-library/react'

// Component being tested
import SubmitPostForm from './SubmitPostForm'
import withTestWrapper from '../../hoc/withTestWrapper'

const SubmitPostFormWrapper = withTestWrapper(SubmitPostForm)

describe('SubmitPostForm test -', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SubmitPostFormWrapper />,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
