import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { safeRmSync } from 'fs-remove-compat';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';
import { CORE_PEER_COMBINATIONS } from './test/integration/relationships/cases.ts';
import { cleanupCorePeerArtifacts, prepareCorePeerPackageFixture } from './test/integration/relationships/package-fixture.ts';

const relationshipCandidate = new URL('./dist/umd/@mcpeasy/knockback.cjs', import.meta.url);
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const corePeerRoots = [];
process.once('exit', () => {
  for (const { root } of corePeerRoots) safeRmSync(root, { recursive: true, force: true });
  cleanupCorePeerArtifacts();
});
for (const testCase of CORE_PEER_COMBINATIONS) {
  corePeerRoots.push({
    root: await prepareCorePeerPackageFixture(repoRoot, fileURLToPath(new URL('./.tmp', import.meta.url)), testCase),
    testCase,
  });
}
const corePeerArtifacts = new Map();
const corePeerVersions = new Map();
for (const { root, testCase } of corePeerRoots) {
  const prefix = `/__core-peer/${testCase.name}`;
  const artifactPaths = {
    [`${prefix}/associations.js`]: 'node_modules/backbone-associations/backbone-associations.js',
    [`${prefix}/backbone.js`]: 'node_modules/backbone/backbone.js',
    [`${prefix}/knockback.js`]: 'node_modules/@mcpeasy/knockback/dist/umd/@mcpeasy/knockback.cjs',
    [`${prefix}/knockout.js`]: 'node_modules/knockout/build/output/knockout-latest.js',
    [`${prefix}/modelref.js`]: 'node_modules/backbone-modelref/dist/umd/backbone-modelref.cjs',
    [`${prefix}/orm.js`]: 'node_modules/backbone-orm/backbone-orm.js',
    [`${prefix}/relational.js`]: 'node_modules/backbone-relational/backbone-relational.js',
    [`${prefix}/underscore.js`]: 'node_modules/underscore/underscore-umd.js',
  };
  for (const [route, relativePath] of Object.entries(artifactPaths)) corePeerArtifacts.set(route, pathToFileURL(path.join(root, relativePath)));
  const version = (packageName) => JSON.parse(readFileSync(path.join(root, 'node_modules', packageName, 'package.json'), 'utf8')).version;
  corePeerVersions.set(
    `${prefix}/versions.json`,
    JSON.stringify({
      associations: version('backbone-associations'),
      backbone: version('backbone'),
      knockout: version('knockout'),
      modelRef: version('backbone-modelref'),
      orm: version('backbone-orm'),
      relational: version('backbone-relational'),
      underscore: version('underscore'),
    })
  );
}
const publishedBrowserArtifacts = new Map([
  ['/__browser-artifacts/underscore.js', new URL('./node_modules/underscore/underscore-umd.js', import.meta.url)],
  ['/__browser-artifacts/backbone.js', new URL('./node_modules/backbone/backbone.js', import.meta.url)],
  ['/__browser-artifacts/knockout.js', new URL('./node_modules/knockout/build/output/knockout-latest.js', import.meta.url)],
]);
const browserModules = new Map([
  ['/__browser-modules/underscore.js', 'export default globalThis._;'],
  ['/__browser-modules/backbone.js', 'export default globalThis.Backbone;'],
  ['/__browser-modules/knockout.js', 'export default globalThis.ko;'],
]);
const runnerRequire = createRequire(createRequire(import.meta.url).resolve('tsds-web-test-runner/createConfig.mjs'));
const esbuildRequire = createRequire(runnerRequire.resolve('@web/dev-server-esbuild'));
const { buildSync } = esbuildRequire('esbuild');
const assertModule = buildSync({
  bundle: true,
  define: { global: 'globalThis' },
  entryPoints: [runnerRequire.resolve('assert')],
  format: 'esm',
  platform: 'browser',
  write: false,
}).outputFiles[0].text;

export default createConfig({
  port: 9137,
  // Chromium delays dynamic iframe script events after prior test pages close, so the
  // isolated browser artifact matrix must run first in each launcher lifecycle.
  files: [
    'test/integration/relationships/browser-matrix.test.ts',
    'test/**/*.test.ts',
    '!test/integration/relationships/node-matrix.test.ts',
    '!test/unit/aaa-backbone-relational.test.ts',
    '!test/unit/zzz-backbone-orm.test.ts',
  ],
  middleware: [
    async (context, next) => {
      if (context.path === '/__browser-modules/assert.js') {
        context.type = 'application/javascript';
        context.body = assertModule;
        return;
      }
      const browserModule = browserModules.get(context.path);
      if (browserModule) {
        context.type = 'application/javascript';
        context.body = browserModule;
        return;
      }
      const publishedArtifact = publishedBrowserArtifacts.get(context.path);
      if (publishedArtifact) {
        context.type = 'application/javascript';
        context.body = await readFile(publishedArtifact);
        return;
      }
      const corePeerArtifact = corePeerArtifacts.get(context.path);
      if (corePeerArtifact) {
        context.type = 'application/javascript';
        context.body = await readFile(corePeerArtifact);
        return;
      }
      const corePeerVersion = corePeerVersions.get(context.path);
      if (corePeerVersion) {
        context.type = 'application/json';
        context.body = corePeerVersion;
        return;
      }
      if (context.path !== '/__relationship-fixtures/knockback.js') return next();
      context.type = 'application/javascript';
      context.body = await readFile(relationshipCandidate);
    },
  ],
  testRunnerHtml: (testRunnerImport) => `<!DOCTYPE html><html><head>
    <script src="/__browser-artifacts/underscore.js"></script>
    <script src="/__browser-artifacts/backbone.js"></script>
    <script src="/__browser-artifacts/knockout.js"></script>
  </head><body><script type="module" src="${testRunnerImport}"></script></body></html>`,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            assert: '/__browser-modules/assert.js',
            backbone: '/__browser-modules/backbone.js',
            underscore: '/__browser-modules/underscore.js',
            knockout: '/__browser-modules/knockout.js',
          },
        },
      },
    }),
  ],
});
