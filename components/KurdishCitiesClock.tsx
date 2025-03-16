'use client';

import React, { useState, useEffect } from 'react';
import { ThemeType } from '@/lib/theme-utils';

interface KurdishCitiesClockProps {
  city: string;
  country: string;
  timezone: string;
  darkMode: boolean;
  theme?: ThemeType;
  size?: 'sm' | 'md' | 'lg';
  locale?: string;
}

/**
 * Premium Kurdish Cities Analog Clock
 * 
 * A specialized analog clock component designed specifically for displaying time
 * across Kurdish cities with cultural design elements and professional styling.
 */
export default function KurdishCitiesClock({
  city,
  country,
  timezone,
  darkMode = false,
  theme = 'elegant',
  size = 'md',
  locale = 'en'
}: KurdishCitiesClockProps) {
  const [time, setTime] = useState(new Date());
  
  // Handle timezone conversion
  useEffect(() => {
    const updateTime = () => {
      try {
        // Get current date
        const now = new Date();
        
        // Format with timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        });
        
        // Extract time components
        const parts = formatter.formatToParts(now);
        const timeValues = {
          hour: 0,
          minute: 0,
          second: 0
        };
        
        // Parse time parts
        parts.forEach(part => {
          if (part.type === 'hour') timeValues.hour = parseInt(part.value);
          if (part.type === 'minute') timeValues.minute = parseInt(part.value);
          if (part.type === 'second') timeValues.second = parseInt(part.value);
        });
        
        // Create date with extracted time
        const timeDate = new Date();
        timeDate.setHours(timeValues.hour);
        timeDate.setMinutes(timeValues.minute);
        timeDate.setSeconds(timeValues.second);
        
        setTime(timeDate);
      } catch (error) {
        // Fallback to local time
        setTime(new Date());
      }
    };
    
    // Update immediately
    updateTime();
    
    // Then update every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);
  
  // Extract time components
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Calculate hand angles
  const secondAngle = seconds * 6; // 6° per second
  const minuteAngle = minutes * 6 + seconds * 0.1; // 6° per minute + slight adjustment for seconds
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30° per hour + adjustment for minutes

  // Generate digital time string
  const formatDigitalTime = () => {
    try {
      return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
    } catch (error) {
      return '--:--:--';
    }
  };
  
  // Size-dependent styles
  const clockSizes = {
    sm: {
      container: 'w-64 h-64',
      clockSize: 'w-40 h-40',
      hourHand: { width: 'w-1.5', height: 'h-8', radius: 'rounded-sm' },
      minuteHand: { width: 'w-1', height: 'h-12', radius: 'rounded-sm' },
      secondHand: { width: 'w-0.5', height: 'h-14', radius: 'rounded-full' },
      centerDot: 'w-2.5 h-2.5',
      hourMarkers: { width: 'w-1', height: 'h-2', inset: '11%' },
      hourNumbers: { fontSize: 'text-[10px]', distance: 32 },
      minuteMarkers: { width: 'w-0.5', height: 'h-1', inset: '14%' },
      cityName: 'text-base',
      countryName: 'text-xs',
      digitalTime: 'text-sm',
      borderWidth: 'border-2',
      shadow: 'shadow-md'
    },
    md: {
      container: 'w-80 h-80',
      clockSize: 'w-56 h-56',
      hourHand: { width: 'w-2', height: 'h-12', radius: 'rounded-sm' },
      minuteHand: { width: 'w-1.5', height: 'h-16', radius: 'rounded-sm' },
      secondHand: { width: 'w-0.75', height: 'h-20', radius: 'rounded-full' },
      centerDot: 'w-3.5 h-3.5',
      hourMarkers: { width: 'w-1.5', height: 'h-3', inset: '8%' },
      hourNumbers: { fontSize: 'text-xs', distance: 36 },
      minuteMarkers: { width: 'w-0.5', height: 'h-1.5', inset: '10%' },
      cityName: 'text-lg',
      countryName: 'text-sm',
      digitalTime: 'text-base',
      borderWidth: 'border-2',
      shadow: 'shadow-lg'
    },
    lg: {
      container: 'w-96 h-96',
      clockSize: 'w-72 h-72',
      hourHand: { width: 'w-2.5', height: 'h-16', radius: 'rounded-sm' },
      minuteHand: { width: 'w-2', height: 'h-24', radius: 'rounded-sm' },
      secondHand: { width: 'w-1', height: 'h-28', radius: 'rounded-full' },
      centerDot: 'w-4 h-4',
      hourMarkers: { width: 'w-1.5', height: 'h-4', inset: '6%' },
      hourNumbers: { fontSize: 'text-sm', distance: 38 },
      minuteMarkers: { width: 'w-0.75', height: 'h-2', inset: '9%' },
      cityName: 'text-xl',
      countryName: 'text-base',
      digitalTime: 'text-lg',
      borderWidth: 'border-3',
      shadow: 'shadow-xl'
    }
  };
  
  // Current size configuration
  const sizeConfig = clockSizes[size];
  
  // Calculate position for clock numbers
  const getNumberPosition = (hour: number) => {
    // Convert to radians (with adjustment to start at 12 o'clock)
    const radians = ((hour * 30) - 90) * (Math.PI / 180);
    
    // Calculate position using the distance from center
    return {
      left: `calc(50% + ${Math.cos(radians) * sizeConfig.hourNumbers.distance}%)`,
      top: `calc(50% + ${Math.sin(radians) * sizeConfig.hourNumbers.distance}%)`
    };
  };
  
  // Theme-specific styling (Kurdish-inspired colors)
  const getKurdishThemeStyles = () => {
    if (darkMode) {
      return {
        dialColor: 'bg-gray-900',
        borderColor: 'border-green-800',
        numberColor: 'text-gray-200',
        hourMarkerColor: 'bg-yellow-600',
        minuteMarkerColor: 'bg-gray-600',
        hourHandColor: 'bg-red-600',
        minuteHandColor: 'bg-white',
        secondHandColor: 'bg-green-500',
        centerDotColor: 'bg-yellow-500',
        cardBg: 'bg-gradient-to-b from-gray-800 to-gray-900',
        cardBorder: 'border-gray-700',
        textColor: 'text-gray-100'
      };
    } else {
      return {
        dialColor: 'bg-white',
        borderColor: 'border-green-600',
        numberColor: 'text-gray-800',
        hourMarkerColor: 'bg-yellow-500',
        minuteMarkerColor: 'bg-gray-400',
        hourHandColor: 'bg-red-500',
        minuteHandColor: 'bg-gray-800',
        secondHandColor: 'bg-green-600',
        centerDotColor: 'bg-yellow-500',
        cardBg: 'bg-gradient-to-b from-white to-gray-50',
        cardBorder: 'border-gray-200',
        textColor: 'text-gray-800'
      };
    }
  };
  
  const styles = getKurdishThemeStyles();
  
  return (
    <div className={`${sizeConfig.container} ${styles.cardBg} ${styles.textColor} rounded-xl border ${styles.cardBorder} ${sizeConfig.shadow} p-4 transition-all duration-300 flex flex-col items-center justify-between`}>
      {/* City and Country */}
      <div className="text-center mb-2">
        <h3 className={`${sizeConfig.cityName} font-semibold tracking-wide`}>{city}</h3>
        <p className={`${sizeConfig.countryName} opacity-80 font-medium`}>{country}</p>
      </div>
      
      {/* Clock Face */}
      <div className={`relative ${sizeConfig.clockSize} ${styles.dialColor} ${sizeConfig.borderWidth} ${styles.borderColor} rounded-full flex items-center justify-center overflow-hidden`}>
        {/* Hour markers (only at hours positions) */}
        {[...Array(12)].map((_, index) => (
          <div
            key={`hour-marker-${index}`}
            className={`absolute ${styles.hourMarkerColor} ${sizeConfig.hourMarkers.width} ${sizeConfig.hourMarkers.height}`}
            style={{
              transform: `rotate(${index * 30}deg)`,
              left: `calc(50% - ${parseInt(sizeConfig.hourMarkers.width.slice(2)) / 2}px)`,
              top: sizeConfig.hourMarkers.inset,
              transformOrigin: `${parseInt(sizeConfig.hourMarkers.width.slice(2)) / 2}px calc(50% - ${sizeConfig.hourMarkers.inset})`
            }}
          />
        ))}
        
        {/* Minute markers */}
        {[...Array(60)].map((_, index) => (
          index % 5 !== 0 ? (
            <div
              key={`minute-marker-${index}`}
              className={`absolute ${styles.minuteMarkerColor} ${sizeConfig.minuteMarkers.width} ${sizeConfig.minuteMarkers.height}`}
              style={{
                transform: `rotate(${index * 6}deg)`,
                left: `calc(50% - ${parseInt(sizeConfig.minuteMarkers.width.slice(2)) / 2}px)`,
                top: sizeConfig.minuteMarkers.inset,
                transformOrigin: `${parseInt(sizeConfig.minuteMarkers.width.slice(2)) / 2}px calc(50% - ${sizeConfig.minuteMarkers.inset})`
              }}
            />
          ) : null
        ))}
        
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const position = getNumberPosition(hour);
          
          return (
            <div
              key={`hour-number-${hour}`}
              className={`absolute ${styles.numberColor} ${sizeConfig.hourNumbers.fontSize} font-medium`}
              style={{
                left: position.left,
                top: position.top,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {hour}
            </div>
          );
        })}
        
        {/* Hour hand */}
        <div
          className={`absolute ${styles.hourHandColor} ${sizeConfig.hourHand.width} ${sizeConfig.hourHand.height} ${sizeConfig.hourHand.radius} bottom-1/2 left-1/2 origin-bottom transform transition-transform duration-300 ease-in-out`}
          style={{
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`
          }}
        />
        
        {/* Minute hand */}
        <div
          className={`absolute ${styles.minuteHandColor} ${sizeConfig.minuteHand.width} ${sizeConfig.minuteHand.height} ${sizeConfig.minuteHand.radius} bottom-1/2 left-1/2 origin-bottom transform transition-transform duration-300 ease-in-out`}
          style={{
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`
          }}
        />
        
        {/* Second hand */}
        <div
          className={`absolute ${styles.secondHandColor} ${sizeConfig.secondHand.width} ${sizeConfig.secondHand.height} ${sizeConfig.secondHand.radius} bottom-1/2 left-1/2 origin-bottom transform`}
          style={{
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
          }}
        />
        
        {/* Center dot */}
        <div className={`absolute ${styles.centerDotColor} ${sizeConfig.centerDot} rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2`} />
      </div>
      
      {/* Digital Time */}
      <div className={`mt-3 font-mono ${sizeConfig.digitalTime} tracking-wide font-medium`}>
        {formatDigitalTime()}
      </div>
    </div>
  );
} 