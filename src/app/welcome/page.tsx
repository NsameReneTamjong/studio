"use client";

import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  BookOpen,
  Users,
  RefreshCw,
  Sparkles,
  Zap,
  Globe,
  MapPin,
  Phone,
  Mail,
  Quote,
  Clock,
  Heart,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SchoolWelcomePage() {
  const { user, isAuthenticated, isLoading: isAuthLoading, schools } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }

    if (isAuthenticated && user) {
      const timer = setTimeout(() => {
        setIsConnecting(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (isAuthLoading || isConnecting) {
    return <LoadingScreen />;
  }

  // Smart resolution for prototype nodes
  const resolvedSchool = user?.school || 
    (user?.schoolId ? schools.find(s => s.id === user?.schoolId) : null) || 
    schools[0];

  if (!user || !resolvedSchool) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center space-y-6">
        <div className="p-6 bg-primary/5 rounded-full border-2 border-dashed border-primary/20">
          <Building2 className="w-16 h-16 text-primary/20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tighter">Connection Failed</h1>
          <p className="text-muted-foreground max-w-md mx-auto">We couldn't synchronize your institutional node data. Please re-authenticate.</p>
        </div>
        <Button variant="outline" className="rounded-xl gap-2 font-bold" onClick={() => router.push("/login")}>
          <RefreshCw className="w-4 h-4" /> Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] selection:bg-secondary selection:text-primary flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden">
      <div className="absolute top-0 inset-x-0 h-1/2 bg-primary/5 -z-10" />
      
      <div className="max-w-7xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 py-12">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-200 group">
              <img 
                src={resolvedSchool.banner} 
                alt={resolvedSchool.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent" />

              <div className="absolute bottom-10 left-10 right-10 text-white space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center border-2 border-accent transition-transform hover:rotate-3">
                    <img src={resolvedSchool.logo} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <Badge className="bg-secondary text-primary border-none font-black uppercase text-[9px] px-3 h-6 mb-1">
                      Node: {resolvedSchool.id}
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black leading-none tracking-tighter uppercase">
                      {resolvedSchool.name}
                    </h1>
                  </div>
                </div>
                <p className="text-xl md:text-2xl italic opacity-90 font-serif leading-tight">
                  "{resolvedSchool.motto}"
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
                Run your entire academic life in one place. Your high-availability dashboard is ready for action.
              </p>
            </div>

            <Card className="bg-primary text-white rounded-[2.5rem] shadow-2xl border-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Zap className="w-20 h-20 text-secondary" /></div>
              <CardContent className="p-10 space-y-6 relative z-10">
                <p className="text-base font-medium opacity-80 leading-relaxed">
                  Institutional nodes are synchronized and secured. Enter the dashboard to manage your sequence.
                </p>
                <Button asChild size="lg" className="w-full bg-secondary text-primary hover:bg-secondary/90 font-black uppercase tracking-widest text-xs h-16 rounded-2xl shadow-xl transition-all active:scale-95 gap-3">
                  <Link href="/dashboard">
                    Enter Secure Dashboard <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* DETAILED INSTITUTIONAL CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary/5 border-b p-8">
                <CardTitle className="flex items-center gap-3 text-primary text-xl">
                  <BookOpen className="w-6 h-6 text-secondary" />
                  {t("aboutSchool")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg font-medium">
                  {resolvedSchool.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-accent/30 p-6 rounded-3xl space-y-2">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-secondary" /> Pedagogy Focus
                    </h4>
                    <p className="text-sm text-primary/70 leading-relaxed font-bold">
                      Committed to delivering world-class curriculum with a focus on discipline, technological literacy, and character excellence.
                    </p>
                  </div>
                  <div className="bg-primary/5 p-6 rounded-3xl space-y-2">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <Globe className="w-4 h-4 text-secondary" /> Global Standard
                    </h4>
                    <p className="text-sm text-primary/70 leading-relaxed font-bold">
                      Operating as an official digital node within the ecosystem for enhanced integrity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary/5 border-b p-8">
                <CardTitle className="flex items-center gap-3 text-primary text-xl">
                  <MapPin className="w-6 h-6 text-secondary" />
                  {t("contactInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent rounded-2xl text-primary">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t("address")}</p>
                        <p className="font-bold text-primary">{resolvedSchool.address}</p>
                        <p className="text-xs text-muted-foreground font-medium">{resolvedSchool.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent rounded-2xl text-primary">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t("phone")}</p>
                        <p className="font-bold text-primary">{resolvedSchool.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent rounded-2xl text-primary">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{t("email")}</p>
                        <p className="font-bold text-primary">{resolvedSchool.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent rounded-2xl text-primary">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Official Domain</p>
                        <p className="font-bold text-primary">{(resolvedSchool?.shortName || resolvedSchool?.id || "node").toLowerCase()}.eduignite.cm</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <Card className="border-none shadow-xl bg-primary text-white overflow-hidden rounded-[2.5rem]">
              <CardHeader className="text-center pt-10 pb-2">
                <Avatar className="h-32 w-32 border-4 border-white/20 mx-auto shadow-2xl mb-4">
                  <AvatarImage src={`https://picsum.photos/seed/principal-${resolvedSchool.id}/200/200`} />
                  <AvatarFallback className="bg-secondary text-primary text-4xl font-black">
                    {resolvedSchool.principal?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-black">{resolvedSchool.principal}</CardTitle>
                <CardDescription className="text-secondary font-black uppercase tracking-widest text-[10px] mt-1">
                  {t("proviseur")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-4">
                  <Quote className="w-8 h-8 text-secondary/20 mx-auto -mb-2" />
                  <p className="text-sm leading-relaxed italic text-white/80 font-medium">
                    "Leading this institution toward pedagogical excellence and digital transformation is my primary mission. We shape the leaders of tomorrow."
                  </p>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-center">
                   <Badge className="bg-secondary text-primary border-none font-black px-4 py-1">ADMINISTRATIVE HEAD</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2.5rem] p-8 text-center space-y-6 border border-white">
               <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-1.5 h-4 mb-2">
                    <div className="w-3 h-full bg-[#007a5e] rounded-sm" />
                    <div className="w-3 h-full bg-[#ce1126] rounded-sm flex items-center justify-center"><div className="w-1 h-1 bg-yellow-400 rounded-full" /></div>
                    <div className="w-3 h-full bg-[#fcd116] rounded-sm" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter leading-none">Republic of Cameroon</p>
                     <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter leading-none">Min. of Secondary Education</p>
                  </div>
               </div>
               <div className="h-px bg-accent w-1/2 mx-auto" />
               <div className="space-y-2">
                  <h4 className="text-xs font-black text-primary uppercase">Institutional Credibility</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This school is a registered public pedagogical entity, recognized by the Ministry of Secondary Education and verified on the EduIgnite platform.
                  </p>
               </div>
               <div className="bg-accent/30 p-4 rounded-2xl flex items-center justify-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Digital License Active</span>
               </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between opacity-40">
           <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">Regional Cluster Littoral</span>
           </div>
           <p className="text-[8px] font-black uppercase tracking-widest">Powered by EduIgnite SaaS Node v2.4.0</p>
        </div>
      </div>
    </div>
  );
}