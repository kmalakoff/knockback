'use strict';
const { runMongoFamily } = require('./dist/cjs/mongo-application.js');
runMongoFamily('cjs', process.env.LOCAL_FAMILY_MONGO_URI).then(
  (result) => process.stdout.write(`${JSON.stringify(result)}\n`),
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
