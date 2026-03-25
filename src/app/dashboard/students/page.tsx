
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
  FileDown
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
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];

// Mock mapping of which classes specific teachers teach
const TEACHER_CLASS_ASSIGNMENTS: Record<string, string[]> = {
  "GBHS26T001": ["2nde / Form 5"], // Dr. Tesla only teaches Form 5
};

export default function StudentsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [admissionForm, setAdmissionForm] = useState({
    name: "",
    class: "2nde / Form 5",
  });

  const isTeacher = user?.role === "TEACHER";
  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(user?.role || "");
  const teacherClasses = user?.id ? (TEACHER_CLASS_ASSIGNMENTS[user.id] || []) : [];

  // Strict role-based redirect for unauthorized roles
  useEffect(() => {
    if (!isAuthLoading && user && !["SCHOOL_ADMIN", "TEACHER", "SUPER_ADMIN"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isAuthLoading, router]);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      // 1. Role-based visibility check: Teachers only see their assigned classes
      if (isTeacher && !teacherClasses.includes(s.class)) {
        return false;
      }

      // 2. Search filter
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // 3. Class dropdown filter
      const matchesClass = classFilter === "all" || s.class === classFilter;
      
      return matchesSearch && matchesClass;
    });
  }, [searchTerm, classFilter, isTeacher, teacherClasses]);

  const handleAdmission = async () => {
    if (!admissionForm.name) {
      toast({ variant: "destructive", title: "Missing Info", description: "Name is required." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      toast({ title: "Admission Validated", description: "New student record has been initialized locally." });
    }, 1000);
  };

  const handleDownloadList = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({ 
        title: "Export Successful", 
        description: `Student list for ${classFilter === 'all' ? 'Assigned Classes' : classFilter} has been generated.` 
      });
    }, 1500);
  };

  if (isAuthLoading) return (
    <div className="flex justify-center p-20"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>
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
              ? `Manage students in your assigned classes: ${teacherClasses.join(", ")}.`
              : "Manage official student records and new admissions for the entire institution."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isTeacher && (
            <Button variant="outline" className="gap-2 shadow-sm h-12 px-6 rounded-2xl border-primary/20 text-primary font-bold" onClick={handleDownloadList} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
              Download List
            </Button>
          )}
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
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Total Students</p>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-black text-blue-700">{filtered.length}</div>
            <p className="text-[9px] font-bold text-blue-600/60 uppercase mt-1">Filtered Registry</p>
          </CardContent>
        </Card>
        {isTeacher && (
          <Card className="border-none shadow-sm bg-purple-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest">Teaching Load</p>
                <BookOpen className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-purple-700">{teacherClasses.length}</div>
              <p className="text-[9px] font-bold text-purple-600/60 uppercase mt-1">Class Levels</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-white border-b p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or Matricule..." 
                className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1">
                <Label className="text-[9px] font-black uppercase text-muted-foreground ml-1">Assigned Class</Label>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-[220px] h-11 bg-accent/20 border-none rounded-xl font-bold">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isTeacher ? "All My Classes" : "All Institution Classes"}</SelectItem>
                    {(isTeacher ? teacherClasses : CLASSES).map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
                <TableRow key={s.id} className="hover:bg-accent/5 transition-colors border-b border-accent/10">
                  <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                        <AvatarImage src={s.avatar} alt={s.name} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-primary leading-none mb-1">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground">{s.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold">{s.class}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {s.isLicensePaid ? (
                      <Badge className="bg-green-100 text-green-700 border-none text-[9px] font-black uppercase">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-none text-[9px] font-black uppercase gap-1">
                        <Lock className="w-2.5 h-2.5" /> Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent" asChild>
                      <Link href={`/dashboard/children/view?id=${s.id}`}>
                        <Info className="w-4 h-4 text-primary" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">
                    No students found in your assigned registry.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-accent/10 p-4 border-t flex justify-between items-center">
           <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
              <p className="text-[10px] uppercase font-bold tracking-widest italic opacity-40">
                {isTeacher ? "Privacy Mode: Viewing assigned classes only." : "Institutional Master Registry synchronized."}
              </p>
           </div>
        </CardFooter>
      </Card>

      <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">Student Admission</DialogTitle>
            <DialogDescription className="text-white/60">Initialize institutional registry record.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label>Full Student Name</Label>
              <Input value={admissionForm.name} onChange={(e) => setAdmissionForm({...admissionForm, name: e.target.value})} placeholder="e.g. Jean Dupont" className="h-12 bg-accent/30 border-none rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Class Level</Label>
              <Select value={admissionForm.class} onValueChange={(v) => setAdmissionForm({...admissionForm, class: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={handleAdmission} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-5 h-5 animate-pulse" /> : "Admit & Generate ID"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
