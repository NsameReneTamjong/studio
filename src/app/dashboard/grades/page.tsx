
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
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Cameroonian grading appreciation mapping
const getAppreciation = (note: number) => {
  if (note >= 16) return { text: "Très Bien", color: "bg-green-600" };
  if (note >= 14) return { text: "Bien", color: "bg-green-500" };
  if (note >= 12) return { text: "Assez Bien", color: "bg-blue-500" };
  if (note >= 10) return { text: "Passable", color: "bg-amber-500" };
  if (note >= 8) return { text: "Médiocre", color: "bg-orange-500" };
  return { text: "Faible", color: "bg-red-500" };
};

const CAMEROON_SUBJECTS = [
  { name: "Mathématiques", coeff: 5, group: "Sciences" },
  { name: "Physique-Chimie", coeff: 4, group: "Sciences" },
  { name: "SVT", coeff: 2, group: "Sciences" },
  { name: "Anglais / English", coeff: 3, group: "Languages" },
  { name: "Français / French", coeff: 3, group: "Languages" },
  { name: "Histoire-Géo", coeff: 2, group: "Arts" },
  { name: "ECM (Citizenship)", coeff: 2, group: "Arts" },
  { name: "Informatique", coeff: 2, group: "Tech" },
  { name: "EPS", coeff: 2, group: "General" },
];

const MOCK_GRADES_TEACHER = [
  { id: "S001", name: "Alice Thompson", seq1: 14.5, seq2: 12, coeff: 5 },
  { id: "S002", name: "Bob Richards", seq1: 8, seq2: 10.5, coeff: 5 },
  { id: "S003", name: "Charlie Davis", seq1: 11, seq2: 9, coeff: 5 },
  { id: "S004", name: "Diana Prince", seq1: 18, seq2: 17.5, coeff: 5 },
  { id: "S005", name: "Ethan Hunt", seq1: 7.5, seq2: 6, coeff: 5 },
];

const MOCK_HISTORICAL_SUMMARIES = [
  { id: "H1", year: "2023/2024", term: "1st Term", passed: 38, failed: 4, percentage: 90.4 },
  { id: "H2", year: "2022/2023", term: "Annual", passed: 35, failed: 5, percentage: 87.5 },
  { id: "H3", year: "2022/2023", term: "2nd Term", passed: 32, failed: 8, percentage: 80.0 },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  
  const [selectedSubject, setSelectedSubject] = useState("mathématiques");
  const [selectedSequence, setSelectedSequence] = useState("seq1");
  const [isSaving, setIsSaving] = useState(false);
  const [viewingHistoryDetails, setViewingHistoryDetails] = useState<any>(null);

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

  const handleSaveMarks = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: language === 'en' ? "Marks Recorded" : "Notes Enregistrées",
        description: language === 'en' ? "Sequence marks have been successfully updated in the official registry." : "Les notes de la séquence ont été mises à jour avec succès dans le registre officiel.",
      });
    }, 1200);
  };

  if (isParent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-4">
        <div className="bg-amber-100 p-4 rounded-full">
          <AlertCircle className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Personal Grades Unavailable</h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-md">
          As a parent, you can view your children's report cards directly from the "My Children" section.
        </p>
        <Button asChild>
          <Link href="/dashboard/children">Go to My Children</Link>
        </Button>
      </div>
    );
  }

  // Calculate stats for student view
  const studentGrades = CAMEROON_SUBJECTS.map(s => ({
    ...s,
    note1: Math.floor(Math.random() * 10) + 10,
    note2: Math.floor(Math.random() * 8) + 10,
  })).map(s => ({
    ...s,
    moyenne: (s.note1 + s.note2) / 2,
    total: ((s.note1 + s.note2) / 2) * s.coeff
  }));

  const totalCoeff = studentGrades.reduce((acc, curr) => acc + curr.coeff, 0);
  const totalPoints = studentGrades.reduce((acc, curr) => acc + curr.total, 0);
  const generalAverage = totalPoints / totalCoeff;

  if (!isTeacher) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Bulletin de Notes</h1>
            <p className="text-sm text-muted-foreground mt-1">Republic of Cameroon - Secondary Education System</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select defaultValue="t1">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t1">1er Trimestre</SelectItem>
                <SelectItem value="t2">2ème Trimestre</SelectItem>
                <SelectItem value="t3">3ème Trimestre</SelectItem>
                <SelectItem value="annual">Annuel</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <Download className="w-4 h-4" /> Export Bulletin
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] md:text-xs font-medium text-white/80 uppercase tracking-wider">Moyenne Générale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{generalAverage.toFixed(2)} / 20</div>
              <p className="text-[10px] md:text-xs text-white/60 mt-1">Total Coeff: {totalCoeff}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Rang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">04 / 42</div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Top 10% of class</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Appréciation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{getAppreciation(generalAverage).text}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">Conduct: Excellent</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-wider">Absences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">02 h</div>
              <p className="text-[10px] md:text-xs text-red-500 mt-1">Unjustified: 00 h</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-accent/30 p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">Détails des Notes (1er Trimestre)</CardTitle>
            <CardDescription className="text-xs md:text-sm">Evaluation based on Sequence 1 & Sequence 2</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 font-bold uppercase text-[9px] md:text-[10px]">
                  <TableHead className="pl-4 md:pl-6 min-w-[150px]">Matières</TableHead>
                  <TableHead className="text-center">Coeff</TableHead>
                  <TableHead className="text-center">Seq 1</TableHead>
                  <TableHead className="text-center">Seq 2</TableHead>
                  <TableHead className="text-center min-w-[80px]">Moy/20</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Rang</TableHead>
                  <TableHead className="text-right pr-4 md:pr-6 min-w-[120px]">Appréciation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentGrades.map((subject, idx) => {
                  const appreciation = getAppreciation(subject.moyenne);
                  return (
                    <TableRow key={idx} className="text-xs md:text-sm">
                      <TableCell className="font-medium pl-4 md:pl-6">
                        <div>
                          <p className="truncate max-w-[120px] md:max-w-none">{subject.name}</p>
                          <p className="text-[9px] md:text-[10px] text-muted-foreground">{subject.group}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">{subject.coeff}</TableCell>
                      <TableCell className="text-center font-mono">{subject.note1.toFixed(1)}</TableCell>
                      <TableCell className="text-center font-mono">{subject.note2.toFixed(1)}</TableCell>
                      <TableCell className="text-center font-bold text-primary font-mono bg-accent/10">
                        {subject.moyenne.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center text-xs hidden sm:table-cell">{(idx % 3) + 1}e</TableCell>
                      <TableCell className="text-right pr-4 md:pr-6">
                        <Badge variant="outline" className={cn("text-[9px] md:text-[10px] border-none text-white px-2 py-0.5 whitespace-nowrap", appreciation.color)}>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">{language === 'en' ? 'Report Card Management' : 'Gestion des Notes'}</h1>
          <p className="text-sm text-muted-foreground mt-1">Institutional mark entry and performance tracking.</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <Button variant="outline" className="gap-2 flex-1 lg:flex-none"><FileText className="w-4 h-4" /> <span className="hidden sm:inline">Import Excel</span></Button>
          <Button className="gap-2 shadow-lg flex-1 lg:flex-none" onClick={handleSaveMarks} disabled={isSaving}>
            <Save className="w-4 h-4" /> {isSaving ? 'Enregistrement...' : (language === 'en' ? 'Save Registry' : 'Enregistrer')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="entry" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[400px] mb-6 bg-white shadow-sm border h-auto p-1">
          <TabsTrigger value="entry" className="gap-2 py-2">
            <CheckCircle2 className="w-4 h-4" /> {language === 'en' ? 'Mark Entry' : 'Saisie des Notes'}
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 py-2">
            <History className="w-4 h-4" /> {language === 'en' ? 'Results History' : 'Historique'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entry" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest pl-1">Assign Subject</p>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Sélectionner Matière" />
                </SelectTrigger>
                <SelectContent>
                  {CAMEROON_SUBJECTS.map(s => (
                    <SelectItem key={s.name} value={s.name.toLowerCase()}>{s.name} (Coeff {s.coeff})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px] space-y-1.5">
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest pl-1">Active Sequence</p>
              <Select value={selectedSequence} onValueChange={setSelectedSequence}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seq1">Séquence 1 (Locked)</SelectItem>
                  <SelectItem value="seq2">Séquence 2</SelectItem>
                  <SelectItem value="seq3">Séquence 3</SelectItem>
                  <SelectItem value="seq4">Séquence 4</SelectItem>
                  <SelectItem value="seq5">Séquence 5</SelectItem>
                  <SelectItem value="seq6">Séquence 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-[1.5] min-w-[200px] self-end">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Chercher un élève..." className="pl-10 bg-white" />
            </div>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="p-4 md:p-6 bg-white border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Entry Sheet: {CAMEROON_SUBJECTS.find(s => s.name.toLowerCase() === selectedSubject)?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedSequence === 'seq1' && (
                    <Badge variant="destructive" className="gap-1 bg-red-100 text-red-700 border-none">
                      <Lock className="w-3 h-3"/> Locked
                    </Badge>
                  )}
                  <Badge variant="outline" className="gap-1 bg-secondary/10 text-secondary border-secondary/20">
                    <TrendingUp className="w-3 h-3"/> Coeff {CAMEROON_SUBJECTS.find(s => s.name.toLowerCase() === selectedSubject)?.coeff || 5}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs md:text-sm">Enter marks out of 20 for {selectedSequence.toUpperCase()}. {selectedSequence === 'seq1' ? "This sequence is locked for modifications." : "Calculations are automatic."}</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/30 font-bold text-[10px] md:text-xs">
                    <TableHead className="w-[100px] pl-4 md:pl-6">Matricule</TableHead>
                    <TableHead className="min-w-[150px]">Nom de l'élève</TableHead>
                    <TableHead className="text-center">Note / 20</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">Appréciation</TableHead>
                    <TableHead className="text-right pr-4 md:pr-6">Observations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_GRADES_TEACHER.map((student) => (
                    <TableRow key={student.id} className="text-xs md:text-sm bg-white hover:bg-accent/5">
                      <TableCell className="font-mono text-[10px] md:text-xs pl-4 md:pl-6 font-bold text-primary">{student.id}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell className="text-center">
                        <Input 
                          defaultValue={student.seq1} 
                          disabled={selectedSequence === 'seq1'}
                          className="w-14 md:w-20 h-8 md:h-9 mx-auto text-center font-bold text-sm bg-accent/10 border-accent focus-visible:ring-primary" 
                          type="number" 
                          step="0.25"
                          min="0"
                          max="20"
                        />
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant="outline" className={cn("text-[9px] text-white border-none px-3 py-0.5", getAppreciation(student.seq1).color)}>
                          {getAppreciation(student.seq1).text}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-4 md:pr-6">
                        <Input placeholder="Observation..." className="h-8 text-[10px] max-w-[120px] ml-auto bg-transparent border-none italic focus-visible:ring-0" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="bg-accent/10 p-4 border-t flex justify-between items-center">
               <p className="text-[10px] text-muted-foreground italic flex items-center gap-1">
                 <AlertCircle className="w-3 h-3"/> {selectedSequence === 'seq1' ? "Contact Administration to unlock this registry." : "Ensure all marks are verified before final submission."}
               </p>
               <Button size="sm" className="gap-2 shadow-lg" onClick={handleSaveMarks} disabled={isSaving || selectedSequence === 'seq1'}>
                 <Save className="w-3.5 h-3.5" /> {language === 'en' ? 'Record Marks' : 'Valider'}
               </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="animate-in fade-in slide-in-from-bottom-2">
          {viewingHistoryDetails ? (
            <div className="space-y-6">
              <Button variant="ghost" className="gap-2" onClick={() => setViewingHistoryDetails(null)}>
                <ArrowLeft className="w-4 h-4" /> Back to History Summary
              </Button>
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-primary text-white">
                  <CardTitle>Historical Record: {viewingHistoryDetails.year} - {viewingHistoryDetails.term}</CardTitle>
                  <CardDescription className="text-white/60">Read-only institutional archive for {selectedSubject.toUpperCase()}.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="pl-6">Matricule</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-center">Final Mark / 20</TableHead>
                        <TableHead className="text-right pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_GRADES_TEACHER.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="pl-6 font-mono font-bold text-primary">{student.id}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-center font-black">{student.seq1.toFixed(1)}</TableCell>
                          <TableCell className="text-right pr-6">
                            <Badge className={student.seq1 >= 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                              {student.seq1 >= 10 ? "PASSED" : "FAILED"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-primary text-white flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Lock className="w-5 h-5 text-secondary" />
                      Locked Results History
                    </CardTitle>
                    <CardDescription className="text-white/60">Statistical summary of past term performance.</CardDescription>
                  </div>
                  <Badge className="bg-white/20 text-white border-none">Summary View</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 uppercase text-[10px] font-black tracking-widest">
                        <TableHead className="pl-6 py-4">Year</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead className="text-center">No. Passed</TableHead>
                        <TableHead className="text-center">No. Failed</TableHead>
                        <TableHead className="text-center">% Passed</TableHead>
                        <TableHead className="text-right pr-6">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_HISTORICAL_SUMMARIES.map((row) => (
                        <TableRow key={row.id} className="hover:bg-accent/5">
                          <TableCell className="pl-6 py-4 font-bold">{row.year}</TableCell>
                          <TableCell className="font-medium text-primary">{row.term}</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-100 text-green-700 border-none font-bold">{row.passed}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-red-100 text-red-700 border-none font-bold">{row.failed}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-mono font-black text-primary">
                            {row.percentage.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="gap-2 text-primary hover:bg-primary/10"
                              onClick={() => setViewingHistoryDetails(row)}
                            >
                              <Eye className="w-4 h-4" /> {language === 'en' ? 'View' : 'Voir'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="p-4 bg-muted/20 border-t flex justify-between items-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest italic">Historical records are finalized and cannot be modified.</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-3.5 h-3.5" /> Export All History
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
