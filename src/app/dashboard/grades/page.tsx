
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
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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

const MOCK_STUDENT_CURRENT_GRADES = [
  { subject: "Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed" },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed" },
  { subject: "English Literature", seq1: 12.0, seq2: 13.0, teacher: "Ms. Bennet", status: "Passed" },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed" },
];

const MOCK_REPORT_HISTORY = [
  { year: "2023", term: "Term 2", average: "16.20", position: "1st / 45", classMaster: "Mr. Abena", isPublished: true },
  { year: "2023", term: "Term 1", average: "14.50", position: "3rd / 45", classMaster: "Mr. Abena", isPublished: true },
];

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSequence, setSelectedSequence] = useState("seq1");
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [previewDoc, setPreviewDoc] = useState<any>(null);

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

        {/* Current Term Marks */}
        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Current Term Evaluations</CardTitle>
                  <CardDescription className="text-white/60">Sequence 1 & 2 • Academic Year 2023/2024</CardDescription>
                </div>
              </div>
              <Badge className="bg-secondary text-primary border-none font-black px-4 h-8">ACTIVE TERM</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/10 border-b border-accent/20">
                  <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">{t("subjects")}</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Seq 1</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Seq 2</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">{t("teacher")}</TableHead>
                  <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">{t("status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STUDENT_CURRENT_GRADES.map((row, i) => (
                  <TableRow key={i} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                    <TableCell className="pl-8 py-4 font-bold text-primary">{row.subject}</TableCell>
                    <TableCell className="text-center font-black text-lg">{row.seq1.toFixed(2)}</TableCell>
                    <TableCell className="text-center font-black text-lg">{row.seq2.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                        <User className="w-3.5 h-3.5 text-primary/40" />
                        {row.teacher}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 border-none",
                        row.status === 'Passed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Previous Results History */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <History className="w-5 h-5" /> Results History
          </h2>
          <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30 uppercase text-[10px] font-black tracking-widest">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Academic Period</TableHead>
                    <TableHead className="text-center">Term Average</TableHead>
                    <TableHead className="text-center">Class Position</TableHead>
                    <TableHead>Class Master</TableHead>
                    <TableHead className="text-right pr-8">Dossier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_REPORT_HISTORY.map((hist, i) => (
                    <TableRow key={i} className="hover:bg-accent/5">
                      <TableCell className="pl-8 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">{hist.term}</span>
                          <span className="text-[10px] text-muted-foreground font-black uppercase">Year {hist.year}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black text-primary text-lg">{hist.average} / 20</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-bold text-xs border-primary/10">{hist.position}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground italic">{hist.classMaster}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[10px] font-black uppercase gap-2 hover:bg-primary hover:text-white"
                          onClick={() => setPreviewDoc({ type: 'report', data: hist })}
                        >
                          <Eye className="w-3.5 h-3.5" /> View Bulletin
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Report Card Modal */}
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
            <DialogHeader className="p-6 bg-primary text-white no-print">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <FileText className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black">Official Report Card</DialogTitle>
                    <DialogDescription className="text-white/70">High-fidelity institutional evaluation record.</DialogDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(null)} className="text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </DialogHeader>

            <div className="bg-muted p-4 md:p-8 print:p-0 print:bg-white">
              <div className="bg-white p-6 md:p-10 shadow-sm border border-border min-h-[700px] flex flex-col space-y-6 font-serif text-black relative print:shadow-none print:border-none">
                 <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                    <div className="space-y-1 text-[9px] uppercase font-bold">
                      <p>Republic of Cameroon</p>
                      <p>Peace - Work - Fatherland</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Ministry of Secondary Education</p>
                      <p>{user?.school?.name || "Lycée de Joss"}</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center p-2 border-2 border-primary/20">
                         <img src={user?.school?.logo} alt="Logo" className="w-12 h-12 object-contain" />
                      </div>
                    </div>
                    <div className="space-y-1 text-[9px] uppercase font-bold">
                      <p>République du Cameroun</p>
                      <p>Paix - Travail - Patrie</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Min. des Enseignements Secondaires</p>
                      <p>Littoral</p>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h2 className="text-xl md:text-2xl font-black uppercase underline tracking-tighter">
                      REPORT CARD / BULLETIN DE NOTES
                    </h2>
                    <p className="font-bold text-sm italic">Academic Year: {previewDoc?.data?.year || '2023/24'}</p>
                 </div>

                 <div className="grid grid-cols-12 gap-6 bg-accent/10 p-4 border border-accent rounded-lg items-center">
                    <div className="col-span-3">
                       <Avatar className="w-24 h-24 border-2 border-black/10 rounded bg-white overflow-hidden shadow-inner">
                          <AvatarImage src={user?.avatar} className="object-cover" />
                          <AvatarFallback className="text-3xl font-black">{user?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="col-span-9 space-y-2">
                       <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <span className="font-bold uppercase opacity-60">{t("fullName")}:</span>
                          <span className="font-black uppercase">{user?.name}</span>
                          <span className="font-bold uppercase opacity-60">{t("matricule")}:</span>
                          <span className="font-mono font-bold text-primary">{user?.id}</span>
                          <span className="font-bold uppercase opacity-60">Grade:</span>
                          <span className="font-bold">2nde / Form 5</span>
                       </div>
                    </div>
                 </div>

                 <Table className="border border-black">
                    <TableHeader className="bg-black/5">
                      <TableRow className="border-black">
                        <TableHead className="text-[10px] uppercase font-bold text-black border-r border-black">{t("subjects")}</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Coeff</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Moy/20</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-bold text-black">Appreciation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_STUDENT_CURRENT_GRADES.map((g: any, i: number) => (
                        <TableRow key={i} className="border-black">
                          <TableCell className="font-bold py-1.5 border-r border-black text-[11px]">{g.subject}</TableCell>
                          <TableCell className="text-center py-1.5 border-r border-black font-black">4</TableCell>
                          <TableCell className="text-center py-1.5 border-r border-black font-black text-primary">{((g.seq1+g.seq2)/2).toFixed(2)}</TableCell>
                          <TableCell className="text-right py-1.5 text-[10px] uppercase font-medium italic">{getAppreciation((g.seq1+g.seq2)/2).text}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="border-black bg-black/5 font-bold">
                         <TableCell className="border-r border-black text-right uppercase text-[10px]" colSpan={2}>General Average</TableCell>
                         <TableCell className="text-center border-r border-black text-lg font-black text-primary" colSpan={1}>
                           {previewDoc?.data?.average || '15.45'}
                         </TableCell>
                         <TableCell className="text-right uppercase text-[10px]" colSpan={1}>
                           Rank: {previewDoc?.data?.position || '---'}
                         </TableCell>
                      </TableRow>
                    </TableBody>
                 </Table>

                 <div className="mt-auto grid grid-cols-2 gap-20 pt-12 items-end text-center">
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold">The Class Council</p>
                       <div className="h-px bg-black w-full" />
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold">The Principal</p>
                       <div className="h-px bg-black w-full" />
                       <Badge variant="outline" className="border-black text-[8px] font-bold uppercase tracking-widest">Official Seal</Badge>
                    </div>
                 </div>
              </div>
            </div>

            <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print">
              <Button variant="outline" onClick={() => window.print()} className="gap-2 rounded-xl">
                <Printer className="w-4 h-4" /> Print Bulletin
              </Button>
              <Button onClick={() => setPreviewDoc(null)} className="rounded-xl h-10 px-8">Close Preview</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
