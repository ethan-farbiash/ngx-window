const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const sourcePath = path.join(rootDir, 'README.md');
const targetPath = path.join(rootDir, 'projects', 'ngx-window', 'README.md');

fs.copyFileSync(sourcePath, targetPath);

console.log(`Synced README from ${path.relative(rootDir, sourcePath)} to ${path.relative(rootDir, targetPath)}`);
