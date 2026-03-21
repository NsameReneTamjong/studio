
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Save, Loader2, Image as ImageIcon, MapPin, Quote, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SchoolSettingsPage() {
  const { user, updateSchool } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.school?.name || "",
    motto: user?.school?.motto || "",
    description: user?.school?.description || "",
    location: user?.school?.location || "",
    logo: user?.school?.logo || "",
    banner: user?.school?.banner || "",
  });

  const handleUpdateSettings = () => {
    if (!formData.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "School name is required.",
      });
      return;
    }

    setLoading(true);
    // Simulated update delay
    setTimeout(() => {
      updateSchool(formData);
      setLoading(false);
      toast({
        title: t("changesSaved"),
        description: language === 'en' 
          ? "Institutional settings updated successfully. Refresh to see changes on the welcome page." 
          : "Les paramètres institutionnels ont été mis à jour avec succès. Actualisez pour voir les changements sur la page d'accueil.",
      });
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
          <div className="p-2 bg-primary rounded-xl shadow-lg">
            <Building2 className="w-6 h-6 text-secondary" />
          </div>
          {t("settings")}
        </h1>
        <p className="text-muted-foreground mt-1">
          {language === 'en' 
            ? "Customize your institutional branding and portal appearance." 
            : "Personnalisez votre image de marque institutionnelle et l'apparence du portail."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="w-5 h-5" />
                {language === 'en' ? "General Information" : "Informations Générales"}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? "Public details shown on the welcome page and official forms." : "Détails publics affichés sur la page d'accueil et les formulaires officiels."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground">School Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-accent/30 border-none h-12 rounded-xl focus-visible:ring-primary font-bold text-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="motto" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Quote className="w-3 h-3" /> Motto / Slogan
                  </Label>
                  <Input 
                    id="motto" 
                    value={formData.motto} 
                    onChange={(e) => setFormData({...formData, motto: e.target.value})}
                    className="bg-accent/30 border-none h-11 rounded-xl focus-visible:ring-primary italic"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Physical Location
                  </Label>
                  <Input 
                    id="location" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="bg-accent/30 border-none h-11 rounded-xl focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Institutional Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-accent/30 border-none min-h-[120px] rounded-xl focus-visible:ring-primary leading-relaxed"
                  placeholder="Tell students and parents about your institution..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Assets Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-primary">
                <ImageIcon className="w-5 h-5" />
                {language === 'en' ? "Visual Branding" : "Identité Visuelle"}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? "Manage your school logo and landing page imagery." : "Gérez le logo de votre école et les images de la page d'accueil."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Institutional Logo</Label>
                  <div className="flex flex-col items-center gap-4 p-6 bg-accent/20 rounded-2xl border-2 border-dashed border-accent">
                    <div className="w-24 h-24 bg-white rounded-2xl shadow-xl p-4 flex items-center justify-center border border-accent">
                      <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-full space-y-2">
                      <Label htmlFor="logo-url" className="text-[10px]">Logo Image URL</Label>
                      <Input 
                        id="logo-url"
                        value={formData.logo} 
                        onChange={(e) => setFormData({...formData, logo: e.target.value})}
                        className="bg-white border-accent h-9 text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Landing Banner</Label>
                  <div className="flex flex-col items-center gap-4 p-6 bg-accent/20 rounded-2xl border-2 border-dashed border-accent">
                    <div className="w-full aspect-video bg-white rounded-xl shadow-lg overflow-hidden border border-accent">
                      <img src={formData.banner} alt="Banner Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full space-y-2">
                      <Label htmlFor="banner-url" className="text-[10px]">Banner Image URL</Label>
                      <Input 
                        id="banner-url"
                        value={formData.banner} 
                        onChange={(e) => setFormData({...formData, banner: e.target.value})}
                        className="bg-white border-accent h-9 text-xs"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t p-6 flex justify-between items-center">
               <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest italic">
                 <Globe className="w-3.5 h-3.5" /> Changes affect the entire SaaS instance
               </div>
               <Button onClick={handleUpdateSettings} disabled={loading} className="gap-2 px-8 h-12 shadow-lg font-black uppercase tracking-widest text-xs">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {t("save")} Institutional Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Quote className="w-32 h-32 rotate-12" />
            </div>
            <CardHeader>
              <CardTitle className="text-white text-lg">Live Preview Insight</CardTitle>
              <CardDescription className="text-white/60">How your school appears to others.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Display Name</p>
                  <p className="font-bold text-secondary truncate">{formData.name || "School Name"}</p>
                </div>
                <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Signature Motto</p>
                  <p className="italic text-sm line-clamp-2">"{formData.motto || "No motto set"}"</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10 space-y-2">
                <p className="text-[9px] uppercase font-bold tracking-widest opacity-40">System-wide Impact</p>
                <ul className="text-[10px] space-y-1.5 opacity-70">
                  <li className="flex items-center gap-2">• Updated on the Welcome Page</li>
                  <li className="flex items-center gap-2">• Reflected on Student ID Cards</li>
                  <li className="flex items-center gap-2">• Used in Official Report Cards</li>
                  <li className="flex items-center gap-2">• Displays in the Platform Search</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Support & Help</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Need to change your school domain or primary administrator? These actions require SaaS level clearance.
              </p>
              <Button variant="outline" className="w-full text-xs font-bold uppercase" asChild>
                <a href="/dashboard/feedback">Contact SaaS Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
