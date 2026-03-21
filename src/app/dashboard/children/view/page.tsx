
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
  History
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Mock Data for the selected child detail
const CHILDREN_DATA: Record<string, any> = {
  "S001": {
    name: "Alice Thompson",
    grade: "10th",
    id: "S001",
    avatar: "https://picsum.photos/seed/alice/200/200",
    stats: { average: 15.4, rank: "04/42", attendance: "98%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 14, seq2: 16, moy: 15, group: "Sciences" },
      { name: "Physique", coeff: 4, seq1: 12, seq2: 15, moy: 13.5, group: "Sciences" },
      { name: "Anglais", coeff: 3, seq1: 17, seq2: 18, moy: 17.5, group: "Languages" },
    ],
    todayAttendance: [
      { subject: "Mathématiques", time: "08:00 AM", status: "present" },
      { subject: "Physique", time: "10:30 AM", status: "present" },
      { subject: "Informatique", time: "02:00 PM", status: "late" },
    ],
    attendanceSummary: [
      { subject: "Mathématiques", present: 22, absent: 2, history: [
        { date: "May 24, 2024", time: "08:00 AM", status: "present" },
        { date: "May 22, 2024", time: "08:00 AM", status: "present" },
        { date: "May 20, 2024", time: "08:00 AM", status: "absent" },
        { date: "May 17, 2024", time: "08:00 AM", status: "present" },
        { date: "May 15, 2024", time: "08:00 AM", status: "present" },
      ]},
      { subject: "Physique-Chimie", present: 18, absent: 4, history: [
        { date: "May 24, 2024", time: "10:30 AM", status: "present" },
        { date: "May 21, 2024", time: "10:30 AM", status: "present" },
        { date: "May 19, 2024", time: "10:30 AM", status: "absent" },
      ]},
      { subject: "Anglais", present: 24, absent: 0, history: [
        { date: "May 23, 2024", time: "01:00 PM", status: "present" },
        { date: "May 20, 2024", time: "01:00 PM", status: "present" },
      ]},
      { subject: "Histoire-Géo", present: 21, absent: 3, history: [
        { date: "May 22, 2024", time: "03:00 PM", status: "present" },
        { date: "May 18, 2024", time: "03:00 PM", status: "absent" },
      ]},
    ],
    schedule: {
      Monday: [{ time: "09:00 AM", subject: "Advanced Physics", room: "Room 402", instructor: "Dr. Tesla" }],
      Tuesday: [{ time: "11:30 AM", subject: "Calculus II", room: "Room 201", instructor: "Prof. Smith" }],
      Wednesday: [{ time: "09:00 AM", subject: "Advanced Physics", room: "Room 402", instructor: "Dr. Tesla" }],
      Thursday: [{ time: "11:30 AM", subject: "Calculus II", room: "Room 201", instructor: "Prof. Smith" }],
      Friday: [{ time: "10:00 AM", subject: "English Literature", room: "Hall B", instructor: "Ms. Bennet" }],
    },
    receipts: [
      { id: "RCP-001", title: "Registration Fee", amount: "50,000 XAF", date: "Sept 05, 2023" },
      { id: "RCP-002", title: "Tuition - Term 1", amount: "125,000 XAF", date: "Oct 12, 2023" },
    ]
  },
  "S004": {
    name: "Diana Prince",
    grade: "10th",
    id: "S004",
    avatar: "https://picsum.photos/seed/diana/200/200",
    stats: { average: 18.2, rank: "01/42", attendance: "100%" },
    schoolName: "Lycée de Joss",
    schoolAddress: "Douala, Cameroon",
    grades: [
      { name: "Mathématiques", coeff: 5, seq1: 18, seq2: 19, moy: 18.5, group: "Sciences" },
      { name: "Physique", coeff: 4, seq1: 17, seq2: 18, moy: 17.5, group: "Sciences" },
      { name: "Anglais", coeff: 3, seq1: 19, seq2: 20, moy: 19.5, group: "Languages" },
    ],
    todayAttendance: [
      { subject: "Math Honors", time: "08:00 AM", status: "present" },
      { subject: "Chemistry", time: "10:30 AM", status: "present" },
    ],
    attendanceSummary: [
      { subject: "Math Honors", present: 30, absent: 0, history: [
        { date: "May 24, 2024", time: "08:00 AM", status: "present" },
      ]},
      { subject: "Chemistry", present: 28, absent: 0, history: [
        { date: "May 24, 2024", time: "10:30 AM", status: "present" },
      ]},
      { subject: "English Lit", present: 25, absent: 0, history: [
        { date: "May 23, 2024", time: "01:00 PM", status: "present" },
      ]},
    ],
    schedule: {
      Monday: [{ time: "10:30 AM", subject: "Math Honors", room: "Room 101", instructor: "Dr. Hawking" }],
      Wednesday: [{ time: "10:30 AM", subject: "Math Honors", room: "Room 101", instructor: "Dr. Hawking" }],
    },
    receipts: [
      { id: "RCP-099", title: "Full Scholarship Enrollment", amount: "0 XAF", date: "Aug 28, 2023" },
    ]
  }
};

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  return { text: "Faible", color: "bg-red-500" };
};

export default function ChildViewPage() {
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
        <p className="text-muted-foreground">Loading child data...</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/children")}>Back to List</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <img src={child.avatar} alt={child.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline">{child.name}</h1>
            <p className="text-muted-foreground">{child.grade} Grade • ID: {child.id}</p>
          </div>
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
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full bg-white border shadow-sm h-auto p-1">
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

        <TabsContent value="grades" className="mt-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-accent/30 border-b">
              <CardTitle>{language === "en" ? "Performance Report" : "Détails du Bulletin"}</CardTitle>
              <CardDescription>Term 1 - Sequence 1 & 2</CardDescription>
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
                  {child.grades.map((grade: any, idx: number) => {
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
                        <TableCell className="text-center">{grade.seq1.toFixed(2)}</TableCell>
                        <TableCell className="text-center">{grade.seq2.toFixed(2)}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{grade.moy.toFixed(2)}</TableCell>
                        <TableCell className="text-right pr-6">
                          <Badge variant="outline" className={cn("text-[10px] border-none text-white", appreciation.color)}>
                            {appreciation.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.keys(child.schedule).map((day) => (
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
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-8">
          {/* Today's Attendance Section */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{language === "en" ? "Today's Attendance" : "Présence d'Aujourd'hui"}</CardTitle>
              <CardDescription>{new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.todayAttendance.map((item: any, idx: number) => (
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
              ))}
            </CardContent>
          </Card>

          {/* Attendance Records Summary Section */}
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
                      <Eye className="w-3 h-3" /> {language === 'en' ? 'Full Preview' : 'Aperçu'}
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
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {previewDoc?.type === 'report' ? t("reportCard") : 
               previewDoc?.type === 'receipt' ? t("receipt") : t("idCard")}
            </DialogTitle>
            <DialogDescription>
              {language === 'en' ? 'Official document preview. Review before downloading.' : 'Aperçu du document officiel. Examinez avant de télécharger.'}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-8 rounded-lg">
            {/* REPORT CARD PREVIEW */}
            {previewDoc?.type === 'report' && (
              <div className="bg-white p-8 shadow-sm border border-border min-h-[500px] flex flex-col space-y-6">
                 <div className="flex justify-between items-start border-b-2 border-primary pb-4">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-primary">{child.schoolName}</h2>
                      <p className="text-[10px] text-muted-foreground uppercase">{child.schoolAddress}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary">Academic Year 2023/24</Badge>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 py-4 bg-accent/10 p-4 rounded-lg">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Student</p>
                      <p className="font-bold">{child.name}</p>
                      <p className="text-xs">{child.grade} Grade</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-muted-foreground font-bold">Matricule</p>
                      <p className="font-mono font-bold">{child.id}</p>
                    </div>
                 </div>

                 <Table className="border">
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="text-[10px] uppercase">Subject</TableHead>
                        <TableHead className="text-center text-[10px] uppercase">Coeff</TableHead>
                        <TableHead className="text-center text-[10px] uppercase">Moy/20</TableHead>
                        <TableHead className="text-right text-[10px] uppercase">Appreciation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {child.grades.map((g: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="font-bold py-2">{g.name}</TableCell>
                          <TableCell className="text-center py-2">{g.coeff}</TableCell>
                          <TableCell className="text-center py-2 font-bold">{g.moy}</TableCell>
                          <TableCell className="text-right py-2 text-xs italic">{getAppreciation(g.moy).text}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                 </Table>

                 <div className="mt-auto pt-8 flex justify-between items-end border-t border-dashed">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground underline">Parent's Signature</p>
                      <div className="h-12 w-32 border-b border-black/20" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold">Moyenne Générale: {child.stats.average.toFixed(2)}/20</p>
                      <p className="text-[10px] uppercase text-muted-foreground">The Principal</p>
                      <div className="w-16 h-16 mx-auto opacity-20 bg-primary rounded-full flex items-center justify-center">
                         <CheckCircle2 className="w-8 h-8" />
                      </div>
                    </div>
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
                 <div className="space-y-3 py-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Receipt No:</span>
                      <span className="font-mono font-bold">{previewDoc.data?.id}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-bold">{previewDoc.data?.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payee:</span>
                      <span className="font-bold">{child.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Description:</span>
                      <span className="font-bold">{previewDoc.data?.title}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t-2 border-primary flex justify-between items-center">
                      <span className="text-lg font-bold">TOTAL PAID:</span>
                      <span className="text-xl font-black text-primary">{previewDoc.data?.amount}</span>
                    </div>
                 </div>
                 <div className="text-center py-4 relative">
                    <div className="border-4 border-green-600/30 text-green-600 font-black text-3xl p-2 rounded inline-block rotate-[-12deg] opacity-50 absolute right-0 bottom-0">
                       PAID
                    </div>
                    <p className="text-[10px] italic text-muted-foreground">This is a system generated document.</p>
                 </div>
              </div>
            )}

            {/* ID CARD PREVIEW (ENLARGED) */}
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
                          <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Student Name" : "Nom de l'Élève"}</p>
                          <p className="font-bold text-xl leading-none">{child.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Matricule</p>
                          <p className="font-mono font-bold text-2xl text-secondary">{child.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Class" : "Classe"}</p>
                        <p className="text-lg font-bold">{child.grade}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Expiry" : "Expiration"}</p>
                        <p className="text-lg font-bold">Aug 2024</p>
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

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPreviewDoc(null)} className="gap-2">
              <Printer className="w-4 h-4" /> {language === 'en' ? 'Print' : 'Imprimer'}
            </Button>
            <Button onClick={() => { handleDownload(previewDoc?.type === 'report' ? 'Report Card' : 'Document'); setPreviewDoc(null); }} className="gap-2">
              <Download className="w-4 h-4" /> {t("download")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
