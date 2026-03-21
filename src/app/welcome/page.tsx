
"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Building2, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  Users,
  Phone,
  Mail
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SchoolWelcomePage() {
  const { user, isAuthenticated } = useAuth();
  const { language } = useI18n();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!mounted || !user?.school) return null;

  const school = user.school;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header Decoration */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-primary/5 -z-10" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Visual Section */}
        <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
            <img 
              src={school.banner} 
              alt={school.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              data-ai-hint="school building"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-secondary p-2 rounded-xl">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black uppercase tracking-widest text-xs opacity-80">Official Institutional Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter">{school.name}</h1>
              <p className="text-lg lg:text-xl italic opacity-90 mt-2 font-serif">"{school.motto}"</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-accent flex flex-col items-center text-center gap-2">
              <Users className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Community</p>
              <p className="text-sm font-black">2,500+ Students</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-accent flex flex-col items-center text-center gap-2">
              <BookOpen className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Curriculum</p>
              <p className="text-sm font-black">45+ Subjects</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-accent flex flex-col items-center text-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
              <p className="text-sm font-black text-green-600">Active Campus</p>
            </div>
          </div>

          <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-wrap justify-between gap-6">
             <div className="flex items-center gap-3 text-sm font-bold text-primary/70">
                <MapPin className="w-5 h-5 text-secondary" />
                <div className="flex flex-col">
                   <span>{school.address}</span>
                   <span className="text-[10px] opacity-60 uppercase">{school.location} • {school.postalCode}</span>
                </div>
             </div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-bold text-primary/70">
                   <Phone className="w-4 h-4 text-secondary" />
                   <span>{school.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-primary/70">
                   <Mail className="w-4 h-4 text-secondary" />
                   <span>{school.email}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl p-4 flex items-center justify-center border border-accent mb-6">
              <img src={school.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl font-black text-primary leading-none tracking-tight">
              {language === 'en' ? `Welcome, ${user.name}` : `Bienvenue, ${user.name}`}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {school.description}
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-primary text-white overflow-hidden relative rounded-[2rem]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Session Role</p>
                <p className="text-2xl font-bold flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-secondary" />
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <p className="text-sm opacity-70 leading-relaxed font-medium">
                Your high-fidelity pedagogical dashboard is live. Manage your curriculum, track financial status, and access institutional resources securely.
              </p>
              <Button 
                asChild 
                className="w-full bg-secondary text-primary hover:bg-secondary/90 h-16 text-xl font-black uppercase tracking-tighter gap-3 shadow-lg shadow-black/20 rounded-2xl"
              >
                <Link href="/dashboard">
                  {language === 'en' ? 'Enter Dashboard' : 'Accéder au Tableau de Bord'}
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-[0.4em] opacity-30">
            Powered by EduIgnite SaaS Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}
