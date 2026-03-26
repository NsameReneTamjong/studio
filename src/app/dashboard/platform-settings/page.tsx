
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
  BookOpen,
  Video,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PlatformSettingsPage() {
  const { platformSettings, updatePlatformSettings, publicEvents, addPublicEvent, deletePublicEvent } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const eventImageRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    platformName: platformSettings.name,
    platformLogo: platformSettings.logo,
    paymentDeadline: platformSettings.paymentDeadline,
    fees: { ...platformSettings.fees }
  });

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    url: "",
    type: "video" as "video" | "image"
  });

  useEffect(() => {
    setFormData({
      platformName: platformSettings.name,
      platformLogo: platformSettings.logo,
      paymentDeadline: platformSettings.paymentDeadline,
      fees: { ...platformSettings.fees }
    });
  }, [platformSettings]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'event') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Please select an image smaller than 2MB." });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'logo') {
          setFormData(prev => ({ ...prev, platformLogo: reader.result as string }));
        } else {
          setNewEvent(prev => ({ ...prev, url: reader.result as string }));
        }
        toast({ title: "Image Processed", description: "Identity preview updated locally." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSettings = async () => {
    setLoading(true);
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
    }, 1000);
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

  const handlePublishEvent = () => {
    if (!newEvent.title || !newEvent.url) {
      toast({ variant: "destructive", title: "Missing Information", description: "Title and content URL are required." });
      return;
    }
    
    addPublicEvent(newEvent);
    setNewEvent({ title: "", description: "", url: "", type: "video" });
    toast({ title: "Portfolio Updated", description: "New event published to community portal." });
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
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'logo')} 
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
                  </div>

                  <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-xl text-white">
                      <ShieldCheck className="w-6 h-6 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-primary uppercase tracking-tight leading-none">Global Sync Enabled</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Identity changes are cached and distributed to all institutional nodes.
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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary p-10 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Star className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tighter">Public Portfolio Management</CardTitle>
                  <CardDescription className="text-white/60">Upload images and videos to the community testimony highlights.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-10 space-y-10">
              {/* NEW MEDIA FORM */}
              <div className="p-8 bg-accent/30 rounded-[2rem] border border-accent space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 flex flex-col items-center gap-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Content Type</Label>
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant={newEvent.type === 'video' ? 'default' : 'outline'}
                        className="flex-1 rounded-xl h-12 font-bold gap-2"
                        onClick={() => setNewEvent({...newEvent, type: 'video', url: ''})}
                      >
                        <Video className="w-4 h-4" /> Video
                      </Button>
                      <Button 
                        variant={newEvent.type === 'image' ? 'default' : 'outline'}
                        className="flex-1 rounded-xl h-12 font-bold gap-2"
                        onClick={() => setNewEvent({...newEvent, type: 'image', url: ''})}
                      >
                        <ImageIcon className="w-4 h-4" /> Image
                      </Button>
                    </div>
                    
                    {newEvent.type === 'image' && (
                      <div 
                        className="w-full aspect-video bg-white rounded-2xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary transition-all"
                        onClick={() => eventImageRef.current?.click()}
                      >
                        <input type="file" ref={eventImageRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'event')} />
                        {newEvent.url ? (
                          <img src={newEvent.url} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-primary/40 group-hover:scale-110 transition-transform mb-2" />
                            <span className="text-[10px] font-black uppercase text-primary/40">Upload Media</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Headline Title</Label>
                      <Input value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} placeholder="e.g. Annual Pedagogical Summit" className="h-12 border-none bg-white rounded-xl px-4 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest">Short Summary</Label>
                      <Input value={newEvent.description} onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} placeholder="Capturing the moments..." className="h-12 border-none bg-white rounded-xl px-4" />
                    </div>
                    {newEvent.type === 'video' && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">YouTube Embed URL</Label>
                        <Input value={newEvent.url} onChange={(e) => setNewEvent({...newEvent, url: e.target.value})} placeholder="https://www.youtube.com/embed/..." className="h-12 border-none bg-white rounded-xl px-4" />
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={handlePublishEvent} className="w-full h-14 bg-primary text-white font-black uppercase tracking-widest text-xs gap-3 rounded-2xl shadow-xl transition-all">
                  <Plus className="w-5 h-5 text-secondary" /> Publish to Portfolio
                </Button>
              </div>

              {/* ACTIVE PORTFOLIO LIST */}
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase text-primary tracking-[0.3em] border-b pb-2 flex items-center gap-2">
                  <Layout className="w-4 h-4" /> Active Gallery Contents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publicEvents.map((event) => (
                    <Card key={event.id} className="border-none shadow-sm overflow-hidden bg-accent/10 flex flex-col">
                      <div className="aspect-video relative bg-slate-900 overflow-hidden">
                        {event.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-12 h-12 text-white/20" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-bold text-white uppercase text-[10px]">VIDEO CONTENT</div>
                          </div>
                        ) : (
                          <img src={event.url} alt={event.title} className="w-full h-full object-cover" />
                        )}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deletePublicEvent(event.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base font-black truncate">{event.title}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{event.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 justify-end">
                        <Button variant="ghost" size="sm" className="text-destructive gap-2 text-[10px] font-black uppercase" onClick={() => deletePublicEvent(event.id)}>
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
