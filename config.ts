export const locales = ['en', 'ku', 'ar', 'fa'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number]; 