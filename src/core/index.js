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

import './monkey-patches';
import kb from './kb';
import CollectionObservable, { collectionObservable, compare } from './collection-observable';
import configure, { settings } from './configure';
import EventWatcher from './event-watcher';
import Factory from './factory';
import { RECUSIVE_AUTO_INJECT, injectViewModels } from './inject';
import Observable, { observable } from './observable';
import Statistics from './statistics';
import Store from './store';
import utils from './utils';
import ViewModel, { viewModel } from './view-model';

const api = {
  _,
  Backbone,
  ko,
  CollectionObservable,
  collectionObservable,
  observableCollection: collectionObservable, 
  compare,
  configure,
  settings,
  EventWatcher,
  Factory,
  RECUSIVE_AUTO_INJECT,
  injectViewModels,
  Observable,
  observable,
  Statistics,
  Store,
  utils,
  ViewModel,
  viewModel,
};
kb.assign(kb, api);

module.exports = kb;
