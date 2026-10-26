# Database setup

PostgreSQL, accessed through Prisma. The schema lives in
[`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) and defines two tables,
`users` and `technologies`. No application code queries them yet — the app still serves the
seed arrays in `backend/src/constants/`.

## 1. Get a PostgreSQL server

```bash
brew install postgresql@17
brew services start postgresql@17
```

Homebrew creates **no `postgres` superuser with a password**. It makes a superuser role
named after your macOS account, trusted over local connections, so the connection string
carries your username and no password.

Check it is running:

```bash
brew services list
```

`postgresql@17` should say `started`.

## 2. Point the backend at it

Copy `backend/.env.example` to `backend/.env` if you have not already, and set:

```dotenv
DATABASE_URL=postgresql://YOUR_MAC_USERNAME@localhost:5432/learning_plan
```

`whoami` prints the username. The last path segment is the database name; it does **not**
need to exist, because Prisma creates it on the first migration.

## 3. Create the tables and seed them

From `backend/`:

```bash
npx prisma migrate dev --name init
```

That writes `backend/prisma/migrations/<timestamp>_init/migration.sql`, creates
`learning_plan` if it is missing, applies the SQL, regenerates the Prisma client, and runs
the seed.

Seeding inserts the four people from `MOCK_USERS` into `users` and the 19 entries from the
Skill form's options into `technologies`. Every write is an `upsert` keyed on the unique
`name`, so running it twice changes nothing.

## 4. Look at the rows

```bash
npm run db-studio
```

Prisma Studio opens on http://localhost:5555 — browse, filter and edit rows per table. It
has no SQL console; for queries use `psql` or a client such as DBeaver, TablePlus or
Postico.

## Commands

All from `backend/`.

| Command | What it does |
| --- | --- |
| `npx prisma migrate dev --name <name>` | Write a migration from schema changes, apply it, seed |
| `npx prisma migrate deploy` | Apply existing migrations. The production path. Never seeds |
| `npx prisma migrate reset` | Drop everything, re-apply every migration, seed |
| `npx prisma db seed` | Run the seed script on its own |
| `npx prisma db push` | Sync the schema with no migration file. Prototyping only |
| `npx prisma validate` | Check the schema parses |
| `npm run db-studio` | Open the row browser |

`npx` runs the CLI from `backend/node_modules/.bin`; `prisma` is a devDependency, not a
global install.

## What creates what

Prisma never issues DDL at runtime. The server starting does not create, alter or check a
table — if one is missing you get a query error. Tables exist exactly when a migration
command has been run against that database, which is why deployment runs
`prisma migrate deploy` as its own step rather than relying on the app.

## If something goes wrong

| Symptom | Cause |
| --- | --- |
| `psql: command not found` | `postgresql@17` is keg-only; add `/opt/homebrew/opt/postgresql@17/bin` to the path. Nothing in this doc needs it |
| `connection refused` on 5432 | The service is not running: `brew services list` |
| `role "postgres" does not exist` | Homebrew named the superuser after your account, not `postgres` |
| `Environment variable not found: DATABASE_URL` | `backend/.env` is missing the line from step 2 |
