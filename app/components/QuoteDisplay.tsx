'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote } from '@/types/holidays';

interface QuoteDisplayProps {
  quotes: Quote[];
  locale: string;
}

export default function QuoteDisplay({ quotes, locale }: QuoteDisplayProps) {
  const t = useTranslations();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Get current quote
  const currentQuote = quotes[currentQuoteIndex];

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      // Wait for exit animation to complete before changing quote
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setIsVisible(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  if (!currentQuote) return null;

  return (
    <Card className="mx-auto overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 border-none shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-primary">{t('quotes.inspirational')}</h2>
          
          <div className="min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isVisible && (
                <motion.div
                  key={currentQuoteIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <motion.blockquote 
                    className="text-xl md:text-2xl italic font-medium text-foreground"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    &quot;{currentQuote.quote[locale as keyof typeof currentQuote.quote]}&quot;
                  </motion.blockquote>
                  
                  <motion.div
                    className="flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="h-0.5 w-12 bg-primary my-4"></div>
                    <p className="text-lg font-semibold text-primary">{currentQuote.celebrity}</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center space-x-2 pt-4">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentQuoteIndex(index);
                    setIsVisible(true);
                  }, 500);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentQuoteIndex ? 'bg-primary w-4' : 'bg-primary/30'
                }`}
                aria-label={`Quote ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 