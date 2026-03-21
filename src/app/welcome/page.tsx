
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
  Users
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
      
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-secondary p-2 rounded-xl">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black uppercase tracking-widest text-xs opacity-80">Official Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black font-headline tracking-tighter">{school.name}</h1>
              <p className="text-lg italic opacity-90 mt-2 font-serif">"{school.motto}"</p>
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
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl p-4 flex items-center justify-center border border-accent mb-6">
              <img src={school.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-black text-primary leading-none">
              {language === 'en' ? `Welcome, ${user.name}` : `Bienvenue, ${user.name}`}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {school.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-primary font-bold">
              <MapPin className="w-4 h-4" />
              {school.location}
            </div>
          </div>

          <Card className="border-none shadow-xl bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Role</p>
                <p className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" />
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                Your personalized academic dashboard is ready. Access your grades, schedule, and school resources.
              </p>
              <Button 
                asChild 
                className="w-full bg-secondary text-primary hover:bg-secondary/90 h-14 text-lg font-black uppercase tracking-tighter gap-3 shadow-lg shadow-black/20"
              >
                <Link href="/dashboard">
                  {language === 'en' ? 'Enter Dashboard' : 'Accéder au Tableau de Bord'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-[0.3em] opacity-40">
            Powered by EduIgnite SaaS
          </p>
        </div>
      </div>
    </div>
  );
}
