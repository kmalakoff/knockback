import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9020,
  // Exclude ORM tests from browser:
  // - backbone-relational: UMD wrapper patches local Backbone reference, not the ESM import
  // - backbone-orm: UMD works but esm.sh bundles Node.js polyfills that fail in browsers
  //   Would need custom middleware to load UMD as global, which is complex
  files: ['test/**/*.test.ts', '!test/unit/aaa-backbone-relational.test.ts', '!test/unit/zzz-backbone-orm.test.ts'],
  plugins: [
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // Use ESM-compatible versions from esm.sh
            backbone: 'https://esm.sh/backbone@1.6.0?external=underscore',
            underscore: 'https://esm.sh/underscore@1.13.7',
            knockout: 'https://esm.sh/knockout@3.5.1',
          },
        },
      },
    }),
  ],
});
