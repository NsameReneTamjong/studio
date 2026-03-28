
"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
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
  Save,
  Search,
  Users,
  Info,
  ArrowLeft,
  XCircle,
  FileBadge,
  Download,
  Activity,
  Clock,
  Check,
  Printer,
  FileDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology", "History", "Geography"];
const ACADEMIC_YEARS = ["2023 / 2024", "2022 / 2023", "2021 / 2022"];
const TERMS = ["Term 1", "Term 2", "Term 3"];

const MOCK_STUDENTS_GRADES = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 16.0 },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 18.0, seq2: 17.5 },
];

const MOCK_PERSONAL_GRADES = [
  { subject: "Advanced Physics", seq1: 14.5, seq2: 16.0, coeff: 4, teacher: "Dr. Tesla", status: "Passed" },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, coeff: 5, teacher: "Prof. Smith", status: "Passed" },
];

const MOCK_TRANSCRIPT_DATA = {
  "Advanced Physics": { f1: ["12.5", "13.0", "14.2"], f2: ["11.0", "12.5", "13.5"], f3: ["14.0", "15.5", "16.0"] },
  "Mathematics": { f1: ["15.0", "16.5", "17.0"], f2: ["14.5", "15.0", "16.0"], f3: ["17.5", "18.0", "17.5"] },
};

export default function GradeBookPage() {
  const { user, platformSettings } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [activeSequence, setActiveSequence] = useState<"seq1" | "seq2">("seq1");
  const [grades, setGrades] = useState(MOCK_STUDENTS_GRADES);

  const isTeacher = user?.role === "TEACHER";
  const isStudent = user?.role === "STUDENT";
  const isAdmin = ["SCHOOL_ADMIN", "SUB_ADMIN"].includes(user?.role || "");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    if (isStudent) {
      const totalWeighted = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
      const totalCoeff = MOCK_PERSONAL_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
      return { average: (totalWeighted / (totalCoeff || 1)).toFixed(2), passRate: "100" };
    }
    const totalAvg = grades.reduce((acc, curr) => acc + (curr.seq1 + curr.seq2) / 2, 0) / (grades.length || 1);
    const passedCount = grades.filter(g => (g.seq1 + g.seq2) / 2 >= 10).length;
    return { average: totalAvg.toFixed(2), passRate: ((passedCount / (grades.length || 1)) * 100).toFixed(0) };
  }, [grades, isStudent]);

  if (isLoading) return <LoadingState message="Fetching pedagogical records..." />;

  if (isStudent) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
                <div className="p-2 bg-primary rounded-xl shadow-lg"><Award className="w-6 h-6 text-secondary" /></div>
                Academic Results
              </h1>
            </div>
          </div>
          <Button onClick={() => toast({ title: "Bulletin Exported" })} className="h-12 px-8 rounded-2xl shadow-xl font-black uppercase text-[10px] gap-3">
            <Printer className="w-4 h-4" /> Download Official Bulletin
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Term Average</p>
            <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
          </Card>
          <Card className="border-none shadow-sm bg-secondary text-primary p-6 rounded-3xl">
            <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Promotion Status</p>
            <div className="text-xl font-black flex items-center gap-2">
              {parseFloat(stats.average) >= 10 ? <><CheckCircle2 className="w-6 h-6" /> ELIGIBLE</> : <><XCircle className="w-6 h-6" /> AT RISK</>}
            </div>
          </Card>
          <Card className="border-none shadow-sm bg-white border p-6 rounded-3xl">
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Identity Status</p>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary" /> VERIFIED
            </div>
          </Card>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
            <TabsTrigger value="current" className="gap-2 py-3 rounded-xl transition-all font-bold">Current Term</TabsTrigger>
            <TabsTrigger value="transcript" className="gap-2 py-3 rounded-xl transition-all font-bold">Transcript</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white"><CardTitle className="text-xl font-black uppercase">Sequence Registry</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader className="bg-accent/10 font-black text-[9px] uppercase">
                    <TableRow>
                      <TableHead className="pl-8 py-4">Subject</TableHead>
                      <TableHead className="text-center">Coeff</TableHead>
                      <TableHead className="text-center">Seq 1</TableHead>
                      <TableHead className="text-center">Seq 2</TableHead>
                      <TableHead className="text-center">Moy/20</TableHead>
                      <TableHead className="text-right pr-8">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PERSONAL_GRADES.map((g, idx) => (
                      <TableRow key={idx} className="h-16 border-b last:border-0 hover:bg-accent/5">
                        <TableCell className="pl-8 font-black uppercase text-xs">{g.subject}</TableCell>
                        <TableCell className="text-center font-bold">{g.coeff}</TableCell>
                        <TableCell className="text-center font-bold">{g.seq1}</TableCell>
                        <TableCell className="text-center font-bold">{g.seq2}</TableCell>
                        <TableCell className="text-center font-black text-primary">{(g.seq1 + g.seq2)/2}</TableCell>
                        <TableCell className="text-right pr-8"><Badge className="bg-green-100 text-green-700">PASSED</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white p-8">
              <div className="overflow-x-auto scrollbar-thin">
                <TranscriptPreview student={user} platform={platformSettings} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary rounded-xl shadow-lg"><Award className="w-6 h-6 text-secondary" /></div>
          <div><h1 className="text-2xl md:text-3xl font-bold text-primary font-headline uppercase tracking-tight">Academic Gradebook</h1></div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-12 px-6 font-bold" onClick={() => toast({ title: "Registry Exported" })}><FileDown className="w-4 h-4 mr-2" /> PDF</Button>
          {isTeacher && <Button className="rounded-xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-lg" onClick={() => toast({ title: "Committed" })}><Save className="w-4 h-4 mr-2" /> Save Sequence</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white p-6 rounded-3xl">
          <p className="text-[10px] font-black opacity-60 uppercase mb-2">Group Average</p>
          <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary p-6 rounded-3xl">
          <p className="text-[10px] font-black opacity-60 uppercase mb-2">Pass Rate</p>
          <div className="text-3xl font-black">{stats.passRate}%</div>
        </Card>
        <Card className="border-none shadow-sm bg-white border p-6 rounded-3xl">
          <p className="text-[10px] font-black opacity-60 uppercase mb-2 text-muted-foreground">Registry Status</p>
          <div className="text-xl font-black flex items-center gap-2 text-primary"><ShieldCheck className="w-5 h-5 text-secondary" /> SECURE</div>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Class Level</Label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Subject</Label>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="h-11 bg-primary/5 border-primary/10 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex-1 space-y-2 w-full">
          <Label className="text-[9px] font-black uppercase text-primary ml-1">Sequence</Label>
          <Select value={activeSequence} onValueChange={(v: any) => setActiveSequence(v)}>
            <SelectTrigger className="h-11 bg-secondary/20 border-none rounded-xl font-black text-primary"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="seq1">Sequence 1</SelectItem><SelectItem value="seq2">Sequence 2</SelectItem></SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-8 text-white">
          <CardTitle className="text-xl font-black uppercase">Gradebook: {selectedSubject}</CardTitle>
          <CardDescription className="text-white/60">Filling Cycle for {activeSequence}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10 font-black text-[9px] uppercase border-b">
              <TableRow>
                <TableHead className="pl-8 py-4">Student Identity</TableHead>
                <TableHead className="text-center">Seq 1</TableHead>
                <TableHead className="text-center">Seq 2</TableHead>
                <TableHead className="text-center">Term Moy</TableHead>
                <TableHead className="text-right pr-8">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map(s => (
                <TableRow key={s.uid} className="h-16 border-b last:border-0 hover:bg-accent/5">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                      <span className="font-bold text-xs uppercase">{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input className="w-16 mx-auto h-9 text-center font-black border-primary/10" defaultValue={s.seq1} disabled={!isTeacher || activeSequence !== 'seq1'} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Input className="w-16 mx-auto h-9 text-center font-black border-primary/10" defaultValue={s.seq2} disabled={!isTeacher || activeSequence !== 'seq2'} />
                  </TableCell>
                  <TableCell className="text-center font-black text-primary">{(s.seq1 + s.seq2)/2}</TableCell>
                  <TableCell className="text-right pr-8"><Badge className="bg-green-100 text-green-700">PASS</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function TranscriptPreview({ student, platform }: { student: any, platform: any }) {
  const currentGrade = student?.class || "2nde / Form 5";
  const classIndex = CLASSES.indexOf(currentGrade);
  const visibleClasses = CLASSES.slice(0, classIndex + 1);

  return (
    <div className="bg-white p-8 md:p-12 border shadow-sm relative overflow-hidden font-serif text-black min-w-[1100px]">
      <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
        <div className="space-y-1 text-[9px] uppercase font-black text-left">
          <p>Republic of Cameroon</p>
          <p>Peace - Work - Fatherland</p>
          <div className="h-px bg-black w-8 my-1" />
          <p>Ministry of Secondary Education</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <img src={platform.logo} alt="Logo" className="w-14 h-14 object-contain" />
          <p className="text-[9px] font-black uppercase text-primary tracking-tighter">Verified Node Record</p>
        </div>
        <div className="space-y-1 text-[9px] uppercase font-black text-right">
          <p>République du Cameroun</p>
          <p>Paix - Travail - Patrie</p>
        </div>
      </div>

      <div className="text-center my-10 space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-widest underline underline-offset-8 decoration-double">Academic Transcript</h1>
        <p className="text-sm font-bold opacity-60">Session 2023 / 2024</p>
      </div>

      <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center mb-10">
        <div className="col-span-2">
           <Avatar className="w-28 h-28 border-4 border-white rounded-[2rem] shadow-xl mx-auto">
              <AvatarImage src={student?.avatar} />
              <AvatarFallback className="text-3xl font-black">{student?.name?.charAt(0)}</AvatarFallback>
           </Avatar>
        </div>
        <div className="col-span-10 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Identity:</span><span className="font-black uppercase">{student?.name}</span></div>
          <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[9px]">Matricule:</span><span className="font-mono font-bold text-primary">{student?.id}</span></div>
        </div>
      </div>

      <div className="border-2 border-black overflow-hidden rounded-sm">
        <Table className="border-collapse">
          <TableHeader className="bg-black/5">
            <TableRow className="border-b-2 border-black h-12">
              <TableHead rowSpan={2} className="border-r-2 border-black font-black text-black uppercase text-[10px] text-center w-48">Subject</TableHead>
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
                  const data = years[`f${i + 1}`] || ["---", "---", "---"];
                  return (
                    <React.Fragment key={i}>
                      <TableCell className="border-r border-black text-center text-[10px] font-mono">{data[0]}</TableCell>
                      <TableCell className="border-r border-black text-center text-[10px] font-mono">{data[1]}</TableCell>
                      <TableCell className={cn("border-r-2 border-black text-center text-[10px] font-mono bg-accent/5", i === visibleClasses.length - 1 ? "border-r-0" : "")}>{data[2]}</TableCell>
                    </React.Fragment>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
