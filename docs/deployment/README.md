# Deployment Guide

This section covers deploying Quote Vote in various environments.

## 📚 Available Guides

### [Local Development](./local-development.md) _(Coming Soon)_

Detailed local development setup:

- Development environment setup
- Hot reload configuration
- Debugging tips
- Docker setup (optional)

### [Production Deployment](./production.md) _(Coming Soon)_

Deploy to production:

- Build process
- Environment configuration
- Platform-specific guides (AWS, GCP, Azure, Vercel)
- Security considerations
- Monitoring and logging

### [Self-Hosting Guide](./self-hosting.md) _(Coming Soon)_

For organizations running their own instance:

- Server requirements
- SSO integration
- Customization options
- Data ownership
- Backup and maintenance

## 🚀 Quick Deploy

### Development (Local)

```bash
# Install dependencies
npm run install:all

# Configure environment
# Copy .env.example to .env in both client/ and server/
cp client/.env.example client/.env
cp server/.env.example server/.env

# Start development servers
npm run dev
```

Access:

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- GraphQL: http://localhost:4000/graphql

### Production Build

```bash
# Build both client and server
npm run build

# Start production server
npm run start:server

# Frontend: Deploy client/dist/ folder to hosting service
```

### 🔧 Environment Variables

- Copy `.env.example` to `.env` in both `client/` and `server/` folders.
- Edit values as needed for your environment.

### 🐳 Docker Support (Coming Soon)

Docker configuration for containerized deployment.

### 📊 Monitoring (Coming Soon)

Production monitoring and logging setup.

### 🔒 Security Considerations (Coming Soon)

Security best practices for production deployments.

---

Need deployment help? Check the detailed guides or ask in our Community Discord.  
Want to contribute deployment documentation? See our Contributing Guide.
