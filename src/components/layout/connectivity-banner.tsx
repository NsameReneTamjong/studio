
'use client';

import { useOnlineStatus } from '@/hooks/use-online-status';
import { WifiOff, Wifi, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

/**
 * A persistent banner that notifies the user when they go offline.
 * Includes smooth transitions and professional status messaging.
 */
export function ConnectivityBanner() {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-red-600 text-white p-2 flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
        <div className="bg-white/20 p-1 rounded-lg">
          <WifiOff className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest">Offline Mode Active</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span className="text-[10px] font-medium opacity-90">Changes will sync once connection is restored.</span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[100] bg-green-600 text-white p-2 flex items-center justify-center gap-3 animate-in slide-in-from-top fade-out fill-mode-forwards duration-500 delay-2000">
        <div className="bg-white/20 p-1 rounded-lg">
          <Wifi className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Back Online — Syncing Data</span>
        <RefreshCw className="w-3 h-3 animate-spin" />
      </div>
    );
  }

  return null;
}
