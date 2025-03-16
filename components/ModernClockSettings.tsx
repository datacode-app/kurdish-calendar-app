'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ModernCityTime from '@/components/ModernCityTime';
import { toggleDarkMode, ThemeType, getThemeColors } from '@/lib/theme-utils';

interface ModernClockSettingsProps {
  locale: string;
  themeLabels: {
    elegant: string;
    minimal: string;
    classic: string;
    darkMode: string;
    themes: string;
  };
}

// City data
const cities = [
  { name: 'Erbil', nameKu: 'هەولێر', nameAr: 'أربيل', nameFa: 'اربیل', timeZone: 'Asia/Baghdad', country: 'Iraq' },
  { name: 'Sulaymaniyah', nameKu: 'سلێمانی', nameAr: 'السليمانية', nameFa: 'سلیمانیه', timeZone: 'Asia/Baghdad', country: 'Iraq' },
  { name: 'Duhok', nameKu: 'دهۆک', nameAr: 'دهوك', nameFa: 'دهوک', timeZone: 'Asia/Baghdad', country: 'Iraq' },
  { name: 'Kirkuk', nameKu: 'کەرکووک', nameAr: 'كركوك', nameFa: 'کرکوک', timeZone: 'Asia/Baghdad', country: 'Iraq' },
  { name: 'Qamishli', nameKu: 'قامیشلۆ', nameAr: 'القامشلي', nameFa: 'قامیشلی', timeZone: 'Asia/Damascus', country: 'Syria' },
  { name: 'Afrin', nameKu: 'عەفرین', nameAr: 'عفرين', nameFa: 'عفرین', timeZone: 'Asia/Damascus', country: 'Syria' },
  { name: 'Mahabad', nameKu: 'مەهاباد', nameAr: 'مهاباد', nameFa: 'مهاباد', timeZone: 'Asia/Tehran', country: 'Iran' },
  { name: 'Sanandaj', nameKu: 'سنە', nameAr: 'سنندج', nameFa: 'سنندج', timeZone: 'Asia/Tehran', country: 'Iran' },
  { name: 'Diyarbakir', nameKu: 'ئامەد', nameAr: 'ديار بكر', nameFa: 'دیاربکر', timeZone: 'Europe/Istanbul', country: 'Turkey' }
];

export default function ModernClockSettings({ locale, themeLabels }: ModernClockSettingsProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('elegant');

  // Apply dark mode when state changes
  useEffect(() => {
    toggleDarkMode(darkMode);
  }, [darkMode]);

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="dark-mode" 
          checked={darkMode}
          onCheckedChange={setDarkMode}
        />
        <Label htmlFor="dark-mode">{themeLabels.darkMode}</Label>
      </div>
      
      <Tabs defaultValue="elegant" className="w-full max-w-md">
        <div className="text-center mb-2">{themeLabels.themes}</div>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger 
            value="elegant" 
            onClick={() => setCurrentTheme('elegant')}
            className={currentTheme === 'elegant' ? 'data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-200' : ''}
          >
            {themeLabels.elegant}
          </TabsTrigger>
          <TabsTrigger 
            value="minimal" 
            onClick={() => setCurrentTheme('minimal')}
            className={currentTheme === 'minimal' ? 'data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-200' : ''}
          >
            {themeLabels.minimal}
          </TabsTrigger>
          <TabsTrigger 
            value="classic" 
            onClick={() => setCurrentTheme('classic')}
            className={currentTheme === 'classic' ? 'data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900 dark:data-[state=active]:text-amber-200' : ''}
          >
            {themeLabels.classic}
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mt-6">
        {cities.map((city) => {
          const cityName = locale === 'ku' 
            ? city.nameKu 
            : locale === 'ar' 
              ? city.nameAr 
              : locale === 'fa' 
                ? city.nameFa 
                : city.name;
          
          const colors = getThemeColors(currentTheme, darkMode);
          
          return (
            <ModernCityTime
              key={city.name}
              city={cityName}
              timezone={city.timeZone}
              country={city.country}
              darkMode={darkMode}
              theme={currentTheme}
              dialColor={colors.dialColor}
              borderColor={colors.borderColor}
              numberColor={colors.numberColor}
              handColors={colors.handColors}
              tickColors={colors.tickColors}
            />
          );
        })}
      </div>
    </div>
  );
} 