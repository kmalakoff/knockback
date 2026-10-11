# Package type checks

These checks compile the complete test graph and package consumers against the freshly built Knockback package. Knockback declares the current local ModelRef producer through `backbone-modelref: file:../backbone-modelref`. The registry package with the same 0.1.5 version has a different layout.

The selected ModelRef producer must already have its current build, including executable files, declarations and the CommonJS declaration facade under `types`. Install it as a regular dependency from the Knockback package root, then run the existing type checks:

```text
npm install --install-links
npm run test:types
```

The shared ModelRef check reads the producer path from Knockback's dependency declaration and compares its package.json, executable/declaration inventory and root types with the installed package. It requires the declared package targets to exist and ModelRef to resolve the same Backbone installation as Knockback. The owner-graph runner stages the freshly built Knockback executable and declaration files and compiles both complete owner graphs plus the full CJS, ESM, NodeNext ESM, and Node16 CJS consumers. These fixtures retain the repository's optional-plugin links so the complete owner and plugin contracts remain a separate gate.

`modelref-producer.sha256` and `modelref-artifacts.sha256` preserve the historical candidate used by the local-family fixture. Current consumer checks compare against the manifest-selected producer independently of those frozen lists.

## Test unpublished packages in applications

`npm run test:packed` is the repeatable unpublished-package gate. It packs the current built Knockback tree and the verified regular ModelRef installation with `npm pack`, then uses npm to install the tarballs into two temporary applications outside the repository's dependency ancestry. The core application has only Knockback and its runtime peers. The ModelRef application adds the verified local ModelRef tarball. Neither application contains compiler tooling, copied declaration closures, optional Backbone plugins, or `@types/knockout`.

The command runs automatically after the owner graphs in `npm run test:types`. Run it directly only after `npm run build` and with the current ModelRef package installed as described above:

```text
npm run test:packed
```

The gate compiles CJS, ESM, Node16 CommonJS, and NodeNext consumers in each application using the project compiler kept outside both application dependency trees. Node16 ModelRef coverage uses direct `import ModelRef = require('backbone-modelref')`. Native CJS and ESM processes verify core lifecycle behavior; the ModelRef application additionally verifies constructability, side-effect installation, lifecycle behavior, and one shared Backbone identity. File inventories and hashes must match both npm pack results. Deliberately omitting the shipped Backbone declarations, the ModelRef package, and the ModelRef CommonJS declaration facade must make the relevant compiler leg fail. These sentinels prove the gate cannot borrow missing inputs from repository ancestors.

By default the disposable applications live under a `.tmp` directory beside the repository, which keeps them outside its `node_modules` ancestry. `KNOCKBACK_PACKED_TEST_ROOT` may select another clean parent. The runner rejects a parent whose ancestors expose Knockback, ModelRef, the Backbone declarations, or either optional Backbone plugin. A package-manager install preserves the shared peer identity; a source symlink can instead resolve dependencies from its real checkout and is not valid package-install proof.
