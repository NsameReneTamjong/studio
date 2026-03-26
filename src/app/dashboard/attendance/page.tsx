
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  History,
  User,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Download,
  Filter,
  LayoutGrid,
  List,
  BookOpen,
  ChevronRight,
  BarChart3,
  FileDown,
  Eye,
  ListChecks,
  CalendarDays,
  ArrowLeft,
  Loader2,
  Save,
  Check,
  X as CloseIcon
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

// Mock Data for Admin Class Overview
const MOCK_CLASSES_ATTENDANCE = [
  { id: "C1", name: "6ème / Form 1", percentage: 94, totalStudents: 45, presentToday: 42, trends: "+2%", teacher: "Mr. Abena", status: "high" },
  { id: "C2", name: "5ème / Form 2", percentage: 82, totalStudents: 40, presentToday: 33, trends: "-5%", teacher: "Mme. Njoh", status: "low" },
  { id: "C3", name: "4ème / Form 3", percentage: 92, totalStudents: 38, presentToday: 35, trends: "+0.5%", teacher: "Mr. Tabi", status: "medium" },
  { id: "C4", name: "3ème / Form 4", percentage: 96, totalStudents: 42, presentToday: 41, trends: "+3%", teacher: "Dr. Fon", status: "high" },
  { id: "C5", name: "2nde / Form 5", percentage: 91, totalStudents: 42, presentToday: 38, trends: "Stable", teacher: "Dr. Tesla", status: "medium" },
  { id: "C6", name: "1ère / Lower Sixth", percentage: 78, totalStudents: 35, presentToday: 27, trends: "-8%", teacher: "Prof. Smith", status: "low" },
  { id: "C7", name: "Terminale / Upper Sixth", percentage: 98, totalStudents: 30, presentToday: 30, trends: "+1%", teacher: "Mme. Ngono", status: "high" },
];

const MOCK_SUBJECT_ATTENDANCE = [
  { id: "S1", name: "Mathematics", instructor: "Prof. Sarah Smith", percentage: 92, sessions: 24 },
  { id: "S2", name: "Advanced Physics", instructor: "Dr. Aris Tesla", percentage: 88, sessions: 20 },
  { id: "S3", name: "General Chemistry", instructor: "Dr. White", percentage: 95, sessions: 22 },
  { id: "S4", name: "English Literature", instructor: "Ms. Bennet", percentage: 90, sessions: 18 },
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

const MOCK_STUDENT_HISTORY = [
  { 
    id: "H1", 
    subject: "Mathematics", 
    present: 22, 
    absent: 2, 
    teacher: "Prof. Sarah Smith",
    logs: [
      { date: "May 24, 2024", time: "08:00 AM - 10:00 AM", status: "Present" },
      { date: "May 22, 2024", time: "08:00 AM - 10:00 AM", status: "Present" },
      { date: "May 20, 2024", time: "08:00 AM - 10:00 AM", status: "Absent" },
    ]
  },
  { 
    id: "H2", 
    subject: "Advanced Physics", 
    present: 18, 
    absent: 6, 
    teacher: "Dr. Aris Tesla",
    logs: [
      { date: "May 23, 2024", time: "10:30 AM - 12:30 PM", status: "Present" },
      { date: "May 21, 2024", time: "10:30 AM - 12:30 PM", status: "Absent" },
    ]
  },
  { 
    id: "H3", 
    subject: "English Literature", 
    present: 24, 
    absent: 0, 
    teacher: "Ms. Bennet",
    logs: [
      { date: "May 24, 2024", time: "01:00 PM - 03:00 PM", status: "Present" },
    ]
  },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [viewingSubjectLogs, setViewingSubjectLogs] = useState<any>(null);
  const [viewingHistoryDetails, setViewingHistoryDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Registry State for Teachers
  // Initialize all students as 'present' by default
  const [registryState, setRegistryState] = useState<Record<string, 'present' | 'absent'>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";
  const isParent = user?.role === "PARENT";
  const isStudent = user?.role === "STUDENT";

  const headCount = useMemo(() => {
    const present = Object.values(registryState).filter(v => v === 'present').length;
    const absent = Object.values(registryState).filter(v => v === 'absent').length;
    return { present, absent, total: MOCK_STUDENTS.length };
  }, [registryState]);

  const handleDownloadReport = (scope: string) => {
    toast({
      title: "Report Generated",
      description: `${scope} attendance report is ready for download.`,
    });
  };

  const setStatus = (studentId: string, status: 'present' | 'absent') => {
    setRegistryState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitRegistry = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Registry Synchronized",
        description: `Pedagogical presence for ${headCount.present}/${headCount.total} students has been committed.`,
      });
    }, 1500);
  };

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-blue-600" />
        <h1 className="text-xl font-bold">Personal Attendance Unavailable</h1>
        <Button asChild><Link href="/dashboard/children">Go to My Children</Link></Button>
      </div>
    );
  }

  // STUDENT VIEW
  if (isStudent) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                {t("attendance")}
              </h1>
              <p className="text-muted-foreground mt-1">Official registry of your pedagogical presence and engagement.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10">
              <CalendarIcon className="w-4 h-4 text-primary" /> 
              {format(date, "PPP")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Today's Live Presence */}
          <div className="lg:col-span-12 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <ListChecks className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black">{t("todayPresence")}</CardTitle>
                      <CardDescription className="text-white/60">Live session status for your scheduled courses today.</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/10 text-white border-none text-[10px] font-black uppercase tracking-widest px-4 h-8">
                    {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long' })}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">{t("subjects")}</TableHead>
                      <TableHead>Time Window</TableHead>
                      <TableHead>{t("teacher")}</TableHead>
                      <TableHead className="text-right pr-8">{t("status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENT_TODAY.map((att, i) => (
                      <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                        <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{att.subject}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-muted-foreground">
                          {att.start} - {att.end}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <User className="w-3.5 h-3.5 text-primary/40" />
                            {att.teacher}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-3 border-none", 
                            att.status === 'Present' ? "bg-green-100 text-green-700" : att.status === 'Absent' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          )}>
                            {att.status === 'Present' ? t("present") : (att.status === 'Absent' ? t("absent") : t("upcoming"))}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Attendance History Summary */}
          <div className="lg:col-span-12 space-y-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 px-1">
              <History className="w-5 h-5" /> {language === 'en' ? 'Attendance History' : 'Historique de Présence'}
            </h2>
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/30">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest">
                      <TableHead className="pl-8 py-4">Subject Name</TableHead>
                      <TableHead className="text-center">Present</TableHead>
                      <TableHead className="text-center">Absent</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead className="text-right pr-8">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENT_HISTORY.map((hist) => (
                      <TableRow key={hist.id} className="hover:bg-accent/5">
                        <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{hist.subject}</TableCell>
                        <TableCell className="text-center font-black text-green-600">{hist.present}</TableCell>
                        <TableCell className="text-center font-black text-red-600">{hist.absent}</TableCell>
                        <TableCell className="text-xs font-bold text-muted-foreground italic">{hist.teacher}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[10px] font-black uppercase gap-2 hover:bg-primary hover:text-white"
                            onClick={() => setViewingHistoryDetails(hist)}
                          >
                            <Eye className="w-3.5 h-3.5" /> {t("viewDetails")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* History Details Drill-down Dialog */}
        <Dialog open={!!viewingHistoryDetails} onOpenChange={() => setViewingHistoryDetails(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 rounded-[2rem] border-none shadow-2xl">
            <DialogHeader className="bg-primary p-8 text-white shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <CalendarDays className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black">
                      {viewingHistoryDetails?.subject} - Session Log
                    </DialogTitle>
                    <DialogDescription className="text-white/60">
                      Verified pedagogical presence records for the current term.
                    </DialogDescription>
                  </div>
                </div>
                <div className="text-right bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md hidden sm:block">
                   <p className="text-[10px] font-black uppercase opacity-60">Accuracy</p>
                   <p className="text-xl font-black text-secondary">VERIFIED</p>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto p-0">
              <Table>
                <TableHeader className="bg-accent/30 sticky top-0 z-10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-8 py-4">Session Date</TableHead>
                    <TableHead>Pedagogical Window</TableHead>
                    <TableHead className="text-right pr-8">Presence Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewingHistoryDetails?.logs.map((log: any, idx: number) => (
                    <TableRow key={idx} className="hover:bg-accent/5 border-b border-accent/10">
                      <TableCell className="pl-8 py-4 font-bold text-sm">{log.date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground font-medium">{log.time}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-3 border-none",
                          log.status === 'Present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {log.status === 'Present' ? t("present") : t("absent")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <DialogFooter className="bg-accent/10 p-6 border-t flex justify-between items-center shrink-0">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic opacity-40">Verified Institutional Record</p>
               </div>
               <Button onClick={() => setViewingHistoryDetails(null)} className="rounded-xl px-8 font-black uppercase text-xs">Close Log</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <CheckCircle2 className="w-6 h-6 text-secondary" />
              </div>
              {isAdmin ? "Institutional Presence" : "Class Register"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin 
                ? "Supervisory overview of institutional attendance trends across all class levels." 
                : "Manage and record daily session presence for your students."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10">
            <CalendarIcon className="w-4 h-4 text-primary" /> 
            {format(date, "PPP")}
          </Button>
          {isAdmin && (
            <Button variant="secondary" className="gap-2 rounded-xl h-11 shadow-sm" onClick={() => handleDownloadReport("School-wide")}>
              <Download className="w-4 h-4" /> Export School Report
            </Button>
          )}
        </div>
      </div>

      {isAdmin ? (
        <div className="space-y-8">
          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Global Attendance</p>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-blue-700">91.4%</div>
                <p className="text-[10px] text-blue-600/60 font-bold mt-1 uppercase">Across 1,284 students</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Registers Closed</p>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-3xl font-black text-green-700">22/24</div>
                <p className="text-[10px] text-green-600/60 font-bold mt-1 uppercase">Live session updates</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Low Attendance Alerts</p>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-amber-700">2 Classes</div>
                <p className="text-[10px] text-amber-600/60 font-bold mt-1 uppercase">Requires intervention</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_CLASSES_ATTENDANCE.map((cls) => (
              <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white">
                <div className={cn(
                  "h-1.5 w-full",
                  cls.status === 'high' ? "bg-green-500" : cls.status === 'medium' ? "bg-blue-500" : "bg-red-500"
                )} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <User className="w-3.5 h-3.5" /> {cls.teacher}
                      </CardDescription>
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl flex flex-col items-center justify-center min-w-[70px] border-2",
                      cls.status === 'high' ? "bg-green-50 border-green-100 text-green-700" : 
                      cls.status === 'medium' ? "bg-blue-50 border-blue-100 text-blue-700" : 
                      "bg-red-50 border-red-100 text-red-700"
                    )}>
                      <span className="text-xl font-black">{cls.percentage}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                      <span>Live Presence today</span>
                      <span>{cls.presentToday} / {cls.totalStudents}</span>
                    </div>
                    <Progress value={cls.percentage} className={cn(
                      "h-2",
                      cls.status === 'high' ? "[&>div]:bg-green-500" : cls.status === 'medium' ? "[&>div]:bg-blue-500" : "[&>div]:bg-red-500"
                    )} />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-accent/30 rounded-xl border border-accent">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Weekly Trend</p>
                      <div className="flex items-center gap-1.5">
                        {cls.trends.startsWith('+') ? <TrendingUp className="w-3.5 h-3.5 text-green-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
                        <span className={cn("text-sm font-black", cls.trends.startsWith('+') ? "text-green-600" : "text-red-600")}>{cls.trends}</span>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-accent mx-2" />
                    <div className="space-y-0.5 text-right">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                      <p className="text-xs font-bold uppercase">{cls.status === 'high' ? 'Optimal' : cls.status === 'medium' ? 'Good' : 'Critical'}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 border-t p-4 pt-4 flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="shrink-0 hover:bg-white text-primary"
                    onClick={() => handleDownloadReport(`${cls.name}`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs"
                    onClick={() => setSelectedClassDetails(cls)}
                  >
                    View Class Records
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
            <TabsTrigger value="register" className="gap-2 py-3 rounded-xl transition-all">
              <CheckCircle2 className="w-4 h-4" /> Take Register
            </TabsTrigger>
            <TabsTrigger value="records" className="gap-2 py-3 rounded-xl transition-all">
              <History className="w-4 h-4" /> Past Records
            </TabsTrigger>
          </TabsList>

          <TabsContent value="register" className="animate-in fade-in slide-in-from-bottom-4 mt-0">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-primary text-white p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-black">Session Register: Form 5A</CardTitle>
                    <CardDescription className="text-white/60">Mark presence for students in this academic session.</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                    <div className="text-center border-r border-white/20 pr-4">
                      <p className="text-[9px] font-black uppercase opacity-60">Present</p>
                      <p className="text-xl font-black text-secondary">{headCount.present}</p>
                    </div>
                    <div className="text-center border-r border-white/20 pr-4">
                      <p className="text-[9px] font-black uppercase opacity-60">Absent</p>
                      <p className="text-xl font-black text-red-400">{headCount.absent}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase opacity-60">Total</p>
                      <p className="text-xl font-black">{headCount.total}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/30 font-black uppercase text-[10px] tracking-widest">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Student Profile</TableHead>
                      <TableHead className="text-center">Current Status</TableHead>
                      <TableHead className="text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENTS.map(s => (
                      <TableRow key={s.id} className={cn(
                        "group transition-colors",
                        registryState[s.id] === 'absent' ? "bg-red-50/50" : "hover:bg-accent/5"
                      )}>
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-primary">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-3 h-5 border-none",
                            registryState[s.id] === 'present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {registryState[s.id] === 'present' ? 'PRESENT' : 'ABSENT'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant={registryState[s.id] === 'present' ? 'default' : 'outline'}
                              className={cn(
                                "text-[10px] uppercase font-black px-4 h-8 transition-all",
                                registryState[s.id] === 'present' ? "bg-green-600 hover:bg-green-700" : "border-green-200 text-green-700 hover:bg-green-50"
                              )}
                              onClick={() => setStatus(s.id, 'present')}
                            >
                              <Check className="w-3 h-3 mr-1" /> Present
                            </Button>
                            <Button 
                              size="sm" 
                              variant={registryState[s.id] === 'absent' ? 'destructive' : 'outline'}
                              className={cn(
                                "text-[10px] uppercase font-black px-4 h-8 transition-all",
                                registryState[s.id] === 'absent' ? "bg-red-600 hover:bg-red-700 shadow-lg" : "border-red-200 text-red-700 hover:bg-red-50"
                              )}
                              onClick={() => setStatus(s.id, 'absent')}
                            >
                              <XCircle className="w-3 h-3 mr-1" /> Absent
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-accent/10 border-t p-6 flex flex-col sm:flex-row gap-6 justify-between items-center">
                <div className="flex items-center gap-3 text-muted-foreground italic">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Headcount: {headCount.present} Present / {headCount.absent} Absent</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="h-12 px-8 rounded-xl font-bold gap-2 flex-1 sm:flex-none bg-white">
                    <Save className="w-4 h-4" /> Save Draft
                  </Button>
                  <Button className="font-black uppercase tracking-widest text-xs px-10 h-12 rounded-xl shadow-xl bg-primary text-white hover:bg-primary/90 flex-1 sm:flex-none" onClick={handleSubmitRegistry} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Submit Registry
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-4 mt-0">
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl bg-white">
              <CardHeader className="bg-white border-b flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-primary font-black uppercase tracking-tight">
                    <History className="w-5 h-5" />
                    Cumulative Subject Records
                  </CardTitle>
                  <CardDescription>Comprehensive term presence records for your assigned subjects.</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto rounded-xl h-10 font-bold border-primary/10" onClick={() => handleDownloadReport("Subject-Specific")}>
                  <Download className="w-4 h-4" /> Download Records
                </Button>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Student Identity</TableHead>
                      <TableHead className="text-center">Sessions Present</TableHead>
                      <TableHead className="text-center">Sessions Absent</TableHead>
                      <TableHead className="text-right pr-8">Attendance Ratio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENTS.map((s) => (
                      <TableRow key={s.id} className="hover:bg-accent/5 border-b last:border-0">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback className="text-[10px] font-black">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-sm text-primary leading-none">{s.name}</p>
                              <p className="text-[9px] font-mono text-muted-foreground mt-1">{s.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-black text-green-600">{s.presentCount}</TableCell>
                        <TableCell className="text-center font-black text-red-600">{s.absentCount}</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-mono font-black text-primary text-xs">
                              {Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%
                            </span>
                            <div className="w-24 h-1 bg-accent rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(s.presentCount / (s.presentCount + s.absentCount)) * 100}%` }} />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Class Details Drill-down Dialog */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white relative",
            selectedClassDetails?.status === 'high' ? "bg-green-600" : selectedClassDetails?.status === 'medium' ? "bg-blue-600" : "bg-red-600"
          )}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter">{selectedClassDetails?.name}</DialogTitle>
                <DialogDescription className="text-white/70 font-bold flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" /> Lead Teacher: {selectedClassDetails?.teacher}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Term Average</p>
                  <p className="text-3xl font-black">{selectedClassDetails?.percentage}%</p>
                </div>
                <Button 
                  className="h-full bg-white/20 hover:bg-white/30 text-white border-none rounded-2xl p-4 shadow-xl backdrop-blur-md" 
                  onClick={() => handleDownloadReport(`Class Dossier - ${selectedClassDetails?.name}`)}
                >
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedClassDetails(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <CloseIcon className="w-6 h-6" />
            </Button>
          </DialogHeader>
          
          <div className="p-8 space-y-10">
            {/* Subject-wise Attendance Breakdown */}
            <section className="space-y-6">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2 border-b pb-2">
                <BookOpen className="w-4 h-4" /> Subject Attendance Breakdown
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MOCK_SUBJECT_ATTENDANCE.map((sub) => (
                  <Card key={sub.id} className="border-none shadow-sm bg-accent/30 hover:bg-accent/50 transition-colors group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-primary">{sub.name}</span>
                          <Badge variant="outline" className="text-[9px] h-4 border-primary/20">{sub.sessions} Sessions</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">{sub.instructor}</p>
                        <div className="w-3/4 mt-2">
                          <Progress value={sub.percentage} className="h-1 bg-white" />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className={cn(
                          "px-3 py-1.5 rounded-xl font-black text-sm",
                          sub.percentage >= 90 ? "bg-green-100 text-green-700" : 
                          sub.percentage >= 80 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {sub.percentage}%
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] uppercase font-black gap-1 h-7 text-primary hover:bg-white"
                          onClick={() => setViewingSubjectLogs(sub)}
                        >
                          Details <ChevronRight className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Student Matrix
                </h3>
                <div className="max-h-[300px] overflow-y-auto pr-2">
                  <Table>
                    <TableBody>
                      {MOCK_STUDENTS.map(s => (
                        <TableRow key={s.id} className="hover:bg-accent/5 border-b border-accent/10">
                          <TableCell className="py-3 pl-0">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={s.avatar} />
                                <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-sm text-primary">{s.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-3 pr-0">
                            <Badge variant="outline" className="text-[10px] font-mono font-black border-primary/10">
                              {Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Institutional Audit
                </h3>
                <div className="space-y-4">
                  <div className="bg-primary/5 p-6 rounded-2xl space-y-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary rounded-lg text-white">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-relaxed text-primary">
                          "Attendance for this class is {selectedClassDetails?.status === 'high' ? 'above' : selectedClassDetails?.status === 'medium' ? 'meeting' : 'below'} institutional benchmarks."
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-1">Last audit: Today, 08:45 AM</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-primary/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">Registry Status</span>
                      <Badge className="bg-primary text-white border-none text-[9px] font-black">VALIDATED</Badge>
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest" 
                    variant="outline"
                    onClick={() => handleDownloadReport(`Full Session Logs - ${selectedClassDetails?.name}`)}
                  >
                    <History className="w-4 h-4 text-primary" /> Full Session Logs
                  </Button>
                  <Button 
                    className="w-full gap-3 h-12 rounded-xl shadow-lg bg-primary text-xs font-black uppercase tracking-widest text-white hover:bg-primary/90"
                    onClick={() => handleDownloadReport(`Parent Contact List - ${selectedClassDetails?.name}`)}
                  >
                    <Download className="w-4 h-4 text-secondary" /> Download Contact List
                  </Button>
                </div>
              </section>
            </div>
          </div>
          
          <div className="p-6 bg-accent/10 border-t flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedClassDetails(null)} className="font-black uppercase tracking-widest text-[10px]">Close Dossier</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subject-Specific Detail Dialog */}
      <Dialog open={!!viewingSubjectLogs} onOpenChange={() => setViewingSubjectLogs(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-3xl border-none shadow-2xl">
          <DialogHeader className="p-8 bg-primary text-white shrink-0 relative">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">
                    {viewingSubjectLogs?.name} - Granular Registry
                  </DialogTitle>
                  <DialogDescription className="text-white/60 font-medium">
                    {viewingSubjectLogs?.instructor} • Detailed student-by-student presence report
                  </DialogDescription>
                </div>
              </div>
              <Button 
                variant="secondary" 
                className="h-12 w-12 rounded-2xl shadow-xl shrink-0"
                onClick={() => handleDownloadReport(`${viewingSubjectLogs?.name} - ${selectedClassDetails?.name}`)}
              >
                <FileDown className="w-6 h-6" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setViewingSubjectLogs(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <CloseIcon className="w-6 h-6" />
            </Button>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            <Tabs defaultValue="students" className="flex-1 flex flex-col">
              <TabsList className="px-8 border-b bg-accent/10 h-14 justify-start gap-8 rounded-none shrink-0 overflow-x-auto no-scrollbar">
                <TabsTrigger value="students" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">
                  <Users className="w-4 h-4" /> Student Registry
                </TabsTrigger>
                <TabsTrigger value="sessions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full bg-transparent shadow-none px-0 gap-2 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">
                  <History className="w-4 h-4" /> Session History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students" className="flex-1 overflow-y-auto p-0 mt-0">
                <Table>
                  <TableHeader className="bg-accent/30 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest text-green-600">Present</TableHead>
                      <TableHead className="text-center font-black uppercase text-[10px] tracking-widest text-red-600">Absent</TableHead>
                      <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENTS.map((student) => (
                      <TableRow key={student.id} className="hover:bg-accent/5">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                              <AvatarImage src={student.avatar} alt={student.name} />
                              <AvatarFallback className="bg-primary/5 text-primary text-xs">{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-primary">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-bold text-muted-foreground">{student.id}</TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {student.presentCount}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-100 font-bold text-xs">
                            <XCircle className="w-3.5 h-3.5" /> {student.absentCount}
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[9px] font-black uppercase gap-1"
                            onClick={() => handleDownloadReport(`Individual: ${student.name}`)}
                          >
                            <Download className="w-3 h-3" /> Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="sessions" className="flex-1 overflow-y-auto p-0 mt-0">
                <Table>
                  <TableHeader className="bg-accent/30 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="pl-8 py-4 text-[10px] font-black uppercase">Session Date</TableHead>
                      <TableHead className="text-center text-[10px] font-black uppercase">Time Window</TableHead>
                      <TableHead className="text-center text-[10px] font-black uppercase">Presence Ratio</TableHead>
                      <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Integrity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: "May 24, 2024", time: "08:00 AM - 10:00 AM", present: 42, total: 45, status: "Closed" },
                      { date: "May 22, 2024", time: "08:00 AM - 10:00 AM", present: 40, total: 45, status: "Closed" },
                      { date: "May 20, 2024", time: "08:00 AM - 10:00 AM", present: 41, total: 45, status: "Closed" },
                      { date: "May 17, 2024", time: "08:00 AM - 10:00 AM", present: 38, total: 45, status: "Closed" },
                    ].map((log, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="pl-8 py-4 text-sm font-bold">{log.date}</TableCell>
                        <TableCell className="text-center text-xs text-muted-foreground">{log.time}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-mono text-xs font-black text-primary">{log.present} / {log.total}</span>
                        </TableCell>
                        <TableCell className="pr-8 text-right">
                          <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black px-3">{log.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="p-6 bg-accent/10 border-t flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Automated institutional reporting active.
            </p>
            <Button variant="outline" className="rounded-xl h-10 px-8 w-full sm:w-auto" onClick={() => setViewingSubjectLogs(null)}>
              Close Subject Logs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
