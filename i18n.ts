import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({
  requestLocale
}) => {
  // This typically corresponds to the [locale] segment
  let locale = await requestLocale;
  
  // Ensure that the incoming locale is valid
  if (!locale) {
    locale = 'en'; // Default fallback locale
  }

  return {
    locale,
    messages: (await import(`./public/locales/${locale}/common.json`)).default
  };
}); 