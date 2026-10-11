import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export interface TreeEntry {
  path: string;
  sha256: string;
}

interface ListFilesOptions {
  allowedSymlinks?: ReadonlySet<string>;
}

export function comparePath(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

export function sha256File(file: string): string {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

export function listFiles(root: string, options: ListFilesOptions = {}): string[] {
  const allowedSymlinks = options.allowedSymlinks ?? new Set<string>();
  const files: string[] = [];
  const visit = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      const relativePath = path.relative(root, entryPath).split(path.sep).join('/');
      if (entry.isSymbolicLink()) {
        if (!allowedSymlinks.has(relativePath)) {
          throw new Error(`Unexpected symbolic link in immutable tree ${root}: ${relativePath}`);
        }
      } else if (entry.isDirectory()) {
        visit(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      } else {
        throw new Error(`Unexpected filesystem entry in immutable tree ${root}: ${relativePath}`);
      }
    }
  };
  visit(root);
  return files.sort(comparePath);
}

export function treeManifest(root: string, options: ListFilesOptions = {}): TreeEntry[] {
  return listFiles(root, options).map((file) => ({
    path: path.relative(root, file).split(path.sep).join('/'),
    sha256: sha256File(file),
  }));
}
