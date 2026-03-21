
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
  Zap
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
];

export default function ExamsPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [isCreatingOnline, setIsCreatingOnline] = useState(false);
  const [isSchedulingOnsite, setIsSchedulingOnsite] = useState(false);
  const [isDrawingTimetable, setIsDrawingTimetable] = useState(false);
  const [onsiteExams, setOnsiteExams] = useState(INITIAL_ONSITE_EXAMS);
  const [selectedExamResults, setSelectedExamResults] = useState<any>(null);

  // Timetable State
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

  // Auto-assign teacher when subject changes for any schedule
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

  const handleDrawTimetable = () => {
    if (!timetableFormData.class || !timetableFormData.subject) return;
    
    setIsDrawingTimetable(false);
    toast({
      title: "Master Timetable Updated",
      description: `Schedule generated for ${timetableFormData.class}. Personal timetable for ${timetableFormData.teacher} has been updated automatically.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <CalendarDays className="w-6 h-6 text-secondary" />
            </div>
            Institutional Schedules
          </h1>
          <p className="text-muted-foreground mt-1">
            Coordinate class timetables, onsite exams, and automated teacher duty cycles.
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={isDrawingTimetable} onOpenChange={setIsDrawingTimetable}>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl bg-secondary text-primary hover:bg-secondary/90">
                  <LayoutGrid className="w-5 h-5" /> Draw Timetable
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
                    
                    {timetableFormData.teacher && (
                      <div className="col-span-2 p-4 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-4">
                        <div className="p-2 bg-primary rounded-lg text-white"><ShieldCheck className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Automatic Duty Assignment</p>
                          <p className="font-bold text-primary">{timetableFormData.teacher}</p>
                        </div>
                        <Badge className="bg-secondary text-primary border-none">GENERATE</Badge>
                      </div>
                    )}

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
                  <Button onClick={handleDrawTimetable} className="w-full h-12 font-bold shadow-lg">Confirm & Sync Schedules</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isSchedulingOnsite} onOpenChange={setIsSchedulingOnsite}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20">
                  <CalendarDays className="w-5 h-5 text-primary" /> Schedule Onsite Exam
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
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="onsite" className="gap-2 py-3 rounded-xl transition-all">
            <CalendarDays className="w-4 h-4" /> Onsite Exams
          </TabsTrigger>
          <TabsTrigger value="available" className="gap-2 py-3 rounded-xl transition-all">
            <PenTool className="w-4 h-4" /> Live MCQs
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2 py-3 rounded-xl transition-all">
            <LayoutGrid className="w-4 h-4" /> Class Timetables
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
                  <div className="pt-4 border-t border-accent">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-secondary/20 rounded-lg text-primary"><User className="w-4 h-4" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Invigilator</p>
                        <p className="text-sm font-bold text-primary">{exam.teacher}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timetable" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-white flex flex-row items-center justify-between">
              <div>
                <CardTitle>Institutional Master Timetable</CardTitle>
                <CardDescription>Visualizing class availability and teacher duty coverage.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2"><Printer className="w-4 h-4" /> Print Current Version</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
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
    </div>
  );
}
