"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/shared/loading-state";
import { 
  CalendarIcon, 
  CheckCircle2, 
  Clock, 
  History, 
  ShieldCheck, 
  ArrowRight, 
  FileDown, 
  Eye, 
  CalendarDays, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Check, 
  X, 
  Award, 
  Zap, 
  Pencil,
  XCircle,
  Users,
  LayoutGrid,
  Activity,
  TrendingUp,
  Filter,
  Search,
  User,
  Printer
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- CONSTANTS & MOCK DATA ---
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology"];

const MOCK_TEACHER_SUBJECTS = [
  { id: "TS1", name: "Advanced Physics", class: "2nde / Form 5", students: 42, period: "08:00 AM - 10:00 AM", teacher: "Dr. Aris Tesla", avatar: "https://picsum.photos/seed/t1/100/100" },
  { id: "TS2", name: "General Chemistry", class: "1ère / Lower Sixth", students: 38, period: "10:30 AM - 12:30 PM", teacher: "Dr. White", avatar: "https://picsum.photos/seed/t4/100/100" },
  { id: "TS3", name: "Mathematics", class: "2nde / Form 5", students: 42, period: "10:30 AM - 12:30 PM", teacher: "Prof. Sarah Smith", avatar: "https://picsum.photos/seed/t2/100/100" },
  { id: "TS4", name: "English Literature", class: "2nde / Form 5", students: 42, period: "01:30 PM - 03:30 PM", teacher: "Ms. Bennet", avatar: "https://picsum.photos/seed/t3/100/100" },
  { id: "TS5", name: "Biology", class: "2nde / Form 5", students: 42, period: "08:00 AM - 10:00 AM", teacher: "Mr. Abena", avatar: "https://picsum.photos/seed/t5/100/100" },
];

const MOCK_HISTORICAL_SESSIONS = [
  { id: "H1", date: "2024-05-23", subject: "Advanced Physics", class: "2nde / Form 5", present: 40, absent: 2 },
  { id: "H2", date: "2024-05-22", subject: "General Chemistry", class: "1ère / Lower Sixth", present: 35, absent: 3 },
];

const MOCK_STUDENTS = [
  { id: "GBHS26S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "GBHS26S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "GBHS26S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "GBHS26S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100" },
  { id: "GBHS26S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100" },
  { id: "GBHS26S006", name: "Fiona Gallagher", avatar: "https://picsum.photos/seed/s6/100/100" },
];

const MOCK_CLASSES_ADMIN = [
  { 
    id: "C1", 
    name: "6ème / Form 1", 
    percentage: 94, 
    totalStudents: 45, 
    presentToday: 42, 
    status: "high", 
    teacher: "Mr. Abena",
    teachers: 12,
    performance: 82,
    masterAvatar: "https://picsum.photos/seed/t4/100/100"
  },
  { 
    id: "C2", 
    name: "2nde / Form 5", 
    percentage: 91, 
    totalStudents: 42, 
    presentToday: 38, 
    status: "medium", 
    teacher: "Dr. Tesla",
    teachers: 14,
    performance: 88,
    masterAvatar: "https://picsum.photos/seed/t1/100/100"
  },
  { 
    id: "C3", 
    name: "Terminale / Upper Sixth", 
    percentage: 95, 
    totalStudents: 38, 
    presentToday: 36, 
    status: "high", 
    teacher: "Prof. Sarah Smith",
    teachers: 10,
    performance: 92,
    masterAvatar: "https://picsum.photos/seed/t2/100/100"
  },
];

const MOCK_TODAY_ATTENDANCE = [
  { subject: "Advanced Physics", status: "present", time: "08:00 AM", teacher: "Dr. Aris Tesla" },
  { subject: "Mathematics", status: "present", time: "10:30 AM", teacher: "Prof. Sarah Smith" },
  { subject: "English Literature", status: "absent", time: "01:30 PM", teacher: "Ms. Bennet" },
];

const MOCK_STUDENT_HISTORY = [
  { year: "2023 / 2024", term: "Term 1", subject: "Advanced Physics", present: 22, absent: 2, rate: 92 },
  { year: "2023 / 2024", term: "Term 1", subject: "Mathematics", present: 24, absent: 0, rate: 100 },
  { year: "2023 / 2024", term: "Term 1", subject: "English Literature", present: 18, absent: 2, rate: 90 },
  { year: "2022 / 2023", term: "Term 3", subject: "General Science", present: 18, absent: 4, rate: 81 },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [teacherMode, setTeacherMode] = useState<"select" | "register">("select");
  const [activeSession, setActiveSession] = useState<any>(null);
  const [viewingHistorySession, setViewingHistorySession] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Admin View State
  const [adminView, setAdminView] = useState<"list" | "details" | "registry">("list");
  const [inspectedClass, setInspectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);

  const [registryState, setRegistryState] = useState<Record<string, 'present' | 'absent'>>(
    MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {})
  );
  
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenRegister = (session: any) => {
    setActiveSession(session);
    setTeacherMode("register");
  };

  const handleEditHistory = (historyItem: any) => {
    setActiveSession({
      name: historyItem.subject || historyItem.name,
      class: historyItem.class,
      date: historyItem.date
    });
    setViewingHistorySession(null);
    setTeacherMode("register");
  };

  const handleSubmitRegistry = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTeacherMode("select");
      setActiveSession(null);
      toast({ title: "Registry Synchronized" });
    }, 1200);
  };

  const activeTeacherInfo = useMemo(() => {
    return MOCK_TEACHER_SUBJECTS.find(s => s.name === selectedSubject) || MOCK_TEACHER_SUBJECTS[0];
  }, [selectedSubject]);

  if (isLoading) return <LoadingState message="Connecting to node..." />;

  // --- TEACHER VIEW ---
  if (isTeacher) {
    return (
      <div className="space-y-8 pb-20">
        {teacherMode === "select" ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl shadow-lg"><CheckCircle2 className="w-6 h-6 text-secondary" /></div>
                  Subject Register
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">Manage daily attendance for your assigned courses.</p>
              </div>
              <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/10 bg-white text-primary font-bold">
                <CalendarIcon className="w-4 h-4 mr-2" /> {format(new Date(), "PPP")}
              </Badge>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
                <TabsTrigger value="active" className="gap-2 py-3 rounded-xl font-bold">Sessions</TabsTrigger>
                <TabsTrigger value="history" className="gap-2 py-3 rounded-xl font-bold">History</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_TEACHER_SUBJECTS.map((session) => (
                    <Card key={session.id} className="border-none shadow-sm overflow-hidden bg-white rounded-3xl group hover:shadow-md transition-all">
                      <div className="h-1.5 w-full bg-primary" />
                      <CardHeader>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase w-fit mb-2">{session.class}</Badge>
                        <CardTitle className="text-xl font-black text-primary uppercase">{session.name}</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-secondary" /> {session.period}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="bg-accent/10 border-t p-3">
                        <Button className="w-full rounded-xl font-black uppercase text-[10px] tracking-widest h-10 shadow-lg" onClick={() => handleOpenRegister(session)}>
                          Open Register <ArrowRight className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                  <CardHeader className="bg-primary/5 border-b p-8">
                    <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
                      <History className="w-5 h-5 text-secondary" /> Previous Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-accent/10 uppercase text-[9px] font-black">
                        <TableRow>
                          <TableHead className="pl-8 py-4">Session Date</TableHead>
                          <TableHead>Course & Class</TableHead>
                          <TableHead className="text-center">Present</TableHead>
                          <TableHead className="text-center">Absent</TableHead>
                          <TableHead className="text-right pr-8">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_HISTORICAL_SESSIONS.map((hist) => (
                          <TableRow key={hist.id} className="hover:bg-accent/5 h-16 border-b">
                            <TableCell className="pl-8 font-bold text-xs">{hist.date}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-black text-primary text-xs uppercase">{hist.subject}</span>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{hist.class}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-black text-green-600">{hist.present}</TableCell>
                            <TableCell className="text-center font-black text-red-600">{hist.absent}</TableCell>
                            <TableCell className="text-right pr-8">
                              <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase hover:bg-primary hover:text-white" onClick={() => setViewingHistorySession(hist)}>
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Dialog open={!!viewingHistorySession} onOpenChange={() => setViewingHistorySession(null)}>
              <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white relative">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <History className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black uppercase">Session Detail</DialogTitle>
                      <DialogDescription className="text-white/60">
                        {viewingHistorySession?.subject} • {viewingHistorySession?.date}
                      </DialogDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setViewingHistorySession(null)} className="absolute top-4 right-4 text-white hover:bg-white/10">
                    <X className="w-6 h-6" />
                  </Button>
                </DialogHeader>
                <div className="p-0 max-h-[60vh] overflow-y-auto">
                  <Table>
                    <TableHeader className="bg-accent/30 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10 border-b">
                      <TableRow>
                        <TableHead className="pl-8 py-4">Student Profile</TableHead>
                        <TableHead>Matricule</TableHead>
                        <TableHead className="text-right pr-8">Presence Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_STUDENTS.map((s, idx) => (
                        <TableRow key={s.id} className="hover:bg-accent/5 border-b border-accent/10 h-14">
                          <TableCell className="pl-8">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 border shadow-sm">
                                <AvatarImage src={s.avatar} />
                                <AvatarFallback className="text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-xs text-primary uppercase">{s.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-[10px] font-bold opacity-60 uppercase">{s.id}</TableCell>
                          <TableCell className="text-right pr-8">
                            <Badge className={cn(
                              "text-[8px] font-black uppercase border-none px-2",
                              idx % 4 === 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                            )}>
                              {idx % 4 === 0 ? "ABSENT" : "PRESENT"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
                   <div className="flex items-center gap-2 text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                      <p className="text-[10px] font-black uppercase italic opacity-40">Verified Institutional Record</p>
                   </div>
                   <Button className="gap-2 rounded-xl font-bold text-xs uppercase h-10 px-6 shadow-lg" onClick={() => handleEditHistory(viewingHistorySession)}>
                     <Pencil className="w-3.5 h-3.5" /> Modify Record
                   </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setTeacherMode("select")} className="rounded-full hover:bg-white shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary font-headline uppercase">{activeSession?.name}</h1>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{activeSession?.class} • {activeSession?.date || format(new Date(), "PP")}</p>
              </div>
            </div>

            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-primary text-white p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-2xl font-black uppercase">Active Class Register</CardTitle>
                    <CardDescription className="text-white/60">Toggle presence status for each student.</CardDescription>
                  </div>
                  <Button variant="ghost" className="text-white hover:bg-white/10 text-[9px] font-black uppercase" onClick={() => {
                    const allPresent = MOCK_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: 'present' }), {});
                    setRegistryState(allPresent);
                  }}>Mark All Present</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableBody>
                    {MOCK_STUDENTS.map(s => (
                      <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b">
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border shadow-sm"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-primary uppercase">{s.name}</span>
                              <span className="text-[10px] font-mono text-muted-foreground opacity-60 uppercase">{s.id}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant={registryState[s.id] === 'present' ? 'default' : 'outline'} 
                              className={cn("rounded-xl font-bold text-xs gap-2", registryState[s.id] === 'present' ? "bg-green-600 hover:bg-green-700" : "")}
                              onClick={() => setRegistryState(prev => ({ ...prev, [s.id]: 'present' }))}
                            >
                              <Check className="w-4 h-4" /> Present
                            </Button>
                            <Button 
                              variant={registryState[s.id] === 'absent' ? 'destructive' : 'outline'} 
                              className="rounded-xl font-bold text-xs gap-2"
                              onClick={() => setRegistryState(prev => ({ ...prev, [s.id]: 'absent' }))}
                            >
                              <X className="w-4 h-4" /> Absent
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
                  Commit Daily Register
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // --- ADMIN VIEW (OVERSIGHT) ---
  if (isAdmin) {
    if (adminView === "list") {
      return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline uppercase tracking-tighter">Attendance Governance</h1>
              <p className="text-muted-foreground mt-1 text-sm">Audit institutional participation and session presence registry.</p>
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold bg-white" onClick={() => toast({ title: "Global Log Exported" })}>
              <FileDown className="w-4 h-4 mr-2" /> Global Presence Audit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_CLASSES_ADMIN.map((cls) => (
              <Card key={cls.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-xl transition-all duration-500 rounded-[2rem]">
                <div className="h-1.5 w-full bg-primary" />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase mb-2">Presence Cluster</Badge>
                    <div className="p-2 bg-accent rounded-xl"><LayoutGrid className="w-4 h-4 text-primary" /></div>
                  </div>
                  <CardTitle className="text-xl font-black text-primary uppercase leading-tight">{cls.name}</CardTitle>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-accent/50">
                    <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-accent">
                      <AvatarImage src={cls.masterAvatar} />
                      <AvatarFallback>{cls.teacher.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Class Master</p>
                      <p className="text-xs font-bold text-primary truncate">{cls.teacher}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-accent/30 p-2.5 rounded-xl border border-accent text-center">
                      <p className="text-[8px] font-black uppercase text-muted-foreground mb-0.5">Students</p>
                      <p className="text-sm font-black text-primary">{cls.totalStudents}</p>
                    </div>
                    <div className="bg-accent/30 p-2.5 rounded-xl border border-accent text-center">
                      <p className="text-[8px] font-black uppercase text-muted-foreground mb-0.5">Assigned Teachers</p>
                      <p className="text-sm font-black text-primary">{cls.teachers}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-muted-foreground flex items-center gap-1"><Activity className="w-3 h-3"/> Session Presence</span>
                        <span className="text-primary">{cls.percentage}%</span>
                      </div>
                      <Progress value={cls.percentage} className="h-1 rounded-full [&>div]:bg-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black uppercase">
                        <span className="text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Discipline Score</span>
                        <span className="text-secondary">{cls.performance}%</span>
                      </div>
                      <Progress value={cls.performance} className="h-1 rounded-full [&>div]:bg-secondary" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 border-t p-3">
                  <Button 
                    className="w-full h-10 rounded-xl bg-white border-primary/10 text-primary hover:bg-primary hover:text-white font-black uppercase text-[10px] tracking-widest shadow-sm group/btn transition-all"
                    onClick={() => { setInspectedClass(cls); setAdminView("details"); }}
                  >
                    <Eye className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" /> Audit Sessions
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (adminView === "details") {
      return (
        <div className="space-y-8 pb-20 animate-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setAdminView("list")} className="rounded-full hover:bg-white shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline uppercase">{inspectedClass?.name}</h1>
              <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Attendance Session Dossier</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all duration-500">
              <div className="h-2 w-full bg-primary" />
              <CardHeader className="p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-10 h-10" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-primary uppercase">Daily Subject Register</CardTitle>
                  <CardDescription className="text-sm font-medium mt-2">Active session pedagogical presence and teacher-led registers.</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="bg-accent/10 p-6 border-t flex justify-center">
                <Button 
                  className="h-12 px-10 rounded-2xl font-black uppercase text-xs tracking-widest gap-2 shadow-lg"
                  onClick={() => setAdminView("registry")}
                >
                  <Eye className="w-4 h-4" /> Open Register
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all duration-500">
              <div className="h-2 w-full bg-secondary" />
              <CardHeader className="p-10 text-center space-y-4">
                <div className="w-20 h-20 bg-secondary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary group-hover:scale-110 transition-transform">
                  <History className="w-10 h-10" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black text-primary uppercase">Historical Presence Analytics</CardTitle>
                  <CardDescription className="text-sm font-medium mt-2">Historical participation archives and verified reports from past sessions.</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="bg-accent/10 p-6 border-t flex justify-center">
                <Button 
                  variant="secondary" 
                  className="h-12 px-10 rounded-2xl font-black uppercase text-xs tracking-widest gap-2 shadow-lg bg-secondary text-primary hover:bg-secondary/90"
                  onClick={() => toast({ title: "Loading History Archives..." })}
                >
                  <Eye className="w-4 h-4" /> View Archives
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      );
    }

    if (adminView === "registry") {
      return (
        <div className="space-y-8 pb-20 animate-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setAdminView("details")} className="rounded-full hover:bg-white shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline uppercase">{inspectedClass?.name} Register</h1>
                <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Active Presence Audit</p>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold bg-white gap-2" onClick={() => window.print()}>
              <Printer className="w-4 h-4" /> Print Registry
            </Button>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2 w-full">
              <Label className="text-[10px] font-black uppercase text-primary ml-1 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5" /> Subject Filter
              </Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-12 bg-primary/5 border-primary/10 rounded-xl font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden md:flex flex-col items-center justify-center px-8 border-l border-accent">
               <p className="text-[10px] font-black text-muted-foreground uppercase">Current Date</p>
               <p className="text-sm font-bold text-primary">{format(new Date(), "PPP")}</p>
            </div>
          </div>

          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-black uppercase tracking-tight">Daily Presence Ledger</CardTitle>
                <Badge variant="secondary" className="bg-secondary text-primary border-none font-black px-4 py-1 uppercase text-[9px]">READ-ONLY AUDIT</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead className="text-right pr-8">Presence Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENTS.map((s, idx) => {
                    // Vary status per subject
                    const isAbsent = (idx + SUBJECTS.indexOf(selectedSubject)) % 6 === 0;
                    return (
                      <TableRow key={s.id} className="hover:bg-accent/5 h-16 border-b border-accent/10 last:border-0">
                        <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary uppercase">{s.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge className={cn(
                            "text-[8px] font-black uppercase border-none px-3 gap-1.5 h-6",
                            isAbsent ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          )}>
                            {isAbsent ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {isAbsent ? 'ABSENT' : 'PRESENT'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/30 p-8 border-t flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-4 border-white shadow-xl ring-1 ring-primary/10">
                    <AvatarImage src={activeTeacherInfo.avatar} />
                    <AvatarFallback className="bg-primary text-white font-bold">{activeTeacherInfo.teacher.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Subject Teacher</p>
                    <h4 className="text-base font-black text-primary uppercase leading-tight">{activeTeacherInfo.teacher}</h4>
                    <p className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Verified Pedagogical Lead</p>
                  </div>
               </div>
               <div className="flex items-center gap-2 text-muted-foreground italic">
                  <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Records digitally signed by subject lead.</p>
               </div>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }

  // --- STUDENT VIEW (PORTAL) ---
  return (
    <div className="space-y-8 pb-20 animate-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <CheckCircle2 className="w-6 h-6 text-secondary" />
            </div>
            My Participation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Detailed chronological record of your pedagogical presence.</p>
        </div>
        <Button variant="outline" className="rounded-xl h-11 px-6 font-bold bg-white border-primary/10 gap-2" onClick={() => toast({ title: "History Exported" })}>
          <FileDown className="w-4 h-4 text-primary" /> Download Record
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Attendance Rate</p>
               <p className="text-2xl font-black text-primary">94.5%</p>
            </div>
         </Card>
         <Card className="border-none shadow-sm bg-secondary/20 p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="p-3 bg-secondary/40 rounded-2xl text-primary group-hover:scale-110 transition-transform"><Award className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Integrity Status</p>
               <p className="text-2xl font-black text-primary">EXCELLENT</p>
            </div>
         </Card>
         <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover:scale-110 transition-transform"><History className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Total Sessions</p>
               <p className="text-2xl font-black text-primary">142</p>
            </div>
         </Card>
      </div>

      {/* TODAY'S ATTENDANCE SECTION */}
      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-secondary/10 border-b p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary text-primary rounded-2xl shadow-lg">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight text-primary">Today's Presence</CardTitle>
                <CardDescription className="font-bold text-primary/60">Live session participation registry.</CardDescription>
              </div>
            </div>
            <Badge className="bg-primary text-white border-none font-black px-4 py-1 uppercase text-[10px]">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/30 uppercase text-[9px] font-black tracking-widest border-b">
              <TableRow>
                <TableHead className="pl-8 py-4">Subject</TableHead>
                <TableHead>Heure / Time</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TODAY_ATTENDANCE.map((today, i) => (
                <TableRow key={i} className="hover:bg-accent/5 h-16 border-b last:border-0">
                  <TableCell className="pl-8 font-black uppercase text-xs text-primary">{today.subject}</TableCell>
                  <TableCell className="font-bold text-xs">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary/40" />
                      {today.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-muted-foreground uppercase">{today.teacher}</TableCell>
                  <TableCell className="text-right pr-8">
                    <Badge className={cn(
                      "text-[8px] font-black border-none px-3 gap-1.5",
                      today.status === 'present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {today.status === 'present' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {today.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-4 border-t flex justify-center">
           <div className="flex items-center gap-2 text-muted-foreground italic">
              <Zap className="w-3.5 h-3.5 text-secondary animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Live Node Sync Active</p>
           </div>
        </CardFooter>
      </Card>

      <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 p-8 border-b">
          <CardTitle className="text-xl font-black text-primary uppercase flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-secondary" /> Attendance Records History
          </CardTitle>
          <CardDescription>Verified subject-wise participation ledger for current and previous terms.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
              <TableRow>
                <TableHead className="pl-8 py-4">Year</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Present</TableHead>
                <TableHead className="text-center">Absent</TableHead>
                <TableHead className="text-right pr-8">Rate (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STUDENT_HISTORY.map((hist, i) => (
                <TableRow key={i} className="hover:bg-accent/5 h-16 border-b last:border-0">
                  <TableCell className="pl-8 font-bold text-xs text-muted-foreground">{hist.year}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/20">{hist.term}</Badge></TableCell>
                  <TableCell className="font-black text-primary uppercase text-xs">{hist.subject}</TableCell>
                  <TableCell className="text-center font-black text-green-600">{hist.present}</TableCell>
                  <TableCell className="text-center font-black text-red-600">{hist.absent}</TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="inline-flex flex-col items-end gap-1.5 min-w-[80px]">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-black", hist.rate >= 90 ? "text-green-600" : "text-amber-600")}>
                          {hist.rate}%
                        </span>
                        {hist.rate >= 95 && <Zap className="w-3 h-3 text-secondary fill-current" />}
                      </div>
                      <div className="w-24 h-1.5 bg-accent rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-1000", hist.rate >= 90 ? "bg-green-500" : "bg-amber-500")} 
                          style={{ width: `${hist.rate}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-6 border-t flex justify-center">
           <div className="flex items-center gap-2 text-muted-foreground italic">
              <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Institutional Pedagogical Record</p>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
}