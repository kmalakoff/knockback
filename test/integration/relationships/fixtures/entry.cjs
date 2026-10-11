const Backbone = require('backbone');
const kb = require('@mcpeasy/knockback');
const ko = require('knockout');
const underscore = require('underscore');
const { run } = require('./exercise.cjs');

run({
  Backbone,
  kb,
  ko,
  load: async (name) => require(name),
  underscore,
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
