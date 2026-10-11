# Contributing to Knockback

## Branches

`master` is the current TypeScript migration line. Checkpoints may contain unfinished or unvalidated work and do not establish release readiness.

`support/1.x` maintains the legacy 1.2.3 line. It remains supported; it is not retired. Keep legacy fixes separate from migration changes and port applicable fixes individually. Do not merge the current line into the support line.

## Publishing

A support release must explicitly use the npm tag `support-1`. The byte-identical shared `scripts/require-dist-tag.cjs` guard enforces that rule through `prepublishOnly`, before this line's existing validation. Publishing, version changes and tags are maintainer actions. Checkpoints and local master integration authorize none of them.
