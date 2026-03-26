
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Megaphone, Send, Globe, Building2, Clock, Trash2, User, Users, GraduationCap, ShieldCheck, Loader2, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function AnnouncementsPage() {
  const { user, announcements, addAnnouncement, deleteAnnouncement } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  
  // Executive Roles Check
  const isPlatformExecutive = ["CEO", "CTO", "COO", "INV", "DESIGNER", "SUPER_ADMIN"].includes(user?.role || "");
  const isCEO = user?.role === "CEO" || user?.role === "SUPER_ADMIN";
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isTeacher = user?.role === "TEACHER";

  // Initial target based on role authority
  const initialTarget = isCEO ? "all_schools" : (isPlatformExecutive ? "saas_admins" : "everyone");
  const [formData, setFormData] = useState({ title: "", content: "", target: initialTarget });

  const canPost = isPlatformExecutive || isSchoolAdmin || isTeacher;

  const handleSend = async () => {
    if (!formData.title || !formData.content || !user) return;
    setIsSending(true);
    
    // Prototype Delay
    setTimeout(() => {
      addAnnouncement({
        ...formData,
        senderUid: user.id,
        senderName: user.name,
        senderRole: user.role,
        senderAvatar: user.avatar || ""
      });
      
      toast({ 
        title: "Announcement Published", 
        description: `The message has been broadcasted to ${formData.target.replace('_', ' ')}.` 
      });
      setFormData({ title: "", content: "", target: initialTarget });
      setIsSending(false);
    }, 800);
  };

  const getTargetIcon = (target: string) => {
    if (target === "all_schools") return <Globe className="w-3 h-3"/>;
    if (target === "saas_admins") return <Crown className="w-3 h-3"/>;
    if (target === "teachers") return <Users className="w-3 h-3"/>;
    if (target === "students") return <GraduationCap className="w-3 h-3"/>;
    if (target === "administration") return <ShieldCheck className="w-3 h-3"/>;
    return <Building2 className="w-3 h-3"/>;
  };

  const AnnouncementCard = ({ ann }: { ann: any }) => (
    <Card className="border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all bg-white">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border border-primary/10 shadow-sm">
              <AvatarImage src={ann.senderAvatar} alt={ann.senderName} />
              <AvatarFallback className="bg-primary/5 text-primary">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-primary">{ann.senderName}</span>
                <Badge variant="secondary" className="text-[9px] h-4 py-0 font-bold uppercase tracking-wider bg-secondary/20 text-primary border-none">
                  {ann.senderRole}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(ann.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] gap-1 shrink-0 uppercase border-primary/10 text-primary font-black">
            {getTargetIcon(ann.target)}
            {ann.target.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle className="text-lg font-bold text-primary">{ann.title}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ann.content}
        </p>
      </CardContent>
      {(isCEO || user?.id === ann.senderUid) && (
        <CardFooter className="pt-0 justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive gap-2 text-[10px] font-black uppercase"
            onClick={() => deleteAnnouncement(ann.id)}
          >
            <Trash2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Remove' : 'Supprimer'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {canPost && (
        <div className="lg:col-span-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">Broadcast</h1>
            <p className="text-muted-foreground mt-1">Regulated official messaging suite.</p>
          </div>

          <Card className="border-none shadow-xl bg-primary text-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-white/10 p-8 border-b border-white/5">
              <CardTitle className="text-white uppercase tracking-tighter">New Announcement</CardTitle>
              <CardDescription className="text-white/60">Choose your audience carefully.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">Recipient Target</Label>
                <Select value={formData.target} onValueChange={(v) => setFormData({...formData, target: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isPlatformExecutive ? (
                      <SelectGroup>
                        <SelectLabel>Platform Authority</SelectLabel>
                        {isCEO && <SelectItem value="all_schools">All Registered Schools</SelectItem>}
                        <SelectItem value="saas_admins">Executive Board Only</SelectItem>
                      </SelectGroup>
                    ) : (
                      <SelectGroup>
                        <SelectLabel>School-wide</SelectLabel>
                        <SelectItem value="everyone">Everyone (School-wide)</SelectItem>
                        <SelectItem value="teachers">All Teachers</SelectItem>
                        <SelectItem value="students">All Students</SelectItem>
                        <SelectItem value="administration">Administration Only</SelectItem>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">Title</Label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-12 rounded-xl"
                  placeholder="e.g. System Update or Fee Notice" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">Content</Label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 min-h-[150px] rounded-xl leading-relaxed"
                  placeholder="Message body..." 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Button 
                variant="secondary" 
                className="w-full h-14 gap-3 shadow-lg font-black uppercase tracking-widest text-xs rounded-2xl" 
                onClick={handleSend}
                disabled={isSending || !formData.title || !formData.content}
              >
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t("sendAnnouncement")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className={cn("space-y-4", canPost ? "lg:col-span-2" : "lg:col-span-3")}>
        {!canPost && (
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">{t("announcements")}</h1>
            <p className="text-muted-foreground mt-1">Stay updated with official platform notices and school-wide alerts.</p>
          </div>
        )}
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-tighter">
          <Megaphone className="w-5 h-5 text-secondary" /> Recent Dispatches
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {announcements && announcements.length > 0 ? (
            announcements
              .filter(ann => {
                // Visibility Logic
                if (ann.target === "all_schools") return true;
                if (ann.target === "saas_admins") return isPlatformExecutive;
                // If it's a school target, only show to people who belong to a school (prototype simulation)
                return !isPlatformExecutive || ann.senderUid === user?.id;
              })
              .map((ann) => (
                <AnnouncementCard key={ann.id} ann={ann} />
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-primary/10">
              <Megaphone className="w-12 h-12 text-primary/10" />
              <p className="text-muted-foreground font-medium">No announcements found for your dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
