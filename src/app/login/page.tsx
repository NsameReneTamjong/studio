
"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  ShieldCheck, 
  GraduationCap, 
  Presentation, 
  Building2, 
  UserCircle, 
  Briefcase,
  Languages,
  Coins,
  Library,
  ArrowLeft,
  KeyRound,
  Mail,
  Loader2,
  CheckCircle2,
  Lock,
  Play,
  Quote,
  Star,
  MessageSquare,
  Video,
  User,
  School
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LoginPage() {
  const { login, register, platformSettings, testimonials, featuredVideos } = useAuth();
  const { t, setLanguage, language } = useI18n();
  const { toast } = useToast();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auth Form State
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT" as UserRole,
    schoolId: "S001"
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authData.email || !authData.password) return;
    
    setIsProcessing(true);
    try {
      if (isRegistering) {
        if (!authData.name) {
          toast({ variant: "destructive", title: "Missing Name", description: "Full name is required for registration." });
          return;
        }
        await register(authData.name, authData.email, authData.password, authData.role, authData.schoolId);
        toast({ title: "Welcome to EduIgnite", description: "Your account has been created successfully." });
      } else {
        await login(authData.email, authData.password);
        toast({ title: "Welcome back", description: "Successfully signed in." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Please check your credentials and try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <div className="absolute top-8 right-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-white/50 backdrop-blur-md border-primary/10 rounded-xl">
              <Languages className="w-4 h-4" />
              {language === "en" ? "English" : "Français"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-2xl shadow-xl w-20 h-20 flex items-center justify-center overflow-hidden border-4 border-white">
              {platformSettings.logo ? (
                <img src={platformSettings.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-4xl font-black text-primary font-headline tracking-tighter">
            {platformSettings.name}
          </h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest opacity-60">SaaS Institutional Portal</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white">
          <CardHeader className="pb-8 text-center space-y-1">
            <CardTitle className="text-3xl font-black text-primary">
              {isRegistering ? "Create Profile" : "Access Portal"}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Join your institution's digital ecosystem." 
                : "Sign in to manage your academic journey."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-5">
              {isRegistering && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <User className="w-3 h-3"/> Full Legal Name
                  </Label>
                  <Input 
                    required
                    placeholder="e.g. John Doe" 
                    className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                    value={authData.name}
                    onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3"/> Institutional Email
                </Label>
                <Input 
                  required
                  type="email"
                  placeholder="name@school.cm" 
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                  value={authData.email}
                  onChange={(e) => setAuthData({...authData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3"/> Security Password
                  </Label>
                </div>
                <Input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                />
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3"/> Your Role
                    </Label>
                    <Select value={authData.role} onValueChange={(v) => setAuthData({...authData, role: v as UserRole})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="BURSAR">Bursar</SelectItem>
                        <SelectItem value="LIBRARIAN">Librarian</SelectItem>
                        <SelectItem value="SCHOOL_ADMIN">School Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                      <School className="w-3 h-3"/> Institution
                    </Label>
                    <Select value={authData.schoolId} onValueChange={(v) => setAuthData({...authData, schoolId: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="S001">Lycée de Joss</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl transition-all active:scale-95 bg-primary hover:bg-primary/90 mt-4"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? "Confirm Registration" : "Sign In to Portal")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an account? Login" : "Don't have an account? Join Now"}
            </Button>
          </CardFooter>
        </Card>

        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-xs font-bold text-primary/60 hover:text-primary gap-2 h-10 px-6 rounded-full bg-white/30 backdrop-blur-sm border border-primary/5">
                <MessageSquare className="w-4 h-4" />
                {t("seeWhatPeopleSay")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <Star className="w-8 h-8 text-secondary fill-secondary/20" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black">{t("testimonials")}</DialogTitle>
                    <DialogDescription className="text-white/60">Discover the impact of the platform across the nation.</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto bg-background">
                
                {/* Video Gallery */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b border-primary/10 pb-2">
                    <Video className="w-4 h-4" /> Featured Media
                  </h3>
                  {featuredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredVideos.map((video) => (
                        <div key={video.id} className="group space-y-3">
                          <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative cursor-pointer">
                            <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center z-10">
                              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                              </div>
                            </a>
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full z-10">
                              <p className="text-[8px] text-white font-black uppercase tracking-widest">{video.category}</p>
                            </div>
                          </div>
                          <div className="px-1">
                            <h4 className="font-bold text-primary text-sm mb-1">{video.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{video.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center py-10 text-muted-foreground italic">No videos featured yet.</p>
                  )}
                </div>

                {/* Testimonials List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b border-primary/10 pb-2">
                    <Quote className="w-4 h-4" /> Institutional Feedback
                  </h3>
                  {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {testimonials.map((test) => (
                        <Card key={test.id} className="border-none shadow-sm bg-accent/30 relative rounded-3xl">
                          <div className="absolute -top-3 -left-3 p-2 bg-white rounded-xl shadow-md border border-accent">
                            <Quote className="w-4 h-4 text-primary" />
                          </div>
                          <CardContent className="p-6 pt-8 space-y-4">
                            <p className="text-muted-foreground leading-relaxed italic text-sm md:text-base">
                              "{test.content}"
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-primary/10">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                  <AvatarImage src={test.avatar} />
                                  <AvatarFallback className="bg-primary text-white font-bold">{test.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-black text-primary leading-none">{test.author}</p>
                                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{test.role}, {test.schoolName}</p>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-center py-10 text-muted-foreground italic">No published testimonials yet.</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
