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
# Example format for MongoDB Atlas connection string
# DATABASE_URL="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
CLIENT_URL=
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

## Prisma Pilot

We are beginning to migrate from Mongoose to [Prisma ORM](https://www.prisma.io/).
The initial `Reaction` model is defined in `prisma/schema.prisma`.

Install dependencies and generate the Prisma client:

```bash
npm install --workspace=server
npm run prisma:db-push --workspace=server
npm run prisma:generate --workspace=server
```
Ensure your `.env` has `DATABASE_URL` pointing to a MongoDB replica set instance.
Prisma Migrate does not support MongoDB. Use `prisma db push` to sync your schema.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
