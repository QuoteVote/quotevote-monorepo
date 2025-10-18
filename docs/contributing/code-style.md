# Code Style Guide

To maintain consistency and readability across the Quote Vote codebase, we adhere to specific code style and formatting standards. All contributors are expected to follow these guidelines.

## Formatting

We use **Prettier** for automated code formatting. This ensures a uniform style without manual effort.

- **Configuration**: The Prettier configuration is defined in the `.prettierrc` file in the root of the project.
- **Execution**: Before committing your changes, please run the formatting script to ensure your code complies with our standards:

  ```bash
  npm run format
  ```

## Linting

We use **ESLint** to catch potential errors and enforce coding best practices.

- **Configuration**: ESLint rules are defined in the `.eslintrc.cjs` file within the `client` directory and `.eslintrc` in the `server` directory.
- **Execution**: To check your code for linting errors, run:

  ```bash
  npm run lint
  ```

  Please resolve any errors or warnings reported by the linter before submitting a pull request.

## Naming Conventions

- **Components**: Use PascalCase for React components (e.g., `QuoteCard.jsx`).
- **Variables & Functions**: Use camelCase (e.g., `fetchQuotes`, `isLoading`).
- **Constants**: Use UPPER_SNAKE_CASE for constants that are hard-coded and reused across files (e.g., `MAX_QUOTES_PER_PAGE`).

## General Principles

- **Clarity Over Brevity**: Write code that is easy to understand. Add comments for complex logic, especially the _why_ behind the code, not just the _what_.
- **Modularity**: Keep components and functions small and focused on a single responsibility.
- **Imports**: Keep imports organized at the top of the file.

### File Naming

- Components: `PascalCase.jsx` (e.g., `UserProfile.jsx`)
- Utilities: `camelCase.js` (e.g., `apiHelpers.js`)

### React/JavaScript Conventions

- **Components**: Use PascalCase for React components and camelCase for props.

  ```jsx
  // ✅ Good
  const UserProfile = ({ userId, onEdit }) => {
    /* ... */
  }

  // ❌ Bad
  const userProfile = ({ user_id, on_edit }) => {
    /* ... */
  }
  ```

### GraphQL Conventions

Follow standard GraphQL conventions for types and fields.

```graphql
# ✅ Good: Descriptive names, proper casing
type User {
  id: ID!
  username: String!
  createdAt: DateTime!
}

# ❌ Bad: Unclear names, inconsistent casing
type user {
  user_id: String
  user_name: String
  created: String
}
```

## Error Handling Patterns

### Frontend Error Handling

When using Apollo Client, use the provided `loading` and `error` states to give user feedback.

```jsx
const { data, loading, error } = useQuery(GET_USER)

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />

return <UserProfile user={data.user} />
```

### Backend Error Handling

In GraphQL resolvers, use specific Apollo Server errors to provide clear feedback to the client.

```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }, context) => {
      try {
        const user = await User.findById(id)
        if (!user) {
          throw new UserInputError('User not found')
        }
        return user
      } catch (error) {
        // Avoid leaking internal errors
        throw new ApolloError('Failed to fetch user', 'USER_FETCH_ERROR')
      }
    },
  },
}
```

---

[< Back to Main Contributing Guide](../../CONTRIBUTING.md)
