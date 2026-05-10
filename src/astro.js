const MS_PER_DAY = 86400000;
const SYNODIC_MONTH = 29.530588853;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14);
const MOSCOW_LAT = 55.7558;
const MOSCOW_LON = 37.6173;
const MOSCOW_OFFSET_HOURS = 3;

export const PLANETS = [
  { key: 'saturn', name: 'Сатурн', glyph: '♄' },
  { key: 'jupiter', name: 'Юпитер', glyph: '♃' },
  { key: 'mars', name: 'Марс', glyph: '♂' },
  { key: 'sun', name: 'Солнце', glyph: '☉' },
  { key: 'venus', name: 'Венера', glyph: '♀' },
  { key: 'mercury', name: 'Меркурий', glyph: '☿' },
  { key: 'moon', name: 'Луна', glyph: '☾' },
];

const WEEKDAY_RULERS = [
  PLANETS[3],
  PLANETS[6],
  PLANETS[2],
  PLANETS[5],
  PLANETS[1],
  PLANETS[4],
  PLANETS[0],
];

const MAJOR_ASPECTS = [0, 60, 90, 120, 180];

export const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Овен', locative: 'Овне', glyph: '♈' },
  { key: 'taurus', name: 'Телец', locative: 'Тельце', glyph: '♉' },
  { key: 'gemini', name: 'Близнецы', locative: 'Близнецах', glyph: '♊' },
  { key: 'cancer', name: 'Рак', locative: 'Раке', glyph: '♋' },
  { key: 'leo', name: 'Лев', locative: 'Льве', glyph: '♌' },
  { key: 'virgo', name: 'Дева', locative: 'Деве', glyph: '♍' },
  { key: 'libra', name: 'Весы', locative: 'Весах', glyph: '♎' },
  { key: 'scorpio', name: 'Скорпион', locative: 'Скорпионе', glyph: '♏' },
  { key: 'sagittarius', name: 'Стрелец', locative: 'Стрельце', glyph: '♐' },
  { key: 'capricorn', name: 'Козерог', locative: 'Козероге', glyph: '♑' },
  { key: 'aquarius', name: 'Водолей', locative: 'Водолее', glyph: '♒' },
  { key: 'pisces', name: 'Рыбы', locative: 'Рыбах', glyph: '♓' },
];

export function getPlanetaryDay(date = new Date()) {
  return WEEKDAY_RULERS[getMoscowParts(date).weekday];
}

export function getPlanetaryHour(date = new Date()) {
  const dayStart = getMoscowDateStart(date);
  const sunrise = getSunEvent(dayStart, true);
  const sunset = getSunEvent(dayStart, false);
  const nextSunrise = getSunEvent(addDays(dayStart, 1), true);
  const previousSunset = getSunEvent(addDays(dayStart, -1), false);

  let periodStart = sunrise;
  let periodEnd = sunset;
  let periodIndex = 0;
  let daylight = true;
  let rulerDate = dayStart;

  if (date < sunrise) {
    periodStart = previousSunset;
    periodEnd = sunrise;
    periodIndex = 12;
    daylight = false;
    rulerDate = addDays(dayStart, -1);
  } else if (date >= sunset) {
    periodStart = sunset;
    periodEnd = nextSunrise;
    periodIndex = 12;
    daylight = false;
  }

  const segment = (periodEnd.getTime() - periodStart.getTime()) / 12;
  const localIndex = Math.min(11, Math.max(0, Math.floor((date.getTime() - periodStart.getTime()) / segment)));
  const hourIndex = periodIndex + localIndex;
  const dayRuler = WEEKDAY_RULERS[getMoscowParts(rulerDate).weekday];
  const dayRulerIndex = PLANETS.findIndex((planet) => planet.key === dayRuler.key);
  const ruler = PLANETS[(dayRulerIndex + hourIndex) % PLANETS.length];

  return {
    ...ruler,
    startsAt: new Date(periodStart.getTime() + localIndex * segment),
    endsAt: new Date(periodStart.getTime() + (localIndex + 1) * segment),
    isDaylight: daylight,
  };
}

export function getLunarInfo(date = new Date()) {
  const age = positiveModulo((date.getTime() - NEW_MOON_EPOCH) / MS_PER_DAY, SYNODIC_MONTH);
  const angle = (age / SYNODIC_MONTH) * Math.PI * 2;
  const illumination = (1 - Math.cos(angle)) / 2;
  const waxing = age < SYNODIC_MONTH / 2;
  const lunarDay = Math.min(30, Math.max(1, Math.floor(age) + 1));

  return {
    age,
    lunarDay,
    illumination,
    waxing,
    phaseName: getPhaseName(age),
    moonLongitude: getMoonLongitude(date),
  };
}

export function getMoonSignInfo(date = new Date()) {
  const longitude = getMoonLongitude(date);
  const signIndex = Math.floor(longitude / 30);
  const nextIndex = (signIndex + 1) % ZODIAC_SIGNS.length;
  const nextBoundary = (signIndex + 1) * 30;

  return {
    longitude,
    current: ZODIAC_SIGNS[signIndex],
    next: ZODIAC_SIGNS[nextIndex],
    entersAt: findMoonLongitudeTime(date, nextBoundary, 72),
  };
}

export function getVoidOfCourse(date = new Date()) {
  const signStart = Math.floor(getMoonLongitude(date) / 30) * 30;
  const signEnd = signStart + 30;
  const ingress = findMoonLongitudeTime(date, signEnd, 72);
  const searchStart = new Date(date.getTime() - 48 * 3600000);
  const searchEnd = ingress;
  const lastAspect = findLastMoonAspect(searchStart, searchEnd);

  if (!lastAspect) {
    return {
      isActive: false,
      status: 'none',
      start: date,
      end: ingress,
    };
  }

  const isActive = date >= lastAspect.time && date < ingress;

  return {
    isActive,
    status: isActive ? 'active' : lastAspect.time > date ? 'upcoming' : 'none',
    start: lastAspect.time,
    end: ingress,
    aspect: lastAspect.aspect,
    planet: lastAspect.planet,
  };
}

export function getMoscowParts(date = new Date()) {
  const shifted = new Date(date.getTime() + MOSCOW_OFFSET_HOURS * 3600000);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(),
  };
}

function getPhaseName(age) {
  if (age < 1.84566) return 'Новолуние';
  if (age < 5.53699) return 'Растущий серп';
  if (age < 9.22831) return 'Первая четверть';
  if (age < 12.91963) return 'Растущая Луна';
  if (age < 16.61096) return 'Полнолуние';
  if (age < 20.30228) return 'Убывающая Луна';
  if (age < 23.99361) return 'Последняя четверть';
  if (age < 27.68493) return 'Убывающий серп';
  return 'Новолуние';
}

function getMoscowDateStart(date) {
  const parts = getMoscowParts(date);
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day) - MOSCOW_OFFSET_HOURS * 3600000);
}

function addDays(date, days) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function getSunEvent(moscowMidnightUtc, sunrise) {
  const parts = getMoscowParts(new Date(moscowMidnightUtc.getTime() + 12 * 3600000));
  const dayOfYear = Math.floor((Date.UTC(parts.year, parts.month - 1, parts.day) - Date.UTC(parts.year, 0, 0)) / MS_PER_DAY);
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);
  const equationOfTime = 229.18 * (
    0.000075
    + 0.001868 * Math.cos(gamma)
    - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma)
    - 0.040849 * Math.sin(2 * gamma)
  );
  const declination = (
    0.006918
    - 0.399912 * Math.cos(gamma)
    + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma)
    + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma)
    + 0.00148 * Math.sin(3 * gamma)
  );
  const lat = MOSCOW_LAT * Math.PI / 180;
  const zenith = 90.833 * Math.PI / 180;
  const hourAngle = Math.acos((Math.cos(zenith) / (Math.cos(lat) * Math.cos(declination))) - Math.tan(lat) * Math.tan(declination));
  const solarNoonMinutes = 720 - 4 * MOSCOW_LON - equationOfTime + MOSCOW_OFFSET_HOURS * 60;
  const deltaMinutes = (hourAngle * 180 / Math.PI) * 4;
  const localMinutes = sunrise ? solarNoonMinutes - deltaMinutes : solarNoonMinutes + deltaMinutes;
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day) - MOSCOW_OFFSET_HOURS * 3600000 + localMinutes * 60000);
}

function findLastMoonAspect(start, end) {
  let previous = sampleAspectDeltas(start);
  let last = null;

  for (let time = start.getTime() + 3600000; time <= end.getTime(); time += 3600000) {
    const currentDate = new Date(time);
    const current = sampleAspectDeltas(currentDate);

    for (const candidate of current) {
      const old = previous.find((item) => item.planet.key === candidate.planet.key && item.aspect === candidate.aspect);
      if (old && old.delta * candidate.delta <= 0) {
        last = {
          time: refineAspectTime(new Date(time - 3600000), currentDate, candidate.planet, candidate.aspect),
          planet: candidate.planet,
          aspect: candidate.aspect,
        };
      }
    }

    previous = current;
  }

  return last;
}

function sampleAspectDeltas(date) {
  const moon = getMoonLongitude(date);
  return getPlanetLongitudes(date).flatMap((planet) => MAJOR_ASPECTS.map((aspect) => ({
    planet,
    aspect,
    delta: signedAngle(moon - planet.longitude - aspect),
  })));
}

function refineAspectTime(start, end, planet, aspect) {
  let low = start;
  let high = end;
  let lowDelta = aspectDelta(low, planet, aspect);

  for (let i = 0; i < 24; i += 1) {
    const middle = new Date((low.getTime() + high.getTime()) / 2);
    const midDelta = aspectDelta(middle, planet, aspect);
    if (lowDelta * midDelta <= 0) {
      high = middle;
    } else {
      low = middle;
      lowDelta = midDelta;
    }
  }

  return new Date((low.getTime() + high.getTime()) / 2);
}

function aspectDelta(date, planet, aspect) {
  const updatedPlanet = getPlanetLongitudes(date).find((item) => item.key === planet.key);
  return signedAngle(getMoonLongitude(date) - updatedPlanet.longitude - aspect);
}

function findMoonLongitudeTime(from, targetLongitude, maxHours) {
  let low = from;
  let high = new Date(from.getTime() + maxHours * 3600000);
  const startLongitude = unwrapLongitude(getMoonLongitude(low), targetLongitude);

  while (unwrapLongitude(getMoonLongitude(high), startLongitude) < targetLongitude) {
    high = new Date(high.getTime() + 12 * 3600000);
  }

  for (let i = 0; i < 32; i += 1) {
    const middle = new Date((low.getTime() + high.getTime()) / 2);
    if (unwrapLongitude(getMoonLongitude(middle), startLongitude) < targetLongitude) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return high;
}

function getMoonLongitude(date) {
  const d = daysSinceJ2000(date);
  const l0 = normalizeDegrees(218.316 + 13.176396 * d);
  const moonAnomaly = normalizeDegrees(134.963 + 13.064993 * d);
  const sunAnomaly = normalizeDegrees(357.529 + 0.98560028 * d);
  const elongation = normalizeDegrees(297.85 + 12.190749 * d);
  return normalizeDegrees(
    l0
    + 6.289 * sinDeg(moonAnomaly)
    + 1.274 * sinDeg(2 * elongation - moonAnomaly)
    + 0.658 * sinDeg(2 * elongation)
    + 0.214 * sinDeg(2 * moonAnomaly)
    - 0.186 * sinDeg(sunAnomaly),
  );
}

function getPlanetLongitudes(date) {
  const d = daysSinceJ2000(date);
  return [
    planetLongitude('Солнце', '☉', 'sun', 280.46646, 0.98564736, 357.52911, 0.98560028, 1.914602),
    planetLongitude('Меркурий', '☿', 'mercury', 252.25084, 4.0923388, 174.7948, 4.09233445, 23.440),
    planetLongitude('Венера', '♀', 'venus', 181.97973, 1.60213034, 50.4161, 1.60213034, 0.7758),
    planetLongitude('Марс', '♂', 'mars', 355.433, 0.52402068, 19.373, 0.52402068, 10.691),
    planetLongitude('Юпитер', '♃', 'jupiter', 34.351, 0.08308676, 20.020, 0.08308676, 5.554),
    planetLongitude('Сатурн', '♄', 'saturn', 50.077, 0.03345965, 317.020, 0.03345965, 6.358),
  ].map((planet) => ({ ...planet, longitude: normalizeDegrees(planet.longitude(d)) }));
}

function planetLongitude(name, glyph, key, meanLong, dailyLong, peri, dailyPeri, equationFactor) {
  return {
    name,
    glyph,
    key,
    longitude(days) {
      const mean = normalizeDegrees(meanLong + dailyLong * days);
      const anomaly = normalizeDegrees(mean - (peri + dailyPeri * days * 0.00001));
      return mean + equationFactor * sinDeg(anomaly);
    },
  };
}

function daysSinceJ2000(date) {
  return toJulianDay(date) - 2451545;
}

function toJulianDay(date) {
  return date.getTime() / MS_PER_DAY + 2440587.5;
}

function fromJulianDay(julian) {
  return new Date((julian - 2440587.5) * MS_PER_DAY);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function normalizeDegrees(value) {
  return positiveModulo(value, 360);
}

function signedAngle(value) {
  return positiveModulo(value + 180, 360) - 180;
}

function unwrapLongitude(value, reference) {
  let result = value;
  while (result < reference - 180) result += 360;
  while (result > reference + 180) result -= 360;
  return result;
}

function sinDeg(value) {
  return Math.sin((value * Math.PI) / 180);
}

function cosDeg(value) {
  return Math.cos((value * Math.PI) / 180);
}

function asinDeg(value) {
  return (Math.asin(value) * 180) / Math.PI;
}

function acosDeg(value) {
  return (Math.acos(Math.min(1, Math.max(-1, value))) * 180) / Math.PI;
}
