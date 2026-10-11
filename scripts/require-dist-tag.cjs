// npm publish moves `latest` to the highest version published, so a support-line
// release made after a higher major exists must name its dist-tag. Refuses the
// publish rather than letting a bare one silently move `latest` to the old line.
'use strict';

const { execSync } = require('node:child_process');

let branch;
try {
  branch = execSync('git rev-parse --abbrev-ref HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
    .toString()
    .trim();
} catch {
  // No branch to read (publishing from an unpacked tarball, a detached build): the
  // support-branch rule cannot apply, and a publish here is not the case being guarded.
  process.exit(0);
}

const match = /^support\/(\d+)\.x$/.exec(branch);
if (!match) process.exit(0);

const expected = `support-${match[1]}`;

// npm exposes the resolved --tag as npm_config_tag. npm_config_argv carried it
// before npm 7 and is undefined since, so it is only a fallback: reading it alone
// refuses every publish, correct ones included.
let tag = process.env.npm_config_tag;
if (!tag) {
  try {
    const argv = JSON.parse(process.env.npm_config_argv || '{}').original || [];
    const i = argv.indexOf('--tag');
    tag = i !== -1 ? argv[i + 1] : argv.find((a) => a.startsWith('--tag='))?.slice('--tag='.length);
  } catch {}
}

if (tag !== expected) {
  console.error(`Publishing from ${branch} requires --tag ${expected}.`);
  console.error("A bare publish moves the 'latest' dist-tag to this line, so every plain install serves it.");
  if (tag) console.error(`Got --tag ${tag}.`);
  process.exit(1);
}
