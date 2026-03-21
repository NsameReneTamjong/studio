
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Clock
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Mock Data for the selected child detail
const CHILDREN_DATA: Record<string, any> = {
  "S001": {
    name: "Alice Thompson",
    grade: "10th",
    id: "S001",
    avatar: "https://picsum.photos/seed/alice/200/200",
    stats: { average: 15.4, rank: "04/42", attendance: "98%" },
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
    }
  },
  "S004": {
    name: "Diana Prince",
    grade: "10th",
    id: "S004",
    avatar: "https://picsum.photos/seed/diana/200/200",
    stats: { average: 18.2, rank: "01/42", attendance: "100%" },
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
    }
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
  const { t, language } = useI18n();
  const studentId = searchParams.get("id");
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    if (studentId && CHILDREN_DATA[studentId]) {
      setChild(CHILDREN_DATA[studentId]);
    }
  }, [studentId]);

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
        <TabsList className="grid grid-cols-3 w-full max-w-md bg-white border shadow-sm h-12">
          <TabsTrigger value="grades" className="gap-2">
            <Award className="w-4 h-4" /> {language === "en" ? "Grades" : "Bulletin"}
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Calendar className="w-4 h-4" /> {language === "en" ? "Schedule" : "Emploi du Temps"}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2">
            <ClipboardCheck className="w-4 h-4" /> {language === "en" ? "Attendance" : "Présences"}
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
      </Tabs>
    </div>
  );
}
