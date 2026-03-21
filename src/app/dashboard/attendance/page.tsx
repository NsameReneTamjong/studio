
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical, 
  Users, 
  Info, 
  AlertCircle,
  FileText,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", status: "present" },
  { id: "S002", name: "Bob Richards", status: "present" },
  { id: "S003", name: "Charlie Davis", status: "absent" },
  { id: "S004", name: "Diana Prince", status: "late" },
  { id: "S005", name: "Ethan Hunt", status: "present" },
];

const MOCK_SUBJECT_RECORDS = [
  { subject: "Mathématiques", present: 22, absent: 2, late: 1 },
  { subject: "Physique", present: 18, absent: 4, late: 2 },
  { subject: "Anglais", present: 24, absent: 0, late: 1 },
  { subject: "Français", present: 21, absent: 3, late: 0 },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="bg-blue-100 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Personal Attendance Unavailable</h1>
        <p className="text-muted-foreground max-w-md">
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

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">{t("attendance")}</h1>
            <p className="text-muted-foreground mt-1">Review your presence and punctuality records.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg">
                <FileText className="w-4 h-4" /> {t("attendanceRecords")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t("attendanceRecords")} - Summary</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {MOCK_SUBJECT_RECORDS.map((rec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-accent bg-accent/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="font-bold">{rec.subject}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{t("present")}</p>
                        <p className="text-lg font-bold text-green-600">{rec.present}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">{t("absent")}</p>
                        <p className="text-lg font-bold text-red-600">{rec.absent}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary">
                        {t("viewDetails")} <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Present Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">96.4%</div>
              <p className="text-xs text-green-600 mt-1">Exceeds class average</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Late Arrivals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700">2</div>
              <p className="text-xs text-amber-600 mt-1">This semester</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">1</div>
              <p className="text-xs text-red-600 mt-1">Excused</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "May 24, 2024", subject: "Mathématiques", status: "present" },
                { date: "May 24, 2024", subject: "Physique", status: "present" },
                { date: "May 24, 2024", subject: "Anglais", status: "late" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border border-accent">
                  <div>
                    <p className="font-semibold">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                  <Badge variant={item.status === 'present' ? 'default' : item.status === 'late' ? 'secondary' : 'destructive'} className={cn(
                    item.status === 'present' && "bg-green-600",
                    item.status === 'late' && "bg-amber-600"
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Attendance Tracker</h1>
          <p className="text-muted-foreground mt-1">Mark and track student presence for each session.</p>
        </div>
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
            </PopoverContent>
          </Popover>
          <Button className="shadow-lg">Submit Register</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-base">Session Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Present</span>
                <span className="font-bold text-green-600">{students.filter(s => s.status === 'present').length}</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500" 
                  style={{ width: `${(students.filter(s => s.status === 'present').length / students.length) * 100}%` }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Late</span>
                <span className="font-bold text-amber-600">{students.filter(s => s.status === 'late').length}</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${(students.filter(s => s.status === 'late').length / students.length) * 100}%` }} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Absent</span>
                <span className="font-bold text-red-600">{students.filter(s => s.status === 'absent').length}</span>
              </div>
              <div className="h-2 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-500" 
                  style={{ width: `${(students.filter(s => s.status === 'absent').length / students.length) * 100}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Attendance Register</CardTitle>
              <CardDescription>Class: Physics 101 - Sec A</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setStudents(prev => prev.map(s => ({...s, status: 'present'})))}>
                Mark All Present
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 rounded-xl border border-accent hover:bg-accent/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{student.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant={student.status === 'present' ? 'default' : 'outline'}
                      className={cn("gap-1 px-4", student.status === 'present' && "bg-green-600 hover:bg-green-700")}
                      onClick={() => setStatus(student.id, 'present')}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Present
                    </Button>
                    <Button 
                      size="sm" 
                      variant={student.status === 'late' ? 'default' : 'outline'}
                      className={cn("gap-1 px-4", student.status === 'late' && "bg-amber-600 hover:bg-amber-700")}
                      onClick={() => setStatus(student.id, 'late')}
                    >
                      <Clock className="w-4 h-4" /> Late
                    </Button>
                    <Button 
                      size="sm" 
                      variant={student.status === 'absent' ? 'default' : 'outline'}
                      className={cn("gap-1 px-4", student.status === 'absent' && "bg-red-600 hover:bg-red-700")}
                      onClick={() => setStatus(student.id, 'absent')}
                    >
                      <XCircle className="w-4 h-4" /> Absent
                    </Button>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4 text-muted-foreground"/></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
