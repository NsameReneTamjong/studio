
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
  Building2, 
  UserCircle, 
  Languages,
  Loader2,
  Lock,
  Play,
  Quote,
  Star,
  MessageSquare,
  Video,
  User,
  Fingerprint
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
    matricule: "",
    password: "",
    role: "STUDENT" as UserRole,
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (isRegistering) {
        if (!authData.name) {
          toast({ variant: "destructive", title: "Missing Name", description: "Full name is required." });
          return;
        }
        // For self-registration, we default to a test school or specific platform role
        await register(authData.name, authData.password, authData.role);
        toast({ title: "Welcome to EduIgnite", description: "Your Matricule has been generated. Redirecting..." });
      } else {
        if (!authData.matricule) {
          toast({ variant: "destructive", title: "Missing Matricule", description: "Please enter your ID to sign in." });
          return;
        }
        await login(authData.matricule, authData.password);
        toast({ title: "Welcome back", description: "Successfully signed in." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid Matricule or Password. Please contact your administration if the issue persists."
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
              {isRegistering ? "Join Platform" : "Access Portal"}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Generate your institutional identity." 
                : "Sign in with your Unique Matricule ID."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-5">
              {isRegistering ? (
                <>
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
                  <div className="space-y-2 animate-in fade-in duration-500">
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
                        <SelectItem value="SCHOOL_ADMIN">New School Admin</SelectItem>
                        <SelectItem value="SUPER_ADMIN">Platform Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <Fingerprint className="w-3 h-3"/> Matricule ID
                  </Label>
                  <Input 
                    required
                    placeholder="e.g. GBHS126S0001" 
                    className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-black uppercase"
                    value={authData.matricule}
                    onChange={(e) => setAuthData({...authData, matricule: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3"/> Security Password
                </Label>
                <Input 
                  required
                  type="password" 
                  placeholder="••••••••"
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                />
              </div>

              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl transition-all active:scale-95 bg-primary hover:bg-primary/90 mt-4"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? "Register & Generate ID" : "Sign In to Portal")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "Already have an ID? Login" : "New to the platform? Join Now"}
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
                {/* Media and Testimonials dynamically loaded */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b border-primary/10 pb-2">
                    <Video className="w-4 h-4" /> Featured Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredVideos.map((video) => (
                      <div key={video.id} className="group space-y-3">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative cursor-pointer">
                          <a href={`https://youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                          </a>
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary text-sm">{video.title}</h4>
                          <p className="text-xs text-muted-foreground">{video.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
