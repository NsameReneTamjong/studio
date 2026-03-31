
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * A thin top-level progress bar that triggers on route changes.
 * Provides immediate feedback for navigation actions.
 */
export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start progress
    setIsVisible(true);
    setProgress(30);

    // Simulate completion
    const timer = setTimeout(() => {
      setProgress(100);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(hideTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[110] h-1 pointer-events-none">
      <div 
        className="h-full bg-secondary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(103,208,228,0.8)]" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
