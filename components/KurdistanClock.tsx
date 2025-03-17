'use client';

import React, { useState, useEffect } from 'react';

interface KurdistanClockProps {
  timezone: string;
  cityName: string;
  country: string;
  darkMode?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * An elegant Kurdish-inspired analog clock component
 * Features precise positioning and cultural elements from Kurdistan
 */
export default function KurdistanClock({
  timezone,
  cityName,
  country,
  darkMode = false,
  size = 'md'
}: KurdistanClockProps) {
  const [time, setTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      try {
        // Format the date using the specified timezone
        const options: Intl.DateTimeFormatOptions = { 
          timeZone: timezone,
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false
        };
        
        // Get the time as a string and parse the values
        const timeString = new Intl.DateTimeFormat('en-US', options).format(date);
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        
        // Create a new date with the timezone-adjusted time values
        const adjustedDate = new Date();
        adjustedDate.setHours(hours);
        adjustedDate.setMinutes(minutes);
        adjustedDate.setSeconds(seconds);
        
        setTime(adjustedDate);
      } catch (error) {
        console.error('Error formatting time:', error);
        setTime(date); // Fallback to local time
      }
    };
    
    // Update immediately, then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timezone]);
  
  // Get hours, minutes, seconds
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Calculate precise angles for hands
  const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondAngle = (seconds / 60) * 360;
  
  // Size configuration based on selected size
  const dimensions = {
    sm: {
      container: 'w-36 h-36',
      hourHand: 'w-1.5 h-10',
      minuteHand: 'w-1 h-14', 
      secondHand: 'w-0.5 h-16',
      hourMarker: 'h-2.5 w-1.5',
      minuteMarker: 'h-1.5 w-0.5',
      centerDot: 'w-3 h-3',
      fontSize: 'text-sm',
      cardPadding: 'p-4',
      borderWidth: 'border-2',
      sunSize: 'w-[70%] h-[70%]'
    },
    md: {
      container: 'w-52 h-52',
      hourHand: 'w-2 h-16',
      minuteHand: 'w-1.5 h-20',
      secondHand: 'w-0.75 h-24',
      hourMarker: 'h-3 w-2',
      minuteMarker: 'h-2 w-1',
      centerDot: 'w-4 h-4',
      fontSize: 'text-base',
      cardPadding: 'p-6',
      borderWidth: 'border-3',
      sunSize: 'w-[75%] h-[75%]'
    },
    lg: {
      container: 'w-72 h-72',
      hourHand: 'w-2.5 h-24',
      minuteHand: 'w-2 h-32',
      secondHand: 'w-1 h-36',
      hourMarker: 'h-4 w-2.5',
      minuteMarker: 'h-2.5 w-1',
      centerDot: 'w-5 h-5',
      fontSize: 'text-lg',
      cardPadding: 'p-8',
      borderWidth: 'border-4',
      sunSize: 'w-[80%] h-[80%]'
    }
  };
  
  // Kurdish flag inspired color themes
  const colors = darkMode 
    ? {
        // Dark mode colors - more refined for better contrast
        dialColor: 'bg-gray-900',
        dialBorder: 'border-red-700',
        hourHand: 'bg-red-500',
        minuteHand: 'bg-green-500',
        secondHand: 'bg-yellow-500',
        hourMarker: 'bg-red-500',
        minuteMarker: 'bg-gray-600',
        centerDot: 'bg-yellow-500',
        text: 'text-gray-100',
        sunDecoration: 'from-yellow-500/20 to-transparent',
        cardBg: 'bg-gray-800',
        cardBorder: 'border-gray-700',
        cardShadow: 'shadow-lg shadow-black/20'
      }
    : {
        // Light mode colors - brighter and more vibrant
        dialColor: 'bg-white',
        dialBorder: 'border-red-600',
        hourHand: 'bg-red-600',
        minuteHand: 'bg-green-600',
        secondHand: 'bg-yellow-600',
        hourMarker: 'bg-red-600',
        minuteMarker: 'bg-gray-300',
        centerDot: 'bg-yellow-500',
        text: 'text-gray-800',
        sunDecoration: 'from-yellow-500/10 to-transparent',
        cardBg: 'bg-white',
        cardBorder: 'border-gray-200',
        cardShadow: 'shadow-lg shadow-gray-200/50'
      };

  // Generate hour markers (the 12 hour indicators)
  const hourMarkers = Array.from({ length: 12 }).map((_, index) => {
    const angle = (index * 30); // 30 degrees per hour
    return (
      <div
        key={`hour-${index}`}
        className={`absolute ${dimensions[size].hourMarker} ${colors.hourMarker} rounded-full`}
        style={{
          transform: `rotate(${angle}deg) translateY(-${size === 'sm' ? 15 : size === 'md' ? 23 : 32}px)`,
          transformOrigin: 'center bottom',
          left: '50%',
          bottom: '50%',
          marginLeft: `${dimensions[size].hourMarker === 'w-1.5' ? '-0.75px' : dimensions[size].hourMarker === 'w-2' ? '-1px' : '-1.25px'}`
        }}
      />
    );
  });

  // Generate minute markers (the 60 minute indicators)
  const minuteMarkers = Array.from({ length: 60 }).map((_, index) => {
    // Skip positions where hour markers already exist
    if (index % 5 === 0) return null;
    
    const angle = (index * 6); // 6 degrees per minute
    return (
      <div
        key={`minute-${index}`}
        className={`absolute ${dimensions[size].minuteMarker} ${colors.minuteMarker} rounded-full`}
        style={{
          transform: `rotate(${angle}deg) translateY(-${size === 'sm' ? 15 : size === 'md' ? 23 : 32}px)`,
          transformOrigin: 'center bottom',
          left: '50%',
          bottom: '50%',
          marginLeft: `${dimensions[size].minuteMarker === 'w-0.5' ? '-0.25px' : dimensions[size].minuteMarker === 'w-1' ? '-0.5px' : '-0.5px'}`
        }}
      />
    );
  });

  // Format digital time
  const formatDigitalTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: timezone
    };
    
    try {
      return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (error) {
      return time.toLocaleTimeString('en-US', { hour12: false });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* City information */}
      <div className="text-center mb-3">
        <h3 className={`font-semibold ${dimensions[size].fontSize} ${colors.text}`}>{cityName}</h3>
        <p className={`text-sm opacity-80 ${colors.text}`}>{country}</p>
      </div>
      
      {/* Clock card */}
      <div className={`${colors.cardBg} ${colors.cardBorder} border rounded-xl ${dimensions[size].cardPadding} ${colors.cardShadow} transition-all duration-300`}>
        {/* Clock face container */}
        <div className="relative">
          {/* Sun-inspired decoration (Kurdish sun) */}
          <div className={`absolute inset-0 m-auto rounded-full bg-gradient-radial ${colors.sunDecoration} ${dimensions[size].sunSize} blur-sm`}></div>
          
          {/* Clock dial */}
          <div className={`relative ${dimensions[size].container} rounded-full ${colors.dialColor} ${colors.dialBorder} ${dimensions[size].borderWidth} flex items-center justify-center overflow-hidden`}>
            {/* Hour and minute markers */}
            {hourMarkers}
            {minuteMarkers.filter(Boolean)}
            
            {/* Hour hand */}
            <div
              className={`absolute ${dimensions[size].hourHand} ${colors.hourHand} rounded-full origin-bottom left-1/2 transform -translate-x-1/2 z-10`}
              style={{
                transform: `translateX(-50%) rotate(${hourAngle}deg)`,
                transformOrigin: 'center bottom',
                bottom: '50%'
              }}
            />
            
            {/* Minute hand */}
            <div
              className={`absolute ${dimensions[size].minuteHand} ${colors.minuteHand} rounded-full origin-bottom left-1/2 transform -translate-x-1/2 z-10`}
              style={{
                transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
                transformOrigin: 'center bottom',
                bottom: '50%'
              }}
            />
            
            {/* Second hand with smooth animation */}
            <div
              className={`absolute ${dimensions[size].secondHand} ${colors.secondHand} rounded-full origin-bottom left-1/2 transform -translate-x-1/2 z-10 transition-transform`}
              style={{
                transform: `translateX(-50%) rotate(${secondAngle}deg)`,
                transformOrigin: 'center bottom',
                bottom: '50%',
                transition: 'transform 0.1s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
              }}
            />
            
            {/* Center dot (Kurdish sun emblem) */}
            <div className={`absolute z-20 rounded-full ${colors.centerDot} ${dimensions[size].centerDot}`} />
          </div>
        </div>
        
        {/* Digital time display */}
        <div className={`text-center mt-4 font-mono font-medium ${dimensions[size].fontSize} ${colors.text}`}>
          {formatDigitalTime()}
        </div>
      </div>
    </div>
  );
} 