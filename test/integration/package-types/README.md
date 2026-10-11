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

The type runner rejects an artifact that differs from `modelref-artifacts.sha256`, confirms that ModelRef resolves the same Backbone installation as Knockback, stages the freshly built Knockback executable and declaration files, and compiles both complete owner graphs plus the CJS, ESM, NodeNext ESM, and Node16 CJS consumers. A second consumer set imports only Knockback and ordinary Backbone; its negative assertion verifies that Knockback ships the Backbone declarations referenced by its public declarations. Knockout supplies its own declarations, and optional Backbone plugins remain optional.

## Test unpublished packages in an application

Build and pack each package from a clean source copy rather than linking either source directory. The ModelRef commands above produce its tarball. From a clean Knockback copy, run:

```text
npm ci
npm run build
npm pack --pack-destination "<artifact-directory>" --json
```

Create a clean application and install only the two local tarballs plus Knockback's runtime peers:

```text
npm init --yes
npm install "<artifact-directory>/mcpeasy-knockback-2.0.15.tgz" \
  "<artifact-directory>/backbone-modelref-0.1.5.tgz" \
  backbone@1.6.1 knockout@3.5.1 underscore@1.13.8
```

Use normal package imports in CommonJS and ESM, then confirm that the application and ModelRef resolve the same Backbone package:

```text
node -e "const fs=require('node:fs'),path=require('node:path'),{createRequire}=require('node:module'),app=createRequire(path.join(process.cwd(),'package.json')),modelRef=createRequire(app.resolve('backbone-modelref/package.json')),a=fs.realpathSync(app.resolve('backbone')),b=fs.realpathSync(modelRef.resolve('backbone'));if(a!==b)throw new Error(a+' != '+b);console.log(a)"
```

A package-manager install preserves that shared peer identity. Directly symlinking a package source directory can instead resolve dependencies relative to the symlink's real source path, accidentally use that checkout's `node_modules`, and create a second Backbone identity; do not use a source symlink as package-install proof.
