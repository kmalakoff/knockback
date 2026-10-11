'use strict';

const { runPostgresPivots } = require('./dist/cjs/postgres-application.js');
runPostgresPivots('cjs', process.env.LOCAL_FAMILY_POSTGRES_URL).then(
  (result) => process.stdout.write(`${JSON.stringify(result)}\n`),
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
