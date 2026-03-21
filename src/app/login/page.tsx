
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
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LoginPage() {
  const { login } = useAuth();
  const { t, setLanguage, language } = useI18n();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [isCreateAccount, setIsCreateAccount] = useState(false);

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
          <h1 className="text-3xl font-bold text-primary font-headline">EduNexus</h1>
          <p className="text-muted-foreground">SaaS Institutional Portal</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {isCreateAccount ? t("createAccount") : t("login")}
            </CardTitle>
            <CardDescription className="text-center">
              {isCreateAccount ? t("selectRole") : t("selectRole")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={role === "STUDENT" ? "default" : "outline"} 
                className="flex flex-col h-auto py-2 gap-1 text-[9px]"
                onClick={() => setRole("STUDENT")}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{language === "en" ? "Student" : "Élève"}</span>
              </Button>
              <Button 
                variant={role === "TEACHER" ? "default" : "outline"} 
                className="flex flex-col h-auto py-2 gap-1 text-[9px]"
                onClick={() => setRole("TEACHER")}
              >
                <Presentation className="w-4 h-4" />
                <span>{language === "en" ? "Teacher" : "Enseignant"}</span>
              </Button>
              <Button 
                variant={role === "PARENT" ? "default" : "outline"} 
                className="flex flex-col h-auto py-2 gap-1 text-[9px]"
                onClick={() => setRole("PARENT")}
              >
                <UserCircle className="w-4 h-4" />
                <span>Parent</span>
              </Button>
              <Button 
                variant={role === "SCHOOL_ADMIN" ? "default" : "outline"} 
                className="flex flex-col h-auto py-2 gap-1 text-[9px]"
                onClick={() => setRole("SCHOOL_ADMIN")}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </Button>
              <Button 
                variant={role === "SUPER_ADMIN" ? "default" : "outline"} 
                className="flex flex-col h-auto py-2 gap-1 text-[9px]"
                onClick={() => setRole("SUPER_ADMIN")}
              >
                <Briefcase className="w-4 h-4" />
                <span>Super</span>
              </Button>
            </div>

            <div className="space-y-4">
              {isCreateAccount ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="matricule">{t("matricule")}</Label>
                    <Input id="matricule" placeholder="e.g. S001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input id="password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input id="email" type="email" placeholder="name@domain.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input id="password" type="password" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 text-base font-semibold shadow-lg" onClick={() => login(role)}>
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
