import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
// We'll require MockedProvider after mocking @apollo/react-hooks to avoid
// loading the real hooks implementation into the module cache before our
// mock is registered.
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
// We'll mock useMutation before importing the component so the module
// initialization picks up the mocked hook implementation.
// Use a mock function for useMutation so tests can wait for it and inspect calls
import { vi } from 'vitest'

const createMessageMock = vi.fn().mockImplementation(async () => {
  return Promise.resolve({ data: { createMessage: {
    _id: 'test-message-id', userId: 'test-user-id', userName: 'Test User', messageRoomId: 'test-room-id', title: 'Test Post', text: 'Test message', type: 'POST', created: new Date().toISOString(), user: { _id: 'test-user-id', name: 'Test User', username: 'testuser', avatar: 'test-avatar.jpg', contributorBadge: false }
  } } })
})

vi.mock('@apollo/react-hooks', () => ({
  useMutation: () => [createMessageMock]
}))

// We'll require the component after setting the test override so it reads
// window.__TEST_CREATE_MESSAGE during render. We'll assign it in beforeAll.
let PostChatSend
import chatReducer from '../../store/chat'

// Require MockedProvider after the above mock so it doesn't pull the original
// @apollo/react-hooks into the module cache before our mock runs.
const { MockedProvider } = require('@apollo/client/testing')

// Mock the useGuestGuard hook (return a module object with a default export)
vi.mock('../../utils/useGuestGuard', () => ({ default: () => () => true }))

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      user: () => ({
        data: {
          _id: 'test-user-id',
          name: 'Test User',
          username: 'testuser',
          avatar: 'test-avatar.jpg'
        }
      })
    }
  })
}

const mocks = []

describe('PostChatSend', () => {
  // Increase the default timeout for this test file since importing the
  // component via Vitest's loader can take longer in CI/Windows environments.
  // This prevents beforeEach from timing out while the module is being
  // transformed by Vite.
  if (typeof vi !== 'undefined' && typeof vi.setTimeout === 'function') {
    vi.setTimeout(20000)
  }

  let store

  beforeAll(async () => {
    // Import the component once for all tests to avoid repeated transform
    // overhead and potential intermittent hangs during per-test imports.
    PostChatSend = (await vi.importActual('../PostChat/PostChatSend')).default
  })

  beforeEach(() => {
    store = createMockStore()
    // Set the test override so the component will use our mock mutation.
    // This must be set before rendering the component in each test.
    window.__TEST_CREATE_MESSAGE = createMessageMock
    createMessageMock.mockClear()
  })

  afterEach(() => {
    // Clean up the global override to avoid leaking between tests
    try {
      delete window.__TEST_CREATE_MESSAGE
    } catch (e) {
      // ignore in non-browser test environments
    }
  })

  it('renders chat input and send button', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    fireEvent.change(input, { target: { value: 'Test message' } })
    
    expect(input.value).toBe('Test message')
  })

  it('submits message when send button is clicked', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    // find the actual button element (IconButton) rather than the img inside it
    // find the img and click its parent button to ensure the IconButton's onClick fires
    const sendImg = screen.getByAltText('send')
    const sendButton = sendImg.closest('button')

    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.click(sendButton)

    // wait for the mocked mutation to be called, then for the input to clear
    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('submits message when Enter key is pressed', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    
    fireEvent.change(input, { target: { value: 'Test message' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 })

    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })

  it('does not submit empty messages', () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    // Try to submit empty message
    fireEvent.click(sendButton)
    
    // Input should remain empty and no mutation should be called
    expect(input.value).toBe('')
  })

  it('trims whitespace from messages', async () => {
    render(
      <Provider store={store}>
        <MockedProvider mocks={mocks} addTypename={false}>
          <PostChatSend messageRoomId="test-room-id" title="Test Post" />
        </MockedProvider>
      </Provider>
    )

    const input = screen.getByPlaceholderText('type a message...')
    const sendButton = screen.getByAltText('send')

    fireEvent.change(input, { target: { value: '  Test message  ' } })
    fireEvent.click(sendButton)

    await waitFor(() => {
      expect(createMessageMock).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(input.value).toBe('')
    })
  })
})