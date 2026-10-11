import { runMongoFamily } from './dist/esm/mongo-application.js';

const result = await runMongoFamily('esm', process.env.LOCAL_FAMILY_MONGO_URI);
process.stdout.write(`${JSON.stringify(result)}\n`);
