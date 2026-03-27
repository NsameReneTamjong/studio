
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { LoadingState, CardSkeleton } from "@/components/shared/loading-state";
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
  X as CloseIcon,
  WifiOff
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
  const [viewingHistoryDetails, setViewingHistoryDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [registryState, setRegistryState] = useState<Record<string, 'present' | 'absent'>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";
  const isParent = user?.role === "PARENT";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    // Simulated pedagogical data fetch
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const headCount = useMemo(() => {
    const present = Object.values(registryState).filter(v => v === 'present').length;
    const absent = Object.values(registryState).filter(v => v === 'absent').length;
    return { present, absent, total: MOCK_STUDENTS.length };
  }, [registryState]);

  const setStatus = (studentId: string, status: 'present' | 'absent') => {
    setRegistryState(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmitRegistry = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const statusMessage = isOnline 
        ? `Pedagogical presence for ${headCount.present}/${headCount.total} students has been committed.`
        : `Attendance recorded offline ✅ — syncing with node once online.`;

      toast({
        title: isOnline ? "Registry Synchronized" : "Local Record Created",
        description: statusMessage,
        variant: isOnline ? "default" : "destructive"
      });
    }, 1200);
  };

  if (isLoading) {
    return <LoadingState message="Fetching institutional presence records..." />;
  }

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
      <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-700">
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
              <p className="text-muted-foreground mt-1">Official registry of your pedagogical presence.</p>
            </div>
          </div>
          {!isOnline && (
            <Badge variant="destructive" className="gap-2 px-4 py-1.5 rounded-xl border-none">
              <WifiOff className="w-4 h-4" /> Offline Mode
            </Badge>
          )}
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2rem]">
          <CardHeader className="bg-primary p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <ListChecks className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">{t("todayPresence")}</CardTitle>
                  <CardDescription className="text-white/60">Live session status for your scheduled courses.</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                  <TableHead className="pl-8 py-4">{t("subjects")}</TableHead>
                  <TableHead>Time Window</TableHead>
                  <TableHead className="text-right pr-8">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENT_TODAY.map((att, i) => (
                  <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b">
                    <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{att.subject}</TableCell>
                    <TableCell className="text-xs font-mono font-bold text-muted-foreground">{att.start} - {att.end}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 border-none", 
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
      </div>
    );
  }

  // TEACHER/ADMIN VIEW
  return (
    <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-700">
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
            <p className="text-muted-foreground mt-1">Manage and record daily session presence.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!isOnline && (
            <Badge variant="destructive" className="h-11 px-4 rounded-xl gap-2 border-none">
              <WifiOff className="w-4 h-4" /> Offline Cache Active
            </Badge>
          )}
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10">
            <CalendarIcon className="w-4 h-4 text-primary" /> 
            {format(date, "PPP")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES_ATTENDANCE.map((cls) => (
          <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white">
            <div className={cn(
              "h-1.5 w-full",
              cls.status === 'high' ? "bg-green-500" : "bg-amber-500"
            )} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                    <User className="w-3.5 h-3.5" /> {cls.teacher}
                  </CardDescription>
                </div>
                <div className="p-3 rounded-2xl bg-accent/30 font-black text-primary">
                  {cls.percentage}%
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                  <span>Live Presence today</span>
                  <span>{cls.presentToday} / {cls.totalStudents}</span>
                </div>
                <Progress value={cls.percentage} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="bg-accent/10 border-t p-4 pt-4">
              <Button 
                variant="ghost" 
                className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs w-full"
                onClick={() => setSelectedClassDetails(cls)}
              >
                View Class Records
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* TEACHER REGISTER TABLE */}
      {!isAdmin && (
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-primary text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <CardTitle className="text-2xl font-black">Session Register</CardTitle>
                <CardDescription className="text-white/60">Mark presence for students in this session.</CardDescription>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="text-center border-r border-white/20 pr-4">
                  <p className="text-[9px] font-black uppercase opacity-60">Present</p>
                  <p className="text-xl font-black text-secondary">{headCount.present}</p>
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
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.map(s => (
                  <TableRow key={s.id} className="hover:bg-accent/5">
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
                        {registryState[s.id].toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant={registryState[s.id] === 'present' ? 'default' : 'outline'}
                          className="h-8 px-4 text-[10px] uppercase font-black"
                          onClick={() => setStatus(s.id, 'present')}
                        >
                          <Check className="w-3 h-3 mr-1" /> Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant={registryState[s.id] === 'absent' ? 'destructive' : 'outline'}
                          className="h-8 px-4 text-[10px] uppercase font-black"
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
          <CardFooter className="bg-accent/10 p-6 flex justify-end">
            <Button className="h-12 px-10 rounded-xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" onClick={handleSubmitRegistry} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Commit Session Registry
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
