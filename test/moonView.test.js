import assert from 'node:assert/strict';
import test from 'node:test';

import { getMoonView } from '../src/moonView.js';

test('marks a waxing crescent as lit on the right', () => {
  const view = getMoonView({ illumination: 0.18, waxing: true });

  assert.equal(view.shape, 'crescent');
  assert.equal(view.side, 'right');
  assert.equal(view.className, 'moon-crescent moon-lit-right');
  assert.equal(view.shadowShift, '-18%');
});

test('marks a waning crescent as lit on the left', () => {
  const view = getMoonView({ illumination: 0.18, waxing: false });

  assert.equal(view.shape, 'crescent');
  assert.equal(view.side, 'left');
  assert.equal(view.className, 'moon-crescent moon-lit-left');
  assert.equal(view.shadowShift, '18%');
});

test('places quarter moon shadow halfway across the disk', () => {
  const view = getMoonView({ illumination: 0.5, waxing: true });

  assert.equal(view.shape, 'quarter');
  assert.equal(view.shadowShift, '-50%');
});

test('marks near full moon as a full disk', () => {
  const view = getMoonView({ illumination: 0.99, waxing: false });

  assert.equal(view.shape, 'full');
  assert.equal(view.className, 'moon-full moon-lit-left');
});
