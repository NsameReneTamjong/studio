
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  ShieldCheck
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

type AuthMode = "login" | "activate";

const QUICK_DEMO_ACCOUNTS = [
  { label: "CEO", matricule: "EDUI26CEO001", icon: Crown, color: "bg-primary text-secondary" },
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
  const { setLanguage, language } = useI18n();
  const { toast } = useToast();
  
  const [mode, setAuthMode] = useState<AuthMode>("login");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [authData, setAuthData] = useState({
    matricule: "",
    password: "",
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
    try {
      await login(authData.matricule);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      {/* Language Switcher */}
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

      <div className="w-full max-w-md flex flex-col items-center gap-8 relative z-10">
        {/* Branding Stack */}
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

        {/* Auth Card */}
        <Card className="w-full border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white">
          <CardHeader className="pb-8 text-center space-y-1">
            <CardTitle className="text-3xl font-black text-primary">
              {mode === "login" ? "Sign In" : "Activate"}
            </CardTitle>
            <CardDescription>
              {mode === "login" ? "Enter your unique institutional matricule." : "Initialize your secure dashboard account."}
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
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-black uppercase text-center text-lg"
                  value={authData.matricule}
                  onChange={(e) => setAuthData({...authData, matricule: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
                  <Lock className="w-3 h-3"/> Password
                </Label>
                <Input 
                  required
                  type="password" 
                  className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary font-bold text-center"
                  value={authData.password}
                  onChange={(e) => setAuthData({...authData, password: e.target.value})}
                />
              </div>

              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 text-base font-black uppercase tracking-widest shadow-xl rounded-2xl bg-primary hover:bg-primary/90 mt-4 transition-all active:scale-95"
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

        {/* Quick Demo Access */}
        <div className="w-full space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-primary/10" />
            <h3 className="text-[10px] font-black uppercase text-primary/40 tracking-[0.3em]">Quick Prototype Entry</h3>
            <div className="h-px flex-1 bg-primary/10" />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {QUICK_DEMO_ACCOUNTS.map((account) => (
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

        {/* SOCIAL PROOF FOOTER */}
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
