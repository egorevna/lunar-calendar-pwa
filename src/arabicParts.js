import {
  ARABIC_PARTS_VERIFICATION_STATUS,
  getActiveArabicPartsFormulas,
  getArabicPartFormulaByKey,
  getVronskySimpleArabicPartsFormulaRows,
} from './arabicPartsData.js';
import {
  formatDegree,
  normalizeDegrees,
} from './astroMath.js';
import { calculateAscMcForProfile } from './ascMc.js';
import { calculateDayNightChartStatusForProfile } from './dayNightChart.js';
import {
  evaluateHousesInputReadiness,
  getHousesInputFallbackMessage,
} from './housesInputGuardrails.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';

const READY_STATUS = 'ready';
const PARTIAL_STATUS = 'partial';
const NOT_READY_STATUS = 'notReady';
const UNSUPPORTED_STATUS = 'unsupported';
const REQUIRED_INPUTS = Object.freeze(['asc', 'sun', 'moon', 'chartSect']);
const VRONSKY_SIMPLE_REQUIRED_INPUTS = Object.freeze([
  'asc',
  'sun',
  'moon',
  'mercury',
  'venus',
  'jupiter',
  'saturn',
  'uranus',
  'chartSect',
]);
const EMPTY_ARRAY = Object.freeze([]);

const OPERAND_KEYS = Object.freeze({
  asc: 'ascLongitude',
  sun: 'sunLongitude',
  moon: 'moonLongitude',
  mercury: 'mercuryLongitude',
  venus: 'venusLongitude',
  jupiter: 'jupiterLongitude',
  saturn: 'saturnLongitude',
  uranus: 'uranusLongitude',
});

const MESSAGES = Object.freeze({
  missingProfile: 'Сначала выберите профиль.',
  missingFormulaRow: 'Формула жребия не найдена.',
  formulaNotFound: 'Формула жребия не найдена.',
  formulaNotActive: 'Эта формула арабской части пока не активна.',
  formulaNotVerified: 'Эта формула арабской части еще не верифицирована.',
  missingAscLongitude: 'Для расчета арабских частей нужен ASC.',
  missingSunLongitude: 'Для расчета арабских частей нужно положение Солнца.',
  missingMoonLongitude: 'Для расчета арабских частей нужно положение Луны.',
  natalPlanetsNotReady: 'Для расчета арабских частей нужны положения Солнца и Луны.',
  dayNightChartNotReady: 'Для расчета арабских частей нужен статус дневной/ночной карты.',
  chartSectBoundary: 'Солнце находится на границе горизонта, поэтому формула арабских частей не выбирается автоматически.',
  unknownChartSect: 'Для арабских частей нужен дневной или ночной вариант карты.',
  noActiveFormulas: 'Нет активных верифицированных формул арабских частей.',
  missingRequiredInputs: 'Для расчета арабских частей нужны ASC, Солнце, Луна и дневная/ночная карта.',
  missingRequiredLongitude: 'Для расчета точек Вронского нужны выбранные планетные долготы.',
  vronskyNightFormulaNotVerified: 'Ночные формулы Вронского не верифицированы.',
  chartSectNotReady: 'Для точек Вронского нужна дневная карта.',
  vronskyFormulaNotFound: 'Формула Вронского не входит в выбранный простой набор.',
  calculationError: 'Арабские части не удалось рассчитать безопасно.',
});

export function calculateArabicPartFromFormula(input = {}) {
  const formulaRow = input.formulaRow;

  if (!isPlainObject(formulaRow)) {
    return unsupportedPartResult({
      key: null,
      reason: 'missingFormulaRow',
      requiredInputs: REQUIRED_INPUTS,
    });
  }

  if (formulaRow.active !== true) {
    return unsupportedPartResult({
      row: formulaRow,
      reason: 'formulaNotActive',
    });
  }

  if (formulaRow.verificationStatus !== ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED) {
    return unsupportedPartResult({
      row: formulaRow,
      reason: 'formulaNotVerified',
    });
  }

  const readiness = getArabicPartsInputReadiness(input);

  if (!readiness.ready) {
    return notReadyPartResult({
      row: formulaRow,
      reason: readiness.reason,
    });
  }

  const formula = getArabicPartFormulaForSect(formulaRow, input.chartSect);

  if (!formula) {
    return notReadyPartResult({
      row: formulaRow,
      reason: input.chartSect === 'boundary' ? 'chartSectBoundary' : 'unknownChartSect',
    });
  }

  const longitude = evaluateFormulaOperands({
    operands: formula.operands,
    values: {
      asc: normalizeDegrees(input.ascLongitude),
      sun: normalizeDegrees(input.sunLongitude),
      moon: normalizeDegrees(input.moonLongitude),
    },
  });

  if (longitude === null) {
    return notReadyPartResult({
      row: formulaRow,
      reason: 'calculationError',
    });
  }

  return readyPartResult({
    row: formulaRow,
    longitude,
    formula,
    chartSect: input.chartSect,
  });
}

export function calculateArabicPartsFromLongitudes(input = {}) {
  const readiness = getArabicPartsInputReadiness(input);

  if (!readiness.ready) {
    return aggregateNotReadyResult({
      reason: readiness.reason,
      chartSect: input.chartSect ?? null,
    });
  }

  const targets = getFormulaTargets(input.formulaKeys);

  if (targets.length === 0) {
    return aggregateNotReadyResult({
      reason: 'noActiveFormulas',
      chartSect: input.chartSect,
    });
  }

  const parts = targets.map((target) => {
    if (target.missing) {
      return unsupportedPartResult({
        key: target.key,
        reason: 'formulaNotFound',
        requiredInputs: REQUIRED_INPUTS,
      });
    }

    return calculateArabicPartFromFormula({
      formulaRow: target.row,
      ascLongitude: input.ascLongitude,
      sunLongitude: input.sunLongitude,
      moonLongitude: input.moonLongitude,
      chartSect: input.chartSect,
    });
  });

  return aggregatePartsResult({
    parts,
    chartSect: input.chartSect,
  });
}

export function calculateArabicPartsForProfile(profile = null, options = {}) {
  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return aggregateNotReadyResult({
      reason: readiness.reason,
      message: readiness.message ?? getHousesInputFallbackMessage(readiness.reason),
      chartSect: null,
    });
  }

  const ascMcResult = isPlainObject(options.ascMcResult)
    ? options.ascMcResult
    : calculateAscMcForProfile(profile);
  const ascLongitude = normalizeDegrees(ascMcResult?.angles?.asc?.longitude);

  if (ascMcResult?.status !== READY_STATUS || ascLongitude === null) {
    return aggregateNotReadyResult({
      reason: 'missingAscLongitude',
      chartSect: null,
    });
  }

  const natalPlanets = isPlainObject(options.natalPlanetsResult)
    ? options.natalPlanetsResult
    : getNatalPlanetsForProfile(profile);

  if (!isPlainObject(natalPlanets) || natalPlanets.status !== READY_STATUS) {
    return aggregateNotReadyResult({
      reason: 'natalPlanetsNotReady',
      chartSect: null,
    });
  }

  const sunLongitude = getPlanetLongitude(natalPlanets, 'sun');
  const moonLongitude = getPlanetLongitude(natalPlanets, 'moon');

  if (sunLongitude === null) {
    return aggregateNotReadyResult({
      reason: 'missingSunLongitude',
      chartSect: null,
    });
  }

  if (moonLongitude === null) {
    return aggregateNotReadyResult({
      reason: 'missingMoonLongitude',
      chartSect: null,
    });
  }

  const dayNightStatus = isPlainObject(options.dayNightChartStatus)
    ? options.dayNightChartStatus
    : calculateDayNightChartStatusForProfile(profile, {
      ...options,
      natalPlanetsResult: natalPlanets,
    });

  if (dayNightStatus?.status === 'boundary' || dayNightStatus?.boundary === true) {
    return aggregateNotReadyResult({
      reason: 'chartSectBoundary',
      chartSect: null,
    });
  }

  if (dayNightStatus?.status !== READY_STATUS || !['day', 'night'].includes(dayNightStatus?.chartSect)) {
    return aggregateNotReadyResult({
      reason: dayNightStatus?.reason ?? 'dayNightChartNotReady',
      message: dayNightStatus?.message ?? null,
      chartSect: null,
    });
  }

  const result = calculateArabicPartsFromLongitudes({
    ascLongitude,
    sunLongitude,
    moonLongitude,
    chartSect: dayNightStatus.chartSect,
    formulaKeys: options.formulaKeys,
  });

  if (!result.ready) {
    return result;
  }

  return Object.freeze({
    ...result,
    source: 'profile-natal-sun-moon',
  });
}

export function getVronskySimpleArabicPartFormula(key) {
  if (typeof key !== 'string' || key.trim() === '') {
    return null;
  }

  return getVronskySimpleArabicPartsFormulaRows().find((row) => row.key === key) ?? null;
}

export function getVronskySimpleArabicPartsInputReadiness(input = {}) {
  return getVronskyInputReadiness({
    input,
    requiredInputs: VRONSKY_SIMPLE_REQUIRED_INPUTS,
  });
}

export function calculateVronskySimpleArabicPartFromLongitudes(rowOrKey, input = {}) {
  const row = typeof rowOrKey === 'string'
    ? getVronskySimpleArabicPartFormula(rowOrKey)
    : getVronskySimpleArabicPartFormula(rowOrKey?.key);

  if (!row) {
    return notReadyVronskyPartResult({
      row: null,
      key: typeof rowOrKey === 'string' ? rowOrKey : rowOrKey?.key ?? null,
      reason: 'vronskyFormulaNotFound',
      requiredInputs: EMPTY_ARRAY,
    });
  }

  const readiness = getVronskyInputReadiness({
    input,
    requiredInputs: row.requiredInputs ?? VRONSKY_SIMPLE_REQUIRED_INPUTS,
  });

  if (!readiness.ready) {
    return notReadyVronskyPartResult({
      row,
      reason: readiness.reason,
      missingInputs: readiness.missingInputs,
      requiredInputs: readiness.requiredInputs,
    });
  }

  const formula = row.formula?.day ?? null;
  const values = getVronskyFormulaValues(input);
  const longitude = evaluateFormulaOperands({
    operands: formula?.operands,
    values,
  });

  if (longitude === null) {
    return notReadyVronskyPartResult({
      row,
      reason: 'calculationError',
      requiredInputs: row.requiredInputs ?? VRONSKY_SIMPLE_REQUIRED_INPUTS,
    });
  }

  return readyVronskyPartResult({
    row,
    longitude,
    formula,
  });
}

export function calculateVronskySimpleArabicPartsFromLongitudes(input = {}) {
  const rows = getVronskySimpleArabicPartsFormulaRows();

  if (rows.length === 0) {
    return aggregateVronskyPartsResult({
      parts: EMPTY_ARRAY,
      chartSect: input.chartSect ?? null,
      reason: 'vronskyFormulaNotFound',
    });
  }

  const parts = rows.map((row) => calculateVronskySimpleArabicPartFromLongitudes(row.key, input));

  return aggregateVronskyPartsResult({
    parts,
    chartSect: input.chartSect ?? null,
  });
}

export function calculateVronskySimpleArabicPartsForProfile(profile = null, options = {}) {
  if (!isPlainObject(profile)) {
    return aggregateVronskyNotReadyResult({
      reason: 'missingProfile',
      chartSect: null,
    });
  }

  const readiness = evaluateHousesInputReadiness(profile);

  if (!readiness.ready) {
    return aggregateVronskyNotReadyResult({
      reason: readiness.reason,
      message: readiness.message ?? getHousesInputFallbackMessage(readiness.reason),
      chartSect: null,
    });
  }

  const ascMcResult = isPlainObject(options.ascMcResult)
    ? options.ascMcResult
    : calculateAscMcForProfile(profile);
  const asc = normalizeDegrees(ascMcResult?.angles?.asc?.longitude);

  if (ascMcResult?.status !== READY_STATUS || asc === null) {
    return aggregateVronskyNotReadyResult({
      reason: 'missingAscLongitude',
      chartSect: null,
    });
  }

  const natalPlanets = isPlainObject(options.natalPlanetsResult)
    ? options.natalPlanetsResult
    : getNatalPlanetsForProfile(profile);

  if (!isPlainObject(natalPlanets) || natalPlanets.status !== READY_STATUS) {
    return aggregateVronskyNotReadyResult({
      reason: 'natalPlanetsNotReady',
      chartSect: null,
    });
  }

  const dayNightStatus = isPlainObject(options.dayNightChartStatus)
    ? options.dayNightChartStatus
    : calculateDayNightChartStatusForProfile(profile, {
      ...options,
      natalPlanetsResult: natalPlanets,
    });

  const chartSect = dayNightStatus?.chartSect ?? dayNightStatus?.status ?? null;
  const result = calculateVronskySimpleArabicPartsFromLongitudes({
    asc,
    sun: getPlanetLongitude(natalPlanets, 'sun'),
    moon: getPlanetLongitude(natalPlanets, 'moon'),
    mercury: getPlanetLongitude(natalPlanets, 'mercury'),
    venus: getPlanetLongitude(natalPlanets, 'venus'),
    jupiter: getPlanetLongitude(natalPlanets, 'jupiter'),
    saturn: getPlanetLongitude(natalPlanets, 'saturn'),
    uranus: getPlanetLongitude(natalPlanets, 'uranus'),
    chartSect,
  });

  if (!result.ready) {
    return result;
  }

  return Object.freeze({
    ...result,
    source: 'profile-vronsky-natal-planets',
  });
}

export function getVronskySimpleArabicPartsSummary(result = {}) {
  const readyCount = Number.isFinite(result.readyCount) ? result.readyCount : 0;

  if (result.status === READY_STATUS && readyCount > 0) {
    return Object.freeze({
      status: READY_STATUS,
      text: `${readyCount} точек Вронского рассчитаны`,
      readyCount,
    });
  }

  if (result.reason === 'vronskyNightFormulaNotVerified') {
    return Object.freeze({
      status: NOT_READY_STATUS,
      text: 'Точки Вронского недоступны для ночной карты без verified night formulas',
      readyCount: 0,
    });
  }

  return Object.freeze({
    status: result.status === PARTIAL_STATUS ? PARTIAL_STATUS : NOT_READY_STATUS,
    text: readyCount > 0 ? `${readyCount} точек Вронского рассчитаны частично` : 'Точки Вронского недоступны',
    readyCount,
  });
}

export function getVronskySimpleArabicPartsEngineCapabilities() {
  return Object.freeze({
    vronskySimpleArabicParts: true,
    dayOnly: true,
    nightFormulas: false,
    defaultArabicPartsOutput: false,
    houseAssignment: false,
    display: false,
    ui: false,
    debug: false,
    interpretations: false,
    externalTraditions: false,
  });
}

export function getVronskySimpleArabicPartsEngineLimitations() {
  return Object.freeze([
    'Точки Вронского рассчитываются только для дневных карт.',
    'Ночные формулы Вронского не верифицированы и не рассчитываются.',
    'Используется только выбранный простой набор из 12 строк Вронского.',
    'Этот explicit API не меняет дефолтный вывод Pars Fortuna и Lot of Spirit.',
    'Этот модуль не назначает точки Вронского в дома.',
    'Интерпретации не добавлены.',
  ]);
}

export function getArabicPartFormulaForSect(formulaRow, chartSect) {
  if (!isActiveVerifiedRow(formulaRow)) {
    return null;
  }

  if (chartSect === 'day') {
    return formulaRow.formula?.day ?? null;
  }

  if (chartSect === 'night') {
    return formulaRow.formula?.night ?? null;
  }

  return null;
}

export function getArabicPartsInputReadiness(input = {}) {
  const missingInputs = [];
  const asc = normalizeDegrees(input.ascLongitude);
  const sun = normalizeDegrees(input.sunLongitude);
  const moon = normalizeDegrees(input.moonLongitude);

  if (asc === null) {
    missingInputs.push('asc');
  }

  if (sun === null) {
    missingInputs.push('sun');
  }

  if (moon === null) {
    missingInputs.push('moon');
  }

  if (!['day', 'night'].includes(input.chartSect)) {
    missingInputs.push('chartSect');
  }

  const reason = getInputReadinessReason({
    asc,
    sun,
    moon,
    chartSect: input.chartSect,
  });

  if (reason) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      ready: false,
      reason,
      missingInputs: freezeArray(missingInputs),
      requiredInputs: REQUIRED_INPUTS,
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    reason: null,
    missingInputs: EMPTY_ARRAY,
    requiredInputs: REQUIRED_INPUTS,
  });
}

export function getArabicPartsSummary(results = {}) {
  const parts = Array.isArray(results.parts) ? results.parts : [];
  const readyParts = parts.filter((part) => part?.status === READY_STATUS);
  const invalidParts = parts.filter((part) => part?.status !== READY_STATUS);

  if (readyParts.length === 0) {
    return Object.freeze({
      total: 0,
      ready: 0,
      invalid: 0,
      activeFormulaKeys: EMPTY_ARRAY,
      text: 'Жребии недоступны',
    });
  }

  return Object.freeze({
    total: parts.length,
    ready: readyParts.length,
    invalid: invalidParts.length,
    activeFormulaKeys: freezeArray(readyParts.map((part) => part.key)),
    text: 'Жребии рассчитаны',
  });
}

export function getArabicPartsEngineCapabilities() {
  return Object.freeze({
    arabicParts: true,
    parsFortuna: true,
    lotOfSpirit: true,
    deferredParts: false,
    houseAssignment: false,
    interpretations: false,
    transits: false,
    fixedStars: false,
  });
}

export function getArabicPartsEngineLimitations() {
  return Object.freeze([
    'Рассчитываются только verified formulas из набора Arabic Parts.',
    'В Sprint 12 активны Pars Fortuna и Lot of Spirit.',
    'Остальные арабские части отложены до проверки источников.',
    'Этот модуль не назначает жребии в дома.',
    'Интерпретации не добавлены.',
  ]);
}

function getFormulaTargets(formulaKeys) {
  if (Array.isArray(formulaKeys) && formulaKeys.length > 0) {
    return formulaKeys.map((key) => {
      const row = getArabicPartFormulaByKey(key);
      const safeKey = typeof key === 'string' && key.trim() ? key : null;

      return row
        ? { row }
        : { missing: true, key: safeKey };
    });
  }

  return getActiveArabicPartsFormulas().map((row) => ({ row }));
}

function aggregatePartsResult({ parts, chartSect }) {
  const readyCount = parts.filter((part) => part.status === READY_STATUS).length;
  const invalidCount = parts.length - readyCount;
  const status = readyCount === parts.length
    ? READY_STATUS
    : readyCount > 0 ? PARTIAL_STATUS : NOT_READY_STATUS;

  return Object.freeze({
    status,
    ready: readyCount > 0,
    reason: readyCount > 0 ? null : 'missingRequiredInputs',
    message: readyCount > 0 ? null : MESSAGES.missingRequiredInputs,
    chartSect,
    total: parts.length,
    readyCount,
    invalidCount,
    parts: freezeArray(parts),
    limitations: getArabicPartsEngineLimitations(),
    capabilities: getArabicPartsEngineCapabilities(),
  });
}

function aggregateNotReadyResult({ reason, message = null, chartSect = null }) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    message: message ?? MESSAGES[reason] ?? MESSAGES.missingRequiredInputs,
    chartSect,
    total: 0,
    readyCount: 0,
    invalidCount: 0,
    parts: EMPTY_ARRAY,
    limitations: getArabicPartsEngineLimitations(),
    capabilities: getArabicPartsEngineCapabilities(),
  });
}

function aggregateVronskyPartsResult({
  parts,
  chartSect,
  reason = null,
}) {
  const safeParts = Array.isArray(parts) ? parts : EMPTY_ARRAY;
  const readyCount = safeParts.filter((part) => part.status === READY_STATUS).length;
  const notReadyCount = safeParts.length - readyCount;
  const firstReason = reason ?? safeParts.find((part) => part.status !== READY_STATUS)?.reason ?? null;
  const status = readyCount === safeParts.length && safeParts.length > 0
    ? READY_STATUS
    : readyCount > 0 ? PARTIAL_STATUS : NOT_READY_STATUS;

  return Object.freeze({
    status,
    ready: readyCount > 0,
    reason: status === READY_STATUS ? null : firstReason,
    message: status === READY_STATUS ? null : MESSAGES[firstReason] ?? MESSAGES.calculationError,
    sourceSystem: 'vronsky-table-17-arabic-points',
    formulaTradition: 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: 'dayOnly',
    chartSect,
    total: safeParts.length,
    readyCount,
    notReadyCount,
    parts: freezeArray(safeParts),
    limitations: getVronskySimpleArabicPartsEngineLimitations(),
    capabilities: getVronskySimpleArabicPartsEngineCapabilities(),
  });
}

function aggregateVronskyNotReadyResult({ reason, message = null, chartSect = null }) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    reason,
    message: message ?? MESSAGES[reason] ?? MESSAGES.calculationError,
    sourceSystem: 'vronsky-table-17-arabic-points',
    formulaTradition: 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: 'dayOnly',
    chartSect,
    total: 0,
    readyCount: 0,
    notReadyCount: 0,
    parts: EMPTY_ARRAY,
    limitations: getVronskySimpleArabicPartsEngineLimitations(),
    capabilities: getVronskySimpleArabicPartsEngineCapabilities(),
  });
}

function readyPartResult({
  row,
  longitude,
  formula,
  chartSect,
}) {
  const formatted = formatDegree(longitude);

  if (!formatted.signKey) {
    return notReadyPartResult({
      row,
      reason: 'calculationError',
    });
  }

  const position = `${formatted.sign} ${formatted.degree}°${pad2(formatted.minutes)}′${pad2(formatted.seconds)}″`;

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    key: row.key,
    label: row.labelRu,
    labelEn: row.labelEn,
    longitude,
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${row.labelRu} — ${position}`,
    formulaVariant: chartSect,
    formula: formula.expression,
    chartSect,
    requiredInputs: freezeArray(row.requiredInputs ?? REQUIRED_INPUTS),
    verificationStatus: row.verificationStatus,
  });
}

function readyVronskyPartResult({
  row,
  longitude,
  formula,
}) {
  const formatted = formatDegree(longitude);

  if (!formatted.signKey) {
    return notReadyVronskyPartResult({
      row,
      reason: 'calculationError',
      requiredInputs: row.requiredInputs ?? VRONSKY_SIMPLE_REQUIRED_INPUTS,
    });
  }

  const position = `${formatted.sign} ${formatted.degree}°${pad2(formatted.minutes)}′${pad2(formatted.seconds)}″`;

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    key: row.key,
    label: row.labelRu,
    labelEn: row.labelEn,
    longitude,
    sign: Object.freeze({
      key: formatted.signKey,
      ru: formatted.sign,
      symbol: formatted.symbol,
    }),
    degree: formatted.degree,
    minutes: formatted.minutes,
    seconds: formatted.seconds,
    text: `${row.labelRu} — ${position}`,
    formulaVariant: 'day',
    formula: formula?.expression ?? null,
    sourceExpression: formula?.sourceExpression ?? null,
    sourceSystem: row.sourceSystem,
    formulaTradition: row.formulaTradition,
    chartSectPolicy: row.chartSectPolicy,
    sourceSection: row.sourceSection,
    sourceStatus: row.sourceStatus,
    engineStatus: row.engineStatus,
    activationStatus: row.activationStatus,
    requiredInputs: freezeArray(row.requiredInputs ?? VRONSKY_SIMPLE_REQUIRED_INPUTS),
    verificationStatus: row.verificationStatus,
  });
}

function notReadyPartResult({ row, reason }) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    key: row?.key ?? null,
    label: row?.labelRu ?? null,
    labelEn: row?.labelEn ?? null,
    longitude: null,
    houseNumber: null,
    reason,
    message: MESSAGES[reason] ?? MESSAGES.calculationError,
    formulaVariant: null,
    formula: null,
    requiredInputs: freezeArray(row?.requiredInputs ?? REQUIRED_INPUTS),
    verificationStatus: row?.verificationStatus ?? null,
  });
}

function notReadyVronskyPartResult({
  row,
  key = null,
  reason,
  missingInputs = EMPTY_ARRAY,
  requiredInputs = null,
}) {
  return Object.freeze({
    status: NOT_READY_STATUS,
    ready: false,
    key: row?.key ?? key,
    label: row?.labelRu ?? null,
    labelEn: row?.labelEn ?? null,
    longitude: null,
    houseNumber: null,
    reason,
    message: MESSAGES[reason] ?? MESSAGES.calculationError,
    missingInputs: freezeArray(missingInputs),
    formulaVariant: null,
    formula: null,
    sourceSystem: row?.sourceSystem ?? 'vronsky-table-17-arabic-points',
    formulaTradition: row?.formulaTradition ?? 'Vronsky Table 17 Arabic Points',
    chartSectPolicy: row?.chartSectPolicy ?? 'dayOnly',
    engineStatus: row?.engineStatus ?? null,
    activationStatus: row?.activationStatus ?? null,
    requiredInputs: freezeArray(requiredInputs ?? row?.requiredInputs ?? VRONSKY_SIMPLE_REQUIRED_INPUTS),
    verificationStatus: row?.verificationStatus ?? null,
  });
}

function unsupportedPartResult({
  row = null,
  key = null,
  reason,
  requiredInputs = null,
}) {
  return Object.freeze({
    status: UNSUPPORTED_STATUS,
    ready: false,
    key: row?.key ?? key,
    label: row?.labelRu ?? null,
    labelEn: row?.labelEn ?? null,
    longitude: null,
    houseNumber: null,
    reason,
    message: MESSAGES[reason] ?? MESSAGES.formulaNotActive,
    formulaVariant: null,
    formula: null,
    requiredInputs: freezeArray(requiredInputs ?? row?.requiredInputs ?? REQUIRED_INPUTS),
    verificationStatus: row?.verificationStatus ?? null,
  });
}

function evaluateFormulaOperands({ operands, values }) {
  if (!Array.isArray(operands) || operands.length === 0) {
    return null;
  }

  const first = getOperandValue(operands[0], values);

  if (first === null) {
    return null;
  }

  let total = first;

  for (let index = 1; index < operands.length; index += 2) {
    const operator = operands[index];
    const operand = getOperandValue(operands[index + 1], values);

    if (!['+', '-'].includes(operator) || operand === null) {
      return null;
    }

    total = operator === '+'
      ? total + operand
      : total - operand;
  }

  return normalizeDegrees(total);
}

function getOperandValue(operand, values) {
  if (!Object.prototype.hasOwnProperty.call(OPERAND_KEYS, operand)) {
    return null;
  }

  const value = values[operand];

  return Number.isFinite(value) ? value : null;
}

function getInputReadinessReason({
  asc,
  sun,
  moon,
  chartSect,
}) {
  if (asc === null) {
    return 'missingAscLongitude';
  }

  if (sun === null) {
    return 'missingSunLongitude';
  }

  if (moon === null) {
    return 'missingMoonLongitude';
  }

  if (chartSect === 'boundary') {
    return 'chartSectBoundary';
  }

  if (!['day', 'night'].includes(chartSect)) {
    return 'unknownChartSect';
  }

  return null;
}

function getVronskyInputReadiness({ input, requiredInputs }) {
  const safeRequiredInputs = Array.isArray(requiredInputs)
    ? requiredInputs
    : VRONSKY_SIMPLE_REQUIRED_INPUTS;
  const missingInputs = [];

  safeRequiredInputs.forEach((key) => {
    if (key === 'chartSect') {
      if (input.chartSect !== 'day') {
        missingInputs.push(key);
      }

      return;
    }

    if (getVronskyInputLongitude(input, key) === null) {
      missingInputs.push(key);
    }
  });

  const reason = getVronskyReadinessReason({
    chartSect: input.chartSect,
    missingInputs,
  });

  if (reason) {
    return Object.freeze({
      status: NOT_READY_STATUS,
      ready: false,
      reason,
      missingInputs: freezeArray(reason === 'missingRequiredLongitude'
        ? missingInputs.filter((key) => key !== 'chartSect')
        : missingInputs),
      requiredInputs: freezeArray(safeRequiredInputs),
    });
  }

  return Object.freeze({
    status: READY_STATUS,
    ready: true,
    reason: null,
    missingInputs: EMPTY_ARRAY,
    requiredInputs: freezeArray(safeRequiredInputs),
  });
}

function getVronskyReadinessReason({ chartSect, missingInputs }) {
  if (chartSect === 'night') {
    return 'vronskyNightFormulaNotVerified';
  }

  if (chartSect === 'boundary') {
    return 'chartSectBoundary';
  }

  if (chartSect !== 'day') {
    return 'chartSectNotReady';
  }

  if (missingInputs.some((key) => key !== 'chartSect')) {
    return 'missingRequiredLongitude';
  }

  return null;
}

function getVronskyFormulaValues(input) {
  return Object.freeze({
    asc: getVronskyInputLongitude(input, 'asc'),
    sun: getVronskyInputLongitude(input, 'sun'),
    moon: getVronskyInputLongitude(input, 'moon'),
    mercury: getVronskyInputLongitude(input, 'mercury'),
    venus: getVronskyInputLongitude(input, 'venus'),
    jupiter: getVronskyInputLongitude(input, 'jupiter'),
    saturn: getVronskyInputLongitude(input, 'saturn'),
    uranus: getVronskyInputLongitude(input, 'uranus'),
  });
}

function getVronskyInputLongitude(input, key) {
  const aliasKey = OPERAND_KEYS[key];
  const directLongitude = normalizeDegrees(input?.[key]);

  if (directLongitude !== null) {
    return directLongitude;
  }

  if (typeof aliasKey !== 'string') {
    return null;
  }

  return normalizeDegrees(input?.[aliasKey]);
}

function getPlanetLongitude(natalPlanets, key) {
  const planets = Array.isArray(natalPlanets?.planets) ? natalPlanets.planets : [];
  const planet = planets.find((item) => item?.key === key);
  const longitude = normalizeDegrees(planet?.longitude);

  return longitude === null ? null : longitude;
}

function isActiveVerifiedRow(row) {
  return Boolean(
    isPlainObject(row)
    && row.active === true
    && row.verificationStatus === ARABIC_PARTS_VERIFICATION_STATUS.VERIFIED,
  );
}

function freezeArray(items) {
  return Object.freeze([...items]);
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function isPlainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}
