import createMiddleware from 'next-intl/middleware';
// import { locales, defaultLocale } from    './config';

// Get all public routes that should be internationalized
export default createMiddleware({
  locales: ['en', 'ku', 'ar', 'fa'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api, /_next, /_vercel, /static, /public, /favicon, /data, /site.webmanifest, /robots.txt
    '/((?!api|_next|_vercel|static|public|favicon|data|site.webmanifest|robots.txt).*)'
  ]
}; 