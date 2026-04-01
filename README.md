# node-api-test-two-ts

A small Express + TypeScript + MongoDB API with Zod validation, Swagger docs, and a simple auth/user module.

## Requirements

- Node.js
- npm
- MongoDB running locally or a reachable MongoDB connection string

## Environment Variables

The app reads environment variables from `.env`.

Current variables used by the app:

```env
DATABASE_URL=mongodb://localhost:27017/api_test_two
MONGO_DB=api_test_two
LOG_FILE=logs/trace.log
PORT=3000
PUBLIC_URL=http://localhost
API_BASE_URL=http://localhost/api
```

Notes:

- `MONGO_URI` can also be used instead of `DATABASE_URL`
- `PORT` defaults to `3000` if not set
- `PUBLIC_URL` is used in the startup log
- `API_BASE_URL` is used by the generated OpenAPI document

## Install

```bash
npm install
```

## Run

Start in development mode:

```bash
npm run dev
```

Run a TypeScript check:

```bash
npm run build
```

Start the app normally:

```bash
npm run start
```

With the current `.env`, the server will be available at:

```text
http://localhost:3000
```

## API Docs

Swagger UI:

```text
http://localhost:3000/docs
```

OpenAPI JSON:

```bash
curl http://localhost:3000/openapi.json
```

## API Endpoints

Base API path:

```text
http://localhost:3000/api
```

### Register User

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lin Thu",
    "email": "linthu@example.com",
    "password": "secret123"
  }'
```

Expected response:

```json
{
  "id": "uuid",
  "name": "Lin Thu",
  "email": "linthu@example.com"
}
```

### List Users

```bash
curl http://localhost:3000/api/users
```

Expected response:

```json
[
  {
    "id": "uuid",
    "name": "Lin Thu",
    "email": "linthu@example.com",
    "password": "hashed-password",
    "createdAt": "2026-04-01T00:00:00.000Z"
  }
]
```

## MongoDB Check

Open the Mongo shell:

```bash
mongosh "mongodb://localhost:27017/api_test_two"
```

Show saved users:

```javascript
db.users.find().pretty()
```

## Project Scripts

Defined in `package.json`:

- `npm run dev` runs the server with `tsx watch`
- `npm run build` runs `tsc --noEmit`
- `npm run start` runs the app with `tsx`
