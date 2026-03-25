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
  AlertCircle
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
    createdAt: { toDate: () => new Date() }
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
    createdAt: { toDate: () => new Date() }
  }
];

const MOCK_GRADES = [
  { courseId: "PHY101", courseName: "Physics", seq1: 14, seq2: 16, coeff: 4, group: "Sciences" },
  { courseId: "MAT101", courseName: "Mathematics", seq1: 18, seq2: 17, coeff: 5, group: "Sciences" },
  { courseId: "ENG101", courseName: "English", seq1: 12, seq2: 13, coeff: 3, group: "Arts" },
];

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
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const { t, language } = useI18n();
  const studentId = searchParams.get("id"); 
  
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [previewDoc, setPreviewDoc] = useState<{ type: 'report' | 'receipt' | 'id', data?: any } | null>(null);

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

  const handleDownload = (docName: string) => {
    toast({
      title: t("download") + "...",
      description: `${docName} is being prepared for download.`,
    });
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
          <Button variant="outline" className="gap-2"><Mail className="w-4 h-4" /> Message</Button>
          <Button className="gap-2 shadow-lg" onClick={() => setPreviewDoc({ type: 'report' })}><Printer className="w-4 h-4" /> Print Bulletin</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{language === "en" ? "Term Average" : "Moyenne Trimestrielle"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{generalAverage.toFixed(2)} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{language === "en" ? "Evaluations" : "Évaluations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{MOCK_GRADES.length} Subjects</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-accent text-primary border border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">{language === "en" ? "License Status" : "Statut Licence"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> ACTIVE
            </div>
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
                    <p className="font-bold text-lg">{student.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Matricule ID</p>
                    <p className="font-mono font-bold text-lg text-primary">{student.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Institutional Email</p>
                    <p className="font-medium text-primary flex items-center gap-2"><Mail className="w-4 h-4"/> {student.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Grade / Section</p>
                    <p className="font-bold">{student.class} - Section {student.section || 'A'}</p>
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
                  <Badge className="bg-secondary text-primary border-none uppercase">{student.status || 'Active'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 text-sm">Join Date</span>
                  <span className="font-bold text-sm">Oct 12, 2023</span>
                </div>
                <div className="pt-6 border-t border-white/10 text-center">
                  <QrCode className="w-32 h-32 mx-auto text-white/20 mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-40">Digital ID Verified</p>
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
                <CardDescription>Academic Session 2024 - Demo Ledger</CardDescription>
              </div>
              <Button onClick={() => setPreviewDoc({ type: 'report' })} className="gap-2 bg-primary text-white shadow-lg">
                <Eye className="w-4 h-4" /> {language === 'en' ? 'View Official Bulletin' : 'Voir Bulletin Officiel'}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                    <TableHead className="pl-6 py-4">Subject</TableHead>
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
               <p className="text-xs font-bold text-primary italic">Term Average Calculation based on verified school coefficients.</p>
               <div className="text-right">
                  <p className="text-[10px] uppercase font-black text-muted-foreground">General Average</p>
                  <p className="text-2xl font-black text-primary">{generalAverage.toFixed(2)} / 20</p>
               </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <div className="col-span-full py-20 text-center border-2 border-dashed border-accent rounded-3xl opacity-40">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p>Timetable data synchronization coming in the next pedagogical update.</p>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{language === "en" ? "Presence Records" : "Registres de Présence"}</CardTitle>
              <CardDescription>Consolidated attendance logs from classroom registers.</CardDescription>
            </CardHeader>
            <CardContent className="py-10 text-center text-muted-foreground italic">
              Attendance tracking is currently being processed by the dean's office.
            </CardContent>
          </Card>
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
                <Card className="w-full max-w-sm border shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <GraduationCap className="w-32 h-32" />
                  </div>
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-6 h-6 text-secondary" />
                      <div>
                        <CardTitle className="text-sm font-bold tracking-tight">GBHS Deido</CardTitle>
                        <CardDescription className="text-white/60 text-[10px] uppercase font-bold tracking-widest">{t("idCard")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-6 space-y-4">
                    <div className="flex gap-6">
                      <Avatar className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg shrink-0">
                        <AvatarImage src={student.avatar} className="object-cover" />
                        <AvatarFallback className="bg-white/10 text-white text-3xl font-black">{student.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Student Name</p>
                          <p className="font-bold text-lg leading-none">{student.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Matricule</p>
                          <p className="font-mono font-bold text-secondary">{student.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 py-3 flex justify-between items-center text-[10px]">
                    <span className="flex items-center gap-1 opacity-60"><MapPin className="w-3 h-3" /> Douala, Cameroon</span>
                    <Button variant="ghost" size="sm" onClick={() => setPreviewDoc({ type: 'id' })} className="text-white hover:bg-white/10 h-7 text-[10px] gap-1">
                      <Eye className="w-3.5 h-3.5" /> Full Preview
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-none shadow-2xl">
          <DialogHeader className="p-6 bg-primary text-white no-print">
            <DialogTitle className="flex items-center gap-2 text-white">
              <Eye className="w-5 h-5" />
              {previewDoc?.type === 'report' ? t("reportCard") : 
               previewDoc?.type === 'receipt' ? t("receipt") : t("idCard")}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Official institutional document preview. Optimized for high-fidelity printing.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 md:p-8">
            {previewDoc?.type === 'report' && (
              <div className="bg-white p-6 md:p-10 shadow-sm border border-border min-h-[700px] flex flex-col space-y-6 font-serif text-black relative print:shadow-none print:border-none">
                 <div className="grid grid-cols-3 gap-4 items-start text-center border-b-2 border-black pb-6">
                    <div className="space-y-1 text-[9px] uppercase font-bold">
                      <p>Republic of Cameroon</p>
                      <p>Peace - Work - Fatherland</p>
                      <div className="h-px bg-black w-8 mx-auto my-1" />
                      <p>Ministry of Secondary Education</p>
                      <p>GBHS Deido</p>
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
                      <p>Littoral</p>
                    </div>
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h2 className="text-xl md:text-2xl font-black uppercase underline tracking-tighter">
                      REPORT CARD / BULLETIN DE NOTES
                    </h2>
                    <p className="font-bold text-sm italic">Academic Year: 2024</p>
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
                          <span className="font-bold uppercase opacity-60">Student Name:</span>
                          <span className="font-black uppercase">{student.name}</span>
                          <span className="font-bold uppercase opacity-60">Matricule / ID No:</span>
                          <span className="font-mono font-bold text-primary">{student.id}</span>
                          <span className="font-bold uppercase opacity-60">Grade:</span>
                          <span className="font-bold">{student.class}</span>
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
                        {MOCK_GRADES.map((g: any, i: number) => (
                          <TableRow key={i} className="border-black">
                            <TableCell className="font-bold py-1.5 border-r border-black text-[11px]">{g.courseName}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black">{g.coeff}</TableCell>
                            <TableCell className="text-center py-1.5 border-r border-black font-black text-primary">{((g.seq1+g.seq2)/2).toFixed(2)}</TableCell>
                            <TableCell className="text-right py-1.5 text-[10px] uppercase font-medium italic">{getAppreciation((g.seq1+g.seq2)/2).text}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-black bg-black/5 font-bold">
                           <TableCell className="border-r border-black text-right uppercase text-[10px]" colSpan={2}>General Average</TableCell>
                           <TableCell className="text-center border-r border-black text-lg font-black text-primary" colSpan={1}>
                             {generalAverage.toFixed(2)}
                           </TableCell>
                           <TableCell className="text-right uppercase text-[10px]" colSpan={1}>
                             Rank: 1st / 45
                           </TableCell>
                        </TableRow>
                      </TableBody>
                   </Table>
                 </div>

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
            )}

            {previewDoc?.type === 'id' && (
              <div className="flex justify-center p-8">
                <Card className="w-full max-w-md border shadow-xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative">
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-secondary" />
                      <div>
                        <CardTitle className="text-lg font-bold tracking-tight">GBHS Deido</CardTitle>
                        <CardDescription className="text-white/60 text-xs uppercase font-bold tracking-widest">{t("idCard")}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8 pb-8 space-y-6">
                    <div className="flex gap-8">
                      <Avatar className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 shadow-2xl shrink-0">
                        <AvatarImage src={student.avatar} className="object-cover" />
                        <AvatarFallback className="text-4xl font-black">{student.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Student Name</p>
                          <p className="font-bold text-xl leading-none">{student.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-white/50 uppercase font-bold">Matricule</p>
                          <p className="font-mono font-bold text-2xl text-secondary">{student.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 py-4 flex justify-between items-center">
                    <span className="flex items-center gap-1 opacity-60 text-xs"><MapPin className="w-4 h-4" /> Douala, Cameroon</span>
                    <Badge variant="secondary" className="bg-secondary text-primary border-none text-[10px] h-6 px-4">VALID 2024</Badge>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 bg-white border-t gap-3 sm:gap-0 no-print">
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={() => { handleDownload('Bulletin'); setPreviewDoc(null); }} className="gap-2 shadow-lg bg-primary text-white">
              <Download className="w-4 h-4" /> Download Digital Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
