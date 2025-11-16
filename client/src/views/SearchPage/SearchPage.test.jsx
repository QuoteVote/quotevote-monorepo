import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react'
import { MockedProvider } from '@apollo/react-testing'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import SearchPage from './index'
import { GET_TOP_POSTS } from '../../graphql/query'

const mockStore = configureStore([])

const mockPostsData = {
  posts: {
    entities: [
      {
        _id: '1',
        title: 'Post 1',
        text: 'Test post 1',
        comments: [{ _id: 'c1' }, { _id: 'c2' }],
        votes: [{ _id: 'v1' }],
        quotes: [],
        creator: { _id: 'user1', name: 'User 1', username: 'user1' },
      },
      {
        _id: '2',
        title: 'Post 2',
        text: 'Test post 2',
        comments: [{ _id: 'c3' }],
        votes: [{ _id: 'v2' }, { _id: 'v3' }],
        quotes: [{ _id: 'q1' }],
        creator: { _id: 'user2', name: 'User 2', username: 'user2' },
      },
    ],
    pagination: {
      total_count: 2,
      limit: 10,
      offset: 0,
    },
  },
}

const mocks = [
  {
    request: {
      query: GET_TOP_POSTS,
      variables: {
        limit: 12,
        offset: 0,
        searchKey: '',
        startDateRange: '',
        endDateRange: '',
        interactions: false,
        sortOrder: 'desc',
      },
    },
    result: {
      data: mockPostsData,
    },
  },
]

describe('SearchPage Filters', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      user: {
        data: {
          _id: 'currentUser',
          _followingId: ['user1'],
        },
      },
      ui: {
        hiddenPosts: [],
      },
    })
  })

  test('renders filter buttons', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchPage />
        </MockedProvider>
      </Provider>
    )

    expect(screen.getByLabelText('friends')).toBeInTheDocument()
    expect(screen.getByLabelText('filter')).toBeInTheDocument()
    expect(screen.getByLabelText('calendar')).toBeInTheDocument()
    expect(screen.getByLabelText('sort')).toBeInTheDocument()
  })

  test('friends filter works when user is logged in', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchPage />
        </MockedProvider>
      </Provider>
    )

    // Perform search first
    const searchInput = screen.getByPlaceholderText('Search...')
    const searchButton = screen.getByLabelText('search')

    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument()
    })

    // Click friends filter
    const friendsButton = screen.getByLabelText('friends')
    fireEvent.click(friendsButton)

    // Should show only posts from followed users
    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument()
      expect(screen.queryByText('Post 2')).not.toBeInTheDocument()
    })
  })

  test('interactions filter sorts posts correctly', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchPage />
        </MockedProvider>
      </Provider>
    )

    // Perform search first
    const searchInput = screen.getByPlaceholderText('Search...')
    const searchButton = screen.getByLabelText('search')

    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument()
    })

    // Click interactions filter
    const interactionsButton = screen.getByLabelText('filter')
    fireEvent.click(interactionsButton)

    // Should show posts sorted by interactions
    await waitFor(() => {
      const posts = screen.getAllByText(/Post \d/)
      // Post 2 should come first (4 interactions) before Post 1 (3 interactions)
      expect(posts[0]).toHaveTextContent('Post 2')
      expect(posts[1]).toHaveTextContent('Post 1')
    })
  })

  test('sort order toggle works correctly', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SearchPage />
        </MockedProvider>
      </Provider>
    )

    // Perform search first
    const searchInput = screen.getByPlaceholderText('Search...')
    const searchButton = screen.getByLabelText('search')

    fireEvent.change(searchInput, { target: { value: 'test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument()
    })

    // Click sort order button
    const sortButton = screen.getByLabelText('sort')
    fireEvent.click(sortButton)

    // Should show sort order is now ascending (oldest first)
    await waitFor(() => {
      expect(sortButton).toHaveTextContent('🕐')
    })

    // Click again to toggle back to descending
    fireEvent.click(sortButton)

    // Should show sort order is back to descending (newest first)
    await waitFor(() => {
      expect(sortButton).toHaveTextContent('🕓')
    })
  })

  describe('Quick Select Date Range', () => {
    test('quick select buttons apply correct date ranges', async () => {
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SearchPage />
          </MockedProvider>
        </Provider>
      )

      const dateButton = screen.getByLabelText('date range')
      fireEvent.click(dateButton)

      await waitFor(() => {
        expect(screen.getByText('Past Day')).toBeInTheDocument()
        expect(screen.getByText('Past Week')).toBeInTheDocument()
        expect(screen.getByText('Past Month')).toBeInTheDocument()
      })

      const pastWeekButton = screen.getByText('Past Week')
      fireEvent.click(pastWeekButton)

      await waitFor(() => {
        expect(screen.queryByText('Past Week')).not.toBeInTheDocument()
      })

      expect(dateButton).toHaveClass('active')
    })

    test('quick select button shows active state when selected', async () => {
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SearchPage />
          </MockedProvider>
        </Provider>
      )

      const dateButton = screen.getByLabelText('date range')
      fireEvent.click(dateButton)

      const pastDayButton = screen.getByText('Past Day')
      fireEvent.click(pastDayButton)

      fireEvent.click(dateButton)

      await waitFor(() => {
        const pastDayButtonAgain = screen.getByText('Past Day')
        expect(pastDayButtonAgain).toHaveStyle({ backgroundColor: expect.any(String) })
      })
    })

    test('manual date selection clears quick select', async () => {
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SearchPage />
          </MockedProvider>
        </Provider>
      )

      const dateButton = screen.getByLabelText('date range')
      fireEvent.click(dateButton)

      const pastMonthButton = screen.getByText('Past Month')
      fireEvent.click(pastMonthButton)

      await waitFor(() => {
        expect(screen.queryByText('Past Month')).not.toBeInTheDocument()
      })

      expect(dateButton).toHaveClass('active')
    })

    test('clear button resets both quick select and manual dates', async () => {
      render(
        <Provider store={store}>
          <MockedProvider mocks={mocks} addTypename={false}>
            <SearchPage />
          </MockedProvider>
        </Provider>
      )

      const dateButton = screen.getByLabelText('date range')
      fireEvent.click(dateButton)

      const pastWeekButton = screen.getByText('Past Week')
      fireEvent.click(pastWeekButton)

      fireEvent.click(dateButton)

      const clearButton = screen.getByText('Clear')
      fireEvent.click(clearButton)

      expect(dateButton).not.toHaveClass('active')
    })
  })
})
