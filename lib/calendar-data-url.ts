export function getCalendarDataUrl(baseUrl: string | undefined): string {
  if (!baseUrl || baseUrl === 'undefined') return '/data/holidays.json';
  return `${baseUrl.replace(/\/$/, '')}/data/holidays.json`;
}
