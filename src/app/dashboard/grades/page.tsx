
"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Layers,
  Send,
  Globe,
  Settings2,
  CheckCircle,
  Info,
  Download,
  Signature,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const TERMS = ["Term 1", "Term 2", "Term 3"];
const ACADEMIC_YEARS = ["2023/2024", "2022/2023"];

const MOCK_STUDENTS = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", dob: "15/05/2008" },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", dob: "22/11/2006" },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", isLicensePaid: false, section: "Francophone Section", class: "Terminale / Upper Sixth", avatar: "https://picsum.photos/seed/s3/100/100", dob: "10/03/2007" },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s4/100/100", dob: "05/01/2008" },
];

const MOCK_REPORT_HISTORY = [
  { year: "2022/2023", term: "Term 3", average: "16.45", position: "2nd / 45", status: "PROMOTED" },
  { year: "2022/2023", term: "Term 2", average: "15.80", position: "4th / 45", status: "PASSED" },
  { year: "2022/2023", term: "Term 1", average: "14.20", position: "8th / 45", status: "PASSED" },
];

const FULL_SUBJECT_LIST = [
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
  { subject: "English Language", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "French Language", seq1: 12.0, seq2: 13.0, teacher: "Mme. Njoh", status: "Passed", coeff: 3 },
  { subject: "Physics", seq1: 15.5, seq2: 14.0, teacher: "Dr. Aris", status: "Passed", coeff: 4 },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed", coeff: 4 },
  { subject: "Biology", seq1: 13.0, seq2: 15.5, teacher: "Dr. Fon", status: "Passed", coeff: 3 },
  { subject: "History", seq1: 14.0, seq2: 12.5, teacher: "Mr. Tabi", status: "Passed", coeff: 2 },
  { subject: "Geography", seq1: 11.0, seq2: 13.0, teacher: "Mr. Abena", status: "Passed", coeff: 2 },
  { subject: "Citizenship", seq1: 16.0, seq2: 17.0, teacher: "Mme. Ngono", status: "Passed", coeff: 2 },
  { subject: "ICT / Computer Science", seq1: 19.0, seq2: 18.5, teacher: "Engr. Ben", status: "Passed", coeff: 2 },
  { subject: "Physical Education", seq1: 15.0, seq2: 16.0, teacher: "Coach Mike", status: "Passed", coeff: 2 },
];

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Excellence", color: "text-green-600" };
  if (note >= 14) return { text: "Très Bien", color: "text-green-500" };
  if (note >= 12) return { text: "Bien", color: "text-blue-500" };
  if (note >= 10) return { text: "Passable", color: "text-amber-500" };
  if (note >= 8) return { text: "Médiocre", color: "text-orange-500" };
  return { text: "Faible", color: "text-red-500" };
};

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isAdmin = isSchoolAdmin || isSubAdmin;

  const [selectedSection, setSelectedSection] = useState(isSubAdmin ? "Anglophone Section" : "all");
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState("2023/2024");
  const [activeSequence, setActiveSequence] = useState("seq1");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<any>(null);

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const sectionMatch = selectedSection === "all" || s.section === selectedSection;
      const classMatch = s.class === selectedClass;
      return sectionMatch && classMatch;
    });
  }, [selectedSection, selectedClass]);

  const getStudentGrades = (studentClass: string) => {
    if (studentClass.includes("Form 1") || studentClass.includes("6ème")) {
      return FULL_SUBJECT_LIST;
    }
    if (studentClass.includes("Upper Sixth") || studentClass.includes("Terminale")) {
      return FULL_SUBJECT_LIST.slice(0, 4);
    }
    return FULL_SUBJECT_LIST.slice(0, 11);
  };

  const getStudentStats = (grades: any[]) => {
    const totalWeighted = grades.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = grades.reduce((acc, curr) => acc + curr.coeff, 0);
    const avg = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;
    
    return {
      average: avg.toFixed(2),
      totalCoeff,
      totalWeighted: totalWeighted.toFixed(2),
      position: "4th / 45",
      classAvg: "12.45",
      highestAvg: "18.20",
      lowestAvg: "06.15"
    };
  };

  const handlePublishResults = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ title: "Results Published", description: "Official marks have been released." });
    }, 2000);
  };

  // STUDENT PERSONAL VIEW
  if (isStudent) {
    const myGrades = getStudentGrades(user.class || "2nde / Form 5");
    const myStats = getStudentStats(myGrades);

    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              My Performance
            </h1>
            <p className="text-muted-foreground mt-1">Official term records and pedagogical achievement tracking.</p>
          </div>
          <Button className="h-12 px-8 rounded-2xl shadow-xl gap-2 font-black uppercase tracking-widest text-xs" onClick={() => setPreviewStudent({ ...user, class: user.class || "2nde / Form 5" })}>
            <Printer className="w-4 h-4" /> {t("officialBulletin")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Active Term Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">{myStats.average} / 20</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Class Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{myStats.position}</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white border">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Conduct Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-black flex items-center gap-2 text-primary">
                <Scale className="w-5 h-5 text-secondary" /> EXCELLENT
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
          <CardHeader className="bg-primary p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Current Term Performance</CardTitle>
                  <CardDescription className="text-white/60">Real-time ledger for {selectedTerm}.</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/10 text-white border-none h-8 px-4 font-black uppercase text-[10px] tracking-widest">
                Session: {selectedYear}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                  <TableHead className="pl-8 py-4">Pedagogical Subject</TableHead>
                  <TableHead className="text-center">Seq 1</TableHead>
                  <TableHead className="text-center">Seq 2</TableHead>
                  <TableHead className="text-center">Average/20</TableHead>
                  <TableHead className="text-center">Coeff</TableHead>
                  <TableHead className="text-right pr-8">Appreciation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myGrades.map((g, i) => {
                  const subjectAvg = (g.seq1 + g.seq2) / 2;
                  const app = getAppreciation(subjectAvg);
                  return (
                    <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                      <TableCell className="pl-8 py-4 font-bold text-sm text-primary uppercase">{g.subject}</TableCell>
                      <TableCell className="text-center font-black text-lg">{g.seq1.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-black text-lg">{g.seq2.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-black text-lg text-primary bg-primary/5">{subjectAvg.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-bold text-muted-foreground italic">{g.coeff}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge variant="outline" className={cn("text-[9px] font-black uppercase px-3 border-none", app.color.replace('text', 'bg').replace('600', '100').replace('500', '100'), app.color)}>
                          {app.text}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">All current term marks are digitally signed by the registrar.</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] uppercase font-black text-muted-foreground">Term Final Average</p>
                <p className="text-2xl font-black text-primary underline decoration-double decoration-secondary underline-offset-4">{myStats.average} / 20</p>
             </div>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem] bg-white">
          <CardHeader className="border-b bg-accent/5 p-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-lg font-black uppercase tracking-tight text-primary">Past Academic Records</CardTitle>
                <CardDescription className="text-xs">History of term averages and rank progression.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                  <TableHead className="pl-8 py-4">Academic Year</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-center">Final Average</TableHead>
                  <TableHead className="text-center">Rank</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_REPORT_HISTORY.map((hist, i) => (
                  <TableRow key={i} className="hover:bg-accent/5 border-b last:border-0">
                    <TableCell className="pl-8 py-4 font-bold text-sm">{hist.year}</TableCell>
                    <TableCell className="font-bold text-primary">{hist.term}</TableCell>
                    <TableCell className="text-center font-black text-lg text-primary">{hist.average} / 20</TableCell>
                    <TableCell className="text-center font-bold italic">{hist.position}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black">{hist.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 text-primary" onClick={() => setPreviewStudent({ ...user, class: user.class || "2nde / Form 5" })}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ReportCardDialog previewStudent={previewStudent} setPreviewStudent={setPreviewStudent} selectedYear={selectedYear} selectedTerm={selectedTerm} getStudentGrades={getStudentGrades} getStudentStats={getStudentStats} />
      </div>
    );
  }

  // ADMIN/TEACHER VIEW
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Award className="w-6 h-6 text-secondary" />
            </div>
            {isAdmin ? "Institutional Results Suite" : "Mark Entry Desk"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Govern pedagogical cycles, generate official bulletins, and publish results."
              : "Record student evaluations for your assigned subjects."}
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/20 gap-2 font-bold" onClick={() => toast({ title: "Bulk Reports Generated" })} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              Generate Batch Reports
            </Button>
            {isSchoolAdmin && (
              <Button className="h-12 px-8 rounded-2xl shadow-xl gap-2 font-black uppercase tracking-widest text-xs" onClick={handlePublishResults} disabled={isProcessing}>
                <Globe className="w-4 h-4" />
                Publish Results
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary p-6 text-white">
              <CardTitle className="text-lg font-black flex items-center gap-2 uppercase tracking-tighter">
                <Settings2 className="w-5 h-5 text-secondary" />
                Pedagogical Control
              </CardTitle>
              <CardDescription className="text-white/60">Configure the active evaluation cycle for staff.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {isSchoolAdmin && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Target Section</Label>
                  <Select value={selectedSection} onValueChange={setSelectedSection}>
                    <SelectTrigger className="h-11 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Whole Institution</SelectItem>
                      {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Academic Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-11 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Term</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger className="h-11 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Sequence Input Window</Label>
                <Select value={activeSequence} onValueChange={setActiveSequence}>
                  <SelectTrigger className="h-11 bg-accent/30 border-none rounded-xl font-bold text-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seq1">Sequence 1</SelectItem>
                    <SelectItem value="seq2">Sequence 2</SelectItem>
                    <SelectItem value="seq3">Sequence 3</SelectItem>
                    <SelectItem value="seq4">Sequence 4</SelectItem>
                    <SelectItem value="seq5">Sequence 5</SelectItem>
                    <SelectItem value="seq6">Sequence 6</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full h-12 rounded-xl shadow-lg font-bold gap-2" variant="outline">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Apply Cycle Update
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-white border-b p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Audit Registry</CardTitle>
                <CardDescription className="text-xs">Verifying mark entry completion for the selected class.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-10 w-[180px] bg-accent/20 border-none rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead className="text-center">Subjects</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.uid} className="hover:bg-accent/5 border-b border-accent/10 transition-colors">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary">{s.name}</span>
                            <span className="text-[8px] uppercase font-black opacity-40">{s.section}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-[10px] font-bold">{getStudentGrades(s.class).length}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 text-primary" onClick={() => setPreviewStudent(s)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReportCardDialog previewStudent={previewStudent} setPreviewStudent={setPreviewStudent} selectedYear={selectedYear} selectedTerm={selectedTerm} getStudentGrades={getStudentGrades} getStudentStats={getStudentStats} />
    </div>
  );
}

function ReportCardDialog({ previewStudent, setPreviewStudent, selectedYear, selectedTerm, getStudentGrades, getStudentStats }: any) {
  const { user, platformSettings } = useAuth();
  const { language } = useI18n();

  if (!previewStudent) return null;

  const grades = getStudentGrades(previewStudent.class);
  const stats = getStudentStats(grades);

  return (
    <Dialog open={!!previewStudent} onOpenChange={() => setPreviewStudent(null)}>
      <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-[2rem]">
        <DialogHeader className="p-4 bg-primary text-white no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-xl">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black">Official Term Bulletin Preview</DialogTitle>
                <DialogDescription className="text-white/70 text-xs">High-fidelity printable pedagogical record.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPreviewStudent(null)} className="text-white hover:bg-white/10">
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogHeader>

        <div className="bg-muted p-2 md:p-6 print:p-0 print:bg-white overflow-x-auto">
          <div id="printable-bulletin" className="bg-white p-6 md:p-8 shadow-sm border border-border min-w-[850px] flex flex-col space-y-4 font-serif text-black relative print:shadow-none print:border-none print:p-4">
             <div className="grid grid-cols-3 gap-2 items-start text-center border-b-2 border-black pb-4">
                <div className="space-y-0.5 text-[8px] uppercase font-black">
                  <p>Republic of Cameroon</p>
                  <p>Peace - Work - Fatherland</p>
                  <div className="h-px bg-black w-6 mx-auto my-0.5" />
                  <p>Ministry of Secondary Education</p>
                  <p className="text-primary">{user?.school?.name || "Institutional Node"}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 border-2 border-primary/10">
                     <img src={user?.school?.logo || platformSettings.logo} alt="School Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <p className="text-[8px] font-black uppercase italic tracking-tighter leading-none">Motto: {user?.school?.motto || "Discipline - Work - Success"}</p>
                </div>
                <div className="space-y-0.5 text-[8px] uppercase font-black">
                  <p>République du Cameroun</p>
                  <p>Paix - Travail - Patrie</p>
                  <div className="h-px bg-black w-6 mx-auto my-0.5" />
                  <p>Min. des Enseignements Secondaires</p>
                  <p>Délégation Régionale Littoral</p>
                </div>
             </div>
             
             <div className="text-center space-y-1">
                <h2 className="text-2xl font-black uppercase underline decoration-double underline-offset-2 tracking-tighter">
                  {language === 'en' ? 'OFFICIAL REPORT CARD' : 'BULLETIN DE NOTES OFFICIEL'}
                </h2>
                <p className="font-bold text-[10px] italic">Academic Session: {selectedYear} • {selectedTerm}</p>
             </div>

             <div className="grid grid-cols-12 gap-4 bg-accent/5 p-4 border border-black/10 rounded-xl items-center shadow-inner">
                <div className="col-span-2">
                   <Avatar className="w-20 h-20 border-2 border-white rounded-lg bg-white overflow-hidden shadow-md">
                      <AvatarImage src={previewStudent?.avatar} className="object-cover" />
                      <AvatarFallback className="text-2xl font-black">{previewStudent?.name?.charAt(0)}</AvatarFallback>
                   </Avatar>
                </div>
                <div className="col-span-10">
                   <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-[11px]">
                      <div className="flex justify-between border-b border-black/5 pb-0.5"><span className="font-bold uppercase opacity-60 text-[8px]">Student Name:</span><span className="font-black uppercase">{previewStudent?.name}</span></div>
                      <div className="flex justify-between border-b border-black/5 pb-0.5"><span className="font-bold uppercase opacity-60 text-[8px]">Matricule / ID:</span><span className="font-mono font-bold text-primary">{previewStudent?.id}</span></div>
                      <div className="flex justify-between border-b border-black/5 pb-0.5"><span className="font-bold uppercase opacity-60 text-[8px]">Grade / Class:</span><span className="font-bold">{previewStudent?.class}</span></div>
                      <div className="flex justify-between border-b border-black/5 pb-0.5"><span className="font-bold uppercase opacity-60 text-[8px]">Date of Birth:</span><span className="font-bold">{previewStudent?.dob || "N/A"}</span></div>
                   </div>
                </div>
             </div>

             <Table className="border-collapse border-2 border-black">
                <TableHeader className="bg-black/5">
                  <TableRow className="border-b-2 border-black">
                    <TableHead className="text-[10px] uppercase font-black text-black border-r-2 border-black h-10">Pedagogical Subject</TableHead>
                    <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-14">Seq 1</TableHead>
                    <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-14">Seq 2</TableHead>
                    <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-14">Moy/20</TableHead>
                    <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-14">Coeff</TableHead>
                    <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-16">Weighted</TableHead>
                    <TableHead className="text-right text-[10px] uppercase font-black text-black pr-2">Appreciation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((g: any, i: number) => {
                    const subjectAvg = (g.seq1 + g.seq2) / 2;
                    const weightedTotal = subjectAvg * g.coeff;
                    const app = getAppreciation(subjectAvg);
                    return (
                      <TableRow key={i} className="border-b border-black">
                        <TableCell className="font-bold py-1 border-r-2 border-black text-[11px] uppercase leading-tight">{g.subject}</TableCell>
                        <TableCell className="text-center py-1 border-r border-black text-[11px]">{g.seq1.toFixed(2)}</TableCell>
                        <TableCell className="text-center py-1 border-r border-black text-[11px]">{g.seq2.toFixed(2)}</TableCell>
                        <TableCell className="text-center py-1 border-r border-black font-black text-primary bg-accent/5 text-[11px]">{subjectAvg.toFixed(2)}</TableCell>
                        <TableCell className="text-center py-1 border-r border-black font-bold italic text-[11px]">{g.coeff}</TableCell>
                        <TableCell className="text-center py-1 border-r border-black font-black text-[11px]">{weightedTotal.toFixed(2)}</TableCell>
                        <TableCell className={cn("text-right py-1 pr-2 text-[9px] uppercase font-black italic", app.color)}>{app.text}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
             </Table>

             <div className="grid grid-cols-12 gap-4 pt-2">
                <div className="col-span-7 border-2 border-black p-4 rounded-xl space-y-4 shadow-sm">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-[10px]">
                         <div className="flex justify-between border-b border-black/10 pb-0.5 uppercase font-bold opacity-60"><span>Total Coeff:</span><span className="font-black text-black">{stats.totalCoeff}</span></div>
                         <div className="flex justify-between border-b border-black/10 pb-0.5 uppercase font-bold opacity-60"><span>Total Weighted:</span><span className="font-black text-black">{stats.totalWeighted}</span></div>
                         <div className="flex flex-col pt-1 text-center bg-primary/5 rounded-lg p-2 border border-primary/10">
                            <span className="font-black uppercase text-[8px] text-muted-foreground">Term Final Average</span>
                            <span className="text-xl font-black text-primary underline decoration-double underline-offset-2">{stats.average} / 20</span>
                         </div>
                      </div>
                      <div className="bg-black/5 p-2 rounded-lg space-y-1 text-[9px] uppercase font-black">
                         <p className="text-center border-b border-black/10 pb-0.5 mb-1">Class Statistics</p>
                         <div className="flex justify-between"><span>Group Average:</span><span>{stats.classAvg}</span></div>
                         <div className="flex justify-between text-green-700"><span>Highest Group:</span><span>{stats.highestAvg}</span></div>
                         <div className="flex justify-between text-red-700"><span>Lowest Group:</span><span>{stats.lowestAvg}</span></div>
                      </div>
                   </div>
                   <div className="pt-2 border-t border-black/10 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                         <Award className="w-4 h-4 text-primary" />
                         <p className="text-[10px] font-black uppercase">Rank: <span className="text-primary italic">{stats.position}</span></p>
                      </div>
                      <div className="flex items-center gap-1.5">
                         <Scale className="w-4 h-4 text-secondary" />
                         <p className="text-[9px] font-black uppercase">Conduct: <span className="text-secondary italic">EXCELLENT</span></p>
                      </div>
                   </div>
                </div>

                <div className="col-span-5 space-y-4">
                   <div className="border-2 border-black p-3 rounded-xl h-full flex flex-col bg-accent/5">
                      <p className="text-[10px] font-black uppercase text-center border-b border-black mb-1.5 pb-0.5">Council Remarks</p>
                      <div className="flex-1 italic text-[10px] text-muted-foreground p-1 font-medium leading-tight">
                         "Consistent pedagogical participation and excellent discipline. Maintain this standard."
                      </div>
                      <div className="mt-auto pt-2 flex justify-between items-end border-t border-black/10">
                         <div className="text-center space-y-0.5">
                            <p className="text-[7px] font-black uppercase">Class Master</p>
                            <div className="h-6 w-12 mx-auto flex items-center justify-center opacity-30"><Signature className="w-full h-full" /></div>
                            <div className="h-px bg-black w-12 mx-auto" />
                         </div>
                         <div className="text-center space-y-0.5">
                            <p className="text-[7px] font-black uppercase">Principal</p>
                            <Badge variant="outline" className="border-black text-[6px] font-black uppercase px-2 py-0">OFFICIAL SEAL</Badge>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-auto text-center pt-4 border-t-2 border-black/5">
                <div className="flex items-center justify-center gap-2">
                   <img src={platformSettings.logo} alt="Platform" className="w-3 h-3 object-contain opacity-20" />
                   <p className="text-[7px] uppercase font-black text-muted-foreground opacity-30 tracking-[0.3em]">
                     Verified Educational Record • {platformSettings.name} Node • {new Date().getFullYear()}
                   </p>
                </div>
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print">
          <div className="flex-1 flex items-center gap-2 text-muted-foreground italic text-xs">
             <Info className="w-4 h-4" />
             <p>Bulletin optimized for single-page A4 printing.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.print()} className="rounded-xl h-12 px-8 font-black uppercase text-xs gap-2">
              <Printer className="w-4 h-4" /> Print Document
            </Button>
            <Button onClick={() => setPreviewStudent(null)} className="rounded-xl h-12 px-10 font-black uppercase text-xs">Close Preview</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
