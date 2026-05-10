import { ZODIAC_SIGNS } from './astro.js';
import { PRECISE_EPHEMERIS } from './ephemeris-data.js';

const SIGN_BY_KEY = new Map(ZODIAC_SIGNS.map((sign) => [sign.key, sign]));

export function getPreciseMoonSignInfo(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data)) return null;

  const ingresses = data.signIngresses
    .map((event) => ({ ...event, time: new Date(event.at) }))
    .sort((a, b) => a.time - b.time);
  const currentIndex = findLastIndex(ingresses, (event) => event.time <= date);
  const next = ingresses[currentIndex + 1];

  if (currentIndex < 0 || !next) return null;

  return {
    source: 'swisseph',
    current: SIGN_BY_KEY.get(ingresses[currentIndex].sign),
    next: SIGN_BY_KEY.get(next.sign),
    entersAt: next.time,
  };
}

export function getPreciseLunarDayInfo(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data) || !Array.isArray(data.lunarDays)) return null;

  const lunarDays = data.lunarDays
    .map((event) => ({ ...event, time: new Date(event.at) }))
    .sort((a, b) => a.time - b.time);
  const currentIndex = findLastIndex(lunarDays, (event) => event.time <= date);
  const next = lunarDays[currentIndex + 1];

  if (currentIndex < 0) return null;

  return {
    source: 'swisseph',
    lunarDay: lunarDays[currentIndex].day,
    startedAt: lunarDays[currentIndex].time,
    endsAt: next ? next.time : null,
  };
}

export function getPreciseVoidOfCourse(date = new Date(), data = PRECISE_EPHEMERIS) {
  if (!covers(date, data)) return null;

  const intervals = data.voidOfCourse
    .map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }))
    .sort((a, b) => a.start - b.start);
  const active = intervals.find((event) => event.start <= date && date < event.end);

  if (active) return toVoc(active, 'active', true);

  const upcoming = intervals.find((event) => event.start > date);
  if (upcoming) return toVoc(upcoming, 'upcoming', false);

  return null;
}

function toVoc(event, status, isActive) {
  return {
    source: 'swisseph',
    isActive,
    status,
    start: event.start,
    end: event.end,
    aspect: event.aspect,
    planet: event.planet,
  };
}

function covers(date, data) {
  if (!data.rangeStart || !data.rangeEnd) return false;
  return new Date(data.rangeStart) <= date && date < new Date(data.rangeEnd);
}

function findLastIndex(items, predicate) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (predicate(items[index])) return index;
  }
  return -1;
}
