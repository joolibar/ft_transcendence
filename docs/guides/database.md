# Database guide

PostgreSQL is accessed only through [Prisma](https://www.prisma.io/docs). The schema lives in [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) and every change to it is recorded as a **migration**: a SQL file in `backend/prisma/migrations/` that Git versions like any other code.

## Starting the database

```bash
make db
```

This starts only PostgreSQL and publishes it on `localhost:5432`, using `DATABASE_URL` from `.env`. The full stack (`make`) does not publish the port: there, only the API reaches the database.

## Changing the schema

1. Edit `backend/prisma/schema.prisma`.
2. Create and apply a migration with a short, descriptive name:
   ```bash
   pnpm --filter @miga/backend db:migrate --name add-reviews
   ```
   Prisma compares the schema with the database, writes the SQL into `prisma/migrations/<timestamp>_add-reviews/` and regenerates the typed client.
3. Read the generated SQL before committing it.
4. Commit the schema change and the migration together, in the same PR as the code that uses them.

In Docker, the API applies pending migrations every time it starts (`prisma migrate deploy`), so `make re` brings the database up to date.

## Rules

- **Never edit or delete a migration that is already in `develop`.** Other people's databases have applied it. To change something, write a new migration.
- **One migration per PR** when possible, named after what it does (`add-friendships`, `add-review-rating-index`).
- **Two people changing the schema at the same time:** whoever merges second updates their branch from `develop` and recreates their migration, so migrations stay in order.

## Sorting text

The database sorts text with the rules of the Debian image ([ADR 0006](../decisions/0006-debian-base-images.md)): accents are handled correctly ("Ávila" comes before "Bilbao"), but the rules are general Unicode, not Spanish. For example "Ñam" comes before "Nube", while in Spanish "Ñ" goes after "N".

When a list must follow a language's rules exactly, sort with an ICU collation, which PostgreSQL includes:

```sql
SELECT name FROM places ORDER BY name COLLATE "es-x-icu";   -- Nube, Ñam, Oca
```

Use it in the query (or on the column, if it is always sorted that way), and add a test with accented names.

## Naming conventions

| Element    | Convention                     | Example                                 |
| ---------- | ------------------------------ | --------------------------------------- |
| Models     | PascalCase, singular           | `model Review`                          |
| Fields     | camelCase                      | `createdAt`, `placeId`                  |
| Relations  | Named after what they point to | `place Place @relation(...)`            |
| Enums      | PascalCase; values UPPER_CASE  | `enum DietLevel { PREFERENCE ALLERGY }` |
| Migrations | kebab-case, verb first         | `add-reviews`                           |

Every model has `id`, `createdAt` and `updatedAt`.

## Useful commands

| Command                                                  | What it does                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------- |
| `pnpm --filter @miga/backend db:migrate --name <name>`   | Create and apply a migration                                        |
| `pnpm --filter @miga/backend db:studio`                  | Browse and edit data in the browser                                 |
| `pnpm --filter @miga/backend exec prisma migrate reset`  | **Delete all data** and re-apply every migration (development only) |
| `pnpm --filter @miga/backend exec prisma migrate status` | Show which migrations are applied                                   |
| `make clean`                                             | Delete the Docker database volume entirely                          |

## Documenting the schema

The subject requires the README to describe the database: tables, relations, key fields and types. Whenever a migration adds or changes a model, update the "Database Schema" section of the [README](../../README.md) in the same PR.
