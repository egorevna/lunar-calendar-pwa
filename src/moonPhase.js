import * as Astronomy from './vendor/astronomy-engine.mjs';

// Precise Moon phase for the dashboard hero block and field-quality rules.
// Replaces the mean-age approximation from astro.js, which drifted from the real
// Moon by up to ~14 hours (wrong waxing/waning flag ~2% of the time, illumination
// off by up to 10 percentage points).

const SYNODIC_MONTH = 29.530588853;
const HALF_CIRCLE = 180;
const SOURCE = 'astronomy-engine';

// Phase names by Moon–Sun elongation. Exact "Новолуние" / "Полнолуние" labels are
// intentionally not produced here: the hero line shows them only on the day the
// event actually happened (see moonPrecisionDisplay.describeHeroMoonPhase).
const WAXING_NAMES = [
  { below: 67.5, name: 'Растущий серп' },
  { below: 112.5, name: 'Первая четверть' },
  { below: HALF_CIRCLE, name: 'Растущая Луна' },
];

const WANING_NAMES = [
  { below: 247.5, name: 'Убывающая Луна' },
  { below: 292.5, name: 'Третья четверть' },
  { below: 360, name: 'Убывающий серп' },
];

export function getMoonPhaseAngle(date = new Date()) {
  return normalizeDegrees(Astronomy.MoonPhase(date));
}

export function getMoonIllumination(date = new Date()) {
  return Astronomy.Illumination(Astronomy.Body.Moon, date).phase_fraction;
}

export function getPhaseNameFromAngle(phaseAngle) {
  const angle = normalizeDegrees(phaseAngle);
  const table = angle < HALF_CIRCLE ? WAXING_NAMES : WANING_NAMES;

  return table.find((entry) => angle < entry.below)?.name ?? WANING_NAMES[WANING_NAMES.length - 1].name;
}

export function getMoonPhaseInfo(date = new Date()) {
  const phaseAngle = getMoonPhaseAngle(date);
  const age = (phaseAngle / 360) * SYNODIC_MONTH;

  return {
    source: SOURCE,
    phaseAngle,
    age,
    lunarDay: Math.min(30, Math.max(1, Math.floor(age) + 1)),
    illumination: getMoonIllumination(date),
    waxing: phaseAngle < HALF_CIRCLE,
    phaseName: getPhaseNameFromAngle(phaseAngle),
  };
}

function normalizeDegrees(value) {
  return ((value % 360) + 360) % 360;
}
