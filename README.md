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
- **SendGrid** - Email functionality (primary)
- **Nodemailer** - Email functionality (fallback)

## 📁 Project Structure

```
quotevote-monorepo/
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
   ```

   **Alternative: Install individual workspaces**

   ```bash
   # Install only client dependencies
   npm run install:client

   # Install only server dependencies
   npm run install:server
   ```

3. **Environment Setup**

   Create `.env` files in both `client/` and `server/` directories (examples provided as `.env.example` in each folder):

   **Server Environment Variables (server/.env):**

   ```env
   NODE_ENV=development
   PORT=4000
   DATABASE_URL=mongodb://localhost:27017/quote-vote
   SECRET=your-jwt-secret
   CLIENT_URL=http://localhost:3000

   # Stripe Configuration (Optional)
   STRIPE_ENVIRONMENT=sandbox
   SANDBOX_STRIPE_SECRET_KEY=your-sandbox-stripe-key
   LIVE_STRIPE_SECRET_KEY=your-live-stripe-key

   # SendGrid Email (Primary - Optional)
   SENDGRID_API_KEY=your-sendgrid-api-key
   SENDGRID_SENDER_EMAIL=noreply@yourdomain.com

   # Nodemailer SMTP (Fallback - Optional)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

   **Client Environment Variables (client/.env):**

   ```env
   REACT_APP_API_URL=http://localhost:4000/graphql
   REACT_APP_WS_URL=ws://localhost:4000/graphql
   ```

   See the [Environment Variables Reference](#-environment-variables-reference) section below for detailed descriptions.

4. **Start Development Database**

   **Option 1: Using Docker (recommended)**
   ```bash
   # macOS/Linux
   npm run dev-db-start --workspace=server

   # Windows
   docker compose -f server/dev_db/compose.yml up -d
   ```

   **Option 2: Using local MongoDB**

   Ensure MongoDB is running on `mongodb://localhost:27017`

5. **Run the Application**

   **Option 1: Run both client and server simultaneously**

   ```bash
   npm run dev
   ```

   **Option 2: Run individual services**

   ```bash
   # Terminal 1 - Backend (Windows)
   npm run dev-windows:server

   # Terminal 1 - Backend (macOS/Linux)
   npm run dev:server

   # Terminal 2 - Frontend
   npm run dev:client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql

## 🧪 Testing

### Run all tests

```bash
npm run test
```

### Server Tests

The server uses two testing frameworks:

**Run Jest tests (integration and snapshot tests)**
```bash
npm run test:server
```

**Run Mocha/Chai unit tests**
```bash
npm run unittest:server
```

### Client Tests

The client uses Vitest for unit tests and Cypress for E2E tests:

**Run Vitest unit tests**
```bash
npm run test:client
```

**Run tests in watch mode**
```bash
npm run test:watch --workspace=client
```

**Run tests with coverage**
```bash
npm run test:coverage --workspace=client
```

**Run Cypress E2E tests**
```bash
npm run cypress:open --workspace=client
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

## 🔑 Environment Variables Reference

### Server Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode (`dev`, `development`, `production`) | No | `development` |
| `PORT` | HTTP port for the GraphQL server | No | `4000` |
| `DATABASE_URL` | MongoDB connection string | **Yes** | `mongodb://localhost:27017/quote-vote` |
| `SECRET` | JWT signing secret for authentication tokens | **Yes** | - |
| `CLIENT_URL` | Base URL of the frontend (used for CORS and email links) | **Yes** | `http://localhost:3000` |
| `STRIPE_ENVIRONMENT` | Stripe environment (`sandbox` or `production`) | No | `sandbox` |
| `SANDBOX_STRIPE_SECRET_KEY` | Stripe API key for sandbox/testing | No | - |
| `LIVE_STRIPE_SECRET_KEY` | Stripe API key for production | No | - |
| `SENDGRID_API_KEY` | SendGrid API key for transactional emails | No | - |
| `SENDGRID_SENDER_EMAIL` | Verified sender email address for SendGrid | No | - |
| `EMAIL_SERVICE` | SMTP service for Nodemailer (alternative to SendGrid) | No | - |
| `EMAIL_USER` | SMTP username for Nodemailer | No | - |
| `EMAIL_PASS` | SMTP password for Nodemailer | No | - |

### Client Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_URL` | GraphQL HTTP endpoint URL | **Yes** | `http://localhost:4000/graphql` |
| `REACT_APP_WS_URL` | GraphQL WebSocket endpoint URL | **Yes** | `ws://localhost:4000/graphql` |

## 🔌 API Endpoints

### Authentication Endpoints (REST)

The application provides REST endpoints for authentication:

#### Register a New User
```bash
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Login
```bash
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Authenticate (Get Token)
```bash
POST /authenticate
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Create Guest User
```bash
POST /guest
Content-Type: application/json
```

### GraphQL API

All GraphQL requests go to `/graphql` and require an `Authorization` header with a JWT token (except for public queries).

**Example Query:**
```graphql
query {
  posts(limit: 10, offset: 0, approved: true) {
    posts {
      _id
      title
      content
      author {
        username
      }
      created
    }
    total
  }
}
```

**Example Mutation:**
```graphql
mutation {
  addPost(post: {
    title: "My Post"
    content: "Post content"
    userId: "USER_ID"
  }) {
    _id
    title
    content
  }
}
```

For a complete list of available queries and mutations, visit the GraphQL Playground at `http://localhost:4000/graphql` when the server is running.

### Key GraphQL Operations

**Queries:**
- `posts`, `post`, `featuredPosts`, `topPosts` - Post-related queries
- `users`, `user`, `searchUser` - User-related queries
- `activities` - Activity feed
- `notifications` - User notifications
- `messages`, `messageRooms` - Messaging queries
- `groups`, `group` - Group queries

**Mutations:**
- `addPost`, `approvePost`, `rejectPost`, `deletePost`, `reportPost` - Post operations
- `addVote`, `deleteVote` - Voting operations
- `addComment`, `deleteComment` - Comment operations
- `addQuote`, `deleteQuote` - Quote operations
- `followUser`, `updateUser`, `updateUserAvatar` - User operations
- `createMessage`, `deleteMessage` - Messaging operations
- `sendPasswordResetEmail`, `updateUserPassword` - Password reset
- `addStripeCustomer` - Payment operations

## 🎨 Code Quality & Formatting

### Linting

The project uses ESLint with Airbnb configuration.

**Lint all code:**
```bash
npm run lint
```

**Lint client only:**
```bash
npm run lint:client
```

**Lint server only:**
```bash
npm run lint:server
```

**Auto-fix linting issues (client):**
```bash
npm run lint:fix --workspace=client
```

### Code Formatting

The project uses Prettier for consistent code formatting.

**Configuration:**
- Single quotes
- No semicolons
- Trailing commas
- Arrow function parentheses required

**Format code (client):**
```bash
npm run prettify --workspace=client
```

### Linting Rules

**Client (`client/.eslintrc.cjs`):**
- Extends: `airbnb`, `airbnb/hooks`, `plugin:jest/recommended`
- Parser: `babel-eslint`
- Plugins: `react`, `jsx-a11y`, `cypress`, `only-warn`

**Server (`server/package.json`):**
- Extends: `airbnb/base`, `plugin:import/errors`
- Parser: `babel-eslint`

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
