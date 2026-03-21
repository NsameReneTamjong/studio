
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  FileText,
  ChevronRight,
  BookOpen,
  User,
  History,
  Pencil,
  Save,
  AlertCircle,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", status: "present", presentCount: 22, absentCount: 2 },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", status: "present", presentCount: 18, absentCount: 6 },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", status: "absent", presentCount: 15, absentCount: 9 },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", status: "late", presentCount: 24, absentCount: 0 },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", status: "present", presentCount: 12, absentCount: 12 },
];

const TEACHER_SUBJECTS = [
  { id: "math", name: "Mathematics" },
  { id: "physics", name: "Physics" }
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [selectedSubject, setSelectedSubject] = useState(TEACHER_SUBJECTS[0].id);
  const [editingStudent, setEditingHistoryStudent] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Personal Attendance Unavailable</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md">
          Attendance records for your children can be found within each child's specific dashboard.
        </p>
        <Button asChild>
          <Link href="/dashboard/children">Go to My Children</Link>
        </Button>
      </div>
    );
  }

  const setStatus = (id: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSaveHistoryEdit = () => {
    toast({
      title: "History Updated",
      description: "Student attendance record has been modified in the registry.",
    });
    setEditingHistoryStudent(null);
  };

  if (!isTeacher) {
    // Student View (Simplified)
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">{t("attendance")}</h1>
            <p className="text-sm text-muted-foreground mt-1">Review your presence and punctuality records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <Card className="border-none shadow-sm bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Present Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-green-700">96.4%</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Late Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-amber-700">2</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-red-700">1</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Today's Presence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "May 24, 2024", subject: "Mathematics", status: "present" },
                { date: "May 24, 2024", subject: "Physics", status: "present" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-accent">
                  <div>
                    <p className="font-semibold">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge className={cn(
                    item.status === 'present' ? "bg-green-600" : "bg-amber-600"
                  )}>
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Teacher View
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Institutional Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage session registers and historical presence records.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full sm:w-[200px]">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {TEACHER_SUBJECTS.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full sm:w-[200px] justify-start text-left font-normal bg-white", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Tabs defaultValue="register" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-xl">
          <TabsTrigger value="register" className="gap-2 py-2">
            <CheckCircle2 className="w-4 h-4" /> Take Register
          </TabsTrigger>
          <TabsTrigger value="records" className="gap-2 py-2">
            <History className="w-4 h-4" /> Subject Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm h-fit">
              <CardHeader>
                <CardTitle className="text-base">Session Analytics</CardTitle>
                <CardDescription>{TEACHER_SUBJECTS.find(s => s.id === selectedSubject)?.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Present", color: "bg-green-500", count: students.filter(s => s.status === 'present').length },
                  { label: "Late", color: "bg-amber-500", count: students.filter(s => s.status === 'late').length },
                  { label: "Absent", color: "bg-red-500", count: students.filter(s => s.status === 'absent').length },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span>{stat.count} / {students.length}</span>
                    </div>
                    <div className="h-2 bg-accent rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full transition-all duration-500", stat.color)} 
                        style={{ width: `${(stat.count / students.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t bg-accent/10">
                <Button className="w-full shadow-lg" onClick={() => toast({ title: "Register Submitted", description: "Attendance session has been synced with the institutional server." })}>
                  Submit Final Register
                </Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3 border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Attendance List</CardTitle>
                  <CardDescription>Target: Section A • {format(date, "PPP")}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStudents(prev => prev.map(s => ({...s, status: 'present'})))}>
                  Mark All Present
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-accent hover:bg-accent/10 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary leading-none">{student.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono mt-1 uppercase">ID: {student.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant={student.status === 'present' ? 'default' : 'outline'}
                          className={cn("h-8 px-3 text-[10px] uppercase font-black", student.status === 'present' && "bg-green-600 hover:bg-green-700")}
                          onClick={() => setStatus(student.id, 'present')}
                        >
                          Present
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.status === 'late' ? 'default' : 'outline'}
                          className={cn("h-8 px-3 text-[10px] uppercase font-black", student.status === 'late' && "bg-amber-600 hover:bg-amber-700")}
                          onClick={() => setStatus(student.id, 'late')}
                        >
                          Late
                        </Button>
                        <Button 
                          size="sm" 
                          variant={student.status === 'absent' ? 'default' : 'outline'}
                          className={cn("h-8 px-3 text-[10px] uppercase font-black", student.status === 'absent' && "bg-red-600 hover:bg-red-700")}
                          onClick={() => setStatus(student.id, 'absent')}
                        >
                          Absent
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <History className="w-5 h-5 text-secondary" />
                    {TEACHER_SUBJECTS.find(s => s.id === selectedSubject)?.name} - Attendance Registry
                  </CardTitle>
                  <CardDescription className="text-white/60">Aggregated historical presence records for current academic year.</CardDescription>
                </div>
                <Badge className="bg-white/20 text-white border-none">Active Term</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6 py-4">Student Profile</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead className="text-center">Times Present</TableHead>
                    <TableHead className="text-center">Times Absent</TableHead>
                    <TableHead className="text-center">Attendance %</TableHead>
                    <TableHead className="text-right pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-accent/5">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                          </Avatar>
                          <span className="font-bold text-sm text-primary">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold text-muted-foreground">{student.id}</TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-green-100 text-green-700 border-none font-bold">{student.presentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-700 border-none font-bold">{student.absentCount}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-mono font-black text-primary">
                        {Math.round((student.presentCount / (student.presentCount + student.absentCount)) * 100)}%
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-2 text-primary hover:bg-primary/10"
                          onClick={() => setEditingHistoryStudent(student)}
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit Record
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

      {/* History Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={() => setEditingHistoryStudent(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-white">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-white/20">
                <AvatarImage src={editingStudent?.avatar} />
                <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl text-white font-headline">Audit Records: {editingStudent?.name}</DialogTitle>
                <DialogDescription className="text-white/60 uppercase text-[10px] font-bold tracking-widest">
                  Subject: {TEACHER_SUBJECTS.find(s => s.id === selectedSubject)?.name} • {editingStudent?.id}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="bg-accent/20 p-4 rounded-xl flex items-center gap-3 text-sm text-primary">
              <AlertCircle className="w-5 h-5" />
              <p>Modifying historical data affects general averages. Use with caution.</p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Session</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { date: "May 20, 2024", time: "08:00 AM", status: "present" },
                  { date: "May 18, 2024", time: "08:00 AM", status: "absent" },
                  { date: "May 15, 2024", time: "08:00 AM", status: "present" },
                  { date: "May 12, 2024", time: "08:00 AM", status: "late" },
                ].map((session, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-bold text-sm">{session.date}</p>
                      <p className="text-[10px] text-muted-foreground">{session.time}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select defaultValue={session.status}>
                        <SelectTrigger className="w-[120px] ml-auto h-8 text-[10px] font-black uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="p-6 bg-accent/30 border-t flex sm:flex-row gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setEditingHistoryStudent(null)}>Cancel</Button>
            <Button className="flex-1 gap-2 shadow-lg font-bold" onClick={handleSaveHistoryEdit}>
              <Save className="w-4 h-4" /> Save Corrections
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
