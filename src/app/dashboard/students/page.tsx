
"use client";

import { useState, useMemo, useEffect } from "react";
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
  BookMarked,
  MoreVertical,
  Pencil,
  UserX,
  UserCheck,
  Eye,
  Heart,
  Mail,
  Smartphone,
  MessageCircle,
  X,
  Network,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Baby,
  Venus,
  Mars,
  Building2,
  Printer,
  QrCode,
  ChevronRight,
  UserRound,
  Fingerprint,
  UsersRound,
  History,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = [
  { id: "GBHS26S001", uid: "S1", name: "Alice Thompson", email: "alice.t@school.edu", phone: "+237 600 11 22 33", whatsapp: "+237 600 11 22 33", class: "2nde / Form 5", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s1/100/100", guardianId: "GBHS26P001" },
  { id: "GBHS26S002", uid: "S2", name: "Bob Richards", email: "bob.r@school.edu", phone: "+237 600 44 55 66", whatsapp: "+237 600 44 55 66", class: "Terminale / Upper Sixth", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s2/100/100", guardianId: "GBHS26P002" },
  { id: "GBHS26S003", uid: "S3", name: "Charlie Davis", email: "charlie.d@school.edu", phone: "+237 600 77 88 99", whatsapp: "+237 600 77 88 99", class: "1ère / Lower Sixth", section: "Francophone Section", isLicensePaid: false, status: "active", avatar: "https://picsum.photos/seed/s3/100/100", guardianId: "GBHS26P001" },
];

const MOCK_PARENTS = [
  { id: "GBHS26P001", uid: "P1", name: "Mr. Robert Thompson", email: "robert.t@mail.cm", child: "Alice Thompson", phone: "+237 677 00 11 22", whatsapp: "+237 677 00 11 22", status: "active", avatar: "https://picsum.photos/seed/p1/100/100", type: "Father" },
  { id: "GBHS26P002", uid: "P2", name: "Mrs. Sarah Richards", email: "sarah.r@mail.cm", child: "Bob Richards", phone: "+237 699 33 44 55", whatsapp: "+237 699 33 44 55", status: "active", avatar: "https://picsum.photos/seed/p2/100/100", type: "Mother" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const REGIONS = ["Adamaoua", "Centre", "East", "Far North", "Littoral", "North", "North West", "South", "South West", "West"];
const GUARDIAN_TYPES = ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Legal Guardian", "Other"];

export default function StudentsPage() {
  const { user, isLoading: isAuthLoading, platformSettings } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [studentList, setStudentList] = useState(MOCK_STUDENTS);
  const [parentList, setParentList] = useState(MOCK_PARENTS);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [admissionSuccess, setAdmissionSuccess] = useState<any>(null);
  const [viewingLinkedInfo, setViewingLinkedInfo] = useState<any>(null);

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    dob: "",
    gender: "Male",
    region: "Littoral",
    division: "",
    subDivision: "",
    placeOfBirth: "",
    guardianId: "",
    section: "Anglophone Section",
    class: "2nde / Form 5",
  });

  const [newGuardian, setNewGuardian] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    occupation: "Professional",
    type: "Father",
  });

  const isAdmin = ["SCHOOL_ADMIN", "SUB_ADMIN"].includes(user?.role || "");
  const isTeacher = user?.role === "TEACHER";

  const filteredStudents = useMemo(() => studentList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    return matchesSearch && matchesClass && matchesSection;
  }), [studentList, searchTerm, classFilter, sectionFilter]);

  const filteredParents = useMemo(() => parentList.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  ), [parentList, searchTerm]);

  const handleToggleStatus = (uid: string, type: 'student' | 'parent') => {
    const setter = type === 'student' ? setStudentList : setParentList;
    setter(prev => prev.map(u => u.uid === uid ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
    toast({ title: "Status Updated" });
  };

  const handleFinalizeAdmission = () => {
    if (!newStudent.name || !newStudent.guardianId) return;
    setIsProcessing(true);
    setTimeout(() => {
      const id = `GBHS26S00${studentList.length + 1}`;
      const created = { ...newStudent, id, uid: Math.random().toString(), status: "active", avatar: `https://picsum.photos/seed/${id}/200/200`, admissionDate: new Date().toLocaleDateString() };
      setStudentList([created, ...studentList]);
      setAdmissionSuccess(created);
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      toast({ title: "Student Admitted" });
    }, 1500);
  };

  const handleSaveEdit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (editingUser.child) setParentList(prev => prev.map(p => p.uid === editingUser.uid ? editingUser : p));
      else setStudentList(prev => prev.map(s => s.uid === editingUser.uid ? editingUser : s));
      setIsProcessing(false);
      setEditingUser(null);
      toast({ title: "Profile Updated" });
    }, 800);
  };

  if (isAuthLoading) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white shadow-sm shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              Registry Suite
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Student and parent lifecycle management.</p>
          </div>
        </div>
        {isAdmin && (
          <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl w-full md:w-auto font-bold" onClick={() => setIsAdmissionOpen(true)}>
            <UserPlus className="w-5 h-5" /> New Admission
          </Button>
        )}
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl grid-cols-2 md:w-[400px]">
          <TabsTrigger value="students" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Users className="w-4 h-4" /> Students</TabsTrigger>
          {!isTeacher && <TabsTrigger value="parents" className="gap-2 py-3 rounded-xl transition-all font-bold text-xs sm:text-sm"><Heart className="w-4 h-4" /> Parents</TabsTrigger>}
        </TabsList>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
          <CardHeader className="bg-white border-b p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search registry..." className="pl-10 h-11 bg-accent/20 border-none rounded-xl text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={sectionFilter} onValueChange={setSectionFilter}>
                  <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl font-bold text-xs"><SelectValue placeholder="Sections" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Sections</SelectItem>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl font-bold text-xs"><SelectValue placeholder="Classes" /></SelectTrigger>
                  <SelectContent><SelectItem value="all">All Classes</SelectItem>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <TabsContent value="students" className="m-0">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Profile</TableHead>
                    <TableHead className="hidden md:table-cell">Academic Level</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.uid} className="hover:bg-accent/5 h-16">
                      <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                          <div><p className="font-bold text-xs md:text-sm text-primary uppercase leading-none">{s.name}</p><p className="text-[8px] font-black text-muted-foreground md:hidden">{s.class}</p></div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-[9px] border-primary/10 text-primary font-bold">{s.class}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn("text-[8px] font-black uppercase px-2 h-5 border-none", s.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>{s.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setEditingUser(s)}><MoreVertical className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </div>
        </Card>
      </Tabs>

      {/* ADMISSION DIALOG RESPONSIVE */}
      <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
        <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><UserPlus className="w-8 h-8 text-secondary" /></div>
              <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter">New Student Admission</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAdmissionOpen(false)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
          </DialogHeader>
          <div className="p-6 md:p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><Label>Full Name</Label><Input value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="h-11 rounded-xl bg-accent/20" /></div>
              <div className="space-y-2"><Label>Class</Label><Select value={newStudent.class} onValueChange={(v) => setNewStudent({...newStudent, class: v})}><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Section</Label><Select value={newStudent.section} onValueChange={(v) => setNewStudent({...newStudent, section: v})}><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2">
                <Label>Parent / Guardian</Label>
                <div className="flex gap-2">
                  <Select value={newStudent.guardianId} onValueChange={(v) => setNewStudent({...newStudent, guardianId: v})}><SelectTrigger className="h-11 rounded-xl flex-1"><SelectValue placeholder="Select Parent" /></SelectTrigger><SelectContent>{parentList.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
                  <Button size="icon" className="h-11 w-11 rounded-xl bg-secondary text-primary" onClick={() => setIsAddGuardianOpen(true)}><Plus className="w-5 h-5" /></Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-14 rounded-2xl shadow-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-primary text-white" onClick={handleFinalizeAdmission} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Finalize Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
