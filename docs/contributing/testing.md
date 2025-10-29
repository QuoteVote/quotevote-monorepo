# Testing Guidelines

To ensure the stability and quality of Quote Vote, we require all contributions to be accompanied by relevant tests. This document outlines our testing requirements and how to run the test suites.

## General Requirements

- **New Features**: Any new feature must include a corresponding suite of tests to validate its functionality.
- **Bug Fixes**: When fixing a bug, please add a test case that reproduces the bug and verifies that your fix resolves it.
- **Coverage**: Aim to maintain or increase the existing test coverage. Pull requests that decrease coverage may not be accepted.

## Frontend (Client)

The client-side application uses **Vitest** for unit and integration testing and **Cypress** for end-to-end testing.

### Running Unit & Integration Tests

To run the Vitest test suite in watch mode:

```bash
# Navigate to the client directory
cd client

# Run the tests
npm test
```

To run the tests with coverage reports:

```bash
npm run test:coverage
```

### Running End-to-End Tests

End-to-end tests are handled by Cypress. To run them:

```bash
# Navigate to the client directory
cd client

# Open the Cypress test runner
npm run cypress:open
```

## Backend (Server)

The server-side application uses both **Jest** and **Mocha** for its tests.

- **Mocha** is used for unit tests, which are located in `server/app/tests/unit`. To run them, use the `unittest` script.
- **Jest** is used for integration tests, which are located in `server/app/tests/integration`. To run them, use the `test` script.

Do not run the same test files with both frameworks. If you need to add a test, place it in the appropriate directory for the framework.

### Running Tests

To run the backend test suites:

```bash
# Navigate to the server directory
cd server

# Run Mocha unit tests
npm run unittest

# Run Jest integration tests
npm test
```

Before submitting a pull request, please ensure that all tests pass for both the client and server.

---

[< Back to Main Contributing Guide](../../CONTRIBUTING.md)
