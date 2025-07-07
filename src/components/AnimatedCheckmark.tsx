import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedCheckmarkProps {
  isCompleted: boolean;
  size?: number;
  className?: string;
}

export function AnimatedCheckmark({ isCompleted, size = 20, className }: AnimatedCheckmarkProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isCompleted]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {isCompleted && (
        <Check 
          size={size}
          className={cn(
            "text-success transition-all duration-200",
            shouldAnimate ? "animate-checkmark" : "animate-pulse-success"
          )}
        />
      )}
    </div>
  );
}