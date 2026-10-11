import { mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { safeRmSync } from 'fs-remove-compat';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

const appRequire = createRequire(import.meta.url);
const ormManifestFile = appRequire.resolve('backbone-orm/package.json');
const ormBrowserUmd = JSON.parse(readFileSync(ormManifestFile, 'utf8')).exports['./umd'].default;
if (typeof ormBrowserUmd !== 'string' || !ormBrowserUmd.startsWith('./')) {
  throw new Error('Expected an explicit relative browser default for backbone-orm/umd');
}
const publicAssets = new Map([
  ['/__local/underscore.js', new URL('./node_modules/underscore/underscore-umd.js', import.meta.url)],
  ['/__local/backbone.js', new URL('./node_modules/backbone/backbone.js', import.meta.url)],
  ['/__local/backbone-orm.js', new URL(ormBrowserUmd, pathToFileURL(ormManifestFile))],
  ['/__local/knockout.js', new URL('./node_modules/knockout/build/output/knockout-latest.js', import.meta.url)],
]);
const browserModules = new Map([
  ['/__local/underscore-module.js', 'export default globalThis._;'],
  ['/__local/backbone-module.js', 'export default globalThis.Backbone;'],
  ['/__local/knockout-module.js', 'export default globalThis.ko;'],
]);
const runnerRequire = createRequire(createRequire(import.meta.url).resolve('tsds-web-test-runner/createConfig.mjs'));
const { playwrightLauncher } = runnerRequire('@web/test-runner-playwright');
const scratchRoot = fileURLToPath(new URL('./.tmp/', import.meta.url));
mkdirSync(scratchRoot, { recursive: true });
const firefoxAppDataRoot = mkdtempSync(path.join(scratchRoot, 'wtr-firefox-appdata-'));
process.once('exit', () => safeRmSync(firefoxAppDataRoot, { recursive: true, force: true }));
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

const config = createConfig({
  concurrency: 1,
  concurrentBrowsers: 1,
  port: 9142,
  middleware: [
    async (context, next) => {
      if (context.path === '/__local/assert.js') {
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
      const asset = publicAssets.get(context.path);
      if (!asset) return next();
      context.type = 'application/javascript';
      context.body = await readFile(asset);
    },
  ],
  testRunnerHtml: (testRunnerImport) => `<!DOCTYPE html><html><head>
    <script src="/__local/underscore.js"></script>
    <script src="/__local/backbone.js"></script>
    <script src="/__local/backbone-orm.js"></script>
    <script>
      window.__retainedBackboneORM = window.BackboneORM;
      window.__familyScriptURLs = Array.from(document.scripts, (script) => script.src).filter(Boolean);
    </script>
    <script src="/__local/knockout.js"></script>
  </head><body><main id="app"></main><script type="module" src="${testRunnerImport}"></script></body></html>`,
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            assert: '/__local/assert.js',
            backbone: '/__local/backbone-module.js',
            knockout: '/__local/knockout-module.js',
            underscore: '/__local/underscore-module.js',
          },
        },
      },
    }),
  ],
});

// Keep app-data discovery in private suite scratch, separate from the user's Firefox state.
config.browsers = config.browsers.map((browser) => (browser.name === 'Firefox' ? playwrightLauncher({ product: 'firefox', concurrency: 1, launchOptions: { headless: true, env: { ...process.env, MOZ_APP_DATA: firefoxAppDataRoot } } }) : browser));
export default config;
