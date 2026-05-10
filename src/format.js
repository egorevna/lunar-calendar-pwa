const DATE_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Moscow',
});

const WEEKDAY_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  timeZone: 'Europe/Moscow',
});

const TIME_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Europe/Moscow',
});

const TIME_WITH_SECONDS_FORMAT = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: 'Europe/Moscow',
});

export function formatDate(date) {
  return DATE_FORMAT.format(date);
}

export function formatWeekday(date) {
  return WEEKDAY_FORMAT.format(date);
}

export function formatTime(date) {
  return TIME_FORMAT.format(date);
}

export function formatTimeWithSeconds(date) {
  return TIME_WITH_SECONDS_FORMAT.format(date);
}

export function formatRange(start, end) {
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatRangeWithSeconds(start, end) {
  return `${formatTimeWithSeconds(start)} – ${formatTimeWithSeconds(end)}`;
}
