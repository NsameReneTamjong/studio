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
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Mathematics", "Advanced Physics", "Chemistry", "English Literature", "French", "Biology", "History", "Geography"];
const TERMS = ["Term 1", "Term 2", "Term 3"];
const ACADEMIC_YEARS = ["2023/2024", "2022/2023"];

const MOCK_STUDENTS = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5" },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5" },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", isLicensePaid: false, section: "Francophone Section", class: "2nde / Form 5" },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5" },
];

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  // Role Detection
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isAdmin = isSchoolAdmin || isSubAdmin;

  // Management States
  const [selectedSection, setSelectedSection] = useState(isSubAdmin ? "Anglophone Section" : "all");
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState("2023/2024");
  const [activeSequence, setActiveSequence] = useState("seq1");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const sectionMatch = selectedSection === "all" || s.section === selectedSection;
      const classMatch = s.class === selectedClass;
      return sectionMatch && classMatch;
    });
  }, [selectedSection, selectedClass]);

  const handlePublishResults = () => {
    if (!isSchoolAdmin) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Results Published",
        description: `Official marks for ${selectedTerm} have been released to the portal.`,
      });
    }, 2000);
  };

  const handleGenerateReports = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Bulk Reports Generated",
        description: `Pedagogical records for ${filteredStudents.length} students are ready for download.`,
      });
    }, 1500);
  };

  const handleSetCycle = () => {
    toast({
      title: "Pedagogical Cycle Updated",
      description: `Staff are now notified to fill marks for ${selectedTerm} - ${activeSequence.toUpperCase()}.`,
    });
  };

  // TEACHER VIEW (Legacy or Student View logic preserved for non-admins)
  if (!isAdmin && !isTeacher) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Lock className="w-12 h-12 text-primary opacity-20" />
        <p className="text-muted-foreground italic">Student personal records are viewed in the "Child Dashboard" or "My Performance" modules.</p>
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
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/20 gap-2 font-bold" onClick={handleGenerateReports} disabled={isProcessing}>
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
        {/* Management Controls */}
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

              <Button className="w-full h-12 rounded-xl shadow-lg font-bold gap-2" variant="outline" onClick={handleSetCycle}>
                <CheckCircle className="w-4 h-4 text-green-600" />
                Apply Cycle Update
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-blue-50 p-6 space-y-4">
             <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-600" />
                <h4 className="text-xs font-black uppercase text-blue-700">Publishing Notice</h4>
             </div>
             <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
               "Publishing results will finalize the term records and make them visible to students and parents. Ensure all mark entry cycles are closed before proceeding."
             </p>
          </Card>
        </div>

        {/* Data Registry View */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
            <CardHeader className="bg-white border-b p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Audit Registry</CardTitle>
                <CardDescription className="text-xs">Verifying mark entry completion for the selected class.</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="space-y-1">
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="h-10 w-[180px] bg-accent/20 border-none rounded-lg text-xs font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead className="text-center">Active Seq Mark</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.uid} className="hover:bg-accent/5 border-b border-accent/10 transition-colors">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0">
                            <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary">{s.name}</span>
                            <span className="text-[8px] uppercase font-black opacity-40">{s.section}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="h-9 w-16 mx-auto bg-accent/20 rounded-lg flex items-center justify-center font-black text-primary/40 italic">
                          <Lock className="w-3.5 h-3.5 mr-1.5" /> 14.5
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center text-muted-foreground italic">No students found in the selected section/class.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
               <div className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Administrative View • Data Entry Restricted to Teachers</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] uppercase font-black text-muted-foreground">Class Completion</p>
                  <p className="text-lg font-black text-primary">100% Synced</p>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
