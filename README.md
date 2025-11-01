# Quote Vote

A text-first civic engagement platform for creating posts, voting on specific text passages, and thoughtful discussions. Built with React/GraphQL frontend and Node.js backend, featuring targeted voting, quotes, social features, and moderation tools for transparent public dialogue.

## 🚀 Features

### Core Functionality

- **Text-First Posts**: Create and share detailed text-based content
- **Targeted Voting**: Vote on specific text passages within posts
- **Quote System**: Highlight and discuss specific quotes from content
- **Social Features**: User profiles, following, and activity feeds
- **Moderation Tools**: Admin panel for content moderation and user management
- **Real-time Chat**: Live discussions and reactions on posts
- **Search & Discovery**: Advanced search functionality with filters

### User Experience

- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Material-UI Components**: Modern, accessible interface components
- **Real-time Updates**: Live notifications and activity updates
- **Dark/Light Themes**: Customizable user interface themes
- **Accessibility**: WCAG compliant design with screen reader support

## 🛠 Tech Stack

### Frontend (`client/`)

- **React 17** - UI framework
- **GraphQL** - Data querying with Apollo Client
- **Material-UI** - Component library
- **Redux Toolkit** - State management
- **Vite** - Build tool and dev server
- **Vitest** - Testing framework
- **Cypress** - E2E testing
- **Storybook** - Component documentation

### Backend (`server/`)

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Apollo Server** - GraphQL server
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication
- **WebSocket** - Real-time subscriptions
- **Stripe** - Payment processing
- **Nodemailer** - Email functionality

## 📁 Project Structure

```
monorepo/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── views/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── graphql/        # GraphQL queries/mutations
│   │   ├── store/          # Redux store configuration
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── cypress/            # E2E tests
│   └── docs/               # Documentation
├── server/                 # Node.js backend application
│   ├── app/
│   │   ├── data/           # GraphQL schema and resolvers
│   │   ├── types/          # Type definitions
│   │   └── utils/          # Utility functions
│   ├── tests/              # Unit and integration tests
│   └── dev_db/             # Development database setup
├── package.json            # Monorepo configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 8
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd monorepo
   ```

2. **Install all dependencies (Monorepo Setup)**

   ```bash
   # Install dependencies for both client and server
   npm run install:all
   # or
   npm install --legacy-peer-deps
   ```

   **Alternative: Install individual workspaces**

   ```bash
   # Install only client dependencies
   npm run install:client

   # Install only server dependencies
   npm run install:server
   ```

3. **Environment Setup**

   Create `.env` files in both `client/` and `server/` directories:

   **Server Environment Variables:**

   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=mongodb://localhost:27017/quote-vote
   JWT_SECRET=your-jwt-secret
   STRIPE_SECRET_KEY=your-stripe-secret
   EMAIL_SERVICE=your-email-service
   EMAIL_USER=your-email-user
   EMAIL_PASS=your-email-password
   ```

   **Client Environment Variables:**

   ```env
   REACT_APP_API_URL=http://localhost:4000/graphql
   REACT_APP_WS_URL=ws://localhost:4000/graphql
   ```

4. **Start Development Database**

   ```bash
   npm run dev-db-start --workspace=server
   ```

5. **Run the Application**

   **Option 1: Run both client and server simultaneously**

   ```bash
   npm run dev
   ```

   **Option 2: Run individual services**

   ```bash
   # Terminal 1 - Backend
   npm run dev:server

   # Terminal 2 - Frontend
   npm run dev:client
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## 🧪 Testing

### Run all tests

```bash
npm run test
```

### Individual workspace testing

```bash
# Frontend tests
npm run test:client

# Backend tests
npm run test:server
```

### Frontend specific testing

```bash
npm run cypress:open --workspace=client  # E2E tests
```

## 🏗️ Development Commands

### Available Scripts

```bash
# Installation
npm run install:all        # Install all dependencies
npm run install:client     # Install client dependencies only
npm run install:server     # Install server dependencies only

# Development
npm run dev               # Run both client and server
npm run dev:client        # Run client only
npm run dev:server        # Run server only

# Building
npm run build             # Build both client and server
npm run build:client      # Build client only
npm run build:server      # Build server only

# Testing
npm run test              # Test both client and server
npm run test:client       # Test client only
npm run test:server       # Test server only

# Linting
npm run lint              # Lint both client and server
npm run lint:client       # Lint client only
npm run lint:server       # Lint server only
```

## 📚 Documentation

- **Storybook**: Component documentation and testing
  ```bash
  npm run storybook --workspace=client
  ```
- **API Documentation**: Available at GraphQL Playground
- **Component Documentation**: See `client/docs/` for detailed guides

## 💬 Chat & Presence Feature

### Overview

The Chat & Presence feature provides real-time messaging capabilities with presence indicators, typing notifications, and read receipts. Users can engage in direct conversations, see when others are online, and get feedback on message delivery status.

### API Endpoints

#### GraphQL Mutations

- `convEnsureDirect(otherUserId: ID!)` - Create or get a direct conversation with another user
- `msgSend(conversationId: ID!, body: String!)` - Send a message in a conversation (rate limited to 30 messages/minute)
- `msgTyping(conversationId: ID!, isTyping: Boolean!)` - Send typing indicator for a conversation
- `msgRead(conversationId: ID!, messageId: ID!)` - Mark a message as read
- `blockUser(userId: ID!)` - Block a user from messaging
- `unblockUser(userId: ID!)` - Unblock a previously blocked user

#### GraphQL Queries

- `conversations` - Get all conversations for the current user
- `conversation(id: ID!)` - Get details of a specific conversation including participants
- `getBlockedUsers` - Get list of currently blocked users

#### GraphQL Subscriptions

- `msgNew(conversationId: ID!)` - Subscribe to new messages in a conversation
- `msgTypingUpdate(conversationId: ID!)` - Subscribe to typing indicators in a conversation
- `receiptUpdate(conversationId: ID!)` - Subscribe to read receipt updates in a conversation

### Usage Instructions

1. **Starting a Conversation**
   - Use `convEnsureDirect` mutation to create or get a direct conversation with another user
   - Use the returned conversation ID for messaging

2. **Sending Messages**
   - Use `msgSend` mutation with conversation ID and message body
   - Messages are rate-limited to 30 per minute per user

3. **Typing Indicators**
   - Send `msgTyping(conversationId, true)` when user starts typing
   - Send `msgTyping(conversationId, false)` when user stops typing or after 2 seconds of inactivity

4. **Read Receipts**
   - Send `msgRead(conversationId, messageId)` when a message is read
   - Subscribers will receive updates through `receiptUpdate` subscription

5. **Blocking Users**
   - Use `blockUser(userId)` to prevent a user from messaging you
   - Use `unblockUser(userId)` to restore messaging capability
   - Check `getBlockedUsers` to see your blocked users list

### Real-time Features

- **Presence Indicators**: See when other users are online
- **Typing Notifications**: Real-time "User is typing..." indicators
- **Read Receipts**: Visual confirmation when messages are read
- **Instant Messaging**: Real-time message delivery with WebSocket subscriptions

### Rate Limiting & Blocking

- Users are limited to 30 messages per minute
- Blocked users cannot send messages to users who have blocked them
- Rate limiting and blocking are enforced server-side for security

## 🚀 Deployment

### Build for Production

```bash
# Build both applications
npm run build

# Or build individually
npm run build:client
npm run build:server
```

### Frontend Deployment

```bash
npm run build:client
# Deploy the client/dist/ folder to your hosting service
```

### Backend Deployment

```bash
npm run build:server
npm run start:server  # Uses PM2 for production
```

## 🔧 Troubleshooting

### Common Issues

1. **Peer dependency conflicts**

   ```bash
   # Use legacy peer deps flag
   npm install --legacy-peer-deps
   ```

2. **Port conflicts**

   - Frontend: Change port in `client/vite.config.js`
   - Backend: Change `PORT` in server `.env` file

3. **Database connection issues**

   ```bash
   # Start development database
   npm run dev-db-start --workspace=server
   ```

4. **Workspace-specific issues**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules client/node_modules server/node_modules
   npm run install:all
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Test both client and server before submitting PRs

## 📄 License

This project is licensed under the LGPL-3.0 license - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Louis Girifalco** - Creator
- **Oliver Molina** - Lead Developer
- **Neo Isaac Amao** - Developer
- **Jovan Cahiles** - Developer
- **Camila Riedel** - Designer
- **Micah Shute** - Developer
- **Sarah Naas** - Developer
- **Mike Nayyar** - Product
- **David Nicholson** - AI Developer
- **Kira Rose Wojack** - Operations
- **Robert Palmer** - Operations
- **John May** - Blockchain Developer
- **Rafael Rodríguez** - Developer
- **Vishal Thukral** - Developer
- **Matt Polini** - Developer
- **Greddys Martinez** - Designer
- **Jason Ribble** - Developer Operations
- **Krishna Biradar** - Backend Developer
- **Brahmananda Reddy** - AI Developer
- **Akunna Nwosu** - Developer
- **Jay Evans** - Mobile Developer
- **Abed Gheith** - Product
- **Jon Kolman** - Frontend Developer

## 🐛 Issues

If you encounter any issues, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## 🔗 Links

- **Repository**: [GitHub Repository]
- **Live Demo**: [Demo URL]
- **Documentation**: [Documentation URL]

---

Built with ❤️ for transparent civic engagement and thoughtful public dialogue.