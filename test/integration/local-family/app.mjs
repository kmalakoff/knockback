import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ORM from 'backbone-orm';
import ko from 'knockout';
import exerciseFamily from './exercise.cjs';

const result = await exerciseFamily({ Backbone, format: 'esm', kb, ko, ModelRef, ORM });
process.stdout.write(`${JSON.stringify(result)}\n`);
