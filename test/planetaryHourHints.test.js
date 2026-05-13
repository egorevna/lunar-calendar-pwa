import assert from 'node:assert/strict';
import test from 'node:test';

import { describePlanetaryHourHint } from '../src/planetaryHourHints.js';

test('returns practical hint for each planetary hour', () => {
  assert.equal(describePlanetaryHourHint('sun'), 'Хорошо для: статуса, проявленности, успеха, воли, намерения.');
  assert.equal(describePlanetaryHourHint('moon'), 'Хорошо для: Таро, снов, семьи, интуиции, воды.');
  assert.equal(describePlanetaryHourHint('mars'), 'Хорошо для: чисток, защиты, отсечения, активных действий.');
  assert.equal(describePlanetaryHourHint('mercury'), 'Хорошо для: текстов, переговоров, карт, диагностики.');
  assert.equal(describePlanetaryHourHint('jupiter'), 'Хорошо для: денег, роста, обучения, благословения.');
  assert.equal(describePlanetaryHourHint('venus'), 'Хорошо для: отношений, красоты, гармонии, притяжения.');
  assert.equal(describePlanetaryHourHint('saturn'), 'Хорошо для: защиты, границ, структуры, долгих обязательств.');
});

test('returns empty hint for unknown planetary hour', () => {
  assert.equal(describePlanetaryHourHint('unknown'), '');
  assert.equal(describePlanetaryHourHint(null), '');
});
