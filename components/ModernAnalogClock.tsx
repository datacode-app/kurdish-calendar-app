'use client';

import React, { useState, useEffect } from 'react';
import { ThemeType } from '@/lib/theme-utils';

interface ModernAnalogClockProps {
  timezone: string;
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
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Premium Modern Analog Clock Component
 * A minimalist, elegant clock design with perfect proportions
 */
export default function ModernAnalogClock({
  timezone,
  darkMode = false,
  theme = 'elegant',
  dialColor,
  borderColor,
  numberColor,
  handColors,
  tickColors,
  size = 'md'
}: ModernAnalogClockProps) {
  const [time, setTime] = useState(new Date());
  
  // Handle timezone conversion
  useEffect(() => {
    // Function to update clock time with timezone
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
  
  // Size-dependent styles
  const clockSizes = {
    sm: {
      clockSize: 'w-32 h-32',
      hourHand: { width: 'w-1.5', height: 'h-8', radius: 'rounded-sm' },
      minuteHand: { width: 'w-1', height: 'h-11', radius: 'rounded-sm' },
      secondHand: { width: 'w-0.5', height: 'h-12', radius: 'rounded-full' },
      centerDot: 'w-2 h-2',
      hourMarkers: { width: 'w-1', height: 'h-2', inset: '11%' },
      hourNumbers: { fontSize: 'text-[9px]', distance: 34 },
      minuteMarkers: { width: 'w-0.5', height: 'h-1', inset: '15%' },
      borderWidth: 'border',
      shadow: 'shadow-sm'
    },
    md: {
      clockSize: 'w-48 h-48',
      hourHand: { width: 'w-2', height: 'h-12', radius: 'rounded-sm' },
      minuteHand: { width: 'w-1.5', height: 'h-16', radius: 'rounded-sm' },
      secondHand: { width: 'w-0.5', height: 'h-20', radius: 'rounded-full' },
      centerDot: 'w-3 h-3',
      hourMarkers: { width: 'w-1.5', height: 'h-3', inset: '8%' },
      hourNumbers: { fontSize: 'text-xs', distance: 38 },
      minuteMarkers: { width: 'w-0.5', height: 'h-1.5', inset: '10%' },
      borderWidth: 'border-2',
      shadow: 'shadow-md'
    },
    lg: {
      clockSize: 'w-64 h-64',
      hourHand: { width: 'w-2.5', height: 'h-16', radius: 'rounded-sm' },
      minuteHand: { width: 'w-1.5', height: 'h-24', radius: 'rounded-sm' },
      secondHand: { width: 'w-0.5', height: 'h-28', radius: 'rounded-full' },
      centerDot: 'w-4 h-4',
      hourMarkers: { width: 'w-1.5', height: 'h-4', inset: '6%' },
      hourNumbers: { fontSize: 'text-sm', distance: 40 },
      minuteMarkers: { width: 'w-0.5', height: 'h-2', inset: '9%' },
      borderWidth: 'border-2',
      shadow: 'shadow-lg'
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
  
  return (
    <div className={`relative ${sizeConfig.clockSize} ${sizeConfig.shadow} ${sizeConfig.borderWidth} ${borderColor} ${dialColor} rounded-full flex items-center justify-center`}>
      {/* Hour markers (only at hours positions) */}
      {[...Array(12)].map((_, index) => (
        <div
          key={`hour-marker-${index}`}
          className={`absolute ${tickColors.hour} ${sizeConfig.hourMarkers.width} ${sizeConfig.hourMarkers.height}`}
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
            className={`absolute ${tickColors.minute} ${sizeConfig.minuteMarkers.width} ${sizeConfig.minuteMarkers.height}`}
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
            className={`absolute ${numberColor} ${sizeConfig.hourNumbers.fontSize} font-medium`}
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
        className={`absolute ${handColors.hour} ${sizeConfig.hourHand.width} ${sizeConfig.hourHand.height} ${sizeConfig.hourHand.radius} bottom-1/2 left-1/2 origin-bottom transform transition-transform duration-300 ease-in-out`}
        style={{
          transformOrigin: '50% 100%',
          transform: `translateX(-50%) rotate(${hourAngle}deg)`
        }}
      />
      
      {/* Minute hand */}
      <div
        className={`absolute ${handColors.minute} ${sizeConfig.minuteHand.width} ${sizeConfig.minuteHand.height} ${sizeConfig.minuteHand.radius} bottom-1/2 left-1/2 origin-bottom transform transition-transform duration-300 ease-in-out`}
        style={{
          transformOrigin: '50% 100%',
          transform: `translateX(-50%) rotate(${minuteAngle}deg)`
        }}
      />
      
      {/* Second hand */}
      <div
        className={`absolute ${handColors.second} ${sizeConfig.secondHand.width} ${sizeConfig.secondHand.height} ${sizeConfig.secondHand.radius} bottom-1/2 left-1/2 origin-bottom transform`}
        style={{
          transformOrigin: '50% 100%',
          transform: `translateX(-50%) rotate(${secondAngle}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
        }}
      />
      
      {/* Center dot */}
      <div className={`absolute ${handColors.second} ${sizeConfig.centerDot} rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2`} />
    </div>
  );
} 