import { formatTime } from './format.js';

const UPCOMING_MAJOR_PHASE_FALLBACKS = {
  Новолуние: 'Убывающий серп',
  Полнолуние: 'Растущая Луна',
};

export function describeHeroMoonPhase({
  lunar,
  majorPhase,
  nextPhase,
  now = new Date(),
}) {
  if (majorPhase?.name && majorPhase?.at instanceof Date && majorPhase.at <= now) {
    return `${majorPhase.name} в ${formatTime(majorPhase.at)}`;
  }

  const phaseName = lunar?.phaseName ?? '';

  if (nextPhase?.name === phaseName && nextPhase?.at instanceof Date && nextPhase.at > now) {
    return UPCOMING_MAJOR_PHASE_FALLBACKS[phaseName] ?? phaseName;
  }

  return phaseName;
}

export function describeMoonPrecision({ lunar, nextPhase, now = new Date() }) {
  const rows = [];

  if (typeof lunar?.illumination === 'number') {
    rows.push(`Освещенность: ${Math.round(lunar.illumination * 100)}%`);
  }

  if (nextPhase?.name && nextPhase?.at instanceof Date && nextPhase.at > now) {
    rows.push(`До ${formatPhaseTarget(nextPhase.name)}: ${formatDuration(now, nextPhase.at)}`);
  }

  return rows;
}

function formatPhaseTarget(name) {
  const targets = {
    Новолуние: 'Новолуния',
    Полнолуние: 'Полнолуния',
  };
  return targets[name] ?? name;
}

function formatDuration(from, to) {
  const totalHours = Math.max(0, Math.floor((to - from) / 3600000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0 && hours > 0) return `${days}д ${hours}ч`;
  if (days > 0) return `${days}д`;
  return `${hours}ч`;
}
