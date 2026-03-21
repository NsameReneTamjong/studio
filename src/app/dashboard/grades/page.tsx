
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
  Download, 
  Search, 
  FileText, 
  Award, 
  TrendingUp, 
  BookOpen, 
  User, 
  AlertCircle,
  History,
  CheckCircle2,
  Lock,
  ChevronRight,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const CAMEROON_SUBJECTS = [
  { name: "Mathématiques", coeff: 5, group: "Sciences" },
  { name: "Physique-Chimie", coeff: 4, group: "Sciences" },
];

const MOCK_GRADES_TEACHER = [
  { id: "S001", name: "Alice Thompson", seq1: 14.5, seq2: 12, coeff: 5 },
  { id: "S002", name: "Bob Richards", seq1: 8, seq2: 10.5, coeff: 5 },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState("mathématiques");
  const [isSaving, setIsSaving] = useState(false);

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  const handleSaveMarks = () => {
    if (!isTeacher) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Marks Recorded", description: "Updated in the official registry." });
    }, 1000);
  };

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-600" />
        <h1 className="text-xl font-bold">Personal Grades Unavailable</h1>
        <Button asChild><Link href="/dashboard/children">Go to My Children</Link></Button>
      </div>
    );
  }

  if (!isTeacher && !isAdmin) {
    // Student View (Summary already exists, simplified for space)
    return <div className="p-20 text-center">Student Gradebook Summary...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
            {isAdmin ? "Academic Performance Monitoring" : "Grade Management"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Supervisory view of school-wide marks and performance averages." : "Enter and validate student sequence marks."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Export Bulletin</Button>
          {isTeacher && (
            <Button className="gap-2 shadow-lg" onClick={handleSaveMarks} disabled={isSaving}>
              <Save className="w-4 h-4" /> Save Registry
            </Button>
          )}
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMEROON_SUBJECTS.map(s => (
                  <SelectItem key={s.name} value={s.name.toLowerCase()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-secondary/10 border-secondary/20">Sequence 2</Badge>
          </div>
          {isAdmin && <Badge className="bg-blue-100 text-blue-700 border-none">OVERSIGHT MODE</Badge>}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-accent/30 font-bold uppercase text-[10px]">
              <TableRow>
                <TableHead className="pl-6">Matricule</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Note / 20</TableHead>
                <TableHead className="text-right pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GRADES_TEACHER.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-6 font-mono font-bold text-primary">{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">
                    <Input 
                      defaultValue={student.seq1} 
                      disabled={isAdmin}
                      className="w-16 h-8 mx-auto text-center font-bold bg-accent/10 border-none"
                    />
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Badge variant="outline" className={cn("text-[9px] text-white border-none", getAppreciation(student.seq1).color)}>
                      {getAppreciation(student.seq1).text}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        {isAdmin && (
          <CardFooter className="bg-muted/20 p-4 border-t italic text-[10px] text-muted-foreground">
            School Admins have observation-only access to academic records. To modify marks, please coordinate with the subject teacher.
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
