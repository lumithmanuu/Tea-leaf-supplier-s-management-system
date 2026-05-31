# Tea Leaf Management Backend

## Why `start:dev` was failing

The backend uses Microsoft SQL Server and expects it to be reachable at
`localhost:1433`. When nothing is listening on that port, Nest compiles
successfully but TypeORM keeps retrying with:

```text
Failed to connect to localhost:1433
```

## Quick start

1. Install dependencies.
2. Copy the environment file.
3. Start SQL Server with Docker Compose.
4. Start the Nest backend.

```bash
npm install
cp .env.example .env
npm run db:up
npm run start:dev
```

Once SQL Server is reachable, the app creates the `tea_leaf_management`
database automatically and seeds sample suppliers, grades, and collections.

## Environment

The included Docker setup matches these defaults:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=StrongPass123!
DB_NAME=tea_leaf_management
DB_SYNCHRONIZE=true
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

If you run SQL Server another way, keep `.env` aligned with your instance.
`DB_SYNCHRONIZE=true` lets TypeORM create the local development tables
automatically.

## Useful commands

```bash
npm run db:up
npm run db:down
npm run build
npm run start:dev
npm run test
```

## Manual SQL Server option

If you already have SQL Server installed locally, Docker is optional. Just make
sure:

- SQL Server is running.
- TCP connections on port `1433` are enabled.
- The `sa` login is enabled.
- The password in `.env` matches the SQL Server password.

Then run:

```bash
npm run start:dev
```
