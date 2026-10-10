// Brings the database up to date before the app starts or builds: Neon when DATABASE_URL is set, otherwise the
// built-in database in .data/pglite.
import { mkdirSync } from 'node:fs';

const folder = 'drizzle/migrations';
if (process.env.DATABASE_URL) {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');
  const { migrate } = await import('drizzle-orm/neon-http/migrator');
  await migrate(drizzle(neon(process.env.DATABASE_URL)), { migrationsFolder: folder });
  console.log('Database up to date (DATABASE_URL).');
} else {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  const dir = process.env.GUILDHALL_DATA_DIR ?? '.data/pglite';
  mkdirSync(dir, { recursive: true });
  const client = new PGlite(dir);
  await migrate(drizzle(client), { migrationsFolder: folder });
  await client.close();
  console.log(`Built-in database up to date (${dir}).`);
}
