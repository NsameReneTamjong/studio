
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
import { Megaphone, Send, Globe, Building2, Clock, Trash2, User, Users, GraduationCap, ShieldCheck, BookCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MOCK_ANNOUNCEMENTS = [
  { 
    id: "A001", 
    title: "Annual Pedagogic Seminar", 
    target: "All Teachers", 
    content: "All teachers are required to attend the virtual seminar on new evaluation methods this Friday at 10 AM.", 
    date: "2h ago",
    senderName: "Dr. Fonka Maurice",
    senderRole: "Principal",
    senderAvatar: "https://picsum.photos/seed/p1/100/100"
  },
  { 
    id: "A002", 
    title: "Sequence 2 Marks Extension", 
    target: "Lycée de Joss", 
    content: "The deadline for entering Sequence 2 marks has been extended to Monday noon. Please ensure all data is verified.", 
    date: "5h ago",
    senderName: "Mme. Ngono Celine",
    senderRole: "Vice Principal",
    senderAvatar: "https://picsum.photos/seed/vp1/100/100"
  },
  { 
    id: "A003", 
    title: "Tuition Fee Deadline", 
    target: "All Students", 
    content: "Please be reminded that the deadline for the second installment of tuition fees is next Friday. Receipts must be presented at the gate.", 
    date: "1 day ago",
    senderName: "Finance Manager",
    senderRole: "Bursar",
    senderAvatar: "https://picsum.photos/seed/bursar/100/100"
  },
  { 
    id: "A004", 
    title: "New Science Encyclopedia", 
    target: "Everyone", 
    content: "The library has received 10 copies of the latest British Science Encyclopedia. Visit the resource center to borrow.", 
    date: "2 days ago",
    senderName: "Mrs. Ebong",
    senderRole: "Librarian",
    senderAvatar: "https://picsum.photos/seed/lib/100/100"
  },
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", target: "everyone" });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  // Updated canPost to include Librarian
  const canPost = ["SUPER_ADMIN", "SCHOOL_ADMIN", "TEACHER", "BURSAR", "LIBRARIAN"].includes(user?.role || "");

  const handleSend = () => {
    if (!formData.title || !formData.content) return;
    setIsSending(true);
    setTimeout(() => {
      toast({ title: "Announcement Published", description: `The message has been broadcasted to ${formData.target.replace('_', ' ')}.` });
      setFormData({ title: "", content: "", target: "everyone" });
      setIsSending(false);
    }, 1200);
  };

  const getTargetIcon = (target: string) => {
    if (target.includes("Teachers")) return <Users className="w-3 h-3"/>;
    if (target.includes("Students") || target.includes("Class")) return <GraduationCap className="w-3 h-3"/>;
    if (target.includes("Admin")) return <ShieldCheck className="w-3 h-3"/>;
    return <Globe className="w-3 h-3"/>;
  };

  const AnnouncementCard = ({ ann }: { ann: typeof MOCK_ANNOUNCEMENTS[0] }) => (
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
                <Clock className="w-3 h-3" /> {ann.date}
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
      {isSuperAdmin && (
        <CardFooter className="pt-0 justify-end">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-2">
            <Trash2 className="w-3.5 h-3.5" /> {language === 'en' ? 'Remove' : 'Supprimer'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  if (!canPost) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">{t("announcements")}</h1>
          <p className="text-muted-foreground mt-1">Stay updated with official platform notices and school-wide alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                      <SelectGroup>
                        <SelectLabel>Specific Classes</SelectLabel>
                        <SelectItem value="class_6">6ème / Form 1</SelectItem>
                        <SelectItem value="class_5">5ème / Form 2</SelectItem>
                        <SelectItem value="class_4">4ème / Form 3</SelectItem>
                        <SelectItem value="class_3">3ème / Form 4</SelectItem>
                        <SelectItem value="class_2">2nde / Form 5</SelectItem>
                        <SelectItem value="class_1">1ère / Lower Sixth</SelectItem>
                        <SelectItem value="class_t">Terminale / Upper Sixth</SelectItem>
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
              {isSending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t("sendAnnouncement")}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5" /> Recent Dispatches
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <AnnouncementCard key={ann.id} ann={ann} />
          ))}
        </div>
      </div>
    </div>
  );
}
