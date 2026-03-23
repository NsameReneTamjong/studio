
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, setDoc, serverTimestamp } from "firebase/firestore";

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("seq1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";

  // Data Fetching
  const coursesQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId) return null;
    return query(collection(db, "schools", user.schoolId, "courses"), where("teacherUid", "==", user.uid));
  }, [db, user?.schoolId, user?.uid]);
  const { data: myCourses } = useCollection(coursesQuery);

  const selectedCourse = myCourses?.find(c => c.id === selectedCourseId);

  const studentsQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId || !selectedCourse) return null;
    return query(collection(db, "users"), where("schoolId", "==", user.schoolId), where("role", "==", "STUDENT"), where("class", "==", selectedCourse.targetClass));
  }, [db, user?.schoolId, selectedCourse]);
  const { data: students } = useCollection(studentsQuery);

  const gradesQuery = useMemoFirebase(() => {
    if (!db || !user?.schoolId || !selectedCourseId) return null;
    return query(collection(db, "schools", user.schoolId, "grades"), where("courseId", "==", selectedCourseId));
  }, [db, user?.schoolId, selectedCourseId]);
  const { data: grades } = useCollection(gradesQuery);

  const handleUpdateMark = async (studentUid: string, studentName: string, value: string) => {
    if (!user?.schoolId || !selectedCourseId) return;
    const mark = parseFloat(value);
    if (isNaN(mark)) return;

    try {
      const gradeId = `${studentUid}_${selectedCourseId}`;
      const gradeRef = doc(db, "schools", user.schoolId, "grades", gradeId);
      await setDoc(gradeRef, {
        studentUid,
        studentName,
        courseId: selectedCourseId,
        courseName: selectedCourse?.name,
        [selectedSequence]: mark,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to record mark." });
    }
  };

  const getStudentMark = (studentUid: string) => {
    const grade = grades?.find(g => g.studentUid === studentUid);
    return grade?.[selectedSequence as keyof typeof grade] || "";
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
                    {myCourses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name} ({c.targetClass})</SelectItem>)}
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
                {students?.map((s) => (
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
                        onBlur={(e) => handleUpdateMark(s.uid, s.name, e.target.value)}
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
                        <Badge className={cn("text-[9px] border-none text-white", getAppreciation(parseFloat(getStudentMark(s.uid))).color)}>
                          {getAppreciation(parseFloat(getStudentMark(s.uid))).text}
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
