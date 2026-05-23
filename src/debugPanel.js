import { getNatalEngineCapabilities } from './natalEngine.js';
import { createNatalPlanetsDebugSummaryFromStorage } from './natalPlanetsDebug.js';
import { getNatalProviderValidationSummary } from './natalProviderValidationSummary.js';
import { getPlanetaryProviderCapabilities } from './planetaryPositionProvider.js';
import { formatAspect, formatPlanet } from './vocDisplay.js';

export const APP_CACHE_VERSION = 'lunar-calendar-v69';

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
    personalDebug,
    natalEngineDebug,
    natalPlanetsUiDebug,
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
      'calculation point: Moscow default / not stored',
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
    formatPersonalDebug(personalDebug),
    formatNatalEngineDebug(natalEngineDebug ?? createNatalEngineDebug(personalDebug)),
    formatNatalProviderValidation(getNatalProviderValidationSummary()),
    formatNatalPlanetsUiDebug(natalPlanetsUiDebug ?? createNatalPlanetsDebugSummaryFromStorage()),
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

function formatPersonalDebug(debug) {
  if (!debug) return '';

  const capabilities = debug.capabilities ?? {};

  return formatSection('Personal Debug', [
    `profilesCount: ${debug.profilesCount ?? 0}`,
    `activeProfileId: ${debug.activeProfileId ?? 'null'}`,
    `activeProfileName: ${debug.activeProfileName ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(debug.hasActiveProfile)}`,
    `personalStatus: ${debug.personalStatus ?? 'general'}`,
    `profilesStorage: ${debug.profilesStorage ?? 'localStorage'}`,
    `sync: ${debug.sync ?? 'disabled'}`,
    `serverUpload: ${debug.serverUpload ?? 'disabled'}`,
    `geocoding: ${debug.geocoding ?? 'disabled'}`,
    `natalEngine: ${debug.natalEngine ?? 'not connected'}`,
    `canCalculateNatalPlanets: ${formatDebugBoolean(capabilities.canCalculateNatalPlanets)}`,
    `canCalculateHouses: ${formatDebugBoolean(capabilities.canCalculateHouses)}`,
    `canCalculateAscMc: ${formatDebugBoolean(capabilities.canCalculateAscMc)}`,
    `canCalculatePersonalTransits: ${formatDebugBoolean(capabilities.canCalculatePersonalTransits)}`,
    `missingFields: ${formatList(debug.missingFields)}`,
    `warnings: ${formatList(debug.warnings)}`,
  ]);
}

function createNatalEngineDebug(personalDebug = null) {
  const engineCapabilities = getNatalEngineCapabilities();
  const providerCapabilities = getPlanetaryProviderCapabilities();

  return {
    engineStatus: 'notSupported',
    provider: providerCapabilities.provider ?? 'none',
    providerStatus: providerCapabilities.status ?? 'notSupported',
    reason: providerCapabilities.reason ?? engineCapabilities.reason,
    capabilities: engineCapabilities,
    activeProfileId: personalDebug?.activeProfileId ?? null,
    activeProfileName: personalDebug?.activeProfileName ?? 'Общий день',
    hasActiveProfile: Boolean(personalDebug?.hasActiveProfile),
    personalStatus: personalDebug?.personalStatus ?? 'general',
    profilesCount: personalDebug?.profilesCount ?? 0,
    missingFields: personalDebug?.missingFields ?? [],
    warnings: personalDebug?.warnings ?? [],
  };
}

function formatNatalEngineDebug(debug) {
  const capabilities = debug?.capabilities ?? getNatalEngineCapabilities();
  const hasActiveProfile = Boolean(debug?.hasActiveProfile);
  const baseLines = [
    `engineStatus: ${debug?.engineStatus ?? 'notSupported'}`,
    `provider: ${debug?.provider ?? 'none'}`,
    `providerStatus: ${debug?.providerStatus ?? 'notSupported'}`,
    'natalPlanets: not supported',
    'houses: not supported',
    'ascMc: not supported',
    'aspects: not supported',
    'transits: not supported',
    `reason: ${debug?.reason ?? 'Planetary position provider is not connected.'}`,
    'capabilities:',
    `planets: ${formatDebugBoolean(capabilities.planets)}`,
    `houses: ${formatDebugBoolean(capabilities.houses)}`,
    `ascMc: ${formatDebugBoolean(capabilities.ascMc)}`,
    `aspects: ${formatDebugBoolean(capabilities.aspects)}`,
    `transits: ${formatDebugBoolean(capabilities.transits)}`,
  ];

  const profileLines = hasActiveProfile
    ? [
      `profilesCount: ${debug?.profilesCount ?? 0}`,
      `activeProfileId: ${debug?.activeProfileId ?? 'null'}`,
      `activeProfileName: ${debug?.activeProfileName ?? 'Общий день'}`,
      `hasActiveProfile: ${formatDebugBoolean(hasActiveProfile)}`,
      `personalStatus: ${debug?.personalStatus ?? 'general'}`,
      `missingFields: ${formatList(debug?.missingFields)}`,
      `warnings: ${formatList(debug?.warnings)}`,
    ]
    : [
      'activeProfile: Общий день',
      'natal calculation: inactive',
    ];

  return formatSection('Natal Engine Debug', [
    ...baseLines,
    ...profileLines,
  ]);
}

function formatNatalProviderValidation(summary) {
  if (!summary) return '';

  return formatSection('Natal Provider Validation', [
    `provider: ${summary.provider ?? 'none'}`,
    `version: ${summary.version ?? 'нет данных'}`,
    `providerStatus: ${summary.providerStatus ?? 'notSupported'}`,
    `userFacingNatalValues: ${summary.userFacingNatalValues ?? 'disabled'}`,
    `longitudeValidation: ${summary.longitudeValidation ?? 'notSupported'}`,
    `speedValidation: ${summary.speedValidation ?? 'notSupported'}`,
    `retrogradeValidation: ${summary.retrogradeValidation ?? 'notSupported'}`,
    `referenceSource: ${summary.referenceSource ?? 'нет данных'}`,
    `fixturesCount: ${summary.fixturesCount ?? 0}`,
    `validatedBodies: ${formatList(summary.validatedBodies)}`,
    `maxLongitudeDeltaPlanets: ${summary.maxLongitudeDeltaPlanets ?? 'нет данных'}`,
    `maxLongitudeDeltaMoon: ${summary.maxLongitudeDeltaMoon ?? 'нет данных'}`,
    `maxSpeedDeltaPlanets: ${summary.maxSpeedDeltaPlanets ?? 'нет данных'}`,
    `maxSpeedDeltaMoon: ${summary.maxSpeedDeltaMoon ?? 'нет данных'}`,
    `stillNotSupported: ${formatList(summary.stillNotSupported)}`,
  ]);
}

function formatNatalPlanetsUiDebug(debug) {
  if (!debug) return '';

  const stillNotSupported = debug.stillNotSupported ?? {};

  return formatSection('Natal Planets UI Debug', [
    `activeProfileId: ${debug.activeProfileId ?? 'null'}`,
    `activeProfileName: ${debug.activeProfileName ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(debug.hasActiveProfile)}`,
    `panelStatus: ${debug.panelStatus ?? 'hidden'}`,
    `userFacingNatalPlanets: ${debug.userFacingNatalPlanets ?? 'disabled'}`,
    `reason: ${debug.reason ?? 'нет данных'}`,
    `canConvertToUtc: ${formatDebugBoolean(debug.canConvertToUtc)}`,
    `provider: ${debug.provider ?? 'astronomy-engine'}`,
    `providerValidated: ${formatDebugBoolean(debug.providerValidated)}`,
    `planetCount: ${debug.planetCount ?? 0}`,
    `formattedPlanetCount: ${debug.formattedPlanetCount ?? 0}`,
    `collapsibleDefault: ${debug.collapsibleDefault ?? 'collapsed'}`,
    `profilePanelLocation: ${debug.profilePanelLocation ?? 'My Cards'}`,
    `houses: ${stillNotSupported.houses ?? 'notSupported'}`,
    `ascMc: ${stillNotSupported.ascMc ?? 'notSupported'}`,
    `transits: ${stillNotSupported.transits ?? 'notSupported'}`,
    `aspects: ${stillNotSupported.aspects ?? 'notSupported'}`,
    `orbs: ${stillNotSupported.orbs ?? 'notSupported'}`,
    `missingFields: ${formatList(debug.missingFields)}`,
    `warnings: ${formatList(debug.warnings)}`,
  ]);
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(', ') : 'нет данных';
}

function formatDebugBoolean(value) {
  return value ? 'yes' : 'no';
}
