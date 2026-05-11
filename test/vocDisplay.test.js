import assert from 'node:assert/strict';
import test from 'node:test';

import {
  describeVoc,
  describeVocAspect,
  getVocBackgroundLabel,
} from '../src/vocDisplay.js';

test('describes an upcoming void-of-course period without seconds', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');
  const voc = {
    status: 'upcoming',
    isActive: false,
    start: new Date('2026-05-10T13:04:14+03:00'),
    end: new Date('2026-05-11T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'с 13:04 до 03:03');
});

test('describes an active void-of-course period without seconds', () => {
  const now = new Date('2026-05-10T22:51:00+03:00');
  const voc = {
    status: 'active',
    isActive: true,
    start: new Date('2026-05-10T13:04:14+03:00'),
    end: new Date('2026-05-11T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'до 03:03');
});

test('describes missing void-of-course data as unavailable', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');

  assert.equal(describeVoc(null, now), 'нет данных');
});

test('shows the nearest future void-of-course period even on another Moscow day', () => {
  const now = new Date('2026-05-10T10:14:00+03:00');
  const voc = {
    status: 'upcoming',
    isActive: false,
    start: new Date('2026-05-11T13:04:14+03:00'),
    end: new Date('2026-05-12T03:03:38+03:00'),
  };

  assert.equal(describeVoc(voc, now), 'с 13:04 до 03:03');
});

test('uses simple last aspect wording for void-of-course', () => {
  const voc = {
    aspect: 90,
    planet: 'venus',
  };

  assert.equal(describeVocAspect(voc), 'после: □ Венера\nфон напряженный');
});

test('does not show background label without last aspect data', () => {
  assert.equal(describeVocAspect({}), '');
  assert.equal(getVocBackgroundLabel({ aspect: 90 }), '');
  assert.equal(getVocBackgroundLabel({ planet: 'venus' }), '');
});

test('prioritizes planet-specific VOC background labels', () => {
  assert.equal(getVocBackgroundLabel({ aspect: 120, planet: 'neptune' }), 'фон размытый');
  assert.equal(getVocBackgroundLabel({ aspect: 60, planet: 'saturn' }), 'фон тяжелый');
  assert.equal(getVocBackgroundLabel({ aspect: 120, planet: 'mars' }), 'фон нервный');
  assert.equal(getVocBackgroundLabel({ aspect: 60, planet: 'uranus' }), 'фон нервный');
});

test('uses aspect type for VOC background when planet rules do not match', () => {
  assert.equal(getVocBackgroundLabel({ aspect: 60, planet: 'venus' }), 'фон мягкий');
  assert.equal(getVocBackgroundLabel({ aspect: 120, planet: 'jupiter' }), 'фон мягкий');
  assert.equal(getVocBackgroundLabel({ aspect: 90, planet: 'venus' }), 'фон напряженный');
  assert.equal(getVocBackgroundLabel({ aspect: 180, planet: 'jupiter' }), 'фон напряженный');
});
