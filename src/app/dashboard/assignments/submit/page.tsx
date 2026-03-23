
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
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SubmitAssignmentPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get("id");
  const { toast } = useToast();
  const db = useFirestore();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const assignmentRef = useMemoFirebase(() => {
    if (!db || !user?.schoolId || !assignmentId) return null;
    return doc(db, "schools", user.schoolId, "assignments", assignmentId);
  }, [db, user?.schoolId, assignmentId]);
  const { data: assignment, isLoading: isTaskLoading } = useDoc(assignmentRef);

  const existingSubmissionRef = useMemoFirebase(() => {
    if (!db || !user?.schoolId || !assignmentId) return null;
    return doc(db, "schools", user.schoolId, "assignments", assignmentId, "submissions", user.uid);
  }, [db, user?.schoolId, assignmentId, user?.uid]);
  const { data: submission } = useDoc(existingSubmissionRef);

  const handlePageSubmit = async () => {
    if (!content || !user?.schoolId || !assignmentId) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "schools", user.schoolId, "assignments", assignmentId, "submissions", user.uid), {
        studentUid: user.uid,
        studentName: user.name,
        studentMatricule: user.id,
        content,
        submittedAt: serverTimestamp(),
        status: "submitted",
        assignmentId
      });
      toast({
        title: t("submitted"),
        description: "Your work has been successfully recorded.",
      });
      router.push("/dashboard/assignments");
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to upload submission." });
    } finally {
      setLoading(false);
    }
  };

  if (isTaskLoading) return <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>;
  if (!assignment) return <div className="text-center py-20">Assignment not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-primary font-headline">
             {language === 'en' ? 'Submission Portal' : 'Rendre votre travail'}
          </h1>
          <p className="text-sm text-muted-foreground">{assignment.title} • {assignment.courseName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg">{t("submitAssignment")}</CardTitle>
              <CardDescription>Enter your response or academic summary below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {submission ? (
                <div className="p-6 bg-green-50 rounded-2xl border border-green-100 space-y-4">
                  <div className="flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold">Work Submitted</span>
                  </div>
                  <p className="text-sm text-green-800 italic">"{submission.content}"</p>
                  {submission.status === 'graded' && (
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-[10px] uppercase font-black text-green-600">Teacher's Mark</p>
                      <p className="text-3xl font-black text-green-700">{submission.grade} / {assignment.maxMarks}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{language === 'en' ? 'Your Response' : 'Votre Réponse'}</Label>
                    <Textarea 
                      placeholder="Type your answer here..." 
                      className="min-h-[250px] bg-accent/30 border-none focus-visible:ring-primary"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            {!submission && (
              <CardFooter className="bg-accent/10 border-t p-6">
                <Button 
                  className="w-full h-12 text-base font-bold shadow-lg gap-2" 
                  onClick={handlePageSubmit}
                  disabled={loading || !content}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  Submit to Instructor
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-base text-white">Task Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <Clock className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Deadline</p>
                    <p className="text-sm font-bold">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="p-2 bg-white/10 rounded-lg h-fit">
                    <Award className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold opacity-60">Points Available</p>
                    <p className="text-sm font-bold">{assignment.maxMarks} Points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
