
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/tabs";
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
  CalendarDays
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
    attendanceHistory: [
      { date: "May 24, 2024", subject: "Physics 101", status: "present" },
      { date: "May 23, 2024", subject: "Calculus II", status: "present" },
      { date: "May 22, 2024", subject: "Physics 101", status: "late" },
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
    attendanceHistory: [
      { date: "May 24, 2024", subject: "Math Honors", status: "present" },
      { date: "May 23, 2024", subject: "English Lit", status: "present" },
      { date: "May 22, 2024", subject: "Chemistry", status: "present" },
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

        <TabsContent value="attendance" className="mt-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>{language === "en" ? "Recent Attendance History" : "Historique des Présences"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.attendanceHistory.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-accent">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      item.status === 'present' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {item.status === 'present' ? <ClipboardCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{item.subject}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
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
                  <Button variant="outline" size="icon" onClick={() => handleDownload("Report Card")}>
                    <Download className="w-4 h-4" />
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
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(`Receipt ${receipt.id}`)}>
                          <Download className="w-4 h-4" />
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
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Class" : "Classe"}</p>
                        <p className="text-sm font-bold">{child.grade}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold">{language === "en" ? "Expires" : "Expire"}</p>
                        <p className="text-sm font-bold">Aug 2024</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-white/5 py-3 flex justify-between items-center text-[10px]">
                    <span className="flex items-center gap-1 opacity-60"><MapPin className="w-3 h-3" /> {child.schoolAddress}</span>
                    <Badge variant="secondary" className="bg-secondary text-primary border-none text-[8px] h-4">VALID 2023-24</Badge>
                  </CardFooter>
                </Card>
              </div>
              <div className="flex justify-center">
                <Button className="w-full max-w-sm gap-2" onClick={() => handleDownload("Student ID Card")}>
                  <Download className="w-4 h-4" /> {t("download")} {t("idCard")}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
