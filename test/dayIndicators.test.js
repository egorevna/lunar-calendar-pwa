import assert from 'node:assert/strict';
import test from 'node:test';

import { getDayIndicators } from '../src/dayIndicators.js';

test('returns day indicators from the selected Moscow Tong Shu line', () => {
  const indicators = getDayIndicators(new Date('2026-05-10T15:53:00+03:00'), {
    lunarDay: 23,
    solarMonthBranch: 'si',
  });

  assert.equal(indicators.lunarSymbol.name, 'Крокодил Маккара');
  assert.equal(indicators.sexagenaryDay.stemBranch, '甲申');
  assert.equal(indicators.sexagenaryDay.name, 'Деревянная Обезьяна');
  assert.equal(indicators.dayOfficer.name, 'Равновесие');
});

test('uses Moscow time, Jie Qi month, and a 23:00 energetic day change', () => {
  const beforeChange = getDayIndicators(new Date('2026-05-10T22:30:00+03:00'), {
    lunarDay: 23,
    solarMonthBranch: 'si',
  });
  const afterChange = getDayIndicators(new Date('2026-05-10T23:30:00+03:00'), {
    lunarDay: 23,
    solarMonthBranch: 'si',
  });
  const mayEleven = getDayIndicators(new Date('2026-05-11T12:00:00+03:00'), {
    lunarDay: 24,
    solarMonthBranch: 'si',
  });

  assert.equal(beforeChange.sexagenaryDay.stemBranch, '甲申');
  assert.equal(beforeChange.dayOfficer.name, 'Равновесие');
  assert.equal(afterChange.sexagenaryDay.stemBranch, '乙酉');
  assert.equal(afterChange.sexagenaryDay.name, 'Деревянный Петух');
  assert.equal(afterChange.dayOfficer.name, 'Стабильность');
  assert.equal(mayEleven.sexagenaryDay.stemBranch, '乙酉');
  assert.equal(mayEleven.dayOfficer.name, 'Стабильность');
});
