export const locales = [ 'ku','en', 'ar', 'fa'] as const;
export const defaultLocale = 'ku' as const;

export type Locale = (typeof locales)[number]; 