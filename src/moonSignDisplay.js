import { formatDate, formatTime } from './format.js';

export function describeMoonIngress(moonSign, now = new Date()) {
  if (!moonSign?.next?.name || !(moonSign?.entersAt instanceof Date)) return '';

  return `Переход в ${moonSign.next.name}: ${formatIngressDay(now, moonSign.entersAt)} ${formatTime(moonSign.entersAt)}`;
}

function formatIngressDay(now, entersAt) {
  const today = formatDate(now);
  const target = formatDate(entersAt);

  if (today === target) return 'сегодня';
  if (formatDate(new Date(now.getTime() + 86400000)) === target) return 'завтра';

  return `${new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Moscow',
  }).format(entersAt)},`;
}
