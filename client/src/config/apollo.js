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

// Create a WebSocket link:
const wsLink = typeof window !== 'undefined' ? new GraphQLWsLink(createClient({
  url: getGraphqlWsServerUrl(),
  connectionParams: () => ({
    authToken: `Bearer ${localStorage.getItem('token')}`,
  }),
  retryAttempts: 5,
  shouldRetry: () => true,
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
