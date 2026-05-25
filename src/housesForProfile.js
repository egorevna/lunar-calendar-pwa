import { calculateHousesForSelectedSystem } from './houseSystemResolver.js';
import { formatHousesWithPlanetAssignments } from './housesDisplay.js';
import { getNatalPlanetsForProfile } from './natalPlanetsForProfile.js';
import { assignPlanetsToHouses } from './planetInHouses.js';

export function getHousesForProfile(profile = null, options = {}) {
  const houseResult = calculateHousesForSelectedSystem(profile, options);
  const assignmentResult = houseResult?.status === 'ready' && houseResult.ready === true
    ? getAssignmentResult(profile, houseResult)
    : null;

  return formatHousesWithPlanetAssignments({
    houseResult,
    assignmentResult,
  });
}

function getAssignmentResult(profile, houseResult) {
  const natalPlanets = getNatalPlanetsForProfile(profile);

  if (natalPlanets.status !== 'ready' || !Array.isArray(natalPlanets.planets)) {
    return null;
  }

  return assignPlanetsToHouses(natalPlanets.planets, houseResult);
}
