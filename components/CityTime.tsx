'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import AnalogClock from './AnalogClock';
import DigitalClock from './DigitalClock';

interface CityTimeProps {
  city: {
    name: {
      en: string;
      ku: string;
      ar: string;
      fa: string;
    };
    timezone: string;
  };
  locale: string;
}

const CityTime: React.FC<CityTimeProps> = ({ city, locale }) => {
  const getCityName = () => {
    switch (locale) {
      case 'ku':
        return city.name.ku;
      case 'ar':
        return city.name.ar;
      case 'fa':
        return city.name.fa;
      default:
        return city.name.en;
    }
  };

  // Format timezone for display (e.g., "Asia/Tehran" -> "Tehran")
  const formatTimezone = (timezone: string) => {
    return timezone.split('/').pop();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-center">{getCityName()}</CardTitle>
        <CardDescription className="text-center">
          {formatTimezone(city.timezone)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <AnalogClock 
          timezone={city.timezone} 
          size={180}
        />
        <DigitalClock 
          timezone={city.timezone} 
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
};

export default CityTime; 