import { runSQLiteFamily } from './dist/esm/sqlite-application.js';
import exerciseFamily from './exercise.cjs';

const result = await runSQLiteFamily('esm', exerciseFamily);
process.stdout.write(`${JSON.stringify(result)}\n`);
