# Published v1 compatibility regression ledger

This fixture compares selected high-impact public behavior from published Knockback 1.2.3 with the accepted local Knockback 2 candidate. It is a bounded compatibility checkpoint, not a complete v1 API audit and not approval to change public runtime code.

Run it from the family-integration worktree root:

```sh
node test/integration/v1-compatibility/run.ts
```

The current expected result is a non-zero exit with `AggregateError: 21 published v1 compatibility contract(s) differ`. The failures are the regression evidence; they are not counted as a successful gate.

## Pinned inputs

| Runtime | Location | Identity |
| --- | --- | --- |
| Published v1 | `../../../knockback-v1/packages/npm` | version 1.2.3; git head `8ac1f5f8d013f1eede74f1abc38ecffc8e4bd9f8`; `package.json` SHA256 `b353cee79086a6a72e6b73c1a5870af59a4f5a787a1032166ea594c5f257865c`; `knockback.js` SHA256 `eeeefdca830b95d747ee5c8f1d6c9a26a4702d223ac716f9ffd2f8300d45ba6d` |
| Accepted candidate | `.tmp/ownership-correction/candidate/knockback` | version 2.0.0; `package.json` SHA256 `2f53e5df057d844a9243c76f1eb690b5fdc18ff90e6bf5ebee53ada96e266d35`; CJS entry SHA256 `ead5a387d0a0df8bf8238609156239df33d0e3b2f57c736bc1159d0103095db7`; complete `dist` aggregate SHA256 `3731a1ee2cffdb4c4c72a91b1f06edca3babb38b261f5971360837279a418f81` |

The runner verifies the artifact hashes before testing. Each runtime/group pair runs in a separate owned child process with a five-second tree-cleanup timeout. Both runtimes resolve the same Backbone 1.6.1, Knockout 3.5.1, and Underscore 1.13.8 instances from the candidate dependency tree.

## Executable ledger

| Group | Published 1.2.3 behavior | Accepted candidate result | Actionable defect |
| --- | --- | --- | --- |
| `snake-models-only` | `models_only` preserves raw model identity through add/remove | Fails | Legacy option is ignored. |
| `snake-view-model` | `view_model` constructs the requested item type | Fails | Legacy option is ignored. |
| `snake-sort-attribute` | `sort_attribute` initially orders `[2, 1]` and resorts on add/change | Fails with initial `[1, 2]` | Legacy option is ignored. |
| `snake-static-defaults` | `static_defaults` fills a missing static key | Fails with `undefined` | Legacy option is ignored. |
| `constructors` | `ViewModel` reacts to model changes and releases listeners | Passes with the same values and zero remaining model listeners | No defect in this selected contract. |
| `constructors` | `Observable`, `CollectionObservable`, `DefaultObservable`, `FormattedObservable`, and `TriggeredObservable` perform their documented read/write/event/cleanup behavior | Five failures | The five root constructors are absent. |
| `validation` | `valueValidator` publishes reactive `$active_error` and `$error_count` fields | Fails; only the camel-case fields are present | Restore the legacy result-field aliases without removing current fields. |
| `validation` | `inputValidator` consumes `validation_options`, reacts to enable/value changes, and exposes the named validator | Fails | Root `inputValidator` is absent. |
| `validation` | `minLengthFn` returns the published invalid/valid values | Passes | No defect in this selected contract. |
| `validation` | `hasChangedFn`, `uniqueValueFn`, `untilTrueFn`, and `untilFalseFn` execute their change, uniqueness, latch, and reset behavior | Four failures | The implementations are not exported from the root namespace. |
| `disposal-aliases` | `release` is repeat-safe, `wasReleased` reports cleanup, instance `destroy` releases listeners, and `releaseKeys` clears owned values exactly once | Four failures | Each legacy lifecycle entry point is absent; do not weaken current cleanup to add them. |
| `disposal-ownership` | Top-level cleanup stops notifications, restores listener counts, and remains repeat-safe | Passes through candidate `dispose` with the same observed values | Current cleanup semantics are not the defect. |
| `view-model-extend` | `ViewModel.extend` preserves prototype/static/reactive behavior and supports the published custom-super constructor form | Two failures | `ViewModel.extend` is absent. |

Published 1.2.3 attaches `$name` when `inputValidator` receives a named input even with direct `{ no_attach: true }`. The executable test records that measured behavior, but this historical quirk needs an owner decision before it becomes a compatibility requirement. The published priority-ordering defect is deliberately not encoded as a required contract.

Still unproven in this bounded fixture: `auto_compact`, `event_watcher`, snake/camel conflict precedence, the `Validation` constructor and remaining validation/form helpers, and the rest of the documented v1 namespace. Those are open ledger items, not inferred passes or candidate defects.
