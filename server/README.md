# HHSB-Apollo-GraphQL-API

Hiphop Scoreboard Graphql API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Create .env file to root directory and login to slack to get the ENV variables https://hhsb.slack.com/files/U6QLGEA8G/FDCRJLTNW/_env.txt

## .env file
```
PORT=
WS_PORT=
SECRET=
LYRICIST_TOKEN=
DATABASE_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CLIENT_URL=
REDIS_URL=redis://localhost:6379
```

## Redis Requirement

The presence feature requires Redis to be running. Install Redis and make sure it's accessible at the URL specified in REDIS_URL.

> On Windows, you can install Redis using:
```
winget install Redis.Redis
```

> Or run Redis using Docker:
```
docker run -d -p 6379:6379 redis:latest
```

## Install node modules
```
npm install
```

## Running on localhost
> On Windows
```
npm run dev
```

> On Mac OS
```
npm run dev-mac
```

### Local dev db

To use the local dev db, change your DATABASE_URL in .env to: `mongodb://localdev:password@mongo:27017/`

> Start local dockerized mongo db:
```
npm run dev-db-start
```

> Stop local dockerized mongo db:
```
npm run dev-db-stop
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
