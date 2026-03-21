
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
  History,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const MOCK_STUDENTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", status: "present", presentCount: 22, absentCount: 2 },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", status: "present", presentCount: 18, absentCount: 6 },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [date, setDate] = useState<Date>(new Date());
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
            {isAdmin ? "Institutional Presence Monitoring" : "Class Register"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Supervisory overview of institutional attendance trends and registries." : "Manage daily session presence records."}
          </p>
        </div>
        {isTeacher && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-white">
              <CalendarIcon className="w-4 h-4" /> {format(date, "PPP")}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue={isTeacher ? "register" : "records"} className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-xl">
          {isTeacher && (
            <TabsTrigger value="register" className="gap-2 py-2">
              <CheckCircle2 className="w-4 h-4" /> Take Register
            </TabsTrigger>
          )}
          <TabsTrigger value="records" className="gap-2 py-2">
            <History className="w-4 h-4" /> {isAdmin ? "Presence Reports" : "Subject Records"}
          </TabsTrigger>
        </TabsList>

        {isTeacher && (
          <TabsContent value="register" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle>Session Register</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {MOCK_STUDENTS.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 border rounded-xl">
                    <span className="font-bold">{s.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-[10px] uppercase">Present</Button>
                      <Button size="sm" variant="outline" className="text-[10px] uppercase">Absent</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="records" className="animate-in fade-in slide-in-from-bottom-2">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="flex items-center gap-2 text-white">
                <History className="w-5 h-5 text-secondary" />
                Institutional Attendance Registry
              </CardTitle>
              <CardDescription className="text-white/60">Comprehensive presence records for all current academic sessions.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead className="text-center">Present Sessions</TableHead>
                    <TableHead className="text-center">Absent Sessions</TableHead>
                    <TableHead className="text-right pr-6">Attendance %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENTS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="pl-6 py-4 font-bold text-sm text-primary">{s.name}</TableCell>
                      <TableCell className="text-center font-bold text-green-600">{s.presentCount}</TableCell>
                      <TableCell className="text-center font-bold text-red-600">{s.absentCount}</TableCell>
                      <TableCell className="text-right pr-6 font-mono font-black text-primary">
                        {Math.round((s.presentCount / (s.presentCount + s.absentCount)) * 100)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            {isAdmin && (
              <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest italic">Presence records are locked for management oversight.</p>
                <Button variant="outline" size="sm" className="gap-2 text-[10px] font-black uppercase">
                  <Download className="w-3.5 h-3.5" /> Full Attendance Audit
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Download({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
}
