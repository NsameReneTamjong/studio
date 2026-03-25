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
  Signature
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
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", isLicensePaid: false, section: "Francophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s3/100/100", dob: "10/03/2007" },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", isLicensePaid: true, section: "Anglophone Section", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s4/100/100", dob: "05/01/2008" },
];

const MOCK_GRADES = [
  { subject: "Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
  { subject: "English Literature", seq1: 12.0, seq2: 13.0, teacher: "Ms. Bennet", status: "Passed", coeff: 3 },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed", coeff: 4 },
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
  
  // Role Detection
  const isSchoolAdmin = user?.role === "SCHOOL_ADMIN";
  const isSubAdmin = user?.role === "SUB_ADMIN";
  const isTeacher = user?.role === "TEACHER";
  const isAdmin = isSchoolAdmin || isSubAdmin;

  // Management States
  const [selectedSection, setSelectedSection] = useState(isSubAdmin ? "Anglophone Section" : "all");
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedTerm, setSelectedTerm] = useState("Term 1");
  const [selectedYear, setSelectedYear] = useState("2023/2024");
  const [activeSequence, setActiveSequence] = useState("seq1");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewStudent, setPreviewStudent] = useState<any>(null);

  // Filter Logic
  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const sectionMatch = selectedSection === "all" || s.section === selectedSection;
      const classMatch = s.class === selectedClass;
      return sectionMatch && classMatch;
    });
  }, [selectedSection, selectedClass]);

  const studentStats = useMemo(() => {
    const gradesToCalc = MOCK_GRADES;
    const totalWeighted = gradesToCalc.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = gradesToCalc.reduce((acc, curr) => acc + curr.coeff, 0);
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
  }, []);

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
                        <div className="h-9 w-16 mx-auto bg-accent/20 rounded-lg flex items-center justify-center font-black text-primary/40 italic">
                          <Lock className="w-3.5 h-3.5 mr-1.5" /> 14.5
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase text-green-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 text-primary" onClick={() => setPreviewStudent(s)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">No students found in the selected section/class.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-6 border-t border-accent flex justify-between items-center">
               <div className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-40">Administrative View • Individual Report Cards Enabled</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] uppercase font-black text-muted-foreground">Class Completion</p>
                  <p className="text-lg font-black text-primary">100% Synced</p>
               </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* OFFICIAL REPORT CARD PREVIEW MODAL */}
      <Dialog open={!!previewStudent} onOpenChange={() => setPreviewStudent(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-[2rem]">
          <DialogHeader className="p-6 bg-primary text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <FileText className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black">Official Term Bulletin</DialogTitle>
                  <DialogDescription className="text-white/70">Verified pedagogical evaluation • {selectedYear} • {selectedTerm}</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewStudent(null)} className="text-white hover:bg-white/10">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-10 print:p-0 print:bg-white overflow-x-auto">
            <div id="printable-bulletin" className="bg-white p-8 md:p-12 shadow-sm border border-border min-w-[850px] flex flex-col space-y-8 font-serif text-black relative print:shadow-none print:border-none">
               {/* National Header */}
               <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-1 text-[10px] uppercase font-black">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                    <p>{user?.school?.name || "GBHS Deido"}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 border-2 border-primary/10">
                       <img src={user?.school?.logo} alt="School Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <p className="text-[10px] font-black uppercase italic tracking-tighter">Motto: {user?.school?.motto}</p>
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
                  <h2 className="text-3xl font-black uppercase underline decoration-double underline-offset-4 tracking-tighter">
                    {language === 'en' ? 'OFFICIAL REPORT CARD' : 'BULLETIN DE NOTES OFFICIEL'}
                  </h2>
                  <p className="font-bold text-sm italic">Academic Session: {selectedYear} • {selectedTerm}</p>
               </div>

               {/* Student Metadata Card */}
               <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center shadow-inner">
                  <div className="col-span-2">
                     <Avatar className="w-32 h-32 border-4 border-white rounded-2xl bg-white overflow-hidden shadow-lg">
                        <AvatarImage src={previewStudent?.avatar} className="object-cover" />
                        <AvatarFallback className="text-4xl font-black">{previewStudent?.name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                  </div>
                  <div className="col-span-10">
                     <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Student Name:</span><span className="font-black uppercase">{previewStudent?.name}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Matricule / ID:</span><span className="font-mono font-bold text-primary">{previewStudent?.id}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Grade / Class:</span><span className="font-bold">{previewStudent?.class}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Date of Birth:</span><span className="font-bold">{previewStudent?.dob}</span></div>
                     </div>
                  </div>
               </div>

               {/* Cameroon High School Standard Marks Table */}
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
                    {MOCK_GRADES.map((g: any, i: number) => {
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

               {/* Performance Summary */}
               <div className="grid grid-cols-12 gap-8 pt-4">
                  <div className="col-span-7 border-2 border-black p-6 rounded-2xl space-y-6 shadow-sm">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <div className="flex justify-between text-xs border-b border-black/10 pb-1 uppercase font-bold opacity-60"><span>Total Coeff:</span><span className="font-black text-black">{studentStats.totalCoeff}</span></div>
                           <div className="flex justify-between text-xs border-b border-black/10 pb-1 uppercase font-bold opacity-60"><span>Total Weighted:</span><span className="font-black text-black">{studentStats.totalWeighted}</span></div>
                           <div className="flex flex-col pt-2 text-center bg-primary/5 rounded-xl p-3 border border-primary/10">
                              <span className="font-black uppercase text-[10px] text-muted-foreground">Term Final Average</span>
                              <span className="text-3xl font-black text-primary underline decoration-double underline-offset-4">{studentStats.average} / 20</span>
                           </div>
                        </div>
                        <div className="bg-black/5 p-4 rounded-xl space-y-3 text-[10px] uppercase font-black">
                           <p className="text-center border-b border-black/10 pb-1 mb-1">Class Statistics</p>
                           <div className="flex justify-between"><span>Group Average:</span><span>{studentStats.classAvg}</span></div>
                           <div className="flex justify-between text-green-700"><span>Highest Group Average:</span><span>{studentStats.highestAvg}</span></div>
                           <div className="flex justify-between text-red-700"><span>Lowest Group Average:</span><span>{studentStats.lowestAvg}</span></div>
                        </div>
                     </div>
                     <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <Award className="w-5 h-5 text-primary" />
                           <p className="text-sm font-black uppercase">Term Rank: <span className="text-primary italic underline underline-offset-2">{studentStats.position}</span></p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Scale className="w-5 h-5 text-secondary" />
                           <p className="text-xs font-black uppercase">Conduct Rating: <span className="text-secondary italic underline underline-offset-2">EXCELLENT</span></p>
                        </div>
                     </div>
                  </div>

                  <div className="col-span-5 space-y-6">
                     <div className="border-2 border-black p-5 rounded-2xl h-full flex flex-col bg-accent/5">
                        <p className="text-[11px] font-black uppercase text-center border-b border-black mb-3 pb-1">Academic Council Remark</p>
                        <div className="flex-1 italic text-xs text-muted-foreground p-3 font-medium leading-relaxed">
                           "The student demonstrates consistent pedagogical participation and excellent self-discipline. Maintain this high academic standard."
                        </div>
                        <div className="mt-auto pt-6 flex justify-between items-end border-t border-black/10">
                           <div className="text-center space-y-1">
                              <p className="text-[8px] font-black uppercase">Class Master</p>
                              <div className="h-10 w-16 mx-auto flex items-center justify-center opacity-30"><Signature className="w-full h-full" /></div>
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

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print">
            <div className="flex-1 flex items-center gap-2 text-muted-foreground italic text-xs">
               <Info className="w-4 h-4" />
               <p>Bulletin published on: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.print()} className="rounded-xl h-12 px-8 font-black uppercase text-xs gap-2">
                <Printer className="w-4 h-4" /> Print Bulletin
              </Button>
              <Button 
                variant="secondary"
                className="rounded-xl h-12 px-8 font-black uppercase text-xs gap-2"
                onClick={() => toast({ title: "Download Initialized", description: "PDF is being prepared." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button onClick={() => setPreviewStudent(null)} className="rounded-xl h-12 px-10 font-black uppercase text-xs">Close Dossier</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
