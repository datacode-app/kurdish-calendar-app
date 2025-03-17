'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { getKurdishDate } from '@/lib/getKurdishDate';
import { formatBashurDate, formatRojhalatDate } from '@/lib/utils';

interface RegionTime {
  name: string;
  timezone: string;
  cities: string[];
}

// Kurdish month names for Bashur
const bashurMonths = [
  'کانوونی دووەم',   // January
  'شوبات',           // February
  'ئازار',           // March
  'نیسان',           // April
  'ئایار',           // May
  'حوزەیران',        // June
  'تەممووز',         // July
  'ئاب',             // August
  'ئەیلوول',         // September
  'تشرینی یەکەم',    // October
  'تشرینی دووەم',    // November
  'کانوونی یەکەم'    // December
];

const regions: RegionTime[] = [
  {
    name: 'rojhalat',
    timezone: 'Asia/Tehran',
    cities: ['Sine', 'Kirmaşan', 'Urmiye']
  },
  {
    name: 'bashur',
    timezone: 'Asia/Baghdad',
    cities: ['Hewlêr', 'Silêmanî', 'Duhok']
  },
  {
    name: 'bakur',
    timezone: 'Europe/Istanbul',
    cities: ['Amed', 'Wan', 'Mêrdîn']
  },
  {
    name: 'rojava',
    timezone: 'Asia/Damascus',
    cities: ['Qamişlo', 'Kobanî', 'Efrîn']
  }
];
interface KurdishRegionsTimeProps {
  locale: string;
}

export default function KurdishRegionsTime({ locale }: KurdishRegionsTimeProps) {
  const t = useTranslations();
  const [times, setTimes] = useState<{ [key: string]: string }>({});
  const [dates, setDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: string } = {};
      const newDates: { [key: string]: string } = {};

      regions.forEach(region => {
        // Get the current date in the region's timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: region.timezone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false
        });
        
        const timeFormatter = new Intl.DateTimeFormat('ku', {
          timeZone: region.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });

        // Format the time
        newTimes[region.name] = timeFormatter.format(now);
        
        // Get the date parts in the correct timezone
        const dateParts = formatter.formatToParts(now);
        const year = parseInt(dateParts.find(part => part.type === 'year')?.value || '0');
        const month = parseInt(dateParts.find(part => part.type === 'month')?.value || '0');
        const day = parseInt(dateParts.find(part => part.type === 'day')?.value || '0');
        
        // Create a new date object with the correct timezone date
        const regionDate = new Date(year, month - 1, day);
        
        // Get Kurdish date
        const kurdishDate = getKurdishDate(regionDate);
        if (region.name === 'bashur') {
          // For Bashur, use Kurdish month names
          const bashurMonth = bashurMonths[month - 1];
          newDates[region.name] = `${day}ی ${bashurMonth}ی ${year}`;
        } else {
          newDates[region.name] = kurdishDate.kurdishDate;
        }
      });

      setTimes(newTimes);
      setDates(newDates);
    };

    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-4"
    >
      {regions.map((region) => (
        <motion.div
          key={region.name}
          variants={itemVariants}
          className="group relative overflow-hidden bg-white/10 dark:bg-gray-800/10 rounded-3xl p-8 pb-12 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-400/30 transition-all duration-500"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Region Name */}
          <h3 className="relative text-xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 font-kurdish">
            {t(`regions.${region.name}`)}
          </h3>
          
          <div className="relative text-center space-y-6">
            {/* Digital Clock Display */}
            <div 
              className="flex justify-center items-center space-x-1.5 rtl:space-x-reverse font-mono" 
              dir="ltr"
            >
              {/* Hours */}
              <div className="relative">
                <div className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1.5 min-w-[3.5rem] flex justify-center backdrop-blur-md">
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                    {String(times[region.name]?.split(':')[0] || '--').padStart(2, '0')}
                  </span>
                </div>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-kurdish">
                  کاتژمێر
                </span>
              </div>

              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse mx-0.5">:</span>

              {/* Minutes */}
              <div className="relative">
                <div className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1.5 min-w-[3.5rem] flex justify-center backdrop-blur-md">
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                    {String(times[region.name]?.split(':')[1] || '--').padStart(2, '0')}
                  </span>
                </div>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-kurdish">
                  خولەک
                </span>
              </div>

              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500 animate-pulse mx-0.5">:</span>

              {/* Seconds */}
              <div className="relative">
                <div className="bg-black/5 dark:bg-white/5 rounded-lg px-2 py-1.5 min-w-[3.5rem] flex justify-center backdrop-blur-md">
                  <span className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 tabular-nums">
                    {String(times[region.name]?.split(':')[2] || '00').padStart(2, '0')}
                  </span>
                </div>
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-kurdish">
                  چرکە
                </span>
              </div>
            </div>

            {/* Kurdish Date */}
            <div className="pt-4 pb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-white/5 rounded-full py-1.5 px-3 backdrop-blur-md font-kurdish" dir={region.name === 'bashur' ? 'rtl' : 'ltr'}>
              {
                region.name === "bashur" ? formatBashurDate(new Date(), locale).formatted : formatRojhalatDate(new Date(), locale).formatted || ''
              }
             
              </span>
            </div>

            {/* Cities List */}
            {/* <div className="flex flex-wrap justify-center gap-2 mt-6">
              {region.cities.map((city) => (
                <span 
                  key={city}
                  className="text-xs text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 rounded-full px-3 py-1.5 backdrop-blur-sm hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-300 font-kurdish"
                >
                  {city}
                </span>
              ))}
            </div> */}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 