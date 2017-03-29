import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn';

const run = async (cmd, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const res = spawn(cmd, args, options);
    res.stdout.pipe(process.stdout);
    res.stderr.pipe(process.stderr);
    res.on('close', resolve);
    res.on('error', reject);
  });
}

(async () => {
  try {
    console.log('*************************');
    const modules = fs.readdirSync(path.join(__dirname, '..', 'packages'));
    const packages = [];
    for (const name of modules) {
      try {
        const packagePath = path.join(__dirname, '..', 'packages', name);
        packages.push({ name, path: packagePath, package: JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'))) });
      } catch (err) { }
    }

    for (const pkg of packages) {
      const packagePath = path.resolve(path.join.apply(path, [__dirname, '..', 'node_modules'].concat(pkg.package.name.split('/'))));
      if (fs.existsSync(packagePath)) {
        console.log(`Removing link ${path.relative(path.join(__dirname, '..'), packagePath)}`);
        await run('rm', ['-rf', packagePath]);
      }

      const packageModules = path.resolve(path.join(pkg.path, 'node_modules'));
      if (fs.existsSync(packageModules)) {
        console.log(`Removing modules ${fs.existsSync(packageModules)} ${packageModules} ${path.relative(path.join(__dirname, '..'), packageModules)}`);
        await run('rm', ['-rf', packageModules]);
      }
    }

    console.log('*************************');
    console.log('Clean successful');
    process.exit(0);
  }
  catch (err) {
    console.log('Clean failed. Error:', err.message);
    process.exit(0);
  }
})();