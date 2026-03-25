
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
  Mail,
  Heart,
  Calendar,
  Clock
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
    // CEO should not be here, redirect back to dashboard
    if (user?.role === "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (!mounted || !user?.school) return null;

  const school = user.school;
  const isParent = user.role === "PARENT";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header Decoration */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-primary/5 -z-10" />
      
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        {/* Visual Section */}
        <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white bg-slate-200">
            <img 
              src={school.banner} 
              alt={school.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-secondary p-2 rounded-xl">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <span className="font-black uppercase tracking-widest text-xs opacity-80">Official Institutional Portal</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-headline tracking-tighter leading-none">{school.name}</h1>
              <p className="text-lg lg:text-xl italic opacity-90 mt-2 font-serif">"{school.motto}"</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-accent flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1">
              <div className="p-3 bg-blue-50 rounded-2xl mb-1">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Community</p>
              <p className="text-sm font-black text-primary">2,500+ Students</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-accent flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1">
              <div className="p-3 bg-purple-50 rounded-2xl mb-1">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Curriculum</p>
              <p className="text-sm font-black text-primary">45+ Subjects</p>
            </div>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-accent flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1">
              <div className="p-3 bg-green-50 rounded-2xl mb-1">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest leading-none">Status</p>
              <p className="text-sm font-black text-green-600">Active Campus</p>
            </div>
          </div>

          <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 flex flex-wrap justify-between gap-8 backdrop-blur-sm">
             <div className="flex items-start gap-4 text-sm font-bold text-primary/70">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-accent">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex flex-col">
                   <span className="text-primary font-black">{school.address}</span>
                   <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{school.location} • {school.postalCode}</span>
                </div>
             </div>
             <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                   <Phone className="w-4 h-4 text-secondary" />
                   <span className="text-sm font-black text-primary/80">{school.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                   <Mail className="w-4 h-4 text-secondary" />
                   <span className="text-sm font-black text-primary/80">{school.email}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="space-y-6">
            <div className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl p-5 flex items-center justify-center border-4 border-accent mb-2 transition-transform hover:rotate-3">
              <img src={school.logo} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-primary leading-none tracking-tight">
                {language === 'en' ? `Welcome, ${user.name}` : `Bienvenue, ${user.name}`}
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-secondary text-primary border-none font-black uppercase text-[10px] px-3">
                  {user.role.replace('_', ' ')}
                </Badge>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Academic Year 2023/24
                </span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg font-medium">
              {isParent 
                ? "Experience the future of your children's education. Monitor progress, handle fees, and stay connected with the school administration instantly."
                : school.description}
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-primary text-white overflow-hidden relative rounded-[2.5rem]">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Sparkles className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Verified Node Registry</p>
                <div className="flex items-center gap-3">
                  {isParent ? (
                    <div className="p-3 bg-secondary/20 rounded-2xl">
                      <Heart className="w-8 h-8 text-secondary fill-secondary/20" />
                    </div>
                  ) : (
                    <div className="p-3 bg-secondary/20 rounded-2xl">
                      <GraduationCap className="w-8 h-8 text-secondary" />
                    </div>
                  )}
                  <div>
                    <p className="text-2xl font-black uppercase tracking-tighter">Access Authorized</p>
                    <p className="text-[10px] font-mono text-white/40">ID: {user.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-xs opacity-80 leading-relaxed font-medium">
                  {isParent 
                    ? "Your family dashboard is synchronized. Review individual report cards and attendance logs for all registered children below."
                    : "Your pedagogical dashboard is live. Manage curriculum, track financial status, and access institutional resources securely."}
                </p>
              </div>

              <Button 
                asChild 
                className="w-full bg-secondary text-primary hover:bg-secondary/90 h-16 text-xl font-black uppercase tracking-tighter gap-3 shadow-lg shadow-black/20 rounded-2xl active:scale-95 transition-all"
              >
                <Link href="/dashboard">
                  {language === 'en' ? 'Enter Dashboard' : 'Accéder au Tableau de Bord'}
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 text-muted-foreground opacity-30">
            <div className="h-px w-8 bg-current" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Powered by EduIgnite SaaS
            </p>
            <div className="h-px w-8 bg-current" />
          </div>
        </div>
      </div>
    </div>
  );
}
