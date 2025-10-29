# API Documentation

Quote Vote uses GraphQL for all API communication, providing a flexible and efficient way to fetch exactly the data you need.

## 🚀 Getting Started

### GraphQL Endpoint

- **Development:** `http://localhost:4000/graphql`
- **GraphQL Playground:** `http://localhost:4000/graphql` (interactive query explorer)

### Authentication

- **Method:** JWT-based authentication
- **Header:** `Authorization: Bearer <your-jwt-token>`

## 📚 Available Documentation

### [GraphQL Schema Reference](./graphql-schema.md)

Complete GraphQL schema specification including:

- **Core Types:** User, Post, Comment, Vote, Message
- **Queries:** Feed, user data, posts, comments
- **Mutations:** Create/update/delete operations
- **Subscriptions:** Real-time updates
- **Custom Scalars:** Date, ObjectId

### Key Features

- **Pagination:** Cursor-based pagination for all lists
- **Real-time:** WebSocket subscriptions for live updates
- **Type Safety:** Strongly typed schema with validation
- **Flexible Queries:** Request only the data you need

## 🔗 Quick Links

- **[Main Documentation](../README.md)** - Documentation home
- **[Getting Started](../getting-started/README.md)** - Setup and installation
- **[Contributing](../contributing/README.md)** - How to contribute

## 🚧 Coming Soon

We're actively working on expanding our API documentation:

- **API Quick Start Guide** - Common patterns and examples
- **Authentication Guide** - Detailed auth implementation
- **Error Handling Patterns** - Best practices for error management
- **Code Examples** - JavaScript/TypeScript snippets
- **Integration Tutorials** - Step-by-step guides

---

**Need help?** Check our [Contributing Guidelines](../contributing/README.md) or open an issue on GitHub.
