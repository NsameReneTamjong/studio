
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
    createdAt: { toDate: () => new Date() },
    dob: "15/05/2008",
    gender: "Female",
    region: "Littoral",
    division: "Wouri",
    subDivision: "Douala 1er",
    placeOfBirth: "Douala",
    guardian: "Mr. Robert Thompson",
    guardianPhone: "+237 677 00 11 22",
    address: "Bonapriso, Douala",
    motto: "Discipline - Work - Success"
  }
];

const MOCK_GRADES = [
  { subject: "Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
  { subject: "English Literature", seq1: 8.0, seq2: 13.0, teacher: "Ms. Bennet", status: "Passed", coeff: 3 },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed", coeff: 4 },
  { subject: "History", seq1: 7.0, seq2: 8.5, teacher: "Mr. Tabi", status: "Failed", coeff: 2 },
];

const MOCK_ATTENDANCE = [
  { date: "May 24, 2024", subject: "Mathematics", time: "08:00 AM", status: "Present", teacher: "Prof. Smith" },
  { date: "May 24, 2024", subject: "Physics", time: "10:30 AM", status: "Present", teacher: "Dr. Tesla" },
  { date: "May 23, 2024", subject: "History", time: "01:00 PM", status: "Absent", teacher: "Mr. Tabi" },
  { date: "May 22, 2024", subject: "English", time: "09:00 AM", status: "Present", teacher: "Ms. Bennet" },
  { date: "May 21, 2024", subject: "Chemistry", time: "11:00 AM", status: "Present", teacher: "Dr. White" },
];

const MOCK_ATTENDANCE_HISTORY = [
  { year: "2023 / 2024", term: "Term 1", subject: "Advanced Physics", present: 22, absent: 2, rate: 92 },
  { year: "2023 / 2024", term: "Term 1", subject: "Mathematics", present: 24, absent: 0, rate: 100 },
  { year: "2022 / 2023", term: "Term 3", subject: "Advanced Physics", present: 20, absent: 4, rate: 83 },
  { year: "2022 / 2023", term: "Term 3", subject: "Mathematics", present: 23, absent: 1, rate: 96 },
];

const MOCK_DOCUMENTS = [
  { id: "D1", title: "Official Admission Letter", type: "PDF", size: "1.2 MB", date: "Sept 10, 2023", icon: FileText },
  { id: "D2", title: "Term 1 Fee Receipt", type: "PDF", size: "450 KB", date: "Oct 15, 2023", icon: Receipt },
  { id: "D3", title: "Institutional ID Card Copy", type: "PNG", size: "800 KB", date: "Sept 12, 2023", icon: CreditCard },
];

const MOCK_REPORT_HISTORY = [
  { year: "2023 / 2024", term: "Term 2", average: "16.20", position: "1st / 45", classMaster: "Mr. Abena", isPublished: true },
  { year: "2023 / 2024", term: "Term 1", average: "14.50", position: "3rd / 45", classMaster: "Mr. Abena", isPublished: true },
];

const MOCK_TRANSCRIPT_DATA = {
  "Physics": { f1: ["12.5", "13.0", "14.2"], f2: ["11.0", "12.5", "13.5"], f3: ["14.0", "15.5", "16.0"] },
  "Mathematics": { f1: ["15.0", "16.5", "17.0"], f2: ["14.5", "15.0", "16.0"], f3: ["17.5", "18.0", "17.5"] },
  "English": { f1: ["10.0", "11.5", "12.0"], f2: ["09.5", "10.0", "11.0"], f3: ["12.5", "13.0", "13.5"] },
  "History": { f1: ["08.5", "09.0", "10.5"], f2: ["07.5", "08.0", "09.5"], f3: ["09.0", "10.5", "11.0"] }
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
  const [previewDoc, setPreviewDoc] = useState<{ type: 'report' | 'receipt' | 'id', data?: any } | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isExportingTranscript, setIsExportingTranscript] = useState(false);

  useEffect(() => {
    const found = MOCK_CHILDREN.find(c => c.id === studentId) || MOCK_CHILDREN[0];
    setTimeout(() => {
      setStudent(found);
      setLoading(false);
    }, 500);
  }, [studentId]);

  const isTeacher = currentUser?.role === "TEACHER";
  const isSchoolAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const isParent = currentUser?.role === "PARENT";

  const studentStats = useMemo(() => {
    const totalWeighted = MOCK_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = MOCK_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
    const avg = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;
    
    return {
      average: avg.toFixed(2),
      totalCoeff,
      totalWeighted: totalWeighted.toFixed(2),
      attendance: 94.5,
      position: "4th / 45"
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setIsSendingMessage(true);
    setTimeout(() => {
      setIsSendingMessage(false);
      setIsMessageModalOpen(false);
      setMessageText("");
      toast({ title: "Message Sent" });
    }, 1000);
  };

  const handleDownloadTranscript = () => {
    setIsExportingTranscript(true);
    setTimeout(() => {
      setIsExportingTranscript(false);
      toast({ title: "Transcript Prepared" });
    }, 2000);
  };

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
              <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-2">
                {student.name}
                <Badge className="bg-green-100 text-green-700 uppercase hidden md:inline-flex">ACTIVE</Badge>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">{student.class} • ID: {student.id}</p>
            </div>
          </div>
        </div>
        {!isTeacher && (
          <div className="flex gap-2 w-full sm:w-auto">
            {isParent && (
              <Button variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl" onClick={() => setIsMessageModalOpen(true)}>
                <Mail className="w-4 h-4" /> Contact Teacher
              </Button>
            )}
            <Button className="flex-1 sm:flex-none gap-2 shadow-lg rounded-xl" onClick={() => setPreviewDoc({ type: 'report', data: MOCK_REPORT_HISTORY[0] })}>
              <Printer className="w-4 h-4" /> {t("print")} {t("reportCard")}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid w-full bg-white border shadow-sm h-auto p-1 rounded-xl grid-cols-5 overflow-x-auto no-scrollbar">
          <TabsTrigger value="profile" className="gap-2 py-2 whitespace-nowrap"><User className="w-4 h-4" /> {t("profile")}</TabsTrigger>
          <TabsTrigger value="grades" className="gap-2 py-2 whitespace-nowrap"><Award className="w-4 h-4" /> {t("grades")}</TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-2 whitespace-nowrap"><ClipboardCheck className="w-4 h-4" /> {t("presence")}</TabsTrigger>
          <TabsTrigger value="documents" className="gap-2 py-2 whitespace-nowrap"><FileText className="w-4 h-4" /> {t("documents")}</TabsTrigger>
          <TabsTrigger value="transcript" className="gap-2 py-2 whitespace-nowrap"><FileBadge className="w-4 h-4" /> {t("draftTranscript")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Card className="md:col-span-4 border-none shadow-sm overflow-hidden rounded-3xl">
              <CardHeader className="bg-primary p-6 text-white text-center">
                <Avatar className="h-24 w-24 border-4 border-white/20 mx-auto shadow-xl mb-2">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl font-black uppercase tracking-tight">{student.name}</CardTitle>
                <Badge variant="secondary" className="bg-secondary text-primary border-none text-[8px] font-black uppercase mt-2">Verified Identity</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">National Matricule</p>
                  <p className="font-mono font-bold text-primary">{student.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Status</p>
                  <Badge className="bg-green-100 text-green-700 border-none font-black uppercase text-[9px]">Enrolled & Active</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-8 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl">
                <CardHeader className="border-b bg-accent/5">
                  <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <Fingerprint className="w-4 h-4" /> Personal Registry
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Date of Birth</Label>
                    <p className="font-bold text-primary">{student.dob}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Gender</Label>
                    <p className="font-bold text-primary">{student.gender}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-2xl font-black">Performance Registry</CardTitle>
              <CardDescription className="text-white/60">Verified marks for current evaluation cycle.</CardDescription>
            </CardHeader>
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
                  {MOCK_GRADES.map((g, idx) => {
                    const avg = (g.seq1 + g.seq2) / 2;
                    return (
                      <TableRow key={idx} className="hover:bg-accent/5 border-b last:border-0 h-16">
                        <TableCell className="pl-8 font-black text-primary uppercase text-sm py-4">{g.subject}</TableCell>
                        <TableCell className={cn("text-center font-bold", g.seq1 < 10 ? "text-red-600" : "")}>{g.seq1.toFixed(2)}</TableCell>
                        <TableCell className={cn("text-center font-bold", g.seq2 < 10 ? "text-red-600" : "")}>{g.seq2.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-mono font-bold text-muted-foreground italic">{g.coeff}</TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge className={cn("text-[9px] font-black uppercase border-none px-3", avg >= 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
                            {avg >= 10 ? "Passed" : "Failed"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-green-50 p-6 rounded-3xl flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-green-600 shadow-sm"><CheckCircle2 className="w-6 h-6" /></div>
              <div>
                <p className="text-[10px] font-black uppercase text-green-600">Presence</p>
                <p className="text-2xl font-black text-green-700">94.5%</p>
              </div>
            </Card>
          </div>

          <Card className="border-none shadow-xl overflow-hidden rounded-3xl bg-white">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Presence Ledger</CardTitle>
              <CardDescription className="text-white/60">Chronological record of daily attendance.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black border-b">
                    <TableHead className="pl-8 py-4">Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right pr-8">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ATTENDANCE.map((att, idx) => (
                    <TableRow key={idx} className="hover:bg-accent/5 border-b last:border-0 h-16">
                      <TableCell className="pl-8 font-bold text-xs text-muted-foreground">{att.date}</TableCell>
                      <TableCell className="font-black text-primary uppercase text-sm">{att.subject}</TableCell>
                      <TableCell className="font-mono text-xs font-bold">{att.time}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Badge className={cn("text-[9px] font-black uppercase border-none px-3", att.status === 'Present' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{att.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* ATTENDANCE RECORDS HISTORY */}
          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardHeader className="bg-primary/5 p-8 border-b flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white shadow-xl">
                  <CalendarDays className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-primary uppercase tracking-tight">Attendance Records History</CardTitle>
                  <CardDescription>Verified subject-wise participation analytics across sessions.</CardDescription>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl h-11 gap-2 font-bold bg-white" onClick={() => toast({ title: "History Exported" })}>
                <FileDown className="w-4 h-4 text-primary" /> Export Records
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                    <TableHead className="pl-8 py-4">Academic Year</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Pedagogical Subject</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                    <TableHead className="text-right pr-8">Rate (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ATTENDANCE_HISTORY.map((hist, i) => (
                    <TableRow key={i} className="hover:bg-accent/5 h-16 border-b last:border-0">
                      <TableCell className="pl-8 font-bold text-xs text-muted-foreground">{hist.year}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black uppercase text-primary border-primary/10">{hist.term}</Badge>
                      </TableCell>
                      <TableCell className="font-black text-primary uppercase text-sm">{hist.subject}</TableCell>
                      <TableCell className="text-center font-black text-green-600">{hist.present}</TableCell>
                      <TableCell className="text-center font-black text-red-600">{hist.absent}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="inline-flex flex-col items-end gap-1.5 min-w-[80px]">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-black", hist.rate >= 90 ? "text-green-600" : "text-amber-600")}>
                              {hist.rate}%
                            </span>
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

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_DOCUMENTS.map((doc) => (
              <Card key={doc.id} className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all rounded-3xl">
                <CardHeader className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                      <doc.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black border-primary/10 text-primary">{doc.type}</Badge>
                  </div>
                  <CardTitle className="text-base font-black text-primary uppercase leading-tight line-clamp-2">{doc.title}</CardTitle>
                  <CardDescription className="text-[10px] font-bold mt-1">Issued on: {doc.date}</CardDescription>
                </CardHeader>
                <CardFooter className="bg-accent/10 p-4 border-t">
                   <Button className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-sm" onClick={() => toast({ title: "Download Started" })}>
                     <FileDown className="w-4 h-4" /> {t("download")}
                   </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
        <div className="space-y-1 text-[9px] uppercase font-black text-right">
          <p>République du Cameroun</p>
          <p>Paix - Travail - Patrie</p>
        </div>
      </div>

      <div className="text-center my-10 space-y-2">
        <h1 className="text-4xl font-black uppercase tracking-widest underline underline-offset-8 decoration-double">Academic Transcript</h1>
        <p className="text-sm font-bold opacity-60">Relevé de Notes Provisoire • Valid for Session 2023 / 2024</p>
      </div>

      <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center mb-10">
        <div className="col-span-2">
           <Avatar className="w-28 h-28 border-4 border-white rounded-[2rem] shadow-xl">
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
                  const key = `f${i + 1}`;
                  const data = years[key] || ["---", "---", "---"];
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
