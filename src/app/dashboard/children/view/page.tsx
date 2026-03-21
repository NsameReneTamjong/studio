
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Phone
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock Data for the selected child detail - Expanded for all management students
const CHILDREN_DATA: Record<string, any> = {
  "S001": {
    name: "Alice Thompson",
    grade: "10th",
    section: "A",
    id: "S001",
    email: "alice.t@school.edu",
    status: "Enrolled",
    avatar: "https://picsum.photos/seed/s1/200/200",
    stats: { average: 15.4, rank: "04/42", attendance: "98%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Littoral, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 14, seq2: 16, moy: 15, group: "Sciences" },
      { name: "Physique", coeff: 4, seq1: 12, seq2: 15, moy: 13.5, group: "Sciences" },
      { name: "Anglais", coeff: 3, seq1: 17, seq2: 18, moy: 17.5, group: "Languages" },
      { name: "Français", coeff: 3, seq1: 11, seq2: 13, moy: 12, group: "Languages" },
      { name: "Histoire-Géo", coeff: 2, seq1: 14, seq2: 14, moy: 14, group: "Arts" },
    ],
    gradeHistory: [
      { year: "2023/2024", term: "First Term", position: "04/42", average: 15.4 },
      { year: "2022/2023", term: "Annual", position: "05/40", average: 14.8 },
    ],
    todayAttendance: [
      { subject: "Mathématiques", time: "08:00 AM", status: "present" },
      { subject: "Physique", time: "10:30 AM", status: "present" },
    ],
    attendanceSummary: [
      { subject: "Mathématiques", present: 22, absent: 2, history: [{ date: "May 24, 2024", time: "08:00 AM", status: "present" }] },
      { subject: "Physique-Chimie", present: 18, absent: 4, history: [{ date: "May 24, 2024", time: "10:30 AM", status: "present" }] },
    ],
    schedule: {
      Monday: [{ time: "09:00 AM", subject: "Advanced Physics", room: "Room 402", instructor: "Dr. Tesla" }],
      Friday: [{ time: "10:00 AM", subject: "English Literature", room: "Hall B", instructor: "Ms. Bennet" }],
    },
    receipts: [{ id: "RCP-001", title: "Registration Fee", amount: "50,000 XAF", date: "Sept 05, 2023" }]
  },
  "S002": {
    name: "Bob Richards",
    grade: "12th",
    section: "C",
    id: "S002",
    email: "bob.r@school.edu",
    status: "Enrolled",
    avatar: "https://picsum.photos/seed/s2/200/200",
    stats: { average: 12.8, rank: "15/38", attendance: "92%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Littoral, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 10, seq2: 11, moy: 10.5, group: "Sciences" },
      { name: "Informatique", coeff: 2, seq1: 15, seq2: 16, moy: 15.5, group: "Tech" },
    ],
    gradeHistory: [{ year: "2023/2024", term: "First Term", position: "15/38", average: 12.8 }],
    todayAttendance: [{ subject: "Mathématiques", time: "08:00 AM", status: "absent" }],
    attendanceSummary: [{ subject: "Mathématiques", present: 15, absent: 5, history: [] }],
    schedule: { Monday: [{ time: "08:00 AM", subject: "Maths", room: "302", instructor: "Prof. Smith" }] },
    receipts: []
  },
  "S003": {
    name: "Charlie Davis",
    grade: "11th",
    section: "B",
    id: "S003",
    email: "charlie.d@school.edu",
    status: "Leave",
    avatar: "https://picsum.photos/seed/s3/200/200",
    stats: { average: 14.2, rank: "08/40", attendance: "85%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Littoral, Cameroon",
    grades: [
      { name: "Anglais", coeff: 3, seq1: 14, seq2: 15, moy: 14.5, group: "Languages" },
    ],
    gradeHistory: [],
    todayAttendance: [],
    attendanceSummary: [],
    schedule: {},
    receipts: []
  },
  "S004": {
    name: "Diana Prince",
    grade: "10th",
    section: "A",
    id: "S004",
    email: "diana.p@school.edu",
    status: "Enrolled",
    avatar: "https://picsum.photos/seed/s4/200/200",
    stats: { average: 18.2, rank: "01/42", attendance: "100%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Littoral, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 18, seq2: 19, moy: 18.5, group: "Sciences" },
      { name: "Physique", coeff: 4, seq1: 17, seq2: 18, moy: 17.5, group: "Sciences" },
      { name: "Anglais", coeff: 3, seq1: 19, seq2: 20, moy: 19.5, group: "Languages" },
    ],
    gradeHistory: [
      { year: "2023/2024", term: "First Term", position: "01/42", average: 18.2 },
      { year: "2022/2023", term: "Annual", position: "01/40", average: 19.1 },
    ],
    todayAttendance: [
      { subject: "Math Honors", time: "08:00 AM", status: "present" },
      { subject: "Chemistry", time: "10:30 AM", status: "present" },
    ],
    attendanceSummary: [
      { subject: "Math Honors", present: 30, absent: 0, history: [{ date: "May 24, 2024", time: "08:00 AM", status: "present" }] },
    ],
    schedule: {
      Monday: [{ time: "10:30 AM", subject: "Math Honors", room: "Room 101", instructor: "Dr. Hawking" }],
    },
    receipts: [
      { id: "RCP-099", title: "Full Scholarship Enrollment", amount: "0 XAF", date: "Aug 28, 2023" },
    ]
  },
  "S005": {
    name: "Ethan Hunt",
    grade: "12th",
    section: "B",
    id: "S005",
    email: "ethan.h@school.edu",
    status: "Probation",
    avatar: "https://picsum.photos/seed/s5/200/200",
    stats: { average: 10.5, rank: "35/38", attendance: "78%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Littoral, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 8, seq2: 9, moy: 8.5, group: "Sciences" },
    ],
    gradeHistory: [],
    todayAttendance: [],
    attendanceSummary: [],
    schedule: {},
    receipts: []
  }
};

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien / Excellent", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien / Very Good", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien / Good", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable / Fair", color: "bg-amber-500" };
  return { text: "Faible / Poor", color: "bg-red-500" };
};

export default function StudentDetailsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { t, language } = useI18n();
  const studentId = searchParams.get("id");
  const [child, setChild] = useState<any>(null);
  
  // Preview States
  const [previewDoc, setPreviewDoc] = useState<{ type: 'report' | 'receipt' | 'id', data?: any } | null>(null);
  const [selectedAttendanceDetails, setSelectedAttendanceDetails] = useState<any>(null);

  useEffect(() => {
    if (studentId && CHILDREN_DATA[studentId]) {
      setChild(CHILDREN_DATA[studentId]);
    }
  }, [studentId]);

  const handleDownload = (docName: string) => {
    toast({
      title: t("download") + "...",
      description: `${docName} is being prepared for download.`,
    });
  };

  if (!child) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-muted-foreground">Loading student profile...</p>
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
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg shrink-0">
              <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-2">
                {child.name}
                {child.status === 'Enrolled' ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">ACTIVE</Badge>
                ) : (
                  <Badge variant="destructive">{child.status}</Badge>
                )}
              </h1>
              <p className="text-muted-foreground">{child.grade} Grade • Section {child.section} • ID: {child.id}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Mail className="w-4 h-4" /> Message</Button>
          <Button className="gap-2 shadow-lg"><Printer className="w-4 h-4" /> Print Dossier</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase">{language === "en" ? "General Average" : "Moyenne Générale"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{child.stats.average.toFixed(2)} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase">{language === "en" ? "Class Rank" : "Rang"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{child.stats.rank}</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-accent text-primary border border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-80 uppercase">{language === "en" ? "Attendance" : "Présence"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{child.stats.attendance}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grades" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full bg-white border shadow-sm h-auto p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-2 py-2">
            <User className="w-4 h-4" /> {language === 'en' ? 'Profile' : 'Profil'}
          </TabsTrigger>
          <TabsTrigger value="grades" className="gap-2 py-2">
            <Award className="w-4 h-4" /> {language === "en" ? "Grades" : "Bulletin"}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2 py-2">
            <Calendar className="w-4 h-4" /> {language === "en" ? "Schedule" : "Emploi"}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 py-2">
            <ClipboardCheck className="w-4 h-4" /> {language === "en" ? "Presence" : "Présence"}
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
                  <Info className="w-5 h-5 text-primary" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Full Name</p>
                    <p className="font-bold text-lg">{child.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Matricule ID</p>
                    <p className="font-mono font-bold text-lg text-primary">{child.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Institutional Email</p>
                    <p className="font-medium text-primary flex items-center gap-2"><Mail className="w-4 h-4"/> {child.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Grade / Section</p>
                    <p className="font-bold">{child.grade} - Section {child.section}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Parent / Guardian Contact</h4>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/20 border border-accent">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">M. Thompson</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3"/> +237 6XX XX XX XX</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary/90 text-white">
              <CardHeader>
                <CardTitle className="text-white">Institutional Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">Status</span>
                  <Badge className="bg-secondary text-primary border-none">{child.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">Campus</span>
                  <span className="font-bold text-sm">Main Campus (Douala)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">Join Date</span>
                  <span className="font-bold text-sm">Sept 2023</span>
                </div>
                
                <div className="pt-6 border-t border-white/10 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-white/20 mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Digital ID Valid 2023-2024</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="mt-6 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-accent/30 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle>{language === "en" ? "Current Term Grades" : "Notes du Trimestre Actuel"}</CardTitle>
                <CardDescription>Academic Year 2023/2024 - First Term</CardDescription>
              </div>
              <Button onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2">
                <Eye className="w-4 h-4" /> {language === 'en' ? 'View Official Bulletin' : 'Voir Bulletin Officiel'}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 uppercase text-[10px]">
                    <TableHead className="pl-6">Subject</TableHead>
                    <TableHead className="text-center">Coeff</TableHead>
                    <TableHead className="text-center">Seq 1</TableHead>
                    <TableHead className="text-center">Seq 2</TableHead>
                    <TableHead className="text-center">Moy/20</TableHead>
                    <TableHead className="text-right pr-6">Appreciation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {child.grades.length > 0 ? (
                    child.grades.map((grade: any, idx: number) => {
                      const appreciation = getAppreciation(grade.moy);
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium pl-6">
                            <div>
                              <p>{grade.name}</p>
                              <p className="text-[10px] text-muted-foreground">{grade.group}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold">{grade.coeff}</TableCell>
                          <TableCell className="text-center">{grade.seq1?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-center">{grade.seq2?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-center font-bold text-primary">{grade.moy?.toFixed(2) || 'N/A'}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Badge variant="outline" className={cn("text-[10px] border-none text-white", appreciation.color)}>
                              {appreciation.text}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No grades recorded for this student yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <History className="w-5 h-5" /> {language === "en" ? "Grade History" : "Historique des Notes"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {child.gradeHistory.map((history: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm hover:ring-2 hover:ring-primary/20 transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">
                        {history.year}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">{history.term}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-accent/30 p-2 rounded-lg text-center">
                        <p className="text-[9px] uppercase text-muted-foreground font-bold">{language === 'en' ? 'Average' : 'Moyenne'}</p>
                        <p className="text-lg font-bold text-primary">{history.average.toFixed(2)}</p>
                      </div>
                      <div className="bg-accent/30 p-2 rounded-lg text-center">
                        <p className="text-[9px] uppercase text-muted-foreground font-bold">{language === 'en' ? 'Position' : 'Rang'}</p>
                        <p className="text-lg font-bold text-primary">{history.position}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      className="w-full gap-2 text-primary hover:bg-primary/5 h-9 text-xs"
                      onClick={() => setPreviewDoc({ type: 'report', data: history })}
                    >
                      <Eye className="w-3.5 h-3.5" /> {t("viewDetails")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(child.schedule).length > 0 ? (
              Object.keys(child.schedule).map((day) => (
                <div key={day} className="space-y-3">
                  <h3 className="font-bold text-primary border-b pb-2 uppercase text-xs tracking-wider">{day}</h3>
                  {child.schedule[day].map((slot: any, idx: number) => (
                    <Card key={idx} className="border-none shadow-sm">
                      <CardContent className="p-3 space-y-2">
                        <Badge className="bg-secondary/20 text-primary border-none text-[10px] h-5">
                          {slot.time}
                        </Badge>
                        <h4 className="font-bold text-xs">{slot.subject}</h4>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                          <User className="w-3 h-3" />
                          <span>{slot.instructor}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-accent rounded-3xl">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No timetable data available for this student.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{language === "en" ? "Today's Attendance" : "Présence d'Aujourd'hui"}</CardTitle>
              <CardDescription>{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.todayAttendance.length > 0 ? (
                child.todayAttendance.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-accent">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-lg",
                        item.status === 'present' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {item.status === 'present' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === 'present' ? 'default' : 'secondary'} className={cn(
                      item.status === 'present' ? "bg-green-600" : "bg-amber-600"
                    )}>
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-center py-6 text-muted-foreground">No attendance recorded for today.</p>
              )}
            </CardContent>
          </Card>

          <div>
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5" /> {language === "en" ? "Attendance Records" : "Registres de Présence"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {child.attendanceSummary.map((summary: any, idx: number) => (
                <Card key={idx} className="border-none shadow-sm group hover:ring-2 hover:ring-primary/20 transition-all">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-bold text-base text-primary">{summary.subject}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">{summary.present} {t("present")}</span>
                         <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">{summary.absent} {t("absent")}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-primary hover:bg-primary/5"
                      onClick={() => setSelectedAttendanceDetails(summary)}
                    >
                      {t("viewDetails")} <ChevronRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
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
                    <CardDescription>{t("academicYear")} 2023/2024</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2">
                    <Eye className="w-4 h-4" /> {language === 'en' ? 'View' : 'Voir'}
                  </Button>
                </CardHeader>
              </Card>

              <h3 className="text-lg font-bold text-primary flex items-center gap-2 mt-8">
                <Receipt className="w-5 h-5" /> {t("fees")}
              </h3>
              <div className="space-y-3">
                {child.receipts.map((receipt: any) => (
                  <Card key={receipt.id} className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{receipt.title}</p>
                          <p className="text-xs text-muted-foreground">{receipt.date} • {receipt.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-primary">{receipt.amount}</span>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewDoc({ type: 'receipt', data: receipt })} className="gap-2">
                          <Eye className="w-4 h-4" /> {language === 'en' ? 'View' : 'Voir'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" /> {t("idCard")}
              </h3>
              <div className="flex justify-center">
                <Card className="w-full max-w-sm border shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap className="w-32 h-32" />
                  </div>
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-secondary" />
                      <div>
                        <CardTitle className="text-sm font-bold tracking-tight">{child.schoolName}</CardTitle>
                        <CardDescription className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{t("idCard")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-6 space-y-4">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                        <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Student Name" : "Nom de l'Élève"}</p>
                          <p className="font-bold text-lg leading-none">{child.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Matricule</p>
                          <p className="font-mono font-bold text-secondary">{child.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 py-3 flex justify-between items-center text-[10px]">
                    <span className="flex items-center gap-1 opacity-60"><MapPin className="w-3 h-3" /> {child.schoolAddress}</span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewDoc({ type: 'id' })} className="text-white hover:bg-white/10 h-7 text-[10px] gap-1">
                      <Eye className="w-3.5 h-3.5" /> {language === 'en' ? 'Full Preview' : 'Aperçu'}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Attendance History Detail Dialog */}
      <Dialog open={!!selectedAttendanceDetails} onOpenChange={() => setSelectedAttendanceDetails(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              {selectedAttendanceDetails?.subject} - {language === 'en' ? 'Detailed Records' : 'Détails de Présence'}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' 
                ? 'Review complete session history for this subject.' 
                : 'Consultez l\'historique complet des sessions pour cette matière.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto mt-4 rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>{language === 'en' ? 'Time' : 'Heure'}</TableHead>
                  <TableHead className="text-right">{language === 'en' ? 'Status' : 'Statut'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAttendanceDetails?.history?.map((record: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-xs md:text-sm">{record.date}</TableCell>
                    <TableCell className="text-xs md:text-sm">{record.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={record.status === 'present' ? 'default' : 'destructive'}
                        className={cn(
                          "text-[10px] px-2 py-0.5",
                          record.status === 'present' ? "bg-green-600" : "bg-red-600"
                        )}
                      >
                        {record.status === 'present' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {record.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setSelectedAttendanceDetails(null)}>
              {language === 'en' ? 'Close' : 'Fermer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-white">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Eye className="w-5 h-5" />
              {previewDoc?.type === 'report' ? t("reportCard") : 
               previewDoc?.type === 'receipt' ? t("receipt") : t("idCard")}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {language === 'en' ? 'Official document preview. Review before downloading.' : 'Aperçu du document officiel. Examinez avant de télécharger.'}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-8">
            {/* REPORT CARD PREVIEW */}
            {previewDoc?.type === 'report' && (
              <div className="bg-white p-6 md:p-10 shadow-sm border border-border min-h-[700px] flex flex-col space-y-6 font-serif text-black relative">
                 <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                    <div className="space-y-1 text-[9px] uppercase font-bold">
                      <p>Republic of Cameroon</p>
                      <p>Peace - Work - Fatherland</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Ministry of Secondary Education</p>
                      <p>{child.schoolName}</p>
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
                      <p>{child.schoolAddress.split(',')[0]}</p>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h2 className="text-xl md:text-2xl font-black uppercase underline tracking-tighter">
                      REPORT CARD / BULLETIN DE NOTES
                    </h2>
                    <p className="font-bold text-sm italic">Academic Year: {previewDoc.data?.year || "2023/2024"}</p>
                 </div>

                 <div className="grid grid-cols-12 gap-6 bg-accent/10 p-4 border border-accent rounded-lg items-center">
                    <div className="col-span-3">
                       <div className="w-24 h-24 border-2 border-black/10 rounded bg-white overflow-hidden shadow-inner">
                          <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                       </div>
                    </div>
                    <div className="col-span-9 space-y-2">
                       <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                          <span className="font-bold uppercase opacity-60">Student Name:</span>
                          <span className="font-black uppercase">{child.name}</span>
                          <span className="font-bold uppercase opacity-60">Matricule / ID No:</span>
                          <span className="font-mono font-bold text-primary">{child.id}</span>
                          <span className="font-bold uppercase opacity-60">Grade:</span>
                          <span className="font-bold">{child.grade}</span>
                       </div>
                    </div>
                 </div>

                 <div className="overflow-x-auto">
                   <Table className="border border-black">
                      <TableHeader className="bg-black/5">
                        <TableRow className="border-black">
                          <TableHead className="text-[10px] uppercase font-bold text-black border-r border-black">Subjects</TableHead>
                          <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Coeff</TableHead>
                          <TableHead className="text-center text-[10px] uppercase font-bold text-black border-r border-black">Moy/20</TableHead>
                          <TableHead className="text-right text-[10px] uppercase font-bold text-black">Appreciation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {child.grades.map((g: any, i: number) => (
                          <TableRow key={i} className="border-black">
                            <TableCell className="font-bold py-1.5 border-r border-black text-[11px]">{g.name}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black">{g.coeff}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black text-primary">{g.moy?.toFixed(2)}</TableCell>
                            <TableCell className="text-right py-1.5 text-[10px] uppercase font-medium italic">{getAppreciation(g.moy).text}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-black bg-black/5 font-bold">
                           <TableCell className="border-r border-black text-right uppercase text-[10px]" colSpan={2}>General Summary</TableCell>
                           <TableCell className="text-center border-r border-black text-lg font-black text-primary" colSpan={1}>
                             {previewDoc.data?.average?.toFixed(2) || child.stats.average.toFixed(2)}
                           </TableCell>
                           <TableCell className="text-right uppercase text-[10px]" colSpan={1}>
                             Rank: {previewDoc.data?.position || child.stats.rank}
                           </TableCell>
                        </TableRow>
                      </TableBody>
                   </Table>
                 </div>
              </div>
            )}

            {/* RECEIPT PREVIEW */}
            {previewDoc?.type === 'receipt' && (
              <div className="bg-white p-8 shadow-sm border border-border flex flex-col space-y-4 max-w-md mx-auto">
                 <div className="text-center border-b pb-4">
                    <Building2 className="w-8 h-8 mx-auto text-primary mb-2" />
                    <h2 className="font-bold text-lg uppercase tracking-wider">{child.schoolName}</h2>
                    <p className="text-[10px] text-muted-foreground">OFFICIAL PAYMENT RECEIPT</p>
                 </div>
                 <div className="space-y-3 py-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reçu No:</span>
                      <span className="font-mono font-bold">{previewDoc.data?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payee:</span>
                      <span className="font-bold">{child.name}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-primary flex justify-between items-center">
                      <span className="text-lg font-bold">TOTAL PAID:</span>
                      <span className="text-xl font-black text-primary">{previewDoc.data?.amount}</span>
                    </div>
                 </div>
              </div>
            )}

            {/* ID CARD PREVIEW */}
            {previewDoc?.type === 'id' && (
              <div className="flex justify-center p-8">
                <Card className="w-full max-w-md border shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative">
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-secondary" />
                      <div>
                        <CardTitle className="text-lg font-bold tracking-tight">{child.schoolName}</CardTitle>
                        <CardDescription className="text-white/60 text-xs uppercase font-bold tracking-widest">{t("idCard")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8 space-y-6">
                    <div className="flex gap-8">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
                        <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Student Name</p>
                          <p className="font-bold text-xl leading-none">{child.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Matricule</p>
                          <p className="font-mono font-bold text-2xl text-secondary">{child.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 py-4 flex justify-between items-center">
                    <span className="flex items-center gap-1 opacity-60 text-xs"><MapPin className="w-4 h-4" /> {child.schoolAddress}</span>
                    <Badge variant="secondary" className="bg-secondary text-primary border-none text-[10px] h-6 px-4">VALID 2023-24</Badge>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setPreviewDoc(null)} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={() => { handleDownload('Academic Document'); setPreviewDoc(null); }} className="gap-2 shadow-lg">
              <Download className="w-4 h-4" /> {t("download")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
