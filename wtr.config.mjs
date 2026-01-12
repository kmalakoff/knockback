import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9020,
  // Exclude ORM tests from browser - they require UMD packages that don't work with ESM bundlers
  // ORM tests run in Node.js only
  files: ['test/**/*.test.ts', '!test/unit/backbone-orm.test.ts', '!test/unit/backbone-relational.test.ts'],
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // Use ESM-compatible versions from esm.sh
            backbone: 'https://esm.sh/backbone@1.6.0',
            underscore: 'https://esm.sh/underscore@1.13.7',
            knockout: 'https://esm.sh/knockout@3.5.1',
          },
        },
      },
    }),
  ],
});
