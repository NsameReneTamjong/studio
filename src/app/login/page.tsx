
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Languages,
  Loader2,
  Lock,
  Fingerprint,
  Crown,
  GraduationCap,
  Users,
  Wallet,
  Library,
  Heart,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Monitor,
  Mail,
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";

type AuthMode = "login" | "activate" | "forgot" | "otp" | "reset" | "success";

const BOARD_DEMOS = [
  { label: "CEO", matricule: "EDUI26CEO001", icon: Crown, color: "bg-primary text-secondary" },
  { label: "CTO", matricule: "EDUI26CTO001", icon: Zap, color: "bg-indigo-600 text-white" },
  { label: "COO", matricule: "EDUI26COO001", icon: Monitor, color: "bg-blue-600 text-white" },
  { label: "Investor", matricule: "EDUI26INV001", icon: Heart, color: "bg-rose-600 text-white" },
  { label: "Designer", matricule: "EDUI26DES001", icon: Sparkles, color: "bg-cyan-600 text-white" },
];

const SCHOOL_DEMOS = [
  { label: "Admin", matricule: "GBHS26", icon: Building2, color: "bg-blue-600 text-white" },
  { label: "Sub-Admin", matricule: "GBHS26A001", icon: ShieldCheck, color: "bg-cyan-600 text-white" },
  { label: "Teacher", matricule: "GBHS26T001", icon: Users, color: "bg-purple-600 text-white" },
  { label: "Student", matricule: "GBHS26S001", icon: GraduationCap, color: "bg-emerald-600 text-white" },
  { label: "Bursar", matricule: "GBHS26B001", icon: Wallet, color: "bg-amber-600 text-white" },
  { label: "Librarian", matricule: "GBHS26L001", icon: Library, color: "bg-indigo-600 text-white" },
  { label: "Parent", matricule: "GBHS26P001", icon: Heart, color: "bg-rose-600 text-white" },
];

export default function LoginPage() {
  const { login, platformSettings } = useAuth();
  const { setLanguage, language, t } = useI18n();
  const { toast } = useToast();
  
  const [mode, setAuthMode] = useState<AuthMode>("login");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [authData, setAuthData] = useState({
    matricule: "",
    password: "",
    confirmPassword: "",
    email: "",
    otp: "",
    newPassword: "",
    resetConfirmPassword: ""
  });

  const handleQuickLogin = async (matricule: string) => {
    setIsProcessing(true);
    try {
      await login(matricule);
      toast({ title: "Welcome back", description: "Prototype session initialized." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (mode === "login" || mode === "activate") {
      if (mode === "activate" && authData.password !== authData.confirmPassword) {
        toast({ 
          variant: "destructive", 
          title: "Password Mismatch", 
          description: language === "en" ? "The passwords provided do not match." : "Les mots de passe ne correspondent pas." 
        });
        setIsProcessing(false);
        return;
      }

      try {
        await login(authData.matricule);
      } catch (error: any) {
        toast({ variant: "destructive", title: "Authentication Failed", description: "Invalid matricule for this prototype node." });
      } finally {
        setIsProcessing(false);
      }
    } else if (mode === "forgot") {
      setTimeout(() => {
        setIsProcessing(false);
        setAuthMode("otp");
        toast({ title: t("otpSent"), description: "Check your email for the 6-digit code." });
      }, 1000);
    } else if (mode === "otp") {
      setTimeout(() => {
        setIsProcessing(false);
        setAuthMode("reset");
      }, 800);
    } else if (mode === "reset") {
      if (authData.newPassword !== authData.resetConfirmPassword) {
        toast({ variant: "destructive", title: "Error", description: t("confirmPassword") });
        setIsProcessing(false);
        return;
      }
      setTimeout(() => {
        setIsProcessing(false);
        setAuthMode("success");
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full max-w-lg flex flex-col items-center gap-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-primary p-3 rounded-2xl shadow-xl w-24 h-24 flex items-center justify-center overflow-hidden border-4 border-white transition-transform hover:scale-105">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-black text-primary font-headline tracking-tighter">
            {platformSettings.name}
          </h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-60">
            Institutional Access Portal
          </p>
        </div>

        <Card className="w-full border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white">
          {mode === "success" ? (
            <div className="p-12 text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-black text-primary">Password Reset</CardTitle>
                <CardDescription>Your credentials have been updated. You can now sign in with your new password.</CardDescription>
              </div>
              <Button onClick={() => setAuthMode("login")} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest bg-primary">
                Return to Sign In
              </Button>
            </div>
          ) : (
            <>
              <CardHeader className="pb-8 text-center space-y-1">
                <div className="flex items-center justify-center mb-2">
                  {mode === "login" && <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary">Secure Registry Access</Badge>}
                  {mode === "activate" && <Badge className="bg-secondary text-primary border-none text-[8px] font-black uppercase">Account Initialization</Badge>}
                  {(mode === "forgot" || mode === "otp" || mode === "reset") && <Badge variant="destructive" className="bg-red-50 text-red-600 border-none text-[8px] font-black uppercase">Identity Recovery</Badge>}
                </div>
                <CardTitle className="text-3xl font-black text-primary uppercase tracking-tighter">
                  {mode === "login" ? t("signIn") : mode === "activate" ? t("createAccount") : t("resetPassword")}
                </CardTitle>
                <CardDescription>
                  {mode === "login" ? "Enter your unique institutional matricule." : 
                   mode === "activate" ? "Initialize your secure dashboard account." : 
                   mode === "forgot" ? "Provide your registry details to identify your account." :
                   mode === "otp" ? t("otpSent") : "Choose a secure new password."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuth} className="space-y-5">
                  {(mode === "login" || mode === "activate" || mode === "forgot") && (
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                        <Fingerprint className="w-3 h-3"/> {t("matricule")}
                      </Label>
                      <Input 
                        required
                        className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-black uppercase text-center text-lg"
                        value={authData.matricule}
                        onChange={(e) => setAuthData({...authData, matricule: e.target.value})}
                      />
                    </div>
                  )}

                  {(mode === "login" || mode === "activate") && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                          <Lock className="w-3 h-3"/> {t("password")}
                        </Label>
                        {mode === "login" && (
                          <button 
                            type="button" 
                            className="text-[10px] font-black uppercase text-primary/40 hover:text-primary transition-colors"
                            onClick={() => setAuthMode("forgot")}
                          >
                            {t("forgotPassword")}
                          </button>
                        )}
                      </div>
                      <Input 
                        required
                        type="password" 
                        className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold text-center"
                        value={authData.password}
                        onChange={(e) => setAuthData({...authData, password: e.target.value})}
                      />
                    </div>
                  )}

                  {mode === "activate" && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3"/> {language === "en" ? "Confirm Password" : "Confirmer mot de passe"}
                      </Label>
                      <Input 
                        required
                        type="password" 
                        className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold text-center"
                        value={authData.confirmPassword}
                        onChange={(e) => setAuthData({...authData, confirmPassword: e.target.value})}
                      />
                    </div>
                  )}

                  {mode === "forgot" && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3"/> Verified Corporate Email
                      </Label>
                      <Input 
                        required
                        type="email"
                        className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold"
                        value={authData.email}
                        onChange={(e) => setAuthData({...authData, email: e.target.value})}
                        placeholder="e.g. user@school.edu"
                      />
                    </div>
                  )}

                  {mode === "otp" && (
                    <div className="space-y-4 animate-in zoom-in-95">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center block">6-Digit Verification Code</Label>
                        <Input 
                          required
                          className="h-16 bg-accent/30 border-none rounded-2xl focus-visible:ring-primary font-black text-3xl text-center tracking-[0.5em]"
                          maxLength={6}
                          value={authData.otp}
                          onChange={(e) => setAuthData({...authData, otp: e.target.value})}
                          placeholder="000000"
                        />
                      </div>
                      <p className="text-[10px] text-center text-muted-foreground font-bold">Code expires in 5 minutes.</p>
                    </div>
                  )}

                  {mode === "reset" && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">{t("newPassword")}</Label>
                        <Input 
                          required
                          type="password"
                          className="h-12 bg-accent/30 border-none rounded-xl"
                          value={authData.newPassword}
                          onChange={(e) => setAuthData({...authData, newPassword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1">{t("confirmPassword")}</Label>
                        <Input 
                          required
                          type="password"
                          className="h-12 bg-accent/30 border-none rounded-xl"
                          value={authData.resetConfirmPassword}
                          onChange={(e) => setAuthData({...authData, resetConfirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    disabled={isProcessing}
                    className={cn(
                      "w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl transition-all active:scale-95 mt-4",
                      mode === "login" ? "bg-primary hover:bg-primary/90" : "bg-secondary text-primary hover:bg-secondary/90"
                    )}
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      mode === "login" ? t("signIn") : 
                      mode === "activate" ? "Activate Account" : 
                      mode === "forgot" ? "Identify Account" : 
                      mode === "otp" ? "Verify Identity" : "Update Credentials"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="pb-8 pt-2 flex flex-col gap-2">
                {mode === "login" ? (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12"
                    onClick={() => setAuthMode("activate")}
                  >
                    {t("dontHaveAccount")}
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12 flex items-center gap-2"
                    onClick={() => setAuthMode("login")}
                  >
                    <ArrowLeft className="w-4 h-4" /> {t("alreadyHaveAccount")}
                  </Button>
                )}
              </CardFooter>
            </>
          )}
        </Card>

        {mode === "login" && (
          <div className="w-full space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-primary/10" />
                <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-[0.3em]">Platform Board</h3>
                <div className="h-px flex-1 bg-primary/10" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {BOARD_DEMOS.map((account) => (
                  <Button
                    key={account.matricule}
                    variant="outline"
                    className="h-auto py-3 px-1 flex-col gap-1.5 rounded-xl border-primary/5 bg-white/50 hover:bg-white hover:border-primary/20 transition-all group"
                    onClick={() => handleQuickLogin(account.matricule)}
                    disabled={isProcessing}
                  >
                    <div className={cn("p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-sm", account.color)}>
                      <account.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tight text-primary/60">{account.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-primary/10" />
                <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-[0.3em]">School Registry</h3>
                <div className="h-px flex-1 bg-primary/10" />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SCHOOL_DEMOS.map((account) => (
                  <Button
                    key={account.matricule}
                    variant="outline"
                    className="h-auto py-3 px-1 flex-col gap-1.5 rounded-xl border-primary/5 bg-white/50 hover:bg-white hover:border-primary/20 transition-all group"
                    onClick={() => handleQuickLogin(account.matricule)}
                    disabled={isProcessing}
                  >
                    <div className={cn("p-1.5 rounded-lg group-hover:scale-110 transition-transform shadow-sm", account.color)}>
                      <account.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tight text-primary/60">{account.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-4">
          <Button asChild variant="ghost" className="text-xs font-bold text-primary/60 hover:text-primary gap-2 h-10 px-6 rounded-full bg-primary/5 border border-primary/10">
            <Link href="/community">
              <Sparkles className="w-4 h-4 text-secondary" />
              Visit Community Portal
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
