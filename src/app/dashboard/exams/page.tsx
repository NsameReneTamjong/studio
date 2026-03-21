
"use client";

import { useState, useEffect } from "react";
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
  ChevronLeft,
  MapPin,
  ShieldCheck,
  Building2,
  CalendarDays
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock Subjects for Automatic Teacher Suggestion
const SUBJECT_METADATA = [
  { name: "Mathematics", teacher: "Prof. Sarah Smith" },
  { name: "Advanced Physics", teacher: "Dr. Aris Tesla" },
  { name: "English Literature", teacher: "Ms. Bennet" },
  { name: "General Chemistry", teacher: "Dr. White" },
];

const CLASSES = ["Form 5 / 2nde", "Lower Sixth / 1ère", "Upper Sixth / Terminale"];
const ROOMS = ["Hall A", "Hall B", "Science Lab 1", "Room 402", "Library Wing"];

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

const INITIAL_ONSITE_EXAMS = [
  { id: 'OE1', title: 'Mathematics Paper 1', class: 'Form 5 / 2nde', room: 'Hall A', date: '2024-06-10', time: '08:00 AM', teacher: 'Prof. Sarah Smith', status: 'Scheduled' },
  { id: 'OE2', title: 'Physics Theory & Lab', class: 'Lower Sixth / 1ère', room: 'Science Lab 1', date: '2024-06-12', time: '10:30 AM', teacher: 'Dr. Aris Tesla', status: 'Scheduled' },
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
];

export default function ExamsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isCreatingOnline, setIsCreatingOnline] = useState(false);
  const [isSchedulingOnsite, setIsSchedulingOnsite] = useState(false);
  const [onsiteExams, setOnsiteExams] = useState(INITIAL_ONSITE_EXAMS);
  const [selectedExamResults, setSelectedExamResults] = useState<any>(null);

  // Onsite Scheduling Form State
  const [onsiteFormData, setOnsiteFormData] = useState({
    title: "",
    subject: "",
    class: "",
    room: "",
    date: "",
    time: "",
    teacher: ""
  });

  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isTeacher = user?.role === "TEACHER" || isAdmin;

  // Auto-assign teacher when subject changes
  useEffect(() => {
    const meta = SUBJECT_METADATA.find(s => s.name === onsiteFormData.subject);
    if (meta) {
      setOnsiteFormData(prev => ({ ...prev, teacher: meta.teacher }));
    }
  }, [onsiteFormData.subject]);

  const handleCreateOnlineExam = () => {
    toast({ title: "Online Exam Scheduled", description: "Successfully added to the portal." });
    setIsCreatingOnline(false);
  };

  const handleScheduleOnsite = () => {
    if (!onsiteFormData.title || !onsiteFormData.class || !onsiteFormData.room) {
      toast({ variant: "destructive", title: "Error", description: "Please complete all fields." });
      return;
    }
    
    const newExam = {
      id: `OE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...onsiteFormData,
      status: 'Scheduled'
    };

    setOnsiteExams(prev => [newExam, ...prev]);
    setIsSchedulingOnsite(false);
    toast({
      title: "Onsite Exam Scheduled",
      description: `Exam for ${onsiteFormData.class} has been confirmed. ${onsiteFormData.teacher} has been assigned as invigilator.`,
    });
  };

  const filteredSubmissions = selectedExamResults 
    ? MOCK_SUBMISSIONS.filter(s => s.examId === selectedExamResults.id)
    : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <PenTool className="w-6 h-6 text-secondary" />
            </div>
            {t("exams")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Oversee institutional assessment calendars, invigilation duty, and results."
              : "Access your scheduled exams and achievement records."
            }
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={isSchedulingOnsite} onOpenChange={setIsSchedulingOnsite}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20">
                  <CalendarDays className="w-5 h-5 text-primary" /> Schedule Onsite
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Schedule Onsite Exam</DialogTitle>
                  <DialogDescription className="text-white/60">Configure a physical examination session. The system will automatically assign the subject teacher for invigilation.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exam Title</Label>
                      <Input 
                        placeholder="e.g. End of Term Theory" 
                        className="h-12 bg-accent/30 border-none rounded-xl"
                        value={onsiteFormData.title}
                        onChange={(e) => setOnsiteFormData({...onsiteFormData, title: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Class</Label>
                      <Select onValueChange={(v) => setOnsiteFormData({...onsiteFormData, class: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</Label>
                      <Select onValueChange={(v) => setOnsiteFormData({...onsiteFormData, subject: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_METADATA.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {onsiteFormData.teacher && (
                      <div className="col-span-2 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
                        <div className="p-2 bg-primary rounded-lg text-white">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Assigned Invigilator</p>
                          <p className="font-bold text-primary">{onsiteFormData.teacher}</p>
                        </div>
                        <Badge className="bg-secondary text-primary border-none">AUTOMATIC</Badge>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Venue / Room</Label>
                      <Select onValueChange={(v) => setOnsiteFormData({...onsiteFormData, room: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl">
                          <SelectValue placeholder="Select Venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROOMS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Exam Date</Label>
                      <Input 
                        type="date" 
                        className="h-12 bg-accent/30 border-none rounded-xl"
                        onChange={(e) => setOnsiteFormData({...onsiteFormData, date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                  <Button variant="ghost" className="flex-1 rounded-xl h-12" onClick={() => setIsSchedulingOnsite(false)}>Cancel</Button>
                  <Button onClick={handleScheduleOnsite} className="flex-1 rounded-xl h-12 shadow-lg font-bold">Confirm Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreatingOnline} onOpenChange={setIsCreatingOnline}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl">
                  <Plus className="w-5 h-5" /> Create MCQ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">New Online MCQ</DialogTitle>
                  <DialogDescription className="text-white/60">Setup an automated assessment for the student portal.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Exam Title</Label>
                      <Input placeholder="e.g. Sequence 1 Physics" className="bg-accent/30 border-none h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input placeholder="e.g. Physics" className="bg-accent/30 border-none h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("startTime")}</Label>
                      <Input type="datetime-local" className="bg-accent/30 border-none h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("duration")} ({t("minutes")})</Label>
                      <Input type="number" placeholder="45" className="bg-accent/30 border-none h-11" />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleCreateOnlineExam} className="w-full h-12 font-bold shadow-lg">Save & Publish MCQ</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="onsite" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="onsite" className="gap-2 py-3 rounded-xl transition-all">
            <CalendarDays className="w-4 h-4" /> Onsite Schedule
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2 py-3 rounded-xl transition-all">
            <PenTool className="w-4 h-4" /> Live MCQs
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2 py-3 rounded-xl transition-all">
            <Award className="w-4 h-4" /> Results Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onsite" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {onsiteExams.map((exam) => (
              <Card key={exam.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="bg-accent/30 p-4 border-b flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
                    {exam.class}
                  </Badge>
                  <Badge className="bg-primary text-white border-none font-bold text-[9px] px-3">{exam.status}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-black text-primary">{exam.title}</CardTitle>
                  <CardDescription className="font-bold flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" /> {exam.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Venue
                      </p>
                      <p className="text-xs font-black">{exam.room}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Date & Time
                      </p>
                      <p className="text-xs font-black">{exam.date} • {exam.time}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-accent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-lg text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Invigilator</p>
                        <p className="text-sm font-bold text-primary">{exam.teacher}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                {isAdmin && (
                  <CardFooter className="bg-accent/10 border-t pt-4">
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-white text-primary">
                      Manage Duty & Venue
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_EXAMS.map((exam) => (
              <Card key={exam.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all relative">
                <div className={cn(
                  "absolute top-0 left-0 w-1.5 h-full",
                  exam.status === 'active' ? "bg-green-500" : "bg-blue-500"
                )} />
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
                      {exam.subject}
                    </Badge>
                    <Badge variant={exam.status === 'active' ? 'default' : 'secondary'} className={cn(
                      "text-[10px] uppercase font-black border-none h-5 px-3",
                      exam.status === 'active' && "bg-green-600 animate-pulse"
                    )}>
                      {exam.status === 'active' ? 'LIVE NOW' : 'UPCOMING'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black text-primary group-hover:text-primary transition-colors">{exam.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 font-medium">
                    <User className="w-3 h-3" /> By {exam.teacher}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {t("duration")}
                      </p>
                      <p className="text-xs font-bold">{exam.duration} {t("minutes")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest flex items-center gap-1">
                        <FileText className="w-3 h-3" /> {t("questions")}
                      </p>
                      <p className="text-xs font-bold">{exam.questionCount} MCQs</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] uppercase text-muted-foreground font-black tracking-widest flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3" /> Start Window
                    </p>
                    <p className="text-[11px] font-bold text-primary">{new Date(exam.startTime).toLocaleString()}</p>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/30 border-t border-accent/50 pt-4">
                  {isAdmin ? (
                    <Button variant="ghost" className="w-full justify-between hover:bg-white text-primary font-black text-[10px] uppercase tracking-widest">
                      Edit MCQ Bank
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      className={cn("w-full gap-2 shadow-sm font-bold", exam.status !== 'active' && "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted")}
                      disabled={exam.status !== 'active'}
                      asChild
                    >
                      <Link href={exam.status === 'active' ? `/dashboard/exams/take?id=${exam.id}` : "#"}>
                        <CheckCircle2 className="w-4 h-4" /> Start Exam
                      </Link>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-6">
            {!selectedExamResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-none shadow-sm bg-primary text-white">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase font-black text-white/60 tracking-widest">Avg. Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black">84.5%</div>
                      <p className="text-[10px] opacity-60 flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3"/> Global Trend</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase font-black text-muted-foreground tracking-widest">Passing Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-green-600">92%</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Institutional target met</p>
                    </CardContent>
                  </Card>
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs uppercase font-black text-muted-foreground tracking-widest">Total Audited</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black text-primary">1,240</div>
                      <p className="text-[10px] text-muted-foreground mt-1">Academic Year 2023/24</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-black text-primary flex items-center gap-2">
                    <Award className="w-5 h-5 text-secondary" /> Historical Exam Directory
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COMPLETED_EXAMS_DIRECTORY.map((ex) => (
                      <Card key={ex.id} className="border-none shadow-lg group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer bg-white" onClick={() => setSelectedExamResults(ex)}>
                        <CardHeader className="pb-3 bg-accent/30 border-b">
                          <Badge variant="outline" className="w-fit mb-2 text-[9px] font-black border-primary/20 text-primary uppercase">{ex.subject}</Badge>
                          <CardTitle className="text-lg font-black group-hover:text-primary transition-colors">{ex.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date Recorded:</span>
                            <span className="font-bold">{ex.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Submissions:</span>
                            <span className="font-bold text-primary">{ex.submissions} students</span>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-colors h-9 gap-2 font-black text-[10px] uppercase tracking-widest">
                            View Performance Ledger <ChevronRight className="w-4 h-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" className="gap-2 hover:bg-accent font-bold" onClick={() => setSelectedExamResults(null)}>
                    <ChevronLeft className="w-4 h-4" /> Back to Directory
                  </Button>
                  <Button variant="outline" className="gap-2 shadow-sm font-bold">
                    <Printer className="w-4 h-4" /> Print Registry
                  </Button>
                </div>

                <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                  <CardHeader className="bg-primary text-white border-b flex flex-row items-center justify-between p-8">
                    <div>
                      <CardTitle className="text-3xl font-black flex items-center gap-2 text-white">
                        <BarChart3 className="w-8 h-8 text-secondary" />
                        {selectedExamResults.title}
                      </CardTitle>
                      <CardDescription className="text-white/60 font-bold text-lg">
                        {selectedExamResults.subject} • Official Academic Ledger
                      </CardDescription>
                    </div>
                    <Badge className="bg-white/20 text-white border-none h-8 px-6 text-sm font-black">{filteredSubmissions.length} Registered Records</Badge>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                          <TableHead className="pl-8 py-6">Student Profile</TableHead>
                          <TableHead className="text-center">Score Card</TableHead>
                          <TableHead className="text-center">Percentage</TableHead>
                          <TableHead className="text-center">Validation Status</TableHead>
                          <TableHead className="text-right pr-8">Audit Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSubmissions.map((sub) => (
                          <TableRow key={sub.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                            <TableCell className="pl-8 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                                  <AvatarImage src={sub.studentAvatar} />
                                  <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase">
                                    {sub.studentName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm text-primary leading-none mb-1">{sub.studentName}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Matricule: {sub.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="inline-flex items-baseline gap-1">
                                <span className="text-lg font-black text-primary">{sub.score}</span>
                                <span className="text-xs font-bold text-muted-foreground">/ {sub.total}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-mono font-black text-primary">
                              {Math.round((sub.score / sub.total) * 100)}%
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={cn(
                                "text-[10px] font-black uppercase tracking-widest border-none px-4",
                                sub.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              )}>
                                {sub.passed ? 'PASSED' : 'RETAKE'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8 font-mono text-[10px] text-muted-foreground uppercase font-black">
                              {sub.date}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
