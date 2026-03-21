
"use client";

import { useState } from "react";
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
  List
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", status: "present", presentCount: 22, absentCount: 2 },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", status: "present", presentCount: 18, absentCount: 6 },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClassDetails, setSelectedClassDetails] = useState<any>(null);
  
  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-blue-600" />
        <h1 className="text-xl font-bold">Personal Attendance Unavailable</h1>
        <Button asChild><Link href="/dashboard/children">Go to My Children</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white rounded-xl h-11 border-primary/10">
            <CalendarIcon className="w-4 h-4 text-primary" /> 
            {format(date, "PPP")}
          </Button>
          {isAdmin && (
            <Button variant="secondary" className="gap-2 rounded-xl h-11 shadow-sm">
              <Download className="w-4 h-4" /> Export Report
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
              <Card key={cls.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className={cn(
                  "h-1.5 w-full",
                  cls.status === 'high' ? "bg-green-500" : cls.status === 'medium' ? "bg-blue-500" : "bg-red-500"
                )} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-black text-primary">{cls.name}</CardTitle>
                      <CardDescription className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" /> {cls.teacher}
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
                <CardFooter className="bg-accent/10 border-t p-4 pt-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between hover:bg-white text-primary font-bold text-xs"
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
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary text-white p-8">
                <CardTitle>Session Register: Form 5A</CardTitle>
                <CardDescription className="text-white/60">Mark presence for students in this academic session.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
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
                      <TableRow key={s.id} className="hover:bg-accent/5">
                        <TableCell className="pl-8 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                              <AvatarImage src={s.avatar} />
                              <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-primary">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black uppercase">Confirmed</Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" className="text-[10px] uppercase font-black px-4 hover:bg-primary hover:text-white transition-colors">Present</Button>
                            <Button size="sm" variant="outline" className="text-[10px] uppercase font-black px-4 hover:bg-destructive hover:text-white transition-colors">Absent</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-accent/10 border-t p-6 flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground italic">Submit within 15 minutes of session start.</p>
                <Button className="font-black uppercase tracking-widest text-xs px-8 h-11 rounded-xl shadow-lg">Submit Registry</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-4 mt-0">
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
              <CardHeader className="bg-white border-b">
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Subject Records
                </CardTitle>
                <CardDescription>Comprehensive term presence records for your subject.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Student</TableHead>
                      <TableHead className="text-center">Sessions Present</TableHead>
                      <TableHead className="text-center">Sessions Absent</TableHead>
                      <TableHead className="text-right pr-8">Aggregate %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_STUDENTS.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="pl-8 py-4 font-bold text-sm text-primary">{s.name}</TableCell>
                        <TableCell className="text-center font-bold text-green-600">{s.presentCount}</TableCell>
                        <TableCell className="text-center font-bold text-red-600">{s.absentCount}</TableCell>
                        <TableCell className="text-right pr-8 font-mono font-black text-primary">
                          {Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className={cn(
            "p-8 text-white",
            selectedClassDetails?.status === 'high' ? "bg-green-600" : selectedClassDetails?.status === 'medium' ? "bg-blue-600" : "bg-red-600"
          )}>
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-3xl font-black">{selectedClassDetails?.name}</DialogTitle>
                <DialogDescription className="text-white/70 font-bold flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" /> Lead Teacher: {selectedClassDetails?.teacher}
                </DialogDescription>
              </div>
              <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Term Average</p>
                <p className="text-3xl font-black">{selectedClassDetails?.percentage}%</p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2">Student Performance Matrix</h3>
                <Table>
                  <TableBody>
                    {MOCK_STUDENTS.map(s => (
                      <TableRow key={s.id} className="hover:bg-accent/5">
                        <TableCell className="py-3">
                          <span className="font-bold text-sm text-primary">{s.name}</span>
                        </TableCell>
                        <TableCell className="text-right py-3">
                          <Badge variant="outline" className="text-[10px] font-mono font-black">
                            {Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2">Institutional Audit</h3>
                <div className="space-y-4">
                  <div className="bg-accent/20 p-4 rounded-xl space-y-3">
                    <p className="text-xs font-bold leading-relaxed italic text-muted-foreground">
                      "Attendance for this class is {selectedClassDetails?.status === 'high' ? 'above' : selectedClassDetails?.status === 'medium' ? 'meeting' : 'below'} institutional benchmarks."
                    </p>
                    <div className="pt-2 border-t border-accent flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-muted-foreground">Registry Status</span>
                      <Badge className="bg-primary text-white border-none text-[9px] font-black">VALIDATED</Badge>
                    </div>
                  </div>
                  <Button className="w-full gap-2 h-11 rounded-xl" variant="outline">
                    <History className="w-4 h-4" /> View Full Session Logs
                  </Button>
                  <Button className="w-full gap-2 h-11 rounded-xl shadow-lg bg-primary">
                    <Download className="w-4 h-4" /> Download Parent Contact List
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
    </div>
  );
}
