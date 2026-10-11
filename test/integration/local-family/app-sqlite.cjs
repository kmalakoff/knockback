'use strict';

const { runSQLiteFamily } = require('./dist/cjs/sqlite-application.js');
const exerciseFamily = require('./exercise.cjs');

runSQLiteFamily('cjs', exerciseFamily).then(
  (result) => process.stdout.write(`${JSON.stringify(result)}\n`),
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
