
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProgressCircleProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: ReactNode;
}

export function ProgressCircle({ progress, size = 'md', className, children }: ProgressCircleProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };

  const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
  const radius = size === 'sm' ? 20 : size === 'md' ? 26 : 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.3))'
          }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}