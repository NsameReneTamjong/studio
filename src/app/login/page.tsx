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
  Smartphone,
  Crown,
  GraduationCap,
  Users,
  Wallet,
  Library,
  Heart
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

const QUICK_DEMO_ACCOUNTS = [
  { label: "Super Admin (CEO)", matricule: "EDUI26CEO001", icon: Crown, color: "bg-primary text-secondary" },
  { label: "School Admin", matricule: "GBHS26", icon: Building2, color: "bg-blue-600 text-white" },
  { label: "Teacher", matricule: "GBHS26T001", icon: Users, color: "bg-purple-600 text-white" },
  { label: "Student", matricule: "GBHS26S001", icon: GraduationCap, color: "bg-emerald-600 text-white" },
  { label: "Bursar", matricule: "GBHS26B001", icon: Wallet, color: "bg-amber-600 text-white" },
  { label: "Librarian", matricule: "GBHS26L001", icon: Library, color: "bg-indigo-600 text-white" },
  { label: "Parent", matricule: "GBHS26P001", icon: Heart, color: "bg-rose-600 text-white" },
];

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
    email: "",
    otp: "",
  });

  const handleQuickLogin = async (matricule: string) => {
    setIsProcessing(true);
    try {
      await login(matricule, "password");
      toast({ title: "Welcome back", description: "Demo session initialized." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      if (mode === "activate") {
        if (authData.password !== authData.confirmPassword) {
          toast({ variant: "destructive", title: "Passwords Mismatch" });
          return;
        }
        await activateAccount(authData.matricule, authData.password);
      } else {
        await login(authData.matricule, authData.password);
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
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

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="bg-primary p-3 rounded-2xl shadow-xl w-20 h-20 flex items-center justify-center overflow-hidden border-4 border-white">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-black text-primary font-headline tracking-tighter">
              {platformSettings.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
              The next generation of institutional management for African schools.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-[0.3em]">Quick Demo Access</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {QUICK_DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.matricule}
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2 rounded-2xl border-primary/5 bg-white/50 hover:bg-white hover:border-primary/20 transition-all group"
                  onClick={() => handleQuickLogin(account.matricule)}
                  disabled={isProcessing}
                >
                  <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", account.color)}>
                    <account.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tight text-primary/60">{account.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white">
          <CardHeader className="pb-8 text-center space-y-1">
            <CardTitle className="text-3xl font-black text-primary">
              {mode === "login" ? "Access Portal" : mode === "activate" ? "Activate Account" : "Recover Access"}
            </CardTitle>
            <CardDescription>
              Sign in with your Unique Matricule ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                  <Fingerprint className="w-3 h-3"/> Matricule / ID
                </Label>
                <Input 
                  required
                  placeholder="e.g. GBHS26S001" 
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-black uppercase"
                  value={authData.matricule}
                  onChange={(e) => setAuthData({...authData, matricule: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3"/> {mode === "activate" ? "New Security Password" : "Password"}
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
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3"/> Confirm Password
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

              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl bg-primary hover:bg-primary/90 mt-4"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === "login" ? "Sign In" : "Activate")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-2">
            <Button 
              variant="ghost" 
              className="w-full text-sm font-bold text-primary hover:bg-primary/5 rounded-xl h-12"
              onClick={() => setAuthMode(mode === "login" ? "activate" : "login")}
            >
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
