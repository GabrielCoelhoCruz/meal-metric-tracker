import { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Global loading context for navigation and major state changes
export function GlobalLoadingIndicator() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show loading indicator during page transitions
    const handleStart = () => setIsVisible(true);
    const handleComplete = () => setIsVisible(false);

    // Listen for navigation events
    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl shadow-lg border border-border">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    </div>
  );
}