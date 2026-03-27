
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { LoadingState } from "@/components/shared/loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  ShieldCheck, 
  History, 
  FileText, 
  User, 
  TrendingUp, 
  X, 
  BookMarked, 
  Filter,
  Save,
  Search,
  AlertCircle,
  QrCode,
  Users,
  PenTool,
  Info,
  ArrowLeft,
  XCircle,
  ChevronRight,
  UserRoundCheck,
  UserRoundX,
  UserCog,
  LayoutGrid,
  Smartphone,
  FileDown,
  Printer,
  TrendingDown,
  Scale,
  Building2,
  Signature
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology", "History", "Geography"];

const MOCK_STUDENTS_GRADES = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 16.0 },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 18.0, seq2: 17.5 },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s3/100/100", seq1: 9.5, seq2: 10.5 },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s4/100/100", seq1: 12.0, seq2: 13.0 },
];

const MOCK_PERSONAL_GRADES = [
  { subject: "Advanced Physics", seq1: 14.5, seq2: 16.0, coeff: 4, teacher: "Dr. Tesla", status: "Passed" },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, coeff: 5, teacher: "Prof. Smith", status: "Passed" },
  { subject: "English Literature", seq1: 12.0, seq2: 13.0, coeff: 3, teacher: "Ms. Bennet", status: "Passed" },
  { subject: "General Chemistry", seq1: 10.5, seq2: 11.5, coeff: 4, teacher: "Dr. White", status: "Passed" },
];

const MOCK_PERSONAL_ARCHIVE = [
  { id: "R1", year: "2023 / 2024", term: "Term 1", average: "15.45", position: "4th / 45", classMaster: "Mr. Abena", status: "Published" },
  { id: "R2", year: "2022 / 2023", term: "Term 3", average: "14.20", position: "8th / 42", classMaster: "Mme. Njoh", status: "Published" },
  { id: "R3", year: "2022 / 2023", term: "Term 2", average: "13.85", position: "12th / 42", classMaster: "Mme. Njoh", status: "Published" },
];

const MOCK_GRADE_HISTORY = [
  { 
    id: "H1", 
    year: "2023 / 2024", 
    term: "Term 1", 
    subject: "Advanced Physics", 
    class: "2nde / Form 5", 
    numPass: 38, 
    numFail: 4, 
    percentPass: 90.5,
    students: [
      { name: "Alice Thompson", mark: 16.5, status: "pass" },
      { name: "Bob Richards", mark: 14.0, status: "pass" },
      { name: "Diana Prince", mark: 12.5, status: "pass" },
      { name: "Charlie Davis", mark: 8.5, status: "fail" },
      { name: "Ethan Hunt", mark: 11.0, status: "pass" },
      { name: "Sarah Connor", mark: 7.5, status: "fail" },
    ]
  },
  { 
    id: "H2", 
    year: "2022 / 2023", 
    term: "Term 3", 
    subject: "Mathematics", 
    class: "3ème / Form 4", 
    numPass: 32, 
    numFail: 10, 
    percentPass: 76.2,
    students: [
      { name: "John Smith", mark: 18.0, status: "pass" },
      { name: "Jane Doe", mark: 9.0, status: "fail" },
    ]
  }
];

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Excellence", color: "bg-green-600" };
  if (note >= 14) return { text: "Très Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  if (note >= 8) return { text: "Médiocre", color: "bg-orange-500" };
  return { text: "Faible", color: "bg-red-500" };
};

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [activeSequence, setActiveSequence] = useState<"seq1" | "seq2">("seq1");
  const [grades, setGrades] = useState(MOCK_STUDENTS_GRADES);
  
  // Modal states
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleGradeChange = (uid: string, field: 'seq1' | 'seq2', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) && value !== "") return;
    if (numValue > 20 || numValue < 0) return;

    setGrades(prev => prev.map(s => {
      if (s.uid === uid) {
        return { ...s, [field]: numValue || 0 };
      }
      return s;
    }));
  };

  const handleCommitGrades = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Registry Synchronized",
        description: `Marks for ${selectedSubject} in ${selectedClass} (Sequence ${activeSequence === 'seq1' ? '1' : '2'}) have been committed.`,
      });
    }, 1500);
  };

  const handleExportPdf = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Document Prepared",
        description: isStudent 
          ? "Your official Academic Bulletin has been generated as PDF."
          : `Formal Grade Registry for ${selectedSubject} has been generated as PDF.`,
      });
    }, 2000);
  };

  const getRemark = (avg: number) => {
    if (avg >= 16) return "Excellence";
    if (avg >= 14) return "Very Good";
    if (avg >= 12) return "Good";
    if (avg >= 10) return "Passed";
    if (avg >= 8) return "Mediocre";
    return "Failed";
  };

  const stats = useMemo(() => {
    if (isStudent) {
      const totalWeighted = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
      const totalCoeff = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
      return {
        average: (totalWeighted / totalCoeff).toFixed(2),
        passRate: "100"
      };
    }
    const totalAvg = grades.reduce((acc, curr) => acc + (curr.seq1 + curr.seq2) / 2, 0) / grades.length;
    const passedCount = grades.filter(g => (g.seq1 + g.seq2) / 2 >= 10).length;
    return {
      average: totalAvg.toFixed(2),
      passRate: ((passedCount / grades.length) * 100).toFixed(0)
    };
  }, [grades, isStudent]);

  if (isLoading) {
    return <LoadingState message="Fetching pedagogical records..." />;
  }

  // --- STUDENT PERSONAL VIEW ---
  if (isStudent) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                My Results & Report Card
              </h1>
              <p className="text-muted-foreground mt-1">Track your personal academic progress and download verified bulletins.</p>
            </div>
          </div>
          <Button onClick={handleExportPdf} disabled={isProcessing} className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            Download Official Bulletin
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Personal Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Promotion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" /> ELIGIBLE
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white border">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Identity Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-black flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5 text-secondary" /> VERIFIED
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
            <TabsTrigger value="current" className="gap-2 py-3 rounded-xl transition-all font-bold">
              <BookMarked className="w-4 h-4" /> Current Term
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-2 py-3 rounded-xl transition-all font-bold">
              <History className="w-4 h-4" /> Full Archive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <BookMarked className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">Active Evaluation Cycle</CardTitle>
                      <CardDescription className="text-white/60">Verified marks for 2023/24 • Sequence 1 & 2</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">Pedagogical Subject</TableHead>
                      <TableHead className="text-center">Coeff</TableHead>
                      <TableHead className="text-center">Seq 1</TableHead>
                      <TableHead className="text-center">Seq 2</TableHead>
                      <TableHead className="text-center">Moy/20</TableHead>
                      <TableHead className="text-right pr-8">Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_GRADES.map((g, idx) => {
                      const avg = (g.seq1 + g.seq2) / 2;
                      return (
                        <TableRow key={idx} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-16">
                          <TableCell className="pl-8 font-black text-primary uppercase text-sm">{g.subject}</TableCell>
                          <TableCell className="text-center font-bold text-muted-foreground italic">{g.coeff}</TableCell>
                          <TableCell className="text-center font-bold">{g.seq1.toFixed(2)}</TableCell>
                          <TableCell className="text-center font-bold">{g.seq2.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <span className="font-black text-lg text-primary">{avg.toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Badge className={cn(
                              "text-[9px] font-black uppercase px-3 h-6 border-none",
                              avg >= 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                              {getRemark(avg)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-center">
                 <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">These records are digitally signed and finalized by the Academic Council.</p>
                 </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="archive" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <History className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Report History Archive</CardTitle>
                    <CardDescription className="text-white/60">Chronological record of past pedagogical evaluations.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">Academic Year</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead className="text-center">Term Average</TableHead>
                      <TableHead className="text-center">Class Position</TableHead>
                      <TableHead className="text-right pr-8">Official Bulletin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_ARCHIVE.map((report) => (
                      <TableRow key={report.id} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-16">
                        <TableCell className="pl-8 font-black text-primary">{report.year}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/10 text-primary">{report.term}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-black text-lg text-primary">{report.average} / 20</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-xs text-muted-foreground">{report.position}</span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
                            onClick={() => setPreviewDoc(report)}
                          >
                            <Eye className="w-4 h-4" />
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

        {/* HIGH-FIDELITY BULLETIN DIALOG */}
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-[2rem]">
            <DialogHeader className="p-6 bg-primary text-white no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <FileText className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black">Official Term Bulletin</DialogTitle>
                    <DialogDescription className="text-white/70">Verified pedagogical evaluation • Republic of Cameroon Standards.</DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(null)} className="text-white hover:bg-white/10">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogHeader>

            <div className="bg-muted p-4 md:p-10 print:p-0 print:bg-white overflow-x-auto">
              <div id="printable-bulletin" className="bg-white p-8 md:p-12 shadow-sm border border-border min-w-[850px] flex flex-col space-y-8 font-serif text-black relative print:shadow-none print:border-none mx-auto">
                 <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                    <div className="space-y-1 text-[10px] uppercase font-black">
                      <p>Republic of Cameroon</p>
                      <p>Peace - Work - Fatherland</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Ministry of Secondary Education</p>
                      <p>{user?.school?.name || "GOVERNMENT BILINGUAL HIGH SCHOOL DEIDO"}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 border-2 border-primary/10">
                         <img src={user?.school?.logo || platformSettings.logo} alt="School Logo" className="w-16 h-16 object-contain" />
                      </div>
                      <p className="text-[10px] font-black uppercase italic tracking-tighter">Motto: {user?.school?.motto || "Discipline - Work - Success"}</p>
                    </div>
                    <div className="space-y-1 text-[10px] uppercase font-black">
                      <p>République du Cameroun</p>
                      <p>Paix - Travail - Patrie</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Min. des Enseignements Secondaires</p>
                      <p>Délégation Régionale Littoral</p>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black uppercase underline decoration-double underline-offset-4 tracking-tighter text-primary">
                      {language === 'en' ? 'OFFICIAL REPORT CARD' : 'BULLETIN DE NOTES OFFICIEL'}
                    </h2>
                    <p className="font-bold text-sm italic">Academic Session: {previewDoc?.year || '2023/2024'} • {previewDoc?.term || 'Term 1'}</p>
                 </div>

                 <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center shadow-inner">
                    <div className="col-span-2">
                       <Avatar className="w-32 h-32 border-4 border-white rounded-2xl bg-white overflow-hidden shadow-lg">
                          <AvatarImage src={user?.avatar} className="object-cover" />
                          <AvatarFallback className="text-4xl font-black">{user?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="col-span-10">
                       <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Student Name:</span><span className="font-black uppercase">{user?.name}</span></div>
                          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Matricule / ID:</span><span className="font-mono font-bold text-primary">{user?.id}</span></div>
                          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Grade / Class:</span><span className="font-bold">2nde / Form 5</span></div>
                          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Date of Birth:</span><span className="font-bold">15/05/2008</span></div>
                       </div>
                    </div>
                 </div>

                 <Table className="border-collapse border-2 border-black">
                    <TableHeader className="bg-black/5">
                      <TableRow className="border-b-2 border-black">
                        <TableHead className="text-[11px] uppercase font-black text-black border-r-2 border-black h-14">Pedagogical Subject</TableHead>
                        <TableHead className="text-center text-[11px] uppercase font-black text-black border-r border-black w-16">Seq 1</TableHead>
                        <TableHead className="text-center text-[11px] uppercase font-black text-black border-r border-black w-16">Seq 2</TableHead>
                        <TableHead className="text-center text-[11px] uppercase font-black text-black border-r border-black w-16">Moy/20</TableHead>
                        <TableHead className="text-center text-[11px] uppercase font-black text-black border-r border-black w-16">Coeff</TableHead>
                        <TableHead className="text-center text-[11px] uppercase font-black text-black border-r border-black w-20">Weighted</TableHead>
                        <TableHead className="text-right text-[11px] uppercase font-black text-black pr-4">Appreciation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_PERSONAL_GRADES.map((g: any, i: number) => {
                        const subjectAvg = (g.seq1 + g.seq2) / 2;
                        const weightedTotal = subjectAvg * g.coeff;
                        return (
                          <TableRow key={i} className="border-b border-black">
                            <TableCell className="font-bold py-3 border-r-2 border-black text-sm uppercase">{g.subject}</TableCell>
                            <TableCell className="text-center py-3 border-r border-black font-medium">{g.seq1.toFixed(2)}</TableCell>
                            <TableCell className="text-center py-3 border-r border-black font-medium">{g.seq2.toFixed(2)}</TableCell>
                            <TableCell className="text-center py-3 border-r border-black font-black text-primary bg-accent/5">{subjectAvg.toFixed(2)}</TableCell>
                            <TableCell className="text-center py-3 border-r border-black font-bold italic">{g.coeff}</TableCell>
                            <TableCell className="text-center py-3 border-r border-black font-black">{weightedTotal.toFixed(2)}</TableCell>
                            <TableCell className="text-right py-3 pr-4 text-[10px] uppercase font-black italic">{getAppreciation(subjectAvg).text}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                 </Table>

                 <div className="grid grid-cols-12 gap-8 pt-4">
                    <div className="col-span-7 border-2 border-black p-6 rounded-2xl space-y-6 shadow-sm">
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <div className="flex justify-between text-xs border-b border-black/10 pb-1 uppercase font-bold opacity-60"><span>Total Coeff:</span><span className="font-black text-black">16</span></div>
                             <div className="flex justify-between text-xs border-b border-black/10 pb-1 uppercase font-bold opacity-60"><span>Total Weighted:</span><span className="font-black text-black">247.20</span></div>
                             <div className="flex flex-col pt-2 text-center bg-primary/5 rounded-xl p-3 border border-primary/10">
                                <span className="font-black uppercase text-[10px] text-muted-foreground">Term Final Average</span>
                                <span className="text-3xl font-black text-primary underline decoration-double underline-offset-4">{previewDoc?.average} / 20</span>
                             </div>
                          </div>
                          <div className="bg-black/5 p-4 rounded-xl space-y-3 text-[10px] uppercase font-black">
                             <p className="text-center border-b border-black/10 pb-1 mb-1">Class Statistics</p>
                             <div className="flex justify-between"><span>Group Average:</span><span>12.45</span></div>
                             <div className="flex justify-between text-green-700"><span>Highest Group Average:</span><span>18.20</span></div>
                             <div className="flex justify-between text-red-700"><span>Lowest Group Average:</span><span>06.15</span></div>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <Award className="w-5 h-5 text-primary" />
                             <p className="text-sm font-black uppercase">Term Rank: <span className="text-primary italic underline underline-offset-2">{previewDoc?.position}</span></p>
                          </div>
                          <div className="flex items-center gap-2">
                             <Scale className="w-5 h-5 text-secondary" />
                             <p className="text-xs font-black uppercase">Conduct Rating: Excellence</p>
                          </div>
                       </div>
                    </div>

                    <div className="col-span-5 space-y-6">
                       <div className="border-2 border-black p-5 rounded-2xl h-full flex flex-col bg-accent/5">
                          <p className="text-[11px] font-black uppercase text-center border-b border-black mb-3 pb-1">Academic Council Remark</p>
                          <div className="flex-1 italic text-xs text-muted-foreground p-3 font-medium leading-relaxed">
                             "Academic performance is significantly above the class median. The student demonstrates excellent self-discipline and consistent pedagogical participation."
                          </div>
                          <div className="mt-auto pt-6 flex justify-between items-end border-t border-black/10">
                             <div className="text-center space-y-1">
                                <p className="text-[8px] font-black uppercase">Class Master</p>
                                <SignatureSVG className="w-16 h-8 text-primary/20 p-1" />
                                <div className="h-px bg-black w-16 mx-auto" />
                             </div>
                             <div className="text-center space-y-1">
                                <p className="text-[8px] font-black uppercase">Institutional Head</p>
                                <div className="h-10" />
                                <Badge variant="outline" className="border-black text-[7px] font-black uppercase px-3 py-0.5">OFFICIAL SEAL</Badge>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-auto text-center pt-8 border-t-2 border-black/5">
                    <div className="flex items-center justify-center gap-3">
                       <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain opacity-20" />
                       <p className="text-[8px] uppercase font-black text-muted-foreground opacity-30 tracking-[0.4em]">
                         Verified Educational Record • {platformSettings.name} Academic SaaS Node
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print shrink-0">
              <div className="flex-1 flex items-center gap-2 text-muted-foreground italic text-xs">
                 <Info className="w-4 h-4" />
                 <p>Bulletin published on: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => window.print()} className="rounded-xl h-12 px-8 font-black uppercase text-xs gap-2">
                  <Printer className="w-4 h-4" /> Print Document
                </Button>
                <Button onClick={() => setPreviewDoc(null)} className="rounded-xl h-12 px-10 font-black uppercase text-xs bg-primary text-white">Back to Portal</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // --- TEACHER / ADMIN MARK ENTRY VIEW ---
  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary rounded-xl shadow-lg">
            <Award className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              Term Mark Entry
            </h1>
            <p className="text-muted-foreground mt-1">Official registry for current term sequence assessments.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportPdf} disabled={isProcessing} className="h-12 px-6 rounded-2xl border-primary/10 bg-white gap-2 font-bold group">
            <FileDown className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            Export to PDF
          </Button>
          <Button onClick={handleCommitGrades} disabled={isProcessing} className="h-12 px-10 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Sequence Marks
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><TrendingUp className="w-12 h-12" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Term Group Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-12 h-12" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.passRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Academic Node</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary group-hover:rotate-12 transition-transform" /> VERIFIED
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[10px] font-black uppercase text-primary ml-1">Class Level</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-12 bg-primary/5 border-primary/10 rounded-2xl font-bold">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[10px] font-black uppercase text-primary ml-1">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-12 bg-primary/5 border-primary/10 rounded-2xl font-bold">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-secondary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[10px] font-black uppercase text-primary ml-1">Input Sequence</Label>
          <Select value={activeSequence} onValueChange={(v: any) => setActiveSequence(v)}>
            <SelectTrigger className="h-12 bg-secondary/20 border-secondary/20 rounded-2xl font-black text-primary">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seq1">Sequence 1 Entry</SelectItem>
              <SelectItem value="seq2">Sequence 2 Entry</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/10 bg-white group">
          <Filter className="w-4 h-4 mr-2 text-primary/40 group-hover:text-primary transition-colors" />
          Filter Registry
        </Button>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <PenTool className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black uppercase tracking-tight">Gradebook: Current Term</CardTitle>
                <CardDescription className="text-white/60">{selectedSubject} • {selectedClass}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-secondary text-primary border-none font-black px-4 py-1">
                FILLING SEQUENCE {activeSequence === 'seq1' ? '1' : '2'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Student Profile</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead className={cn("text-center w-32 transition-all", activeSequence === 'seq1' && "bg-secondary/10")}>Sequence 1</TableHead>
                <TableHead className={cn("text-center w-32 transition-all", activeSequence === 'seq2' && "bg-secondary/10")}>Sequence 2</TableHead>
                <TableHead className="text-center">Term Moy/20</TableHead>
                <TableHead className="text-right pr-8">Remark (Auto)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((s) => {
                const avg = ((s.seq1 + s.seq2) / 2).toFixed(2);
                const isPassed = parseFloat(avg) >= 10;
                
                return (
                  <TableRow key={s.uid} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-20">
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-primary uppercase">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold text-muted-foreground">{s.id}</TableCell>
                    <TableCell className={cn("text-center transition-all", activeSequence === 'seq1' && "bg-secondary/5")}>
                      <Input 
                        type="number" 
                        step="0.25"
                        min="0"
                        max="20"
                        value={s.seq1}
                        onChange={(e) => handleGradeChange(s.uid, 'seq1', e.target.value)}
                        className={cn(
                          "w-20 mx-auto text-center h-11 border-none font-black rounded-xl focus-visible:ring-primary",
                          activeSequence === 'seq1' ? "bg-white shadow-sm text-primary ring-2 ring-secondary/20" : "bg-accent/30 text-primary/40"
                        )}
                      />
                    </TableCell>
                    <TableCell className={cn("text-center transition-all", activeSequence === 'seq2' && "bg-secondary/5")}>
                      <Input 
                        type="number" 
                        step="0.25"
                        min="0"
                        max="20"
                        value={s.seq2}
                        onChange={(e) => handleGradeChange(s.uid, 'seq2', e.target.value)}
                        className={cn(
                          "w-20 mx-auto text-center h-11 border-none font-black rounded-xl focus-visible:ring-primary",
                          activeSequence === 'seq2' ? "bg-white shadow-sm text-primary ring-2 ring-secondary/20" : "bg-accent/30 text-primary/40"
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "font-black text-xl",
                          isPassed ? "text-primary" : "text-red-600"
                        )}>{avg} / 20</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 h-6 border-none",
                        isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {getRemark(parseFloat(avg))}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-8 border-t border-accent flex justify-between items-center">
           <div className="flex items-center gap-3 text-muted-foreground italic">
              <Info className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40">System calculates Moy/20 and Remarks automatically based on Ministry standards.</p>
           </div>
           <Button onClick={handleCommitGrades} disabled={isProcessing} className="h-14 px-12 rounded-2xl shadow-xl font-black uppercase tracking-widest text-sm gap-3">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
              Save & Commit Term Registry
           </Button>
        </CardFooter>
      </Card>

      {/* ACADEMIC HISTORY SECTION */}
      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-accent/5 border-b p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/5 rounded-2xl">
              <History className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight text-primary">Academic History Ledger</CardTitle>
              <CardDescription>Verified results from previous evaluation cycles and terms.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Academic Year</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">Pass</TableHead>
                <TableHead className="text-center">Fail</TableHead>
                <TableHead className="text-center">% Pass</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GRADE_HISTORY.map((hist) => (
                <TableRow key={hist.id} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-16">
                  <TableCell className="pl-8 font-bold text-primary">{hist.year}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] uppercase">{hist.term}</Badge>
                  </TableCell>
                  <TableCell className="font-bold text-primary/80 text-xs">{hist.subject}</TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">{hist.class}</TableCell>
                  <TableCell className="text-center font-black text-green-600">{hist.numPass}</TableCell>
                  <TableCell className="text-center font-black text-red-600">{hist.numFail}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-black text-primary">{hist.percentPass}%</span>
                      <div className="w-16 h-1 bg-accent rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${hist.percentPass}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary hover:text-white rounded-xl"
                      onClick={() => setSelectedHistory(hist)}
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* HISTORY DETAILS MODAL (TEACHER VIEW) */}
      <Dialog open={!!selectedHistory} onOpenChange={() => setSelectedHistory(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col">
          <DialogHeader className="bg-primary p-8 text-white relative shrink-0">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl">
                <Award className="w-10 h-10 text-secondary" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <DialogTitle className="text-2xl font-black uppercase tracking-tight">{selectedHistory?.term} Performance Dossier</DialogTitle>
                  <Badge className="bg-secondary text-primary border-none font-black">{selectedHistory?.year}</Badge>
                </div>
                <DialogDescription className="text-white/60">
                  Detailed results for {selectedHistory?.subject} • {selectedHistory?.class}
                </DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedHistory(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-green-600 tracking-widest">Excellence & Pass</p>
                  <p className="text-3xl font-black text-green-700">{selectedHistory?.numPass}</p>
                </div>
                <UserRoundCheck className="w-10 h-10 text-green-200" />
              </div>
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Underperforming</p>
                  <p className="text-3xl font-black text-green-700">{selectedHistory?.numFail}</p>
                </div>
                <UserRoundX className="w-10 h-10 text-red-200" />
              </div>
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Final Mean</p>
                  <p className="text-3xl font-black text-primary">{selectedHistory?.percentPass}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-primary/10" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-green-100 pb-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm font-black uppercase text-green-700 tracking-widest">Passing Students</h3>
                </div>
                <div className="rounded-2xl border border-green-50 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-green-50">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase text-green-700 py-3">Student Name</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase text-green-700 pr-6">Moy/20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHistory?.students.filter((s: any) => s.status === 'pass').map((s: any, i: number) => (
                        <TableRow key={i} className="hover:bg-green-50/30">
                          <TableCell className="font-bold text-sm text-primary py-3">{s.name}</TableCell>
                          <TableCell className="text-right pr-6 font-black text-green-600">{s.mark.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-red-100 pb-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-black uppercase text-red-700 tracking-widest">Failures / Resits</h3>
                </div>
                <div className="rounded-2xl border border-red-50 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-red-50">
                      <TableRow>
                        <TableHead className="text-[10px] font-black uppercase text-red-700 py-3">Student Name</TableHead>
                        <TableHead className="text-right text-[10px] font-black uppercase text-red-700 pr-6">Moy/20</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedHistory?.students.filter((s: any) => s.status === 'fail').map((s: any, i: number) => (
                        <TableRow key={i} className="hover:bg-red-50/30">
                          <TableCell className="font-bold text-sm text-primary py-3">{s.name}</TableCell>
                          <TableCell className="text-right pr-6 font-black text-green-600">{s.mark.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center shrink-0">
             <div className="flex items-center gap-2 text-muted-foreground italic">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Institutional Pedagogical Audit Record</p>
             </div>
             <Button onClick={() => setSelectedHistory(null)} className="rounded-xl h-11 px-8 font-black uppercase text-[10px] bg-primary text-white">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignatureSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 30L85 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}
