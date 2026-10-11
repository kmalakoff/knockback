# Contributing to Knockback

This checkout maintains the legacy 1.2.3 line on `support/1.x`. It remains supported; it is not retired. The current TypeScript migration integrates into `master`.

Keep legacy fixes on this support line and port applicable fixes individually. Do not merge migration work into the support line. The complete maintenance policy is on master, available with `git show master:CONTRIBUTING.md`.

Support releases require the explicit npm tag `support-1`; `prepublishOnly` enforces it with `scripts/require-dist-tag.cjs`. Existing lifecycle commands remain unchanged. Publishing, tags and version changes are maintainer actions.
