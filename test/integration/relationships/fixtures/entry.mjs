import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ko from 'knockout';
import underscore from 'underscore';
import exercise from './exercise.cjs';

await exercise.run({
  Backbone,
  kb,
  ko,
  load: (name) => import(name),
  underscore,
});
