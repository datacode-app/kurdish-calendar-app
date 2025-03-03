export const locales = ['en', 'ku', 'ar', 'fa'] as const;
export const defaultLocale = 'ku' as const;

export type Locale = (typeof locales)[number]; 