'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function NowruzCountdown() {
  const t = useTranslations();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      
      // Nowruz is on March 21
      const nowruz = new Date(currentYear, 2, 21); // Month is 0-indexed
      
      // If we've passed this year's Nowruz, look to next year
      if (now > nowruz) {
        nowruz.setFullYear(currentYear + 1);
        setShowCountdown(true);
      } else if (now.getDate() === 21 && now.getMonth() === 2) {
        setShowCountdown(false);
        return;
      }

      const difference = nowruz.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    // Calculate immediately and then every second
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!showCountdown) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 rounded-2xl p-8 shadow-lg backdrop-blur-sm"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
        {t('countdown.title')}
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <motion.div variants={itemVariants} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl md:text-4xl font-bold text-emerald-600">{timeLeft.days}</div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {t('countdown.days')}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl md:text-4xl font-bold text-teal-600">{timeLeft.hours}</div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {t('countdown.hours')}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl md:text-4xl font-bold text-emerald-600">{timeLeft.minutes}</div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {t('countdown.minutes')}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-3xl md:text-4xl font-bold text-teal-600">{timeLeft.seconds}</div>
          <div className="text-sm md:text-base text-gray-600 dark:text-gray-300">
            {t('countdown.seconds')}
          </div>
        </motion.div>
      </div>

      <motion.p 
        variants={itemVariants}
        className="text-center mt-6 text-sm md:text-base text-gray-600 dark:text-gray-300"
      >
        {t('countdown.description')}
      </motion.p>
    </motion.div>
  );
} 