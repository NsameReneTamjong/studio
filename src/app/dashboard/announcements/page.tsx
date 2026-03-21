
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Globe, Building2, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const MOCK_ANNOUNCEMENTS = [
  { id: "A001", title: "System Maintenance", target: "All Schools", content: "The system will be offline this Sunday from 2 AM to 4 AM for scheduled database optimization.", date: "3h ago" },
  { id: "A002", title: "Quarterly Billing Update", target: "GBHS Yaoundé", content: "Your institution's quarterly invoice is now ready for download in the billing portal.", date: "1 day ago" },
];

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "", target: "all" });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const handleSend = () => {
    if (!formData.title || !formData.content) return;
    setIsSending(true);
    setTimeout(() => {
      toast({ title: "Announcement Published", description: "The message has been dispatched to the selected recipients." });
      setFormData({ title: "", content: "", target: "all" });
      setIsSending(false);
    }, 1200);
  };

  if (!isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">{t("announcements")}</h1>
          <p className="text-muted-foreground mt-1">Stay updated with official platform notices and school-wide alerts.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <Card key={ann.id} className="border-none shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{ann.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {ann.date}
                    </CardDescription>
                  </div>
                  <Megaphone className="w-5 h-5 text-primary/30 group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ann.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Manage Announcements</h1>
          <p className="text-muted-foreground mt-1">Broadcast messages to all institutions or specific targets.</p>
        </div>

        <Card className="border-none shadow-xl bg-primary text-white">
          <CardHeader>
            <CardTitle className="text-white">New Broadcast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white/80">Recipient Target</Label>
              <Select value={formData.target} onValueChange={(v) => setFormData({...formData, target: v})}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allSchools")}</SelectItem>
                  <SelectItem value="S001">Lycée de Joss</SelectItem>
                  <SelectItem value="S002">GBHS Yaoundé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/80">Title</Label>
              <Input 
                className="bg-white/10 border-white/20 text-white placeholder:text-white/30"
                placeholder="e.g. System Update" 
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
        {MOCK_ANNOUNCEMENTS.map((ann) => (
          <Card key={ann.id} className="border-none shadow-sm group">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/50 rounded-xl">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{ann.title}</CardTitle>
                    <Badge variant="outline" className="text-[10px] gap-1">
                      {ann.target === 'All Schools' ? <Globe className="w-3 h-3"/> : <Building2 className="w-3 h-3"/>}
                      {ann.target}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ann.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
