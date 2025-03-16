'use client';

import React, { useState, useEffect } from 'react';

interface AnalogClockProps {
  timezone: string;
  size?: number;
  hourHandColor?: string;
  minuteHandColor?: string;
  secondHandColor?: string;
  hourMarksColor?: string;
}

const AnalogClock: React.FC<AnalogClockProps> = ({
  timezone,
  size = 180,
  hourHandColor = '#000000',
  minuteHandColor = '#444444',
  secondHandColor = '#ff0000',
  hourMarksColor = '#333333',
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      // Convert to target timezone
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: timezone,
        hour: 'numeric', 
        minute: 'numeric', 
        second: 'numeric',
        hour12: false
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const timeString = formatter.format(date);
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      
      // Create a new date with the timezone-adjusted time
      const localDate = new Date();
      localDate.setHours(hours);
      localDate.setMinutes(minutes);
      localDate.setSeconds(seconds);
      
      setTime(localDate);
    };
    
    // Update immediately and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, [timezone]);

  // Calculate the rotation for the clock hands
  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (time.getMinutes() + secondsRatio) / 60;
  const hoursRatio = (time.getHours() % 12 + minutesRatio) / 12;

  // CSS for hand rotations
  const secondHandStyle = {
    transform: `rotate(${secondsRatio * 360}deg)`,
    backgroundColor: secondHandColor,
  };

  const minuteHandStyle = {
    transform: `rotate(${minutesRatio * 360}deg)`,
    backgroundColor: minuteHandColor,
  };

  const hourHandStyle = {
    transform: `rotate(${hoursRatio * 360}deg)`,
    backgroundColor: hourHandColor,
  };

  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const rotation = (i / 12) * 360;
    const markerStyle = {
      transform: `rotate(${rotation}deg)`,
    };
    
    return (
      <div 
        key={i} 
        className="absolute w-1 h-4 bg-black" 
        style={{
          ...markerStyle,
          top: `${size / 2 - 10}px`,
          left: `${size / 2}px`,
          transformOrigin: `0 10px`,
          backgroundColor: hourMarksColor,
        }}
      />
    );
  });

  return (
    <div 
      className="relative rounded-full border-2 border-gray-300 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-600"
      style={{ 
        width: `${size}px`, 
        height: `${size}px` 
      }}
    >
      {hourMarkers}
      
      {/* Center dot */}
      <div 
        className="absolute rounded-full z-10 bg-black dark:bg-white"
        style={{ 
          width: `${size / 20}px`, 
          height: `${size / 20}px`,
          top: `${size / 2 - size / 40}px`,
          left: `${size / 2 - size / 40}px`,
        }}
      />
      
      {/* Hour hand */}
      <div 
        className="absolute rounded-full"
        style={{
          ...hourHandStyle,
          width: `${size / 30}px`,
          height: `${size * 0.3}px`,
          top: `${size / 2 - size * 0.3 + size / 60}px`,
          left: `${size / 2 - size / 60}px`,
          transformOrigin: `${size / 60}px ${size * 0.3 - size / 60}px`,
        }}
      />
      
      {/* Minute hand */}
      <div 
        className="absolute rounded-full"
        style={{
          ...minuteHandStyle,
          width: `${size / 40}px`,
          height: `${size * 0.4}px`,
          top: `${size / 2 - size * 0.4 + size / 80}px`,
          left: `${size / 2 - size / 80}px`,
          transformOrigin: `${size / 80}px ${size * 0.4 - size / 80}px`,
        }}
      />
      
      {/* Second hand */}
      <div 
        className="absolute rounded-full"
        style={{
          ...secondHandStyle,
          width: `${size / 80}px`,
          height: `${size * 0.45}px`,
          top: `${size / 2 - size * 0.45 + size / 160}px`,
          left: `${size / 2 - size / 160}px`,
          transformOrigin: `${size / 160}px ${size * 0.45 - size / 160}px`,
        }}
      />
    </div>
  );
};

export default AnalogClock; 