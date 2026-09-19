import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { APP_CACHE_VERSION } from '../src/debugPanel.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SW_SOURCE = readFileSync(join(ROOT, 'sw.js'), 'utf8');

function readSwAssets() {
  const block = /const ASSETS = \[([\s\S]*?)\];/.exec(SW_SOURCE);
  assert.ok(block, 'sw.js must define const ASSETS = [...]');
  return [...block[1].matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

function readSwCacheName() {
  const match = /const CACHE_NAME = '([^']+)';/.exec(SW_SOURCE);
  assert.ok(match, 'sw.js must define const CACHE_NAME');
  return match[1];
}

function collectModuleGraph(entry) {
  const seen = new Set();
  const queue = [entry];

  while (queue.length > 0) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);

    const source = readFileSync(join(ROOT, file), 'utf8');
    const specifiers = [
      ...source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g),
      ...source.matchAll(/import\s+['"](\.\.?\/[^'"]+)['"]/g),
    ].map((match) => match[1]);

    for (const specifier of specifiers) {
      queue.push(posix.join(posix.dirname(file), specifier));
    }
  }

  return [...seen].sort();
}

test('service worker precaches every module reachable from src/app.js', () => {
  const assets = new Set(readSwAssets());
  const missing = collectModuleGraph('src/app.js').filter((file) => !assets.has(file));

  assert.deepEqual(missing, [], `sw.js ASSETS is missing runtime modules: ${missing.join(', ')}`);
});

test('service worker precaches the app shell, styles, manifest and icons', () => {
  const assets = new Set(readSwAssets());

  for (const required of [
    './',
    'index.html',
    'manifest.webmanifest',
    'src/styles.css',
    'icons/icon-192.svg',
    'icons/icon-512.svg',
  ]) {
    assert.ok(assets.has(required), `sw.js ASSETS must include ${required}`);
  }
});

test('every service worker asset exists on disk and is listed once', () => {
  const assets = readSwAssets();
  const duplicates = assets.filter((asset, index) => assets.indexOf(asset) !== index);

  assert.deepEqual(duplicates, [], `duplicate entries in sw.js ASSETS: ${duplicates.join(', ')}`);

  for (const asset of assets) {
    if (asset === './') continue;
    assert.ok(existsSync(join(ROOT, asset)), `sw.js ASSETS lists a file that does not exist: ${asset}`);
  }
});

test('debug panel reports the same cache version as sw.js', () => {
  assert.equal(APP_CACHE_VERSION, readSwCacheName());
});
