/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import * as associations from '@knockback/associations';
import * as relational from '@knockback/relational';
import * as core from '@knockback/core';
import * as defaults from '@knockback/defaults';
import * as formatting from '@knockback/formatting';
import * as localization from '@knockback/localization';
import * as triggering from '@knockback/triggering';
import * as validation from '@knockback/validation';

const api = {
  associations,
  relational,
  core,
  defaults,
  formatting,
  localization,
  triggering,
  validation,
};

module.exports = api;
