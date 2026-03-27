
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LoadingState } from "@/components/shared/loading-state";
import { 
  CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  History,
  User,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Download,
  Filter,
  BookOpen,
  ChevronRight,
  FileDown,
  Eye,
  ListChecks,
  CalendarDays,
  ArrowLeft,
  Loader2,
  Save,
  Check,
  X,
  WifiOff,
  Printer,
  Search,
  Award,
  BarChart3,
  Info,
  FileText,
  BookMarked,
  LayoutGrid
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

// Mock Data
const MOCK_CLASSES_ATTENDANCE = [
  { id: "C1", name: "6ème / Form 1", percentage: 94, totalStudents: 45, presentToday: 42, trends: "+2%", teacher: "Mr. Abena", status: "high" },
  { id: "C2", name: "5ème / Form 2", percentage: 82, totalStudents: 40, presentToday: 33, trends: "-5%", teacher: "Mme. Njoh", status: "low" },
  { id: "C3", name: "4ème / Form 3", percentage: 92, totalStudents: 38, presentToday: 35, trends: "+0.5%", teacher: "Mr. Tabi", status: "medium" },
  { id: "C4", name: "3ème / Form 4", percentage: 96, totalStudents: 42, presentToday: 41, trends: "+3%", teacher: "Dr. Fon", status: "high" },
  { id: "C5", name: "2nde / Form 5", percentage: 91, totalStudents: 42, presentToday: 38, trends: "Stable", teacher: "Dr. Tesla", status: "medium" },
  { id: "C6", name: "1ère / Lower Sixth", percentage: 78, totalStudents: 35, presentToday: 27, trends: "-8%", teacher: "Prof. Smith", status: "low" },
  { id: "C7", name: "Terminale / Upper Sixth", percentage: 98, totalStudents: 30, presentToday: 30, trends: "+1%", teacher: "Mme. Ngono", status: "high" },
];

const MOCK_CLASS_SUBJECTS = [
  { id: "SUB1", name: "Advanced Physics", code: "PHY402", percentage: 92, students: 42, teacher: "Dr. Aris Tesla", color: "bg-blue-500" },
  { id: "SUB2", name: "Mathematics", code: "MAT401", percentage: 95, students: 42, teacher: "Prof. Sarah Smith", color: "bg-emerald-500" },
  { id: "SUB3", name: "Chemistry", code: "CHM401", percentage: 88, students: 42, teacher: "Dr. White", color: "bg-purple-500" },
  { id: "SUB4", name: "English Literature", code: "LIT405", percentage: 90, students: 42, teacher: "Ms. Bennet", color: "bg-rose-500" },
];

const MOCK_STUDENT_SUBJECT_STATS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", presentCount: 22, absentCount: 2, matricule: "GBHS26S001" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", presentCount: 18, absentCount: 6, matricule: "GBHS26S002" },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", presentCount: 15, absentCount: 9, matricule: "GBHS26S003" },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", presentCount: 24, absentCount: 0, matricule: "GBHS26S004" },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", presentCount: 20, absentCount: 4, matricule: "GBHS26S005" },
];

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", presentCount: 22, absentCount: 2 },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", presentCount: 18, absentCount: 6 },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", presentCount: 15, absentCount: 9 },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", presentCount: 24, absentCount: 0 },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", presentCount: 20, absentCount: 4 },
];

const MOCK_STUDENT_TODAY = [
  { subject: "Mathematics", start: "08:00 AM", end: "10:00 AM", status: "Present", teacher: "Prof. Sarah Smith" },
  { subject: "Advanced Physics", start: "10:30 AM", end: "12:30 PM", status: "Present", teacher: "Dr. Aris Tesla" },
  { subject: "English Literature", start: "01:00 PM", end: "03:00 PM", status: "Upcoming", teacher: "Ms. Bennet" },
];

const MOCK_SUBJECT_RECORDS = [
  { subject: "Mathematics", present: 22, absent: 2, teacher: "Prof. Sarah Smith" },
  { subject: "Advanced Physics", present: 18, absent: 6, teacher: "Dr. Aris Tesla" },
  { subject: "English Literature", present: 24, absent: 0, teacher: "Ms. Bennet" },
  { subject: "History", present: 15, absent: 9, teacher: "Mr. Tabi" },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const isOnline = useOnlineStatus();
  
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [registryState, setRegistryState] = useState<Record<string, 'present' | 'absent'>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const headCount = useMemo(() => {
    const present = Object.values(registryState).filter(v => v === 'present').length;
    const absent = Object.values(registryState).filter(v => v === 'absent').length;
    return { present, absent, total: MOCK_STUDENTS.length };
  }, [registryState]);

  const setStatus = (studentId: string, status: 'present' | 'absent') => {
    if (isAdmin) return;
    setRegistryState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitRegistry = () => {
    if (isAdmin) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: isOnline ? "Registry Synchronized" : "Local Record Created",
        description: `Pedagogical presence recorded for ${headCount.present}/${headCount.total} students.`,
      });
      if (selectedClassDetails) setSelectedClassDetails(null);
    }, 1200);
  };

  const handleDownloadStats = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Statistics Exported",
        description: "Attendance report for selected scope generated.",
      });
    }, 1000);
  };

  if (isLoading) return <LoadingState message="Fetching institutional presence records..." />;

  if (isStudent) {
    return (
      <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                My Attendance
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Monitor your participation across all courses.</p>
            </div>
          </div>
          {!isOnline && (
            <Badge variant="destructive" className="gap-2 px-4 py-1.5 rounded-xl border-none w-fit">
              <WifiOff className="w-4 h-4" /> Offline
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
           <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Session Presence</p>
                 <p className="text-2xl font-black text-primary">94.5%</p>
              </div>
           </Card>
           <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6" /></div>
              <div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Target Rate</p>
                 <p className="text-2xl font-black text-primary">90.0%</p>
              </div>
           </Card>
           <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <div className="p-3 bg-secondary/20 rounded-2xl text-primary group-hover:scale-110 transition-transform"><Award className="w-6 h-6" /></div>
              <div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground">Conduct Status</p>
                 <p className="text-2xl font-black text-secondary">EXCELLENT</p>
              </div>
           </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary p-6 md:p-8 text-white">
              <CardTitle className="text-xl md:text-2xl font-black flex items-center gap-3">
                <ListChecks className="w-6 h-6 text-secondary" /> Today's Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[9px] font-black tracking-widest border-b">
                    <TableHead className="pl-8 py-4">Course</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="hidden md:table-cell">Instructor</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENT_TODAY.map((att, i) => (
                    <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b">
                      <TableCell className="pl-8 py-4 font-bold text-xs md:text-sm text-primary uppercase">{att.subject}</TableCell>
                      <TableCell className="text-[10px] md:text-xs font-mono font-bold text-muted-foreground">{att.start}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs font-medium text-muted-foreground">{att.teacher}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn(
                          "text-[8px] md:text-[9px] font-black uppercase px-3 border-none", 
                          att.status === 'Present' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {att.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-6 md:p-8">
              <CardTitle className="text-xl md:text-2xl font-black text-primary flex items-center gap-3">
                <History className="w-6 h-6 text-secondary" /> History Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-accent/5 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Subject</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-center">Rate %</TableHead>
                    <TableHead className="hidden md:table-cell text-right pr-8">Instructor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_SUBJECT_RECORDS.map((rec, i) => {
                    const total = rec.present + rec.absent;
                    const rate = total > 0 ? Math.round((rec.present / total) * 100) : 0;
                    return (
                      <TableRow key={i} className="hover:bg-accent/5 border-b last:border-0 h-16">
                        <TableCell className="pl-8 font-black text-primary text-xs md:text-sm uppercase">{rec.subject}</TableCell>
                        <TableCell className="text-center font-black text-green-600 text-xs md:text-sm">{rec.present}</TableCell>
                        <TableCell className="text-center font-black text-red-600 text-xs md:text-sm">{rec.absent}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={cn("text-[10px] font-black", rate >= 90 ? "text-primary" : "text-amber-600")}>{rate}%</span>
                            <div className="w-12 md:w-16 h-1 bg-accent rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-1000", rate >= 90 ? "bg-primary" : "bg-amber-500")} style={{ width: `${rate}%` }} />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right pr-8 text-[10px] font-bold text-muted-foreground">{rec.teacher}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- TEACHER / ADMIN VIEW ---
  return (
    <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
              {isAdmin ? "Presence Audit" : "Session Register"}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage daily session participation.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Button variant="outline" className="flex-1 sm:flex-none gap-2 bg-white rounded-xl h-11 border-primary/10 font-bold text-xs" onClick={() => toast({ title: "Node Report Exported" })}>
              <FileDown className="w-4 h-4 text-primary" /> Export Summary
            </Button>
          )}
          {!isOnline && (
            <Badge variant="destructive" className="h-11 px-4 rounded-xl gap-2 border-none">
              <WifiOff className="w-4 h-4" /> Offline Mode
            </Badge>
          )}
          <Button variant="outline" className="flex-1 sm:flex-none gap-2 bg-white rounded-xl h-11 border-primary/10 font-bold text-xs">
            <CalendarIcon className="w-4 h-4 text-primary" /> 
            {format(date, "PPP")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {MOCK_CLASSES_ATTENDANCE.map((cls) => (
          <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white rounded-3xl">
            <div className={cn("h-1.5 w-full", cls.status === 'high' ? "bg-green-500" : "bg-amber-500")} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg md:text-xl font-black text-primary truncate max-w-[180px]">{cls.name}</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1 truncate">
                    <User className="w-3.5 h-3.5 text-secondary" /> {cls.teacher}
                  </CardDescription>
                </div>
                <Badge className="bg-accent/30 text-primary border-none h-8 font-black">{cls.percentage}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
                  <span>Attendance Today</span>
                  <span>{cls.presentToday} / {cls.totalStudents}</span>
                </div>
                <Progress value={cls.percentage} className="h-1.5" />
              </div>
            </CardContent>
            <CardFooter className="bg-accent/10 border-t p-3">
              <Button 
                variant="ghost" 
                className="flex-1 justify-between hover:bg-white text-primary font-bold text-[10px] uppercase w-full rounded-xl"
                onClick={() => setSelectedClassDetails(cls)}
              >
                {isAdmin ? "Inspect Subjects" : "Mark Presence"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* TEACHER ONLY REGISTER VIEW */}
      {!isAdmin && (
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="bg-primary text-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black">Active Session Register</CardTitle>
                <CardDescription className="text-white/60">Mark presence for students in this period.</CardDescription>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md w-fit">
                <div className="text-center border-r border-white/20 pr-4">
                  <p className="text-[8px] font-black uppercase opacity-60">Present</p>
                  <p className="text-lg font-black text-secondary">{headCount.present}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black uppercase opacity-60">Total</p>
                  <p className="text-lg font-black">{headCount.total}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader className="bg-accent/10 font-black uppercase text-[9px] tracking-widest">
                <TableRow>
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Daily Entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.map(s => (
                  <TableRow key={s.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm shrink-0">
                          <AvatarImage src={s.avatar} />
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-xs md:text-sm text-primary uppercase truncate max-w-[150px]">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 h-5 border-none",
                        registryState[s.id] === 'present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {registryState[s.id]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant={registryState[s.id] === 'present' ? 'default' : 'outline'}
                          className="h-8 w-8 rounded-lg"
                          onClick={() => setStatus(s.id, 'present')}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant={registryState[s.id] === 'absent' ? 'destructive' : 'outline'}
                          className="h-8 w-8 rounded-lg"
                          onClick={() => setStatus(s.id, 'absent')}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-accent/10 p-6 flex justify-end">
            <Button className="h-12 px-10 rounded-xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-2" onClick={handleSubmitRegistry} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Commit Registry
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ADMIN CLASS SUBJECTS DIALOG (TIER 2) */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-4xl w-[95vw] sm:w-full max-h-[95vh] p-0 border-none shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-5 md:p-8 text-white relative shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="p-2.5 bg-white/10 rounded-xl shrink-0">
                  <LayoutGrid className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                <div className="overflow-hidden">
                  <DialogTitle className="text-lg md:text-2xl font-black uppercase tracking-tighter truncate">{selectedClassDetails?.name} Subjects</DialogTitle>
                  <DialogDescription className="text-white/60 text-[10px] md:text-xs">Strategic oversight of class subject performance.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedClassDetails(null)} className="text-white hover:bg-white/10 shrink-0">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-accent/5 scrollbar-thin">
            {MOCK_CLASS_SUBJECTS.map((sub) => (
              <Card key={sub.id} className="border-none shadow-sm group hover:shadow-md transition-all bg-white overflow-hidden rounded-2xl md:rounded-3xl">
                <div className={cn("h-1.5 w-full", sub.color)} />
                <CardHeader className="p-4 md:p-6 pb-2">
                  <div className="flex justify-between items-start gap-4">
                    <div className="overflow-hidden">
                      <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-primary/10 text-primary mb-1">{sub.code}</Badge>
                      <CardTitle className="text-base md:text-lg font-black text-primary uppercase truncate">{sub.name}</CardTitle>
                      <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground italic flex items-center gap-1 mt-1 truncate">
                        <User className="w-3 h-3" /> {sub.teacher}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-[8px] md:text-[10px] font-black uppercase opacity-40 leading-none">Mean</p>
                       <p className="text-lg md:text-xl font-black text-primary">{sub.percentage}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-2">
                   <div className="flex items-center justify-between p-2.5 md:p-3 bg-accent/20 rounded-xl">
                      <div className="flex items-center gap-2 overflow-hidden">
                         <Users className="w-3.5 h-3.5 text-primary/40 shrink-0" />
                         <span className="text-[10px] md:text-xs font-bold text-primary truncate">{sub.students} Enrolled</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-10 text-[9px] md:text-[10px] font-black uppercase gap-1.5 shadow-lg rounded-xl px-4 shrink-0 bg-primary text-white"
                        onClick={() => setSelectedSubjectDetails({ ...sub, className: selectedClassDetails?.name })}
                      >
                        View Details <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="bg-accent/10 p-4 md:p-6 border-t border-accent flex justify-center shrink-0">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Node Registry Audit Active</p>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADMIN SUBJECT STUDENT DOSSIER DIALOG (TIER 3) */}
      <Dialog open={!!selectedSubjectDetails} onOpenChange={() => setSelectedSubjectDetails(null)}>
        <DialogContent className="sm:max-w-4xl w-[95vw] sm:w-full max-h-[90vh] p-0 border-none shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-5 md:p-8 text-white relative shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                <div className="p-2.5 bg-white/10 rounded-xl text-secondary shrink-0">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-secondary" />
                </div>
                <div className="overflow-hidden">
                  <DialogTitle className="text-lg md:text-2xl font-black uppercase tracking-tighter truncate">{selectedSubjectDetails?.name} Dossier</DialogTitle>
                  <DialogDescription className="text-white/60 text-[10px] md:text-xs truncate">Presence registry for {selectedSubjectDetails?.className}</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedSubjectDetails(null)} className="text-white hover:bg-white/10 shrink-0">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-white border-b p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search students in dossier..." 
                className="pl-10 h-11 bg-accent/20 border-none rounded-xl text-sm" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
            <Button variant="outline" className="w-full md:w-auto rounded-xl gap-2 font-bold h-11 px-6 text-xs bg-white border-primary/10" onClick={handleDownloadStats}>
              <Printer className="w-4 h-4" /> Print Dossier
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10 border-b">
                <TableRow>
                  <TableHead className="pl-4 sm:pl-8 py-4">Student Identity</TableHead>
                  <TableHead className="hidden sm:table-cell">Matricule</TableHead>
                  <TableHead className="text-center">Present</TableHead>
                  <TableHead className="text-center">Absent</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-8">Mean Rate %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENT_SUBJECT_STATS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => {
                  const total = s.presentCount + s.absentCount;
                  const rate = total > 0 ? Math.round((s.presentCount / total) * 100) : 0;
                  return (
                    <TableRow key={s.id} className="hover:bg-accent/5 transition-colors h-16 border-b border-accent/10">
                      <TableCell className="pl-4 sm:pl-8">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-white shadow-sm shrink-0">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-xs md:text-sm text-primary uppercase truncate max-w-[120px] sm:max-w-[150px]">{s.name}</span>
                            <span className="text-[8px] font-mono font-bold text-muted-foreground sm:hidden">{s.matricule}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-mono text-[10px] font-bold text-muted-foreground uppercase">{s.matricule}</TableCell>
                      <TableCell className="text-center font-black text-green-600 text-xs md:text-sm">{s.presentCount}</TableCell>
                      <TableCell className="text-center font-black text-red-600 text-xs md:text-sm">{s.absentCount}</TableCell>
                      <TableCell className="text-right pr-4 sm:pr-8">
                        <div className="inline-flex flex-col items-end gap-1">
                          <span className={cn("text-[9px] md:text-[10px] font-black", rate >= 90 ? "text-primary" : "text-amber-600")}>{rate}%</span>
                          <div className="w-16 md:w-20 h-1 bg-accent rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", rate >= 90 ? "bg-primary" : "bg-amber-500")} style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="bg-accent/10 p-4 md:p-6 border-t border-accent flex justify-center shrink-0">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">High-fidelity pedagogical record verified.</p>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
