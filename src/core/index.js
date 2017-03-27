/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import _ from 'underscore';
import Backbone from 'backbone';
import ko from 'knockout';

import kb from './kb';
import CollectionObservable from './collection-observable';
import Observable from './observable';
import ViewModel from './view-model';
import configure from './configure';
import utils from './utils';
import Statistics from './statistics';
import EventWatcher from './event-watcher';
import Store from './store';
import Factory from './factory';
import './inject';

const api = {
  _,
  Backbone,
  ko,
  CollectionObservable,
  Observable,
  ViewModel,
  configure,
  utils,
  Statistics,
  EventWatcher,
  Store,
  Factory,
};
kb.assign(kb, api);

module.exports = kb;
