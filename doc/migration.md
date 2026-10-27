# Adding a table

From `backend/`.

## Order

1. **Edit the schema** — add the model to `prisma/schema.prisma`.

2. **Write the migration file, without applying it.**

   ```bash
   npx prisma migrate dev --create-only
   ```

   Writes `prisma/migrations/<timestamp>_<label>/migration.sql` and stops. Read the SQL
   before it touches a database.

3. **Apply it.**

   ```bash
   npx prisma migrate deploy
   ```

   Applies every pending migration, in order. Never a single file by name.

4. **Generate the client.**

   ```bash
   npx prisma generate
   ```

   Separate from applying. The client is code, the migration is the database.

5. **Add the repository** — `src/repositories/<name>Repository.ts`, the only file that names
   the table.

6. **Point the service at it** — `src/services/<name>Service.ts` reads the repository and
   maps rows to the API type.

## Optional

- Add rows to `prisma/seed.ts` and run `npx prisma db seed`.
- Delete the seed constant in `src/constants/` once nothing reads it.

## Notes

`migrate deploy` never seeds and never creates a migration. It only applies what is already
in `prisma/migrations/`.
