import { ASTRO_ZODIAC_SIGNS, formatDegree, normalizeDegrees } from './astroMath.js';
import {
  getActiveFixedStarRows,
  getFixedStarRowByKey,
} from './fixedStarsData.js';

const POSITION_EPOCH_POLICY = 'vronsky-linear-epoch-interpolation';
const SOURCE_EPOCHS = Object.freeze([1950, 1970, 1990]);
const EPOCH_KEYS = Object.freeze({
  1950: 'epoch1950',
  1970: 'epoch1970',
  1990: 'epoch1990',
});
const EPSILON = 1e-9;

export function getUtcDecimalYear(dateOrUtcDateTime) {
  const date = resolveDate(dateOrUtcDateTime);

  if (!date) {
    return invalidDateResult();
  }

  const year = date.getUTCFullYear();
  const yearStart = Date.UTC(year, 0, 1);
  const nextYearStart = Date.UTC(year + 1, 0, 1);
  const epochYear = year + ((date.getTime() - yearStart) / (nextYearStart - yearStart));

  return {
    status: 'ready',
    ready: true,
    epochYear,
  };
}

export function interpolateFixedStarLongitude(input = {}) {
  const starRow = input.starRow;
  const epochYear = Number(input.epochYear);

  if (!isUsableFixedStarRow(starRow)) {
    return {
      status: 'notReady',
      ready: false,
      reason: 'invalidStarRow',
    };
  }

  if (!Number.isFinite(epochYear)) {
    return {
      status: 'invalid',
      ready: false,
      reason: 'invalidEpochYear',
    };
  }

  const unwrapped = getUnwrappedSourceLongitudes(starRow);
  const exactSourceEpoch = getExactSourceEpoch(epochYear);

  if (exactSourceEpoch !== null) {
    return buildLongitudeResult({
      starRow,
      epochYear,
      longitude: starRow.coordinates[EPOCH_KEYS[exactSourceEpoch]].longitude,
      exactSourceEpoch,
      interpolated: false,
      extrapolated: false,
      interpolationSource: null,
      extrapolationSource: null,
    });
  }

  const source = getEpochSource(epochYear);
  const startLongitude = unwrapped[source.startEpoch];
  const endLongitude = unwrapped[source.endEpoch];
  const ratio = (epochYear - source.startEpoch) / (source.endEpoch - source.startEpoch);
  const longitude = startLongitude + ((endLongitude - startLongitude) * ratio);

  return buildLongitudeResult({
    starRow,
    epochYear,
    longitude,
    exactSourceEpoch: null,
    interpolated: source.mode === 'interpolation',
    extrapolated: source.mode === 'extrapolation',
    interpolationSource: source.mode === 'interpolation' ? source.label : null,
    extrapolationSource: source.mode === 'extrapolation' ? source.label : null,
  });
}

export function calculateFixedStarPosition(input = {}) {
  const rowResult = resolveStarRow(input);

  if (!rowResult.ready) {
    return rowResult;
  }

  const epochResult = resolveEpochYear(input);

  if (!epochResult.ready) {
    return epochResult;
  }

  const longitudeResult = interpolateFixedStarLongitude({
    starRow: rowResult.starRow,
    epochYear: epochResult.epochYear,
  });

  if (!longitudeResult.ready) {
    return longitudeResult;
  }

  const formatted = formatFixedStar(rowResult.starRow, longitudeResult.longitude);

  return {
    status: 'ready',
    ready: true,
    key: rowResult.starRow.key,
    labelRu: rowResult.starRow.labelRu,
    labelEn: rowResult.starRow.labelEn,
    designation: rowResult.starRow.designation,
    longitude: longitudeResult.longitude,
    sign: formatted.sign,
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: formatted.text,
    sourceSystem: rowResult.starRow.sourceSystem,
    sourceKey: rowResult.starRow.sourceKey,
    verificationStatus: rowResult.starRow.verificationStatus,
    validationStatus: rowResult.starRow.validationStatus,
    requestedEpochYear: longitudeResult.requestedEpochYear,
    positionEpochPolicy: POSITION_EPOCH_POLICY,
    exactSourceEpoch: longitudeResult.exactSourceEpoch,
    interpolated: longitudeResult.interpolated,
    extrapolated: longitudeResult.extrapolated,
    interpolationSource: longitudeResult.interpolationSource,
    extrapolationSource: longitudeResult.extrapolationSource,
    limitations: getPositionLimitations(longitudeResult),
  };
}

export function calculateFixedStarPositions(input = {}) {
  const epochResult = resolveEpochYear(input);

  if (!epochResult.ready) {
    return {
      ...epochResult,
      total: 0,
      readyCount: 0,
      invalidCount: 0,
      positions: [],
    };
  }

  const requestedKeys = Array.isArray(input.starKeys)
    ? [...new Set(input.starKeys.filter((key) => typeof key === 'string' && key.length > 0))]
    : null;
  const activeRows = getActiveFixedStarRows();
  const selectedRows = requestedKeys
    ? activeRows.filter((row) => requestedKeys.includes(row.key))
    : activeRows;
  const knownKeys = new Set(selectedRows.map((row) => row.key));
  const invalidKeys = requestedKeys
    ? requestedKeys.filter((key) => !knownKeys.has(key) && !activeRows.some((row) => row.key === key))
    : [];
  const readyPositions = selectedRows.map((starRow) =>
    calculateFixedStarPosition({ starRow, epochYear: epochResult.epochYear }));
  const invalidPositions = invalidKeys.map((key) => ({
    status: 'notReady',
    ready: false,
    key,
    reason: 'unknownStar',
  }));
  const positions = [...readyPositions, ...invalidPositions];
  const readyCount = positions.filter((position) => position.ready === true).length;
  const invalidCount = positions.length - readyCount;

  return {
    status: 'ready',
    ready: readyCount > 0,
    total: positions.length,
    readyCount,
    invalidCount,
    requestedEpochYear: epochResult.epochYear,
    positionEpochPolicy: POSITION_EPOCH_POLICY,
    positions,
    limitations: getFixedStarPositionLimitations(),
  };
}

export function getFixedStarPositionByKey(positionsResult, key) {
  if (!positionsResult || !Array.isArray(positionsResult.positions) || typeof key !== 'string') {
    return null;
  }

  return positionsResult.positions.find((position) => position?.key === key && position.ready === true) ?? null;
}

export function validateFixedStarPosition(position) {
  const reasons = [];

  if (!position || typeof position !== 'object' || position.ready !== true) {
    reasons.push('notReady');
  }

  if (!Number.isFinite(position?.longitude) || position.longitude < 0 || position.longitude >= 360) {
    reasons.push('invalidLongitude');
  }

  if (!position?.sign || typeof position.sign.key !== 'string' || position.sign.key.length === 0) {
    reasons.push('invalidSign');
  }

  if (!Number.isInteger(position?.degree)
    || !Number.isInteger(position?.minutes)
    || !Number.isInteger(position?.seconds)) {
    reasons.push('invalidZodiacPosition');
  }

  if (typeof position?.sourceSystem !== 'string' || typeof position?.sourceKey !== 'string') {
    reasons.push('missingSource');
  }

  return reasons.length === 0
    ? {
        status: 'ready',
        valid: true,
        reasons: [],
      }
    : {
        status: 'invalid',
        valid: false,
        reasons,
      };
}

export function getFixedStarPositionSummary(result) {
  if (!result || result.ready !== true) {
    return {
      status: 'notReady',
      total: 0,
      ready: 0,
      invalid: 0,
      text: 'Положения неподвижных звезд недоступны',
    };
  }

  return {
    status: 'ready',
    total: result.total,
    ready: result.readyCount,
    invalid: result.invalidCount,
    text: `${result.readyCount} положений неподвижных звезд рассчитаны`,
  };
}

export function getFixedStarPositionCapabilities() {
  return {
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
  };
}

export function getFixedStarPositionLimitations() {
  return [
    'Позиции неподвижных звезд рассчитываются только для source-tracked rows.',
    'Используются координаты Вронского 1950, 1970 и 1990 годов.',
    'Для дат между source epochs применяется линейная интерполяция.',
    'Для дат вне 1950–1990 применяется явная линейная экстраполяция.',
    'Этот модуль не рассчитывает соединения.',
    'Интерпретации не добавлены.',
  ];
}

function resolveDate(dateOrUtcDateTime) {
  if (dateOrUtcDateTime instanceof Date) {
    const cloned = new Date(dateOrUtcDateTime.getTime());

    return Number.isFinite(cloned.getTime()) ? cloned : null;
  }

  if (typeof dateOrUtcDateTime === 'string' || typeof dateOrUtcDateTime === 'number') {
    const date = new Date(dateOrUtcDateTime);

    return Number.isFinite(date.getTime()) ? date : null;
  }

  return null;
}

function invalidDateResult() {
  return {
    status: 'invalid',
    ready: false,
    reason: 'invalidDate',
  };
}

function resolveStarRow(input) {
  const starRow = input.starRow ?? getFixedStarRowByKey(input.starKey);

  if (!starRow && typeof input.starKey === 'string') {
    return {
      status: 'notReady',
      ready: false,
      reason: 'unknownStar',
    };
  }

  if (!isUsableFixedStarRow(starRow)) {
    return {
      status: 'notReady',
      ready: false,
      reason: 'invalidStarRow',
    };
  }

  return {
    status: 'ready',
    ready: true,
    starRow,
  };
}

function resolveEpochYear(input) {
  if (Number.isFinite(input.epochYear)) {
    return {
      status: 'ready',
      ready: true,
      epochYear: Number(input.epochYear),
    };
  }

  return getUtcDecimalYear(input.utcDateTime ?? input.date);
}

function isUsableFixedStarRow(starRow) {
  return Boolean(
    starRow
      && typeof starRow.key === 'string'
      && typeof starRow.labelRu === 'string'
      && typeof starRow.labelEn === 'string'
      && starRow.active === true
      && starRow.verificationStatus === 'verified'
      && starRow.coordinates
      && SOURCE_EPOCHS.every((epoch) => {
        const coordinate = starRow.coordinates[EPOCH_KEYS[epoch]];

        return coordinate
          && coordinate.verified === true
          && Number.isFinite(coordinate.longitude);
      }),
  );
}

function getUnwrappedSourceLongitudes(starRow) {
  const longitude1950 = normalizeDegrees(starRow.coordinates.epoch1950.longitude);
  const longitude1970 = unwrapForward(
    normalizeDegrees(starRow.coordinates.epoch1970.longitude),
    longitude1950,
  );
  const longitude1990 = unwrapForward(
    normalizeDegrees(starRow.coordinates.epoch1990.longitude),
    longitude1970,
  );

  return {
    1950: longitude1950,
    1970: longitude1970,
    1990: longitude1990,
  };
}

function unwrapForward(longitude, previousLongitude) {
  let unwrapped = longitude;

  while (unwrapped + EPSILON < previousLongitude) {
    unwrapped += 360;
  }

  return unwrapped;
}

function getExactSourceEpoch(epochYear) {
  return SOURCE_EPOCHS.find((epoch) => Math.abs(epochYear - epoch) <= EPSILON) ?? null;
}

function getEpochSource(epochYear) {
  if (epochYear < 1950) {
    return {
      mode: 'extrapolation',
      startEpoch: 1950,
      endEpoch: 1970,
      label: '1950-1970',
    };
  }

  if (epochYear < 1970) {
    return {
      mode: 'interpolation',
      startEpoch: 1950,
      endEpoch: 1970,
      label: '1950-1970',
    };
  }

  if (epochYear < 1990) {
    return {
      mode: 'interpolation',
      startEpoch: 1970,
      endEpoch: 1990,
      label: '1970-1990',
    };
  }

  return {
    mode: 'extrapolation',
    startEpoch: 1970,
    endEpoch: 1990,
    label: '1970-1990',
  };
}

function buildLongitudeResult({
  starRow,
  epochYear,
  longitude,
  exactSourceEpoch,
  interpolated,
  extrapolated,
  interpolationSource,
  extrapolationSource,
}) {
  return {
    status: 'ready',
    ready: true,
    key: starRow.key,
    longitude: normalizeDegrees(longitude),
    sourceSystem: starRow.sourceSystem,
    sourceKey: starRow.sourceKey,
    requestedEpochYear: epochYear,
    positionEpochPolicy: POSITION_EPOCH_POLICY,
    exactSourceEpoch,
    interpolated,
    extrapolated,
    interpolationSource,
    extrapolationSource,
  };
}

function formatFixedStar(starRow, longitude) {
  const degreeFormat = formatDegree(longitude, { precision: 'second', rounding: 'nearest' });
  const sign = ASTRO_ZODIAC_SIGNS.find((item) => item.key === degreeFormat.signKey);
  const degree = String(degreeFormat.degree).padStart(2, '0');
  const minutes = String(degreeFormat.minutes).padStart(2, '0');
  const seconds = String(degreeFormat.seconds).padStart(2, '0');

  return {
    sign: {
      key: sign.key,
      ru: sign.ru,
      symbol: sign.symbol,
    },
    degree: degreeFormat.degree,
    minutes: degreeFormat.minutes,
    seconds: degreeFormat.seconds,
    text: `${starRow.labelRu} — ${sign.ru} ${degree}°${minutes}′${seconds}″`,
  };
}

function getPositionLimitations(longitudeResult) {
  const limitations = [
    'Позиция рассчитана по source-tracked координатам Вронского.',
  ];

  if (longitudeResult.extrapolated) {
    limitations.push('Положение получено экстраполяцией за пределами 1950–1990 годов.');
  }

  limitations.push('Интерпретации не добавлены.');

  return limitations;
}
