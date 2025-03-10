'use client';
import { useEffect } from 'react';

export default function PWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 
        window.location.hostname !== 'localhost') {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(
          function() {
            console.log('Service Worker registration successful');
          },
          function(err) {
            console.log('Service Worker registration failed: ', err);
          }
        );
      });
    }
  }, []);

  return null;
}