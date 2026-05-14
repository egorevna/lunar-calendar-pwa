import { normalizeProfile, validateProfile } from './profileModel.js';

export const PROFILE_STORAGE_KEY = 'astroPwa.profiles.v1';
export const ACTIVE_PROFILE_STORAGE_KEY = 'astroPwa.activeProfileId.v1';

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
  return normalizeValidProfiles(parseProfiles(readStorageValue(PROFILE_STORAGE_KEY)));
}

export function saveProfiles(profiles) {
  const normalizedProfiles = normalizeValidProfiles(profiles);

  writeStorageValue(PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfiles));

  const activeProfileId = readStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
  if (activeProfileId && !normalizedProfiles.some((profile) => profile.id === activeProfileId)) {
    removeStorageValue(ACTIVE_PROFILE_STORAGE_KEY);
  }

  return normalizedProfiles;
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

  saveProfiles([...profiles.filter((item) => item.id !== savedProfile.id), savedProfile]);

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
  saveProfiles(nextProfiles);

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

  saveProfiles(nextProfiles);

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
