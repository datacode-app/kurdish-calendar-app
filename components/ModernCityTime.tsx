'use client';

import React from 'react';
import ModernAnalogClock from './ModernAnalogClock';
import DigitalClock from './DigitalClock';
import { ThemeType } from '@/lib/theme-utils';

interface ModernCityTimeProps {
  city: string;
  timezone: string;
  country: string;
  darkMode: boolean;
  theme: ThemeType;
  dialColor: string;
  borderColor: string;
  numberColor: string;
  handColors: {
    hour: string;
    minute: string;
    second: string;
  };
  tickColors: {
    hour: string;
    minute: string;
  };
}

/**
 * Modern City Time Card Component
 * Displays a city's time using both analog and digital clocks in a premium card layout
 */
export default function ModernCityTime({
  city,
  timezone,
  country,
  darkMode,
  theme,
  dialColor,
  borderColor,
  numberColor,
  handColors,
  tickColors
}: ModernCityTimeProps) {
  // Generate premium card background and styling based on theme and dark mode
  const getCardClasses = () => {
    if (darkMode) {
      switch (theme) {
        case 'elegant':
          return 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700 text-gray-100 shadow-lg';
        case 'minimal':
          return 'bg-gray-900 border-gray-800 text-gray-200 shadow-md';
        case 'classic':
          return 'bg-gradient-to-b from-amber-900 to-amber-950 border-amber-800 text-amber-100 shadow-lg';
        default:
          return 'bg-gray-800 border-gray-700 text-gray-200 shadow-md';
      }
    } else {
      switch (theme) {
        case 'elegant':
          return 'bg-gradient-to-b from-white to-indigo-50 border-indigo-100 text-gray-800 shadow-md';
        case 'minimal':
          return 'bg-white border-gray-200 text-gray-700 shadow-sm';
        case 'classic':
          return 'bg-gradient-to-b from-amber-50 to-amber-100 border-amber-200 text-amber-900 shadow-md';
        default:
          return 'bg-white border-gray-200 text-gray-800 shadow-sm';
      }
    }
  };

  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${getCardClasses()}`}>
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-1 text-center tracking-wide">{city}</h3>
        <p className="text-sm opacity-80 mb-4 font-medium">{country}</p>
        
        <div className="mb-4 flex justify-center">
          <ModernAnalogClock
            timezone={timezone}
            darkMode={darkMode}
            theme={theme}
            dialColor={dialColor}
            borderColor={borderColor}
            numberColor={numberColor}
            handColors={handColors}
            tickColors={tickColors}
            size="md"
          />
        </div>
        
        <div className="mt-2 text-center">
          <DigitalClock 
            timezone={timezone} 
            className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} 
          />
        </div>
      </div>
    </div>
  );
} 