'use client';

import React, { useState, useEffect } from 'react';

interface DigitalClockProps {
  timezone: string;
  className?: string;
  showSeconds?: boolean;
}

/**
 * Premium Digital Clock Component
 * Displays the current time for a specified timezone in a clean, digital format
 */
export default function DigitalClock({ 
  timezone, 
  className = '',
  showSeconds = true 
}: DigitalClockProps) {
  const [time, setTime] = useState<string>('');
  
  useEffect(() => {
    const formatTime = (date: Date): string => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          hour: '2-digit',
          minute: '2-digit',
          ...(showSeconds && { second: '2-digit' }),
          hour12: false,
          timeZone: timezone
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        return formatter.format(date);
      } catch (error) {
        console.error('Error formatting time:', error);
        return '--:--' + (showSeconds ? ':--' : '');
      }
    };
    
    const updateTime = () => {
      setTime(formatTime(new Date()));
    };
    
    // Set initial time
    updateTime();
    
    // Update every second
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timezone, showSeconds]);
  
  return (
    <div className={`font-mono tracking-wide ${className}`}>
      {time}
    </div>
  );
} 