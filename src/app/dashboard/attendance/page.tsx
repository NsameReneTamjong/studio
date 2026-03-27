
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
  AlertCircle,
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
  Search
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

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const isOnline = useOnlineStatus();
  
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [registryState, setRegistryState] = useState<Record<string, 'present' | 'absent'>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";
  const isParent = user?.role === "PARENT";
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
      });
      
      if (selectedClassDetails) setSelectedClassDetails(null);
    }, 1200);
  };

  const handleExportDailySummary = () => {
    toast({ title: "Report Generated", description: "Daily institutional attendance summary exported as PDF." });
  };

  if (isLoading) {
    return <LoadingState message="Fetching institutional presence records..." />;
  }

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-blue-600" />
        <h1 className="text-xl font-bold">Personal Attendance Unavailable</h1>
        <Button asChild className="rounded-xl"><Link href="/dashboard/children">Go to My Children</Link></Button>
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
          {isAdmin && (
            <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10 font-bold" onClick={handleExportDailySummary}>
              <FileDown className="w-4 h-4 text-primary" /> Export Daily Summary
            </Button>
          )}
          {!isOnline && (
            <Badge variant="destructive" className="h-11 px-4 rounded-xl gap-2 border-none">
              <WifiOff className="w-4 h-4" /> Offline Cache Active
            </Badge>
          )}
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10 font-bold">
            <CalendarIcon className="w-4 h-4 text-primary" /> 
            {format(date, "PPP")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES_ATTENDANCE.map((cls) => (
          <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white rounded-3xl">
            <div className={cn(
              "h-1.5 w-full",
              cls.status === 'high' ? "bg-green-500" : "bg-amber-500"
            )} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                    <User className="w-3.5 h-3.5 text-secondary" /> {cls.teacher}
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
                className="flex-1 justify-between hover:bg-white text-primary font-bold text-xs w-full rounded-xl"
                onClick={() => setSelectedClassDetails(cls)}
              >
                View Class Records
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* TEACHER REGISTER TABLE (Quick Access for active session) */}
      {!isAdmin && (
        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
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
              <TableHeader className="bg-accent/10 font-black uppercase text-[10px] tracking-widest">
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
                        <span className="font-bold text-sm text-primary uppercase">{s.name}</span>
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
                          className="h-8 px-4 text-[10px] uppercase font-black rounded-lg"
                          onClick={() => setStatus(s.id, 'present')}
                        >
                          <Check className="w-3 h-3 mr-1" /> Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant={registryState[s.id] === 'absent' ? 'destructive' : 'outline'}
                          className="h-8 px-4 text-[10px] uppercase font-black rounded-lg"
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

      {/* ADMIN CLASS DETAILS DIALOG */}
      <Dialog open={!!selectedClassDetails} onOpenChange={() => setSelectedClassDetails(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter">{selectedClassDetails?.name} Registry</DialogTitle>
                  <DialogDescription className="text-white/60">Institutional oversight for {selectedClassDetails?.teacher}'s class.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedClassDetails(null)} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-white border-b p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search students in class..." className="pl-10 h-11 bg-accent/20 border-none rounded-xl" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className="rounded-xl gap-2 font-bold h-11 px-6" onClick={() => toast({ title: "Printing batch...", description: "Pedagogical sheets prepared." })}>
                <Printer className="w-4 h-4 text-primary" /> Print Registry
              </Button>
              <Button className="rounded-xl shadow-lg h-11 px-8 font-black uppercase text-[10px] tracking-widest gap-2" onClick={handleSubmitRegistry} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Commit Changes
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <Table>
              <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest">
                <TableRow>
                  <TableHead className="pl-8 py-4">Student Profile</TableHead>
                  <TableHead className="text-center">Aggregate Rate</TableHead>
                  <TableHead className="text-center">Live Status</TableHead>
                  <TableHead className="text-right pr-8">Daily Entry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <TableRow key={s.id} className="hover:bg-accent/5">
                    <TableCell className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={s.avatar} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary uppercase">{s.name}</p>
                          <p className="text-[9px] font-mono text-muted-foreground uppercase">{s.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-black text-primary">{Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%</span>
                        <Progress value={(s.presentCount / (s.presentCount + s.absentCount)) * 100} className="h-1 w-16" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-2 h-5 border-none",
                        registryState[s.id] === 'present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {registryState[s.id]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex justify-end gap-1.5">
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
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Administrative Presence Audit Record</p>
             </div>
             <Button variant="outline" onClick={() => setSelectedClassDetails(null)} className="rounded-xl px-10 h-11 font-bold text-xs uppercase">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
