import { importMapsPlugin } from '@web/dev-server-import-maps';
import createConfig from 'tsds-web-test-runner/createConfig.mjs';

export default createConfig({
  port: 9020,
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
