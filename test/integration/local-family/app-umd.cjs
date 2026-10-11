'use strict';

const Backbone = require('backbone');
const ORM = require('backbone-orm/umd');
const kb = require('@mcpeasy/knockback');
const ModelRef = require('backbone-modelref');
const ko = require('knockout');
const exerciseFamily = require('./exercise.cjs');

exerciseFamily({ Backbone, format: 'cjs-umd', kb, ko, ModelRef, ORM }).then(
  (result) => process.stdout.write(`${JSON.stringify(result)}\n`),
  (error) => {
    console.error(error);
    process.exitCode = 1;
  }
);
