import assert from 'node:assert/strict';
import test from 'node:test';

import { describeMoonIngress } from '../src/moonSignDisplay.js';

test('formats Moon ingress tomorrow without seconds', () => {
  const text = describeMoonIngress(
    { next: { name: 'Телец' }, entersAt: new Date('2026-05-15T05:31:04+03:00') },
    new Date('2026-05-14T20:00:00+03:00'),
  );

  assert.equal(text, 'Переход в Телец: завтра 05:31');
  assert.equal(text.includes('05:31:04'), false);
});

test('formats Moon ingress today and later dates naturally', () => {
  assert.equal(
    describeMoonIngress(
      { next: { name: 'Телец' }, entersAt: new Date('2026-05-14T22:31:04+03:00') },
      new Date('2026-05-14T20:00:00+03:00'),
    ),
    'Переход в Телец: сегодня 22:31',
  );

  assert.equal(
    describeMoonIngress(
      { next: { name: 'Телец' }, entersAt: new Date('2026-05-16T05:31:04+03:00') },
      new Date('2026-05-14T20:00:00+03:00'),
    ),
    'Переход в Телец: 16 мая, 05:31',
  );
});
