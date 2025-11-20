import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import dotenvConfig from 'dotenv';
import { logger } from './data/utils/logger';

import {
  authenticate,
  createGuestUser,
  login,
  register,
  verifyToken,
} from './data/utils/authentication';

import { schema } from './data/schema';
import requireAuth from '~/utils/requireAuth';
import { startPresenceCleanup } from './data/utils/presence/cleanupStalePresence';

if (process.env.NODE_ENV === 'dev') {
  dotenvConfig.config({ path: './.env' });
}

if (process.env.CLIENT_URL && process.env.CLIENT_URL.endsWith('/')) {
  logger.info('CLIENT_URL ends with /, removing it');
  process.env.CLIENT_URL = process.env.CLIENT_URL.slice(0, -1);
}

const GRAPHQL_PORT = process.env.PORT || 4000;

logger.info(`Database URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);

// Set mongoose global options
// Mongoose 6 defaults these to true/false correctly, so we don't need to set them manually

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 10000
      }
    });
    logger.info('MongoDB Connected...');
  } catch (err) {
    logger.error('MongoDB connection error:', err.stack);
    process.exit(1);
  }
};

connectDB();

const app = express();

// ✅ GLOBAL CORS middleware
app.use(cors({
  origin(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'https://www.quote.vote',
      'https://quote.vote',
    ];

    // Check if origin matches allowed origins or patterns
    if (allowedOrigins.includes(origin)
      || /\.netlify\.app$/.test(origin)
      || /\.quote\.vote$/.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Origin',
    'X-Requested-With',
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}));

app.use(bodyParser.json({ limit: '17mb' }));

// Handle preflight requests for GraphQL endpoint
app.options('/graphql', (req, res) => {
  res.status(200).end();
});

// Custom routes
app.post('/register', register);
app.post('/login', login);
app.post('/authenticate', authenticate);
app.post('/guest', createGuestUser);

const server = new ApolloServer({
  schema,
  introspection: true,
  tracing: true,
  cacheControl: true,
  engine: false,
  logging: { level: 'DEBUG' },
  playground: {
    settings: {
      'editor.cursorShape': 'line',
    },
  },
  context: async ({ req, connection, res }) => {
    let authToken = '';
    let isSubscription = false;
    if (connection) {
      authToken = connection.context.authorization || connection.context.token || connection.context.authToken;
      isSubscription = true;
      logger.debug('[SUBSCRIPTION CONNECTION]');
    } else {
      authToken = req.headers.authorization || req.headers.token;
    }

    const isIntrospection = req && req.body.operationName === 'IntrospectionQuery';

    if (!isIntrospection) {
      if (authToken && authToken.length) {
        try {
          const user = await verifyToken(authToken);
          return { user, res };
        } catch (error) {
          logger.debug('Invalid token, proceeding without user context:', error.message);
          return { res };
        }
      }

      if (!isSubscription) {
        const { query } = req && req.body;
        const authRequired = query && requireAuth(query);
        if (authRequired) {
          throw new AuthenticationError('Auth token not found in request');
        }
      }
    }

    return { res };
  },
});

async function startServer() {
  await server.start();

  // Apply Apollo Server middleware with explicit CORS handling
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: false,
  });

  const httpServer = createServer(app);

  // Create WebSocket server for graphql-ws protocol
  // This is needed because the client uses graphql-ws, not subscriptions-transport-ws
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // Set up graphql-ws server
  // Don't pass execute/subscribe explicitly - let graphql-ws use its own
  // This prevents "schema from another module" errors
  useServer(
    {
      schema,
      context: async (ctx) => {
        // Extract auth token from connection params
        const authToken = ctx.connectionParams?.authToken ||
          ctx.connectionParams?.authorization ||
          ctx.connectionParams?.token;

        if (authToken) {
          try {
            // Remove 'Bearer ' prefix if present
            const token = authToken.replace(/^Bearer\s+/, '');
            const user = await verifyToken(token);
            return { user };
          } catch (error) {
            logger.debug('Invalid WebSocket token, proceeding without user context:', error.message);
            return {};
          }
        }
        return {};
      },
      onConnect: (ctx) => {
        logger.debug('[graphql-ws] Client connected');
        return true; // Allow connection
      },
      onDisconnect: (ctx, code, reason) => {
        logger.debug(`[graphql-ws] Client disconnected: ${code} ${reason}`);
      },
      onError: (ctx, msg, errors) => {
        logger.error('[graphql-ws] Error:', msg, errors);
      },
    },
    wsServer,
  );

  httpServer.listen({ port: GRAPHQL_PORT }, () => {
    logger.info(`Apollo Server on http://localhost:${GRAPHQL_PORT}/graphql`);
    logger.info(`WebSocket server ready at ws://localhost:${GRAPHQL_PORT}/graphql`);
    // Start presence cleanup job
    startPresenceCleanup();
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export { GRAPHQL_PORT };
