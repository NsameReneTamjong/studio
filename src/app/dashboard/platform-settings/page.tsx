"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings2, 
  Save, 
  Loader2, 
  Coins, 
  ShieldCheck, 
  Building2, 
  Globe, 
  Video, 
  Plus, 
  Trash2, 
  Play,
  Quote,
  Layout,
  Star,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

export default function PlatformSettingsPage() {
  const { platformSettings, updatePlatformSettings, featuredVideos, testimonials } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentFee: "5000",
    parentFee: "2500",
    teacherFee: "10000",
    bursarFee: "10000",
    librarianFee: "10000",
    adminFee: "25000",
    platformName: platformSettings.name,
    platformLogo: platformSettings.logo
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    category: "Platform"
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      platformName: platformSettings.name,
      platformLogo: platformSettings.logo
    }));
  }, [platformSettings]);

  const handleUpdateSettings = async () => {
    setLoading(true);
    try {
      await updatePlatformSettings({
        name: formData.platformName,
        logo: formData.platformLogo
      });
      toast({
        title: "Platform Policy Updated",
        description: "Branding and institutional parameters synchronized.",
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed", description: "Failed to save settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.youtubeUrl) return;
    
    let youtubeId = "";
    try {
      const url = new URL(newVideo.youtubeUrl);
      if (url.hostname === "youtu.be") {
        youtubeId = url.pathname.slice(1);
      } else {
        youtubeId = url.searchParams.get("v") || "";
      }
    } catch {
      toast({ variant: "destructive", title: "Invalid URL", description: "Please provide a valid YouTube link." });
      return;
    }

    if (!youtubeId) {
      toast({ variant: "destructive", title: "Invalid URL", description: "Could not extract Video ID." });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "featured_videos"), {
        title: newVideo.title,
        description: newVideo.description,
        youtubeId,
        category: newVideo.category,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        createdAt: serverTimestamp()
      });
      setNewVideo({ title: "", description: "", youtubeUrl: "", category: "Platform" });
      toast({ title: "Video Added", description: "The media is now featured on the login portal." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to add video record." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "featured_videos", id));
      toast({ title: "Media Removed", description: "The video has been deleted from public view." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete media record." });
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "testimonials", id));
      toast({ title: "Testimonial Removed", description: "The feedback has been un-published." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete testimonial." });
    }
  };

  const FeeInput = ({ id, label, value, onChange, icon: Icon, colorClass }: any) => (
    <div className="space-y-3 p-4 rounded-2xl bg-accent/30 border border-accent hover:border-primary/20 transition-all">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
          {label}
        </Label>
        <Badge variant="outline" className="text-[10px] font-bold border-primary/10 text-primary">ANNUAL</Badge>
      </div>
      <div className="relative">
        <Input 
          id={id}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-white border-none h-12 pl-12 rounded-xl focus-visible:ring-primary font-bold text-lg shadow-sm"
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
          <p className="text-muted-foreground mt-1">Configure global SaaS branding, revenue models, and marketing media.</p>
        </div>
        <Button onClick={handleUpdateSettings} disabled={loading} className="h-12 px-8 shadow-xl font-black uppercase tracking-widest text-xs gap-2 rounded-2xl">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Update Platform Policy
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="branding" className="gap-2 py-3 rounded-xl transition-all">
            <Layout className="w-4 h-4" /> Global Identity
          </TabsTrigger>
          <TabsTrigger value="revenue" className="gap-2 py-3 rounded-xl transition-all">
            <Coins className="w-4 h-4" /> Revenue Model
          </TabsTrigger>
          <TabsTrigger value="marketing" className="gap-2 py-3 rounded-xl transition-all">
            <Star className="w-4 h-4" /> Public Media
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-8">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Globe className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Strategic Branding</CardTitle>
                  <CardDescription className="text-white/60">Customize the identity of your SaaS platform across all login portals.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Display Name</Label>
                  <Input 
                    value={formData.platformName}
                    onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                    placeholder="e.g. EduIgnite"
                    className="h-12 bg-accent/30 border-none rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Platform Logo URL</Label>
                  <Input 
                    value={formData.platformLogo}
                    onChange={(e) => setFormData({...formData, platformLogo: e.target.value})}
                    placeholder="https://..."
                    className="h-12 bg-accent/30 border-none rounded-xl"
                  />
                </div>
              </div>
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border shadow-inner flex items-center justify-center p-2 shrink-0">
                  {formData.platformLogo ? (
                    <img src={formData.platformLogo} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary/20" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-primary">Login Portal Preview</p>
                  <p className="text-[10px] text-muted-foreground">This logo and name appear on the public sign-in page for all users.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-8">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary/5 border-b p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Coins className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-primary">Annual Access Charges</CardTitle>
                  <CardDescription>Define the yearly subscription fee per user role across all school nodes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FeeInput id="student-fee" label="Student Platform Fee" value={formData.studentFee} onChange={(v: string) => setFormData({...formData, studentFee: v})} icon={ShieldCheck} colorClass="text-blue-600" />
                <FeeInput id="parent-fee" label="Parent Portal Fee" value={formData.parentFee} onChange={(v: string) => setFormData({...formData, parentFee: v})} icon={ShieldCheck} colorClass="text-amber-600" />
                <FeeInput id="teacher-fee" label="Teacher Licensing Fee" value={formData.teacherFee} onChange={(v: string) => setFormData({...formData, teacherFee: v})} icon={ShieldCheck} colorClass="text-purple-600" />
                <FeeInput id="admin-fee" label="School Administrator Fee" value={formData.adminFee} onChange={(v: string) => setFormData({...formData, adminFee: v})} icon={ShieldCheck} colorClass="text-red-600" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-6">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-red-600 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Video className="w-6 h-6" />
                    <CardTitle className="text-lg">Featured Platform Media</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4 p-4 bg-accent/30 rounded-2xl border border-accent">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase">Video Title</Label>
                        <Input value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} placeholder="e.g. Platform Vision Overview" className="h-10 border-none bg-white shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase">YouTube URL</Label>
                        <Input value={newVideo.youtubeUrl} onChange={(e) => setNewVideo({...newVideo, youtubeUrl: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="h-10 border-none bg-white shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase">Category</Label>
                        <Select value={newVideo.category} onValueChange={(v) => setNewVideo({...newVideo, category: v})}>
                          <SelectTrigger className="h-10 border-none bg-white shadow-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Platform">Platform Intro</SelectItem>
                            <SelectItem value="Finance">Financials</SelectItem>
                            <SelectItem value="Event">Event Recap</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase">Description / Event Details</Label>
                        <Input value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} placeholder="Describe the event or video content..." className="h-10 border-none bg-white shadow-sm" />
                      </div>
                    </div>
                    <Button onClick={handleAddVideo} className="w-full h-11 bg-red-600 hover:bg-red-700 gap-2">
                      <Plus className="w-4 h-4" /> Add to Public Gallery
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-muted-foreground flex items-center gap-2">Active Gallery ({featuredVideos.length})</h4>
                    <div className="space-y-3">
                      {featuredVideos.map(video => (
                        <div key={video.id} className="flex items-center justify-between p-3 bg-white border rounded-xl shadow-sm group">
                          <div className="flex items-center gap-4">
                            <div className="w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0 relative">
                              <img src={video.thumbnail} className="w-full h-full object-cover opacity-60" />
                              <Play className="absolute inset-0 m-auto w-4 h-4 text-white fill-white" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-primary leading-tight">{video.title}</p>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{video.description}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteVideo(video.id)} className="text-destructive/20 hover:text-destructive group-hover:bg-destructive/5"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-amber-500 text-white p-6">
                  <div className="flex items-center gap-3">
                    <Quote className="w-6 h-6" />
                    <CardTitle className="text-lg">Published Testimonials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-4">
                      {testimonials.map(test => (
                        <Card key={test.id} className="border border-amber-100 bg-amber-50/30">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className="bg-white text-primary border-none font-black text-[8px] uppercase">{test.schoolName}</Badge>
                                <div>
                                  <p className="text-xs font-black leading-none">{test.author}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(test.id)} className="h-7 w-7 text-destructive/40 hover:text-destructive"><X className="w-3.5 h-3.5" /></Button>
                            </div>
                            <p className="text-[11px] italic text-muted-foreground leading-relaxed">"{test.content}"</p>
                          </CardContent>
                        </Card>
                      ))}
                      {testimonials.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground italic text-sm">
                          No public testimonials yet. Publish them from the Feedback tab.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
