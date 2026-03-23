
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
import { Megaphone, Send, Globe, Building2, Clock, Trash2, User, Users, GraduationCap, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", target: "everyone" });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const canPost = ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "BURSAR", "LIBRARIAN"].includes(user?.role || "");

  const announcementsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return query(
      collection(db, "schools", user.schoolId, "announcements"),
      orderBy("createdAt", "desc")
    );
  }, [db, user?.schoolId]);

  const { data: announcements, isLoading: isAnnouncementsLoading } = useCollection(announcementsQuery);

  const handleSend = async () => {
    if (!formData.title || !formData.content || !user?.schoolId) return;
    setIsSending(true);
    
    try {
      await addDoc(collection(db, "schools", user.schoolId, "announcements"), {
        ...formData,
        senderUid: user.uid,
        senderName: user.name,
        senderRole: user.role,
        senderAvatar: user.avatar || "",
        createdAt: serverTimestamp()
      });
      
      toast({ title: "Announcement Published", description: `The message has been broadcasted to ${formData.target.replace('_', ' ')}.` });
      setFormData({ title: "", content: "", target: "everyone" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to publish announcement." });
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user?.schoolId) return;
    try {
      await deleteDoc(doc(db, "schools", user.schoolId, "announcements", id));
      toast({ title: "Removed", description: "Announcement deleted successfully." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete." });
    }
  };

  const getTargetIcon = (target: string) => {
    if (target.includes("Teachers")) return <Users className="w-3 h-3"/>;
    if (target.includes("Students") || target.includes("Class")) return <GraduationCap className="w-3 h-3"/>;
    if (target.includes("Admin")) return <ShieldCheck className="w-3 h-3"/>;
    return <Globe className="w-3 h-3"/>;
  };

  const AnnouncementCard = ({ ann }: { ann: any }) => (
    <Card className="border-none shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
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
                <Clock className="w-3 h-3" /> {ann.createdAt?.toDate ? ann.createdAt.toDate().toLocaleString() : "Just now"}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] gap-1 shrink-0">
            {getTargetIcon(ann.target)}
            {ann.target}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardTitle className="text-lg font-bold">{ann.title}</CardTitle>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ann.content}
        </p>
      </CardContent>
      {(isSuperAdmin || user?.uid === ann.senderUid) && (
        <CardFooter className="pt-0 justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-destructive gap-2"
            onClick={() => handleDelete(ann.id)}
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
            <p className="text-muted-foreground mt-1">Send official messages to targeted groups in your school.</p>
          </div>

          <Card className="border-none shadow-xl bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-white">New Announcement</CardTitle>
              <CardDescription className="text-white/60">Choose your audience carefully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white/80">Recipient Target</Label>
                <Select value={formData.target} onValueChange={(v) => setFormData({...formData, target: v})}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isSuperAdmin ? (
                      <SelectGroup>
                        <SelectLabel>Platform Level</SelectLabel>
                        <SelectItem value="all_schools">All Registered Schools</SelectItem>
                        <SelectItem value="saas_admins">SaaS Administrators</SelectItem>
                      </SelectGroup>
                    ) : (
                      <>
                        <SelectGroup>
                          <SelectLabel>School-wide</SelectLabel>
                          <SelectItem value="everyone">Everyone (School-wide)</SelectItem>
                          <SelectItem value="teachers">All Teachers</SelectItem>
                          <SelectItem value="students">All Students</SelectItem>
                          <SelectItem value="administration">Administration Only</SelectItem>
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Title</Label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                  placeholder="e.g. System Update or Fee Notice" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Content</Label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/30 min-h-[120px]"
                  placeholder="Message body..." 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="w-full gap-2 shadow-lg" 
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
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Recent Dispatches
        </h2>
        {isAnnouncementsLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {announcements.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed">
            <Megaphone className="w-12 h-12 text-primary/10" />
            <p className="text-muted-foreground">No announcements found for your institution.</p>
          </div>
        )}
      </div>
    </div>
  );
}
