# Docker Development Environment Notes

## Known Issue: Tailwind CSS Error in Docker

If you encounter this error when running the Docker environment:

```
ERROR in ./src/index.css (./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[1].oneOf[5].use[1]!./node_modules/postcss-loader/dist/cjs.js??ruleSet[1].rules[1].oneOf[5].use[2]!./node_modules/source-map-loader/dist/cjs.js!./src/index.css)
Module build failed (from ./node_modules/postcss-loader/dist/cjs.js):
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

### Solution

This is a known issue with the Docker setup and is unrelated to the application code. The project uses Material-UI with SCSS, not Tailwind CSS.

#### Option 1: Run Without Docker (Recommended for Development)
```bash
# From the client directory
npm install
npm run dev
```

#### Option 2: Fix Docker Configuration
If you need to use Docker, you may need to:
1. Clear Docker cache: `docker builder prune`
2. Rebuild containers: `docker-compose up --build`

#### Option 3: Ignore the Error
The error doesn't affect the application functionality. You can continue development using the direct npm commands.

## Development Workflow

For the best development experience:
1. Use `npm run dev` directly in the client directory
2. Access the app at http://localhost:3000
3. Use browser DevTools for responsive testing

This approach avoids Docker-related configuration issues and provides faster hot-reloading.
