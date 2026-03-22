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
  Video
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

type RecoveryStep = 'none' | 'identify' | 'otp' | 'reset';

const MOCK_TESTIMONIALS = [
  {
    id: "T1",
    author: "Dr. Fonka Maurice",
    role: "Principal, Lycée de Joss",
    avatar: "https://picsum.photos/seed/admin1/100/100",
    content: "EduIgnite has transformed how we manage Sequence marks. The automated bulletins are a game changer for our administration.",
    date: "2 weeks ago"
  },
  {
    id: "T2",
    author: "Mme. Ngono Celine",
    role: "Vice Principal, GBHS Yaoundé",
    avatar: "https://picsum.photos/seed/admin2/100/100",
    content: "The transparency in fee collection has increased our revenue recovery by 25%. A must-have for every serious institution.",
    date: "1 month ago"
  }
];

const FEATURED_VIDEOS = [
  {
    id: "v1",
    title: "Platform Overview",
    description: "A comprehensive tour of the platform ecosystem and its impact on digital transformation in schools.",
    thumbnail: "https://picsum.photos/seed/edu-video-1/800/450",
    category: "Intro"
  },
  {
    id: "v2",
    title: "Financial Governance",
    description: "Exploring how our automated ledger system ensures 100% financial transparency and fee recovery.",
    thumbnail: "https://picsum.photos/seed/edu-video-2/800/450",
    category: "Finance"
  }
];

export default function LoginPage() {
  const { login, platformSettings } = useAuth();
  const { t, setLanguage, language } = useI18n();
  const { toast } = useToast();
  
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [schoolId, setSchoolId] = useState("S001");
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  
  // Recovery Flow State
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recoveryData, setRecoveryData] = useState({
    matricule: "",
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleStartRecovery = () => {
    if (!recoveryData.matricule || !recoveryData.email) {
      toast({ variant: "destructive", title: "Incomplete Fields", description: "Please enter your matricule and email." });
      return;
    }
    
    setIsProcessing(true);
    // Mock sending OTP
    setTimeout(() => {
      setIsProcessing(false);
      setRecoveryStep('otp');
      toast({ title: "OTP Sent", description: t("otpSent") });
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (recoveryData.otp.length < 4) {
      toast({ variant: "destructive", title: "Invalid Code", description: "Please enter the 6-digit verification code." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setRecoveryStep('reset');
    }, 1000);
  };

  const handleResetPassword = () => {
    if (recoveryData.newPassword !== recoveryData.confirmPassword) {
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setRecoveryStep('none');
      setRecoveryData({ matricule: "", email: "", otp: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Success", description: language === 'en' ? "Password updated. You can now login." : "Mot de passe mis à jour. Vous pouvez maintenant vous connecter." });
    }, 1500);
  };

  const isRecovering = recoveryStep !== 'none';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-8 relative">
      <div className="absolute top-8 right-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
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

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary p-3 rounded-2xl shadow-lg w-16 h-16 flex items-center justify-center overflow-hidden">
              {platformSettings.logo ? (
                <img src={platformSettings.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline tracking-tighter">
            {platformSettings.name}
          </h1>
          <p className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">SaaS Institutional Portal</p>
        </div>

        <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem]">
          <CardHeader className="pb-8">
            <div className="flex flex-col items-center gap-2">
              {isRecovering && (
                <div className="flex items-center gap-2 mb-4 bg-accent/50 p-1 rounded-full px-4">
                  <div className={cn("w-2 h-2 rounded-full", recoveryStep === 'identify' ? "bg-primary" : "bg-primary/20")} />
                  <div className={cn("w-2 h-2 rounded-full", recoveryStep === 'otp' ? "bg-primary" : "bg-primary/20")} />
                  <div className={cn("w-2 h-2 rounded-full", recoveryStep === 'reset' ? "bg-primary" : "bg-primary/20")} />
                </div>
              )}
              <CardTitle className="text-2xl font-black text-center text-primary">
                {isRecovering 
                  ? (recoveryStep === 'reset' ? t("changePassword") : t("forgotPassword"))
                  : isCreateAccount ? t("createAccount") : t("login")
                }
              </CardTitle>
              <CardDescription className="text-center text-sm">
                {isRecovering 
                  ? (recoveryStep === 'otp' ? t("enterOtp") : recoveryStep === 'reset' ? t("confirmNewPassword") : t("personalInfo"))
                  : language === 'en' ? 'Access your institutional space' : 'Accédez à votre espace institutionnel'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isRecovering && (
              <>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{language === 'en' ? 'Select School' : 'Sélectionner l\'école'}</Label>
                  <Select value={schoolId} onValueChange={setSchoolId}>
                    <SelectTrigger className="bg-accent/30 border-none h-12 rounded-xl focus:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S001">Lycée de Joss (Douala)</SelectItem>
                      <SelectItem value="S002">GBHS Yaoundé (Yaoundé)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { r: "STUDENT", icon: GraduationCap, label: language === "en" ? "Student" : "Élève" },
                    { r: "TEACHER", icon: Presentation, label: language === "en" ? "Teacher" : "Enseignant" },
                    { r: "PARENT", icon: UserCircle, label: "Parent" },
                    { r: "BURSAR", icon: Coins, label: t("bursar") },
                    { r: "LIBRARIAN", icon: Library, label: t("librarian") },
                    { r: "SCHOOL_ADMIN", icon: ShieldCheck, label: "Admin" },
                    { r: "SUPER_ADMIN", icon: Briefcase, label: "Super" },
                  ].map((item) => (
                    <Button 
                      key={item.r}
                      variant={role === item.r ? "default" : "outline"} 
                      className={cn(
                        "flex flex-col h-auto py-3 gap-1 rounded-xl transition-all",
                        role === item.r ? "shadow-lg scale-105" : "hover:bg-accent border-accent"
                      )}
                      onClick={() => setRole(item.r as UserRole)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-[8px] font-black uppercase truncate w-full">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </>
            )}

            <div className="space-y-4">
              {/* STEP 1: Identification OR Login */}
              {(recoveryStep === 'identify' || !isRecovering) && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-2">
                    <Label htmlFor="matricule" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("matricule")}</Label>
                    <Input 
                      id="matricule" 
                      placeholder={role === "SUPER_ADMIN" ? "Admin ID" : "e.g. S001"} 
                      className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary"
                      value={recoveryData.matricule}
                      onChange={(e) => setRecoveryData({...recoveryData, matricule: e.target.value})}
                    />
                  </div>
                  
                  {!isRecovering ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("password")}</Label>
                        {!isCreateAccount && (
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-[10px] font-bold text-primary"
                            onClick={() => setRecoveryStep('identify')}
                          >
                            {t("forgotPassword")}
                          </Button>
                        )}
                      </div>
                      <Input id="password" type="password" className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary" />
                    </div>
                  ) : (
                    <div className="space-y-2 animate-in fade-in">
                      <Label htmlFor="email" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("email")}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="institutional@school.cm" 
                        className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary"
                        value={recoveryData.email}
                        onChange={(e) => setRecoveryData({...recoveryData, email: e.target.value})}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: OTP Verification */}
              {recoveryStep === 'otp' && (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <p className="text-xs font-medium text-primary leading-tight">{t("otpSent")}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("enterOtp")}</Label>
                    <Input 
                      placeholder="XXXXXX" 
                      className="h-14 bg-accent/30 border-none rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus-visible:ring-primary" 
                      maxLength={6}
                      value={recoveryData.otp}
                      onChange={(e) => setRecoveryData({...recoveryData, otp: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Password Reset */}
              {recoveryStep === 'reset' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("newPassword")}</Label>
                    <Input 
                      type="password" 
                      className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary"
                      value={recoveryData.newPassword}
                      onChange={(e) => setRecoveryData({...recoveryData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("confirmNewPassword")}</Label>
                    <Input 
                      type="password" 
                      className="h-12 bg-accent/30 border-none rounded-xl focus-visible:ring-primary"
                      value={recoveryData.confirmPassword}
                      onChange={(e) => setRecoveryData({...recoveryData, confirmPassword: e.target.value})}
                    />
                  </div>
                </div>
              )}

              {!isRecovering && isCreateAccount && (
                <div className="space-y-2 animate-in fade-in">
                  <Label htmlFor="confirm-password" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{t("confirmPassword")}</Label>
                  <Input id="confirm-password" type="password" className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pb-8">
            {isRecovering ? (
              <div className="w-full space-y-3">
                {recoveryStep === 'identify' && (
                  <Button className="w-full h-14 text-base font-bold shadow-xl rounded-2xl gap-2" onClick={handleStartRecovery} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
                    {language === 'en' ? 'Send Code' : 'Envoyer le Code'}
                  </Button>
                )}
                {recoveryStep === 'otp' && (
                  <Button className="w-full h-14 text-base font-bold shadow-xl rounded-2xl gap-2" onClick={handleVerifyOtp} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {t("verifyOtp")}
                  </Button>
                )}
                {recoveryStep === 'reset' && (
                  <Button className="w-full h-14 text-base font-bold shadow-xl rounded-2xl gap-2" onClick={handleResetPassword} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                    {t("updatePassword")}
                  </Button>
                )}
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:bg-accent rounded-xl" onClick={() => setRecoveryStep('none')} disabled={isProcessing}>
                  <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  className="w-full h-14 text-base font-bold shadow-xl rounded-2xl transition-transform active:scale-95" 
                  onClick={() => login(role, schoolId)}
                >
                  {isCreateAccount ? t("register") : t("signIn")}
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm font-bold text-primary"
                    onClick={() => setIsCreateAccount(!isCreateAccount)}
                  >
                    {isCreateAccount ? t("alreadyHaveAccount") : t("dontHaveAccount")}
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>

        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-xs font-bold text-primary/60 hover:text-primary gap-2">
                <MessageSquare className="w-4 h-4" />
                {t("whatPeopleSay")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
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
              <div className="p-8 space-y-10 max-h-[75vh] overflow-y-auto">
                
                {/* Featured Video Gallery */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                    <Video className="w-4 h-4" /> Featured Media
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURED_VIDEOS.map((video) => (
                      <div key={video.id} className="group space-y-3">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg relative cursor-pointer">
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                          </div>
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-40" />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full z-10">
                            <p className="text-[8px] text-white font-black uppercase tracking-widest">{video.category}</p>
                          </div>
                        </div>
                        <div className="px-1">
                          <h4 className="font-bold text-primary text-sm mb-1">{video.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials List */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                    <Quote className="w-4 h-4" /> Institutional Feedback
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {MOCK_TESTIMONIALS.map((test) => (
                      <Card key={test.id} className="border-none shadow-sm bg-accent/30 relative">
                        <div className="absolute -top-3 -left-3 p-2 bg-white rounded-xl shadow-sm border border-accent">
                          <Quote className="w-4 h-4 text-primary" />
                        </div>
                        <CardContent className="p-6 pt-8 space-y-4">
                          <p className="text-muted-foreground leading-relaxed italic">
                            "{test.content}"
                          </p>
                          <div className="flex items-center justify-between pt-4 border-t border-accent">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={test.avatar} />
                                <AvatarFallback>{test.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-black text-primary leading-none">{test.author}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">{test.role}</p>
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
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
