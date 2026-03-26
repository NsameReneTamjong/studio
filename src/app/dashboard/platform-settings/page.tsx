
"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth, type PlatformFees } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings2, 
  Save, 
  Loader2, 
  Coins, 
  ShieldCheck, 
  Globe, 
  Plus, 
  Trash2, 
  Star,
  X,
  Upload,
  Calendar,
  Layout,
  Users,
  Building2,
  Lock,
  Wallet,
  Smartphone,
  Heart,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlatformSettingsPage() {
  const { platformSettings, updatePlatformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platformName: platformSettings.name,
    platformLogo: platformSettings.logo,
    paymentDeadline: platformSettings.paymentDeadline,
    fees: { ...platformSettings.fees }
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    category: "Platform"
  });

  useEffect(() => {
    setFormData({
      platformName: platformSettings.name,
      platformLogo: platformSettings.logo,
      paymentDeadline: platformSettings.paymentDeadline,
      fees: { ...platformSettings.fees }
    });
  }, [platformSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please select an image smaller than 2MB." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, platformLogo: reader.result as string }));
        toast({ title: "Logo Uploaded", description: "Identity preview updated locally." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
    // Prototype Delay
    setTimeout(() => {
      updatePlatformSettings({
        name: formData.platformName,
        logo: formData.platformLogo,
        paymentDeadline: formData.paymentDeadline,
        fees: formData.fees
      });
      setLoading(false);
      toast({
        title: "Platform Policy Updated",
        description: "All branding and financial parameters have been synchronized across the network.",
      });
    }, 1500);
  };

  const handleFeeChange = (role: keyof PlatformFees, value: string) => {
    setFormData(prev => ({
      ...prev,
      fees: {
        ...prev.fees,
        [role]: value
      }
    }));
  };

  const handleAddVideo = () => {
    toast({ title: "Media Added", description: "The video has been added to public gallery." });
    setNewVideo({ title: "", description: "", youtubeUrl: "", category: "Platform" });
  };

  const FeeInput = ({ id, label, value, onChange, icon: Icon, colorClass }: any) => (
    <div className="space-y-3 p-4 rounded-2xl bg-accent/30 border border-accent hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
          {label}
        </Label>
        <Badge variant="outline" className="text-[10px] font-bold border-primary/10 text-primary">ANNUAL LICENSE</Badge>
      </div>
      <div className="relative">
        <Input 
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white border-none h-12 pl-12 rounded-xl focus-visible:ring-primary font-black text-lg shadow-sm text-primary"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">XAF</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Settings2 className="w-6 h-6 text-secondary" />
            </div>
            {t("platformSettings")}
          </h1>
          <p className="text-muted-foreground mt-1">Govern global SaaS identity, revenue models, and operational deadlines.</p>
        </div>
        <Button onClick={handleUpdateSettings} disabled={loading} className="h-14 px-10 shadow-2xl font-black uppercase tracking-widest text-xs gap-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Commit Global Policy
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[700px] mb-10 bg-white shadow-sm border h-auto p-1.5 rounded-3xl">
          <TabsTrigger value="branding" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <Layout className="w-4 h-4" /> Global Identity
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <Coins className="w-4 h-4" /> Revenue & Deadlines
          </TabsTrigger>
          <TabsTrigger value="marketing" className="gap-2 py-3 rounded-2xl transition-all font-bold">
            <Star className="w-4 h-4" /> Public Portfolio
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary p-10 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">Strategic Branding</CardTitle>
                  <CardDescription className="text-white/60">Customize the visual identity of the SaaS platform across all institutional nodes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className="md:col-span-4 space-y-4 text-center">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground block">Platform Logo</Label>
                  <div 
                    className="group relative w-48 h-48 mx-auto bg-accent/20 rounded-[2.5rem] border-2 border-dashed border-accent flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary shadow-inner"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                    {formData.platformLogo ? (
                      <img src={formData.platformLogo} alt="Logo" className="w-full h-full object-contain p-6" />
                    ) : (
                      <Upload className="w-10 h-10 text-primary/20" />
                    )}
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">
                      <Upload className="w-8 h-8" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Change Device Logo</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted-foreground italic">Recommended: PNG or SVG with transparent background.</p>
                </div>

                <div className="md:col-span-8 space-y-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Platform Market Name</Label>
                    <Input 
                      value={formData.platformName}
                      onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                      placeholder="e.g. EduIgnite"
                      className="h-14 bg-accent/30 border-none rounded-2xl font-black text-2xl text-primary focus-visible:ring-primary px-6"
                    />
                    <p className="text-[10px] text-muted-foreground ml-1">This name appears on login pages and official platform receipts.</p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl text-white">
                      <ShieldCheck className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-primary uppercase tracking-tight leading-none">Global Sync Enabled</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Identity changes are cached and distributed to all 124 institutional nodes within 15 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FEE CONFIGURATION */}
            <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem]">
                <CardHeader className="bg-primary/5 border-b p-10">
                  <CardTitle className="text-2xl font-black text-primary flex items-center gap-3">
                    <Coins className="w-6 h-6 text-secondary" />
                    Annual License Structures
                  </CardTitle>
                  <CardDescription>Define the platform access fees for non-executive roles across the network.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FeeInput id="fee-student" label="Student Access" value={formData.fees.STUDENT} onChange={(v: string) => handleFeeChange('STUDENT', v)} icon={GraduationCap} colorClass="text-blue-600" />
                    <FeeInput id="fee-teacher" label="Teacher Licensing" value={formData.fees.TEACHER} onChange={(v: string) => handleFeeChange('TEACHER', v)} icon={Users} colorClass="text-purple-600" />
                    <FeeInput id="fee-parent" label="Family Portal" value={formData.fees.PARENT} onChange={(v: string) => handleFeeChange('PARENT', v)} icon={Heart} colorClass="text-rose-600" />
                    <FeeInput id="fee-bursar" label="Financial Node" value={formData.fees.BURSAR} onChange={(v: string) => handleFeeChange('BURSAR', v)} icon={Wallet} colorClass="text-emerald-600" />
                    <FeeInput id="fee-librarian" label="Library Node" value={formData.fees.LIBRARIAN} onChange={(v: string) => handleFeeChange('LIBRARIAN', v)} icon={BookOpen} colorClass="text-amber-600" />
                    <FeeInput id="fee-admin" label="Primary Admin" value={formData.fees.SCHOOL_ADMIN} onChange={(v: string) => handleFeeChange('SCHOOL_ADMIN', v)} icon={Building2} colorClass="text-red-600" />
                    <FeeInput id="fee-subadmin" label="Sub-Admin Node" value={formData.fees.SUB_ADMIN} onChange={(v: string) => handleFeeChange('SUB_ADMIN', v)} icon={ShieldCheck} colorClass="text-cyan-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* DEADLINE CONFIGURATION */}
            <div className="lg:col-span-4 space-y-8">
              <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-primary text-white">
                <CardHeader className="bg-white/10 p-8 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-secondary" />
                    <CardTitle className="text-xl font-black uppercase tracking-tighter">Global Deadline</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">Final Payment Date</Label>
                    <Input 
                      type="date"
                      value={formData.paymentDeadline}
                      onChange={(e) => setFormData({...formData, paymentDeadline: e.target.value})}
                      className="h-14 bg-white/10 border-white/20 text-white font-black text-xl rounded-2xl px-6 focus-visible:ring-secondary"
                    />
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-secondary shrink-0" />
                    <p className="text-[10px] font-medium leading-relaxed opacity-80 italic">
                      After this date, institutional nodes with outstanding balances will be automatically locked by the system kernel.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="p-8 rounded-[2.5rem] bg-white border shadow-sm text-center space-y-6">
                 <div className="flex justify-center">
                    <div className="p-4 bg-accent rounded-full">
                       <Lock className="w-10 h-10 text-primary" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-black text-primary uppercase tracking-tighter">Governance Integrity</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Revenue parameters are protected by multi-founder authorization. Updates are digitally signed by the current CEO session.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">Public Media Gallery</CardTitle>
                  <CardDescription className="text-white/80">Manage featured institutional videos displayed on the community portal.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10">
              <div className="space-y-8">
                <div className="p-8 bg-accent/30 rounded-[2rem] border border-accent">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Video Title</Label>
                      <Input value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} placeholder="e.g. Platform Introduction" className="h-12 border-none bg-white shadow-sm rounded-xl px-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">YouTube / Media URL</Label>
                      <Input value={newVideo.youtubeUrl} onChange={(e) => setNewVideo({...newVideo, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." className="h-12 border-none bg-white shadow-sm rounded-xl px-4" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</Label>
                      <Select value={newVideo.category} onValueChange={(v) => setNewVideo({...newVideo, category: v})}>
                        <SelectTrigger className="h-12 border-none bg-white shadow-sm rounded-xl font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Platform">Platform Intro</SelectItem>
                          <SelectItem value="Event">Event Recap</SelectItem>
                          <SelectItem value="Training">Training Guide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleAddVideo} className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs gap-3 rounded-2xl mt-8 shadow-xl transition-all active:scale-95">
                    <Plus className="w-5 h-5" /> Publish to Public Gallery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
