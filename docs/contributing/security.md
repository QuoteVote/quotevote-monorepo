# Security Guidelines

Security is a top priority. We appreciate your efforts to disclose vulnerabilities responsibly.

## Reporting a Vulnerability

Please do **not** open a public GitHub issue for security vulnerabilities. Instead, please email us directly at `admin@quote.vote`.

## Environment Variables

Never commit secrets or credentials to the codebase. Use environment variables for all sensitive information.

```bash
# ✅ Good: Use environment variables for secrets
JWT_SECRET=your-super-secret-key
MONGODB_URI=mongodb://localhost:27017/quote-vote

# ❌ Bad: Never commit secrets to code
const JWT_SECRET = "hardcoded-secret"; // DON'T DO THIS
```

### Input Validation

All input from external sources (user input, API responses) must be validated and sanitized.

```javascript
// ✅ Good: Validate all inputs
const createPost = async (parent, { input }, context) => {
  // Validate authentication
  if (!context.user) {
    throw new AuthenticationError('Must be logged in')
  }

  // Validate input
  if (!input.title || input.title.length < 3) {
    throw new UserInputError('Title must be at least 3 characters')
  }

  // Sanitize input to prevent XSS
  const sanitizedTitle = sanitizeHtml(input.title)
  // ... rest of resolver
}
```
