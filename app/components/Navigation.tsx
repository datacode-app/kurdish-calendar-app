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

  // Add this debug function to help us see what's happening
  const debugPath = (path: string) => {
    console.log({
      pathname,
      locale,
      path,
      segments: pathname.split('/'),
      currentPath: getPathWithoutLocale(),
    });
  };

  // Updated getPathWithoutLocale function
  const getPathWithoutLocale = () => {
    // Remove any trailing slashes
    const cleanPath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    const segments = cleanPath.split('/').filter(Boolean);
    
    // If we're at the root or only have locale
    if (segments.length === 0 || (segments.length === 1 && segments[0] === locale)) {
      return '/';
    }
    
    // Remove the locale segment if it exists
    if (segments[0] === locale) {
      return '/' + segments.slice(1).join('/');
    }
    
    return '/' + segments.join('/');
  };

  // Updated isActive function
  const isActive = (path: string) => {
    const currentPath = getPathWithoutLocale();
    
    // Normalize the path we're checking
    const normalizedPath = path === '' ? '/' : (path.startsWith('/') ? path : `/${path}`);
    
    // For debugging
    // debugPath(normalizedPath);
    
    // Direct comparison after normalization
    return currentPath === normalizedPath;
  };

  const navItems = [
    { href: '', label: t('nav.home') },
    { href: '/calendar', label: t('nav.calendar') },
    { href: '/events', label: t('nav.events') },
    { href: '/time', label: t('nav.worldTime') },
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
                {[ 'ku','en', 'ar', 'fa'].map((lang) => (
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