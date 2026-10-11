import { runPostgresFamily } from './dist/esm/postgres-application.js';

const result = await runPostgresFamily('esm', process.env.LOCAL_FAMILY_POSTGRES_URL);
process.stdout.write(`${JSON.stringify(result)}\n`);
