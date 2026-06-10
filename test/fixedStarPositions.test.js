import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

import {
  calculateFixedStarPosition,
  calculateFixedStarPositions,
  getFixedStarPositionByKey,
  getFixedStarPositionCapabilities,
  getFixedStarPositionLimitations,
  getFixedStarPositionSummary,
  getUtcDecimalYear,
  interpolateFixedStarLongitude,
  validateFixedStarPosition,
} from '../src/fixedStarPositions.js';
import {
  getFixedStarRowByKey,
  getActiveFixedStarRows,
} from '../src/fixedStarsData.js';
import {
  getFixedStarPositionsFixture,
} from './fixtures/fixedStarPositionsFixtures.js';

const EPSILON = 1e-9;

function assertApprox(actual, expected, tolerance = EPSILON) {
  assert.equal(Number.isFinite(actual), true);
  assert.equal(
    Math.abs(actual - expected) <= tolerance,
    true,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

function assertNoPrivateOrInterpretiveText(value) {
  const text = JSON.stringify(value).toLowerCase();

  for (const forbidden of [
    'birthdate',
    'birthtime',
    'birthplace',
    'utcdatetime',
    'profilecoordinates',
    'birthcoordinates',
    'fullprofile',
    'profilejson',
    'providerpayload',
    'interpretationtext',
    'mythology',
    'prediction',
    'fatalistic',
    'karmic',
    'фаталь',
    'карми',
    'судьб',
    'ритуал',
  ]) {
    assert.equal(text.includes(forbidden), false, `output should not include ${forbidden}`);
  }
}

test('getUtcDecimalYear handles valid UTC date and leap year', () => {
  assert.deepEqual(getUtcDecimalYear('2020-01-01T00:00:00.000Z'), {
    status: 'ready',
    ready: true,
    epochYear: 2020,
  });

  const leapResult = getUtcDecimalYear('2020-07-02T12:00:00.000Z');

  assert.equal(leapResult.status, 'ready');
  assertApprox(leapResult.epochYear, 2020.5013661202186, 1e-12);
});

test('getUtcDecimalYear rejects invalid date safely', () => {
  assert.deepEqual(getUtcDecimalYear('not-a-date'), {
    status: 'invalid',
    ready: false,
    reason: 'invalidDate',
  });
  assert.deepEqual(getUtcDecimalYear(null), {
    status: 'invalid',
    ready: false,
    reason: 'invalidDate',
  });
});

test('exact source epochs return preserved Vronsky coordinates', () => {
  const row = getFixedStarRowByKey('spica');

  for (const fixtureId of ['spica-exact-1950', 'spica-exact-1970', 'spica-exact-1990']) {
    const fixture = getFixedStarPositionsFixture(fixtureId);
    const result = interpolateFixedStarLongitude({ starRow: row, epochYear: fixture.input.epochYear });

    assert.equal(result.status, 'ready');
    assertApprox(result.longitude, fixture.expected.longitude);
    assert.equal(result.exactSourceEpoch, fixture.expected.exactSourceEpoch);
    assert.equal(result.interpolated, false);
    assert.equal(result.extrapolated, false);
    assert.equal(result.interpolationSource, null);
    assert.equal(result.extrapolationSource, null);
  }
});

test('interpolation between source columns matches manual fixtures', () => {
  const row = getFixedStarRowByKey('spica');

  for (const fixtureId of ['spica-interpolation-1960', 'spica-interpolation-1980']) {
    const fixture = getFixedStarPositionsFixture(fixtureId);
    const result = interpolateFixedStarLongitude({ starRow: row, epochYear: fixture.input.epochYear });

    assert.equal(result.status, 'ready');
    assertApprox(result.longitude, fixture.expected.longitude);
    assert.equal(result.interpolated, true);
    assert.equal(result.extrapolated, false);
    assert.equal(result.interpolationSource, fixture.expected.interpolationSource);
    assert.equal(result.exactSourceEpoch, null);
  }
});

test('extrapolation outside source range matches manual fixtures and is explicit', () => {
  const row = getFixedStarRowByKey('spica');

  for (const fixtureId of ['spica-extrapolation-1940', 'spica-extrapolation-2000']) {
    const fixture = getFixedStarPositionsFixture(fixtureId);
    const result = interpolateFixedStarLongitude({ starRow: row, epochYear: fixture.input.epochYear });

    assert.equal(result.status, 'ready');
    assertApprox(result.longitude, fixture.expected.longitude);
    assert.equal(result.interpolated, false);
    assert.equal(result.extrapolated, true);
    assert.equal(result.extrapolationSource, fixture.expected.extrapolationSource);
    assert.equal(result.exactSourceEpoch, null);
  }
});

test('wrap-around interpolation handles Pisces to Aries safely', () => {
  for (const fixtureId of ['synthetic-wrap-interpolation-1960', 'synthetic-wrap-interpolation-1980']) {
    const fixture = getFixedStarPositionsFixture(fixtureId);
    const result = interpolateFixedStarLongitude(fixture.input);

    assert.equal(result.status, 'ready');
    assertApprox(result.longitude, fixture.expected.longitude);
    assert.equal(result.interpolated, true);
    assert.equal(result.extrapolated, false);
    assert.equal(result.interpolationSource, fixture.expected.interpolationSource);
    assert.equal(result.longitude >= 0 && result.longitude < 360, true);
  }
});

test('calculateFixedStarPosition returns formatted zodiac text with seconds', () => {
  const fixture = getFixedStarPositionsFixture('spica-interpolation-1980');
  const result = calculateFixedStarPosition(fixture.input);

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.key, 'spica');
  assert.equal(result.labelRu, 'Спика');
  assert.equal(result.labelEn, 'Spica');
  assert.equal(result.designation, 'α Virginis');
  assertApprox(result.longitude, fixture.expected.longitude);
  assert.equal(result.sign.key, 'libra');
  assert.equal(result.sign.ru, 'Весы');
  assert.equal(result.degree, 23);
  assert.equal(result.minutes, 33);
  assert.equal(result.seconds, 30);
  assert.equal(result.text, fixture.expected.text);
  assert.equal(result.sourceSystem, 'fixed-stars-vronsky-table-18');
  assert.equal(result.positionEpochPolicy, 'vronsky-linear-epoch-interpolation');
  assert.equal(result.requestedEpochYear, 1980);
  assert.equal(result.interpolated, true);
  assert.equal(result.extrapolated, false);
});

test('calculateFixedStarPosition accepts starKey with UTC date and omits raw UTC from result', () => {
  const result = calculateFixedStarPosition({
    starKey: 'spica',
    utcDateTime: '1981-04-16T00:45:00.000Z',
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.key, 'spica');
  assert.equal(result.text.startsWith('Спика — Весы '), true);
  assert.equal(Number.isFinite(result.requestedEpochYear), true);
  assert.equal(Object.hasOwn(result, 'utcDateTime'), false);
  assertNoPrivateOrInterpretiveText(result);
});

test('unknown starKey and invalid rows return safe notReady states', () => {
  const unknown = calculateFixedStarPosition({ starKey: 'unknown-star', epochYear: 1980 });
  const invalidRow = interpolateFixedStarLongitude({ starRow: { key: 'draft' }, epochYear: 1980 });

  assert.equal(unknown.status, 'notReady');
  assert.equal(unknown.ready, false);
  assert.equal(unknown.reason, 'unknownStar');
  assert.equal(invalidRow.status, 'notReady');
  assert.equal(invalidRow.ready, false);
  assert.equal(invalidRow.reason, 'invalidStarRow');
});

test('calculateFixedStarPositions returns all active rows by default', () => {
  const result = calculateFixedStarPositions({ epochYear: 1980 });

  assert.equal(result.status, 'ready');
  assert.equal(result.ready, true);
  assert.equal(result.total, getActiveFixedStarRows().length);
  assert.equal(result.readyCount, getActiveFixedStarRows().length);
  assert.equal(result.invalidCount, 0);
  assert.deepEqual(
    result.positions.map((position) => position.key),
    getActiveFixedStarRows().map((row) => row.key),
  );
});

test('starKeys filter requested rows while preserving catalog order', () => {
  const result = calculateFixedStarPositions({
    epochYear: 1980,
    starKeys: ['spica', 'regulus'],
  });

  assert.equal(result.status, 'ready');
  assert.deepEqual(result.positions.map((position) => position.key), ['regulus', 'spica']);
});

test('unknown filtered keys produce invalid items without fake values', () => {
  const result = calculateFixedStarPositions({
    epochYear: 1980,
    starKeys: ['unknown-star'],
  });

  assert.equal(result.status, 'ready');
  assert.equal(result.total, 1);
  assert.equal(result.readyCount, 0);
  assert.equal(result.invalidCount, 1);
  assert.deepEqual(result.positions, [
    {
      status: 'notReady',
      ready: false,
      key: 'unknown-star',
      reason: 'unknownStar',
    },
  ]);
});

test('position lookup validation and summary helpers work safely', () => {
  const result = calculateFixedStarPositions({ epochYear: 1980 });
  const spica = getFixedStarPositionByKey(result, 'spica');

  assert.equal(spica.key, 'spica');
  assert.equal(getFixedStarPositionByKey(result, 'unknown-star'), null);
  assert.deepEqual(validateFixedStarPosition(spica), {
    status: 'ready',
    valid: true,
    reasons: [],
  });
  assert.deepEqual(validateFixedStarPosition({ ...spica, longitude: Number.NaN }), {
    status: 'invalid',
    valid: false,
    reasons: ['invalidLongitude'],
  });
  assert.deepEqual(getFixedStarPositionSummary(result), {
    status: 'ready',
    total: 13,
    ready: 13,
    invalid: 0,
    text: '13 положений неподвижных звезд рассчитаны',
  });
  assert.deepEqual(getFixedStarPositionSummary(null), {
    status: 'notReady',
    total: 0,
    ready: 0,
    invalid: 0,
    text: 'Положения неподвижных звезд недоступны',
  });
});

test('capabilities and limitations keep position layer scoped', () => {
  assert.deepEqual(getFixedStarPositionCapabilities(), {
    fixedStarPositions: true,
    vronskySourceColumns: true,
    interpolation: true,
    extrapolation: true,
    conjunctionEngine: false,
    targetResolver: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    transits: false,
  });
  assert.equal(
    getFixedStarPositionLimitations().includes('Этот модуль не рассчитывает соединения.'),
    true,
  );
});

test('position output contains no private profile data provider payload or interpretations', () => {
  assertNoPrivateOrInterpretiveText(calculateFixedStarPositions({ epochYear: 1980 }));
  assertNoPrivateOrInterpretiveText(getFixedStarPositionLimitations());
});

test('module does not import providers swisseph astronomy-engine DOM storage or forbidden engines', () => {
  const source = readFileSync(new URL('../src/fixedStarPositions.js', import.meta.url), 'utf8');

  for (const forbidden of [
    'from "swisseph"',
    "from 'swisseph'",
    'require("swisseph")',
    "require('swisseph')",
    'astronomy-engine',
    'planetaryProvider',
    'natalPlanetsForProfile',
    'document.',
    'window.',
    'localStorage',
    'calculateConjunction',
    'resolveFixedStarTargets',
    'renderFixedStars',
    'debugPanel',
  ]) {
    assert.equal(source.includes(forbidden), false, `module should not include ${forbidden}`);
  }
});

test('src/fixedStars.js is not created', () => {
  assert.equal(existsSync(new URL('../src/fixedStars.js', import.meta.url)), false);
});
