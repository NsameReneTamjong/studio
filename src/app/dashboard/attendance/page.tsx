
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Pencil
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data for Teacher & Admin Views (Kept for functional integrity of the shared route)
const MOCK_TEACHER_SUBJECTS = [
  { id: "TS1", name: "Advanced Physics", class: "2nde / Form 5", students: 42, period: "08:00 AM - 10:00 AM" },
  { id: "TS2", name: "General Chemistry", class: "1ère / Lower Sixth", students: 38, period: "10:30 AM - 12:30 PM" },
];

const MOCK_HISTORICAL_SESSIONS = [
  { id: "H1", date: "2024-05-23", subject: "Advanced Physics", class: "2nde / Form 5", present: 40, absent: 2 },
  { id: "H2", date: "2024-05-22", subject: "General Chemistry", class: "1ère / Lower Sixth", present: 35, absent: 3 },
];

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100" },
];

const MOCK_CLASSES_ADMIN = [
  { id: "C1", name: "6ème / Form 1", percentage: 94, totalStudents: 45, presentToday: 42, status: "high", teacher: "Mr. Abena" },
  { id: "C2", name: "2nde / Form 5", percentage: 91, totalStudents: 42, presentToday: 38, status: "medium", teacher: "Dr. Tesla" },
];

// --- STUDENT SPECIFIC HISTORY DATA ---
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
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg"><CheckCircle2 className="w-6 h-6 text-secondary" /></div>
              Attendance Audit
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Strategic institutional oversight of session participation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CLASSES_ADMIN.map((cls) => (
            <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white rounded-3xl">
              <div className={cn("h-1.5 w-full", cls.status === 'high' ? "bg-green-500" : "bg-amber-500")} />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-black text-primary uppercase">{cls.name}</CardTitle>
                    <CardDescription className="text-[9px] font-bold uppercase tracking-widest mt-1">{cls.teacher}</CardDescription>
                  </div>
                  <Badge className="bg-accent text-primary border-none h-8 font-black">{cls.percentage}%</Badge>
                </div>
              </CardHeader>
              <CardFooter className="bg-accent/10 border-t p-3">
                <Button variant="ghost" className="flex-1 justify-between hover:bg-white text-primary font-bold text-[10px] uppercase w-full rounded-xl">
                  Inspect Subjects <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
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
         <Card className="border-none shadow-sm bg-white p-6 rounded-3xl flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="p-3 bg-secondary/20 rounded-2xl text-primary group-hover:scale-110 transition-transform"><Award className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Integrity Status</p>
               <p className="text-2xl font-black text-secondary">EXCELLENT</p>
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
