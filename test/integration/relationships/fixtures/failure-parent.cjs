const { spawn } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const path = require('node:path');

const child = spawn(process.execPath, [path.join(__dirname, 'failure-child.cjs')], { stdio: 'ignore' });
writeFileSync(path.join(__dirname, 'descendant.pid'), String(child.pid));
process.exit(7);
