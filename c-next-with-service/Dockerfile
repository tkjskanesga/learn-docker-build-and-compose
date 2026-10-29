# [!] HINT [!]
# Complete stages 1 and 2 for a Next.js standalone build.
# Stage 3 is already complete and should not be modified.
# This app is served by Next.js `server.js`, not nginx.
#
# [Helper]
# - https://hub.docker.com/r/oven/bun
# - https://nextjs.org/docs/app/getting-started/deploying
# - https://docs.docker.com/build/building/multi-stage/

# Bun For Application
FROM oven/bun:alpine AS base

# Stage 1 : Install All Depedency
FROM base AS deps
WORKDIR /app
# TODO: copy the dependency manifest file into the image
# TODO: install dependencies

# Stage 2 : Building Application
FROM base AS build
WORKDIR /app
# TODO: copy node_modules from the deps stage
# TODO: copy the application source code
# Placeholder only for build-time module evaluation; runtime uses compose env.
ENV DATABASE_URL=postgres://build:build@127.0.0.1:5432/build
# TODO: run the Next.js build
# TODO: make sure the public folder exists

# Stage 3 : Production Server
FROM base AS runner

# Working directory
WORKDIR /app
# Mode environment to production
ENV NODE_ENV=production

# Copy file to basic user
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

# [MigrateDB] Database Init
COPY --from=build /app/src/database/ ./src/database
COPY --from=build /app/src/lib/ ./src/lib
COPY --from=build /app/drizzle/ ./drizzle
COPY --from=deps /app/node_modules/drizzle-orm ./node_modules/drizzle-orm
COPY --from=deps /app/node_modules/postgres ./node_modules/postgres
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Expose Port 3000
EXPOSE 3000

# Runing Server: migrate, seed demo (optional), then start
CMD ["sh", "-c", "bun ./src/database/migrate.js && if [ \"$SEED_DEMO\" = \"true\" ]; then bun ./src/database/seed.js; fi && bun server.js"]
