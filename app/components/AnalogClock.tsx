'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export type ClockSize = 'sm' | 'md' | 'lg';

interface AnalogClockProps {
  timezone: string;
  size?: ClockSize;
}

export default function AnalogClock({ timezone, size = 'md' }: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get time in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const digitalFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(time);
  const hours = parseInt(parts.find(part => part.type === 'hour')?.value || '0');
  const minutes = parseInt(parts.find(part => part.type === 'minute')?.value || '0');
  const seconds = parseInt(parts.find(part => part.type === 'second')?.value || '0');

  // Calculate angles
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours % 12 + minutes / 60) / 12) * 360;

  // Size classes
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const handSizes = {
    sm: {
      hour: 'h-[25%]',
      minute: 'h-[35%]',
      second: 'h-[40%]'
    },
    md: {
      hour: 'h-[30%]',
      minute: 'h-[40%]',
      second: 'h-[45%]'
    },
    lg: {
      hour: 'h-[35%]',
      minute: 'h-[45%]',
      second: 'h-[50%]'
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]} rounded-full bg-white/10 dark:bg-gray-800/10 backdrop-blur-md border border-white/20 dark:border-gray-700/20 shadow-lg`}>
        {/* Clock Face */}
        <div className="absolute inset-0 rounded-full">
          {/* Hour markers */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${i * 30}deg)` }}
            >
              <div className="w-1 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mx-auto" />
            </div>
          ))}

          {/* Hour hand */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-200 rounded-full z-20"
            style={{ 
              width: '0.25rem',
              height: `${size === 'lg' ? '35%' : size === 'md' ? '30%' : '25%'}`,
              transform: `translateY(-100%) rotate(${hourDegrees}deg)`,
              transformOrigin: 'bottom'
            }}
          />

          {/* Minute hand */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-gray-700 dark:bg-gray-300 rounded-full z-30"
            style={{ 
              width: '0.175rem',
              height: `${size === 'lg' ? '45%' : size === 'md' ? '40%' : '35%'}`,
              transform: `translateY(-100%) rotate(${minuteDegrees}deg)`,
              transformOrigin: 'bottom'
            }}
          />

          {/* Second hand */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-emerald-500 dark:bg-emerald-400 rounded-full z-40"
            style={{ 
              width: '0.125rem',
              height: `${size === 'lg' ? '50%' : size === 'md' ? '45%' : '40%'}`,
              transform: `translateY(-100%) rotate(${secondDegrees}deg)`,
              transformOrigin: 'bottom'
            }}
          />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full z-50 shadow-sm" />
        </div>
      </div>
      
      {/* Digital Clock */}
      <div className="text-sm font-mono text-gray-600 dark:text-gray-400">
        {digitalFormatter.format(time)}
      </div>
    </div>
  );
} 