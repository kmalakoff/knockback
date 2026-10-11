import { runPostgresPivots } from './dist/esm/postgres-application.js';

const result = await runPostgresPivots('esm', process.env.LOCAL_FAMILY_POSTGRES_URL);
process.stdout.write(`${JSON.stringify(result)}\n`);
