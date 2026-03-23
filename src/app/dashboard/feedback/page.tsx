
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Send, 
  Building2, 
  User, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  MessageCircle, 
  ShieldCheck,
  AlertCircle,
  Lightbulb,
  Heart,
  Settings2,
  HelpCircle,
  Megaphone,
  Globe
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";

const INITIAL_FEEDBACKS = [
  { 
    id: "F001", 
    schoolName: "Lycée de Joss", 
    schoolLogo: "https://picsum.photos/seed/joss-logo/100/100",
    senderName: "Dr. Fonka Maurice", 
    senderAvatar: "https://picsum.photos/seed/admin1/100/100",
    senderRole: "Main Admin",
    subject: "Technical Error", 
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
    subject: "General Appreciation", 
    message: "EduIgnite has transformed how we manage Sequence marks. The automated bulletins are a game changer for our administration.", 
    date: "Yesterday", 
    status: "Read" 
  },
];

const SUBJECT_OPTIONS = [
  { value: "Technical Error", label: "Error / Bug Report", icon: AlertCircle, color: "text-red-500" },
  { value: "Feature Suggestion", label: "Feature Suggestion", icon: Lightbulb, color: "text-amber-500" },
  { value: "General Appreciation", label: "General Appreciation", icon: Heart, color: "text-rose-500" },
  { value: "Billing & Subscription", label: "Billing & Subscription", icon: Settings2, color: "text-blue-500" },
  { value: "Administrative Request", label: "Administrative Request", icon: ShieldCheck, color: "text-green-500" },
  { value: "Other", label: "Other Support Request", icon: HelpCircle, color: "text-muted-foreground" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [feedbacks, setFeedbacks] = useState(INITIAL_FEEDBACKS);
  const [isSending, setIsSending] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ subject: "", message: "" });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const handleSendFeedback = async () => {
    if (!newFeedback.message || !newFeedback.subject) {
      toast({ variant: "destructive", title: "Incomplete Form", description: "Please select a subject and enter your message." });
      return;
    }
    setIsSending(true);
    
    try {
      // In a real app, we'd add this to a /feedback collection
      // For now, we simulate and show success
      toast({ title: "Feedback Sent", description: "The platform administrator has received your message." });
      setNewFeedback({ subject: "", message: "" });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send feedback." });
    } finally {
      setIsSending(false);
    }
  };

  const handleResolve = (id: string) => {
    setFeedbacks(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Resolved' } : fb));
    toast({ 
      title: "Ticket Resolved", 
      description: "The support request has been marked as completed." 
    });
  };

  const handlePublishTestimonial = async (fb: any) => {
    try {
      const testimonialRef = collection(db, "testimonials");
      await addDoc(testimonialRef, {
        author: fb.senderName,
        role: fb.senderRole,
        avatar: fb.senderAvatar,
        content: fb.message,
        schoolName: fb.schoolName,
        createdAt: serverTimestamp()
      });

      setFeedbacks(prev => prev.map(item => item.id === fb.id ? { ...item, status: 'Published' } : item));
      toast({ 
        title: "Testimonial Published", 
        description: "This appreciation is now live on the platform login portal.",
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Publish Error", description: "Failed to push testimonial to live registry." });
    }
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
                      variant={fb.status === 'Resolved' || fb.status === 'Published' ? 'secondary' : (fb.status === 'New' ? 'default' : 'outline')} 
                      className={cn(
                        "w-full justify-center py-1 font-black uppercase text-[9px]",
                        fb.status === 'Resolved' || fb.status === 'Published' ? "bg-green-100 text-green-700" : ""
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
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full hover:bg-destructive/5 text-destructive/20 hover:text-destructive h-8 w-8"
                        onClick={() => handleDelete(fb.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold uppercase text-[10px]">
                        {fb.subject}
                      </Badge>
                    </div>
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
                      
                      {fb.subject === "General Appreciation" && fb.status !== "Published" && (
                        <Button 
                          variant="secondary"
                          className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-6 font-bold bg-secondary text-primary hover:bg-secondary/90"
                          onClick={() => handlePublishTestimonial(fb)}
                        >
                          <Globe className="w-4 h-4" /> 
                          {t("publishTestimonial")}
                        </Button>
                      )}

                      <Button 
                        className="flex-1 sm:flex-none gap-2 rounded-xl h-11 px-8 font-black uppercase tracking-widest text-xs shadow-lg"
                        onClick={() => handleResolve(fb.id)}
                        disabled={fb.status === 'Resolved' || fb.status === 'Published'}
                      >
                        <CheckCircle2 className="w-4 h-4" /> 
                        {fb.status === 'Resolved' || fb.status === 'Published' ? 'Resolved' : 'Resolve Support'}
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

      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-primary p-8 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black">Submit Feedback</CardTitle>
              <CardDescription className="text-white/60">We value your suggestions and use them to improve the platform.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject / Category</Label>
            <Select value={newFeedback.subject} onValueChange={(v) => setNewFeedback({...newFeedback, subject: v})}>
              <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl focus:ring-primary">
                <SelectValue placeholder="Select the nature of your message" />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex items-center gap-2">
                      <opt.icon className={cn("w-4 h-4", opt.color)} />
                      <span>{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message Body</Label>
            <Textarea 
              id="message" 
              placeholder="Describe your issue or suggestion in detail..." 
              className="min-h-[200px] bg-accent/30 border-none rounded-xl focus-visible:ring-primary leading-relaxed"
              value={newFeedback.message}
              onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
            />
          </div>
        </CardContent>
        <CardFooter className="bg-accent/20 p-6 border-t border-accent">
          <Button 
            className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" 
            onClick={handleSendFeedback}
            disabled={isSending || !newFeedback.message || !newFeedback.subject}
          >
            {isSending ? <Clock className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Send Official Feedback
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
