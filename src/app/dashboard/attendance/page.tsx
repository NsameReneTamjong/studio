
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2, XCircle, Clock, MoreVertical, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", status: "present" },
  { id: "S002", name: "Bob Richards", status: "present" },
  { id: "S003", name: "Charlie Davis", status: "absent" },
  { id: "S004", name: "Diana Prince", status: "late" },
  { id: "S005", name: "Ethan Hunt", status: "present" },
];

export default function AttendancePage() {
  const [date, setDate] = useState<Date>(new Date());
  const [students, setStudents] = useState(MOCK_STUDENTS);

  const setStatus = (id: string, status: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

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
