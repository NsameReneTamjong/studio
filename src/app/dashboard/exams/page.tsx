
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
  CalendarDays,
  LayoutGrid,
  Zap,
  Info,
  History,
  AlertCircle
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
  { name: "Mathematics", teacher: "Prof. Sarah Smith", id: "MAT101" },
  { name: "Advanced Physics", teacher: "Dr. Aris Tesla", id: "PHY101" },
  { name: "English Literature", teacher: "Ms. Bennet", id: "LIT101" },
  { name: "General Chemistry", teacher: "Dr. White", id: "CHM101" },
];

const CLASSES = ["Form 5 / 2nde", "Lower Sixth / 1ère", "Upper Sixth / Terminale"];
const ROOMS = ["Hall A", "Hall B", "Science Lab 1", "Room 402", "Library Wing"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = ["08:00 AM", "09:30 AM", "11:00 AM", "01:00 PM", "02:30 PM"];

const MOCK_ONLINE_EXAMS = [
  { 
    id: "E001", 
    title: "Quantum Mechanics Mid-Term", 
    subject: "Advanced Physics", 
    teacher: "Dr. Tesla", 
    startTime: new Date(Date.now() + 86400000).toISOString(), 
    endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    duration: 45, 
    questionCount: 20,
    status: "upcoming",
    instructions: "1. Ensure a stable internet connection. 2. Diagrams must be studied carefully before answering. 3. No external calculators allowed."
  },
  { 
    id: "E002", 
    title: "Calculus Differentiation Quiz", 
    subject: "Mathematics", 
    teacher: "Prof. Smith", 
    startTime: new Date(Date.now() - 1800000).toISOString(), 
    endTime: new Date(Date.now() + 1800000).toISOString(), 
    duration: 30, 
    questionCount: 15,
    status: "active",
    instructions: "Answer all questions correctly. Focus on limits and derivatives."
  },
  { 
    id: "E003", 
    title: "English Vocabulary Speedrun", 
    subject: "English Literature", 
    teacher: "Ms. Bennet", 
    startTime: new Date(Date.now() - 7200000).toISOString(), 
    endTime: new Date(Date.now() - 3600000).toISOString(), 
    duration: 15, 
    questionCount: 10,
    status: "cancelled", // Mocking a cancelled exam
    instructions: "Cancelled due to technical maintenance."
  }
];

const MOCK_EXAM_HISTORY = [
  { id: "H1", title: "Wave Motion Quiz", subject: "Physics", score: 18, total: 20, date: "May 12, 2024", teacher: "Dr. Tesla", status: "VERIFIED" },
  { id: "H2", title: "Algebra Sequence 1", subject: "Mathematics", score: 15, total: 20, date: "April 28, 2024", teacher: "Prof. Smith", status: "VERIFIED" },
  { id: "E003", title: "English Vocabulary Speedrun", subject: "English Literature", score: 0, total: 10, date: "Today", teacher: "Ms. Bennet", status: "CANCELLED" },
];

const INITIAL_ONSITE_EXAMS = [
  { id: 'OE1', title: 'Mathematics Paper 1', class: 'Form 5 / 2nde', room: 'Hall A', date: '2024-06-10', time: '08:00 AM', teacher: 'Prof. Sarah Smith', status: 'Scheduled' },
];

export default function ExamsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isDrawingTimetable, setIsDrawingTimetable] = useState(false);
  const [isSchedulingOnsite, setIsSchedulingOnsite] = useState(false);
  const [viewingInstructions, setViewingInstructions] = useState<any>(null);
  const [onsiteExams, setOnsiteExams] = useState(INITIAL_ONSITE_EXAMS);
  
  const [timetableFormData, setTimetableFormData] = useState({
    class: "",
    subject: "",
    day: "",
    time: "",
    room: "",
    teacher: ""
  });

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

  // Filter out cancelled or finished exams from the live list
  const currentTime = new Date();
  const activeExams = MOCK_ONLINE_EXAMS.filter(exam => {
    const end = new Date(exam.endTime);
    return end > currentTime && exam.status !== 'cancelled';
  });

  useEffect(() => {
    const meta = SUBJECT_METADATA.find(s => s.name === timetableFormData.subject);
    if (meta) {
      setTimetableFormData(prev => ({ ...prev, teacher: meta.teacher }));
    }
  }, [timetableFormData.subject]);

  useEffect(() => {
    const meta = SUBJECT_METADATA.find(s => s.name === onsiteFormData.subject);
    if (meta) {
      setOnsiteFormData(prev => ({ ...prev, teacher: meta.teacher }));
    }
  }, [onsiteFormData.subject]);

  const handleScheduleOnsite = () => {
    const newExam = {
      id: `OE-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      ...onsiteFormData,
      status: 'Scheduled'
    };
    setOnsiteExams(prev => [newExam, ...prev]);
    setIsSchedulingOnsite(false);
    toast({ title: "Onsite Exam Scheduled", description: `${onsiteFormData.teacher} assigned as invigilator.` });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <CalendarDays className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? 'Institutional Schedules' : 'Calendrier Institutionnel'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === 'en' 
              ? 'Coordinate class timetables, onsite exams, and automated teacher duty cycles.' 
              : 'Coordonner les emplois du temps, les examens sur site et les cycles de service des enseignants.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Dialog open={isDrawingTimetable} onOpenChange={setIsDrawingTimetable}>
              <DialogTrigger asChild>
                <Button className="flex-1 md:flex-none gap-2 shadow-lg h-12 px-6 rounded-2xl bg-secondary text-primary hover:bg-secondary/90">
                  <LayoutGrid className="w-5 h-5" /> {language === 'en' ? 'Draw Timetable' : 'Gérer l\'Emploi du Temps'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Master Schedule Slot</DialogTitle>
                  <DialogDescription className="text-white/60">Draw a class timetable slot. The system will automatically reflect this in the teacher's schedule.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Target Class</Label>
                      <Select onValueChange={(v) => setTimetableFormData({...timetableFormData, class: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</Label>
                      <Select onValueChange={(v) => setTimetableFormData({...timetableFormData, subject: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>{SUBJECT_METADATA.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Day of Week</Label>
                      <Select onValueChange={(v) => setTimetableFormData({...timetableFormData, day: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Day" /></SelectTrigger>
                        <SelectContent>{DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Time Slot</Label>
                      <Select onValueChange={(v) => setTimetableFormData({...timetableFormData, time: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Time" /></SelectTrigger>
                        <SelectContent>{TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Venue</Label>
                      <Select onValueChange={(v) => setTimetableFormData({...timetableFormData, room: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Select Room" /></SelectTrigger>
                        <SelectContent>{ROOMS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={() => setIsDrawingTimetable(false)} className="w-full h-12 font-bold shadow-lg">Confirm & Sync Schedules</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isSchedulingOnsite} onOpenChange={setIsSchedulingOnsite}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1 md:flex-none gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20">
                  <CalendarDays className="w-5 h-5 text-primary" /> {language === 'en' ? 'Schedule Onsite Exam' : 'Planifier Exam sur Site'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Schedule Physical Exam</DialogTitle>
                  <DialogDescription className="text-white/60">Coordinates physical seating. Teachers will be automatically notified of invigilation duties.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Exam Title</Label>
                      <Input placeholder="e.g. End of Term" className="h-12 bg-accent/30 border-none rounded-xl" onChange={(e) => setOnsiteFormData({...onsiteFormData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Select onValueChange={(v) => setOnsiteFormData({...onsiteFormData, subject: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{SUBJECT_METADATA.map(s => <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Class</Label>
                      <Select onValueChange={(v) => setOnsiteFormData({...onsiteFormData, class: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleScheduleOnsite} className="w-full h-12 font-bold shadow-lg">Confirm Exam Schedule</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <Tabs defaultValue="onsite" className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full lg:w-[800px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="onsite" className="gap-2 py-3 rounded-xl transition-all text-xs lg:text-sm">
            <CalendarDays className="w-4 h-4" /> {language === 'en' ? 'Onsite' : 'Sur Site'}
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2 py-3 rounded-xl transition-all text-xs lg:text-sm">
            <PenTool className="w-4 h-4" /> {language === 'en' ? 'Live MCQs' : 'QCM Live'}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-3 rounded-xl transition-all text-xs lg:text-sm">
            <History className="w-4 h-4" /> {language === 'en' ? 'History' : 'Historique'}
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2 py-3 rounded-xl transition-all text-xs lg:text-sm">
            <LayoutGrid className="w-4 h-4" /> {language === 'en' ? 'Timetables' : 'Emplois du Temps'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onsite" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {onsiteExams.map((exam) => (
              <Card key={exam.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className="bg-accent/30 p-4 border-b flex justify-between items-center">
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">{exam.class}</Badge>
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
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3" /> Venue</p>
                      <p className="text-xs font-black">{exam.room}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1"><Clock className="w-3 h-3" /> Time</p>
                      <p className="text-xs font-black">{exam.date} • {exam.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeExams.map((exam) => {
              const isLive = new Date(exam.startTime) <= currentTime;
              return (
                <Card key={exam.id} className="border-none shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className={cn("h-1.5 w-full", isLive ? "bg-red-600" : "bg-secondary")} />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[9px] font-black uppercase tracking-widest">
                        {exam.subject}
                      </Badge>
                      {isLive && (
                        <Badge className="bg-red-600 text-white border-none text-[9px] font-black animate-pulse">LIVE</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-black text-primary">{exam.title}</CardTitle>
                    <CardDescription className="font-medium flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-secondary" /> {exam.teacher}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-accent/30 border border-accent space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Duration</p>
                        <p className="text-sm font-black flex items-center gap-2"><Timer className="w-3.5 h-3.5 text-primary" /> {exam.duration}m</p>
                      </div>
                      <div className="p-3 rounded-xl bg-accent/30 border border-accent space-y-1">
                        <p className="text-[9px] font-black text-muted-foreground uppercase">Start Time</p>
                        <p className="text-sm font-black truncate">{new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 p-6">
                    {isLive ? (
                      <Button asChild className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs gap-2 shadow-lg bg-primary text-white">
                        <Link href={`/dashboard/exams/take?id=${exam.id}`}>
                          {language === 'en' ? 'Enter Examination' : 'Démarrer l\'Examen'}
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs gap-2"
                        onClick={() => setViewingInstructions(exam)}
                      >
                        <Info className="w-4 h-4 text-primary" />
                        {language === 'en' ? 'View Instructions' : 'Voir Instructions'}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            {activeExams.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl opacity-40">
                <PenTool className="w-12 h-12 mx-auto mb-4" />
                <p>No active or upcoming online assessments scheduled.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-sm font-black uppercase text-primary flex items-center gap-2">
                <History className="w-4 h-4" /> MCQ Attempt History
              </CardTitle>
              <CardDescription>Verified results from past or cancelled assessments.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-8 py-4">Assessment Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-right pr-8">Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_EXAM_HISTORY.map((hist, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{hist.title}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{hist.subject}</Badge></TableCell>
                      <TableCell className="text-center font-black text-primary">
                        {hist.status === 'CANCELLED' ? '---' : `${hist.score} / ${hist.total}`}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">{hist.date}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase border-none px-3",
                          hist.status === 'VERIFIED' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {hist.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Institutional Master Timetable</CardTitle>
                <CardDescription>Visualizing class availability and teacher duty coverage.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="w-full md:w-auto gap-2"><Printer className="w-4 h-4" /> Print Current Version</Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/50 uppercase text-[10px] font-black">
                  <TableRow>
                    <TableHead className="pl-6">Class Level</TableHead>
                    {DAYS.map(day => <TableHead key={day}>{day}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CLASSES.map(cls => (
                    <TableRow key={cls}>
                      <TableCell className="pl-6 font-bold text-primary text-xs">{cls}</TableCell>
                      {DAYS.map(day => (
                        <TableCell key={day} className="py-4">
                          <div className="bg-accent/30 p-2 rounded-lg border border-accent/50 min-h-[60px] flex flex-col justify-center">
                            <p className="text-[10px] font-black text-primary leading-tight">Advanced Physics</p>
                            <p className="text-[8px] text-muted-foreground uppercase mt-1">Dr. Tesla • R402</p>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* INSTRUCTIONS DIALOG */}
      <Dialog open={!!viewingInstructions} onOpenChange={() => setViewingInstructions(null)}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Info className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Exam Instructions</DialogTitle>
                <DialogDescription className="text-white/60">{viewingInstructions?.title}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase text-primary/60">Schedule</p>
                  <p className="text-sm font-bold text-primary">
                    Starts: {viewingInstructions && new Date(viewingInstructions.startTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-primary/60">Pedagogical Guidelines</p>
                <p className="text-sm leading-relaxed text-muted-foreground italic font-medium">
                  "{viewingInstructions?.instructions}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">The exam portal will automatically open at the scheduled start time. Ensure your environment is quiet.</p>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={() => setViewingInstructions(null)} className="w-full h-12 rounded-xl shadow-lg font-bold">I Understand</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
