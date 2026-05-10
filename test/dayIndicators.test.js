import assert from 'node:assert/strict';
import test from 'node:test';

import { getDayIndicators } from '../src/dayIndicators.js';

test('returns the requested day indicators for 2026-05-10 in Moscow', () => {
  const indicators = getDayIndicators(new Date('2026-05-10T15:53:00+03:00'), {
    lunarDay: 23,
    solarMonthBranch: 'si',
  });

  assert.equal(indicators.lunarSymbol.name, 'Крокодил Маккара');
  assert.equal(indicators.sexagenaryDay.stemBranch, '甲申');
  assert.equal(indicators.sexagenaryDay.name, 'Деревянная Обезьяна');
  assert.equal(indicators.dayOfficer.name, 'Устранение');
});
