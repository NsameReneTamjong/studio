
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Award, 
  Calendar, 
  ClipboardCheck, 
  BookOpen, 
  User,
  GraduationCap,
  MapPin,
  Clock,
  FileText,
  CreditCard,
  Receipt,
  Download,
  Building2,
  Eye,
  CheckCircle2,
  Printer,
  ChevronRight,
  XCircle,
  History,
  ShieldCheck,
  Mail,
  Info,
  Phone,
  QrCode,
  Loader2,
  AlertCircle,
  X,
  TrendingUp,
  ListChecks,
  Users,
  Send,
  Scale,
  Activity,
  Lock,
  FileBadge,
  FileDown,
  Briefcase,
  Fingerprint,
  Heart,
  CalendarDays,
  Zap
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const MOCK_CHILDREN = [
  {
    id: "GBHS26S001",
    uid: "S1",
    name: "Alice Thompson",
    class: "2nde / Form 5",
    section: "Anglophone Section",
    email: "alice@gbhsdeido.cm",
    status: "active",
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/alice/200/200",
    dob: "15/05/2008",
    gender: "Female",
    guardian: "Mr. Robert Thompson",
    guardianPhone: "+237 677 00 11 22",
    address: "Bonapriso, Douala",
  }
];

const MOCK_GRADES = [
  { subject: "Advanced Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
];

const MOCK_ATTENDANCE_HISTORY = [
  { year: "2023 / 2024", term: "Term 1", subject: "Advanced Physics", present: 22, absent: 2, rate: 92 },
  { year: "2023 / 2024", term: "Term 1", subject: "Mathematics", present: 24, absent: 0, rate: 100 },
];

const MOCK_TRANSCRIPT_DATA = {
  "Advanced Physics": { f1: ["12.5", "13.0", "14.2"], f2: ["11.0", "12.5", "13.5"], f3: ["14.0", "15.5", "16.0"] },
  "Mathematics": { f1: ["15.0", "16.5", "17.0"], f2: ["14.5", "15.0", "16.0"], f3: ["17.5", "18.0", "17.5"] },
};

export default function StudentDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user: currentUser, platformSettings } = useAuth();
  const { toast } = useToast();
  const { t, language } = useI18n();
  const studentId = searchParams.get("id"); 
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const found = MOCK_CHILDREN.find(c => c.id === studentId) || MOCK_CHILDREN[0];
    setTimeout(() => {
      setStudent(found);
      setLoading(false);
    }, 500);
  }, [studentId]);

  const isTeacher = currentUser?.role === "TEACHER";

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
      <p className="text-muted-foreground italic">Fetching academic records...</p>
    </div>
  );

  if (!student) return null;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary shadow-lg shrink-0">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">{student.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-2 uppercase tracking-tight">
                {student.name}
                <Badge className="bg-green-100 text-green-700 uppercase hidden md:inline-flex">ACTIVE</Badge>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">{student.class} • ID: {student.id}</p>
            </div>
          </div>
        </div>
        {!isTeacher && (
          <Button className="flex-1 sm:flex-none gap-2 shadow-lg rounded-xl h-12 px-8 font-bold" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> {t("print")} {t("reportCard")}
          </Button>
        )}
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full bg-white border shadow-sm h-auto p-1 rounded-xl grid-cols-5 overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="gap-2 py-2 whitespace-nowrap"><User className="w-4 h-4" /> {t("profile")}</TabsTrigger>
          <TabsTrigger value="grades" className="gap-2 py-2 whitespace-nowrap"><Award className="w-4 h-4" /> {t("grades")}</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-2 whitespace-nowrap"><ClipboardCheck className="w-4 h-4" /> {t("presence")}</TabsTrigger>
          <TabsTrigger value="documents" className="gap-2 py-2 whitespace-nowrap"><FileText className="w-4 h-4" /> {t("documents")}</TabsTrigger>
          <TabsTrigger value="transcript" className="gap-2 py-2 whitespace-nowrap"><FileBadge className="w-4 h-4" /> {t("transcript")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-primary p-8 text-white text-center">
              <Avatar className="h-24 w-24 border-4 border-white/20 mx-auto shadow-xl mb-4">
                <AvatarImage src={student.avatar} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-black">{student.name}</CardTitle>
              <Badge variant="secondary" className="bg-secondary text-primary border-none font-black mt-2">ID: {student.id}</Badge>
            </CardHeader>
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="space-y-1"><p className="text-[10px] font-black uppercase opacity-40">Date of Birth</p><p className="font-bold">{student.dob}</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black uppercase opacity-40">Section</p><p className="font-bold">{student.section}</p></div>
               </div>
               <div className="space-y-4">
                  <div className="space-y-1"><p className="text-[10px] font-black uppercase opacity-40">Guardian</p><p className="font-bold">{student.guardian}</p></div>
                  <div className="space-y-1"><p className="text-[10px] font-black uppercase opacity-40">Contact</p><p className="font-bold text-secondary">{student.guardianPhone}</p></div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="mt-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-primary p-8 text-white"><CardTitle className="text-xl font-black uppercase">Academic Performance Ledger</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                    <TableHead className="pl-8 py-4">Subject</TableHead>
                    <TableHead className="text-center">Seq 1</TableHead>
                    <TableHead className="text-center">Seq 2</TableHead>
                    <TableHead className="text-center">Coeff</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GRADES.map((g, idx) => (
                    <TableRow key={idx} className="h-16 border-b last:border-0 hover:bg-accent/5">
                      <TableCell className="pl-8 font-black uppercase text-xs">{g.subject}</TableCell>
                      <TableCell className="text-center font-bold">{g.seq1.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-bold">{g.seq2.toFixed(2)}</TableCell>
                      <TableCell className="text-center font-mono font-bold italic">{g.coeff}</TableCell>
                      <TableCell className="text-right pr-8"><Badge className="bg-green-100 text-green-700 font-black">PASSED</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-8">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white shadow-xl"><CalendarDays className="w-8 h-8 text-secondary" /></div>
                <div><CardTitle className="text-xl font-black text-primary uppercase">Attendance History</CardTitle><CardDescription>Session participation breakdown across all subjects.</CardDescription></div>
              </div>
              <Button variant="outline" className="rounded-xl h-11 gap-2 font-bold bg-white" onClick={() => toast({ title: "History Exported" })}><FileDown className="w-4 h-4 text-primary" /> Export Records</Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[10px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Year</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-right pr-8">Rate (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ATTENDANCE_HISTORY.map((hist, i) => (
                    <TableRow key={i} className="hover:bg-accent/5 h-16 border-b last:border-0">
                      <TableCell className="pl-8 font-bold text-xs text-muted-foreground">{hist.year}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] font-black uppercase text-primary">{hist.term}</Badge></TableCell>
                      <TableCell className="font-black text-primary uppercase text-sm">{hist.subject}</TableCell>
                      <TableCell className="text-center font-black text-green-600">{hist.present}</TableCell>
                      <TableCell className="text-center font-black text-red-600">{hist.absent}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="inline-flex flex-col items-end gap-1.5 min-w-[80px]">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-black", hist.rate >= 90 ? "text-green-600" : "text-amber-600")}>{hist.rate}%</span>
                            {hist.rate >= 95 && <Zap className="w-3 h-3 text-secondary fill-current" />}
                          </div>
                          <div className="w-20 h-1.5 bg-accent rounded-full overflow-hidden">
                            <div className={cn("h-full transition-all duration-1000", hist.rate >= 90 ? "bg-green-500" : "bg-amber-500")} style={{ width: `${hist.rate}%` }} />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white p-8">
            <div className="overflow-x-auto scrollbar-thin">
              <LandscapeTranscript student={student} platform={platformSettings} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LandscapeTranscript({ student, platform }: { student: any, platform: any }) {
  const currentGrade = student?.class || "2nde / Form 5";
  const classIndex = CLASSES.indexOf(currentGrade);
  const visibleClasses = CLASSES.slice(0, classIndex + 1);

  return (
    <div className="bg-white p-8 border shadow-sm font-serif text-black min-w-[1100px]">
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
        <div className="space-y-1 text-[9px] uppercase font-black text-right"><p>République du Cameroun</p><p>Paix - Travail - Patrie</p></div>
      </div>

      <div className="text-center my-10 space-y-2"><h1 className="text-4xl font-black uppercase tracking-widest underline underline-offset-8 decoration-double">Academic Transcript</h1><p className="text-sm font-bold opacity-60">Official Record • Valid for Session 2023 / 2024</p></div>

      <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center mb-10">
        <div className="col-span-2 text-center">
           <Avatar className="w-28 h-28 border-4 border-white rounded-[2rem] shadow-xl mx-auto">
              <AvatarImage src={student?.avatar} />
              <AvatarFallback className="text-3xl font-black">{student?.name?.charAt(0)}</AvatarFallback>
           </Avatar>
        </div>
        <div className="col-span-9 grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
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
  )
}
