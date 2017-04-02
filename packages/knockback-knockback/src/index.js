/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import * as core from '@knockback/core';
import * as associations from '@knockback/backbone-associations/src/index';
import * as relational from '@knockback/backbone-relational/src/index';
import * as defaults from '@knockback/defaults/src/index';
import * as formatting from '@knockback/formatting/src/index';
import * as localization from '@knockback/localization/src/index';
import * as triggering from '@knockback/triggering/src/index';
import * as validation from '@knockback/validation/src/index';

const api = {
  core,
  associations,
  relational,
  defaults,
  formatting,
  localization,
  triggering,
  validation,
};

module.exports = api;
