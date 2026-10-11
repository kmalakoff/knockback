# Knockback and BackboneORM upgrade matrix

This fixture distinguishes current regressions from behavior already present in the published Knockback 1.2.3 package. It does not alter or replace the retained red baseline in `test/integration/v1-compatibility/README.md`.

## Covered cells

| Knockback entry | BackboneORM entry | Node contract | Browser contract |
| --- | --- | --- | --- |
| Published `knockback@1.2.3` root | Published `backbone-orm@0.7.14` root | Historical v1 defect pinned; cleanup passes | Legacy UMD loading is not asserted by this fixture |
| Published `knockback@1.2.3` root | Accepted local `backbone-orm@0.7.14` root | Same historical v1 defect pinned; cleanup passes | The accepted ORM root is Node-only; no published-v1 overlay cell is claimed |
| Reviewed `@mcpeasy/knockback` root | Published `backbone-orm@0.7.14` root | Intended contract passes | Legacy UMD loading is not asserted by this fixture |
| Reviewed `@mcpeasy/knockback` root | Accepted local `backbone-orm@0.7.14` root | Intended contract passes | Chromium, Firefox, and WebKit owner test passes |

Every Node cell is a private filesystem installation and runs in a fresh owned child process. Inside that process, Knockback and BackboneORM must both resolve the cell's single Backbone package, and the fixture verifies their actual root entry paths before exercising behavior. The TypeScript fixture covers saved `belongsTo` and `hasMany` replacement through both a ViewModel and direct observables, null and empty relations, observable identity, value types, and final listener/release cleanup.

The published v1 cells have two pinned historical failures, unchanged by the ORM choice: an initial null `belongsTo` relation is inferred as simple type `1`, and the second populated relation mutation throws `TypeError: Cannot read properties of null (reading 'value')` inside the published ViewModel reader before the corresponding save is called. The first populated relation save succeeds. After the retained failure, the fixture releases the ViewModel and direct observables, clears the relation without those observers, and verifies that parent and child listener counts return to their pre-view baselines. These are historical observations, not candidate allowances; either candidate cell must satisfy the complete intended contract.

The accepted ORM input is the sealed `accepted-fabricator-testutils-payload`: tarball SHA-256 `2d1e4eb0a15216bc4b579ae29733f875b1a6efcbdff20456e490f7ec4fd7c070`, producer-manifest SHA-256 `8ade06d630810a38cae3243d77e2979e2d4e57c5348d50389f2b41a93b803d00`, and 363-entry artifact-manifest SHA-256 `05d088fddd42d3c35dc49d3cf67a9df12497b4ad0554d934405808a7c1b21342`. The fixture verifies the complete extracted package against that artifact manifest before staging it. It also pins the reviewed FAMILY package, source, and built distribution identities from `test/integration/local-family/accepted.json`.

## Browser loading boundary

The published ORM's root `backbone-orm.js` is its legacy UMD entry. The accepted local ORM deliberately keeps its root entry for Node; browser code loads `backbone-orm/umd` after the shared Underscore and Backbone globals, then imports `backbone-orm/browser`. Those globals and the import-map identity must exist before module evaluation. The supported current/current browser cell is the package-name test in `test/integration/local-family/browser/orm-import.test.ts`; it passed in Chromium, Firefox, and WebKit on 2026-09-26. The Node matrix does not count a root-entry import as browser evidence.

## Local command

This repository-specific integration check requires the prepared published packages, sealed ORM payload, and accepted local-family snapshot described above. On the guarded macOS test machine, run it from the FAMILY worktree with:

```sh
node scripts/test-safe.ts -- npx tsds test:node --no-timeouts test/integration/upgrade-matrix/matrix.test.ts
```

`matrix.test.ts` is also discovered by the package's ordinary `npm run test:node` and `npm test` commands. Missing published packages, sealed payloads, or accepted local-family snapshot provenance are hard prerequisite failures; the suite does not skip or substitute them. This is an upgrade evidence fixture, not a clean-clone bootstrap or publication procedure.
