import { lstatSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'assert';

const appRoot = path.resolve(import.meta.dirname, '..');
const provenance = JSON.parse(readFileSync(path.join(appRoot, '.tmp/provenance.json'), 'utf8')) as {
  snapshotRoot: string;
};
const snapshotRoot = realpathSync(provenance.snapshotRoot);
assert.ok(snapshotRoot.startsWith(`${realpathSync(path.join(appRoot, '.tmp'))}${path.sep}`));

const packages = [
  { directory: 'knockback', link: path.join(appRoot, 'node_modules/@mcpeasy/knockback'), name: '@mcpeasy/knockback', version: '2.0.15' },
  { directory: 'orm', link: path.join(appRoot, 'node_modules/backbone-orm'), name: 'backbone-orm', version: '0.7.14' },
  { directory: 'modelref', link: path.join(appRoot, 'node_modules/backbone-modelref'), name: 'backbone-modelref', version: '0.1.5' },
  { directory: 'sql', link: path.join(appRoot, 'node_modules/backbone-sql'), name: 'backbone-sql', version: '0.6.6' },
  { directory: 'mongo', link: path.join(appRoot, 'node_modules/backbone-mongo'), name: 'backbone-mongo', version: '0.6.10' },
] as const;
const appRequire = createRequire(import.meta.url);
const canonicalBackbone = realpathSync(appRequire.resolve('backbone'));

for (const entry of packages) {
  assert.ok(lstatSync(entry.link).isSymbolicLink(), `${entry.name} must be an application node_modules symlink`);
  const packageRoot = realpathSync(entry.link);
  assert.strictEqual(packageRoot, realpathSync(path.join(snapshotRoot, 'packages', entry.directory)));
  const manifest = JSON.parse(readFileSync(path.join(packageRoot, 'package.json'), 'utf8')) as { name: string; version: string };
  assert.deepStrictEqual({ name: manifest.name, version: manifest.version }, { name: entry.name, version: entry.version });
  const packageRequire = createRequire(path.join(packageRoot, 'package.json'));
  assert.strictEqual(realpathSync(packageRequire.resolve('backbone')), canonicalBackbone, `${entry.name} resolved another Backbone`);
  if (entry.directory === 'sql' || entry.directory === 'mongo') assert.strictEqual(realpathSync(packageRequire.resolve('backbone-orm')), realpathSync(appRequire.resolve('backbone-orm')), `${entry.name} resolved another ORM`);
  if (entry.directory === 'sql') {
    for (const [name, version] of [
      ['knex', '3.3.0'],
      ['pg', '8.20.0'],
    ]) {
      const providerRoot = realpathSync(path.join(appRoot, 'node_modules', name));
      assert.strictEqual(JSON.parse(readFileSync(path.join(providerRoot, 'package.json'), 'utf8')).version, version);
      assert.ok(realpathSync(appRequire.resolve(name)).startsWith(`${providerRoot}${path.sep}`));
      assert.strictEqual(realpathSync(packageRequire.resolve(name)), realpathSync(appRequire.resolve(name)), `SQL resolved another ${name}`);
    }
  }
  if (entry.directory === 'mongo') {
    assert.strictEqual(realpathSync(packageRequire.resolve('queue-cb')), realpathSync(appRequire.resolve('mongo-queue-cb')), 'Mongo did not use its exact queue alias provider');
    for (const name of ['mongodb', 'mongodb-connection-string-url']) assert.strictEqual(realpathSync(packageRequire.resolve(name)), realpathSync(appRequire.resolve(name)), `Mongo resolved another ${name}`);
  }
}

const cjsEntries = {
  knockback: appRequire.resolve('@mcpeasy/knockback'),
  modelref: appRequire.resolve('backbone-modelref'),
  orm: appRequire.resolve('backbone-orm'),
  sql: appRequire.resolve('backbone-sql'),
  mongo: appRequire.resolve('backbone-mongo'),
};
const esmEntries = {
  knockback: fileURLToPath(import.meta.resolve('@mcpeasy/knockback')),
  modelref: fileURLToPath(import.meta.resolve('backbone-modelref')),
  orm: fileURLToPath(import.meta.resolve('backbone-orm')),
  sql: fileURLToPath(import.meta.resolve('backbone-sql')),
  mongo: fileURLToPath(import.meta.resolve('backbone-mongo')),
};
const browserEntries = {
  ormBrowser: fileURLToPath(import.meta.resolve('backbone-orm/browser')),
  ormUmd: appRequire.resolve('backbone-orm/umd'),
};
for (const entry of [...Object.values(cjsEntries), ...Object.values(esmEntries), ...Object.values(browserEntries)]) {
  assert.ok(realpathSync(entry).startsWith(`${snapshotRoot}${path.sep}`), `Resolved outside the private snapshot: ${entry}`);
}

const Backbone = appRequire('backbone');
const ORM = appRequire('backbone-orm');
const ModelRef = appRequire('backbone-modelref');
const kb = appRequire('@mcpeasy/knockback');
const Mongo = appRequire('backbone-mongo');
assert.strictEqual(Mongo.Backbone, Backbone);
assert.strictEqual(Mongo.modules['backbone-orm'], ORM);
const mongoProviders = Object.fromEntries(
  [
    ['mongodb', '7.7.0'],
    ['mongodb-connection-string-url', '7.0.2'],
    ['mongo-queue-cb', '1.6.3'],
    ['queue-cb', '1.6.8'],
  ].map(([name, version]) => {
    const providerRoot = realpathSync(path.join(appRoot, 'node_modules', name));
    assert.ok(realpathSync(appRequire.resolve(name)).startsWith(`${providerRoot}${path.sep}`));
    const manifestFile = path.join(providerRoot, 'package.json');
    assert.strictEqual(JSON.parse(readFileSync(manifestFile, 'utf8')).version, version);
    assert.strictEqual(realpathSync(path.dirname(manifestFile)), realpathSync(path.join(appRoot, 'node_modules', name)));
    return [name, { version, path: realpathSync(manifestFile) }];
  })
);
assert.strictEqual(ORM.Backbone, Backbone);
assert.strictEqual(Backbone.ModelRef, ModelRef);
const identityViewModel = kb.viewModel(new Backbone.Model());
assert.ok(identityViewModel instanceof kb.ViewModel);
identityViewModel.dispose();

console.log(
  JSON.stringify({
    backbone: canonicalBackbone,
    browserEntries: Object.fromEntries(Object.entries(browserEntries).map(([key, value]) => [key, realpathSync(value)])),
    cjsEntries: Object.fromEntries(Object.entries(cjsEntries).map(([key, value]) => [key, realpathSync(value)])),
    esmEntries: Object.fromEntries(Object.entries(esmEntries).map(([key, value]) => [key, realpathSync(value)])),
    snapshotRoot,
    mongoProviders,
  })
);
