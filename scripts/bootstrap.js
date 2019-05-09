import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn';

const run = async (cmd, args, options = {}) =>
  new Promise((resolve, reject) => {
    const res = spawn(cmd, args, options);
    res.stdout.pipe(process.stdout);
    res.stderr.pipe(process.stderr);
    res.on('close', resolve);
    res.on('error', reject);
  });

(async () => {
  try {
    await run('lerna', ['bootstrap'], { cwd: path.join(__dirname, '..') });

    console.log('*************************');
    const modules = fs.readdirSync(path.join(__dirname, '..', 'packages'));
    const packages = [];
    for (const name of modules) {
      try {
        packages.push({ name, package: JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'packages', name, 'package.json'))) });
      } catch (err) {
        /* */
      }
    }

    for (const pkg of packages) {
      const packagePath = path.resolve(path.join(...[__dirname, '..', 'node_modules'].concat(pkg.package.name.split('/'))));
      if (fs.existsSync(packagePath)) {
        console.log(`Removing link ${path.relative(path.join(__dirname, '..'), packagePath)}`);
        await run('rm', ['-rf', packagePath]);
      }
    }

    for (const pkg of packages) {
      console.log(`\nLinking ${pkg.package.name}`);
      await run('npm', ['link'], { cwd: path.join(__dirname, '..', 'packages', pkg.name) });
      await run('npm', ['link', pkg.package.name], { cwd: path.join(__dirname, '..') });
    }
    console.log('*************************');
    console.log('Configure successful');
    process.exit(0);
  } catch (err) {
    console.log('Configure failed. Error:', err.message);
    process.exit(0);
  }
})();
