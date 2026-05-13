import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DASHBOARD_MODES,
  DEFAULT_DASHBOARD_MODE,
  isDashboardModeKey,
} from '../src/dashboardModes.js';

test('defines all dashboard modes with General as default', () => {
  assert.equal(DASHBOARD_MODES.length, 7);
  assert.deepEqual(
    DASHBOARD_MODES.map((mode) => mode.label),
    ['Общее', 'Таро', 'Свечи', 'Деньги', 'Отношения', 'Чистки', 'Прогнозы'],
  );
  assert.equal(DEFAULT_DASHBOARD_MODE, 'general');
  assert.equal(DASHBOARD_MODES[0].key, DEFAULT_DASHBOARD_MODE);
});

test('validates dashboard mode keys', () => {
  assert.equal(isDashboardModeKey('general'), true);
  assert.equal(isDashboardModeKey('tarot'), true);
  assert.equal(isDashboardModeKey('unknown'), false);
  assert.equal(isDashboardModeKey(''), false);
  assert.equal(isDashboardModeKey(null), false);
});
