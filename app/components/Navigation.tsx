/* eslint-disable @typescript-eslint/no-unused-vars */
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
    // Ensure path has a leading slash for consistency
    const normalizedPath = path === '' ? '' : (path.startsWith('/') ? path : `/${path}`);
    const fullPath = path === '' ? `/${locale}` : `/${locale}${normalizedPath}`;
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
    
    // For home page
    if (path === '') {
      return currentPath === '/';
    }
    
    // For other pages, normalize paths for comparison
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return currentPath === normalizedPath;
  };

  const navItems = [
    { href: '', label: t('nav.home') },
    { href: '/calendar', label: t('nav.calendar') },
    { href: '/events', label: t('nav.events') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-8 max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <button 
            onClick={() => handleNavigation('')}
            className="flex items-center space-x-2 transition-colors hover:opacity-90"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t('app.title')}
            </span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`relative py-2 text-sm font-medium transition-colors hover:text-primary group ${
                  isActive(item.href) 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                <span className={`absolute left-0 right-0 bottom-0 h-0.5 bg-primary transform origin-left transition-transform duration-200 ease-out ${
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-border/50">
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-4 h-9 font-medium">
                  {t(`language.${locale}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {['en', 'ku', 'ar', 'fa'].map((lang) => (
                  <DropdownMenuItem 
                    key={lang}
                    onClick={() => handleLocaleChange(lang)}
                    className={`${locale === lang ? 'bg-accent' : ''} cursor-pointer`}
                  >
                    {t(`language.${lang}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggle />
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-accent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
          </div>
          <SheetContent side="right" className="w-80 sm:w-96 p-6">
            <div className="flex flex-col gap-8 pt-4">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      handleNavigation(item.href);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                      isActive(item.href) 
                        ? "bg-accent text-primary" 
                        : "text-muted-foreground hover:bg-accent/50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground px-4">
                  {t('language.select')}
                </p>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {['ku','en' , 'ar', 'fa'].map((lang) => (
                    <Button
                      key={lang}
                      variant={locale === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        handleLocaleChange(lang);
                        setIsOpen(false);
                      }}
                      className="w-full"
                    >
                      {t(`language.${lang}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
} 