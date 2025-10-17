# Quote Vote Backend Architecture Overview

This document provides a high-level overview of the file and directory structure within the `monorepo/server/` codebase. It is intended to support contributors in understanding the backend’s modular GraphQL architecture, which powers the civic deliberation infrastructure of the Quote Vote platform.

---

## Root Directory (`server`)

- **`app/`** – Core application logic, including schema, resolvers, and service integration.
- **`tests/`** – Backend unit and integration tests.
- **`package.json` / `package-lock.json`** – Node.js dependency and script definitions.
- **`.babelrc`** – Babel transpiler configuration.
- **`ecosystem.config.js`** – PM2 process manager config for deployment.
- **Project metadata files**: `README.md`, `LICENSE.md`, `.gitignore`.

---

## `app/` Directory

- **Intent**: Centralize all domain logic, data modeling, and schema composition in a single cohesive source tree.

### Structure

- **`data/`** – Houses all GraphQL implementation: schema definitions, resolvers, models, and utilities.
- **`server.js`** – Entry point for launching the Node.js + Apollo GraphQL server. Configures CORS, authentication, database connection, and WebSocket subscriptions.

---

## `app/data/` – GraphQL API Layer

This directory contains the modular GraphQL implementation logic.

### 1. **Schema Composition**

- **`schema.js`** – Assembles and exports the final `GraphQLSchema` using Apollo tooling.
- **`type_definition/`** – Defines GraphQL types, queries, mutations, and custom scalars.
  - `query_definition.js`
  - `mutation_definition.js`
  - `subscription_definition.js`
  - `scalar_definition.js`
  - `index.js`

### 2. **GraphQL Type Definitions**

- **`types/`** – Individual type definitions per domain object (e.g., `User.js`, `Post.js`, `Comment.js`).

### 3. **Resolvers**

- **Intent**: Resolvers bridge between schema types and data access logic.
- **Structure**:

  - `queries/` – Read operations grouped by feature.
  - `mutations/` – Create/update/delete operations grouped by feature.
  - `relationship/` – Fetching nested/linked resources (e.g., post author).
  - `scalars/` – Implementation of custom scalar types.
  - `models/` – Mongoose models defining persistent MongoDB schemas.
  - `utils/`, `constants/` – Shared logic and values.

- **Entry points**:
  - `index.js`
  - `queries.js`
  - `mutations.js`
  - `subscriptions.js`

### 4. **GraphQL Input Types**

- **`inputs/`** – Files such as `PostInput.js` or `UserInput.js` define structured inputs for mutations.

---

## Component Interaction Architecture

### **Client (Web Browser)**

- Runs a **React SPA** (Single Page Application).
- Renders UI using React components styled with Material-UI.
- Sends **GraphQL queries/mutations** to the backend via Apollo Client.
- Receives **subscriptions** for real-time updates.
- Manages local state and routing using client-side JavaScript.

> **Note**: This is **not** a Next.js application. There is no server-side rendering (SSR) or static generation. All rendering is handled in-browser.

---

### **Frontend Hosting**

- The React frontend is compiled into static assets and hosted independently (e.g., via Netlify, Vercel, or AWS S3/CloudFront).
- The frontend and backend are fully decoupled deployment units.

---

### **API Layer (GraphQL, Apollo Server)**

- Standalone Node.js process using **Apollo Server**.
- Responsibilities:
  - Request parsing and authentication
  - GraphQL resolver execution
  - WebSocket subscription management
- Deployed with **PM2** (see `ecosystem.config.js`)

---

### **Real-Time Subscriptions (WebSocket)**

- Implemented using Apollo Server + `graphql-ws` or equivalent.
- Enables real-time interactions like in-chat updates.
- WebSocket server listens for mutation-side events and dispatches updates to clients.

---

### **Database Layer**

- Uses **Mongoose ODM** to interface with **MongoDB Atlas**.
- Models are defined in `app/data/resolvers/models/`.
- Common schemas:
  - `UserModel.js`
  - `PostModel.js`
  - `QuoteModel.js`
  - `CommentModel.js`

---

### **Authentication**

- Likely implemented using JWT tokens or session cookies.
- Passwords are securely hashed (e.g., using bcrypt).
- Auth logic lives in custom resolver utilities and `UserModel`.

> **Governance Note**: Authentication is the boundary of user legitimacy. The logic here defines who can speak, vote, or moderate—tread thoughtfully.

---
