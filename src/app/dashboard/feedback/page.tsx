
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Building2, User, Clock, Trash2, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const INITIAL_FEEDBACKS = [
  { 
    id: "F001", 
    schoolName: "Lycée de Joss", 
    schoolLogo: "https://picsum.photos/seed/joss-logo/100/100",
    senderName: "Dr. Fonka Maurice", 
    senderAvatar: "https://picsum.photos/seed/admin1/100/100",
    senderRole: "Main Admin",
    subject: "Server Latency during Peak Hours", 
    message: "We are experiencing significant slow response times when teachers are entering Sequence 2 marks simultaneously. Please investigate our instance performance.", 
    date: "2 hours ago", 
    status: "New" 
  },
  { 
    id: "F002", 
    schoolName: "GBHS Yaoundé", 
    schoolLogo: "https://picsum.photos/seed/gbhs-logo/100/100",
    senderName: "Mme. Ngono Celine", 
    senderAvatar: "https://picsum.photos/seed/admin2/100/100",
    senderRole: "Vice Principal",
    subject: "Disciplinary Record Request", 
    message: "It would be beneficial to add a dedicated section for student disciplinary behavior in the official report card generation module.", 
    date: "Yesterday", 
    status: "Read" 
  },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [isSending, setIsSending] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ subject: "", message: "" });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const handleSendFeedback = () => {
    if (!newFeedback.message) return;
    setIsSending(true);
    setTimeout(() => {
      toast({ title: "Feedback Sent", description: "The platform administrator has received your message." });
      setNewFeedback({ subject: "", message: "" });
      setIsSending(false);
    }, 1000);
  };

  const handleResolve = (id: string) => {
    setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Resolved' } : fb));
    toast({ 
      title: "Ticket Resolved", 
      description: "The support request has been marked as completed." 
    });
  };

  const handleArchive = (id: string) => {
    setFeedbacks(prev => prev.filter(fb => fb.id !== id));
    toast({ 
      title: "Ticket Archived", 
      description: "The message has been moved to the system archives." 
    });
  };

  const handleDelete = (id: string) => {
    setFeedbacks(prev => prev.filter(fb => fb.id !== id));
    toast({ 
      variant: "destructive",
      title: "Ticket Deleted", 
      description: "The support record has been permanently removed." 
    });
  };

  if (isSuperAdmin) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg text-white">
                <MessageCircle className="w-6 h-6 text-secondary" />
              </div>
              Platform Feedback
            </h1>
            <p className="text-muted-foreground mt-1">Review issues, suggestions, and support requests from institutional admins.</p>
          </div>
          <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 text-primary font-black uppercase tracking-widest">
            {feedbacks.length} Active Tickets
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {feedbacks.map((fb) => (
            <Card key={fb.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col md:flex-row">
                {/* School Context Side */}
                <div className="w-full md:w-64 bg-accent/20 border-r p-6 flex flex-col items-center text-center space-y-4 shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-white p-3 border shadow-inner flex items-center justify-center">
                    <img src={fb.schoolLogo} alt="School" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-black text-primary text-sm uppercase leading-tight">{fb.schoolName}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1">Institutional Node</p>
                  </div>
                  <div className="pt-4 border-t border-accent/50 w-full">
                    <Badge 
                      variant={fb.status === 'Resolved' ? 'secondary' : (fb.status === 'New' ? 'default' : 'outline')} 
                      className={cn(
                        "w-full justify-center py-1 font-black uppercase text-[9px]",
                        fb.status === 'Resolved' ? "bg-green-100 text-green-700" : ""
                      )}
                    >
                      {fb.status}
                    </Badge>
                  </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-6 md:p-8 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary shadow-lg">
                        <AvatarImage src={fb.senderAvatar} />
                        <AvatarFallback className="bg-primary text-white font-bold">{fb.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-primary">{fb.senderName}</span>
                          <Badge className="bg-secondary text-primary border-none text-[8px] h-4 font-black uppercase px-2">{fb.senderRole}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {fb.date}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full hover:bg-destructive/5 text-destructive/20 hover:text-destructive"
                      onClick={() => handleDelete(fb.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-black text-primary leading-tight">{fb.subject}</h2>
                    <div className="bg-white/50 border border-accent rounded-2xl p-6 relative">
                      <div className="absolute -top-3 left-6 bg-white px-2 text-[9px] font-black uppercase text-muted-foreground">Message Body</div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{fb.message}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                       <ShieldCheck className="w-4 h-4 text-green-600" />
                       <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Node Verified</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-6 font-bold"
                        onClick={() => handleArchive(fb.id)}
                      >
                        Archive Ticket
                      </Button>
                      <Button 
                        className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg"
                        onClick={() => handleResolve(fb.id)}
                        disabled={fb.status === 'Resolved'}
                      >
                        <CheckCircle2 className="w-4 h-4" /> 
                        {fb.status === 'Resolved' ? 'Resolved' : 'Resolve Support'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {feedbacks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white/50 rounded-3xl border-2 border-dashed">
              <MessageSquare className="w-16 h-16 text-primary/10" />
              <div>
                <h3 className="text-xl font-bold text-primary">All clear!</h3>
                <p className="text-muted-foreground">No active support tickets in the queue.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary font-headline">Contact Support</h1>
        <p className="text-muted-foreground mt-1">Send feedback or report an issue directly to the SaaS administrator.</p>
      </div>

      <Card className="border-none shadow-xl">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>We value your suggestions and use them to improve the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              placeholder="What is this about?" 
              value={newFeedback.subject}
              onChange={(e) => setNewFeedback({...newFeedback, subject: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Describe your issue or suggestion in detail..." 
              className="min-h-[200px]"
              value={newFeedback.message}
              onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full gap-2 h-12 shadow-lg" 
            onClick={handleSendFeedback}
            disabled={isSending || !newFeedback.message}
          >
            {isSending ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Feedback
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
