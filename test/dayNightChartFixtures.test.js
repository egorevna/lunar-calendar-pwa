import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DAY_NIGHT_CHART_FIXTURES,
  getDayNightChartFixture,
  getDayNightChartFixtureCategories,
  getDayNightChartFixtureIds,
} from './fixtures/dayNightChartFixtures.js';

const REQUIRED_CATEGORIES = [
  'syntheticGeometry',
  'day',
  'night',
  'boundary',
  'invalid',
  'profile',
  'privacy',
  'strictExclusions',
];

test('day/night chart fixtures are available, unique and categorized', () => {
  assert.equal(Array.isArray(DAY_NIGHT_CHART_FIXTURES), true);
  assert.equal(DAY_NIGHT_CHART_FIXTURES.length >= REQUIRED_CATEGORIES.length, true);

  const ids = getDayNightChartFixtureIds();
  const categories = getDayNightChartFixtureCategories();

  assert.equal(new Set(ids).size, ids.length);
  REQUIRED_CATEGORIES.forEach((category) => {
    assert.equal(categories.includes(category), true, category);
  });
  assert.equal(getDayNightChartFixture('equator-lst-0-sun-aries')?.id, 'equator-lst-0-sun-aries');
  assert.equal(getDayNightChartFixture('missing-fixture'), null);
});

test('day/night chart fixture expectations are manually declared and safe', () => {
  for (const fixture of DAY_NIGHT_CHART_FIXTURES) {
    assert.equal(fixture.expected?.manuallyDeclared, true, fixture.id);
  }

  const text = JSON.stringify(DAY_NIGHT_CHART_FIXTURES);

  assert.equal(text.includes('Анна'), false);
  assert.equal(text.includes('Егор'), false);
  assert.equal(text.includes('Egor'), false);
  assert.equal(text.includes('1981-04-16'), false);
  assert.equal(text.includes('04:45'), false);
  assert.equal(text.includes('Europe/Moscow'), false);
  assert.equal(text.includes('фаталь'), false);
  assert.equal(text.includes('карми'), false);
  assert.equal(text.includes('ритуал'), false);
});

test('required day/night chart fixtures expose synthetic geometry and fallback expectations', () => {
  const day = getDayNightChartFixture('equator-lst-0-sun-aries');
  const night = getDayNightChartFixture('equator-lst-180-sun-aries');
  const boundary = getDayNightChartFixture('equator-lst-90-sun-aries');
  const invalid = getDayNightChartFixture('invalid-missing-sun-longitude');

  assert.equal(day.expected.chartSect, 'day');
  assert.equal(day.expected.altitudeDegrees, 90);
  assert.equal(night.expected.chartSect, 'night');
  assert.equal(night.expected.altitudeDegrees, -90);
  assert.equal(boundary.expected.status, 'boundary');
  assert.equal(boundary.expected.reason, 'sunOnHorizonBoundary');
  assert.equal(invalid.expected.reason, 'missingSunLongitude');
});
