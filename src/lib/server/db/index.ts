import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

// Use a default database URL if not set (for deployment)
const databaseUrl = env.DATABASE_URL || 'file:local.db';

const client = createClient({ url: databaseUrl });

export const db = drizzle(client, { schema });
