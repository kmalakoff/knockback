/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import kb from '../../core';
import LocalizedObservable, { localizedObservable } from './localized-observable';

// Locale Manager - if you are using localization, set this property.
// It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
const api = {
  locale_manager: undefined,
  LocalizedObservable,
  localizedObservable,
};
kb.assign(kb, api);

kb.LocalizedObservable = LocalizedObservable;
export default kb;
