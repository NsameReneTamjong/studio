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
  ChevronRight
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
  { id: "GBHS26S001", uid: "S1", name: "Alice Thompson", email: "alice.t@school.edu", class: "2nde / Form 5", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s1/100/100" },
  { id: "GBHS26S002", uid: "S2", name: "Bob Richards", email: "bob.r@school.edu", class: "Terminale / Upper Sixth", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s2/100/100" },
  { id: "GBHS26S003", uid: "S3", name: "Charlie Davis", email: "charlie.d@school.edu", class: "1ère / Lower Sixth", section: "Francophone Section", isLicensePaid: false, status: "active", avatar: "https://picsum.photos/seed/s3/100/100" },
  { id: "GBHS26S004", uid: "S4", name: "Diana Prince", email: "diana.p@school.edu", class: "2nde / Form 5", section: "Technical Section", isLicensePaid: true, status: "inactive", avatar: "https://picsum.photos/seed/s4/100/100" },
];

const MOCK_PARENTS = [
  { id: "GBHS26P001", uid: "P1", name: "Mr. Robert Thompson", email: "robert.t@mail.cm", child: "Alice Thompson", phone: "+237 677 00 11 22", status: "active", avatar: "https://picsum.photos/seed/p1/100/100" },
  { id: "GBHS26P002", uid: "P2", name: "Mrs. Sarah Richards", email: "sarah.r@mail.cm", child: "Bob Richards", phone: "+237 699 33 44 55", status: "active", avatar: "https://picsum.photos/seed/p2/100/100" },
];

const CLASSES = ["6ème / Form 1", "5ème / Form 2", "4ème / Form 3", "3ème / Form 4", "2nde / Form 5", "1ère / Lower Sixth", "Terminale / Upper Sixth"];
const SECTIONS = ["Anglophone Section", "Francophone Section", "Technical Section"];
const REGIONS = ["Adamaoua", "Centre", "East", "Far North", "Littoral", "North", "North West", "South", "South West", "West"];

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

  // New Admission State
  const [newStudent, setNewStudent] = useState({
    name: "",
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
    occupation: "Professional",
  });

  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN", "SUB_ADMIN"].includes(user?.role || "");
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
    const list = type === 'student' ? studentList : parentList;
    const targetUser = list.find(u => u.uid === uid);
    
    if (!targetUser) return;

    const nextStatus = targetUser.status === "active" ? "inactive" : "active";
    const setter = type === 'student' ? setStudentList : setParentList;
    
    setter(prev => prev.map(u => u.uid === uid ? { ...u, status: nextStatus } : u));
    
    toast({ 
      title: `Account ${nextStatus === "active" ? "Activated" : "Suspended"}`, 
      description: `${targetUser.name} status updated.` 
    });
  };

  const handleQuickAddGuardian = () => {
    if (!newGuardian.name) return;
    const id = `GBHS26P00${parentList.length + 1}`;
    const created = {
      ...newGuardian,
      id,
      uid: Math.random().toString(36).substr(2, 9),
      child: "Pending Admission",
      status: "active",
      avatar: `https://picsum.photos/seed/${id}/100/100`
    };
    setParentList([...parentList, created]);
    setNewStudent({ ...newStudent, guardianId: created.id });
    setIsAddGuardianOpen(false);
    setNewGuardian({ name: "", email: "", phone: "", occupation: "Professional" });
    toast({ title: "Guardian Registered", description: `${created.name} added to registry.` });
  };

  const handleFinalizeAdmission = () => {
    if (!newStudent.name || !newStudent.guardianId) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please complete the required fields." });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const year = new Date().getFullYear().toString().slice(-2);
      const studentId = `GBHS${year}S00${studentList.length + 1}`;
      const guardian = parentList.find(p => p.id === newStudent.guardianId);
      
      const created = {
        ...newStudent,
        id: studentId,
        uid: Math.random().toString(36).substr(2, 9),
        email: `${studentId.toLowerCase()}@school.edu`,
        isLicensePaid: true,
        status: "active",
        avatar: `https://picsum.photos/seed/${studentId}/100/100`,
        guardianName: guardian?.name || "N/A",
        guardianMatricule: guardian?.id || "N/A"
      };

      setStudentList([created, ...studentList]);
      setAdmissionSuccess(created);
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      setNewStudent({
        name: "",
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
      toast({ title: "Admission Finalized", description: `${created.name} successfully onboarded.` });
    }, 1500);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    setIsProcessing(true);
    setTimeout(() => {
      if (editingUser.child) { // Parent
        setParentList(prev => prev.map(p => p.uid === editingUser.uid ? editingUser : p));
      } else { // Student
        setStudentList(prev => prev.map(s => s.uid === editingUser.uid ? editingUser : s));
      }
      setIsProcessing(false);
      const userName = editingUser.name;
      setEditingUser(null);
      toast({ title: "Account Updated", description: `${userName}'s records saved successfully.` });
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
            <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              Registry Governance
            </h1>
            <p className="text-muted-foreground mt-1">Manage institutional student records and parent accounts.</p>
          </div>
        </div>
        {isAdmin && (
          <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl w-full md:w-auto" onClick={() => setIsAdmissionOpen(true)}>
            <UserPlus className="w-5 h-5" /> New Admission
          </Button>
        )}
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className={cn(
          "grid w-full mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl",
          isTeacher ? "grid-cols-1 md:w-[200px]" : "grid-cols-2 md:w-[400px]"
        )}>
          <TabsTrigger value="students" className="gap-2 py-3 rounded-xl transition-all font-bold">
            <Users className="w-4 h-4" /> Students
          </TabsTrigger>
          {!isTeacher && (
            <TabsTrigger value="parents" className="gap-2 py-3 rounded-xl transition-all font-bold">
              <Heart className="w-4 h-4" /> Parents
            </TabsTrigger>
          )}
        </TabsList>

        <Card className="border-none shadow-xl overflow-hidden rounded-[2rem] bg-white">
          <CardHeader className="bg-white border-b p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Find student by name or ID..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 col-span-1 md:col-span-2 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-[140px]">
                  <Select value={sectionFilter} onValueChange={setSectionFilter}>
                    <SelectTrigger className="h-12 bg-accent/20 border-none rounded-xl font-bold">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-primary/40" />
                        <SelectValue placeholder="Sub-Schools" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[140px]">
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="h-12 bg-accent/20 border-none rounded-xl font-bold">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>

          <TabsContent value="students" className="m-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                  <TableHead className="pl-8 py-4">Matricule</TableHead>
                  <TableHead>Student Profile</TableHead>
                  <TableHead>Academic Level</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((s) => (
                  <TableRow key={s.uid} className="hover:bg-accent/5 border-b last:border-0">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{s.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary leading-tight">{s.name}</p>
                          <Badge variant="outline" className="text-[8px] h-4 uppercase border-none bg-primary/5 text-primary font-black tracking-tighter mt-0.5">
                            {s.section}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold whitespace-nowrap">{s.class}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 h-5 border-none",
                        s.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <UserActionMenu 
                        onEdit={() => setEditingUser(s)} 
                        onToggleStatus={() => handleToggleStatus(s.uid, 'student')} 
                        onView={() => router.push(`/dashboard/children/view?id=${s.id}`)}
                        status={s.status}
                        role={user?.role}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="parents" className="m-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-accent/10">
                <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                  <TableHead className="pl-8 py-4">Matricule</TableHead>
                  <TableHead>Parent Profile</TableHead>
                  <TableHead>Linked Child</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParents.map((p) => (
                  <TableRow key={p.uid} className="hover:bg-accent/5 border-b last:border-0">
                    <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{p.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                          <AvatarImage src={p.avatar} alt={p.name} />
                          <AvatarFallback className="bg-primary/5 text-primary font-bold">{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm text-primary">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{p.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold whitespace-nowrap">
                        {p.child}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase px-3 h-5 border-none",
                        p.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      )}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <UserActionMenu 
                        onEdit={() => setEditingUser(p)} 
                        onToggleStatus={() => handleToggleStatus(p.uid, 'parent')} 
                        status={p.status}
                        role={user?.role}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Card>
      </Tabs>

      {/* INSTITUTIONAL ADMISSION DIALOG */}
      <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
        <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <UserPlus className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Institutional Admission</DialogTitle>
                <DialogDescription className="text-white/60">Phase 1: Biometric & Origin Registry</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAdmissionOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto bg-white">
            {/* Student Personal Data */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <Baby className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Student Biometrics</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Student Name</Label>
                  <Input value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} placeholder="e.g. Alice Thompson" className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date of Birth</Label>
                  <Input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Gender</Label>
                  <div className="flex gap-2">
                    <Button 
                      variant={newStudent.gender === 'Male' ? 'default' : 'outline'} 
                      className="flex-1 rounded-xl h-12 gap-2" 
                      onClick={() => setNewStudent({...newStudent, gender: 'Male'})}
                    >
                      <Mars className="w-4 h-4" /> Male
                    </Button>
                    <Button 
                      variant={newStudent.gender === 'Female' ? 'default' : 'outline'} 
                      className="flex-1 rounded-xl h-12 gap-2" 
                      onClick={() => setNewStudent({...newStudent, gender: 'Female'})}
                    >
                      <Venus className="w-4 h-4" /> Female
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guardian / Parent</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select value={newStudent.guardianId} onValueChange={(v) => setNewStudent({...newStudent, guardianId: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                          <SelectValue placeholder="Select Parent..." />
                        </SelectTrigger>
                        <SelectContent>
                          {parentList.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="icon" className="h-12 w-12 rounded-xl bg-secondary text-primary hover:bg-secondary/90 shadow-lg" onClick={() => setIsAddGuardianOpen(true)}>
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Origin Data */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <MapPin className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Place of Origin</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Region</Label>
                  <Select value={newStudent.region} onValueChange={(v) => setNewStudent({...newStudent, region: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{REGIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Division</Label>
                  <Input value={newStudent.division} onChange={(e) => setNewStudent({...newStudent, division: e.target.value})} placeholder="e.g. Wouri" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sub-Division</Label>
                  <Input value={newStudent.subDivision} onChange={(e) => setNewStudent({...newStudent, subDivision: e.target.value})} placeholder="e.g. Douala 1er" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Village / Town of Birth</Label>
                  <Input value={newStudent.placeOfBirth} onChange={(e) => setNewStudent({...newStudent, placeOfBirth: e.target.value})} placeholder="e.g. Douala" className="h-12 bg-accent/30 border-none rounded-xl" />
                </div>
              </div>
            </div>

            {/* Academic Assignment */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <BookOpen className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Academic Assignment</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Class Level</Label>
                  <Select value={newStudent.class} onValueChange={(v) => setNewStudent({...newStudent, class: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sub-School / Section</Label>
                  <Select value={newStudent.section} onValueChange={(v) => setNewStudent({...newStudent, section: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-8 border-t border-accent">
            <Button className="w-full h-16 rounded-2xl shadow-2xl font-black uppercase tracking-widest text-sm gap-3 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" onClick={handleFinalizeAdmission} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6 text-secondary" />}
              Finalize Institutional Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QUICK ADD GUARDIAN DIALOG */}
      <Dialog open={isAddGuardianOpen} onOpenChange={setIsAddGuardianOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-secondary p-8 text-primary relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">New Guardian Registry</DialogTitle>
                <DialogDescription className="text-primary/60">Initialize parent record for linking.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAddGuardianOpen(false)} className="absolute top-4 right-4 text-primary/40 hover:text-primary">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guardian Full Name</Label>
              <Input value={newGuardian.name} onChange={(e) => setNewGuardian({...newGuardian, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp / Phone</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input value={newGuardian.phone} onChange={(e) => setNewGuardian({...newGuardian, phone: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl pl-10 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input type="email" value={newGuardian.email} onChange={(e) => setNewGuardian({...newGuardian, email: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold bg-primary text-white" onClick={handleQuickAddGuardian}>
              Save Guardian Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADMISSION SUCCESS & DOSSIER DIALOG */}
      <Dialog open={!!admissionSuccess} onOpenChange={() => setAdmissionSuccess(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <DialogHeader className="bg-primary p-8 text-white no-print relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Admission Dossier Generated</DialogTitle>
                  <DialogDescription className="text-white/60">Verified institutional onboarding packet for {admissionSuccess?.name}.</DialogDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAdmissionSuccess(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          <div className="bg-muted p-6 md:p-10 print:p-0 print:bg-white overflow-y-auto max-h-[70vh]">
            <div id="printable-admission-dossier" className="bg-white p-10 md:p-16 border-2 border-black/10 shadow-sm relative flex flex-col space-y-12 font-serif text-black print:border-none print:shadow-none min-w-[800px]">
               {/* National Header */}
               <div className="grid grid-cols-3 gap-2 items-start text-center border-b-2 border-black pb-6">
                  <div className="space-y-0.5 text-[8px] uppercase font-bold">
                    <p>Republic of Cameroon</p>
                    <p>Peace - Work - Fatherland</p>
                    <div className="h-px bg-black w-10 mx-auto my-1" />
                    <p>Ministry of Secondary Education</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src={user?.school?.logo || platformSettings.logo} alt="School" className="w-20 h-20 object-contain" />
                  </div>
                  <div className="space-y-0.5 text-[8px] uppercase font-bold">
                    <p>République du Cameroun</p>
                    <p>Paix - Travail - Patrie</p>
                    <div className="h-px bg-black w-10 mx-auto my-1" />
                    <p>Min. des Enseignements Secondaires</p>
                  </div>
               </div>

               <div className="text-center space-y-2">
                  <h2 className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-primary leading-tight">{user?.school?.name || "GOVERNMENT BILINGUAL HIGH SCHOOL DEIDO"}</h2>
                  <p className="text-[10px] md:text-xs font-bold uppercase opacity-60 tracking-[0.3em] underline underline-offset-4 decoration-double">OFFICIAL ADMISSION CERTIFICATE</p>
               </div>

               <div className="space-y-8 bg-accent/5 p-8 rounded-3xl border border-black/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="w-48 h-48" /></div>
                  
                  <div className="grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-3">
                       <Avatar className="w-32 h-32 border-4 border-white rounded-[2rem] shadow-xl">
                          <AvatarImage src={admissionSuccess?.avatar} />
                          <AvatarFallback className="text-4xl font-black">{admissionSuccess?.name?.charAt(0)}</AvatarFallback>
                       </Avatar>
                    </div>
                    <div className="col-span-9 space-y-6">
                       <div className="grid grid-cols-2 gap-8 text-sm">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Student Name</p>
                             <p className="text-lg font-black uppercase text-primary">{admissionSuccess?.name}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Matricule</p>
                             <div className="bg-primary text-secondary px-4 py-1 rounded-lg w-fit">
                                <p className="text-lg font-mono font-black">{admissionSuccess?.id}</p>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Class Level</p>
                             <p className="font-bold">{admissionSuccess?.class}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Assigned Section</p>
                             <p className="font-bold">{admissionSuccess?.section}</p>
                          </div>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1">Biometric Registry</h4>
                    <div className="space-y-2 text-xs">
                       <p><span className="font-bold opacity-60">Date of Birth:</span> {admissionSuccess?.dob}</p>
                       <p><span className="font-bold opacity-60">Gender:</span> {admissionSuccess?.gender}</p>
                       <p><span className="font-bold opacity-60">Origin:</span> {admissionSuccess?.region} Region</p>
                       <p><span className="font-bold opacity-60">Place of Birth:</span> {admissionSuccess?.placeOfBirth}, {admissionSuccess?.division}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-primary border-b border-black/10 pb-1">Guardian Information</h4>
                    <div className="space-y-2 text-xs">
                       <p><span className="font-bold opacity-60">Parent Name:</span> {admissionSuccess?.guardianName}</p>
                       <p><span className="font-bold opacity-60">Parent Matricule:</span> <span className="font-mono">{admissionSuccess?.guardianMatricule}</span></p>
                       <p className="italic text-muted-foreground">"Primary account linked for pedagogical tracking."</p>
                    </div>
                  </div>
               </div>

               <div className="border-2 border-black/10 p-8 rounded-[2rem] bg-primary/5 space-y-4">
                  <div className="flex items-center gap-3">
                     <p className="text-sm font-black uppercase text-primary">Incredible Welcome Message</p>
                  </div>
                  <p className="text-sm leading-relaxed italic text-muted-foreground font-medium">
                    "Welcome to the {user?.school?.name || "EduIgnite family"}. By joining our institution, you are embarking on a journey of pedagogical excellence and character transformation. Our secure digital node ensures that your academic records are maintained with the highest degree of integrity. Together, we build the leaders of tomorrow. Work hard, stay disciplined, and success will be yours."
                  </p>
                  <p className="text-right font-black text-xs uppercase tracking-tighter">— The Principal's Council</p>
               </div>

               <div className="pt-12 border-t border-black/5 flex justify-between items-end">
                  <div className="flex flex-col items-center gap-2">
                    <QrCode className="w-20 h-20 opacity-10" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40">Digital Node Verification</p>
                  </div>
                  <div className="text-center space-y-6 w-48">
                    <div className="h-14 w-full mx-auto bg-primary/5 rounded-xl border-b-2 border-black/40 relative flex items-center justify-center overflow-hidden shadow-inner">
                       <AdmissionSignature className="w-full h-full text-primary/20 p-2" />
                    </div>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">Registrar Signature</p>
                  </div>
               </div>

               <div className="text-center pt-6 border-t border-black/5">
                  <div className="flex items-center justify-center gap-3">
                    <img src={platformSettings.logo} alt="EduIgnite" className="w-4 h-4 object-contain opacity-20" />
                    <p className="text-[8px] font-black uppercase text-muted-foreground opacity-30 tracking-[0.4em]">
                      Powered by {platformSettings.name} • Secure Registry Node • 2024
                    </p>
                  </div>
               </div>
            </div>
          </div>

          <DialogFooter className="bg-accent/10 p-8 border-t no-print flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs" onClick={() => setAdmissionSuccess(null)}>
              Return to Registry
            </Button>
            <div className="flex flex-1 gap-2">
              <Button 
                variant="secondary" 
                className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2"
                onClick={() => toast({ title: "Packet Prepared", description: "PDF is being generated." })}
              >
                <Download className="w-4 h-4" /> Download PDF
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 shadow-2xl font-black uppercase tracking-widest text-xs gap-2 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95" 
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4" /> Print Dossier
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT USER DIALOG */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-black">Edit User Dossier</DialogTitle>
                <DialogDescription className="text-white/60">Update institutional records for {editingUser?.name}.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input value={editingUser?.name || ""} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            {editingUser?.class ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Class Level</Label>
                  <Select value={editingUser.class} onValueChange={(v) => setEditingUser({...editingUser, class: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Section</Label>
                  <Select value={editingUser.section} onValueChange={(v) => setEditingUser({...editingUser, section: v})}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Linked Student</Label>
                <Input value={editingUser?.child || ""} onChange={(e) => setEditingUser({...editingUser, child: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
              </div>
            )}
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={handleSaveEdit} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserActionMenu({ onEdit, onToggleStatus, onView, status, role }: any) {
  const isTeacher = role === "TEACHER";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-none">
        <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-4 py-2">Account Actions</DropdownMenuLabel>
        {onView && (
          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onView}>
            <Eye className="w-4 h-4 text-primary/60" /> <span className="font-bold text-xs">View Dashboard</span>
          </DropdownMenuItem>
        )}
        {!isTeacher && (
          <>
            <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onEdit}>
              <Pencil className="w-4 h-4 text-primary/60" /> <span className="font-bold text-xs">Edit Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-accent" />
            <DropdownMenuItem 
              className={cn(
                "gap-3 px-4 py-2.5 cursor-pointer",
                status === 'active' ? "text-destructive" : "text-green-600"
              )} 
              onClick={onToggleStatus}
            >
              {status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              <span className="font-bold text-xs">{status === 'active' ? 'Deactivate' : 'Activate'}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdmissionSignature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 25C15 25 20 15 25 15C30 15 35 30 40 30C45 30 50 10 55 10C60 10 65 35 70 35C75 35 80 20 85 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 30L85 10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="2 2" />
    </svg>
  );
}
