import assert from 'node:assert/strict';
import test from 'node:test';

import { getDebugDate } from '../src/debugDate.js';

test('returns parsed debugDate from query parameters', () => {
  const date = getDebugDate('?debugDate=2026-05-15T00:40:00');

  assert.equal(date instanceof Date, true);
  assert.equal(Number.isNaN(date.getTime()), false);
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 4);
  assert.equal(date.getDate(), 15);
  assert.equal(date.getHours(), 0);
  assert.equal(date.getMinutes(), 40);
});

test('returns null when debugDate is missing or invalid', () => {
  assert.equal(getDebugDate(''), null);
  assert.equal(getDebugDate('?foo=bar'), null);
  assert.equal(getDebugDate('?debugDate=not-a-date'), null);
});
