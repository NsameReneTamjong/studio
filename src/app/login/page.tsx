
"use client";

import { useState } from "react";
import { useAuth, UserRole } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  KeyRound
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const { t, setLanguage, language } = useI18n();
  const { toast } = useToast();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [schoolId, setSchoolId] = useState("S001");
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleRecoverPassword = () => {
    toast({
      title: language === 'en' ? "Recovery Initiated" : "Récupération initiée",
      description: language === 'en' 
        ? "If the matricule and ID match our records, you will receive a reset link." 
        : "Si le matricule et l'ID correspondent, vous recevrez un lien de réinitialisation.",
    });
    setIsForgotPassword(false);
  };

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
            <div className="bg-primary p-3 rounded-2xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary font-headline">EduIgnite</h1>
          <p className="text-muted-foreground">SaaS Institutional Portal</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex flex-col items-center gap-2">
              {isForgotPassword && (
                <div className="p-2 bg-secondary/20 rounded-full mb-2">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
              )}
              <CardTitle className="text-xl text-center">
                {isForgotPassword ? t("forgotPassword") : isCreateAccount ? t("createAccount") : t("login")}
              </CardTitle>
              <CardDescription className="text-center">
                {isForgotPassword 
                  ? (language === 'en' ? 'Verify your identity to reset access' : 'Vérifiez votre identité pour réinitialiser l\'accès')
                  : language === 'en' ? 'Access your institutional space' : 'Accédez à votre espace institutionnel'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isForgotPassword && (
              <>
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Select School' : 'Sélectionner l\'école'}</Label>
                  <Select value={schoolId} onValueChange={setSchoolId}>
                    <SelectTrigger className="bg-accent/30 border-none h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="S001">Lycée de Joss (Douala)</SelectItem>
                      <SelectItem value="S002">GBHS Yaoundé (Yaoundé)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Button 
                    variant={role === "STUDENT" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("STUDENT")}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{language === "en" ? "Student" : "Élève"}</span>
                  </Button>
                  <Button 
                    variant={role === "TEACHER" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("TEACHER")}
                  >
                    <Presentation className="w-4 h-4" />
                    <span>{language === "en" ? "Teacher" : "Enseignant"}</span>
                  </Button>
                  <Button 
                    variant={role === "PARENT" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("PARENT")}
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>Parent</span>
                  </Button>
                  <Button 
                    variant={role === "BURSAR" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("BURSAR")}
                  >
                    <Coins className="w-4 h-4" />
                    <span>{t("bursar")}</span>
                  </Button>
                  <Button 
                    variant={role === "LIBRARIAN" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("LIBRARIAN")}
                  >
                    <Library className="w-4 h-4" />
                    <span>{t("librarian")}</span>
                  </Button>
                  <Button 
                    variant={role === "SCHOOL_ADMIN" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("SCHOOL_ADMIN")}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                  <Button 
                    variant={role === "SUPER_ADMIN" ? "default" : "outline"} 
                    className="flex flex-col h-auto py-2 gap-1 text-[8px]"
                    onClick={() => setRole("SUPER_ADMIN")}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Super</span>
                  </Button>
                </div>
              </>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricule">{t("matricule")}</Label>
                <Input id="matricule" placeholder={role === "SUPER_ADMIN" ? "Admin ID" : "e.g. S001"} className="bg-accent/30 border-none h-11" />
              </div>
              
              {isForgotPassword ? (
                <div className="space-y-2">
                  <Label htmlFor="verification-id">{t("verificationId")}</Label>
                  <Input id="verification-id" placeholder="e.g. ID-12345" className="bg-accent/30 border-none h-11" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("password")}</Label>
                    {!isCreateAccount && (
                      <Button 
                        variant="link" 
                        className="h-auto p-0 text-[10px] text-muted-foreground"
                        onClick={() => setIsForgotPassword(true)}
                      >
                        {t("forgotPassword")}
                      </Button>
                    )}
                  </div>
                  <Input id="password" type="password" className="bg-accent/30 border-none h-11" />
                </div>
              )}

              {!isForgotPassword && isCreateAccount && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
                  <Input id="confirm-password" type="password" className="bg-accent/30 border-none h-11" />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            {isForgotPassword ? (
              <div className="w-full space-y-3">
                <Button className="w-full h-11 text-base font-semibold shadow-lg" onClick={handleRecoverPassword}>
                  {t("resetPassword")}
                </Button>
                <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={() => setIsForgotPassword(false)}>
                  <ArrowLeft className="w-4 h-4" /> {t("backToLogin")}
                </Button>
              </div>
            ) : (
              <>
                <Button className="w-full h-11 text-base font-semibold shadow-lg" onClick={() => login(role, schoolId)}>
                  {isCreateAccount ? t("register") : t("signIn")} ({role.replace('_', ' ').toLowerCase()})
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    className="text-sm text-primary"
                    onClick={() => setIsCreateAccount(!isCreateAccount)}
                  >
                    {isCreateAccount ? t("alreadyHaveAccount") : t("dontHaveAccount")}
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
