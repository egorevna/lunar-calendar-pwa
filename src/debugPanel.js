import { getNatalEngineCapabilities } from './natalEngine.js';
import { createDetailedDignitiesDebugSummaryFromStorage } from './detailedDignitiesDebug.js';
import { createEssentialDignitiesDebugSummaryFromStorage } from './essentialDignitiesDebug.js';
import { createNatalAspectsDebugSummaryFromStorage } from './natalAspectsDebug.js';
import { createNatalPlanetsDebugSummaryFromStorage } from './natalPlanetsDebug.js';
import { getNatalProviderValidationSummary } from './natalProviderValidationSummary.js';
import { getPlanetaryProviderCapabilities } from './planetaryPositionProvider.js';
import { formatAspect, formatPlanet } from './vocDisplay.js';

export const APP_CACHE_VERSION = 'lunar-calendar-v85';

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
    natalAspectsUiDebug,
    essentialDignitiesUiDebug,
    detailedDignitiesUiDebug,
    housesUiDebug,
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
    formatNatalAspectsUiDebug(natalAspectsUiDebug ?? createNatalAspectsDebugSummaryFromStorage()),
    formatEssentialDignitiesUiDebug(
      essentialDignitiesUiDebug ?? createEssentialDignitiesDebugSummaryFromStorage(),
    ),
    formatDetailedDignitiesUiDebug(
      detailedDignitiesUiDebug ?? createDetailedDignitiesDebugSummaryFromStorage(),
    ),
    formatHousesUiDebug(housesUiDebug),
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

function formatNatalAspectsUiDebug(debug) {
  if (!debug) return '';

  const stillNotSupported = debug.stillNotSupported ?? {};

  return formatSection('Natal Aspects UI Debug', [
    `activeProfileId: ${debug.activeProfileId ?? 'null'}`,
    `activeProfileName: ${debug.activeProfileName ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(debug.hasActiveProfile)}`,
    `panelStatus: ${debug.panelStatus ?? 'hidden'}`,
    `userFacingNatalAspects: ${debug.userFacingNatalAspects ?? 'disabled'}`,
    `reason: ${debug.reason ?? 'нет данных'}`,
    `natalPlanetsReady: ${formatDebugBoolean(debug.natalPlanetsReady)}`,
    `aspectEngine: ${debug.aspectEngine ?? 'enabled'}`,
    `aspectSet: ${debug.aspectSet ?? 'major only'}`,
    `orbPolicy: ${debug.orbPolicy ?? 'configured'}`,
    `aspectCount: ${debug.aspectCount ?? 0}`,
    `formattedAspectCount: ${debug.formattedAspectCount ?? 0}`,
    `tenseCount: ${debug.tenseCount ?? 0}`,
    `harmoniousCount: ${debug.harmoniousCount ?? 0}`,
    `conjunctionCount: ${debug.conjunctionCount ?? 0}`,
    `collapsibleDefault: ${debug.collapsibleDefault ?? 'collapsed'}`,
    `profilePanelLocation: ${debug.profilePanelLocation ?? 'My Cards'}`,
    `transits: ${stillNotSupported.transits ?? 'notSupported'}`,
    `houses: ${stillNotSupported.houses ?? 'notSupported'}`,
    `ascMc: ${stillNotSupported.ascMc ?? 'notSupported'}`,
    `fixedStars: ${stillNotSupported.fixedStars ?? 'notSupported'}`,
    `interpretations: ${stillNotSupported.interpretations ?? 'notSupported'}`,
    `missingFields: ${formatList(debug.missingFields)}`,
    `warnings: ${formatList(debug.warnings)}`,
  ]);
}

function formatEssentialDignitiesUiDebug(debug) {
  if (!debug) return '';

  const deferredFeatures = debug.deferredFeatures ?? {};
  const stillNotSupported = debug.stillNotSupported ?? {};

  return formatSection('Essential Dignities UI Debug', [
    `activeProfileId: ${debug.activeProfileId ?? 'null'}`,
    `activeProfileName: ${debug.activeProfileName ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(debug.hasActiveProfile)}`,
    `panelStatus: ${debug.panelStatus ?? 'hidden'}`,
    `userFacingEssentialDignities: ${debug.userFacingEssentialDignities ?? 'disabled'}`,
    `reason: ${debug.reason ?? 'нет данных'}`,
    `natalPlanetsReady: ${formatDebugBoolean(debug.natalPlanetsReady)}`,
    `dignityEngine: ${debug.dignityEngine ?? 'enabled'}`,
    `sourcePolicy: ${debug.sourcePolicy ?? 'classical-traditional-seven-planets'}`,
    `modernOuterPlanets: ${debug.modernOuterPlanets ?? 'label-only'}`,
    `scoringModel: ${debug.scoringModel ?? 'enabled'}`,
    `scoreTotal: ${debug.scoreTotal ?? 0}`,
    `dignityCount: ${debug.dignityCount ?? 0}`,
    `debilityCount: ${debug.debilityCount ?? 0}`,
    `neutralCount: ${debug.neutralCount ?? 0}`,
    `modernLabelCount: ${debug.modernLabelCount ?? 0}`,
    `formattedDignityCount: ${debug.formattedDignityCount ?? 0}`,
    `collapsibleDefault: ${debug.collapsibleDefault ?? 'collapsed'}`,
    `profilePanelLocation: ${debug.profilePanelLocation ?? 'My Cards'}`,
    `terms: ${deferredFeatures.terms ?? 'deferred'}`,
    `decans: ${deferredFeatures.decans ?? 'deferred'}`,
    `degreeRulers: ${deferredFeatures.degreeRulers ?? 'deferred'}`,
    `exactExaltationDegrees: ${deferredFeatures.exactExaltationDegrees ?? 'deferred'}`,
    `VronskyTables: ${deferredFeatures.VronskyTables ?? 'deferred'}`,
    `houses: ${stillNotSupported.houses ?? 'notSupported'}`,
    `ascMc: ${stillNotSupported.ascMc ?? 'notSupported'}`,
    `transits: ${stillNotSupported.transits ?? 'notSupported'}`,
    `interpretations: ${stillNotSupported.interpretations ?? 'notSupported'}`,
    `missingFields: ${formatList(debug.missingFields)}`,
    `warnings: ${formatList(debug.warnings)}`,
  ]);
}

function formatDetailedDignitiesUiDebug(debug) {
  if (!debug) return '';

  const activeProfile = debug.activeProfile ?? {};
  const counts = debug.counts ?? {};
  const sources = debug.sources ?? {};
  const capabilities = debug.capabilities ?? {};
  const privacy = debug.privacy ?? {};

  return formatSection(debug.section ?? 'Detailed Dignities UI Debug', [
    `activeProfileId: ${activeProfile.id ?? 'null'}`,
    `activeProfileName: ${activeProfile.name ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(activeProfile.hasProfile)}`,
    `panelStatus: ${debug.panelStatus ?? 'hidden'}`,
    `userFacingDetailedDignities: ${debug.enabled ? 'enabled' : 'disabled'}`,
    `reason: ${debug.reason ?? 'нет данных'}`,
    `natalPlanetsReady: ${formatDebugBoolean(debug.natalPlanetsReady)}`,
    `userFacingBlock: ${formatDebugBoolean(debug.userFacingBlock)}`,
    `location: ${debug.location ?? 'My Cards'}`,
    `collapsedDefault: ${formatDebugBoolean(debug.collapsedDefault)}`,
    `collapsedState: ${formatDebugBoolean(debug.collapsedState)}`,
    `planetGroups: ${counts.planetGroups ?? 0}`,
    `totalItems: ${counts.totalItems ?? 0}`,
    `terms: ${counts.terms ?? 0}`,
    `decans: ${counts.decans ?? 0}`,
    `degreeRulersTable6: ${counts.degreeRulersTable6 ?? 0}`,
    `degreeRulersTable7: ${counts.degreeRulersTable7 ?? 0}`,
    `termsSource: ${sources.terms ?? 'Вронский, термы'}`,
    `decansSource: ${sources.decans ?? 'Звезда Магов'}`,
    `degreeRulersTable6Source: ${sources.degreeRulersTable6 ?? 'Звезда Магов'}`,
    `degreeRulersTable7Source: ${sources.degreeRulersTable7 ?? 'Вронский'}`,
    `termsCapability: ${formatDebugBoolean(capabilities.terms)}`,
    `decansCapability: ${formatDebugBoolean(capabilities.decans)}`,
    `degreeRulersTable6Capability: ${formatDebugBoolean(capabilities.degreeRulersTable6)}`,
    `degreeRulersTable7Capability: ${formatDebugBoolean(capabilities.degreeRulersTable7)}`,
    `table6Table7Separated: ${formatDebugBoolean(capabilities.table6Table7Separated)}`,
    `interpretations: ${formatDebugBoolean(capabilities.interpretations)}`,
    `fixedStars: ${formatDebugBoolean(capabilities.fixedStars)}`,
    `houses: ${formatDebugBoolean(capabilities.houses)}`,
    `ascMc: ${formatDebugBoolean(capabilities.ascMc)}`,
    `transits: ${formatDebugBoolean(capabilities.transits)}`,
    `rawBirthDataExposed: ${formatDebugBoolean(privacy.rawBirthDataExposed)}`,
    `rawCoordinatesExposed: ${formatDebugBoolean(privacy.rawCoordinatesExposed)}`,
    `rawLongitudesExposed: ${formatDebugBoolean(privacy.rawLongitudesExposed)}`,
    `rawSourceTokensExposed: ${formatDebugBoolean(privacy.rawSourceTokensExposed)}`,
    `rawSourceKeysExposed: ${formatDebugBoolean(privacy.rawSourceKeysExposed)}`,
    `fullTablesExposed: ${formatDebugBoolean(privacy.fullTablesExposed)}`,
  ]);
}

function formatHousesUiDebug(debug) {
  if (!debug) return '';

  const activeProfile = debug.activeProfile ?? {};
  const readiness = debug.readiness ?? {};
  const selectedSystem = debug.selectedSystem ?? {};
  const counts = debug.counts ?? {};
  const capabilities = debug.capabilities ?? {};
  const privacy = debug.privacy ?? {};

  return formatSection(debug.section ?? 'Houses / ASC / MC UI Debug', [
    `activeProfileId: ${activeProfile.id ?? 'null'}`,
    `activeProfileName: ${activeProfile.name ?? 'Общий день'}`,
    `hasActiveProfile: ${formatDebugBoolean(activeProfile.hasProfile)}`,
    `panelStatus: ${debug.panelStatus ?? 'hidden'}`,
    `reason: ${debug.reason ?? 'нет данных'}`,
    `userFacingBlock: ${formatDebugBoolean(debug.userFacingBlock)}`,
    `location: ${debug.location ?? 'My Cards'}`,
    `collapsedDefault: ${formatDebugBoolean(debug.collapsedDefault)}`,
    `collapsedState: ${formatDebugBoolean(debug.collapsedState)}`,
    `hasExactBirthTime: ${formatDebugBoolean(readiness.hasExactBirthTime)}`,
    `hasBirthCoordinates: ${formatDebugBoolean(readiness.hasBirthCoordinates)}`,
    `hasBirthTimezone: ${formatDebugBoolean(readiness.hasBirthTimezone)}`,
    `housesReady: ${formatDebugBoolean(readiness.housesReady)}`,
    `anglesReady: ${formatDebugBoolean(readiness.anglesReady)}`,
    `planetAssignmentsReady: ${formatDebugBoolean(readiness.planetAssignmentsReady)}`,
    `selectedHouseSystem: ${selectedSystem.houseSystem ?? 'null'}`,
    `houseSystemLabel: ${selectedSystem.label ?? 'null'}`,
    `selectionSource: ${selectedSystem.selectionSource ?? 'null'}`,
    `defaulted: ${formatDebugBoolean(selectedSystem.defaulted)}`,
    `anglesCount: ${counts.angles ?? 0}`,
    `housesCount: ${counts.houses ?? 0}`,
    `planetAssignmentsCount: ${counts.planetAssignments ?? 0}`,
    `asc: ${formatDebugBoolean(capabilities.asc)}`,
    `mc: ${formatDebugBoolean(capabilities.mc)}`,
    `dsc: ${formatDebugBoolean(capabilities.dsc)}`,
    `ic: ${formatDebugBoolean(capabilities.ic)}`,
    `houses: ${formatDebugBoolean(capabilities.houses)}`,
    `wholeSign: ${formatDebugBoolean(capabilities.wholeSign)}`,
    `equalHouse: ${formatDebugBoolean(capabilities.equalHouse)}`,
    `placidus: ${formatDebugBoolean(capabilities.placidus)}`,
    `planetInHouse: ${formatDebugBoolean(capabilities.planetInHouse)}`,
    `interpretations: ${formatDebugBoolean(capabilities.interpretations)}`,
    `fixedStars: ${formatDebugBoolean(capabilities.fixedStars)}`,
    `parsFortuna: ${formatDebugBoolean(capabilities.parsFortuna)}`,
    `arabicParts: ${formatDebugBoolean(capabilities.arabicParts)}`,
    `transits: ${formatDebugBoolean(capabilities.transits)}`,
    `ritualScoring: ${formatDebugBoolean(capabilities.ritualScoring)}`,
    `rawBirthDataExposed: ${formatDebugBoolean(privacy.rawBirthDataExposed)}`,
    `rawCoordinatesExposed: ${formatDebugBoolean(privacy.rawCoordinatesExposed)}`,
    `rawTimezoneExposed: ${formatDebugBoolean(privacy.rawTimezoneExposed)}`,
    `rawPlanetLongitudesExposed: ${formatDebugBoolean(privacy.rawPlanetLongitudesExposed)}`,
    `rawCuspLongitudesExposed: ${formatDebugBoolean(privacy.rawCuspLongitudesExposed)}`,
    `fullProfileJsonExposed: ${formatDebugBoolean(privacy.fullProfileJsonExposed)}`,
    `providerPayloadExposed: ${formatDebugBoolean(privacy.providerPayloadExposed)}`,
  ]);
}

function formatList(items) {
  return Array.isArray(items) && items.length ? items.join(', ') : 'нет данных';
}

function formatDebugBoolean(value) {
  return value ? 'yes' : 'no';
}
