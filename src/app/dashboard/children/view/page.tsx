
"use client";

import { useState, useMemo, useEffect } from "react";
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
  Scale
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MOCK_CHILDREN = [
  {
    id: "S001",
    uid: "S1",
    name: "Alice Thompson",
    class: "2nde / Form 5",
    section: "A",
    email: "alice@gbhsdeido.cm",
    status: "active",
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/alice/200/200",
    createdAt: { toDate: () => new Date() },
    dob: "15/05/2008",
    guardian: "Mr. Robert Thompson",
    guardianPhone: "+237 677 00 11 22",
    address: "Rue de Deido, BP 123",
    motto: "Discipline - Work - Success"
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

const getConduct = (attendanceRate: number) => {
  if (attendanceRate >= 98) return "Excellence";
  if (attendanceRate >= 90) return "Very Good";
  if (attendanceRate >= 80) return "Good";
  if (attendanceRate >= 65) return "Weak";
  return "Very Weak";
};

const MOCK_GRADES = [
  { subject: "Physics", seq1: 14.5, seq2: 16.0, teacher: "Dr. Tesla", status: "Passed", coeff: 4 },
  { subject: "Mathematics", seq1: 18.0, seq2: 17.5, teacher: "Prof. Smith", status: "Passed", coeff: 5 },
  { subject: "English Literature", seq1: 12.0, seq2: 13.0, teacher: "Ms. Bennet", status: "Passed", coeff: 3 },
  { subject: "Chemistry", seq1: 10.5, seq2: 11.5, teacher: "Dr. White", status: "Passed", coeff: 4 },
];

const MOCK_REPORT_HISTORY = [
  { year: "2023", term: "Term 2", average: "16.20", position: "1st / 45", classMaster: "Mr. Abena", isPublished: true },
  { year: "2023", term: "Term 1", average: "14.50", position: "3rd / 45", classMaster: "Mr. Abena", isPublished: true },
];

const MOCK_SCHEDULE = {
  Monday: [
    { time: "08:00 - 10:00", subject: "Mathematics", room: "Room 101", teacher: "Prof. Smith" },
    { time: "10:30 - 12:30", subject: "Physics", room: "Lab A", teacher: "Dr. Tesla" },
  ],
  Tuesday: [
    { time: "08:00 - 10:00", subject: "Chemistry", room: "Lab C", teacher: "Dr. White" },
    { time: "13:00 - 15:00", subject: "History", room: "Room 204", teacher: "Mr. Tabi" },
  ],
  Wednesday: [
    { time: "08:00 - 10:00", subject: "Mathematics", room: "Room 101", teacher: "Prof. Smith" },
    { time: "10:30 - 12:30", subject: "Biology", room: "Lab B", teacher: "Dr. Fon" },
  ],
  Thursday: [
    { time: "08:00 - 10:00", subject: "English", room: "Room 302", teacher: "Ms. Bennet" },
    { time: "13:00 - 15:00", subject: "Geography", room: "Room 201", teacher: "Mr. Abena" },
  ],
  Friday: [
    { time: "08:00 - 10:00", subject: "Physics", room: "Lab A", teacher: "Dr. Tesla" },
    { time: "10:30 - 12:30", subject: "Civics", room: "Hall B", teacher: "Mme. Njoh" },
  ],
};

const MOCK_TODAY_ATTENDANCE = [
  { subject: "Mathematics", time: "08:00 AM", status: "Present", color: "text-green-600" },
  { subject: "Physics", time: "10:30 AM", status: "Present", color: "text-green-600" },
  { subject: "English", time: "01:00 PM", status: "Upcoming", color: "text-amber-600" },
];

const MOCK_SUBJECT_RECORDS = [
  { subject: "Mathematics", present: 22, absent: 2, teacher: "Prof. Sarah Smith" },
  { subject: "Advanced Physics", present: 18, absent: 6, teacher: "Dr. Aris Tesla" },
  { subject: "English Literature", present: 24, absent: 0, teacher: "Ms. Bennet" },
  { subject: "History", present: 15, absent: 9, teacher: "Mr. Tabi" },
];

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

  useEffect(() => {
    const found = MOCK_CHILDREN.find(c => c.id === studentId) || MOCK_CHILDREN[0];
    setTimeout(() => {
      setStudent(found);
      setLoading(false);
    }, 500);
  }, [studentId]);

  const studentStats = useMemo(() => {
    const totalWeighted = MOCK_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = MOCK_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
    const avg = totalCoeff > 0 ? totalWeighted / totalCoeff : 0;
    return {
      average: avg.toFixed(2),
      totalCoeff,
      totalWeighted: totalWeighted.toFixed(2),
      attendance: 94.5,
      position: "4th / 45",
      classAvg: "12.45",
      highestAvg: "18.20",
      lowestAvg: "06.15"
    };
  }, []);

  const handleDownload = (docName: string) => {
    toast({
      title: t("download") + "...",
      description: `${docName} is being prepared for download.`,
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    setIsSendingMessage(true);
    setTimeout(() => {
      setIsSendingMessage(false);
      setIsMessageModalOpen(false);
      setMessageText("");
      toast({
        title: t("messageSent"),
        description: t("messageSentDesc"),
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
        <p className="text-muted-foreground italic">Fetching academic records...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="space-y-6">
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
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase hidden md:inline-flex">ACTIVE</Badge>
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">{student.class} • ID: {student.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none gap-2" onClick={() => setIsMessageModalOpen(true)}>
            <Mail className="w-4 h-4" /> {language === 'en' ? 'Contact Teacher' : 'Contacter Enseignant'}
          </Button>
          <Button className="flex-1 sm:flex-none gap-2 shadow-lg" onClick={() => setPreviewDoc({ type: 'report' })}>
            <Printer className="w-4 h-4" /> {t("print")} {t("reportCard")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("termAverage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{studentStats.average} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Class Position</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{studentStats.position}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-accent text-primary border border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Conduct Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> {getConduct(studentStats.attendance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-white border shadow-sm h-auto p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-2 py-2">
            <User className="w-4 h-4" /> {t("profile")}
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-2 py-2">
            <Award className="w-4 h-4" /> {t("grades")}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2 py-2">
            <Calendar className="w-4 h-4" /> {t("schedule")}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-2">
            <ClipboardCheck className="w-4 h-4" /> {t("presence")}
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2 py-2">
            <FileText className="w-4 h-4" /> {t("documents")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> {t("personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t("fullName")}</p>
                    <p className="font-bold text-lg">{student.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t("matricule")}</p>
                    <p className="font-mono font-bold text-lg text-primary">{student.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{t("email")}</p>
                    <p className="font-medium text-primary flex items-center gap-2"><Mail className="w-4 h-4"/> {student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{language === 'en' ? "Grade" : "Niveau"}</p>
                    <p className="font-bold">{student.class}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary/90 text-white">
              <CardHeader>
                <CardTitle className="text-white">{language === 'en' ? "Institutional Status" : "Statut Institutionnel"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">{t("status")}</span>
                  <Badge className="bg-secondary text-primary border-none uppercase">{student.status || 'Active'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">{language === 'en' ? "Join Date" : "Date d'Entrée"}</span>
                  <span className="font-bold text-sm">Oct 12, 2023</span>
                </div>
                <div className="pt-6 border-t border-white/10 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-white/20 mb-2" />
                  <p className="text-[10px] font-black uppercase font-bold tracking-widest opacity-40">Digital ID Verified</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6 space-y-8">
          {/* CURRENT TERM SECTION */}
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-primary p-8 text-white">
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black">Current Term Performance</CardTitle>
                    <CardDescription className="text-white/60">Verified marks for the active evaluation cycle.</CardDescription>
                  </div>
                </div>
                <Button onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2 bg-secondary text-primary shadow-lg border-none hover:bg-secondary/90 hidden sm:flex">
                  <Eye className="w-4 h-4" /> {t("officialBulletin")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[650px]">
                <TableHeader>
                  <TableRow className="bg-accent/10 border-b border-accent/20">
                    <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">{t("subjects")}</TableHead>
                    <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Seq 1</TableHead>
                    <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Seq 2</TableHead>
                    <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Coeff</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">{t("teacher")}</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GRADES.map((grade: any, idx: number) => {
                    const avg = (grade.seq1 + grade.seq2) / 2;
                    return (
                      <TableRow key={idx} className="hover:bg-accent/5 border-b border-accent/10">
                        <TableCell className="font-bold pl-8 py-4 text-primary uppercase">{grade.subject}</TableCell>
                        <TableCell className="text-center font-black text-lg">{grade.seq1.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-black text-lg">{grade.seq2.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-bold text-muted-foreground italic">{grade.coeff}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <User className="w-3.5 h-3.5 text-primary/40" />
                            {grade.teacher}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <Badge className={cn(
                            "text-[9px] font-black uppercase px-3 border-none",
                            grade.status === 'Passed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {grade.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-primary/5 p-6 flex justify-between items-center border-t">
               <div className="text-xs font-bold text-primary italic leading-tight">
                  <p>{language === 'en' ? "Calculated on school coefficients." : "Calculé sur les coefficients scolaires."}</p>
                  <p className="text-secondary">{language === 'en' ? "Discipline Grade:" : "Note de conduite:"} {getConduct(studentStats.attendance)}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-black text-muted-foreground">{t("termAverage")}</p>
                  <p className="text-2xl font-black text-primary">{studentStats.average} / 20</p>
               </div>
            </CardFooter>
          </Card>

          {/* HISTORY SECTION */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <History className="w-5 h-5" /> Previous Terms History
            </h2>
            <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
              <CardContent className="p-0 overflow-x-auto">
                <Table className="min-w-[650px]">
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
        </TabsContent>

        {/* ... (other TabsContents remain same) */}
        <TabsContent value="schedule" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(MOCK_SCHEDULE).map(([day, slots]) => (
              <div key={day} className="space-y-3">
                <h3 className="font-black text-xs uppercase text-primary border-b pb-2 tracking-widest">{day}</h3>
                <div className="space-y-2">
                  {slots.map((slot, i) => (
                    <Card key={i} className="border-none shadow-sm bg-white hover:ring-1 hover:ring-primary/20 transition-all">
                      <CardHeader className="p-3 pb-1">
                        <Badge variant="outline" className="w-fit text-[8px] font-bold py-0 h-4 border-primary/10">{slot.time}</Badge>
                        <CardTitle className="text-xs font-black text-primary mt-1">{slot.subject}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="flex flex-col gap-1 text-[9px] text-muted-foreground font-bold">
                          <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {slot.room}</span>
                          <span className="flex items-center gap-1"><User className="w-2.5 h-2.5" /> {slot.teacher}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 border-none shadow-sm bg-blue-50 h-fit">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{language === 'en' ? "Aggregate Presence" : "Présence Globale"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-black text-blue-700">94.5%</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                    <span>Target Met</span>
                    <span>Yes</span>
                  </div>
                  <div className="h-1.5 w-full bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600" style={{ width: '94.5%' }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                  <TrendingUp className="w-4 h-4" /> +2% from last term
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              {/* Today's Live Presence */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-black uppercase text-primary flex items-center gap-2">
                      <ListChecks className="w-4 h-4" /> {t("todayPresence")}
                    </CardTitle>
                    <CardDescription>Live session status for {student.name}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-accent/50 text-primary border-none text-[10px] font-black">
                    {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-accent/10">
                      <TableRow className="text-[10px] font-black uppercase">
                        <TableHead className="pl-6">{t("subjects")}</TableHead>
                        <TableHead>Time Window</TableHead>
                        <TableHead className="text-right pr-6">{t("status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_TODAY_ATTENDANCE.map((att, i) => (
                        <TableRow key={i}>
                          <TableCell className="pl-6 py-3 font-bold text-xs text-primary">{att.subject}</TableCell>
                          <TableCell className="text-[10px] font-mono font-bold text-muted-foreground">{att.time}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Badge className={cn("text-[9px] font-black uppercase px-3 border-none", att.status === 'Present' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                              {att.status === 'Present' ? t("present") : (att.status === 'Absent' ? t("absent") : t("upcoming"))}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Subject-wise Statistics */}
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b">
                  <CardTitle className="text-sm font-black uppercase text-primary flex items-center gap-2">
                    <History className="w-4 h-4" /> {t("cumulativeRecords")}
                  </CardTitle>
                  <CardDescription>Aggregate performance across all pedagogical sessions.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-accent/10">
                      <TableRow className="text-[10px] font-black uppercase">
                        <TableHead className="pl-6">{t("subjects")}</TableHead>
                        <TableHead className="text-center text-green-600">{t("sessionsPresent")}</TableHead>
                        <TableHead className="text-center text-red-600">{t("sessionsAbsent")}</TableHead>
                        <TableHead className="text-right pr-6">{t("teacher")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_SUBJECT_RECORDS.map((rec, i) => (
                        <TableRow key={i}>
                          <TableCell className="pl-6 py-3 font-bold text-xs text-primary">{rec.subject}</TableCell>
                          <TableCell className="text-center font-black text-green-600">{rec.present}</TableCell>
                          <TableCell className="text-center font-black text-red-600">{rec.absent}</TableCell>
                          <TableCell className="text-right pr-6 text-[10px] font-bold text-muted-foreground italic">
                            <div className="flex items-center justify-end gap-2">
                              <User className="w-3 h-3" />
                              {rec.teacher}
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
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Award className="w-5 h-5" /> {t("reportCard")}
              </h3>
              <Card className="border-none shadow-sm group hover:ring-2 hover:ring-primary/20 transition-all">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{t("reportCard")} - Current Term</CardTitle>
                    <CardDescription>{t("academicYear")} 2023/24</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2">
                    <Eye className="w-4 h-4" /> {language === 'en' ? 'View' : 'Voir'}
                  </Button>
                </CardHeader>
              </Card>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> {t("idCard")}
              </h3>
              <div className="flex justify-center">
                <Card className="w-full max-w-sm border shadow-xl bg-white overflow-hidden relative group cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" onClick={() => setPreviewDoc({ type: 'id' })}>
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <GraduationCap className="w-32 h-32" />
                  </div>
                  <CardHeader className="border-b bg-accent/5 pb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle className="text-sm font-bold tracking-tight text-primary">
                          {currentUser?.school?.name || "GBHS Deido"}
                        </CardTitle>
                        <CardDescription className="text-primary/60 text-[10px] uppercase font-bold tracking-widest">{t("idCard")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-6 space-y-4">
                    <div className="flex gap-6">
                      <Avatar className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/10 shadow-lg shrink-0">
                        <AvatarImage src={student.avatar} className="object-cover" />
                        <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">{student.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{language === 'en' ? "Student Name" : "Nom de l'élève"}</p>
                          <p className="font-black text-primary uppercase text-sm leading-tight">{student.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold">{t("matricule")}</p>
                          <p className="font-mono font-bold text-secondary text-sm">{student.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-accent/10 py-3 flex justify-between items-center text-[10px]">
                    <span className="flex items-center gap-1 opacity-60 font-bold"><MapPin className="w-3 h-3" /> Douala, Cameroon</span>
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-white h-7 text-[10px] gap-1 font-bold">
                      <Eye className="w-3.5 h-3.5" /> Full Suite
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Official Report Card Preview Modal */}
      <Dialog open={!!previewDoc && previewDoc.type === 'report'} onOpenChange={() => setPreviewDoc(null)}>
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
            <div id="printable-bulletin" className="bg-white p-8 md:p-12 shadow-sm border border-border min-w-[850px] flex flex-col space-y-8 font-serif text-black relative print:shadow-none print:border-none">
               {/* National Header */}
               <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-1 text-[10px] uppercase font-black">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-8 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                    <p>{currentUser?.school?.name || "GBHS Deido"}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-2 border-2 border-primary/10">
                       <img src={currentUser?.school?.logo} alt="School Logo" className="w-16 h-16 object-contain" />
                    </div>
                    <p className="text-[10px] font-black uppercase italic tracking-tighter">Motto: {student.motto || currentUser?.school?.motto}</p>
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
                  <p className="font-bold text-sm italic">Academic Session: {previewDoc?.data?.year || '2023/2024'} • {previewDoc?.data?.term || 'Term 1'}</p>
               </div>

               {/* Student Metadata Card */}
               <div className="grid grid-cols-12 gap-8 bg-accent/5 p-6 border border-black/10 rounded-2xl items-center shadow-inner">
                  <div className="col-span-2">
                     <Avatar className="w-32 h-32 border-4 border-white rounded-2xl bg-white overflow-hidden shadow-lg">
                        <AvatarImage src={student.avatar} className="object-cover" />
                        <AvatarFallback className="text-4xl font-black">{student.name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                  </div>
                  <div className="col-span-10">
                     <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Student Name:</span><span className="font-black uppercase">{student.name}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Matricule / ID:</span><span className="font-mono font-bold text-primary">{student.id}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Grade / Class:</span><span className="font-bold">{student.class}</span></div>
                        <div className="flex justify-between border-b border-black/5 pb-1"><span className="font-bold uppercase opacity-60 text-[10px]">Date of Birth:</span><span className="font-bold">{student.dob}</span></div>
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

               {/* Performance Metrics Summary Footer */}
               <div className="grid grid-cols-12 gap-8 pt-4">
                  {/* Performance Matrix */}
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
                           <p className="text-xs font-black uppercase">Conduct Rating: <span className="text-secondary italic underline underline-offset-2">{getConduct(studentStats.attendance)}</span></p>
                        </div>
                     </div>
                  </div>

                  {/* Remarks & Authorizations */}
                  <div className="col-span-5 space-y-6">
                     <div className="border-2 border-black p-5 rounded-2xl h-full flex flex-col bg-accent/5">
                        <p className="text-[11px] font-black uppercase text-center border-b border-black mb-3 pb-1">Academic Council Remark</p>
                        <div className="flex-1 italic text-xs text-muted-foreground p-3 font-medium leading-relaxed">
                           "Academic performance is significantly above the class median. The student demonstrates excellent self-discipline and consistent pedagogical participation. Maintain this standard."
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
                <Printer className="w-4 h-4" /> Print Document
              </Button>
              <Button onClick={() => setPreviewDoc(null)} className="rounded-xl h-12 px-10 font-black uppercase text-xs">Back to Registry</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Teacher Dialog remains same */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Mail className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">{t("contactTeacher")}</DialogTitle>
                <DialogDescription className="text-white/60">
                  {t("sendTo")}: <span className="text-white font-bold">Prof. Sarah Smith (Lead Teacher)</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {t("messageBody")}
              </Label>
              <Textarea 
                placeholder={language === 'en' ? "Type your message here..." : "Tapez votre message ici..."}
                className="min-h-[150px] bg-accent/30 border-none rounded-2xl focus-visible:ring-primary p-4"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] text-muted-foreground italic">
                {language === 'en' 
                  ? "All messages are encrypted and logged for institutional safety." 
                  : "Tous les messages sont cryptés et enregistrés pour la sécurité institutionnelle."}
              </p>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button 
              className="w-full h-14 rounded-2xl shadow-xl font-black uppercase text-xs gap-3" 
              onClick={handleSendMessage}
              disabled={isSendingMessage || !messageText.trim()}
            >
              {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {t("sendMessage")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
