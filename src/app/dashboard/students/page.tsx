
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  User, 
  Users,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
  Info,
  BookOpen,
  Download,
  FileDown,
  Filter,
  GraduationCap,
  BookMarked
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MOCK_STUDENTS = [
  { id: "GBHS26S001", uid: "S1", name: "Alice Thompson", email: "alice.t@school.edu", class: "2nde / Form 5", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "GBHS26S002", uid: "S2", name: "Bob Richards", email: "bob.r@school.edu", class: "Terminale / Upper Sixth", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "GBHS26S003", uid: "S3", name: "Charlie Davis", email: "charlie.d@school.edu", class: "1ère / Lower Sixth", isLicensePaid: false, status: "active", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "GBHS26S004", uid: "S4", name: "Diana Prince", email: "diana.p@school.edu", class: "2nde / Form 5", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s4/100/100" },
  { id: "GBHS26S005", uid: "S5", name: "Ethan Hunt", email: "ethan.h@school.edu", class: "3ème / Form 4", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s5/100/100" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

// Define high-fidelity teacher assignments (Multiple classes and subjects)
interface Assignment {
  class: string;
  subjects: string[];
}

const TEACHER_ASSIGNMENTS: Record<string, Assignment[]> = {
  "GBHS26T001": [
    { class: "2nde / Form 5", subjects: ["Physics", "Chemistry"] },
    { class: "1ère / Lower Sixth", subjects: ["Advanced Physics"] },
    { class: "3ème / Form 4", subjects: ["General Science"] }
  ],
};

const ALL_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "English", "French", "Biology", "History", "Geography", "General Science", "Advanced Physics"];

export default function StudentsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [admissionForm, setAdmissionForm] = useState({
    name: "",
    class: "2nde / Form 5",
  });

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(user?.role || "");
  
  // Get teacher's actual pedagogical load
  const assignments = useMemo(() => {
    if (!isTeacher || !user?.id) return [];
    return TEACHER_ASSIGNMENTS[user.id] || [];
  }, [isTeacher, user?.id]);

  const assignedClasses = useMemo(() => assignments.map(a => a.class), [assignments]);
  const availableSubjects = useMemo(() => {
    if (!isTeacher) return ALL_SUBJECTS;
    if (classFilter === 'all') {
      // Return all subjects the teacher teaches across all their classes
      const allSubs = new Set<string>();
      assignments.forEach(a => a.subjects.forEach(s => allSubs.add(s)));
      return Array.from(allSubs);
    }
    // Return subjects for the specifically selected class
    return assignments.find(a => a.class === classFilter)?.subjects || [];
  }, [isTeacher, classFilter, assignments]);

  // Strict role-based redirect for unauthorized roles
  useEffect(() => {
    if (!isAuthLoading && user && !["SCHOOL_ADMIN", "TEACHER", "SUPER_ADMIN"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isAuthLoading, router]);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      // 1. Teacher Privacy: Only see assigned classes
      if (isTeacher && !assignedClasses.includes(s.class)) {
        return false;
      }

      // 2. Class Filter
      const matchesClass = classFilter === "all" || s.class === classFilter;
      if (!matchesClass) return false;

      // 3. Subject Filter (Pedagogical context)
      // Note: In this high school MVP, we assume students in a class are relevant to the teacher's subject filter
      // if that teacher teaches that subject to that class.
      if (isTeacher && subjectFilter !== "all") {
        const teachesInThisClass = assignments.find(a => a.class === s.class);
        if (!teachesInThisClass?.subjects.includes(subjectFilter)) return false;
      }

      // 4. Search filter
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchTerm, classFilter, subjectFilter, isTeacher, assignedClasses, assignments]);

  const handleAdmission = async () => {
    if (!admissionForm.name) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name is required." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      toast({ title: "Admission Validated", description: "New student record has been initialized in the institutional registry." });
    }, 1000);
  };

  const handleDownloadList = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const filename = isTeacher 
        ? `${subjectFilter !== 'all' ? subjectFilter : 'Students'} - ${classFilter === 'all' ? 'All Classes' : classFilter}.pdf`
        : `Institutional_Registry_${new Date().getFullYear()}.xlsx`;
        
      toast({ 
        title: "Export Successful", 
        description: `Pedagogical dossier "${filename}" has been generated.` 
      });
    }, 1500);
  };

  if (isAuthLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Synchronizing Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            {isTeacher ? "Pedagogical Registry" : "Institutional Registry"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isTeacher 
              ? `Managing ${filtered.length} students across ${assignedClasses.length} assigned classes.`
              : "Manage official student records and new admissions for the entire institution."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20 text-primary font-bold bg-white" onClick={handleDownloadList} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            {isTeacher ? "Download Class List" : "Export Registry"}
          </Button>
          {isAdmin && (
            <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={() => setIsAdmissionOpen(true)}>
              <UserPlus className="w-5 h-5" /> New Admission
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-none shadow-sm bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Filtered Students</p>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-700">{filtered.length}</div>
            <p className="text-[9px] font-bold text-blue-600/60 uppercase mt-1">Active View</p>
          </CardContent>
        </Card>
        {isTeacher && (
          <>
            <Card className="border-none shadow-sm bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Class Load</p>
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-purple-700">{assignedClasses.length}</div>
                <p className="text-[9px] font-bold text-purple-600/60 uppercase mt-1">Assigned Levels</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-emerald-50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Subjects</p>
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-700">{availableSubjects.length}</div>
                <p className="text-[9px] font-bold text-emerald-600/60 uppercase mt-1">Teaching Duty</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
        <CardHeader className="bg-white border-b p-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="relative flex-1">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-1.5 block">Search Registry</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find student by name or Matricule..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="space-y-1.5 w-full sm:w-[220px]">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1 flex items-center gap-2">
                  <GraduationCap className="w-3 h-3" /> {isTeacher ? "Assigned Class" : "Class Level"}
                </Label>
                <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setSubjectFilter('all'); }}>
                  <SelectTrigger className="h-12 bg-accent/20 border-none rounded-xl font-bold">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isTeacher ? "All My Classes" : "Entire School"}</SelectItem>
                    {(isTeacher ? assignedClasses : CLASSES).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 w-full sm:w-[220px]">
                <Label className="text-[10px] font-black uppercase text-primary ml-1 flex items-center gap-2">
                  <BookMarked className="w-3 h-3" /> Pedagogical Subject
                </Label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="h-12 bg-primary/5 border-primary/20 text-primary font-bold rounded-xl">
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5" />
                      <SelectValue placeholder="All Subjects" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isTeacher ? "All My Subjects" : "All Curriculum"}</SelectItem>
                    {availableSubjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-accent/10">
              <TableRow className="uppercase text-[10px] font-black tracking-widest border-b border-accent/20">
                <TableHead className="pl-8 py-4">Matricule</TableHead>
                <TableHead>Student Profile</TableHead>
                <TableHead>Academic Level</TableHead>
                <TableHead className="text-center">License</TableHead>
                <TableHead className="text-right pr-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10 group">
                  <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={s.avatar} alt={s.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{s.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1 group-hover:text-secondary transition-colors">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{s.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold bg-white">
                      {s.class}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {s.isLicensePaid ? (
                      <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black uppercase px-3 h-5">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-none text-[9px] font-black uppercase gap-1 px-3 h-5">
                        <Lock className="w-2.5 h-2.5" /> Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all" asChild title="View Student Portfolio">
                      <Link href={`/dashboard/children/view?id=${s.id}`}>
                        <Info className="w-4 h-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-60 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                      <Search className="w-12 h-12 text-primary" />
                      <p className="font-bold text-sm">No students found in this pedagogical view.</p>
                      <Button variant="link" size="sm" onClick={() => { setClassFilter('all'); setSubjectFilter('all'); setSearchTerm(''); }}>
                        Clear all filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-6 border-t flex justify-between items-center">
           <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="w-5 h-5 text-primary opacity-40" />
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-black tracking-widest italic opacity-40 leading-none">
                  {isTeacher ? "Pedagogical Privacy Active" : "Institutional Master Registry"}
                </p>
                <p className="text-[8px] font-bold uppercase opacity-20 leading-none">Verified Digital Node Record</p>
              </div>
           </div>
           {isTeacher && (
             <p className="text-[10px] font-black text-primary uppercase tracking-tighter">
               Total {filtered.length} students matching active teaching load
             </p>
           )}
        </CardFooter>
      </Card>

      {/* ADMISSION DIALOG (ADMIN ONLY) */}
      <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
        <DialogContent className="sm:max-w-xl rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black">Student Admission</DialogTitle>
                <DialogDescription className="text-white/60">Initialize institutional registry record.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Student Name</Label>
              <Input value={admissionForm.name} onChange={(e) => setAdmissionForm({...admissionForm, name: e.target.value})} placeholder="e.g. Jean Dupont" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Class Assignment</Label>
              <Select value={admissionForm.class} onValueChange={(v) => setAdmissionForm({...admissionForm, class: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
              <Info className="w-5 h-5 text-primary opacity-40" />
              <p className="text-[10px] text-muted-foreground italic">New admissions are automatically assigned a unique institutional matricule upon confirmation.</p>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3 bg-primary text-white" onClick={handleAdmission} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Finalize Admission & Generate ID
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
