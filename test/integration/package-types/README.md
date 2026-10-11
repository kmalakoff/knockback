# Package type checks

These checks compile the complete test graph and package consumers against the freshly built Knockback package. They require the reviewed unpublished `backbone-modelref` artifact; the registry package with the same 0.1.5 version is not equivalent.

Build the artifact from a clean ModelRef source directory whose files match `modelref-producer.sha256`. Its manifest and lock declare `tsds-build` 1.23.3, `tsds-mocha` 1.23.13, and `tsds-validate` 1.7.9. Starting without `node_modules` or `dist`, use a private npm cache and run the ordinary project commands:

```text
TMPDIR="<private-temp>" npm ci --cache "<private-cache>"
npm run build
PLAYWRIGHT_BROWSERS_PATH="<private-browser-path>" npm test
npm run prepublishOnly
npm pack --pack-destination "<artifact-directory>" --json
```

The browser path must contain the Playwright revisions selected by the lock. The direct `wtr` command deliberately uses the package-local optional binaries installed by `npm ci`; the tsds browser wrapper replaces them with links through a personal `.iml` cache and is not valid clean-producer evidence. The Node and validation commands resolve their exact project dependencies from the clean producer's `node_modules`.

Then prepare Knockback from a clean dependency directory. Install the artifact into an isolated staging prefix and copy only its package directory into Knockback; installing it directly at the package root can re-resolve unrelated development ranges.

```text
npm ci
npm install --prefix "<staging-directory>" --no-save --package-lock=false "<artifact-directory>/backbone-modelref-0.1.5.tgz"
node -e "require('node:fs').cpSync(process.argv[1], 'node_modules/backbone-modelref', { recursive: true, errorOnExist: true, force: false })" "<staging-directory>/node_modules/backbone-modelref"
npm run test:types
```

The owner-graph runner rejects an artifact that differs from `modelref-artifacts.sha256`, including the Node16 declaration facade, confirms that ModelRef resolves the same Backbone installation as Knockback, stages the freshly built Knockback executable and declaration files, and compiles both complete owner graphs plus the full CJS, ESM, NodeNext ESM, and Node16 CJS consumers. These fixtures retain the repository's optional-plugin links so the complete owner and plugin contracts remain a separate gate.

## Test unpublished packages in applications

`npm run test:packed` is the repeatable unpublished-package gate. It packs the current built Knockback tree and the manifest-verified modern ModelRef installation with `npm pack`, then uses npm to install the tarballs into two temporary applications outside the repository's dependency ancestry. The core application has only Knockback and its runtime peers. The ModelRef application adds the verified local ModelRef tarball. Neither application contains compiler tooling, copied declaration closures, optional Backbone plugins, or `@types/knockout`.

The command runs automatically after the owner graphs in `npm run test:types`. Run it directly only after `npm run build` and after staging the reviewed ModelRef package as described above:

```text
npm run test:packed
```

The gate compiles CJS, ESM, Node16 CommonJS, and NodeNext consumers in each application using the project compiler kept outside both application dependency trees. Node16 ModelRef coverage uses direct `import ModelRef = require('backbone-modelref')`. Native CJS and ESM processes verify core lifecycle behavior; the ModelRef application additionally verifies constructability, side-effect installation, lifecycle behavior, and one shared Backbone identity. File inventories and hashes must match both npm pack results. Deliberately omitting the shipped Backbone declarations, the ModelRef package, and the ModelRef CommonJS declaration facade must make the relevant compiler leg fail. These sentinels prove the gate cannot borrow missing inputs from repository ancestors.

By default the disposable applications live under a `.tmp` directory beside the repository, which keeps them outside its `node_modules` ancestry. `KNOCKBACK_PACKED_TEST_ROOT` may select another clean parent. The runner rejects a parent whose ancestors expose Knockback, ModelRef, the Backbone declarations, or either optional Backbone plugin. A package-manager install preserves the shared peer identity; a source symlink can instead resolve dependencies from its real checkout and is not valid package-install proof.
