'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Menu } from 'lucide-react';
import { locales, Locale } from '@/config';

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Function to handle navigation
  const handleNavigation = (path: string) => {
    const fullPath = path === '' ? `/${locale}` : `/${locale}${path}`;
    window.location.href = fullPath;
  };

  // Function to handle locale change
  const handleLocaleChange = (newLocale: string) => {
    const currentPath = getPathWithoutLocale();
    const newPath = currentPath === '/' ? `/${newLocale}` : `/${newLocale}${currentPath}`;
    window.location.href = newPath;
  };

  // Function to get the path without the locale prefix
  const getPathWithoutLocale = () => {
    const segments = pathname.split('/');
    if (segments.length <= 2) return '/';
    
    // Check if the second segment is a locale
    const possibleLocale = segments[1];
    if (locales.includes(possibleLocale as Locale)) {
      return '/' + segments.slice(2).join('/');
    }
    return pathname;
  };

  // Function to determine if a link is active
  const isActive = (path: string) => {
    const currentPath = getPathWithoutLocale();
    return path === '' ? currentPath === '/' : currentPath === path;
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
          <button 
            onClick={() => handleNavigation('')}
            className="flex items-center"
          >
            <span className="text-xl font-bold text-primary">
              {t('app.title')}
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
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
                <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
                  {t('language.english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange('ku')}>
                  {t('language.kurdish')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange('ar')}>
                  {t('language.arabic')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocaleChange('fa')}>
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
                <button
                  key={item.href}
                  onClick={() => {
                    handleNavigation(item.href);
                    setIsOpen(false);
                  }}
                  className={`text-lg font-medium transition-colors hover:text-primary text-left ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
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
                      handleLocaleChange('en');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    {t('language.english')}
                  </Button>
                  <Button
                    variant={locale === 'ku' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      handleLocaleChange('ku');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    {t('language.kurdish')}
                  </Button>
                  <Button
                    variant={locale === 'ar' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      handleLocaleChange('ar');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    {t('language.arabic')}
                  </Button>
                  <Button
                    variant={locale === 'fa' ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      handleLocaleChange('fa');
                      setIsOpen(false);
                    }}
                    className="w-full"
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