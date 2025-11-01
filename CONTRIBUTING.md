# Contributing to Quote Vote

First off, thank you for considering contributing to Quote Vote! We welcome any help, from reporting a bug to submitting a feature that can improve the platform for everyone.

This document provides a high-level overview of the contribution process. For more detailed instructions, please refer to the specific guides in our `docs/contributing` directory.

## Quick Links

Guide                                                               | Description                                           
------------------------------------------------------------------- | -----------------------------------------------------
[Code of Conduct](./quote_vote_code_of_conduct.md)                  | Our community standards and expectations.             
[Code Style Guide](./docs/contributing/code-style.md)               | How to format your code and run the linter.           
[Testing Guidelines](./docs/contributing/testing.md)                | How to run tests and what we expect for coverage.     
[Pull Request Process](./docs/contributing/pull-request-process.md) | The end-to-end process for submitting a contribution. 
[Security Guidelines](./docs/contributing/security.md)              | Our responsible disclosure and security policies.     

## Development Setup

### Prerequisites

- **Node.js**: Version 18+
- **MongoDB**: Local instance or MongoDB Atlas account
- **Git**: Latest version

### Quick Setup

1. **Fork and Clone**

   ```bash
   git clone https://github.com/YOUR_USERNAME/quotevote-monorepo.git
   cd quotevote-monorepo
   ```

2. **Install Dependencies**

   ```bash
   # Install dependencies for both client and server (recommended)
   npm run install:all

   # Or install individually
   npm run install:client
   npm run install:server
   ```

3. **Environment Configuration**

   ```bash
   # From the root directory, copy example environment files
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

   **Required Server Environment Variables (`server/.env`):**
   ```env
   DATABASE_URL=mongodb://localhost:27017/quote-vote
   SECRET=your-jwt-secret-key
   CLIENT_URL=http://localhost:3000
   ```

   **Required Client Environment Variables (`client/.env`):**
   ```env
   REACT_APP_API_URL=http://localhost:4000/graphql
   REACT_APP_WS_URL=ws://localhost:4000/graphql
   ```

   See the main [README.md](./README.md#-environment-variables-reference) for a complete list of environment variables.

4. **Start MongoDB**

   ```bash
   # Using Docker (recommended)
   # macOS/Linux
   npm run dev-db-start --workspace=server

   # Windows
   docker compose -f server/dev_db/compose.yml up -d

   # Or use your local MongoDB installation
   ```

5. **Start Development Servers**

   ```bash
   # Option 1: Run both client and server simultaneously
   npm run dev

   # Option 2: Run individually
   # Terminal 1: Start backend
   npm run dev-windows:server  # Windows
   npm run dev:server          # macOS/Linux

   # Terminal 2: Start frontend
   npm run dev:client
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - GraphQL Playground: http://localhost:4000/graphql

## How to Contribute

We welcome many types of contributions, including:

- **Reporting Bugs**: If you find a bug, please open an issue and provide as much detail as possible.
- **Suggesting Enhancements**: Have an idea for a new feature or an improvement? Let us know by opening an issue.
- **Writing Code**: Help us improve the codebase by fixing bugs or adding new features.
- **Improving Documentation**: If you see an opportunity to make our documentation clearer or more complete, we welcome your input.

### Finding an Issue to Work On

A great way to start is by checking the [open issues](https://github.com/QuoteVote/quotevote-monorepo/issues). Look for issues labeled `good first issue` or `help wanted`.

## Our Development Process

We have a structured process to ensure code quality and consistency. Before you start writing code, we recommend reading our detailed guides:

1. **[Code Style Guide](./docs/contributing/code-style.md)**: This guide explains our formatting and linting standards. We use Prettier and ESLint to automate this.

2. **[Testing Guidelines](./docs/contributing/testing.md)**: All contributions must include tests. This document outlines how to run the test suites and our expectations for test coverage.

3. **[Pull Request Process](./docs/contributing/pull-request-process.md)**: This guide provides a step-by-step walkthrough of how to submit a pull request, from forking the repository to the review process.

## Questions?

If you have any questions, feel free to open an issue or reach out to the maintainers. We're here to help!
