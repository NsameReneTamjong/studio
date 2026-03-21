
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Search, FileText, Award, TrendingUp, BookOpen, User, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export default function GradeBookPage() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState("maths");

  const isTeacher = user?.role === "TEACHER" || user?.role === "SCHOOL_ADMIN";
  const isParent = user?.role === "PARENT";

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
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline">Gestion des Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Input sequence marks (0-20 scale).</p>
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <Button variant="outline" className="gap-2 flex-1 lg:flex-none"><FileText className="w-4 h-4" /> <span className="hidden sm:inline">Import</span></Button>
          <Button className="gap-2 shadow-lg flex-1 lg:flex-none"><Save className="w-4 h-4" /> Enregistrer</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner Matière" />
            </SelectTrigger>
            <SelectContent>
              {CAMEROON_SUBJECTS.map(s => (
                <SelectItem key={s.name} value={s.name.toLowerCase()}>{s.name} (Coeff {s.coeff})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <Select defaultValue="seq1">
            <SelectTrigger>
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seq1">Séquence 1</SelectItem>
              <SelectItem value="seq2">Séquence 2</SelectItem>
              <SelectItem value="seq3">Séquence 3</SelectItem>
              <SelectItem value="seq4">Séquence 4</SelectItem>
              <SelectItem value="seq5">Séquence 5</SelectItem>
              <SelectItem value="seq6">Séquence 6</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="relative flex-[1.5] min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Chercher un élève..." className="pl-10" />
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <CardTitle className="text-base md:text-lg">Classe: 2nde C / Lower Sixth Science</CardTitle>
            <Badge variant="outline" className="gap-1 bg-secondary/10 text-secondary border-secondary/20">
              <TrendingUp className="w-3 h-3"/> Coeff {CAMEROON_SUBJECTS.find(s => s.name.toLowerCase() === selectedSubject)?.coeff || 5}
            </Badge>
          </div>
          <CardDescription className="text-xs md:text-sm">Enter marks out of 20. Calculations are automatic.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/30 font-bold text-[10px] md:text-xs">
                <TableHead className="w-[100px] pl-4 md:pl-6">Matricule</TableHead>
                <TableHead className="min-w-[150px]">Nom de l'élève</TableHead>
                <TableHead className="text-center">Note / 20</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Appréciation</TableHead>
                <TableHead className="text-right pr-4 md:pr-6">Obs.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_GRADES_TEACHER.map((student) => (
                <TableRow key={student.id} className="text-xs md:text-sm">
                  <TableCell className="font-mono text-[10px] md:text-xs pl-4 md:pl-6">{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-center">
                    <Input 
                      defaultValue={student.seq1} 
                      className="w-14 md:w-20 h-8 md:h-9 mx-auto text-center font-bold text-sm" 
                      type="number" 
                      step="0.25"
                      min="0"
                      max="20"
                    />
                  </TableCell>
                  <TableCell className="text-center hidden sm:table-cell">
                    <Badge variant="outline" className={cn("text-[9px] text-white border-none", getAppreciation(student.seq1).color)}>
                      {getAppreciation(student.seq1).text}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-4 md:pr-6">
                    <Input placeholder="Commentaire..." className="h-8 text-[10px] max-w-[120px] ml-auto" />
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
