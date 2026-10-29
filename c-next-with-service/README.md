# Kicau

A small social app in the spirit of X/Twitter: start threads, reply, view profiles, and like posts. Built with the Next.js App Router as both frontend and backend, PostgreSQL, Drizzle ORM, Zod, and Docker Compose.

> **Docker exercise mode.** Parts of **stage 1** and **stage 2** in `Dockerfile` were intentionally removed. Stage 3 is complete and should not be changed. Your task is to fill in the missing commands in the first two stages. Hints are in [Dockerfile Exercise](#dockerfile-exercise). Until stages 1 and 2 are complete, `docker compose up --build` will fail.

## Features

- Sign up and sign in with **username + password only** (no email).
- Sessions are stored in PostgreSQL, the cookie is `httpOnly`, and passwords are hashed with bcrypt.
- Create posts and **threads** with up to 10 connected posts in one go.
- Reply to posts, including nested replies.
- Thread detail page with parent chain and replies.
- Profile page with bio, join date, post count, likes received, and Posts/Replies tabs.
- Like/unlike with optimistic UI.
- Search for people and post content.
- Light/dark theme follows the system preference, with a responsive layout and mobile bottom navigation.

## Running with Docker Compose

Complete the TODOs in stages 1 and 2 of `Dockerfile`, then run:

```bash
docker compose up -d --build
```

Open <http://localhost:3000>.

When the app container starts, stage 3 runs:

1. `bun ./src/database/migrate.js` to apply Drizzle migrations.
2. `bun ./src/database/seed.js` to add demo data, only when the `users` table is still empty.
3. `bun server.js` to start the Next.js standalone server.

Demo seeding can be disabled with `SEED_DEMO=false` in `.env`.

### Demo accounts

| Username | Password |
| --- | --- |
| `sena` | `rahasia123` |
| `bima` | `rahasia123` |
| `nara` | `rahasia123` |

### Configuration

Copy `.env.example` to `.env` if you want to change the defaults:

```bash
cp .env.example .env
```

| Variable | Default | Description |
| --- | --- | --- |
| `APP_PORT` | `3000` | App port on the host |
| `POSTGRES_PORT` | `5433` | PostgreSQL port on the host |
| `POSTGRES_USER` | `kicau` | Database user |
| `POSTGRES_PASSWORD` | `kicau` | Database password |
| `POSTGRES_DB` | `kicau` | Database name |
| `SEED_DEMO` | `true` | Seed demo data on startup |
| `COOKIE_SECURE` | `false` | Set to `true` when served over HTTPS |

Watch migration, seed, and app logs:

```bash
docker compose logs -f app
```

Stop the services:

```bash
docker compose down
```

Remove the PostgreSQL volume as well:

```bash
docker compose down -v
```

## Dockerfile Exercise

Goal: build the image in stages so dependencies and build output are not rebuilt from scratch, then ship only the artifacts the runtime needs.

### Stage 1 — `deps`

Purpose: install project dependencies once and reuse them in the next stages.

Hints for what to add:

- Copy the dependency manifest and lockfile into the image.
- Install dependencies with Bun.
- Copy the manifest before the source code so the layer cache survives source changes.
- Keep the installed packages at `/app/node_modules`, because stages 2 and 3 read from that path.

If this stage is incomplete, stage 2 will fail when it tries to use `node_modules`.

### Stage 2 — `build`

Purpose: produce the Next.js standalone artifacts consumed by stage 3.

Hints for what to add:

- Bring `node_modules` over from the `deps` stage.
- Copy the full application source into `/app`.
- Run the Next.js production build.
- Make sure the `public` folder exists, even if it only has a small file. Stage 3 copies it.
- The build must produce `.next/standalone/server.js`, `.next/static`, and the `public` folder.
- `next.config.mjs` already uses standalone output, so do not change that setting.
- A placeholder `DATABASE_URL` is provided for build-time module evaluation. Do not replace it with real credentials.

If this stage is incomplete, stage 3 will fail while copying build artifacts.

### Stage 3 — `runner` (already complete)

Do not modify this stage. Read it to understand why each command exists:

- `public`, `.next/standalone`, and `.next/static` are the build outputs required by the production server.
- `src/database` and `src/lib` are copied because migrations and seeding run outside the Next.js server process.
- `drizzle` contains the SQL migration files.
- `drizzle-orm`, `postgres`, and `bcryptjs` are copied explicitly because the migration/seed scripts use them and they are not always included in the standalone folder.
- `CMD` runs migrations, optional seeding, then `server.js`.

### Checking your work

- `docker compose build` should finish without errors.
- `docker compose up -d` should start both the `app` and `db` containers.
- The `app` logs should show migration and seed messages before the server is ready.
- Open `http://localhost:3000` and sign in with one of the demo accounts.

If you want to skip the Docker exercise for now, use the local development flow below. It does not require a completed Dockerfile.

## Local Development

The easiest path is to run PostgreSQL from Compose and Next.js on the host.

```bash
docker compose up -d db
cp .env.example .env
DATABASE_URL=postgres://kicau:kicau@localhost:5433/kicau bun run db:migrate
DATABASE_URL=postgres://kicau:kicau@localhost:5433/kicau bun run db:seed
DATABASE_URL=postgres://kicau:kicau@localhost:5433/kicau bun run dev
```

Or skip the seed and create a new account at `/signup`.

## Database Commands

```bash
bun run db:generate   # generate a migration from schema changes
bun run db:migrate    # apply existing migrations
bun run db:push       # push the schema directly (prototyping)
bun run db:seed       # add demo data (idempotent)
```

Generated migrations live in `drizzle/` and are applied automatically inside the container.

## Project Structure

```text
src/
  app/
    (auth)/            # login & signup, two-column layout
    (app)/             # feed, thread, profile, search, compose
    actions/           # server actions (auth, posts, likes)
  components/          # sidebar, mobile nav, composer, post card, etc.
  database/
    schema.js          # Drizzle schema
    index.js           # postgres.js + Drizzle connection
    migrate.js         # migration runner for the container
    seed.js            # idempotent demo data
  lib/
    auth.js            # password hashing, sessions, requireUser
    data.js            # data queries
    validation.js      # Zod schemas
    format.js          # time, numbers, avatar colors
drizzle/               # SQL migrations
Dockerfile             # multi-stage exercise (stages 1 & 2 need work)
docker-compose.yml     # postgres + app
```

## Notes

- Every app page is protected by the `(app)` layout, which calls `requireUser()`.
- Every server action re-checks the session and validates input with Zod.
- Likes use `useOptimistic`, followed by `router.refresh()` so counts and state stay in sync with the database.
- Demo data is inserted only once; seeding never overwrites existing data.
