# Quote Vote: Local Setup and Contribution Guide

This section will help you get Quote Vote running on your local machine and make your first contribution.

## 📚 Guides

### [Installation Guide](./installation.md) _(Coming Soon)_

Step-by-step instructions to:

- Install prerequisites
- Clone and set up the repository
- Configure environment variables
- Start the development servers
- Verify your installation

### [First Contribution](./first-contribution.md) _(Coming Soon)_

Make your first contribution:

- Finding good first issues
- Development workflow
- Submitting your first PR

## 🎯 Quick Start

**Prerequisites:**

- Node.js (version 18 or higher)
- MongoDB (local or cloud)
- Git

## 🚀 Setup Steps

### 1. Fork the Repository

- Go to [https://github.com/QuoteVote/quotevote-monorepo](https://github.com/QuoteVote/quotevote-monorepo).
- Click **Fork** in the top-right corner.

### 2. Clone Your Fork Locally

Replace `<your-username>` with your GitHub username:

```bash
git clone https://github.com/<your-username>/quotevote-monorepo.git
cd quotevote-monorepo
```

### 3. (Optional) Set Up Upstream Remote

```bash
git remote add upstream https://github.com/QuoteVote/quotevote-monorepo.git
```

### 4. Install Dependencies

```bash
npm run install:all
```

### 5. Copy Environment Variable Templates

Copy `.env.example` files from `client/` and `server/` to `.env` files in the same locations.

### 6. Start Development Servers

```bash
npm run dev
```

## 🔗 Access URLs

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **GraphQL Playground:** [http://localhost:4000/graphql](http://localhost:4000/graphql)

Refer to the Installation Guide for more details.

## 🤝 Contributing

See the Contributing Guidelines before submitting changes.

## 🛠 Troubleshooting

- **Port conflicts:** Ensure ports 3000 (frontend) and 4000 (backend) are available.
- **Dependency issues:** Run `npm install --legacy-peer-deps`.
- **Database connection:** Confirm MongoDB is running and `DATABASE_URL` is set correctly in `server/.env`.

For more help, check the Installation Guide or ask in Discord.

To suggest improvements, open an issue or submit a pull request.
