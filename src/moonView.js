export function getMoonView(lunar) {
  const illumination = clamp(lunar.illumination, 0, 1);
  const waxing = Boolean(lunar.waxing);
  const side = waxing ? 'right' : 'left';
  const percent = Math.round(illumination * 100);

  let shape = 'gibbous';
  if (illumination < 0.04) shape = 'new';
  else if (illumination > 0.96) shape = 'full';
  else if (illumination < 0.43) shape = 'crescent';
  else if (illumination <= 0.57) shape = 'quarter';

  return {
    shape,
    side,
    className: `moon-${shape} moon-lit-${side}`,
    illuminationPercent: percent,
    shadowShift: getShadowShift(illumination, waxing),
  };
}

function getShadowShift(illumination, waxing) {
  if (illumination < 0.04) return '0%';
  if (illumination > 0.96) return '140%';

  const distance = Math.round(illumination * 100);
  return `${waxing ? -distance : distance}%`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
