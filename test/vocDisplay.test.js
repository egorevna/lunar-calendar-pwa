import assert from 'node:assert/strict';
import test from 'node:test';

import { describeVoc, describeVocAspect } from '../src/vocDisplay.js';

test('describes an upcoming void-of-course interval without seconds', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');
  const voc = {
    status: 'upcoming',
    isActive: false,
    start: new Date('2026-05-10T13:04:14+03:00'),
    end: new Date('2026-05-11T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'Луна без курса начнется\nс 13:04 до 03:03\nчерез 2ч 50м');
});

test('describes an active void-of-course interval without seconds', () => {
  const now = new Date('2026-05-10T22:51:00+03:00');
  const voc = {
    status: 'active',
    isActive: true,
    start: new Date('2026-05-10T13:04:14+03:00'),
    end: new Date('2026-05-11T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'Луна без курса\nдо 03:03\nосталось 4ч 12м');
});

test('describes a day without void-of-course as Moon in course', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');
  const voc = {
    status: 'none',
    isActive: false,
    start: new Date('2026-05-11T13:04:14+03:00'),
    end: new Date('2026-05-12T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'Луна в курсе\nБез курса: 11 мая, 13:04');
});

test('treats a future void-of-course on another Moscow day as no VOC today', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');
  const voc = {
    status: 'upcoming',
    isActive: false,
    start: new Date('2026-05-11T13:04:14+03:00'),
    end: new Date('2026-05-12T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'Луна в курсе\nБез курса: 11 мая, 13:04');
});

test('uses compact last aspect wording for void-of-course', () => {
  const voc = {
    aspect: 90,
    planet: 'venus',
  };

  assert.equal(describeVocAspect(voc), 'VOC после: □ Венера');
});
