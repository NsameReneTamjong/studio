
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
  FileBadge,
  Globe,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology", "History", "Geography"];
const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023", "2021 / 2022"];
const TERMS = ["Term 1", "Term 2", "Term 3"];

const MOCK_STUDENTS_GRADES = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", class: "2nde / Form 5", section: "Anglophone Section", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 16.0 },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", class: "2nde / Form 5", section: "Anglophone Section", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 18.0, seq2: 17.5 },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", class: "2nde / Form 5", section: "Francophone Section", avatar: "https://picsum.photos/seed/s3/100/100", seq1: 9.5, seq2: 10.5 },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", class: "2nde / Form 5", section: "Technical Section", avatar: "https://picsum.photos/seed/s4/100/100", seq1: 12.0, seq2: 13.0 },
];

const MOCK_PERSONAL_GRADES = [
  { subject: "Advanced Physics", seq1: 14.5, seq2: 16.0, coeff: 4, teacher: "Dr. Tesla", status: "Passed" },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, coeff: 5, teacher: "Prof. Smith", status: "Passed" },
  { subject: "English Literature", seq1: 8.0, seq2: 13.0, coeff: 3, teacher: "Ms. Bennet", status: "Passed" },
  { subject: "General Chemistry", seq1: 10.5, seq2: 11.5, coeff: 4, teacher: "Dr. White", status: "Passed" },
  { subject: "History", seq1: 7.5, seq2: 9.0, coeff: 2, teacher: "Mr. Tabi", status: "Failed" },
];

const MOCK_PERSONAL_ARCHIVE = [
  { id: "R1", year: "2023 / 2024", term: "Term 1", average: "15.45", position: "4th / 45", classMaster: "Mr. Abena", status: "Published" },
  { id: "R2", year: "2022 / 2023", term: "Term 3", average: "14.20", position: "8th / 42", classMaster: "Mme. Njoh", status: "Published" },
  { id: "R3", year: "2022 / 2023", term: "Term 2", average: "13.85", position: "12th / 42", classMaster: "Mme. Njoh", status: "Published" },
];

const MOCK_TRANSCRIPT_DATA = {
  "Advanced Physics": { f1: ["12.5", "13.0", "14.2"], f2: ["11.0", "12.5", "13.5"], f3: ["14.0", "15.5", "16.0"] },
  "Mathematics": { f1: ["15.0", "16.5", "17.0"], f2: ["14.5", "15.0", "16.0"], f3: ["17.5", "18.0", "17.5"] },
  "English": { f1: ["10.0", "11.5", "12.0"], f2: ["09.5", "10.0", "11.0"], f3: ["12.5", "13.0", "13.5"] },
  "History": { f1: ["08.5", "09.0", "10.5"], f2: ["07.5", "08.0", "09.5"], f3: ["09.0", "10.5", "11.0"] }
};

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
  
  // Admin Filters
  const [adminFilters, setAdminFilters] = useState({
    year: ACADEMIC_YEARS[0],
    term: TERMS[0],
    section: "all",
    class: "all",
    search: ""
  });

  const [grades, setGrades] = useState(MOCK_STUDENTS_GRADES);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isAdmin = isSchoolAdmin || isSubAdmin;

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

  const handleBulkIssue = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Batch Generation Successful",
        description: `Preparing all bulletins for ${adminFilters.class} - ${adminFilters.term}.`,
      });
    }, 2500);
  };

  const filteredAdminStudents = useMemo(() => {
    return MOCK_STUDENTS_GRADES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(adminFilters.search.toLowerCase()) || s.id.toLowerCase().includes(adminFilters.search.toLowerCase());
      const matchesClass = adminFilters.class === "all" || s.class === adminFilters.class;
      const matchesSection = adminFilters.section === "all" || s.section === adminFilters.section;
      
      // Sub-admin section restriction logic
      if (isSubAdmin) {
        // Assume sub-admin section is determined by their own profile (here we mock it)
        const subAdminSection = "Anglophone Section";
        if (s.section !== subAdminSection) return false;
      }

      return matchesSearch && matchesClass && matchesSection;
    });
  }, [adminFilters, isSubAdmin]);

  const stats = useMemo(() => {
    if (isStudent) {
      const totalWeighted = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
      const totalCoeff = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
      return {
        average: (totalWeighted / totalCoeff).toFixed(2),
        passRate: "100"
      };
    }
    const totalAvg = grades.reduce((acc, curr) => acc + (curr.seq1 + curr.seq2) / 2, 0) / (grades.length || 1);
    const passedCount = grades.filter(g => (g.seq1 + g.seq2) / 2 >= 10).length;
    return {
      average: totalAvg.toFixed(2),
      passRate: ((passedCount / (grades.length || 1)) * 100).toFixed(0)
    };
  }, [grades, isStudent]);

  if (isLoading) {
    return <LoadingState message="Fetching pedagogical records..." />;
  }

  // --- STUDENT VIEW ---
  if (isStudent) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                My Academic Results
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Track your performance and download bulletins.</p>
            </div>
          </div>
          <Button onClick={handleExportPdf} disabled={isProcessing} className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-3">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            Download Official Bulletin
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Term Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={cn("text-3xl font-black", parseFloat(stats.average) < 10 ? "text-red-400" : "text-secondary")}>
                {stats.average} / 20
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Promotion Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-black flex items-center gap-2">
                {parseFloat(stats.average) >= 10 ? (
                  <><CheckCircle2 className="w-6 h-6 text-green-600" /> ELIGIBLE</>
                ) : (
                  <><XCircle className="w-6 h-6 text-red-600" /> AT RISK</>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-white border col-span-1 sm:col-span-2 md:col-span-1">
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
          <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl overflow-x-auto no-scrollbar">
            <TabsTrigger value="current" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm">
              <BookMarked className="w-4 h-4" /> Current Term
            </TabsTrigger>
            <TabsTrigger value="archive" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm">
              <History className="w-4 h-4" /> Full Archive
            </TabsTrigger>
            <TabsTrigger value="transcript" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm">
              <FileBadge className="w-4 h-4" /> {t("draftTranscript")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <BookMarked className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Sequence Registry</CardTitle>
                      <CardDescription className="text-white/60">Verified marks for Sequence 1 & 2</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">Subject</TableHead>
                      <TableHead className="text-center">Coeff</TableHead>
                      <TableHead className="text-center">Seq 1</TableHead>
                      <TableHead className="text-center">Seq 2</TableHead>
                      <TableHead className="text-center">Moy/20</TableHead>
                      <TableHead className="text-right pr-8">Integrity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_GRADES.map((g, idx) => {
                      const avg = (g.seq1 + g.seq2) / 2;
                      const isFailed = avg < 10;
                      return (
                        <TableRow key={idx} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-16">
                          <TableCell className="pl-8 font-black text-primary uppercase text-xs md:text-sm">{g.subject}</TableCell>
                          <TableCell className="text-center font-mono font-bold text-muted-foreground italic text-xs">{g.coeff}</TableCell>
                          <TableCell className={cn("text-center font-bold text-xs md:text-sm", g.seq1 < 10 ? "text-red-600" : "")}>{g.seq1.toFixed(2)}</TableCell>
                          <TableCell className={cn("text-center font-bold text-xs md:text-sm", g.seq2 < 10 ? "text-red-600" : "")}>{g.seq2.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <span className={cn("font-black text-base md:text-lg", isFailed ? "text-red-600" : "text-primary")}>{avg.toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100 font-bold text-[8px] uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Signed
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archive" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-6 md:p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <History className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Report Archive</CardTitle>
                    <CardDescription className="text-white/60">Past pedagogical evaluations.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10">
                    <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                      <TableHead className="pl-8 py-4">Academic Year</TableHead>
                      <TableHead>Term</TableHead>
                      <TableHead className="text-center">Average</TableHead>
                      <TableHead className="text-center">Position</TableHead>
                      <TableHead className="text-right pr-8">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_ARCHIVE.map((report) => (
                      <TableRow key={report.id} className="hover:bg-accent/5 transition-colors border-b last:border-0 h-16">
                        <TableCell className="pl-8 font-black text-primary text-xs md:text-sm">{report.year}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/10 text-primary">{report.term}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={cn("font-black text-sm md:text-lg", parseFloat(report.average) < 10 ? "text-red-600" : "text-primary")}>
                            {report.average} / 20
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-[10px] md:text-xs text-muted-foreground">{report.position}</span>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full hover:bg-primary hover:text-white transition-all shadow-sm h-8 w-8"
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

          <TabsContent value="transcript" className="animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-6 md:p-8 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <FileBadge className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Draft Transcript</CardTitle>
                      <CardDescription className="text-white/60 text-xs">Institutional Provisional Copy</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
                <div className="overflow-x-auto scrollbar-thin rounded-xl border border-accent">
                  <TranscriptPreview student={user} platform={platformSettings} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (isAdmin) {
    return (
      <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3 uppercase">
                Institutional Report Issuance
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">Strategic portal for auditing and generating academic bulletins.</p>
            </div>
          </div>
          
          <Button 
            onClick={handleBulkIssue} 
            disabled={isProcessing || filteredAdminStudents.length === 0} 
            className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-3"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Issue Batch Reports ({filteredAdminStudents.length})
          </Button>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-[2rem] border shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-primary ml-1">Academic Session</Label>
              <Select value={adminFilters.year} onValueChange={(v) => setAdminFilters({...adminFilters, year: v})}>
                <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-primary ml-1">Evaluation Term</Label>
              <Select value={adminFilters.term} onValueChange={(v) => setAdminFilters({...adminFilters, term: v})}>
                <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-primary ml-1">Sub-School / Section</Label>
              <Select value={adminFilters.section} onValueChange={(v) => setAdminFilters({...adminFilters, section: v})}>
                <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs"><SelectValue placeholder="All Sections" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Entire Node</SelectItem>
                  {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-primary ml-1">Class Stream</Label>
              <Select value={adminFilters.class} onValueChange={(v) => setAdminFilters({...adminFilters, class: v})}>
                <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs"><SelectValue placeholder="All Classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Entire School</SelectItem>
                  {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[9px] font-black uppercase text-primary ml-1">Find Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Name or ID..." 
                  className="h-11 bg-accent/30 border-none rounded-xl text-xs" 
                  value={adminFilters.search}
                  onChange={(e) => setAdminFilters({...adminFilters, search: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
          <CardHeader className="bg-primary p-6 md:p-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Academic Bulletin Registry</CardTitle>
                  <CardDescription className="text-white/60 text-xs">Viewing verified records for {adminFilters.year} • {adminFilters.term}</CardDescription>
                </div>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-3">
                <Users className="w-5 h-5 text-secondary" />
                <span className="text-sm font-black">{filteredAdminStudents.length} Students Listed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                <TableRow>
                  <TableHead className="pl-8 py-4">Matricule</TableHead>
                  <TableHead>Student Identity</TableHead>
                  <TableHead>Class / Section</TableHead>
                  <TableHead className="text-center">Moyenne</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAdminStudents.map((s) => {
                  const avg = ((s.seq1 + s.seq2) / 2);
                  const isPassed = avg >= 10;
                  return (
                    <TableRow key={s.uid} className="hover:bg-accent/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                          <span className="font-bold text-xs md:text-sm text-primary uppercase">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase">{s.class}</span>
                          <span className="text-[8px] font-black text-muted-foreground uppercase">{s.section}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={cn("font-black text-base", isPassed ? "text-primary" : "text-red-600")}>{avg.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn("text-[8px] font-black uppercase px-2 h-5 border-none", isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                          {isPassed ? 'CLEARED' : 'FAILED'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5" onClick={() => setPreviewDoc({ ...s, year: adminFilters.year, term: adminFilters.term })}>
                            <Eye className="w-4 h-4 text-primary/60" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5" onClick={() => toast({ title: "Report Download Started" })}>
                            <Download className="w-4 h-4 text-primary/60" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- TEACHER VIEW ---
  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary rounded-xl shadow-lg">
            <Award className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3 uppercase">
              Term Mark Entry
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Official registry for current assessments.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={handleExportPdf} disabled={isProcessing} className="flex-1 md:flex-none h-12 px-6 rounded-2xl border-primary/10 bg-white gap-2 font-bold group">
            <FileDown className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
            PDF
          </Button>
          <Button onClick={handleCommitGrades} disabled={isProcessing} className="flex-[2] md:flex-none h-12 px-10 rounded-2xl shadow-xl font-black uppercase tracking-widest text-[10px] gap-3">
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Sequence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Group Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.passRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary" /> VERIFIED
            </div>
          </CardContent>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Class Level</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Sequence</Label>
          <Select value={activeSequence} onValueChange={(v: any) => setActiveSequence(v)}>
            <SelectTrigger className="h-11 bg-secondary/20 border-secondary/20 rounded-xl font-black text-primary text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seq1">Sequence 1</SelectItem>
              <SelectItem value="seq2">Sequence 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-6 md:p-8 text-white">
          <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Gradebook: {selectedSubject}</CardTitle>
          <CardDescription className="text-white/60 text-xs">Filling Sequence {activeSequence === 'seq1' ? '1' : '2'}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[9px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Student Profile</TableHead>
                <TableHead className="text-center w-24">Seq 1</TableHead>
                <TableHead className="text-center w-24">Seq 2</TableHead>
                <TableHead className="text-center">Term Moy</TableHead>
                <TableHead className="text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((s) => {
                const avg = ((s.seq1 + s.seq2) / 2).toFixed(2);
                const isPassed = parseFloat(avg) >= 10;
                return (
                  <TableRow key={s.uid} className="hover:bg-accent/5 border-b last:border-0 h-16">
                    <TableCell className="pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border shrink-0">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px]">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-xs text-primary uppercase">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        step="0.25"
                        value={s.seq1}
                        onChange={(e) => handleGradeChange(s.uid, 'seq1', e.target.value)}
                        className={cn("w-16 mx-auto text-center h-9 border-none font-black rounded-lg text-xs", activeSequence === 'seq1' ? "bg-white ring-1 ring-secondary" : "bg-accent/30 opacity-40")}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        step="0.25"
                        value={s.seq2}
                        onChange={(e) => handleGradeChange(s.uid, 'seq2', e.target.value)}
                        className={cn("w-16 mx-auto text-center h-9 border-none font-black rounded-lg text-xs", activeSequence === 'seq2' ? "bg-white ring-1 ring-secondary" : "bg-accent/30 opacity-40")}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn("font-black text-sm", isPassed ? "text-primary" : "text-red-600")}>{avg}</span>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn("text-[8px] font-black uppercase px-2 h-5 border-none", isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                        {isPassed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BULLETIN PREVIEW DIALOG */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-6 bg-primary text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FileText className="w-6 h-6 text-secondary" />
                </div>
                <DialogTitle className="text-xl font-black">Official Term Bulletin</DialogTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(null)} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-2 md:p-10 print:p-0 print:bg-white overflow-x-auto">
            <div id="printable-bulletin" className="bg-white p-6 md:p-12 shadow-sm border border-border min-w-[850px] flex flex-col space-y-8 font-serif text-black relative print:shadow-none print:border-none mx-auto">
               <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-1 text-[10px] uppercase font-black">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                    <p>{user?.school?.name || "INSTITUTIONAL NODE"}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 border-2 border-primary/10">
                       <img src={previewDoc?.schoolLogo || user?.school?.logo || platformSettings.logo} alt="School Logo" className="w-14 h-14 object-contain" />
                    </div>
                  </div>
                  <div className="space-y-1 text-[10px] uppercase font-black">
                    <p>République du Cameroun</p>
                    <p>Paix - Travail - Patrie</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Min. des Enseignements Secondaires</p>
                  </div>
               </div>
               
               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase underline decoration-double underline-offset-4 tracking-tighter text-primary">
                    OFFICIAL REPORT CARD
                  </h2>
                  <p className="font-bold text-xs italic">Session: {previewDoc?.year} • {previewDoc?.term}</p>
               </div>

               <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center shadow-inner">
                  <div className="col-span-3">
                     <Avatar className="w-24 h-24 border-4 border-white rounded-2xl bg-white overflow-hidden shadow-lg mx-auto">
                        <AvatarImage src={previewDoc?.avatar} className="object-cover" />
                        <AvatarFallback className="text-2xl font-black">{previewDoc?.name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                  </div>
                  <div className="col-span-9">
                     <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-[11px]">
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60">Identity:</span><span className="font-black uppercase">{previewDoc?.name}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60">Matricule:</span><span className="font-mono font-bold text-primary">{previewDoc?.id}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60">Class:</span><span className="font-bold">{previewDoc?.class || "2nde / Form 5"}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60">Status:</span><span className="font-bold text-green-600 uppercase">{previewDoc?.status || "ENROLLED"}</span></div>
                     </div>
                  </div>
               </div>

               <Table className="border-collapse border-2 border-black">
                  <TableHeader className="bg-black/5">
                    <TableRow className="border-b-2 border-black">
                      <TableHead className="text-[10px] uppercase font-black text-black border-r-2 border-black h-12">Subject</TableHead>
                      <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-16">Seq 1</TableHead>
                      <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-16">Seq 2</TableHead>
                      <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-16">Moy/20</TableHead>
                      <TableHead className="text-center text-[10px] uppercase font-black text-black border-r border-black w-16">Coeff</TableHead>
                      <TableHead className="text-right text-[10px] uppercase font-black text-black pr-4">Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_GRADES.map((g: any, i: number) => {
                      const subjectAvg = (g.seq1 + g.seq2) / 2;
                      return (
                        <TableRow key={i} className="border-b border-black">
                          <TableCell className="font-bold py-2 border-r-2 border-black text-xs uppercase">{g.subject}</TableCell>
                          <TableCell className={cn("text-center py-2 border-r border-black font-medium", g.seq1 < 10 ? "text-red-600" : "")}>{g.seq1.toFixed(2)}</TableCell>
                          <TableCell className={cn("text-center py-2 border-r border-black font-medium", g.seq2 < 10 ? "text-red-600" : "")}>{g.seq2.toFixed(2)}</TableCell>
                          <TableCell className={cn("text-center py-2 border-r border-black font-black bg-accent/5", subjectAvg < 10 ? "text-red-600" : "text-primary")}>{subjectAvg.toFixed(2)}</TableCell>
                          <TableCell className="text-center py-2 border-r border-black font-bold italic">{g.coeff}</TableCell>
                          <TableCell className="text-right py-2 pr-4 text-[9px] uppercase font-black italic">{getAppreciation(subjectAvg).text}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
               </Table>

               <div className="mt-auto text-center pt-8 border-t border-black/5 opacity-30">
                  <div className="flex items-center justify-center gap-3">
                     <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain opacity-20" />
                     <p className="text-[8px] uppercase font-black tracking-[0.4em]">Verified Educational Record • Secure Node</p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 no-print shrink-0">
            <Button variant="outline" onClick={() => window.print()} className="flex-1 rounded-xl h-12 font-black uppercase text-xs gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={() => setPreviewDoc(null)} className="flex-1 rounded-xl h-12 font-black uppercase text-xs bg-primary text-white">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TranscriptPreview({ student, platform }: { student: any, platform: any }) {
  const classIndex = CLASSES.indexOf(student?.class || "2nde / Form 5");
  const visibleClasses = CLASSES.slice(0, classIndex + 1);

  return (
    <div className="bg-white p-6 md:p-12 border shadow-sm relative overflow-hidden font-serif text-black min-w-[1100px] print:shadow-none print:border-none">
      <style jsx global>{`
        @media print {
          @page { size: landscape; margin: 10mm; }
        }
      `}</style>
      
      <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
        <div className="space-y-1 text-[9px] uppercase font-black text-left">
          <p>Republic of Cameroon</p>
          <p>Peace - Work - Fatherland</p>
          <div className="h-px bg-black w-8 my-1" />
          <p>Ministry of Secondary Education</p>
          <p>{student?.school?.name || "INSTITUTIONAL NODE"}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white flex items-center justify-center p-2 border-2 border-primary/10">
             <img src={student?.school?.logo || platform.logo} alt="Logo" className="w-14 h-14 object-contain" />
          </div>
          <p className="text-[9px] font-black uppercase text-primary tracking-tighter">Verified Registry Node</p>
        </div>
        <div className="space-y-1 text-[9px] uppercase font-black text-right">
          <p>République du Cameroun</p>
          <p>Paix - Travail - Patrie</p>
          <div className="h-px bg-black w-8 ml-auto my-1" />
          <p>Min. des Enseignements Secondaires</p>
          <p>Délégation Régionale Littoral</p>
        </div>
      </div>

      <div className="text-center my-10 space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-widest underline underline-offset-8 decoration-double">Official Academic Transcript</h1>
        <p className="text-sm font-bold opacity-60">Relevé de Notes Provisoire • Valid for Session 2023 / 2024</p>
      </div>

      <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center mb-10 shadow-inner">
        <div className="col-span-2">
           <Avatar className="w-32 h-32 border-4 border-white rounded-[2rem] shadow-xl">
              <AvatarImage src={student?.avatar} />
              <AvatarFallback className="text-4xl font-black">{student?.name?.charAt(0)}</AvatarFallback>
           </Avatar>
        </div>
        <div className="col-span-10 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Identity:</span><span className="font-black uppercase">{student?.name}</span></div>
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Matricule:</span><span className="font-mono font-bold text-primary">{student?.id}</span></div>
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Current Grade:</span><span className="font-bold">{student?.class}</span></div>
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Status:</span><span className="font-black text-green-600">ENROLLED</span></div>
        </div>
      </div>

      <div className="border-2 border-black overflow-hidden rounded-sm">
        <Table className="border-collapse">
          <TableHeader className="bg-black/5">
            <TableRow className="border-b-2 border-black h-12">
              <TableHead rowSpan={2} className="border-r-2 border-black font-black text-black uppercase text-[10px] text-center w-48">Pedagogical Subject</TableHead>
              {visibleClasses.map((cls, i) => (
                <TableHead key={i} colSpan={3} className={cn("border-r-2 border-black font-black text-black uppercase text-[10px] text-center h-8", i === visibleClasses.length - 1 ? "border-r-0" : "")}>
                  {cls.split(' / ')[1] || cls}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="border-b-2 border-black h-8">
              {visibleClasses.map((_, i) => (
                <React.Fragment key={i}>
                  <TableHead className="border-r border-black font-bold text-[8px] text-center">T1</TableHead>
                  <TableHead className="border-r border-black font-bold text-[8px] text-center">T2</TableHead>
                  <TableHead className={cn("border-r-2 border-black font-bold text-[8px] text-center", i === visibleClasses.length - 1 ? "border-r-0" : "")}>T3</TableHead>
                </React.Fragment>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(MOCK_TRANSCRIPT_DATA).map(([subject, years]: [string, any], idx) => (
              <TableRow key={idx} className="border-b border-black last:border-0 h-10">
                <TableCell className="border-r-2 border-black font-black text-[10px] uppercase py-2 pl-4">{subject}</TableCell>
                {visibleClasses.map((_, i) => {
                  const key = `f${i + 1}`;
                  const data = years[key] || ["---", "---", "---"];
                  return (
                    <React.Fragment key={i}>
                      <TableCell className={cn("border-r border-black text-center text-[10px] font-mono", parseFloat(data[0]) < 10 ? "text-red-600" : "")}>{data[0]}</TableCell>
                      <TableCell className={cn("border-r border-black text-center text-[10px] font-mono", parseFloat(data[1]) < 10 ? "text-red-600" : "")}>{data[1]}</TableCell>
                      <TableCell className={cn("border-r-2 border-black text-center text-[10px] font-mono bg-accent/5", i === visibleClasses.length - 1 ? "border-r-0" : "", parseFloat(data[2]) < 10 ? "text-red-600" : "")}>{data[2]}</TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-3 gap-10 mt-16 pt-10 border-t-2 border-black/5">
        <div className="flex flex-col items-center gap-4 text-center">
          <QrCode className="w-20 h-20 opacity-10" />
          <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Security Registry Scan</p>
        </div>
        <div className="text-center space-y-6">
          <div className="h-14 w-full bg-accent/10 border-b-2 border-black/40 flex items-center justify-center">
             <div className="w-full h-full opacity-10 p-2">
                <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
             </div>
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">The Registrar</p>
        </div>
        <div className="text-center space-y-6">
          <div className="h-14 w-full bg-accent/10 border-b-2 border-black/40 flex items-center justify-center">
             <Badge variant="outline" className="border-black text-[8px] font-black uppercase px-4 py-1">OFFICIAL SEAL</Badge>
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Institutional Head</p>
        </div>
      </div>
    </div>
  )
}

function SignatureSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 30L85 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}
