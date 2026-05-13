import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeMoonAspect,
  describeMoonAspectInterpretation,
  describeNextMoonAspect,
} from '../src/moonAspectsDisplay.js';

test('describes previous Moon aspect with relative Moscow day and minutes', () => {
  const now = new Date('2026-05-11T09:00:00+03:00');
  const aspect = {
    aspect: 90,
    planet: 'uranus',
    at: new Date('2026-05-10T22:13:02+03:00'),
  };

  assert.equal(describeMoonAspect(aspect, now), '□ Уран · вчера 22:13');
});

test('describes next Moon aspect with countdown', () => {
  const now = new Date('2026-05-11T10:14:00+03:00');
  const aspect = {
    aspect: 60,
    planet: 'mercury',
    at: new Date('2026-05-12T06:42:44+03:00'),
  };

  assert.equal(describeNextMoonAspect(aspect, now), '✶ Меркурий · завтра 06:42 · через 20ч 28м');
});

test('returns fallback for missing or non-major Moon aspects', () => {
  const now = new Date('2026-05-11T10:14:00+03:00');

  assert.equal(describeMoonAspect(null, now), 'нет данных');
  assert.equal(describeNextMoonAspect({ aspect: 45, planet: 'venus', at: now }, now), 'нет данных');
});

test('returns practical interpretation for known Moon aspect pair', () => {
  const aspect = {
    aspect: 60,
    planet: 'mercury',
    at: new Date('2026-05-12T06:42:44+03:00'),
  };

  assert.equal(
    describeMoonAspectInterpretation(aspect),
    'Луна ✶ Меркурий: хорошо для раскладов, разговоров, формулировок, записей, диагностики.',
  );
});

test('returns practical fallback interpretation by aspect type', () => {
  assert.equal(
    describeMoonAspectInterpretation({ aspect: 90, planet: 'jupiter', at: new Date() }),
    'Луна □ Юпитер: напряженный фон, лучше не принимать резких решений и не действовать на эмоциях.',
  );
  assert.equal(
    describeMoonAspectInterpretation({ aspect: 0, planet: 'venus', at: new Date() }),
    'Луна ☌ Венера: сильный акцент на теме планеты, лучше действовать осознанно.',
  );
});
