import { createProfileId, normalizeProfile, validateProfile } from './profileModel.js';
import { loadProfiles, saveProfiles } from './profileStorage.js';

export const PROFILE_EXPORT_SCHEMA_VERSION = 1;
export const PROFILE_EXPORT_APP = 'astro-pwa';
export const PROFILE_EXPORT_FILENAME_PREFIX = 'astro-pwa-profiles';

function isoString(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeValidProfile(profile) {
  const normalized = normalizeProfile(profile);
  const validation = validateProfile(normalized);

  return validation.valid ? normalized : null;
}

function resultError(error) {
  return {
    ok: false,
    error,
    profiles: [],
  };
}

export function serializeProfiles(profiles = [], now = new Date()) {
  const validProfiles = Array.isArray(profiles)
    ? profiles.map(normalizeValidProfile).filter(Boolean)
    : [];

  return JSON.stringify({
    schemaVersion: PROFILE_EXPORT_SCHEMA_VERSION,
    app: PROFILE_EXPORT_APP,
    exportedAt: isoString(now),
    profiles: validProfiles,
  }, null, 2);
}

export function exportProfilesData(profiles = [], now = new Date()) {
  const exportedAt = isoString(now);
  const datePart = exportedAt.slice(0, 10);

  return {
    filename: `${PROFILE_EXPORT_FILENAME_PREFIX}-${datePart}.json`,
    mimeType: 'application/json',
    text: serializeProfiles(profiles, new Date(exportedAt)),
  };
}

export function parseProfilesImport(jsonText) {
  let parsed;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return resultError('invalid json');
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return resultError('invalid structure');
  }

  if (parsed.schemaVersion !== PROFILE_EXPORT_SCHEMA_VERSION) {
    return resultError('unsupported schemaVersion');
  }

  if (!Array.isArray(parsed.profiles)) {
    return resultError('profiles must be an array');
  }

  return {
    ok: true,
    profiles: parsed.profiles.map(normalizeValidProfile).filter(Boolean),
  };
}

function withUniqueProfileId(profile, usedIds) {
  if (!usedIds.has(profile.id)) {
    usedIds.add(profile.id);
    return profile;
  }

  let nextId = createProfileId();
  while (usedIds.has(nextId)) {
    nextId = createProfileId();
  }
  usedIds.add(nextId);

  return {
    ...profile,
    id: nextId,
  };
}

function comparableProfile(profile) {
  return JSON.stringify({
    name: profile.name,
    birthDate: profile.birthDate,
    birthTime: profile.birthTime,
    birthTimeAccuracy: profile.birthTimeAccuracy,
    birthPlace: {
      city: profile.birthPlace.city,
      country: profile.birthPlace.country,
      latitude: profile.birthPlace.latitude,
      longitude: profile.birthPlace.longitude,
      timezone: profile.birthPlace.timezone,
    },
    currentPlace: {
      mode: profile.currentPlace.mode,
      city: profile.currentPlace.city,
      country: profile.currentPlace.country,
      latitude: profile.currentPlace.latitude,
      longitude: profile.currentPlace.longitude,
      timezone: profile.currentPlace.timezone,
    },
    houseSystem: profile.houseSystem,
    zodiac: profile.zodiac,
  });
}

export function importProfilesIntoStorage(jsonText) {
  const parsed = parseProfilesImport(jsonText);

  if (!parsed.ok) {
    return {
      ok: false,
      error: parsed.error,
      importedCount: 0,
      skippedCount: 0,
    };
  }

  const existingProfiles = loadProfiles();
  const usedIds = new Set(existingProfiles.map((profile) => profile.id));
  const existingSignatures = new Set(existingProfiles.map(comparableProfile));
  const importedProfiles = [];
  let skippedCount = 0;

  parsed.profiles.forEach((profile) => {
    const signature = comparableProfile(profile);
    if (existingSignatures.has(signature)) {
      skippedCount += 1;
      return;
    }

    const profileToImport = withUniqueProfileId(profile, usedIds);
    existingSignatures.add(signature);
    importedProfiles.push(profileToImport);
  });

  if (importedProfiles.length === 0) {
    const hasOnlyDuplicates = skippedCount > 0;

    return {
      ok: hasOnlyDuplicates,
      error: hasOnlyDuplicates ? '' : 'no valid profiles',
      importedCount: 0,
      skippedCount,
    };
  }

  saveProfiles([...existingProfiles, ...importedProfiles]);

  return {
    ok: true,
    importedCount: importedProfiles.length,
    skippedCount,
  };
}
