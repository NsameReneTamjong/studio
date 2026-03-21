
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Clock, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  Timer,
  BookOpen,
  FileText,
  Printer,
  Users,
  TrendingUp,
  User,
  XCircle,
  BarChart3,
  ArrowLeft,
  ChevronLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock Data
const MOCK_EXAMS = [
  { 
    id: "E001", 
    title: "Mid-Term Physics MCQ", 
    subject: "Advanced Physics", 
    teacher: "Dr. Tesla", 
    startTime: "2024-05-30T10:00:00Z", 
    duration: 45, 
    questionCount: 20,
    status: "upcoming"
  },
  { 
    id: "E002", 
    title: "Calculus Quiz 1", 
    subject: "Mathematics", 
    teacher: "Prof. Smith", 
    startTime: "2024-05-25T08:30:00Z", 
    duration: 30, 
    questionCount: 15,
    status: "active"
  }
];

const COMPLETED_EXAMS_DIRECTORY = [
  { id: "E001", title: "Mid-Term Physics MCQ", subject: "Advanced Physics", date: "May 14, 2024", submissions: 42 },
  { id: "E003", title: "Unit 1: English Poetry", subject: "English", date: "May 12, 2024", submissions: 38 },
  { id: "E004", title: "Chemical Bonds Basic", subject: "Chemistry", date: "May 08, 2024", submissions: 35 },
];

const MOCK_SUBMISSIONS = [
  { 
    id: "S1", 
    examId: "E003",
    examTitle: "Unit 1: English Poetry", 
    score: 18, 
    total: 20, 
    passed: true, 
    date: "May 12, 2024",
    studentName: "Alice Thompson",
    studentAvatar: "https://picsum.photos/seed/s1/100/100"
  },
  { 
    id: "S2", 
    examId: "E004",
    examTitle: "Chemical Bonds Basic", 
    score: 12, 
    total: 20, 
    passed: false, 
    date: "May 08, 2024",
    studentName: "Bob Richards",
    studentAvatar: "https://picsum.photos/seed/s2/100/100"
  },
  { 
    id: "S3", 
    examId: "E003",
    examTitle: "Unit 1: English Poetry", 
    score: 15, 
    total: 20, 
    passed: true, 
    date: "May 12, 2024",
    studentName: "Diana Prince",
    studentAvatar: "https://picsum.photos/seed/s4/100/100"
  },
  { 
    id: "S4", 
    examId: "E001",
    examTitle: "Mid-Term Physics MCQ", 
    score: 19, 
    total: 20, 
    passed: true, 
    date: "May 14, 2024",
    studentName: "Charlie Davis",
    studentAvatar: "https://picsum.photos/seed/s3/100/100"
  }
];

export default function ExamsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [selectedExamResults, setSelectedExamResults] = useState<typeof COMPLETED_EXAMS_DIRECTORY[0] | null>(null);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleCreateExam = () => {
    toast({
      title: t("save"),
      description: language === 'en' ? "Exam has been scheduled successfully." : "L'examen a été programmé avec succès.",
    });
    setIsCreating(false);
  };

  const filteredSubmissions = selectedExamResults 
    ? MOCK_SUBMISSIONS.filter(s => s.examId === selectedExamResults.id)
    : [];

  const CertificateCard = ({ submission }: { submission: typeof MOCK_SUBMISSIONS[0] }) => (
    <Card className="border-none shadow-sm overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all">
      <div className="bg-primary p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-secondary" />
          <span className="text-xs font-bold uppercase tracking-wider">{t("certificate")}</span>
        </div>
        <Badge variant="outline" className="text-white border-white/20 text-[10px]">
          {submission.date}
        </Badge>
      </div>
      <CardContent className="p-6 text-center space-y-4">
        <div className="space-y-1">
          <h4 className="font-bold text-lg text-primary">{submission.examTitle}</h4>
          <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{t("passed")}</p>
        </div>
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">{t("score")}</p>
            <p className="text-2xl font-black text-primary">{submission.score}/{submission.total}</p>
          </div>
          <div className="h-10 w-px bg-accent" />
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Grade</p>
            <p className="text-2xl font-black text-secondary">A+</p>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2 text-primary" asChild>
          <Link href={`/dashboard/exams/results?id=${submission.id}`}>
            <Printer className="w-4 h-4" /> {language === 'en' ? 'View & Print' : 'Voir & Imprimer'}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
            <PenTool className="w-8 h-8 text-secondary" />
            {t("exams")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher 
              ? (language === 'en' ? "Manage online assessments and question banks." : "Gérez les évaluations en ligne et les banques de questions.")
              : (language === 'en' ? "Access scheduled exams and view your achievement certificates." : "Accédez aux examens programmés et consultez vos certificats.")
            }
          </p>
        </div>

        {isTeacher && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg h-11">
                <Plus className="w-4 h-4" /> {t("createExam")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("createExam")}</DialogTitle>
                <CardDescription>Setup a new online MCQ assessment for your institution.</CardDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Exam Title' : 'Titre de l\'examen'}</Label>
                  <Input placeholder="e.g. Sequence 1 Physics" />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'en' ? 'Subject' : 'Matière'}</Label>
                  <Input placeholder="e.g. Physics" />
                </div>
                <div className="space-y-2">
                  <Label>{t("startTime")}</Label>
                  <Input type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label>{t("duration")} ({t("minutes")})</Label>
                  <Input type="number" placeholder="45" />
                </div>
                <div className="col-span-2 space-y-2">
                   <div className="flex items-center justify-between">
                     <Label>{t("questions")}</Label>
                     <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Plus className="w-3 h-3 mr-1"/> Add MCQ</Button>
                   </div>
                   <div className="border rounded-xl p-4 bg-accent/10 italic text-center text-sm text-muted-foreground">
                      No questions added yet. Use the "Add MCQ" button above to start building your exam.
                   </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>{t("cancel")}</Button>
                <Button onClick={handleCreateExam}>{t("save")}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="available" onValueChange={(val) => {
        setActiveTab(val);
        if (val !== 'results') setSelectedExamResults(null);
      }} className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1">
          <TabsTrigger value="available" className="gap-2 py-2">
            <Calendar className="w-4 h-4" /> {isTeacher ? t("exams") : language === 'en' ? 'Available' : 'Disponibles'}
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2 py-2">
            <Award className="w-4 h-4" /> {t("examResults")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_EXAMS.map((exam) => (
              <Card key={exam.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative">
                <div className={cn(
                  "absolute top-0 left-0 w-1 h-full",
                  exam.status === 'active' ? "bg-green-500" : "bg-blue-500"
                )} />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                      {exam.subject}
                    </Badge>
                    <Badge variant={exam.status === 'active' ? 'default' : 'secondary'} className={cn(
                      "text-[10px] uppercase font-bold border-none",
                      exam.status === 'active' && "bg-green-600 animate-pulse"
                    )}>
                      {exam.status === 'active' ? (language === 'en' ? 'LIVE NOW' : 'EN COURS') : (language === 'en' ? 'UPCOMING' : 'À VENIR')}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{exam.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {exam.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {t("duration")}
                      </p>
                      <p className="text-sm font-bold">{exam.duration} {t("minutes")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {t("questions")}
                      </p>
                      <p className="text-sm font-bold">{exam.questionCount} MCQs</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> {t("startTime")}
                    </p>
                    <p className="text-xs font-medium">{new Date(exam.startTime).toLocaleString(language === 'en' ? 'en-US' : 'fr-FR')}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4">
                  {isTeacher ? (
                    <Button variant="ghost" className="w-full justify-between hover:bg-white text-primary">
                      {language === 'en' ? 'Edit Questions' : 'Modifier les Questions'}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      className={cn("w-full gap-2 shadow-sm", exam.status !== 'active' && "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted")}
                      disabled={exam.status !== 'active'}
                      asChild
                    >
                      <Link href={exam.status === 'active' ? `/dashboard/exams/take?id=${exam.id}` : "#"}>
                        <CheckCircle2 className="w-4 h-4" /> {t("takeExam")}
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0">
          {isTeacher ? (
            <div className="space-y-6">
              {!selectedExamResults ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-none shadow-sm bg-primary text-white">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase font-bold text-white/60 tracking-widest">Avg. Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black">84.5%</div>
                        <p className="text-[10px] opacity-60 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3"/> +2.4% from last period</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Passing Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black text-green-600">92%</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Institutional target met</p>
                      </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Recent Submissions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-black text-primary">115</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Within last 30 days</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> Completed Exams (Past 30 Days)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {COMPLETED_EXAMS_DIRECTORY.map((ex) => (
                        <Card key={ex.id} className="border-none shadow-lg group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer bg-white" onClick={() => setSelectedExamResults(ex)}>
                          <CardHeader className="pb-3 bg-accent/30 border-b">
                            <Badge variant="outline" className="w-fit mb-2 text-[10px] border-primary/20 text-primary">{ex.subject}</Badge>
                            <CardTitle className="text-lg font-black group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date:</span>
                              <span className="font-bold">{ex.date}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Submissions:</span>
                              <span className="font-bold text-primary">{ex.submissions} students</span>
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0 pb-4">
                            <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-colors h-9 gap-2">
                              View Results <ChevronRight className="w-4 h-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" className="gap-2 hover:bg-accent" onClick={() => setSelectedExamResults(null)}>
                      <ChevronLeft className="w-4 h-4" /> Back to Directory
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2 shadow-sm">
                        <Printer className="w-4 h-4" /> Print Results
                      </Button>
                    </div>
                  </div>

                  <Card className="border-none shadow-xl overflow-hidden">
                    <CardHeader className="bg-primary text-white border-b flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <BarChart3 className="w-5 h-5 text-secondary" />
                          Results: {selectedExamResults.title}
                        </CardTitle>
                        <CardDescription className="text-white/60">
                          {selectedExamResults.subject} • Completed on {selectedExamResults.date}
                        </CardDescription>
                      </div>
                      <Badge className="bg-white/20 text-white border-none">{filteredSubmissions.length} Records</Badge>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                            <TableHead className="pl-6 py-4">Student Profile</TableHead>
                            <TableHead className="text-center">Score Card</TableHead>
                            <TableHead className="text-center">Percentage</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right pr-6">Date Recorded</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSubmissions.map((sub) => (
                            <TableRow key={sub.id} className="hover:bg-accent/5">
                              <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={sub.studentAvatar} />
                                    <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                      {sub.studentName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-sm text-primary leading-none mb-1">{sub.studentName}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Matricule: {sub.id}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="inline-flex items-baseline gap-1">
                                  <span className="text-base font-black text-primary">{sub.score}</span>
                                  <span className="text-[10px] font-bold text-muted-foreground">/ {sub.total}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center font-mono font-bold text-primary">
                                {Math.round((sub.score / sub.total) * 100)}%
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={cn(
                                  "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                                  sub.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                  {sub.passed ? 'PASSED' : 'FAILED'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-6 font-mono text-[10px] text-muted-foreground uppercase font-bold">
                                {sub.date}
                              </TableCell>
                            </TableRow>
                          ))}
                          {filteredSubmissions.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                                No submissions found for this exam.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {MOCK_SUBMISSIONS.filter(s => s.passed).map((sub) => (
                <CertificateCard key={sub.id} submission={sub} />
              ))}
              
              <Card className="md:col-span-full border-none bg-accent/20 border border-accent">
                 <CardHeader>
                   <CardTitle className="text-lg">Recent Scorecard</CardTitle>
                   <CardDescription>View performance for all attempts.</CardDescription>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="space-y-1">
                      {MOCK_SUBMISSIONS.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between p-4 bg-white border-b last:border-0">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-2 rounded-lg",
                              sub.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {sub.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 opacity-40" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{sub.examTitle}</p>
                              <p className="text-[10px] text-muted-foreground uppercase">{sub.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-bold text-primary">{sub.score}/{sub.total}</p>
                              <Badge variant={sub.passed ? "default" : "destructive"} className="text-[9px] h-4">
                                {sub.passed ? t("passed") : t("failed")}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                               <Link href={`/dashboard/exams/results?id=${sub.id}`}>
                                  <ChevronRight className="w-4 h-4" />
                               </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
