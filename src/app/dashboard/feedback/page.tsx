
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, Building2, User, Clock, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const MOCK_FEEDBACKS = [
  { id: "F001", school: "Lycée de Joss", sender: "John Admin", subject: "Server Latency", message: "We are experiencing slow response times during peak sequence entry hours.", date: "2h ago", status: "New" },
  { id: "F002", school: "GBHS Yaoundé", sender: "Sarah Smith", subject: "Feature Request", message: "Can we add a field for student disciplinary records in the report card?", date: "Yesterday", status: "Read" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
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

  if (isSuperAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">School Feedback</h1>
          <p className="text-muted-foreground mt-1">Review issues and suggestions reported by school administrators.</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_FEEDBACKS.map((fb) => (
            <Card key={fb.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{fb.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-bold text-primary"><Building2 className="w-3 h-3"/> {fb.school}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3"/> {fb.sender}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {fb.date}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={fb.status === 'New' ? 'default' : 'secondary'}>{fb.status}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground bg-accent/10 p-4 rounded-lg border border-accent italic">
                  "{fb.message}"
                </p>
              </CardContent>
              <CardFooter className="justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm" className="gap-2"><CheckCircle2 className="w-4 h-4" /> Mark as Resolved</Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
              </CardFooter>
            </Card>
          ))}
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
