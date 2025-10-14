# Quote Vote Architecture

This section explains how Quote Vote is designed and built.

## 📚 Available Documentation

### [Backend Architecture](./backend-architecture.md)

Details about the Node.js/GraphQL backend:

- Server structure
- GraphQL schema and resolvers
- Database models (MongoDB/Mongoose)
- Authentication & authorization
- Real-time subscriptions

### [Frontend Architecture](./frontend-architecture.md)

Details about the React frontend:

- Component structure
- Apollo Client setup
- State management (Redux Toolkit)
- Routing and layouts
- Real-time updates

### [Database Schema](./database-schema.md) _(Coming Soon)_

MongoDB collections and data models:

- User model
- Post model
- Vote model
- Comment model
- Notification model

## 🎯 Quick Overview

**Tech Stack:**

**Frontend:**

- React 17
- Apollo Client (GraphQL)
- Material-UI
- Redux Toolkit
- Vite

**Backend:**

- Node.js + Express
- Apollo Server (GraphQL)
- MongoDB + Mongoose
- JWT Authentication
- WebSocket (real-time)

**Key Features:**

- Text-first posts
- Targeted voting on text passages
- Quote highlighting system
- Real-time chat and reactions
- User profiles and social features
- Admin moderation tools

## 🏗️ System Overview _(Diagram Coming Soon)_

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│   Server    │─────▶│  Database   │
│   (React)   │◀─────│  (GraphQL)  │◀─────│  (MongoDB)  │
└─────────────┘      └─────────────┘      └─────────────┘
        │                   │
        │                   │
        └─────WebSocket─────┘
         (Real-time Updates)
```

## 📖 Detailed Documentation

The following documents provide in-depth technical details:

- **[Backend Architecture](./backend-architecture.md)** - Comprehensive backend overview
- **[Frontend Architecture](./frontend-architecture.md)** - Comprehensive frontend overview

These documents are technical and detailed. If you're new to Quote Vote, start with the Getting Started guide first!

## 🤝 Contributing to Architecture

Found something unclear or outdated? Help us improve:

- [Open an issue](https://github.com/QuoteVote/quotevote-monorepo/issues/new/choose)
- Submit improvements via PR
- See [Contributing Guidelines](../contributing/README.md)

---

**Note:** Architecture documentation is being actively improved! Visual diagrams and simplified explanations coming soon - contributions welcome!
