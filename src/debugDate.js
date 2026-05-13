export function getDebugDate(search = window.location.search) {
  const value = new URLSearchParams(search).get('debugDate');
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
