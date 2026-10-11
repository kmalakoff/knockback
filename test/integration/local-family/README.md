# Local family integration

This private application exercises local Knockback, BackboneORM, ModelRef, BackboneSQL and BackboneMongo payloads through real `node_modules` symlinks. It installs Backbone once and links every staged family package to that canonical instance. SQL and Mongo link directly to the same staged ORM package used by the application.

`accepted.json` pins the reviewed inputs. Refresh preview verifies the complete FAMILY Knockback source/build, ModelRef provenance and sealed ORM/SQL/Mongo payloads. Execution packs only the accepted FAMILY Knockback build, copies sealed tarballs and manifests, verifies complete extracted payloads, creates or reuses a private snapshot under `.tmp/snapshots`, and replaces five application package symlinks. It never rebuilds a producer or deletes an existing snapshot. Disposable npm extraction dependencies do not enter the immutable snapshot.

This is not a clean-clone bootstrap. It requires prepared accepted tarballs/manifests, the matching FAMILY source/build and private locked fixture tooling. The private Mongo input contains exactly its accepted 82-file payload. SQL's preserved producer manifest pins its historical ORM tar; actual local links use the selected shared ORM. Producer manifests remain unchanged. This fixture does not establish registry portability.

On this machine, use the existing macOS resource guard from this directory. A resource refusal stops the sequence; do not retry or bypass it.

```sh
node /Users/kevin/Dev/Projects/knockback-v2/knockback-v2/.worktrees/family-integration/scripts/test-safe.ts -- npm run refresh
node /Users/kevin/Dev/Projects/knockback-v2/knockback-v2/.worktrees/family-integration/scripts/test-safe.ts -- npm run refresh:execute
node /Users/kevin/Dev/Projects/knockback-v2/knockback-v2/.worktrees/family-integration/scripts/test-safe.ts -- npm test
```

Tooling requires current modern Node. Native SQLite and PostgreSQL children require an already-installed exact Node20.20.2 available to the fixture-local `node-exec-path` 1.2.4 PATH scanner. The runner checks version and ABI115 before using it, then prepends that verified executable's directory only to native-child PATH. Keep modern Node first for tooling commands and make the preinstalled Node20 bin directory reachable later on PATH, or supply the scanner environment when running the dedicated guarded runtime probe. No runtime is downloaded and there is no current-Node fallback.

Install locked dependencies with hooks disabled, using Node20's compatible npm and a private fixture cache. Enable only the reviewed `better-sqlite3` 11.10.0 install hook through a targeted rebuild on Node20.20.2; Knex remains exactly3.3.0. Do not rebuild this driver on Node26. These host prerequisites are not a cross-platform support claim.

Before any dependency install in an already linked fixture, preview and execute install preparation from this directory:

```sh
node /Users/kevin/Dev/Projects/knockback-v2/knockback-v2/.worktrees/family-integration/scripts/test-safe.ts -- node scripts/refresh.ts --prepare-install
node /Users/kevin/Dev/Projects/knockback-v2/knockback-v2/.worktrees/family-integration/scripts/test-safe.ts -- node scripts/refresh.ts --prepare-install --execute
```

Preparation checks the selected snapshot against its retained package/tar provenance, all eight dependency links and all five application link owners before detaching anything. Execution writes an exact link receipt under `.tmp/install-preparation-receipts`, then nonrecursively unlinks only those five application links. It does not run npm, repair snapshot dependencies or remove a snapshot. npm can otherwise traverse these undeclared local package links and remove dependency links inside their snapshot targets even with hooks disabled.

Only after successful detachment, run the normal approved guarded dependency install with the hook/runtime/cache policy above. Then run the existing guarded refresh preview, refresh:execute and tests. The application is intentionally unlinked between preparation and refresh; an install failure leaves snapshots preserved, not an automatically restored application. A partial detach or receipt-persistence failure stops the workflow and reports the receipt and completed links. Do not install, repeat detachment or adopt a replacement link in that state. Normal refresh remains unchanged and installs extraction dependencies only in disposable roots. This is not clean-clone provisioning. Historical snapshots share the fixture's mutable dependency providers, so their preserved links do not freeze provider bytes across dependency updates.

Mongo runtime providers are mongodb exactly7.7.0 and mongodb-connection-string-url exactly7.0.2. The fixture alias `mongo-queue-cb` installs queue-cb exactly1.6.3; the staged Mongo package links it under the canonical dependency name `queue-cb`. The existing root queue-cb1.6.8 is unchanged. This is an isolated provider link, not an alias rewrite in producer code.

Native Mongo checks require the prepared private macOS ARM64 MongoDB8.2.6 binary, verified by SHA256, in `.tmp/cache/mongodb-binaries`. The runner owns one loopback server at a time, unique data roots, a0.25GiB WiredTiger cache and bounded process cleanup. It never contacts a user database or provisions a server. A missing or mismatched binary fails the enabled gate. Native Mongo children use current modern Node; this fixture does not establish a new minimum runtime claim.

Native PostgreSQL checks require `TEST_POSTGRES_RUNTIME` to name the already prepared, reviewed Darwin ARM64 PostgreSQL18.4 runtime directory. No download or global service fallback occurs. The helper verifies initdb/postgres hashes and versions, initializes a unique private SCRAM cluster, limits shared buffers to32MB and connections to10, and owns foreground execution plus bounded SIGINT shutdown. The exact driver is pg8.20.0. Optional OAuth/Perl/Python/Tcl/pgxml modules, preloads, SSL, replicas and transactions are outside this fixture; missing bundled notices and redistribution clearance remain unresolved. Do not print the private connection URL or password.

The ordinary suite includes dual declarations, snapshot safety, link identity, native CJS/ESM memory, SQLite, flat PostgreSQL and flat Mongo applications, cold root/UMD loading, and real Chromium/Firefox/WebKit memory applications. SQL uses its accepted145-file PostgreSQL flat artifact, preserving the original SQLite child-first relation order and prior red evidence. Flat PostgreSQL exercises cache off/on materialization, save/fetch updates, stable Knockback observables, ModelRef replacement/unload and exact-owner cleanup. Flat Mongo proves cache off/on ObjectId/manual0 CRUD/materialization, observable updates and ModelRef lifecycle. PostgreSQL and Mongo do not claim relations, includes or transactions. Native entries continue to use the unchanged root `backbone-orm` export.

Browser loading is intentionally explicit:

1. Load local Underscore and Backbone as classic scripts.
2. Load the packaged `backbone-orm/umd` retained runtime as a classic script.
3. Import `backbone-orm/browser` as an ES module to install the accepted owned runtime on that same object.
4. Import Knockback and ModelRef against the same application-owned Backbone.

The root ORM entry is not a browser entry and remains unmodified. Browser fixtures use memory ORM only, not native SQL or Mongo. No registry Knockback, ORM, ModelRef, BackboneSQL or BackboneMongo package is installed or used.
