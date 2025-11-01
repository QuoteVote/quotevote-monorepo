# Quote Vote API (`server/`)

This package hosts the Quote Vote GraphQL API (Express + Apollo Server). It backs the React client located in `client/` and exposes HTTP and WebSocket endpoints for data queries, mutations, and subscriptions.

## Prerequisites

- Node.js ≥ 18
- npm ≥ 8
- MongoDB (local install or Docker)
- Environment variables defined in `server/.env` (see below)
- For optional email/Stripe integrations, corresponding credentials are required

If you have not yet set up the monorepo, start with the root [development setup guide](../docs/development-setup.md).

## Quick Start

Run the following commands from the repository root:

1. Install dependencies: `npm run install:server`
2. Copy the sample env file: `copy server\.env.example server\.env` (Windows) or `cp server/.env.example server/.env` (macOS/Linux)
3. Update `server/.env` with your secrets (at minimum `SECRET`, `DATABASE_URL`, and `CLIENT_URL`)
4. Start MongoDB locally or via Docker (`npm run dev-db-start --workspace=server` on macOS/Linux, `docker compose -f server/dev_db/compose.yml up -d` on Windows)
5. Start the development server:
	- Windows: `npm run dev-windows:server`
	- macOS/Linux: `npm run dev:server`

The API listens on `http://localhost:4000/graphql`. WebSocket subscriptions are available at `ws://localhost:4000/graphql` when the server is running.

## Environment Variables

The `.env.example` file contains the canonical variable list. Key settings include:

| Variable | Description | Required |
| --- | --- | --- |
| `NODE_ENV` | Environment mode (`dev`, `development`, `production`) | No |
| `PORT` | HTTP port for the GraphQL server (default `4000`) | No |
| `DATABASE_URL` | MongoDB connection string | **Yes** |
| `SECRET` | JWT signing secret used for authentication | **Yes** |
| `CLIENT_URL` | Base URL of the frontend used for CORS and email links | **Yes** |
| `STRIPE_ENVIRONMENT` | Stripe environment (`sandbox` or `production`) | No |
| `SANDBOX_STRIPE_SECRET_KEY` | Stripe API key for sandbox/testing | No |
| `LIVE_STRIPE_SECRET_KEY` | Stripe API key for production | No |
| `SENDGRID_API_KEY` | SendGrid API key for transactional emails (primary email service) | No |
| `SENDGRID_SENDER_EMAIL` | Verified sender email address for SendGrid | No |
| `EMAIL_SERVICE` | SMTP service for Nodemailer (fallback email service) | No |
| `EMAIL_USER` | SMTP username for Nodemailer | No |
| `EMAIL_PASS` | SMTP password for Nodemailer | No |

**Note:** The server uses `DATABASE_URL` (not the deprecated `MONGODB_URI`). SendGrid is the primary email service with Nodemailer as a fallback option. Populate optional keys only if you are working on features that require them.

## Common Scripts

Run these commands from the repository root unless noted:

| Task | Command |
| --- | --- |
| Start dev server (Windows) | `npm run dev-windows:server` |
| Start dev server (macOS/Linux) | `npm run dev:server` |
| Build for production | `npm run build:server` |
| Run Jest test suite | `npm run test:server` |
| Run Mocha unit tests | `npm run unittest:server` |
| Lint server code | `npm run lint:server` |
| Start MongoDB via Docker | `npm run dev-db-start --workspace=server` |
| Stop MongoDB via Docker | `npm run dev-db-stop --workspace=server` |

The `dev` scripts load the server with `nodemon` and transpile on the fly via `babel-node` for a smooth development experience.

## Running Tests

- `npm run test:server` executes the Jest suite (snapshot + integration style tests)
- `npm run unittest:server` runs the Mocha/Chai tests configured under `app/tests`
- Set up a test database (or use a dedicated Mongo database) when running tests that mutate data

## Deployment Notes

- Use `npm run build:server` to transpile the API into the `dist/` directory.
- The production entry point is managed by PM2 via `npm run start:server` (which invokes `pm2-runtime` with `app/ecosystem.config.js`).
- Ensure environment variables are set in your hosting environment before starting the PM2 process.

## Troubleshooting

- Connection errors to MongoDB usually indicate an incorrect `DATABASE_URL` or a service that is not yet running. Double-check credentials and launch order.
- If the server fails to start on Windows, confirm you are using `npm run dev-windows:server`. The plain `dev` script in `server/package.json` expects Windows-specific environment variable syntax.
- See the root `README.md` for additional troubleshooting commands shared across client and server.
