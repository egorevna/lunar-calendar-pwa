import { formatAspect, formatPlanet } from './vocDisplay.js';

export const APP_CACHE_VERSION = 'lunar-calendar-v56';

export function isDebugMode(search = window.location.search) {
  return new URLSearchParams(search).get('debug') === '1';
}

export function describeDebugPanel(context = {}) {
  const {
    now,
    debugDate,
    lunarDay,
    solarMonthBranch,
    moonSign,
    voc,
    moonAspects,
    indicators,
    ephemeris,
    bestWindowsDebug,
  } = context;

  return [
    formatSection('Time', [
      `calculated: ${formatDebugDate(now)}`,
      `debugDate: ${debugDate ? 'active' : 'inactive'}`,
      `timezone: Europe/Moscow (hardcoded)`,
    ]),
    formatSection('Day system', [
      'base: MSK',
      'calculation place: Moscow',
      'coordinates: Moscow default / not stored',
      'energetic day: changes at 23:00 MSK',
      `Jie Qi month branch: ${solarMonthBranch ?? 'нет данных'}`,
    ]),
    formatSection('Moon', [
      `current sign: ${moonSign?.current?.name ?? 'нет данных'}`,
      `next sign: ${moonSign?.next?.name ?? 'нет данных'}`,
      `next ingress: ${formatDebugDate(moonSign?.entersAt)}`,
      `source: ${moonSign?.source ?? 'fallback / unknown'}`,
    ]),
    formatSection('VOC', [
      `status: ${voc?.status ?? (voc?.isActive ? 'active' : 'none')}`,
      `start: ${formatDebugDate(voc?.start)}`,
      `end: ${formatDebugDate(voc?.end)}`,
      `last aspect: ${formatDebugAspect(voc)}`,
      `source: ${voc?.source ?? 'fallback / unknown'}`,
    ]),
    formatSection('Moon aspects', [
      `previous: ${formatDebugAspect(moonAspects?.previous, true)}`,
      `next: ${formatDebugAspect(moonAspects?.next, true)}`,
      'major-only: yes',
      `source: ${moonAspects?.source ?? 'нет данных'}`,
    ]),
    formatSection('Indicators', [
      `Tong Shu: ${formatOfficer(indicators?.dayOfficer)}`,
      `lunar day: ${lunarDay ?? 'нет данных'}`,
      `lunar symbol: ${indicators?.lunarSymbol?.name ?? 'нет данных'}`,
      `Ba Zi: ${indicators?.sexagenaryDay?.name ?? 'нет данных'}`,
      `earthly branch of day: ${indicators?.sexagenaryDay?.branch ?? 'нет данных'}`,
      `earthly branch of month: ${solarMonthBranch ?? 'нет данных'}`,
    ]),
    formatSection('Ephemeris', [
      `range: ${formatYearRange(ephemeris)}`,
      `source: ${ephemeris?.source ?? 'generated Swiss Ephemeris data'}`,
      `cache: ${APP_CACHE_VERSION}`,
    ]),
    formatProfileDebug(context.profileDebug),
    formatBestWindowsDebug(bestWindowsDebug),
  ].filter(Boolean).join('\n\n');
}

function formatSection(title, lines) {
  return [`## ${title}`, ...lines].join('\n');
}

function formatDebugDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : 'нет данных';
}

function formatDebugAspect(aspect, includeTime = false) {
  if (aspect?.aspect == null || !aspect?.planet) return 'нет данных';

  const label = `${formatAspect(aspect.aspect)} ${formatPlanet(aspect.planet)}`;
  return includeTime ? `${label} @ ${formatDebugDate(aspect.at)}` : label;
}

function formatOfficer(officer) {
  if (!officer?.name) return 'нет данных';
  return [officer.name, officer.glyph].filter(Boolean).join(' ');
}

function formatYearRange(ephemeris) {
  if (!ephemeris?.rangeStart || !ephemeris?.rangeEnd) return '2026–2030';

  const start = new Date(ephemeris.rangeStart).getUTCFullYear();
  const end = new Date(ephemeris.rangeEnd).getUTCFullYear() - 1;
  return `${start}–${end}`;
}

function formatBestWindowsDebug(debug) {
  if (!debug) return '';

  const lines = [
    `selectedMode: ${debug.selectedMode ?? 'нет данных'}`,
    `windows.length: ${debug.windows?.length ?? 0}`,
    `threshold: ${debug.threshold ?? 'нет данных'}`,
    `slotMinutes: ${debug.slotMinutes ?? 'нет данных'}`,
    `maxWindows: ${debug.maxWindows ?? 'нет данных'}`,
  ];

  if (debug.fallback) lines.push(`fallback: ${debug.fallback}`);

  const windowLines = (debug.windows ?? []).flatMap((window, index) => [
    `window ${index + 1}: ${formatDebugDate(window.start)} – ${formatDebugDate(window.end)}`,
    `score: ${window.score ?? 'нет данных'}`,
    `reasons: ${formatList(window.reasons)}`,
    `cautions: ${formatList(window.cautions)}`,
    `suitableFor: ${formatList(window.suitableFor)}`,
  ]);

  const rejectedLines = (debug.rejectedCandidates ?? []).flatMap((candidate, index) => [
    `candidate ${index + 1}: ${formatDebugDate(candidate.start)} – ${formatDebugDate(candidate.end)}`,
    `score: ${candidate.score ?? 'нет данных'}`,
    `reject: ${formatList(candidate.rejectReasons)}`,
    `cautions: ${formatList(candidate.cautions)}`,
  ]);

  return formatSection('Best Windows Debug', [
    ...lines,
    ...(windowLines.length ? ['selected windows', ...windowLines] : []),
    ...(rejectedLines.length ? ['rejected candidates', ...rejectedLines] : []),
  ]);
}

function formatProfileDebug(debug) {
  if (!debug) return '';

  return formatSection('Profiles', [
    `profilesCount: ${debug.profilesCount ?? 0}`,
    `activeProfileId: ${debug.activeProfileId ?? 'null'}`,
    `activeProfileName: ${debug.activeProfileName ?? 'Общий день'}`,
    `storage: ${debug.storage ?? 'localStorage'}`,
    `sync: ${debug.sync ?? 'disabled'}`,
    `serverUpload: ${debug.serverUpload ?? 'disabled'}`,
    `importExport: ${debug.importExport ?? 'enabled'}`,
  ]);
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(', ') : 'нет данных';
}
