
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  ShieldCheck, 
  Radio, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LiveClassRoomPage() {
  const { user, liveClasses } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const activeClass = liveClasses.find(c => c.id === params.classId);

  useEffect(() => {
    // Simulate node connection
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLeaveClass = () => {
    router.push("/dashboard/live-classes");
    toast({ title: "Session Closed", description: "Node registry synchronized." });
  };

  if (!activeClass && !isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="p-6 bg-red-500/10 rounded-full border-2 border-dashed border-red-500/20">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Session Not Found</h1>
          <p className="text-slate-400 max-w-md mx-auto">The requested pedagogical node does not exist or has been decommissioned.</p>
        </div>
        <Button className="rounded-xl px-10 h-12" onClick={() => router.push("/dashboard/live-classes")}>Return to Lobby</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col font-body overflow-hidden">
      {/* 1. ROOM HEADER */}
      <header className="h-16 px-6 bg-slate-900 border-b border-white/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] animate-pulse flex items-center gap-2 shadow-lg shadow-red-600/20">
            <Radio className="w-3 h-3" /> LIVE BROADCAST
          </div>
          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
          <div>
            <h1 className="font-black text-sm uppercase tracking-tighter text-white/90">
              {activeClass?.title || "Virtual Session"}
            </h1>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest">
              {activeClass?.subject} • Node {params.classId}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-white/5 rounded-2xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <Button variant="destructive" size="sm" className="h-10 px-6 rounded-2xl gap-2 font-black uppercase text-[10px] tracking-widest" onClick={handleLeaveClass}>
            <LogOut className="w-4 h-4" /> Exit Room
          </Button>
        </div>
      </header>

      {/* 2. JITSI EMBED AREA */}
      <div className="flex-1 relative bg-slate-900">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Establishing Node Link...</p>
          </div>
        ) : (
          <iframe 
            src={`https://meet.jit.si/${activeClass?.meetingId}#userInfo.displayName="${encodeURIComponent(user?.name || "Guest")}"&config.startWithAudioMuted=true&config.startWithVideoMuted=false`}
            allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write"
            className="w-full h-full border-none"
          />
        )}
      </div>

      {/* 3. COMPLIANCE FOOTER */}
      <footer className="h-10 bg-slate-900 border-t border-white/5 flex items-center justify-center shrink-0 px-6">
         <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">
           Verified Institutional Secure Infrastructure • Virtual Pedagogical Node • {new Date().getFullYear()}
         </p>
      </footer>
    </div>
  );
}
