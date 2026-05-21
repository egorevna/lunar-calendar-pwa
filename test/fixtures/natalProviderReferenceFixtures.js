import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const swe = require('swisseph');

export const REFERENCE_PROVIDER = 'swisseph';
export const REFERENCE_PROVIDER_VERSION = getSwissEphVersion();
export const REFERENCE_FLAGS = swe.SEFLG_SWIEPH;

export const NATAL_PROVIDER_REFERENCE_TOLERANCE = Object.freeze({
  longitudeDegrees: 0.25,
  moonLongitudeDegrees: 0.5,
});

export const NATAL_PROVIDER_REFERENCE_FIXTURES = Object.freeze([
  createUtcReferenceFixture({
    id: 'reference-modern-j2000-noon',
    label: 'Reference modern UTC fixture',
    categories: ['modern'],
    utcDateTime: '2000-01-01T12:00:00.000Z',
  }),
  createUtcReferenceFixture({
    id: 'reference-historical-1900',
    label: 'Reference historical UTC fixture',
    categories: ['historical'],
    utcDateTime: '1900-06-15T00:00:00.000Z',
  }),
  createUtcReferenceFixture({
    id: 'reference-moon-sensitive-2026',
    label: 'Reference Moon-sensitive UTC fixture',
    categories: ['moonSensitive'],
    utcDateTime: '2026-05-15T10:33:00.000Z',
  }),
  createUtcReferenceFixture({
    id: 'reference-timezone-documented-1985',
    label: 'Reference timezone-sensitive documented UTC fixture',
    categories: ['timezoneSensitive'],
    utcDateTime: '1985-11-03T06:30:00.000Z',
    notes: ['UTC-only fixture; no local birth timezone conversion is performed.'],
  }),
]);

export function isSwissEphReferenceAvailable() {
  return Boolean(swe?.swe_calc_ut && swe?.SE_SUN !== undefined);
}

export function getSwissEphReferenceLongitudes(utcDateTime) {
  if (!isSwissEphReferenceAvailable()) {
    return null;
  }

  swe.swe_set_ephe_path(join(process.cwd(), 'node_modules', 'swisseph', 'ephe'));

  return Object.fromEntries(
    Object.entries(SWISS_EPH_BODY_IDS).map(([key, bodyId]) => [
      key,
      calculateSwissEphLongitude(utcDateTime, bodyId),
    ]),
  );
}

export function getReferenceToleranceForPlanet(key) {
  return key === 'moon'
    ? NATAL_PROVIDER_REFERENCE_TOLERANCE.moonLongitudeDegrees
    : NATAL_PROVIDER_REFERENCE_TOLERANCE.longitudeDegrees;
}

export function getReferenceAngularDifference(a, b) {
  const difference = Math.abs(a - b);

  return Math.min(difference, 360 - difference);
}

function createUtcReferenceFixture({
  id,
  label,
  categories,
  utcDateTime,
  notes = [],
}) {
  return Object.freeze({
    id,
    label,
    type: 'reference',
    categories: Object.freeze([...categories]),
    utcDateTime,
    zodiac: 'tropical',
    source: 'Swiss Ephemeris via local swisseph dev dependency',
    expectedStatus: 'calculated-from-independent-reference',
    tolerance: NATAL_PROVIDER_REFERENCE_TOLERANCE,
    notes: Object.freeze([...notes]),
  });
}

function calculateSwissEphLongitude(utcDateTime, bodyId) {
  const jd = dateToJulian(new Date(utcDateTime));
  let longitude = null;

  swe.swe_calc_ut(jd, bodyId, REFERENCE_FLAGS, (body) => {
    if (body.error) {
      throw new Error(body.error);
    }

    longitude = body.longitude;
  });

  return longitude;
}

function dateToJulian(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getSwissEphVersion() {
  return typeof swe.swe_version === 'function' ? swe.swe_version() : null;
}

const SWISS_EPH_BODY_IDS = Object.freeze({
  sun: swe.SE_SUN,
  moon: swe.SE_MOON,
  mercury: swe.SE_MERCURY,
  venus: swe.SE_VENUS,
  mars: swe.SE_MARS,
  jupiter: swe.SE_JUPITER,
  saturn: swe.SE_SATURN,
  uranus: swe.SE_URANUS,
  neptune: swe.SE_NEPTUNE,
  pluto: swe.SE_PLUTO,
});
