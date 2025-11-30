---
title: Installation
description: How to install Knockback.js
---

## npm

```bash
npm install knockback
```

```javascript
import kb from 'knockback';
```

## CDN / Direct Download

### Full Build

Includes all features:

| Version | Link |
|---------|------|
| Development | [knockback.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback.js) (82kb) |
| Production | [knockback.min.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback.min.js) (13kb gzipped) |

### Core Build

Excludes advanced features (localization, formatting, validation):

| Version | Link |
|---------|------|
| Development | [knockback-core.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback-core.js) (62kb) |
| Production | [knockback-core.min.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback-core.min.js) (10kb gzipped) |

### Full Stack

Bundles Underscore.js + Backbone.js + Knockout.js + Knockback.js:

| Version | Link |
|---------|------|
| Development | [knockback-full-stack.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback-full-stack.js) (363kb) |
| Production | [knockback-full-stack.min.js](https://raw.github.com/kmalakoff/knockback/1.2.3/knockback-full-stack.min.js) (39kb gzipped) |

## Package Managers

- [npm registry](https://npmjs.org/package/knockback)
- [Bower](http://bower.io/)
- [NuGet Gallery](http://nuget.org/packages/Knockback.js)

## Dependencies

Make sure to load dependencies before Knockback:

```html
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="knockout.js"></script>
<script src="knockback.js"></script>
```

Or use the full-stack build which includes everything.
