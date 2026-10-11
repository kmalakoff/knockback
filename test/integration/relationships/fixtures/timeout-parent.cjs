const { spawn } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const path = require('node:path');

const child = spawn(process.execPath, [path.join(__dirname, 'timeout-child.cjs')], {
  stdio: 'ignore',
});
writeFileSync(path.join(__dirname, 'descendant.pid'), String(child.pid));
setInterval(() => undefined, 1_000);
