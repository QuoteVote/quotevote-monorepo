import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  ApolloLink,
} from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { serializeObjectIds } from '../utils/objectIdSerializer'
import { getGraphqlServerUrl, getGraphqlWsServerUrl } from '../utils/getServerUrl'

// Determine if we're using a local server
const isLocalServer = process.env.REACT_APP_SERVER && process.env.REACT_APP_SERVER.includes('localhost');

const effectiveUrl = getGraphqlServerUrl()

const httpLink = createHttpLink({
  uri: effectiveUrl,
  credentials: isLocalServer ? 'include' : 'omit', // Only include credentials for local server
})

// Create an auth link that dynamically adds the authorization header
const authLink = new ApolloLink((operation, forward) => {
  // Get the token from localStorage for each request
  const token = localStorage.getItem('token')
  
  // Add the authorization header if token exists
  if (token) {
    operation.setContext({
      headers: {
        ...operation.getContext().headers,
        authorization: `Bearer ${token}`,
      },
    })
  }
  
  return forward(operation)
})

// Create a WebSocket link with enhanced reconnection handling:
// Track retry attempts to prevent infinite loops
let retryCount = 0;
let retryResetTimeout = null;
const MAX_RETRY_ATTEMPTS = 10; // Maximum retry attempts before giving up
const RETRY_RESET_DELAY = 60000; // Reset retry count after 60 seconds of no retries

const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
  url: getGraphqlWsServerUrl(),
  connectionParams: () => ({
    authToken: `Bearer ${localStorage.getItem('token')}`,
  }),
  retryAttempts: MAX_RETRY_ATTEMPTS, // Limit retry attempts
  shouldRetry: (errOrCloseEvent) => {
    // Don't retry if we've exceeded max attempts
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.warn('[WebSocket] Max retry attempts reached. Stopping retry attempts. Will reset after 60 seconds.');
      // Schedule a reset of retry count after RETRY_RESET_DELAY
      if (retryResetTimeout) {
        clearTimeout(retryResetTimeout);
      }
      retryResetTimeout = setTimeout(() => {
        retryCount = 0;
        console.log('[WebSocket] Retry count reset. Will attempt to reconnect on next failure.');
      }, RETRY_RESET_DELAY);
      return false;
    }

    // Clear any existing reset timeout since we're retrying
    if (retryResetTimeout) {
      clearTimeout(retryResetTimeout);
      retryResetTimeout = null;
    }

    // Check for specific error codes that shouldn't be retried
    if (errOrCloseEvent?.code === 1001 || errOrCloseEvent?.code === 1002) {
      // 1001: Going Away, 1002: Protocol Error - don't retry
      console.warn('[WebSocket] Error code indicates permanent failure. Not retrying.');
      return false;
    }

    // Check if connection was cleanly closed (code 1000)
    if (errOrCloseEvent?.code === 1000 && errOrCloseEvent?.wasClean) {
      console.log('[WebSocket] Connection closed cleanly. Not retrying.');
      return false;
    }

    retryCount++;
    console.log(`[WebSocket] Retry attempt ${retryCount}/${MAX_RETRY_ATTEMPTS}:`, errOrCloseEvent);
    return true;
  },
  // Exponential backoff for reconnection
  retryWait: async function* retryWait() {
    let attempt = 0;
    while (attempt < MAX_RETRY_ATTEMPTS) {
      const delay = Math.min(1000 * Math.pow(2, attempt), 30000); // Max 30 seconds
      yield new Promise((resolve) => setTimeout(resolve, delay));
      attempt++;
    }
    // After max attempts, shouldRetry will return false, so this won't be called
    // But if it is, yield a long delay as a safeguard
    while (true) {
      yield new Promise((resolve) => setTimeout(resolve, RETRY_RESET_DELAY));
    }
  },
  on: {
    opened: () => {
      // Reset retry count on successful connection
      retryCount = 0;
      if (retryResetTimeout) {
        clearTimeout(retryResetTimeout);
        retryResetTimeout = null;
      }
      console.log('[WebSocket] Connection opened');
    },
    closed: (event) => {
      console.log('[WebSocket] Connection closed', event);
    },
    error: (error) => {
      console.error('[WebSocket] Connection error:', error);
    },
  },
})) : null

// Custom link to handle ObjectID serialization
const objectIdSerializationLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.data) {
      // Recursively serialize ObjectIDs in the response
      response.data = serializeObjectIds(response.data);
    }
    return response;
  });
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = typeof window !== 'undefined' ? split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  objectIdSerializationLink.concat(authLink.concat(httpLink))
) : objectIdSerializationLink.concat(authLink.concat(httpLink))

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchKey: {
          read() {
            return ''
          },
        },
        startDateRange: {
          read() {
            return ''
          },
        },
        networkStatus: {
          read() {
            return {
              __typename: 'NetworkStatus',
              isConnected: false,
            }
          },
        },
      },
    },
  },
})

const client = new ApolloClient({
  link,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default client
