const fs = require('node:fs');
const path = require('node:path');
const swe = require('swisseph');

const MS_PER_DAY = 86400000;
const START = new Date('2026-01-01T00:00:00.000Z');
const END = new Date('2031-01-01T00:00:00.000Z');
const MOSCOW_LON = 37.6173;
const MOSCOW_LAT = 55.7558;
const MOSCOW_ALT = 156;
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'src', 'ephemeris-data.js');
const FLAGS = swe.SEFLG_SWIEPH | swe.SEFLG_SPEED;

const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const SOLAR_MONTH_STARTS = [
  { longitude: 315, branch: 'yin' },
  { longitude: 345, branch: 'mao' },
  { longitude: 15, branch: 'chen' },
  { longitude: 45, branch: 'si' },
  { longitude: 75, branch: 'wu' },
  { longitude: 105, branch: 'wei' },
  { longitude: 135, branch: 'shen' },
  { longitude: 165, branch: 'you' },
  { longitude: 195, branch: 'xu' },
  { longitude: 225, branch: 'hai' },
  { longitude: 255, branch: 'zi' },
  { longitude: 285, branch: 'chou' },
];

const BODIES = [
  { key: 'sun', id: swe.SE_SUN },
  { key: 'mercury', id: swe.SE_MERCURY },
  { key: 'venus', id: swe.SE_VENUS },
  { key: 'mars', id: swe.SE_MARS },
  { key: 'jupiter', id: swe.SE_JUPITER },
  { key: 'saturn', id: swe.SE_SATURN },
  { key: 'uranus', id: swe.SE_URANUS },
  { key: 'neptune', id: swe.SE_NEPTUNE },
  { key: 'pluto', id: swe.SE_PLUTO },
];

const ASPECTS = [
  { angle: 0, label: 0 },
  { angle: 60, label: 60 },
  { angle: 90, label: 90 },
  { angle: 120, label: 120 },
  { angle: 180, label: 180 },
  { angle: 240, label: 120 },
  { angle: 270, label: 90 },
  { angle: 300, label: 60 },
];

swe.swe_set_ephe_path(path.join(ROOT, 'node_modules', 'swisseph', 'ephe'));

const signIngresses = generateSignIngresses(START, END);
const voidOfCourse = generateVoidOfCourse(signIngresses);
const newMoons = generateNewMoons(START, END);
const moonPhases = generateMoonPhases(newMoons, START, END);
const lunarDays = generateLunarDays(newMoons);
const solarMonths = generateSolarMonths(START, END);
const data = {
  generatedAt: new Date().toISOString(),
  source: 'Swiss Ephemeris swisseph npm package, SEFLG_SWIEPH',
  rangeStart: START.toISOString(),
  rangeEnd: END.toISOString(),
  signIngresses,
  voidOfCourse,
  moonPhases,
  lunarDays,
  solarMonths,
};

fs.writeFileSync(
  OUTPUT,
  `export const PRECISE_EPHEMERIS = ${JSON.stringify(data, null, 2)};\n`,
);

console.log(`Generated ${signIngresses.length} Moon sign ingresses`);
console.log(`Generated ${voidOfCourse.length} Moon void-of-course intervals`);
console.log(`Generated ${moonPhases.length} exact new/full Moon events`);
console.log(`Generated ${lunarDays.length} Moscow lunar day boundaries`);
console.log(`Generated ${solarMonths.length} Chinese solar month boundaries`);
console.log(`Wrote ${path.relative(ROOT, OUTPUT)}`);

function generateSignIngresses(start, end) {
  const scanStart = dateToJulian(new Date(start.getTime() - 5 * MS_PER_DAY));
  const scanEnd = dateToJulian(new Date(end.getTime() + 3 * MS_PER_DAY));
  const step = 0.05;
  const events = [];
  let previousJd = scanStart;
  let previousAbsolute = moonLongitude(previousJd);
  let boundary = Math.floor(previousAbsolute / 30) * 30 + 30;

  for (let jd = scanStart + step; jd <= scanEnd; jd += step) {
    const absolute = unwrapForward(previousAbsolute, moonLongitude(jd));
    while (absolute >= boundary) {
      const exactJd = findLongitudeCrossing(previousJd, jd, boundary);
      const signIndex = positiveModulo(Math.floor(boundary / 30), 12);
      events.push({
        at: roundToSecond(julianToDate(exactJd)).toISOString(),
        sign: SIGNS[signIndex],
      });
      boundary += 30;
    }
    previousJd = jd;
    previousAbsolute = absolute;
  }

  return events.filter((event) => (
    new Date(event.at) >= new Date(start.getTime() - 5 * MS_PER_DAY)
    && new Date(event.at) < new Date(end.getTime() + 3 * MS_PER_DAY)
  ));
}

function generateVoidOfCourse(ingresses) {
  const intervals = [];

  for (let index = 0; index < ingresses.length - 1; index += 1) {
    const entry = new Date(ingresses[index].at);
    const exit = new Date(ingresses[index + 1].at);
    if (exit <= START || entry >= END) continue;

    const aspect = findLastAspect(dateToJulian(entry), dateToJulian(exit));
    const start = aspect ? aspect.at : entry;
    intervals.push({
      start: roundToSecond(start).toISOString(),
      end: roundToSecond(exit).toISOString(),
      aspect: aspect?.aspect ?? null,
      planet: aspect?.planet ?? null,
    });
  }

  return intervals.filter((interval) => (
    new Date(interval.end) > START && new Date(interval.start) < END
  ));
}

function generateNewMoons(start, end) {
  const scanStart = dateToJulian(new Date(start.getTime() - 40 * MS_PER_DAY));
  const scanEnd = dateToJulian(new Date(end.getTime() + 40 * MS_PER_DAY));
  const step = 0.1;
  const events = [];
  let previousJd = scanStart;
  let previousDelta = moonSunDelta(scanStart);

  for (let jd = scanStart + step; jd <= scanEnd; jd += step) {
    const delta = moonSunDelta(jd);
    if (previousDelta * delta <= 0 && Math.abs(previousDelta - delta) < 30) {
      events.push(refineNewMoon(previousJd, jd));
    }
    previousJd = jd;
    previousDelta = delta;
  }

  return events;
}

function generateMoonPhases(newMoons, start, end) {
  const fullMoons = generateFullMoons(start, end);
  const events = [
    ...newMoons.map((jd) => ({ at: roundToSecond(julianToDate(jd)).toISOString(), type: 'new' })),
    ...fullMoons.map((jd) => ({ at: roundToSecond(julianToDate(jd)).toISOString(), type: 'full' })),
  ];

  return events
    .filter((event) => new Date(event.at) >= start && new Date(event.at) < end)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

function generateFullMoons(start, end) {
  const scanStart = dateToJulian(new Date(start.getTime() - 40 * MS_PER_DAY));
  const scanEnd = dateToJulian(new Date(end.getTime() + 40 * MS_PER_DAY));
  const step = 0.1;
  const events = [];
  let previousJd = scanStart;
  let previousDelta = moonSunPhaseDelta(scanStart, 180);

  for (let jd = scanStart + step; jd <= scanEnd; jd += step) {
    const delta = moonSunPhaseDelta(jd, 180);
    if (previousDelta * delta <= 0 && Math.abs(previousDelta - delta) < 30) {
      events.push(refineMoonPhase(previousJd, jd, 180));
    }
    previousJd = jd;
    previousDelta = delta;
  }

  return events;
}

function generateSolarMonths(start, end) {
  const scanStart = dateToJulian(new Date(start.getTime() - 40 * MS_PER_DAY));
  const scanEnd = dateToJulian(new Date(end.getTime() + 40 * MS_PER_DAY));
  const step = 0.1;
  const events = [];
  let previousJd = scanStart;
  let previousAbsolute = sunLongitude(previousJd);
  let boundary = Math.floor((previousAbsolute - 315) / 30) * 30 + 345;

  for (let jd = scanStart + step; jd <= scanEnd; jd += step) {
    const absolute = unwrapForward(previousAbsolute, sunLongitude(jd));
    while (absolute >= boundary) {
      const normalized = positiveModulo(boundary, 360);
      const start = SOLAR_MONTH_STARTS.find((item) => item.longitude === normalized);
      if (start) {
        events.push({
          at: roundToSecond(julianToDate(findSunLongitudeCrossing(previousJd, jd, boundary))).toISOString(),
          branch: start.branch,
        });
      }
      boundary += 30;
    }
    previousJd = jd;
    previousAbsolute = absolute;
  }

  return events.filter((event) => (
    new Date(event.at) >= new Date(start.getTime() - 40 * MS_PER_DAY)
    && new Date(event.at) < new Date(end.getTime() + 40 * MS_PER_DAY)
  ));
}

function generateLunarDays(newMoons) {
  const boundaries = [];

  for (let index = 0; index < newMoons.length - 1; index += 1) {
    const newMoon = newMoons[index];
    const nextNewMoon = newMoons[index + 1];
    if (julianToDate(nextNewMoon) <= START || julianToDate(newMoon) >= END) continue;

    boundaries.push({
      at: roundToSecond(julianToDate(newMoon)).toISOString(),
      day: 1,
    });

    let day = 2;
    let cursor = newMoon + 0.001;
    while (cursor < nextNewMoon && day <= 30) {
      const rise = moonRiseAfter(cursor);
      if (!rise || rise >= nextNewMoon) break;
      boundaries.push({
        at: roundToSecond(julianToDate(rise)).toISOString(),
        day,
      });
      day += 1;
      cursor = rise + 0.02;
    }
  }

  return boundaries
    .filter((event) => new Date(event.at) >= new Date(START.getTime() - 40 * MS_PER_DAY) && new Date(event.at) < END)
    .sort((a, b) => new Date(a.at) - new Date(b.at));
}

function moonRiseAfter(jd) {
  let result;
  swe.swe_rise_trans(
    jd,
    swe.SE_MOON,
    '',
    swe.SEFLG_SWIEPH,
    swe.SE_CALC_RISE,
    MOSCOW_LON,
    MOSCOW_LAT,
    MOSCOW_ALT,
    0,
    10,
    (event) => {
      if (!event.error) result = event.transitTime;
    },
  );
  return result;
}

function refineNewMoon(lowJd, highJd) {
  return refineMoonPhase(lowJd, highJd, 0);
}

function refineMoonPhase(lowJd, highJd, targetAngle) {
  let low = lowJd;
  let high = highJd;
  let lowDelta = moonSunPhaseDelta(low, targetAngle);

  for (let index = 0; index < 50; index += 1) {
    const middle = (low + high) / 2;
    const middleDelta = moonSunPhaseDelta(middle, targetAngle);
    if (lowDelta * middleDelta <= 0) high = middle;
    else {
      low = middle;
      lowDelta = middleDelta;
    }
  }

  return (low + high) / 2;
}

function moonSunDelta(jd) {
  return moonSunPhaseDelta(jd, 0);
}

function moonSunPhaseDelta(jd, targetAngle) {
  return signedAngle(moonLongitude(jd) - bodyLongitude(jd, swe.SE_SUN) - targetAngle);
}

function findSunLongitudeCrossing(lowJd, highJd, target) {
  let low = lowJd;
  let high = highJd;

  for (let index = 0; index < 48; index += 1) {
    const middle = (low + high) / 2;
    const absolute = unwrapToTarget(sunLongitude(middle), target);
    if (absolute < target) low = middle;
    else high = middle;
  }

  return (low + high) / 2;
}

function findLastAspect(startJd, endJd) {
  const step = 0.02;
  let previous = aspectSamples(startJd);
  let last = null;

  for (let jd = startJd + step; jd <= endJd; jd += step) {
    const current = aspectSamples(jd);
    for (const sample of current.values()) {
      const old = previous.get(sample.id);
      if (!old) continue;
      const crossed = old.delta * sample.delta <= 0;
      const realCrossing = Math.abs(old.delta - sample.delta) < 30;
      if (crossed && realCrossing) {
        last = {
          at: julianToDate(refineAspect(old.jd, jd, sample.body, sample.angle)),
          planet: sample.body.key,
          aspect: sample.label,
        };
      }
    }
    previous = current;
  }

  return last;
}

function aspectSamples(jd) {
  const moon = moonLongitude(jd);
  const samples = new Map();

  for (const body of BODIES) {
    const longitude = bodyLongitude(jd, body.id);
    for (const aspect of ASPECTS) {
      samples.set(`${body.key}-${aspect.angle}`, {
        id: `${body.key}-${aspect.angle}`,
        jd,
        body,
        angle: aspect.angle,
        label: aspect.label,
        delta: signedAngle(moon - longitude - aspect.angle),
      });
    }
  }

  return samples;
}

function refineAspect(lowJd, highJd, body, angle) {
  let low = lowJd;
  let high = highJd;
  let lowDelta = aspectDelta(low, body.id, angle);

  for (let index = 0; index < 48; index += 1) {
    const middle = (low + high) / 2;
    const middleDelta = aspectDelta(middle, body.id, angle);
    if (lowDelta * middleDelta <= 0) high = middle;
    else {
      low = middle;
      lowDelta = middleDelta;
    }
  }

  return (low + high) / 2;
}

function aspectDelta(jd, bodyId, angle) {
  return signedAngle(moonLongitude(jd) - bodyLongitude(jd, bodyId) - angle);
}

function findLongitudeCrossing(lowJd, highJd, target) {
  let low = lowJd;
  let high = highJd;

  for (let index = 0; index < 48; index += 1) {
    const middle = (low + high) / 2;
    const absolute = unwrapToTarget(moonLongitude(middle), target);
    if (absolute < target) low = middle;
    else high = middle;
  }

  return (low + high) / 2;
}

function moonLongitude(jd) {
  return bodyLongitude(jd, swe.SE_MOON);
}

function sunLongitude(jd) {
  return bodyLongitude(jd, swe.SE_SUN);
}

function bodyLongitude(jd, bodyId) {
  let result;
  swe.swe_calc_ut(jd, bodyId, FLAGS, (body) => {
    if (body.error) throw new Error(body.error);
    result = body.longitude;
  });
  return result;
}

function dateToJulian(date) {
  return date.getTime() / MS_PER_DAY + 2440587.5;
}

function julianToDate(jd) {
  return new Date((jd - 2440587.5) * MS_PER_DAY);
}

function roundToSecond(date) {
  return new Date(Math.round(date.getTime() / 1000) * 1000);
}

function unwrapForward(previousAbsolute, longitude) {
  let value = longitude;
  while (value < previousAbsolute) value += 360;
  while (value - previousAbsolute > 180) value -= 360;
  return value;
}

function unwrapToTarget(longitude, target) {
  let value = longitude;
  while (value < target - 180) value += 360;
  while (value > target + 180) value -= 360;
  return value;
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function signedAngle(value) {
  return positiveModulo(value + 180, 360) - 180;
}
