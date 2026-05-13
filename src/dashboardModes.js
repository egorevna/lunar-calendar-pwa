export const DASHBOARD_MODES = [
  { key: 'general', label: 'Общее' },
  { key: 'tarot', label: 'Таро' },
  { key: 'candles', label: 'Свечи' },
  { key: 'money', label: 'Деньги' },
  { key: 'relationships', label: 'Отношения' },
  { key: 'cleansing', label: 'Чистки' },
  { key: 'forecasts', label: 'Прогнозы' },
];

export const DEFAULT_DASHBOARD_MODE = 'general';

export function isDashboardModeKey(value) {
  return DASHBOARD_MODES.some((mode) => mode.key === value);
}
