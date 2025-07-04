import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import dotenvConfig from 'dotenv';
import { logger } from './data/utils/logger';
import prisma from './data/utils/prisma';

import {
  authenticate,
  createGuestUser,
  login,
  register,
  verifyToken,
} from './data/utils/authentication';

import { schema } from './data/schema';
import requireAuth from '~/utils/requireAuth';

if (process.env.NODE_ENV === 'dev') {
  dotenvConfig.config({ path: './.env' });
}

const GRAPHQL_PORT = process.env.PORT || 3000;

logger.info('Database', process.env.DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

// ✅ GLOBAL CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://www.quote.vote',
      'https://quote.vote',
    ];
    
    // Check if origin matches allowed origins or patterns
    if (allowedOrigins.includes(origin) || 
        /\.netlify\.app$/.test(origin) || 
        /\.quote\.vote$/.test(origin)) {
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
      console.log('[SUBSCRIPTION CONNECTION]');
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
          console.log('Invalid token, proceeding without user context:', error.message);
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
  
  // Apollo Server v3 handles subscriptions automatically when using applyMiddleware
  // No need for installSubscriptionHandlers

  httpServer.listen({ port: GRAPHQL_PORT }, () => {
    console.log(`Apollo Server on http://localhost:${GRAPHQL_PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { GRAPHQL_PORT };
