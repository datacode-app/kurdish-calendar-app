// app/pwa.tsx
'use client';

import { useEffect } from 'react';
// import { register } from 'sw/registration';

export default function PWA() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js');
    }
  }, []);

  return null;
}