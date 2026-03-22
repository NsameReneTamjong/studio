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
  ArrowLeft,
  FileDown,
  Megaphone,
  Printer,
  ShieldCheck,
  Filter,
  Building2,
  X,
  Wallet
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

const CAMEROON_SUBJECTS = [
  { name: "Mathématiques", coeff: 5, group: "Sciences" },
  { name: "Physique-Chimie", coeff: 4, group: "Sciences" },
  { name: "Anglais", coeff: 3, group: "Languages" },
  { name: "Français", coeff: 3, group: "Languages" },
  { name: "Histoire-Géo", coeff: 2, group: "Arts" },
  { name: "Informatique", coeff: 2, group: "Tech" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const MOCK_GRADES_TEACHER = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 12, coeff: 5, isLicensePaid: true },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 8, seq2: 10.5, coeff: 5, isLicensePaid: true },
];

const MOCK_MASTER_REPORTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", average: 15.40, rank: "04/42", status: "Published", subjectsValidated: "12/12", isLicensePaid: true },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", average: 12.80, rank: "15/38", status: "Published", subjectsValidated: "12/12", isLicensePaid: true },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", average: 14.20, rank: "08/40", status: "Validated", subjectsValidated: "11/12", isLicensePaid: false },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", average: 18.20, rank: "01/42", status: "Published", subjectsValidated: "12/12", isLicensePaid: true },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", average: 10.50, rank: "35/38", status: "Draft", subjectsValidated: "8/12", isLicensePaid: false },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState("mathématiques");
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // View Report State
  const [viewingReport, setViewingReport] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Marks Recorded", description: "Updated in the official registry." });
    }, 1000);
  };

  const handlePublishClass = () => {
    toast({
      title: "Publishing Bulletins",
      description: `Official results for ${selectedClass} are being released to portals.`,
    });
  };

  const handleBulkExport = () => {
    toast({
      title: "Generating Master PDF",
      description: `Compiling report cards for ${MOCK_MASTER_REPORTS.length} students in ${selectedClass}.`,
    });
  };

  const handleOpenReport = (student: any) => {
    if (!student.isLicensePaid) {
      toast({
        variant: "destructive",
        title: "Dossier Locked",
        description: "This student's report card cannot be generated until their annual license fee is paid.",
      });
      return;
    }
    setViewingReport(student);
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

  if (isAdmin) {
    const filteredReports = MOCK_MASTER_REPORTS.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              Institutional Report Cards
            </h1>
            <p className="text-muted-foreground mt-1">
              Validate averages and publish official bulletins for academic sessions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20" onClick={handleBulkExport}>
              <FileDown className="w-5 h-5 text-primary" /> Generate Master PDF
            </Button>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={handlePublishClass}>
              <Megaphone className="w-5 h-5 text-secondary" /> Publish to Class
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent rounded-lg">
                  <Filter className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Class Filter</p>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[220px] h-9 bg-transparent border-none p-0 text-sm font-bold text-primary focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find student by name or ID..." 
                  className="pl-10 h-11 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/10 border-b border-accent/20 hover:bg-accent/10">
                  <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">License Status</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Term Average</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 border-b border-accent/10">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-primary">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.isLicensePaid ? (
                        <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black uppercase">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-none text-[9px] font-black uppercase gap-1">
                          <Lock className="w-2.5 h-2.5" /> Suspended
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-black text-primary text-lg">
                      {student.average.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                        student.status === 'Published' ? "bg-green-100 text-green-700" : 
                        student.status === 'Validated' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full hover:bg-accent"
                          onClick={() => handleOpenReport(student)}
                        >
                          {student.isLicensePaid ? <Eye className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-destructive" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" disabled={!student.isLicensePaid}>
                          <Printer className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
               <ShieldCheck className="w-4 h-4 text-primary" />
               <p className="text-[10px] uppercase font-bold tracking-widest italic">License payment is required for official bulletin generation.</p>
            </div>
            <p className="text-[10px] font-black text-primary uppercase">Total Enrolled: 42 Students</p>
          </CardFooter>
        </Card>

        {/* REPORT CARD PREVIEW DIALOG */}
        <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
          <DialogContent className="sm:max-w-5xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
            <DialogHeader className="bg-primary p-8 text-white no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl">
                    <FileText className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black">Official Bulletin Preview</DialogTitle>
                    <DialogDescription className="text-white/60">Reviewing academic results for {viewingReport?.name}.</DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewingReport(null)} className="text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogHeader>

            <div className="bg-muted p-8 print:p-0 print:bg-white">
              {/* PRINTABLE BULLETIN AREA */}
              <div id="printable-bulletin" className="bg-white p-12 shadow-sm border border-border min-h-[1000px] flex flex-col space-y-8 font-serif text-black relative print:shadow-none print:border-none">
                {/* National Header */}
                <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-1 text-[9px] uppercase font-bold">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                    <p>{user?.school?.name || "EduIgnite Academy"}</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center p-2 border-2 border-primary/20">
                       <Building2 className="w-12 h-12 text-primary opacity-50" />
                    </div>
                  </div>
                  <div className="space-y-1 text-[9px] uppercase font-bold">
                    <p>République du Cameroun</p>
                    <p>Paix - Travail - Patrie</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Min. des Enseignements Secondaires</p>
                    <p>{user?.school?.location || "Douala, Littoral"}</p>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase underline tracking-tighter">
                    REPORT CARD / BULLETIN DE NOTES
                  </h2>
                  <p className="font-bold text-sm italic">Academic Year: 2023/2024 - Term 1</p>
                </div>

                {/* Student Bio */}
                <div className="grid grid-cols-12 gap-6 bg-accent/10 p-6 border border-accent rounded-xl items-center">
                  <div className="col-span-3">
                    <div className="w-28 h-28 border-2 border-black/10 rounded-lg bg-white overflow-hidden shadow-inner">
                      <img src={viewingReport?.avatar} alt={viewingReport?.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="col-span-9 grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
                    <div>
                      <p className="font-bold uppercase opacity-50 text-[9px]">Student Name</p>
                      <p className="font-black text-sm uppercase">{viewingReport?.name}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase opacity-50 text-[9px]">Matricule / ID No.</p>
                      <p className="font-mono font-bold text-sm text-primary">{viewingReport?.id}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase opacity-50 text-[9px]">Class Level</p>
                      <p className="font-bold text-sm">{selectedClass}</p>
                    </div>
                    <div>
                      <p className="font-bold uppercase opacity-50 text-[9px]">Status</p>
                      <Badge className="h-5 text-[10px] bg-green-100 text-green-700 border-none">{viewingReport?.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Marks Table */}
                <div className="overflow-x-auto flex-1">
                  <Table className="border border-black">
                    <TableHeader className="bg-black/5">
                      <TableRow className="border-black">
                        <TableHead className="text-[10px] uppercase font-bold text-black border-r border-black">Subjects / Matières</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Coeff</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Seq 1</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Seq 2</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Moy/20</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-bold text-black">Appreciation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {CAMEROON_SUBJECTS.map((sub, i) => {
                        const seq1 = Math.min(20, Math.max(0, viewingReport?.average + (Math.random() * 4 - 2)));
                        const seq2 = Math.min(20, Math.max(0, viewingReport?.average + (Math.random() * 4 - 2)));
                        const subMoy = (seq1 + seq2) / 2;
                        const app = getAppreciation(subMoy);
                        
                        return (
                          <TableRow key={i} className="border-black">
                            <TableCell className="font-bold py-2 border-r border-black text-[11px]">
                              {sub.name}
                              <p className="text-[8px] opacity-40 font-normal uppercase">{sub.group}</p>
                            </TableCell>
                            <TableCell className="text-center py-2 border-r border-black font-black">{sub.coeff}</TableCell>
                            <TableCell className="text-center py-2 border-r border-black">{seq1.toFixed(2)}</TableCell>
                            <TableCell className="text-center py-2 border-r border-black">{seq2.toFixed(2)}</TableCell>
                            <TableCell className="text-center py-2 border-r border-black font-black text-primary">{subMoy.toFixed(2)}</TableCell>
                            <TableCell className="text-right py-2 text-[10px] uppercase font-medium italic">{app.text}</TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {/* Summary Row */}
                      <TableRow className="border-black bg-black/5 font-bold">
                        <TableCell className="border-r border-black text-right uppercase text-[10px]" colSpan={4}>General Summary / Synthèse Générale</TableCell>
                        <TableCell className="text-center border-r border-black text-xl font-black text-primary">{viewingReport?.average.toFixed(2)}</TableCell>
                        <TableCell className="text-right uppercase text-[10px]">Rank: {viewingReport?.rank}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Footer Signatures */}
                <div className="grid grid-cols-3 gap-8 pt-12 items-end">
                  <div className="text-center space-y-10">
                    <div className="h-px bg-black w-full" />
                    <div>
                      <p className="font-bold text-[10px] uppercase">The Parent</p>
                      <p className="text-[8px] opacity-40 italic">Signature & Date</p>
                    </div>
                  </div>
                  <div className="text-center space-y-10">
                    <div className="h-px bg-black w-full" />
                    <div>
                      <p className="font-bold text-[10px] uppercase">Class Teacher</p>
                      <p className="text-[8px] opacity-40 italic">Seal & Signature</p>
                    </div>
                  </div>
                  <div className="text-center space-y-10 relative">
                    <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 opacity-5">
                       <ShieldCheck className="w-24 h-24 rotate-12" />
                    </div>
                    <div className="h-px bg-black w-full" />
                    <div>
                      <p className="font-bold text-[10px] uppercase">The Principal</p>
                      <p className="text-[10px] font-black uppercase">Institutional Seal</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 inset-x-0 text-center">
                   <p className="text-[9px] uppercase font-black opacity-20 tracking-[0.3em]">
                     OFFICIAL DIGITAL DOSSIER • SECURE ACADEMIC RECORD
                   </p>
                </div>
              </div>
            </div>

            <DialogFooter className="bg-accent/10 p-6 border-t no-print flex sm:flex-row gap-3">
              <Button variant="outline" className="flex-1 gap-2 rounded-xl h-12" onClick={() => setViewingReport(null)}>
                Close Preview
              </Button>
              <Button className="flex-1 gap-2 rounded-xl h-12 shadow-lg" onClick={() => window.print()}>
                <Printer className="w-5 h-5" /> Print Official Bulletin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
            Grade Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter and validate student sequence marks for assigned subjects.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Export Class Bulletin</Button>
          <Button className="gap-2 shadow-lg" onClick={handleSaveMarks} disabled={isSaving}>
            <Save className="w-4 h-4" /> Save Registry
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[200px] h-11 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMEROON_SUBJECTS.map(s => (
                  <SelectItem key={s.name} value={s.name.toLowerCase()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-secondary/10 border-secondary/20 h-11 px-4 text-xs font-bold">Sequence 2</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-accent/30 font-bold uppercase text-[10px]">
              <TableRow>
                <TableHead className="pl-8 py-4">Matricule</TableHead>
                <TableHead>Student Profile</TableHead>
                <TableHead className="text-center">Note / 20</TableHead>
                <TableHead className="text-right pr-8">License Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GRADES_TEACHER.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-8 font-mono font-bold text-primary">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input 
                      disabled={!student.isLicensePaid}
                      defaultValue={student.seq1} 
                      className="w-16 h-9 mx-auto text-center font-bold bg-accent/30 border-none rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    {student.isLicensePaid ? (
                      <Badge variant="outline" className={cn("text-[9px] text-white border-none px-3 py-1", getAppreciation(student.seq1).color)}>
                        {getAppreciation(student.seq1).text}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[9px] font-black uppercase gap-1">
                        <Lock className="w-2.5 h-2.5" /> Suspended
                      </Badge>
                    )}
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
