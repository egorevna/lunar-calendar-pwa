import { normalizeProfile, validateProfile } from './profileModel.js';

export const PROFILE_STORAGE_KEY = 'astroPwa.profiles.v1';
export const ACTIVE_PROFILE_STORAGE_KEY = 'astroPwa.activeProfileId.v1';
export const STORAGE_WRITE_ERROR = 'storage write failed';

function getStorage() {
  return globalThis.localStorage ?? null;
}

function readStorageValue(key) {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key, value) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function removeStorageValue(key) {
  const storage = getStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function parseProfiles(rawValue) {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeValidProfiles(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.reduce((profiles, item) => {
    const normalized = normalizeProfile(item);
    const validation = validateProfile(normalized);

    if (validation.valid) {
      profiles.push(normalized);
    }

    return profiles;
  }, []);
}

function notFoundResult() {
  return {
    ok: false,
    errors: ['profile not found'],
  };
}

function storageWriteFailedResult() {
  return {
    ok: false,
    errors: [STORAGE_WRITE_ERROR],
  };
}

function readRawProfiles() {
  return parseProfiles(readStorageValue(PROFILE_STORAGE_KEY));
}

// Entries in storage that do not pass the current validation are hidden from
// the app but must never be dropped on write: a stricter validator in a future
// version would otherwise silently destroy the user's profiles.
function readQuarantinedEntries(nextProfiles) {
  const nextIds = new Set(nextProfiles.map((profile) => profile.id));

  return readRawProfiles().filter((entry) => {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const id = typeof entry.id === 'string' ? entry.id.trim() : '';

    if (!id || nextIds.has(id)) {
      return false;
    }

    return !validateProfile(normalizeProfile(entry)).valid;
  });
}

function persistProfiles(profiles, options = {}) {
  const normalizedProfiles = normalizeValidProfiles(profiles);
  const removedIds = new Set(Array.isArray(options.removedIds) ? options.removedIds : []);
  const quarantined = readQuarantinedEntries(normalizedProfiles)
    .filter((entry) => !removedIds.has(entry.id));
  const written = writeStorageValue(
    PROFILE_STORAGE_KEY,
    JSON.stringify([...normalizedProfiles, ...quarantined]),
  );

  if (!written) {
    return { ok: false, profiles: normalizedProfiles };
  }

  const activeProfileId = readStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
  if (activeProfileId && !normalizedProfiles.some((profile) => profile.id === activeProfileId)) {
    removeStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
  }

  return { ok: true, profiles: normalizedProfiles };
}

function validationResult(errors) {
  return {
    ok: false,
    errors,
  };
}

function mergeProfilePatch(profile, patch) {
  const source = patch && typeof patch === 'object' ? patch : {};
  const nextBirthPlace =
    source.birthPlace && typeof source.birthPlace === 'object'
      ? { ...profile.birthPlace, ...source.birthPlace }
      : profile.birthPlace;
  const nextCurrentPlace =
    source.currentPlace && typeof source.currentPlace === 'object'
      ? { ...profile.currentPlace, ...source.currentPlace }
      : profile.currentPlace;

  return {
    ...profile,
    ...source,
    id: profile.id,
    createdAt: profile.createdAt,
    birthPlace: nextBirthPlace,
    currentPlace: nextCurrentPlace,
    updatedAt: new Date().toISOString(),
  };
}

export function loadProfiles() {
  return normalizeValidProfiles(readRawProfiles());
}

export function saveProfiles(profiles) {
  return persistProfiles(profiles).profiles;
}

export function saveProfilesWithResult(profiles) {
  return persistProfiles(profiles);
}

export function addProfile(profile) {
  const normalized = normalizeProfile(profile);
  const validation = validateProfile(normalized);

  if (!validation.valid) {
    return validationResult(validation.errors);
  }

  const profiles = loadProfiles();
  const savedProfile = {
    ...normalized,
    updatedAt: new Date().toISOString(),
  };

  const persisted = persistProfiles([...profiles.filter((item) => item.id !== savedProfile.id), savedProfile]);

  if (!persisted.ok) {
    return storageWriteFailedResult();
  }

  return {
    ok: true,
    profile: savedProfile,
  };
}

export function updateProfile(profileId, patch) {
  const profiles = loadProfiles();
  const profileIndex = profiles.findIndex((profile) => profile.id === profileId);

  if (profileIndex === -1) {
    return notFoundResult();
  }

  const updatedProfile = normalizeProfile(mergeProfilePatch(profiles[profileIndex], patch));
  const validation = validateProfile(updatedProfile);

  if (!validation.valid) {
    return validationResult(validation.errors);
  }

  const nextProfiles = [...profiles];
  nextProfiles[profileIndex] = updatedProfile;

  if (!persistProfiles(nextProfiles).ok) {
    return storageWriteFailedResult();
  }

  return {
    ok: true,
    profile: updatedProfile,
  };
}

export function deleteProfile(profileId) {
  const profiles = loadProfiles();
  const nextProfiles = profiles.filter((profile) => profile.id !== profileId);
  const activeProfileId = readStorageValue(ACTIVE_PROFILE_STORAGE_KEY);

  if (nextProfiles.length === profiles.length) {
    return notFoundResult();
  }

  if (!persistProfiles(nextProfiles, { removedIds: [profileId] }).ok) {
    return storageWriteFailedResult();
  }

  if (activeProfileId === profileId) {
    removeStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
  }

  return { ok: true };
}

export function getActiveProfileId() {
  const activeProfileId = readStorageValue(ACTIVE_PROFILE_STORAGE_KEY);

  if (!activeProfileId) {
    return null;
  }

  return loadProfiles().some((profile) => profile.id === activeProfileId) ? activeProfileId : null;
}

export function setActiveProfileId(profileId) {
  if (profileId === null) {
    removeStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
    return {
      ok: true,
      activeProfileId: null,
    };
  }

  if (!loadProfiles().some((profile) => profile.id === profileId)) {
    return notFoundResult();
  }

  writeStorageValue(ACTIVE_PROFILE_STORAGE_KEY, profileId);

  return {
    ok: true,
    activeProfileId: profileId,
  };
}

export function clearProfileStorageForTests() {
  removeStorageValue(PROFILE_STORAGE_KEY);
  removeStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
}
