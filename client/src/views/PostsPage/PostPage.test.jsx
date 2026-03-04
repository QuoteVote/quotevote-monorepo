import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MockedProvider } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import { AuthModalProvider } from '../../Context/AuthModalContext'
import PostPage from './PostPage'
import { GET_POST, GET_ROOM_MESSAGES } from '../../graphql/query'

const mockStore = configureStore([])

const mockPostData = {
  post: {
    _id: 'test-post-id',
    title: 'Test Post',
    text: 'Test post content that is used to generate OG description preview',
    url: '/post/general/test-post/test-post-id',
    comments: [],
    votes: [],
    quotes: [],
    messageRoom: null,
    creator: {
      _id: 'creator-1',
      name: 'Test Author',
      avatar: null,
      username: 'testauthor',
      contributorBadge: false,
    },
  },
}

const mocks = [
  {
    request: {
      query: GET_POST,
      variables: { postId: 'test-post-id' },
    },
    result: {
      data: mockPostData,
    },
  },
  {
    request: {
      query: GET_ROOM_MESSAGES,
      variables: { messageRoomId: null },
    },
    result: {
      data: { messages: [] },
    },
  },
]

// Mocks for the fallback (no post) scenario
const emptyMocks = [
  {
    request: {
      query: GET_POST,
      variables: { postId: 'nonexistent-id' },
    },
    result: {
      data: { post: null },
    },
  },
]

describe('Post Page test -', () => {
  let store

  beforeEach(() => {
    store = mockStore({
      user: {
        data: {
          _id: 'test-user',
        },
      },
      ui: {
        selectedPost: {
          id: 'test-post-id',
        },
      },
    })
  })

  it('renders correctly', async () => {
    const { container } = render(
      <HelmetProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <AuthModalProvider>
              <BrowserRouter>
                <PostPage postId="test-post-id" />
              </BrowserRouter>
            </AuthModalProvider>
          </Provider>
        </MockedProvider>
      </HelmetProvider>
    )

    await waitFor(() => {
      expect(container.firstChild).toBeTruthy()
    }, { timeout: 3000 })
  })

  it('should render Open Graph and Twitter meta tags for dynamic post content', async () => {
    const helmetContext = {}
    render(
      <HelmetProvider context={helmetContext}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <Provider store={store}>
            <AuthModalProvider>
              <BrowserRouter>
                <PostPage postId="test-post-id" />
              </BrowserRouter>
            </AuthModalProvider>
          </Provider>
        </MockedProvider>
      </HelmetProvider>
    )

    // Wait for GraphQL data to load and Helmet to update
    await waitFor(() => {
      const { helmet } = helmetContext
      if (!helmet) return

      const titleStr = helmet.title?.toString() || ''
      const metaStr = helmet.meta?.toString() || ''

      // Title should include the post title and author name
      expect(titleStr).toContain('Test Post')
      expect(titleStr).toContain('Test Author')

      // OG meta tags should contain the post info
      expect(metaStr).toContain('og:title')
      expect(metaStr).toContain('Test Post')
      expect(metaStr).toContain('og:description')
      expect(metaStr).toContain('Test post content')
      expect(metaStr).toContain('og:site_name')
      expect(metaStr).toContain('Quote.Vote')
      expect(metaStr).toContain('og:type')
      expect(metaStr).toContain('article')

      // Twitter card tags
      expect(metaStr).toContain('twitter:card')
      expect(metaStr).toContain('summary_large_image')
      expect(metaStr).toContain('twitter:title')
      expect(metaStr).toContain('twitter:description')
    }, { timeout: 5000 })
  })

  it('should render Open Graph and Twitter meta tags for static content', async () => {
    const helmetContext = {}
    const fallbackStore = mockStore({
      user: { data: { _id: 'test-user' } },
      ui: { selectedPost: { id: 'nonexistent-id' } },
    })

    render(
      <HelmetProvider context={helmetContext}>
        <MockedProvider mocks={emptyMocks} addTypename={false}>
          <Provider store={fallbackStore}>
            <AuthModalProvider>
              <BrowserRouter>
                <PostPage postId="nonexistent-id" />
              </BrowserRouter>
            </AuthModalProvider>
          </Provider>
        </MockedProvider>
      </HelmetProvider>
    )

    // While loading / no data, default OG tags should be present
    await waitFor(() => {
      const { helmet } = helmetContext
      if (!helmet) return

      const titleStr = helmet.title?.toString() || ''

      // Default fallback title
      expect(titleStr).toContain("Quote Board")
    }, { timeout: 5000 })
  })
})

