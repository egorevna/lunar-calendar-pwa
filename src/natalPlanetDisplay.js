const RETROGRADE_MARKER = 'R';

const NATAL_PLANET_DISPLAY_LIMITATIONS = Object.freeze([
  'Дома, ASC/MC и транзиты пока не рассчитываются.',
  'Натальные аспекты и орбы будут добавлены отдельно.',
]);

export function formatNatalPlanetPosition(planet) {
  if (!isDisplayableNatalPlanet(planet)) {
    return null;
  }

  const label = normalizeText(planet.label);
  const sign = normalizeText(planet.sign.ru);
  const symbol = normalizeText(planet.sign.symbol);
  const degreeText = `${planet.degree}°${String(planet.minutes).padStart(2, '0')}′`;
  const retrogradeText = planet.retrograde === true ? RETROGRADE_MARKER : '';
  const labelText = retrogradeText ? `${label} ${retrogradeText}` : label;

  return {
    key: normalizeText(planet.key),
    label,
    sign,
    symbol,
    degree: planet.degree,
    minutes: planet.minutes,
    degreeText,
    retrogradeText,
    speedText: formatSpeedText(planet.speed),
    source: normalizeText(planet.source),
    text: `${labelText} — ${sign} ${degreeText}`,
  };
}

export function formatNatalPlanetList(planets) {
  if (!Array.isArray(planets)) {
    return [];
  }

  return planets.map(formatNatalPlanetPosition).filter(Boolean);
}

export function getNatalPlanetDisplayLimitations() {
  return [...NATAL_PLANET_DISPLAY_LIMITATIONS];
}

export function isDisplayableNatalPlanet(planet) {
  if (!isPlainObject(planet)) {
    return false;
  }

  return Boolean(
    normalizeText(planet.key)
      && normalizeText(planet.label)
      && Number.isFinite(planet.longitude)
      && planet.longitude >= 0
      && planet.longitude < 360
      && isPlainObject(planet.sign)
      && normalizeText(planet.sign.ru)
      && Number.isInteger(planet.degree)
      && planet.degree >= 0
      && planet.degree < 30
      && Number.isInteger(planet.minutes)
      && planet.minutes >= 0
      && planet.minutes < 60
      && normalizeText(planet.source),
  );
}

function formatSpeedText(speed) {
  if (!Number.isFinite(speed)) {
    return '';
  }

  return `${speed.toFixed(2)}°/день`;
}

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
