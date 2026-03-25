
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  Loader2,
  Printer,
  ShieldCheck,
  Building2,
  History,
  FileText,
  User,
  GraduationCap,
  TrendingUp,
  X,
  Scale,
  Unlock,
  BarChart3,
  PieChart,
  ChevronRight,
  BookMarked,
  Filter,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Helper functions for Cameroon standards
const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Excellence", color: "bg-green-600" };
  if (note >= 14) return { text: "Très Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  if (note >= 8) return { text: "Médiocre", color: "bg-orange-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const getConduct = (attendanceRate: number) => {
  if (attendanceRate >= 98) return "Excellence";
  if (attendanceRate >= 90) return "Very Good";
  if (attendanceRate >= 80) return "Good";
  if (attendanceRate >= 65) return "Weak";
  return "Very Weak";
};

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Mathematics", "Advanced Physics", "Chemistry", "English Literature", "French", "Biology", "History", "Geography"];

const MOCK_SUMMARY_RECORDS = [
  { id: "R1", year: "2023/24", term: "Term 1", sequence: "Seq 1", passCount: 38, failCount: 7, class: "2nde / Form 5", subject: "Physics" },
  { id: "R2", year: "2023/24", term: "Term 1", sequence: "Seq 2", passCount: 41, failCount: 4, class: "2nde / Form 5", subject: "Physics" },
  { id: "R3", year: "2022/23", term: "Term 3", sequence: "Seq 6", passCount: 35, failCount: 10, class: "3ème / Form 4", subject: "Science" },
];

const MOCK_STUDENTS = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", isLicensePaid: true },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", isLicensePaid: true },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", isLicensePaid: false },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", isLicensePaid: true },
];

const MOCK_STUDENT_CURRENT_GRADES = [
  { subject: "Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
  { subject: "English Literature", seq1: 12.0, seq2: 13.0, teacher: "Ms. Bennet", status: "Passed", coeff: 3 },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed", coeff: 4 },
];

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  // Selection States
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [selectedSequence, setSelectedSequence] = useState("seq1");
  const [currentTerm] = useState("Term 1"); // Simulated Admin-set current term
  
  // Lock Logic
  const [isTermClosed, setIsTermClosed] = useState(true); // Term is complete, so editing is locked
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false); // Can be toggled by Admin simulation
  
  // Mark Data
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";
  const canEdit = !isTermClosed || (isTeacher && isAdminUnlocked);

  const handleUpdateMark = (studentUid: string, value: string) => {
    if (!canEdit) return;
    setGrades({ ...grades, [`${studentUid}_${selectedSequence}`]: value });
  };

  const handleSaveMarks = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Marks Finalized", description: "Pedagogical records have been synchronized." });
    }, 1000);
  };

  const handleViewSummaryDetails = (record: any) => {
    setSelectedClass(record.class);
    setSelectedSubject(record.subject);
    setSelectedSequence(record.sequence.toLowerCase().replace(' ', ''));
    toast({ title: "Historical Context Loaded", description: `Viewing records for ${record.sequence}.` });
  };

  // Student Statistics (Read-only view)
  const studentStats = useMemo(() => {
    const totalWeighted = MOCK_STUDENT_CURRENT_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = MOCK_STUDENT_CURRENT_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
    const avg = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;
    return {
      average: avg.toFixed(2),
      totalCoeff,
      totalWeighted: totalWeighted.toFixed(2),
      attendance: 94.5,
      position: "4th / 45"
    };
  }, []);

  if (!isTeacher) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              {t("reportCard")}
            </h1>
            <p className="text-muted-foreground mt-1">Official registry of your academic evaluations and performance.</p>
          </div>
          <Button className="gap-2 shadow-lg h-11 px-6 rounded-xl" onClick={() => setPreviewDoc({ type: 'report' })}>
            <Printer className="w-4 h-4" /> {language === 'en' ? 'Print Current Bulletin' : 'Imprimer Bulletin Actuel'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("termAverage")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">{studentStats.average} / 20</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Class Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{studentStats.position}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-accent text-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Conduct Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-black flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" /> {getConduct(studentStats.attendance)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl"><TrendingUp className="w-8 h-8 text-secondary" /></div>
                <div><CardTitle className="text-2xl font-black">Current Term Evaluations</CardTitle><CardDescription className="text-white/60">Sequence 1 & 2 • {currentTerm}</CardDescription></div>
              </div>
              <Badge className="bg-secondary text-primary border-none font-black px-4 h-8 uppercase tracking-widest">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-accent/10 border-b border-accent/20 uppercase text-[10px] font-black tracking-widest">
                <TableRow>
                  <TableHead className="pl-8 py-4">{t("subjects")}</TableHead>
                  <TableHead className="text-center">Seq 1</TableHead>
                  <TableHead className="text-center">Seq 2</TableHead>
                  <TableHead className="text-center">Coeff</TableHead>
                  <TableHead className="text-right pr-8">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENT_CURRENT_GRADES.map((row, i) => (
                  <TableRow key={i} className="hover:bg-accent/5 border-b border-accent/10">
                    <TableCell className="pl-8 py-4 font-bold text-primary uppercase">{row.subject}</TableCell>
                    <TableCell className="text-center font-black text-lg">{row.seq1.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-black text-lg">{row.seq2.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-bold text-muted-foreground italic">{row.coeff}</TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn("text-[9px] font-black uppercase px-3 border-none", row.status === 'Passed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{row.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            Pedagogical Evaluations
          </h1>
          <p className="text-muted-foreground mt-1">Institutional mark entry and sequence summary records.</p>
        </div>
        
        {isTermClosed && !isAdminUnlocked && (
          <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase text-amber-600 leading-none">Term Status</p>
              <p className="text-sm font-bold text-amber-700">Records Locked</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mark Entry Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl"><BookMarked className="w-8 h-8 text-secondary" /></div>
                  <div>
                    <CardTitle className="text-2xl font-black">Mark Entry Desk</CardTitle>
                    <CardDescription className="text-white/60">{currentTerm} • Verified Recording</CardDescription>
                  </div>
                </div>
                {canEdit && (
                  <Button className="bg-secondary text-primary hover:bg-secondary/90 font-black uppercase text-xs h-12 px-8 rounded-xl shadow-lg gap-2" onClick={handleSaveMarks} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    Sync Records
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-accent/10 p-6 border-b border-accent/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Class Level</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Evaluation Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Target Sequence</Label>
                  <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                    <SelectTrigger className="h-11 bg-white border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seq1">Sequence 1</SelectItem>
                      <SelectItem value="seq2">Sequence 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead className="text-center">Mark / 20</TableHead>
                    <TableHead className="text-right pr-8">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_STUDENTS.map((s) => {
                    const markStr = grades[`${s.uid}_${selectedSequence}`] || "";
                    const mark = parseFloat(markStr);
                    const isUnpaid = !s.isLicensePaid;
                    
                    return (
                      <TableRow key={s.uid} className="hover:bg-accent/5 border-b border-accent/10 transition-colors">
                        <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
                              <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold text-sm text-primary">{s.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="relative w-20 mx-auto">
                            <Input 
                              type="number"
                              disabled={!canEdit || isUnpaid}
                              value={markStr}
                              onChange={(e) => handleUpdateMark(s.uid, e.target.value)}
                              className={cn(
                                "h-10 text-center font-black text-lg bg-accent/20 border-none rounded-lg focus-visible:ring-primary",
                                isUnpaid && "opacity-20 cursor-not-allowed"
                              )}
                            />
                            {isUnpaid && <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-600 z-10" />}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          {!isNaN(mark) ? (
                            <Badge className={cn("text-[9px] border-none text-white font-black uppercase px-3 h-5", getAppreciation(mark).color)}>
                              {getAppreciation(mark).text}
                            </Badge>
                          ) : isUnpaid ? (
                            <Badge variant="destructive" className="text-[8px] font-black uppercase tracking-tighter h-5">Unpaid License</Badge>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground italic">Pending...</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
               <div className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Verified Institutional Entry Node</p>
               </div>
               {isTermClosed && user?.role === "SCHOOL_ADMIN" && (
                 <Button variant="outline" size="sm" className="rounded-xl font-black uppercase text-[10px] gap-2 border-primary/20" onClick={() => setIsAdminUnlocked(!isAdminUnlocked)}>
                   {isAdminUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                   {isAdminUnlocked ? "Lock Entries" : "Administrative Unlock"}
                 </Button>
               )}
            </CardFooter>
          </Card>
        </div>

        {/* Evaluation Summary Side Column */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-sm font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2 ml-2">
            <History className="w-4 h-4" /> Report Card Records
          </h3>
          
          <div className="space-y-4">
            {MOCK_SUMMARY_RECORDS.map((record) => (
              <Card key={record.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all bg-white/50">
                <div className="h-1.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/10 text-primary">
                      {record.year} • {record.term}
                    </Badge>
                    <Badge className="bg-primary/5 text-primary border-none font-bold text-[9px] h-5">{record.sequence}</Badge>
                  </div>
                  <CardTitle className="text-lg font-black text-primary mt-2">{record.subject}</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase">{record.class}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex flex-col items-center">
                      <span className="text-[9px] font-black text-green-600 uppercase">Passed</span>
                      <span className="text-xl font-black text-green-700">{record.passCount}</span>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col items-center">
                      <span className="text-[9px] font-black text-red-600 uppercase">Failed</span>
                      <span className="text-xl font-black text-red-700">{record.failCount}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t bg-accent/10">
                  <Button 
                    variant="ghost" 
                    className="w-full h-11 rounded-none justify-between hover:bg-white text-xs font-black uppercase group/btn"
                    onClick={() => handleViewSummaryDetails(record)}
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm bg-blue-50 p-6 space-y-4">
             <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="text-xs font-black uppercase text-blue-700 tracking-widest">Pedagogical Compliance</h4>
             </div>
             <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
               "Evaluation marks are finalized at the end of each sequence. Teachers are responsible for data integrity before institutional closure."
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
