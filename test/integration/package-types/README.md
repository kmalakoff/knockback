# Package type checks

These checks compile the complete test graph and package consumers against the freshly built Knockback package. They require the reviewed unpublished `backbone-modelref` artifact; the registry package with the same 0.1.5 version is not equivalent.

Build the artifact from a clean ModelRef source directory whose files match `modelref-producer.sha256`. Its manifest and lock must include exact development dependency `tsds-build` 1.23.3. Starting without `node_modules` or `dist`, run:

```text
npm ci
npm run build
npm pack --pack-destination "<artifact-directory>" --json
```

Then prepare Knockback from a clean dependency directory. Install the artifact into an isolated staging prefix and copy only its package directory into Knockback; installing it directly at the package root can re-resolve unrelated development ranges.

```text
npm ci
npm install --prefix "<staging-directory>" --no-save --package-lock=false "<artifact-directory>/backbone-modelref-0.1.5.tgz"
node -e "require('node:fs').cpSync(process.argv[1], 'node_modules/backbone-modelref', { recursive: true, errorOnExist: true, force: false })" "<staging-directory>/node_modules/backbone-modelref"
npm run test:types
```

The type runner rejects an artifact that differs from `modelref-artifacts.sha256`, confirms that ModelRef resolves the same Backbone installation as Knockback, stages the freshly built Knockback executable and declaration files, and compiles both complete owner graphs plus the CJS, ESM, NodeNext ESM, and Node16 CJS consumers.
