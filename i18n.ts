import {getRequestConfig} from 'next-intl/server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({
  requestLocale
}) => {
  // This typically corresponds to the [locale] segment
  let locale = await requestLocale;
  
  // Ensure that the incoming locale is valid
  if (!locale) {
    locale = defaultLocale; // Default fallback locale
  }

  return {
    locale,
    messages: (await import(`./public/locale/${locale}/common.json`)).default
  };
}); 