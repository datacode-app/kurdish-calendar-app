import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  number: string;
  className?: string;
}

export default function AnimatedNumber({ number, className = '' }: AnimatedNumberProps) {
  const [displayNumber, setDisplayNumber] = useState(number);

  useEffect(() => {
    if (number !== displayNumber) {
      setDisplayNumber(number);
    }
  }, [number]);

  return (
    <div className={`relative inline-block ${className}`}>
      <AnimatePresence mode="popLayout">
        {displayNumber.split('').map((n, index) => (
          <motion.span
            key={`${index}-${n}`}
            initial={{ 
              y: 20,
              opacity: 0,
              rotateX: -90
            }}
            animate={{ 
              y: 0,
              opacity: 1,
              rotateX: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                mass: 0.8,
                delay: index * 0.05
              }
            }}
            exit={{ 
              y: -20,
              opacity: 0,
              rotateX: 90,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }}
            className="inline-block transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {n}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
} 