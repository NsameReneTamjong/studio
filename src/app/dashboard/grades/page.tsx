"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { LoadingState, CardSkeleton } from "@/components/shared/loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Award, 
  CheckCircle2, 
  Eye, 
  Loader2, 
  Printer, 
  ShieldCheck, 
  History, 
  FileText, 
  User, 
  TrendingUp, 
  X, 
  Scale, 
  BookMarked, 
  Globe, 
  CheckCircle, 
  Info, 
  ArrowLeft, 
  Users, 
  PenTool,
  Filter,
  Save,
  ChevronRight,
  Search,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SUBJECTS = ["Advanced Physics", "Mathematics", "English Literature", "General Chemistry", "Biology", "History", "Geography"];

const MOCK_STUDENTS_GRADES = [
  { uid: "S1", id: "GBHS26S001", name: "Alice Thompson", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s1/100/100", seq1: 14.5, seq2: 16.0, status: "Passed" },
  { uid: "S2", id: "GBHS26S002", name: "Bob Richards", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s2/100/100", seq1: 18.0, seq2: 17.5, status: "Passed" },
  { uid: "S3", id: "GBHS26S003", name: "Charlie Davis", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s3/100/100", seq1: 9.5, seq2: 10.5, status: "Passable" },
  { uid: "S4", id: "GBHS26S004", name: "Diana Prince", class: "2nde / Form 5", avatar: "https://picsum.photos/seed/s4/100/100", seq1: 12.0, seq2: 13.0, status: "Passed" },
];

export default function GradeBookPage() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedClass, setSelectedClass] = useState("2nde / Form 5");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Physics");
  const [grades, setGrades] = useState(MOCK_STUDENTS_GRADES);

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = user?.role === "SCHOOL_ADMIN" || user?.role === "SUB_ADMIN";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleGradeChange = (uid: string, field: 'seq1' | 'seq2', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) && value !== "") return;
    if (numValue > 20 || numValue < 0) return;

    setGrades(prev => prev.map(s => {
      if (s.uid === uid) {
        return { ...s, [field]: numValue };
      }
      return s;
    }));
  };

  const handleCommitGrades = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsEditing(false);
      toast({
        title: "Registry Synchronized",
        description: `Marks for ${selectedSubject} have been committed to the institutional registry.`,
      });
    }, 1500);
  };

  const stats = useMemo(() => {
    const totalAvg = grades.reduce((acc, curr) => acc + (curr.seq1 + curr.seq2) / 2, 0) / grades.length;
    const passedCount = grades.filter(g => (g.seq1 + g.seq2) / 2 >= 10).length;
    return {
      average: totalAvg.toFixed(2),
      passRate: ((passedCount / grades.length) * 100).toFixed(0),
      standing: "4th / 45"
    };
  }, [grades]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-accent/20 rounded-xl animate-pulse" />
          <div className="h-10 w-32 bg-accent/20 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <Card className="p-8 border-none shadow-sm h-96 bg-accent/5 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              {isTeacher ? "Gradebook Management" : "Grade Registry"}
            </h1>
            <p className="text-muted-foreground mt-1">Official term records and pedagogical achievement tracking.</p>
          </div>
        </div>
        
        {isTeacher && (
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2 h-12 px-8 rounded-xl shadow-lg">
                <PenTool className="w-4 h-4" /> Enter Gradebook
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(false)} className="h-12 px-6 rounded-xl border-primary/20">
                <X className="w-4 h-4 mr-2" /> Cancel Entry
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp className="w-12 h-12" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Class Subject Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-secondary">{stats.average} / 20</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-secondary text-primary overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle2 className="w-12 h-12" /></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black opacity-60 uppercase tracking-widest">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.passRate}%</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Verified Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-black flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5 text-secondary" /> ALL SECURE
            </div>
          </CardContent>
        </Card>
      </div>

      {(isTeacher || isAdmin) && (
        <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 space-y-2 w-full">
            <Label className="text-[10px] font-black uppercase text-primary ml-1">Academic Section / Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-12 bg-primary/5 border-primary/10 rounded-2xl font-bold">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-2 w-full">
            <Label className="text-[10px] font-black uppercase text-primary ml-1">Pedagogical Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-12 bg-primary/5 border-primary/10 rounded-2xl font-bold">
                <div className="flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-secondary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-primary/10 bg-white group">
            <Filter className="w-4 h-4 mr-2 text-primary/40 group-hover:text-primary transition-colors" />
            Apply Filter
          </Button>
        </div>
      )}

      <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
        <CardHeader className="bg-primary p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <PenTool className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-black">Pedagogical Results Ledger</CardTitle>
                <CardDescription className="text-white/60">Verified marks for {selectedSubject} • {selectedClass}</CardDescription>
              </div>
            </div>
            {isEditing && (
              <Badge className="bg-secondary text-primary border-none font-black px-4 py-1 animate-pulse">
                INPUT MODE ACTIVE
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Matricule</TableHead>
                <TableHead>Student Identity</TableHead>
                <TableHead className="text-center">Sequence 1</TableHead>
                <TableHead className="text-center">Sequence 2</TableHead>
                <TableHead className="text-center">Term Moy/20</TableHead>
                <TableHead className="text-right pr-8">Dossier Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((s) => {
                const avg = ((s.seq1 + s.seq2) / 2).toFixed(2);
                const isPassed = parseFloat(avg) >= 10;
                
                return (
                  <TableRow key={s.uid} className="hover:bg-accent/5 transition-colors border-b last:border-0">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-primary">{s.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <Input 
                          type="number" 
                          step="0.25"
                          min="0"
                          max="20"
                          defaultValue={s.seq1}
                          onChange={(e) => handleGradeChange(s.uid, 'seq1', e.target.value)}
                          className="w-20 mx-auto text-center h-10 bg-accent/30 border-none font-black text-primary rounded-xl"
                        />
                      ) : (
                        <span className="font-black text-lg">{s.seq1.toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditing ? (
                        <Input 
                          type="number" 
                          step="0.25"
                          min="0"
                          max="20"
                          defaultValue={s.seq2}
                          onChange={(e) => handleGradeChange(s.uid, 'seq2', e.target.value)}
                          className="w-20 mx-auto text-center h-10 bg-accent/30 border-none font-black text-primary rounded-xl"
                        />
                      ) : (
                        <span className="font-black text-lg">{s.seq2.toFixed(2)}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={cn(
                          "font-black text-xl underline decoration-double underline-offset-4",
                          isPassed ? "text-primary" : "text-red-600"
                        )}>{avg}</span>
                        <Badge className={cn(
                          "text-[8px] border-none px-2 h-4",
                          isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {isPassed ? "PASSED" : "FAILED"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-primary hover:text-white rounded-xl transition-all"
                        onClick={() => router.push(`/dashboard/children/view?id=${s.id}`)}
                      >
                        <Eye className="w-3.5 h-3.5" /> Official Bulletin
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        {isEditing && (
          <CardFooter className="bg-accent/10 p-8 border-t border-accent flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-xl h-12 px-8 font-bold border-primary/10">Discard Changes</Button>
            <Button onClick={handleCommitGrades} disabled={isProcessing} className="h-12 px-10 rounded-xl shadow-xl font-black uppercase tracking-widest text-xs gap-3">
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Commit Sequence Marks
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-blue-50 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h4 className="text-xs font-black uppercase text-blue-700 tracking-widest">Pedagogical Compliance</h4>
          </div>
          <p className="text-[11px] text-blue-800 leading-relaxed font-medium italic">
            "All marks recorded here are subject to verification by the Institutional Academic Council. Ensure that assessments are graded fairly and conform to the Ministry of Secondary Education's standards."
          </p>
        </Card>
        
        <Card className="border-none shadow-sm bg-accent/20 p-6 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-accent">
                 <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                 <p className="text-xs font-black text-primary uppercase leading-tight">Node Integrity</p>
                 <p className="text-[10px] text-muted-foreground font-bold">Records are digitally signed and immutable once finalized.</p>
              </div>
           </div>
           <QrCode className="w-12 h-12 opacity-10" />
        </Card>
      </div>
    </div>
  );
}
