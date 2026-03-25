
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  FileText, 
  Award, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  X,
  Loader2,
  Printer,
  ShieldCheck,
  Filter,
  Building2
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const MOCK_COURSES = [
  { id: "PHY101", name: "Physics", targetClass: "2nde / Form 5" },
  { id: "MAT101", name: "Mathematics", targetClass: "2nde / Form 5" },
];

const MOCK_STUDENTS = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", isLicensePaid: true },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", isLicensePaid: true },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", isLicensePaid: false },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("seq1");
  const [grades, setGrades] = useState<Record<string, number>>({});

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  const handleUpdateMark = (studentUid: string, value: string) => {
    const mark = parseFloat(value);
    if (isNaN(mark)) return;
    setGrades({ ...grades, [`${studentUid}_${selectedSequence}`]: mark });
    toast({ title: "Mark Recorded", description: "The entry has been saved locally." });
  };

  const getStudentMark = (studentUid: string) => {
    return grades[`${studentUid}_${selectedSequence}`] || "";
  };

  if (!isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-600" />
        <h1 className="text-xl font-bold">Registry Oversight restricted to Faculty.</h1>
        <Button asChild><Link href="/dashboard">Return to Overview</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            Grade Management
          </h1>
          <p className="text-muted-foreground mt-1">Official registry for institutional evaluation cycles.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Evaluation Subject</p>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger className="w-[250px] h-11 bg-accent/30 border-none rounded-xl">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_COURSES.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.targetClass})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Evaluation Sequence</p>
                <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                  <SelectTrigger className="w-[180px] h-11 bg-accent/30 border-none rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seq1">Sequence 1</SelectItem>
                    <SelectItem value="seq2">Sequence 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!selectedCourseId ? (
            <div className="py-20 text-center text-muted-foreground italic">Please select a course to enter marks.</div>
          ) : (
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                  <TableHead className="pl-8 py-4">Matricule</TableHead>
                  <TableHead>Student Profile</TableHead>
                  <TableHead className="text-center">Evaluation Note / 20</TableHead>
                  <TableHead className="text-right pr-8">License Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENTS.map((s) => (
                  <TableRow key={s.uid} className="hover:bg-accent/5">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{s.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-primary">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        disabled={!s.isLicensePaid}
                        defaultValue={getStudentMark(s.uid)}
                        onBlur={(e) => handleUpdateMark(s.uid, e.target.value)}
                        className="w-16 h-9 mx-auto text-center font-bold"
                      />
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      {!s.isLicensePaid && (
                        <Badge variant="destructive" className="text-[9px] font-black uppercase gap-1">
                          <Lock className="w-2.5 h-2.5" /> Suspended
                        </Badge>
                      )}
                      {s.isLicensePaid && getStudentMark(s.uid) !== "" && (
                        <Badge className={cn("text-[9px] border-none text-white", getAppreciation(parseFloat(getStudentMark(s.uid).toString())).color)}>
                          {getAppreciation(parseFloat(getStudentMark(s.uid).toString())).text}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
             <ShieldCheck className="w-4 h-4 text-primary" />
             <p className="text-[10px] uppercase font-bold tracking-widest italic">All records are digitally signed and finalized upon entry.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
