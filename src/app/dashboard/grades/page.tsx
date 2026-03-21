
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Download, 
  Search, 
  FileText, 
  Award, 
  TrendingUp, 
  BookOpen, 
  User, 
  AlertCircle,
  History,
  CheckCircle2,
  Lock,
  ChevronRight,
  Eye,
  ArrowLeft,
  FileDown,
  Megaphone,
  Printer,
  ShieldCheck,
  Filter
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const CAMEROON_SUBJECTS = [
  { name: "Mathématiques", coeff: 5, group: "Sciences" },
  { name: "Physique-Chimie", coeff: 4, group: "Sciences" },
  { name: "Anglais", coeff: 3, group: "Languages" },
  { name: "Français", coeff: 3, group: "Languages" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

const MOCK_GRADES_TEACHER = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 12, coeff: 5 },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 8, seq2: 10.5, coeff: 5 },
];

const MOCK_MASTER_REPORTS = [
  { id: "S001", name: "Alice Thompson", avatar: "https://picsum.photos/seed/s1/100/100", average: 15.40, rank: "04/42", status: "Published", subjectsValidated: "12/12" },
  { id: "S002", name: "Bob Richards", avatar: "https://picsum.photos/seed/s2/100/100", average: 12.80, rank: "15/38", status: "Published", subjectsValidated: "12/12" },
  { id: "S003", name: "Charlie Davis", avatar: "https://picsum.photos/seed/s3/100/100", average: 14.20, rank: "08/40", status: "Validated", subjectsValidated: "11/12" },
  { id: "S004", name: "Diana Prince", avatar: "https://picsum.photos/seed/s4/100/100", average: 18.20, rank: "01/42", status: "Published", subjectsValidated: "12/12" },
  { id: "S005", name: "Ethan Hunt", avatar: "https://picsum.photos/seed/s5/100/100", average: 10.50, rank: "35/38", status: "Draft", subjectsValidated: "8/12" },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState("mathématiques");
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Marks Recorded", description: "Updated in the official registry." });
    }, 1000);
  };

  const handlePublishClass = () => {
    toast({
      title: "Publishing Bulletins",
      description: `Official results for ${selectedClass} are being released to portals.`,
    });
  };

  const handleBulkExport = () => {
    toast({
      title: "Generating Master PDF",
      description: `Compiling report cards for ${MOCK_MASTER_REPORTS.length} students in ${selectedClass}.`,
    });
  };

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-600" />
        <h1 className="text-xl font-bold">Personal Grades Unavailable</h1>
        <Button asChild><Link href="/dashboard/children">Go to My Children</Link></Button>
      </div>
    );
  }

  if (isAdmin) {
    const filteredReports = MOCK_MASTER_REPORTS.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              Institutional Report Cards
            </h1>
            <p className="text-muted-foreground mt-1">
              Validate averages and publish official bulletins for academic sessions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20" onClick={handleBulkExport}>
              <FileDown className="w-5 h-5 text-primary" /> Generate Master PDF
            </Button>
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={handlePublishClass}>
              <Megaphone className="w-5 h-5 text-secondary" /> Publish to Class
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-blue-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-blue-600 tracking-widest">Averages Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-blue-700">38/42</div>
              <p className="text-[10px] text-blue-600/60 font-bold mt-1">Validated by Teachers</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-green-600 tracking-widest">Published Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-green-700">85%</div>
              <p className="text-[10px] text-green-600/60 font-bold mt-1">Visible to Parents</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase font-black text-amber-600 tracking-widest">Pending Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-amber-700">4</div>
              <p className="text-[10px] text-amber-600/60 font-bold mt-1">Bulletins in Draft</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-white border-b p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent rounded-lg">
                  <Filter className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-muted-foreground leading-none">Class Filter</p>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[220px] h-9 bg-transparent border-none p-0 text-sm font-bold text-primary focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find student by name or ID..." 
                  className="pl-10 h-11 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-accent/10 border-b border-accent/20 hover:bg-accent/10">
                  <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Student Profile</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Subjects</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Term Average</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Rank</TableHead>
                  <TableHead className="text-center font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-accent/5 border-b border-accent/10">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{student.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/5 text-primary text-xs">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-primary">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="ghost" className="text-[10px] font-black uppercase text-muted-foreground">
                        {student.subjectsValidated} Val.
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-black text-primary text-lg">
                      {student.average.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center font-bold text-muted-foreground">
                      {student.rank}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                        student.status === 'Published' ? "bg-green-100 text-green-700" : 
                        student.status === 'Validated' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                          <Eye className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                          <Printer className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/20 p-4 border-t flex justify-between items-center">
            <div className="flex items-center gap-2 text-muted-foreground">
               <ShieldCheck className="w-4 h-4 text-primary" />
               <p className="text-[10px] uppercase font-bold tracking-widest italic">All bulletins are cryptographically signed for institutional validity.</p>
            </div>
            <p className="text-[10px] font-black text-primary uppercase">Total Enrolled: 42 Students</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">
            Grade Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter and validate student sequence marks for assigned subjects.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" /> Export Class Bulletin</Button>
          <Button className="gap-2 shadow-lg" onClick={handleSaveMarks} disabled={isSaving}>
            <Save className="w-4 h-4" /> Save Registry
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-[200px] h-11 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CAMEROON_SUBJECTS.map(s => (
                  <SelectItem key={s.name} value={s.name.toLowerCase()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-secondary/10 border-secondary/20 h-11 px-4 text-xs font-bold">Sequence 2</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-accent/30 font-bold uppercase text-[10px]">
              <TableRow>
                <TableHead className="pl-8 py-4">Matricule</TableHead>
                <TableHead>Student Profile</TableHead>
                <TableHead className="text-center">Note / 20</TableHead>
                <TableHead className="text-right pr-8">Appreciation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GRADES_TEACHER.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="pl-8 font-mono font-bold text-primary">{student.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Input 
                      defaultValue={student.seq1} 
                      className="w-16 h-9 mx-auto text-center font-bold bg-accent/30 border-none rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Badge variant="outline" className={cn("text-[9px] text-white border-none px-3 py-1", getAppreciation(student.seq1).color)}>
                      {getAppreciation(student.seq1).text}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
