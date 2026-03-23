
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
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
  Fingerprint,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  Smartphone
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "activate" | "forgot";
type ForgotStep = "identify" | "confirmation" | "otp" | "reset";

export default function LoginPage() {
  const { login, activateAccount, platformSettings, testimonials, featuredVideos } = useAuth();
  const { t, setLanguage, language } = useI18n();
  const { toast } = useToast();
  
  const [mode, setAuthMode] = useState<AuthMode>("login");
  const [forgotStep, setForgotStep] = useState<ForgotStep>("identify");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form State
  const [authData, setAuthData] = useState({
    matricule: "",
    password: "",
    confirmPassword: "",
    email: "", // Used for identification in recovery
    otp: "",
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (mode === "activate") {
        if (authData.password !== authData.confirmPassword) {
          toast({ variant: "destructive", title: "Passwords Mismatch", description: "Please ensure both passwords match." });
          return;
        }
        await activateAccount(authData.matricule, authData.password);
        toast({ title: "Account Activated", description: "Redirecting to your dashboard..." });
      } else {
        await login(authData.matricule, authData.password);
        toast({ title: "Welcome back", description: "Successfully signed in." });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials. Check your Matricule or Password."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulating the 4-step recovery logic
    setTimeout(() => {
      setIsProcessing(false);
      if (forgotStep === "identify") {
        setForgotStep("confirmation");
      } else if (forgotStep === "confirmation") {
        setForgotStep("otp");
        toast({ title: t("otpSent") });
      } else if (forgotStep === "otp") {
        if (authData.otp === "123456") { // Demo OTP
          setForgotStep("reset");
        } else {
          toast({ variant: "destructive", title: "Invalid Code", description: "Please enter 123456 for this demo." });
        }
      } else if (forgotStep === "reset") {
        if (authData.password === authData.confirmPassword) {
          toast({ title: "Password Reset", description: "Your new password is now active. Please login." });
          setAuthMode("login");
          setForgotStep("identify");
        } else {
          toast({ variant: "destructive", title: "Passwords Mismatch" });
        }
      }
    }, 1000);
  };

  const renderForgotFlow = () => {
    switch (forgotStep) {
      case "identify":
        return (
          <form onSubmit={handleForgotFlow} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                <Fingerprint className="w-3 h-3"/> {t("matricule")}
              </Label>
              <Input required className="h-12 bg-accent/30 border-none rounded-xl font-black uppercase" value={authData.matricule} onChange={(e) => setAuthData({...authData, matricule: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3"/> Registered Email
              </Label>
              <Input required type="email" className="h-12 bg-accent/30 border-none rounded-xl" value={authData.email} onChange={(e) => setAuthData({...authData, email: e.target.value})} />
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full h-14 font-black uppercase tracking-widest bg-primary rounded-2xl">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
            </Button>
          </form>
        );
      case "confirmation":
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto border-2 border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Identity Confirmed</h3>
              <p className="text-sm text-muted-foreground">We found your record. We will send a verification code to your registered email.</p>
            </div>
            <Button onClick={handleForgotFlow} disabled={isProcessing} className="w-full h-14 font-black uppercase tracking-widest bg-primary rounded-2xl">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP Code"}
            </Button>
          </div>
        );
      case "otp":
        return (
          <form onSubmit={handleForgotFlow} className="space-y-5">
            <div className="space-y-2 text-center">
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Enter 6-Digit Code</Label>
              <Input required maxLength={6} placeholder="000000" className="h-16 text-center text-3xl font-black tracking-[0.5em] bg-accent/30 border-none rounded-xl" value={authData.otp} onChange={(e) => setAuthData({...authData, otp: e.target.value})} />
              <p className="text-[10px] text-muted-foreground mt-2">Check your email for the recovery code.</p>
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full h-14 font-black uppercase tracking-widest bg-primary rounded-2xl">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
            </Button>
          </form>
        );
      case "reset":
        return (
          <form onSubmit={handleForgotFlow} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">New Password</Label>
              <Input required type="password" placeholder="••••••••" className="h-12 bg-accent/30 border-none rounded-xl font-bold" value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Confirm New Password</Label>
              <Input required type="password" placeholder="••••••••" className="h-12 bg-accent/30 border-none rounded-xl font-bold" value={authData.confirmPassword} onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})} />
            </div>
            <Button type="submit" disabled={isProcessing} className="w-full h-14 font-black uppercase tracking-widest bg-primary rounded-2xl">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset & Login"}
            </Button>
          </form>
        );
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
            <div className="flex items-center gap-2 justify-center mb-2">
              {mode !== "login" && (
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => { setAuthMode("login"); setForgotStep("identify"); }}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="text-3xl font-black text-primary">
                {mode === "login" ? "Access Portal" : mode === "activate" ? t("createAccount") : "Recover Access"}
              </CardTitle>
            </div>
            <CardDescription>
              {mode === "login" ? "Sign in with your Unique Matricule ID." : mode === "activate" ? "Activate your pre-assigned institutional identity." : `Step ${["identify", "confirmation", "otp", "reset"].indexOf(forgotStep) + 1} of 4`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "forgot" ? (
              renderForgotFlow()
            ) : (
              <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <Fingerprint className="w-3 h-3"/> {t("matricule")}
                  </Label>
                  <Input 
                    required
                    placeholder="e.g. GBHS126S0001" 
                    className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-black uppercase"
                    value={authData.matricule}
                    onChange={(e) => setAuthData({...authData, matricule: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3"/> {mode === "activate" ? "New Security Password" : t("password")}
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

                {mode === "activate" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                      <Lock className="w-3 h-3"/> {t("confirmPassword")}
                    </Label>
                    <Input 
                      required
                      type="password" 
                      placeholder="••••••••"
                      className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                      value={authData.confirmPassword}
                      onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                    />
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex justify-end">
                    <Button variant="link" type="button" className="text-xs font-bold text-primary/60 p-0 h-auto" onClick={() => setAuthMode("forgot")}>
                      {t("forgotPassword")}
                    </Button>
                  </div>
                )}

                <Button 
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl transition-all active:scale-95 bg-primary hover:bg-primary/90 mt-4"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "login" ? "Sign In to Portal" : "Set Password & Activate")}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12"
              onClick={() => {
                setAuthMode(mode === "login" ? "activate" : "login");
                setForgotStep("identify");
              }}
            >
              {mode === "login" ? t("dontHaveAccount") : t("alreadyHaveAccount")}
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

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b border-primary/10 pb-2">
                    <Quote className="w-4 h-4" /> Success Stories
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((test) => (
                      <Card key={test.id} className="border-none shadow-sm bg-accent/30">
                        <CardContent className="p-6 space-y-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white">
                              <AvatarImage src={test.avatar} />
                              <AvatarFallback>{test.author.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-sm text-primary">{test.author}</p>
                              <p className="text-[10px] text-muted-foreground uppercase font-black">{test.schoolName}</p>
                            </div>
                          </div>
                          <p className="text-xs italic leading-relaxed text-muted-foreground">"{test.content}"</p>
                        </CardContent>
                      </Card>
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
