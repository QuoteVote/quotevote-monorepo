// Rely on centralized Apollo mock in src/test-setup-mocks.js
import { vi } from 'vitest'
// Per-test override: make useQuery return loading state so the component
// renders the skeleton and matches the established snapshot.
vi.mock('@apollo/react-hooks', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useQuery: () => ({ loading: true, error: null, data: null }),
  }
})
import React from 'react'
import { render, act } from '@testing-library/react'

// Component being tested
import SubmitPost from './SubmitPost'
import withTestWrapper from '../../hoc/withTestWrapper'

const SubmitPostWrapper = withTestWrapper(SubmitPost)

describe('SubmitPost test -', () => {
  it('renders correctly', async () => {
    let container
    await act(async () => {
      const res = render(
        <SubmitPostWrapper />,
      )
      container = res.container
    })
    expect(container.firstChild).toMatchSnapshot()
  })
})
