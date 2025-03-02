/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navigation() {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  // Function to get the path without the locale prefix
  const getPathWithoutLocale = () => {
    const pathSegments = pathname.split('/');
    // Remove the first empty segment and the locale segment
    return '/' + pathSegments.slice(2).join('/');
  };

  // Function to create a link with a different locale
  const createLocaleLink = (newLocale: string) => {
    return `/${newLocale}${getPathWithoutLocale()}`;
  };

  // Function to determine if a link is active
  const isActive = (path: string) => {
    return pathname === `/${locale}${path}`;
  };

  const navItems = [
    { href: '', label: t('nav.home') },
    { href: '/calendar', label: t('nav.calendar') },
    { href: '/events', label: t('nav.events') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}`} className="flex items-center">
            <span className="text-xl font-bold text-primary">
              {t('app.title')}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  {t(`language.${locale}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = createLocaleLink('en')}>
                  {t('language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = createLocaleLink('ku')}>
                  {t('language.kurdish')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = createLocaleLink('ar')}>
                  {t('language.arabic')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = createLocaleLink('fa')}>
                  {t('language.persian')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <SheetTrigger asChild className="ml-2">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 px-2 pt-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">
                  {t('language.select')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={locale === 'en' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      window.location.href = createLocaleLink('en');
                      setIsOpen(false);
                    }}
                  >
                    {t('language.english')}
                  </Button>
                  <Button
                    variant={locale === 'ku' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      window.location.href = createLocaleLink('ku');
                      setIsOpen(false);
                    }}
                  >
                    {t('language.kurdish')}
                  </Button>
                  <Button
                    variant={locale === 'ar' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      window.location.href = createLocaleLink('ar');
                      setIsOpen(false);
                    }}
                  >
                    {t('language.arabic')}
                  </Button>
                  <Button
                    variant={locale === 'fa' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      window.location.href = createLocaleLink('fa');
                      setIsOpen(false);
                    }}
                  >
                    {t('language.persian')}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
} 