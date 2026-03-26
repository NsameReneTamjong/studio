
"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  BookOpen,
  Users,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SchoolWelcomePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, schools } = useAuth();
  const { language } = useI18n();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [typingText, setTypingText] = useState("");
  const fullText = "Insanely great.";

  useEffect(() => {
    setMounted(true);
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (isAuthenticated && user) {
      // 1. Typing Animation logic
      let i = 0;
      const interval = setInterval(() => {
        setTypingText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 100);

      // 2. High-fidelity connection sequence delay
      const timer = setTimeout(() => {
        setIsConnecting(false);
      }, 3500);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (!mounted || isAuthLoading || isConnecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0F2F5] p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 text-center max-w-md border border-white">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 rounded-[2rem] animate-ping" />
              <div className="relative bg-primary p-6 rounded-[2rem] shadow-xl animate-[spin_4s_linear_infinite]">
                <Building2 className="w-12 h-12 text-secondary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-8">
                <p className="text-xl font-black text-primary font-mono tracking-tighter italic">
                  {typingText}<span className="animate-pulse">|</span>
                </p>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-primary uppercase tracking-tighter leading-tight">
                  Connecting You to Your School
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  We are setting up your access. This will only take a few seconds.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-accent/50 px-6 py-4 rounded-2xl w-full border border-accent">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-[10px] font-black uppercase text-primary tracking-widest animate-pulse">Syncing Node Registry</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex items-center gap-4 opacity-30">
           <img src="https://picsum.photos/seed/eduignite/100/100" className="w-6 h-6 grayscale rounded" alt="Logo" />
           <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary">EduIgnite Secure Infrastructure</p>
        </div>
      </div>
    );
  }

  const school = user?.school || (user?.schoolId ? schools.find(s => s.id === user?.schoolId) : schools[0]);

  if (!user || !school) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center space-y-6">
        <div className="p-6 bg-primary/5 rounded-full border-2 border-dashed border-primary/20">
          <Building2 className="w-16 h-16 text-primary/20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Connection Timeout</h1>
          <p className="text-muted-foreground max-w-md mx-auto">We couldn't link your account to an institutional node. Please re-authenticate.</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 font-bold" onClick={() => router.push("/login")}>
          <RefreshCw className="w-4 h-4" /> Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] selection:bg-secondary selection:text-primary flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1/2 bg-primary/5 -z-10" />
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">

        {/* LEFT SIDE: SCHOOL BRANDING */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-200 group">
            <img 
              src={school.banner} 
              alt={school.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/20 to-transparent" />

            <div className="absolute bottom-10 left-10 right-10 text-white space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center border-2 border-accent transition-transform hover:rotate-3">
                  <img src={school.logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <Badge className="bg-secondary text-primary border-none font-black uppercase text-[9px] px-3 h-6 mb-1">
                    Node: {school.id}
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tighter">
                    {school.name}
                  </h1>
                </div>
              </div>
              <p className="text-xl md:text-2xl italic opacity-90 font-serif leading-tight">
                "{school.motto}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] text-center border border-white shadow-sm hover:shadow-md transition-all">
              <Users className="w-6 h-6 mx-auto mb-3 text-blue-600" />
              <p className="text-xs font-black text-primary uppercase tracking-widest">2,500+ Students</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] text-center border border-white shadow-sm hover:shadow-md transition-all">
              <BookOpen className="w-6 h-6 mx-auto mb-3 text-purple-600" />
              <p className="text-xs font-black text-primary uppercase tracking-widest">45+ Subjects</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] text-center border border-white shadow-sm hover:shadow-md transition-all">
              <ShieldCheck className="w-6 h-6 mx-auto mb-3 text-green-600" />
              <p className="text-xs font-black text-green-600 uppercase tracking-widest">Active Campus</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: USER WELCOME */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Portal Initialized</span>
            </div>
            <h2 className="text-5xl font-black text-primary tracking-tighter leading-[0.9]">
              {language === 'en' ? `Welcome, ${user.name}` : `Bienvenue, ${user.name}`}
            </h2>
            <Badge className="bg-primary/5 text-primary border-primary/10 h-7 px-4 font-black uppercase text-[10px] tracking-widest">
              {user.role.replace('_', ' ')}
            </Badge>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Run your entire academic life in one place. No more spreadsheets, no lost records, no stress.
            </p>
          </div>

          <Card className="bg-primary text-white rounded-[2.5rem] shadow-2xl border-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Zap className="w-20 h-20 text-secondary" /></div>
            <CardContent className="p-10 space-y-6 relative z-10">
              <p className="text-base font-medium opacity-80 leading-relaxed">
                Your high-availability dashboard is ready. All institutional nodes are synchronized and secured.
              </p>
              <Button asChild size="lg" className="w-full bg-secondary text-primary hover:bg-secondary/90 font-black uppercase tracking-widest text-xs h-16 rounded-2xl shadow-xl transition-all active:scale-95 gap-3">
                <Link href="/dashboard">
                  Enter Secure Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between opacity-40">
             <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-[8px] font-black uppercase tracking-widest">Regional Cluster Littoral</span>
             </div>
             <p className="text-[8px] font-black uppercase tracking-widest">Powered by EduIgnite SaaS</p>
          </div>
        </div>

      </div>
    </div>
  );
}
