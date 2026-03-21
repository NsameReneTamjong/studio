
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Camera, Lock, Save, Loader2, Mail } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleUpdateProfile = () => {
    if (!name || !email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name and email are required.",
      });
      return;
    }

    setLoading(true);
    // Simulated update delay
    setTimeout(() => {
      updateUser({ name, email });
      setLoading(false);
      toast({
        title: t("changesSaved"),
        description: t("profileUpdateSuccess"),
      });
    }, 1200);
  };

  const handleUpdatePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match.",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswords({ current: "", new: "", confirm: "" });
      toast({
        title: t("changesSaved"),
        description: language === 'en' ? "Password updated successfully." : "Le mot de passe a été mis à jour.",
      });
    }, 1200);
  };

  const handleChangePhoto = () => {
    toast({
      title: language === 'en' ? "Coming Soon" : "Bientôt disponible",
      description: language === 'en' ? "Image upload will be available in the next update." : "Le téléchargement d'images sera disponible dans la prochaine mise à jour.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">{t("profile")}</h1>
        <p className="text-muted-foreground mt-1">{t("editProfile")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 border-none shadow-sm h-fit">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{language === 'en' ? "Photo" : "Photo de profil"}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary/5 text-primary text-4xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleChangePhoto}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-xs text-muted-foreground uppercase font-black tracking-tighter opacity-50">{user?.role}</p>
              <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={handleChangePhoto}>
              <Camera className="w-3.5 h-3.5" />
              {language === 'en' ? "Change Photo" : "Changer la Photo"}
            </Button>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User className="w-5 h-5 text-primary" />
                {t("personalInfo")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="bg-accent/30 border-none focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3 h-3" /> {t("email")}
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-accent/30 border-none focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-accent/5 pt-6">
              <Button onClick={handleUpdateProfile} disabled={loading} className="gap-2 ml-auto">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t("updateProfile")}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Lock className="w-5 h-5 text-primary" />
                {t("changePassword")}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? "Ensure your account is using a long, random password to stay secure." : "Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester en sécurité."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">{t("currentPassword")}</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                  className="bg-accent/30 border-none focus-visible:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t("newPassword")}</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="bg-accent/30 border-none focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t("confirmNewPassword")}</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="bg-accent/30 border-none focus-visible:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-accent/5 pt-6">
              <Button onClick={handleUpdatePassword} disabled={loading || !passwords.new} className="gap-2 ml-auto">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {t("changePassword")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
