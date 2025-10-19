# Quote Vote Architecture

This section explains how Quote Vote is designed and built.

## 📚 Available Documentation

### [Backend Architecture](./backend-architecture.md)

Comprehensive technical overview of the Node.js/GraphQL backend:

- Server structure and organization
- GraphQL schema and resolver implementation
- Database models (MongoDB/Mongoose)
- Authentication and authorization
- Real-time subscriptions via WebSocket
- Component interaction patterns

**Note:** This is a detailed technical document. If you're new to Quote Vote, consider starting with the [Getting Started Guide](../getting-started/) first.

### [Frontend Architecture](./frontend-architecture.md)

Comprehensive technical overview of the React frontend:

- Component structure and organization
- Apollo Client setup and configuration
- State management patterns (Redux Toolkit + Apollo Client Cache)
- Routing and layout system
- Real-time updates implementation
- Build and deployment pipeline

### [Database Schema](./database-schema.md)

MongoDB collections and data models:

- User model and relationships
- Post model and voting structure
- Comment and notification models
- Indexing strategy
- Data relationships and queries

**Note:** This document describes the database structure in detail. Future updates will include ER diagrams and query examples.

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
