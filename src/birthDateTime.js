import { DateTime, IANAZone } from './vendor/luxon.mjs';

import { normalizeProfile } from './profileModel.js';

export const BIRTH_DATE_TIME_STATUS = Object.freeze({
  READY: 'ready',
  INCOMPLETE: 'incomplete',
  NOT_SUPPORTED: 'notSupported',
});

const KNOWN_TIME_ACCURACIES = ['exact', 'approximate'];
const UNKNOWN_TIME_WARNING = 'Время рождения неизвестно — ASC/MC и дома недоступны.';
const TIMEZONE_WARNING = 'Для точного расчета нужен часовой пояс места рождения.';
const COORDINATES_LIMITATION = 'Для домов и ASC/MC нужны координаты места рождения.';
const UTC_LIMITATION = 'Точная конвертация времени рождения в UTC требует надежной timezone-стратегии.';
const HOUSE_ENGINE_LIMITATION = 'Дома и ASC/MC требуют отдельного надежного расчетного движка.';
const AMBIGUOUS_TIME_WARNING =
  'Время рождения попадает в неоднозначный переход часового пояса — нужен ручной выбор смещения.';
const NONEXISTENT_TIME_WARNING =
  'Время рождения попадает в несуществующий переход часового пояса.';

export function parseBirthDate(value) {
  const normalized = trimString(value);
  const errors = [];
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(normalized);

  if (!match) {
    errors.push('birthDate must use YYYY-MM-DD');
    return birthDateResult({ value: normalized, errors });
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const maxDay = getDaysInMonth(year, month);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day) || maxDay === 0 || day < 1 || day > maxDay) {
    errors.push('birthDate is not a real calendar date');
    return birthDateResult({ value: normalized, errors });
  }

  return birthDateResult({
    ok: true,
    year,
    month,
    day,
    value: normalized,
  });
}

export function parseBirthTime(value, birthTimeAccuracy = 'exact') {
  const accuracy = normalizeAccuracy(birthTimeAccuracy);
  const normalized = trimString(value);
  const errors = [];

  if (accuracy === 'unknown' && !normalized) {
    return birthTimeResult({
      ok: true,
      value: '',
      hasKnownTime: false,
      accuracy,
    });
  }

  if (!normalized && KNOWN_TIME_ACCURACIES.includes(accuracy)) {
    errors.push('birthTime is required');
    return birthTimeResult({ value: normalized, accuracy, errors });
  }

  const match = /^(\d{2}):(\d{2})$/.exec(normalized);

  if (!match) {
    errors.push('birthTime must use HH:mm');
    return birthTimeResult({ value: normalized, accuracy, errors });
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    errors.push('birthTime must use HH:mm');
    return birthTimeResult({ value: normalized, accuracy, errors });
  }

  return birthTimeResult({
    ok: true,
    hour,
    minute,
    value: normalized,
    hasKnownTime: accuracy !== 'unknown',
    accuracy,
  });
}

export function normalizeTimezone(value) {
  const timezone = trimString(value);
  const errors = [];

  if (!timezone) {
    errors.push('timezone is required');
    return { ok: false, timezone: '', errors };
  }

  if (typeof IANAZone?.isValidZone === 'function') {
    if (!IANAZone.isValidZone(timezone)) {
      errors.push('timezone must be a valid IANA timezone');
    }

    return {
      ok: errors.length === 0,
      timezone,
      errors,
    };
  }

  if (canValidateTimezoneWithIntl()) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date(0));
    } catch {
      errors.push('timezone must be a valid IANA timezone');
    }
  }

  return {
    ok: errors.length === 0,
    timezone,
    errors,
  };
}

export function createBirthDateTimeInput(profile) {
  const normalized = normalizeProfile(profile);
  const date = parseBirthDate(normalized.birthDate);
  const time = parseBirthTime(normalized.birthTime, normalized.birthTimeAccuracy);
  const timezone = normalizeTimezone(normalized.birthPlace.timezone);
  const hasCoordinates = hasBirthCoordinates(normalized.birthPlace);
  const missingFields = [];
  const warnings = [];
  const limitations = [];
  const errors = [];
  let conversion = birthUtcConversionResult();

  if (!date.ok) {
    missingFields.push('birthDate');
    errors.push(...date.errors);
  }

  if (!time.ok) {
    missingFields.push('birthTime');
    errors.push(...time.errors);
  }

  if (!timezone.ok) {
    missingFields.push('birthPlace.timezone');
    warnings.push(TIMEZONE_WARNING);
    errors.push(...timezone.errors);
  }

  if (!hasCoordinates) {
    missingFields.push('birthPlace.coordinates');
    limitations.push(COORDINATES_LIMITATION);
  }

  if (!time.hasKnownTime) {
    warnings.push(UNKNOWN_TIME_WARNING);
    limitations.push(UNKNOWN_TIME_WARNING);
  }

  if (date.ok && time.ok && time.hasKnownTime && timezone.ok) {
    conversion = convertBirthLocalDateTimeToUtc(date, time, timezone.timezone);

    if (!conversion.ok) {
      warnings.push(...conversion.warnings);
      limitations.push(...conversion.limitations);
      errors.push(...conversion.errors);
    }
  }

  const isIncomplete = missingFields.includes('birthDate')
    || missingFields.includes('birthTime')
    || missingFields.includes('birthPlace.timezone')
    || !time.hasKnownTime
    || (date.ok && time.ok && time.hasKnownTime && timezone.ok && !conversion.ok);

  return {
    status: conversion.ok && !isIncomplete
      ? BIRTH_DATE_TIME_STATUS.READY
      : BIRTH_DATE_TIME_STATUS.INCOMPLETE,
    localDate: date.ok ? pickDate(date) : null,
    localTime: time.ok && time.hasKnownTime ? pickTime(time) : null,
    timezone: timezone.ok ? timezone.timezone : null,
    birthTimeAccuracy: time.accuracy,
    hasKnownTime: time.hasKnownTime,
    birthPlace: normalized.birthPlace,
    canConvertToUtc: conversion.ok && !isIncomplete,
    utcDateTime: conversion.ok && !isIncomplete ? conversion.utcDateTime : null,
    missingFields: unique(missingFields),
    warnings: unique(warnings),
    limitations: unique(limitations),
    errors: unique(errors),
  };
}

export function getBirthDateTimeReadiness(profile) {
  const input = createBirthDateTimeInput(profile);
  const hasDate = Boolean(input.localDate);
  const hasKnownTime = Boolean(input.hasKnownTime && input.localTime);
  const hasTimezone = Boolean(input.timezone);
  const hasCoordinates = hasBirthCoordinates(input.birthPlace);
  const hasTimeInputs = hasDate && hasKnownTime && hasTimezone;

  return {
    readyForDateBasedCalculations: hasDate,
    readyForTimeBasedCalculations: hasTimeInputs && input.canConvertToUtc,
    readyForHouseCalculations: false,
    readyForAscMc: false,
    missingFields: input.missingFields,
    warnings: input.warnings,
    limitations: unique([
      ...input.limitations,
      input.canConvertToUtc && hasCoordinates ? HOUSE_ENGINE_LIMITATION : '',
    ]),
  };
}

export function explainBirthDateTimeLimitations(input) {
  const source = input && typeof input === 'object' ? input : {};
  const limitations = Array.isArray(source.limitations) ? source.limitations : [];
  const warnings = Array.isArray(source.warnings) ? source.warnings : [];
  const missingFields = Array.isArray(source.missingFields) ? source.missingFields : [];

  return unique([
    ...limitations,
    ...warnings,
    missingFields.includes('birthPlace.timezone') ? TIMEZONE_WARNING : '',
    missingFields.includes('birthPlace.coordinates') ? COORDINATES_LIMITATION : '',
  ]);
}

function convertBirthLocalDateTimeToUtc(date, time, timezone) {
  const local = DateTime.fromObject(
    {
      year: date.year,
      month: date.month,
      day: date.day,
      hour: time.hour,
      minute: time.minute,
      second: 0,
      millisecond: 0,
    },
    { zone: timezone },
  );

  if (!local.isValid) {
    return birthUtcConversionResult({
      errors: [local.invalidReason || 'birth local time is invalid'],
      limitations: [UTC_LIMITATION],
    });
  }

  if (!matchesLocalDateTime(local, date, time)) {
    return birthUtcConversionResult({
      warnings: [NONEXISTENT_TIME_WARNING],
      errors: ['birth local time is nonexistent in timezone'],
    });
  }

  const possibleOffsets = getMatchingPossibleOffsets(local, date, time);

  if (new Set(possibleOffsets.map((item) => item.offset)).size > 1) {
    return birthUtcConversionResult({
      warnings: [AMBIGUOUS_TIME_WARNING],
      errors: ['birth local time is ambiguous in timezone'],
    });
  }

  const utcDateTime = local.toUTC().toISO({
    suppressMilliseconds: false,
    includeOffset: true,
  });

  if (!utcDateTime || !utcDateTime.endsWith('Z')) {
    return birthUtcConversionResult({
      errors: ['birth local time could not be converted to UTC ISO'],
      limitations: [UTC_LIMITATION],
    });
  }

  return birthUtcConversionResult({
    ok: true,
    utcDateTime,
  });
}

function getMatchingPossibleOffsets(local, date, time) {
  if (typeof local.getPossibleOffsets !== 'function') {
    return [local];
  }

  return local.getPossibleOffsets().filter((candidate) => matchesLocalDateTime(candidate, date, time));
}

function matchesLocalDateTime(local, date, time) {
  return local.year === date.year
    && local.month === date.month
    && local.day === date.day
    && local.hour === time.hour
    && local.minute === time.minute;
}

function birthUtcConversionResult(overrides = {}) {
  return {
    ok: overrides.ok ?? false,
    utcDateTime: overrides.utcDateTime ?? null,
    warnings: overrides.warnings ?? [],
    limitations: overrides.limitations ?? [],
    errors: overrides.errors ?? [],
  };
}

function birthDateResult(overrides = {}) {
  return {
    ok: overrides.ok ?? false,
    year: Number.isInteger(overrides.year) ? overrides.year : null,
    month: Number.isInteger(overrides.month) ? overrides.month : null,
    day: Number.isInteger(overrides.day) ? overrides.day : null,
    value: overrides.value ?? '',
    errors: overrides.errors ?? [],
  };
}

function birthTimeResult(overrides = {}) {
  return {
    ok: overrides.ok ?? false,
    hour: Number.isInteger(overrides.hour) ? overrides.hour : null,
    minute: Number.isInteger(overrides.minute) ? overrides.minute : null,
    value: overrides.value ?? '',
    hasKnownTime: overrides.hasKnownTime ?? false,
    accuracy: overrides.accuracy ?? 'exact',
    errors: overrides.errors ?? [],
  };
}

function pickDate(date) {
  return {
    year: date.year,
    month: date.month,
    day: date.day,
    value: date.value,
  };
}

function pickTime(time) {
  return {
    hour: time.hour,
    minute: time.minute,
    value: time.value,
  };
}

function normalizeAccuracy(value) {
  const normalized = trimString(value);

  return ['exact', 'approximate', 'unknown'].includes(normalized) ? normalized : 'exact';
}

function hasBirthCoordinates(place) {
  return Number.isFinite(place?.latitude) && Number.isFinite(place?.longitude);
}

function getDaysInMonth(year, month) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return 0;
  }

  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function canValidateTimezoneWithIntl() {
  return typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';
}

function trimString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}
