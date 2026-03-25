
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
  Send
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
    address: "Bonapriso, Douala"
  },
  {
    id: "S004",
    uid: "S4",
    name: "Diana Prince",
    class: "2nde / Form 5",
    section: "A",
    email: "diana@gbhsdeido.cm",
    status: "active",
    isLicensePaid: true,
    avatar: "https://picsum.photos/seed/diana/200/200",
    createdAt: { toDate: () => new Date() },
    dob: "05/01/2008",
    guardian: "Mrs. Prince",
    guardianPhone: "+237 6XX XX XX XX",
    address: "Logbessou, Douala"
  }
];

const MOCK_GRADES = [
  { courseId: "PHY101", courseName: "Physics", seq1: 14, seq2: 16, coeff: 4, group: "Sciences" },
  { courseId: "MAT101", courseName: "Mathematics", seq1: 18, seq2: 17, coeff: 5, group: "Sciences" },
  { courseId: "ENG101", courseName: "English", seq1: 12, seq2: 13, coeff: 3, group: "Arts" },
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
    const found = MOCK_CHILDREN.find(c => c.id === studentId);
    setTimeout(() => {
      setStudent(found);
      setLoading(false);
    }, 500);
  }, [studentId]);

  const generalAverage = useMemo(() => {
    const totalWeighted = MOCK_GRADES.reduce((acc, curr) => acc + (((curr.seq1 + curr.seq2)/2) * curr.coeff), 0);
    const totalCoeff = MOCK_GRADES.reduce((acc, curr) => acc + curr.coeff, 0);
    return totalCoeff > 0 ? totalWeighted / totalCoeff : 0;
  }, []);

  const getAppreciation = (note: number) => {
    if (note >= 16) return { text: language === 'en' ? "Excellent" : "Très Bien", color: "bg-green-600" };
    if (note >= 14) return { text: language === 'en' ? "Very Good" : "Bien", color: "bg-green-500" };
    if (note >= 12) return { text: language === 'en' ? "Good" : "Assez Bien", color: "bg-blue-500" };
    if (note >= 10) return { text: language === 'en' ? "Fair" : "Passable", color: "bg-amber-500" };
    return { text: language === 'en' ? "Poor" : "Faible", color: "bg-red-500" };
  };

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

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">Student profile not found in institutional registry.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary shadow-lg shrink-0">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-bold">{student.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
                {student.name}
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 uppercase">ACTIVE</Badge>
              </h1>
              <p className="text-muted-foreground">{student.class} • ID: {student.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setIsMessageModalOpen(true)}>
            <Mail className="w-4 h-4" /> {language === 'en' ? 'Message' : 'Message'}
          </Button>
          <Button className="gap-2 shadow-lg" onClick={() => setPreviewDoc({ type: 'report' })}><Printer className="w-4 h-4" /> {t("print")} {t("reportCard")}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("termAverage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{generalAverage.toFixed(2)} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("evaluations")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{MOCK_GRADES.length} {t("subjects")}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-accent text-primary border border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{t("presenceRate")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> 94.5%
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
                <div className="grid grid-cols-2 gap-6">
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
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-accent/30 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("grades")}</CardTitle>
                <CardDescription>Academic Session 2024</CardDescription>
              </div>
              <Button onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2 bg-primary text-white shadow-lg">
                <Eye className="w-4 h-4" /> {t("officialBulletin")}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6 py-4">{t("subjects")}</TableHead>
                    <TableHead className="text-center">Coeff</TableHead>
                    <TableHead className="text-center">Seq 1</TableHead>
                    <TableHead className="text-center">Seq 2</TableHead>
                    <TableHead className="text-center">Moy/20</TableHead>
                    <TableHead className="text-right pr-6">Appreciation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GRADES.map((grade: any, idx: number) => {
                    const avg = (grade.seq1 + grade.seq2) / 2;
                    const appreciation = getAppreciation(avg);
                    return (
                      <TableRow key={idx} className="hover:bg-accent/5">
                        <TableCell className="font-bold pl-6 text-primary">
                          <div>
                            <p>{grade.courseName}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black">{grade.group}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-black">{grade.coeff}</TableCell>
                        <TableCell className="text-center font-medium">{grade.seq1.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-medium">{grade.seq2.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-black text-primary text-lg">{avg.toFixed(2)}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge variant="outline" className={cn("text-[9px] font-black uppercase border-none text-white px-3", appreciation.color)}>
                            {appreciation.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-primary/5 p-6 flex justify-between items-center border-t">
               <p className="text-xs font-bold text-primary italic">{language === 'en' ? "Term Average Calculation based on verified school coefficients." : "Calcul de la moyenne basé sur les coefficients scolaires vérifiés."}</p>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-black text-muted-foreground">{t("termAverage")}</p>
                  <p className="text-2xl font-black text-primary">{generalAverage.toFixed(2)} / 20</p>
               </div>
            </CardFooter>
          </Card>
        </TabsContent>

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
                    <CardTitle className="text-base">{t("reportCard")} - Sequence 1 & 2</CardTitle>
                    <CardDescription>{t("academicYear")} 2024</CardDescription>
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

      {/* Contact Teacher Dialog */}
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
                  {t("sendTo")}: <span className="text-white font-bold">Prof. Sarah Smith</span>
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

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-white no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black text-white">
                    {previewDoc?.type === 'report' ? t("reportCard") : 
                     previewDoc?.type === 'receipt' ? t("receipt") : t("idCard")}
                  </DialogTitle>
                  <DialogDescription className="text-white/70">
                    Official institutional document preview. Optimized for high-fidelity printing.
                  </DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(null)} className="text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-8 print:p-0 print:bg-white">
            {previewDoc?.type === 'report' && (
              <div className="bg-white p-6 md:p-10 shadow-sm border border-border min-h-[700px] flex flex-col space-y-6 font-serif text-black relative print:shadow-none print:border-none">
                 <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                    <div className="space-y-1 text-[9px] uppercase font-bold">
                      <p>Republic of Cameroon</p>
                      <p>Peace - Work - Fatherland</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Ministry of Secondary Education</p>
                      <p>{currentUser?.school?.name || "Lycée de Joss"}</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center p-2 border-2 border-primary/20">
                         <img src={currentUser?.school?.logo} alt="Logo" className="w-12 h-12 object-contain" />
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
                    <p className="font-bold text-sm italic">{t("academicYear")}: 2024</p>
                 </div>

                 <div className="grid grid-cols-12 gap-6 bg-accent/10 p-4 border border-accent rounded-lg items-center">
                    <div className="col-span-3">
                       <Avatar className="w-24 h-24 border-2 border-black/10 rounded bg-white overflow-hidden shadow-inner">
                          <AvatarImage src={student.avatar} className="object-cover" />
                          <AvatarFallback className="text-3xl font-black">{student.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="col-span-9 space-y-2">
                       <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <span className="font-bold uppercase opacity-60">{t("fullName")}:</span>
                          <span className="font-black uppercase">{student.name}</span>
                          <span className="font-bold uppercase opacity-60">{t("matricule")}:</span>
                          <span className="font-mono font-bold text-primary">{student.id}</span>
                          <span className="font-bold uppercase opacity-60">{language === 'en' ? "Grade" : "Niveau"}:</span>
                          <span className="font-bold">{student.class}</span>
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
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
                        {MOCK_GRADES.map((g: any, i: number) => (
                          <TableRow key={i} className="border-black">
                            <TableCell className="font-bold py-1.5 border-r border-black text-[11px]">{g.courseName}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black">{g.coeff}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black text-primary">{((g.seq1+g.seq2)/2).toFixed(2)}</TableCell>
                            <TableCell className="text-right py-1.5 text-[10px] uppercase font-medium italic">{getAppreciation((g.seq1+g.seq2)/2).text}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-black bg-black/5 font-bold">
                           <TableCell className="border-r border-black text-right uppercase text-[10px]" colSpan={2}>{t("termAverage")}</TableCell>
                           <TableCell className="text-center border-r border-black text-lg font-black text-primary" colSpan={1}>
                             {generalAverage.toFixed(2)}
                           </TableCell>
                           <TableCell className="text-right uppercase text-[10px]" colSpan={1}>
                             {language === 'en' ? "Rank: 1st / 45" : "Rang: 1er / 45"}
                           </TableCell>
                        </TableRow>
                      </TableBody>
                   </Table>
                 </div>

                 <div className="mt-auto grid grid-cols-2 gap-20 pt-12 items-end text-center">
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold">{language === 'en' ? "The Class Council" : "Le Conseil de Classe"}</p>
                       <div className="h-px bg-black w-full" />
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] uppercase font-bold">{language === 'en' ? "The Principal" : "Le Proviseur"}</p>
                       <div className="h-px bg-black w-full" />
                       <Badge variant="outline" className="border-black text-[8px] font-bold uppercase tracking-widest">Official Seal</Badge>
                    </div>
                 </div>
              </div>
            )}

            {previewDoc?.type === 'id' && (
              <div className="flex flex-col gap-12 items-center print:gap-8">
                {/* ID Card Front */}
                <div className="relative group card-container">
                  <Card className="w-[450px] h-[280px] border shadow-xl bg-white overflow-hidden relative border-primary/20 flex flex-col">
                    {/* Cameroon National Header */}
                    <div className="bg-primary p-2 flex items-center justify-between text-white text-[7px] font-black uppercase tracking-tighter shrink-0 border-b border-white/10">
                      <div className="text-left leading-none space-y-0.5">
                        <p>Republic of Cameroon</p>
                        <p>Peace - Work - Fatherland</p>
                      </div>
                      <div className="flex gap-1 h-3">
                        <div className="w-2 h-full bg-[#007a5e]" />
                        <div className="w-2 h-full bg-[#ce1126] flex items-center justify-center"><div className="w-0.5 h-0.5 bg-yellow-400 rounded-full" /></div>
                        <div className="w-2 h-full bg-[#fcd116]" />
                      </div>
                      <div className="text-right leading-none space-y-0.5">
                        <p>République du Cameroun</p>
                        <p>Paix - Travail - Patrie</p>
                      </div>
                    </div>

                    {/* Ministry & School Header */}
                    <div className="p-3 border-b border-accent flex items-center gap-3 bg-accent/5 shrink-0">
                      <div className="w-12 h-12 bg-white rounded-lg p-1 border shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={currentUser?.school?.logo} alt="School Logo" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-0.5">Ministry of Secondary Education</p>
                        <h3 className="text-xs font-black uppercase text-primary leading-tight">{currentUser?.school?.name}</h3>
                        <p className="text-[7px] font-bold text-muted-foreground italic">"{currentUser?.school?.motto}"</p>
                      </div>
                    </div>

                    <div className="flex-1 p-4 flex gap-6 relative">
                      <div className="w-28 h-28 rounded-xl border-2 border-primary/10 overflow-hidden shadow-lg shrink-0 bg-accent/5">
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center gap-3">
                        <div className="space-y-0.5">
                          <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Full Name / Nom Complet</p>
                          <p className="text-sm font-black text-primary uppercase leading-tight">{student.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-0.5">
                            <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Matricule</p>
                            <p className="text-sm font-mono font-black text-secondary">{student.id}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Class / Classe</p>
                            <p className="text-xs font-black text-primary">{student.class}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 p-2 flex justify-between items-center border-t border-accent shrink-0">
                      <div className="px-3 py-1 bg-primary text-white rounded-md text-[9px] font-black tracking-widest">
                        STUDENT ID CARD
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-muted-foreground uppercase">{t("academicYear")}</span>
                        <Badge className="bg-secondary text-primary border-none text-[9px] font-black h-5">2023 - 2024</Badge>
                      </div>
                    </div>
                  </Card>
                  <p className="text-center text-[10px] font-black uppercase text-muted-foreground mt-2 no-print tracking-[0.2em]">Front / Recto</p>
                </div>

                {/* ID Card Back */}
                <div className="relative group card-container">
                  <Card className="w-[450px] h-[280px] border shadow-xl bg-white overflow-hidden relative border-primary/20 flex flex-col">
                    <div className="bg-primary h-1 w-full shrink-0" />
                    
                    <div className="flex-1 p-6 flex flex-col gap-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Guardian / Tuteur</p>
                            <p className="text-[10px] font-bold text-primary">{student.guardian || "Not Registered"}</p>
                            <p className="text-[10px] font-black text-secondary flex items-center gap-1"><Phone className="w-2.5 h-2.5" /> {student.guardianPhone || "---"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Date of Birth / Né(e) le</p>
                            <p className="text-[10px] font-bold text-primary">{student.dob || "---"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[7px] uppercase font-black text-muted-foreground tracking-widest">Residential Address / Adresse</p>
                            <p className="text-[9px] font-medium text-muted-foreground leading-tight">{student.address || "---"}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center gap-4 text-center border-l border-accent pl-8">
                          <div className="p-2 bg-white border-2 border-accent rounded-xl shadow-inner">
                            <QrCode className="w-20 h-20 text-primary" />
                          </div>
                          <p className="text-[7px] font-black text-muted-foreground uppercase leading-tight tracking-widest">
                            Scannez pour vérifier l'authenticité<br/>Scan to verify authenticity
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto flex justify-between items-end border-t border-accent/50 pt-4">
                        <div className="space-y-4">
                          <div className="text-[8px] max-w-[200px] leading-relaxed text-muted-foreground font-medium">
                            <p className="font-black text-[7px] uppercase text-primary mb-1">Notice / Avertissement</p>
                            This card is strictly personal. If found, please return to the school administration.
                          </div>
                        </div>
                        <div className="text-center space-y-1 relative">
                          <div className="h-px bg-primary/20 w-24 mx-auto mb-1" />
                          <p className="text-[8px] font-black text-primary uppercase">{t("proviseur")}</p>
                          <Badge variant="outline" className="text-[7px] border-primary/20 text-primary font-black uppercase">Official Seal</Badge>
                        </div>
                      </div>
                    </div>

                    {/* PLATFORM BRANDING FOOTER */}
                    <div className="bg-accent/20 p-2 px-4 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2">
                        <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain rounded-sm" />
                        <p className="text-[7px] font-black text-primary uppercase tracking-widest">
                          Powered by {platformSettings.name} SaaS
                        </p>
                      </div>
                      <span className="text-[6px] text-muted-foreground font-bold italic">Secure Node Registry</span>
                    </div>
                  </Card>
                  <p className="text-center text-[10px] font-black uppercase text-muted-foreground mt-2 no-print tracking-[0.2em]">Back / Verso</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print">
            <div className="flex-1 flex items-center gap-2 text-muted-foreground italic">
               <Info className="w-4 h-4" />
               <p className="text-[10px]">Optimized for standard 85.60 × 53.98 mm (CR80) PVC cards.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.print()} className="gap-2 rounded-xl">
                <Printer className="w-4 h-4" /> {t("print")}
              </Button>
              <Button onClick={() => { handleDownload('ID Card Suite'); setPreviewDoc(null); }} className="gap-2 shadow-lg bg-primary text-white rounded-xl">
                <Download className="w-4 h-4" /> {t("download")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
