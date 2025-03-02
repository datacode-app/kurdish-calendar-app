/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';

interface Holiday {
  date: string;
  event: string;
  note?: string;
}

export default function EventsListClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch holidays data
    fetch('/data/holidays.json')
      .then(response => response.json())
      .then(data => {
        setHolidays(data.holidays);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading holidays:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-5 sm:p-6 text-center">
        <div className="animate-pulse flex space-x-4 justify-center">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1 max-w-md">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {holidays.map((holiday, index) => (
        <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                {holiday.event}
              </p>
              <p className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{format(new Date(holiday.date), "MMMM d, yyyy")}</span>
              </p>
              {holiday.note && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{t('events.note')}:</span> {holiday.note}
                </p>
              )}
            </div>
            <div className="ml-2 flex-shrink-0 flex">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                {t('events.holiday')}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 