
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  FileText, 
  Clock, 
  BookOpen,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitAssignmentPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("id");
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const handlePageSubmit = () => {
    if (!content) return;
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      toast({
        title: t("submitted"),
        description: language === 'en' ? "Your work has been successfully uploaded." : "Votre travail a été téléchargé avec succès.",
      });
      router.push("/dashboard/assignments");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary font-headline">
             {language === 'en' ? 'Submit Your Work' : 'Rendre votre travail'}
          </h1>
          <p className="text-sm text-muted-foreground">Thermodynamics Problems Set • Advanced Physics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("submitAssignment")}</CardTitle>
              <CardDescription>Enter your response or attach a document below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{language === 'en' ? 'Your Response' : 'Votre Réponse'}</Label>
                <Textarea 
                  placeholder="Type your answer or project summary here..." 
                  className="min-h-[250px] bg-accent/30 border-none focus-visible:ring-primary"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2"><Paperclip className="w-4 h-4"/> {language === 'en' ? 'Attachments' : 'Pièces jointes'}</Label>
                <div className="border-2 border-dashed border-accent rounded-xl p-8 text-center bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Paperclip className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold">{language === 'en' ? 'Click to upload files' : 'Cliquez pour charger des fichiers'}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">PDF, DOCX, ZIP or Images (Max 10MB)</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/10 border-t p-6">
              <Button 
                className="w-full h-12 text-base font-bold shadow-lg gap-2" 
                onClick={handlePageSubmit}
                disabled={loading || !content}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {language === 'en' ? 'Submit Assignment' : 'Rendre le Devoir'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-base text-white">{language === 'en' ? 'Task Info' : 'Infos de la tâche'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">{t("dueDate")}</p>
                    <p className="text-sm font-bold">May 30, 2024</p>
                    <p className="text-[10px] opacity-60">11:59 PM</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <BookOpen className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Subject</p>
                    <p className="text-sm font-bold">Advanced Physics</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <User className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Teacher</p>
                    <p className="text-sm font-bold">Dr. Aris Tesla</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-start gap-2 text-[10px] italic opacity-70">
                  <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                  <p>Once submitted, you cannot edit your work until the teacher unlocks it.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-accent/30">
              <CardTitle className="text-sm">Grading Rubric</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span>Accuracy</span>
                <span className="font-bold">10 pts</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Methodology</span>
                <span className="font-bold">5 pts</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Presentation</span>
                <span className="font-bold">5 pts</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
