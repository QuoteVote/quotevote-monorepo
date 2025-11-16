import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  ApolloLink,
  from,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
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
  // Ensure proper headers are set for GraphQL requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create an auth link that dynamically adds the authorization header
const authLink = new ApolloLink((operation, forward) => {
  // Get the token from localStorage for each request
  const token = localStorage.getItem('token')
  
  // Build headers object
  const headers = {
    'Content-Type': 'application/json',
    ...operation.getContext().headers,
  }
  
  // Add the authorization header if token exists
  if (token) {
    // Remove 'Bearer ' prefix if already present to avoid duplication
    const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    headers.authorization = cleanToken
  }
  
  operation.setContext({
    headers,
  })
  
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
      // Schedule a reset of retry count after RETRY_RESET_DELAY
      if (retryResetTimeout) {
        clearTimeout(retryResetTimeout);
      }
      retryResetTimeout = setTimeout(() => {
        retryCount = 0;
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
      return false;
    }

    // Check if connection was cleanly closed (code 1000)
    if (errOrCloseEvent?.code === 1000 && errOrCloseEvent?.wasClean) {
      return false;
    }

    retryCount++;
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
    },
    closed: () => {
      // Connection closed
    },
    error: () => {
      // Connection error
    },
  },
})) : null

// Error link to handle network and GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Errors are handled silently to prevent console spam
  // You can add logging here if needed for debugging
  if (graphQLErrors) {
    // GraphQL errors handled silently
  }

  if (networkError) {
    // Network errors handled silently
  }
})

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
// Error link should be first to catch all errors
const httpLinkChain = from([
  errorLink,
  authLink,
  objectIdSerializationLink,
  httpLink,
])

const link = typeof window !== 'undefined' ? split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLinkChain
) : httpLinkChain

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
