
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
  { id: "GBHS26S004", uid: "S4", name: "Diana Prince", email: "diana.p@school.edu", phone: "+237 600 00 11 22", whatsapp: "+237 600 00 11 22", class: "2nde / Form 5", section: "Technical Section", isLicensePaid: true, status: "inactive", avatar: "https://picsum.photos/seed/s4/100/100", guardianId: "GBHS26P002" },
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
      avatar: `https://picsum.photos/seed/${id}/200/200`
    };
    setParentList([...parentList, created]);
    setNewStudent({ ...newStudent, guardianId: id });
    setIsAddGuardianOpen(false);
    setNewGuardian({ name: "", email: "", phone: "", whatsapp: "", occupation: "Professional", type: "Father" });
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
        isLicensePaid: true,
        status: "active",
        avatar: `https://picsum.photos/seed/${studentId}/200/200`,
        guardianName: guardian?.name || "N/A",
        guardianMatricule: guardian?.id || "N/A",
        guardianType: guardian?.type || "Guardian",
        guardianPhone: guardian?.phone || "N/A",
        guardianEmail: guardian?.email || "N/A",
        guardianWhatsapp: guardian?.whatsapp || "N/A"
      };

      setStudentList([created, ...studentList]);
      setAdmissionSuccess(created);
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      setNewStudent({
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
      setEditingUser(null);
      toast({ title: "Account Updated", description: "Records saved successfully." });
    }, 800);
  };

  const handleViewLinked = (user: any, type: 'student' | 'parent') => {
    if (type === 'student') {
      const guardian = parentList.find(p => p.id === user.guardianId);
      const siblings = studentList.filter(s => s.guardianId === user.guardianId && s.id !== user.id);
      setViewingLinkedInfo({ type: 'student', user, guardian, siblings });
    } else {
      const children = studentList.filter(s => s.guardianId === user.id);
      setViewingLinkedInfo({ type: 'parent', user, children });
    }
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

        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
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
                  <TableHead>Contacts</TableHead>
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
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3 text-primary/40"/> {s.email}</p>
                        <div className="flex items-center gap-3">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5"><Smartphone className="w-3 h-3 text-primary/40"/> {s.phone}</p>
                          <p className="text-[10px] text-secondary flex items-center gap-1.5 font-bold"><MessageCircle className="w-3 h-3"/> {s.whatsapp}</p>
                        </div>
                      </div>
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
                        onViewLinked={() => handleViewLinked(s, 'student')}
                        status={s.status}
                        role={user?.role}
                        type="student"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {!isTeacher && (
            <TabsContent value="parents" className="m-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Parent Profile</TableHead>
                    <TableHead>Contacts</TableHead>
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
                            <Badge variant="outline" className="text-[8px] h-4 uppercase border-none bg-primary/5 text-primary font-black tracking-tighter mt-0.5">{p.type}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium"><Mail className="w-3 h-3 text-primary/40"/> {p.email}</p>
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold"><Smartphone className="w-3 h-3 text-primary/40"/> {p.phone}</p>
                            <p className="text-[10px] text-secondary flex items-center gap-1.5 font-black"><MessageCircle className="w-3 h-3"/> {p.whatsapp}</p>
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
                          onViewLinked={() => handleViewLinked(p, 'parent')}
                          status={p.status}
                          role={user?.role}
                          type="parent"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}
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
                <DialogDescription className="text-white/60">Phase 1: Biometric & Contact Registry</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAdmissionOpen(false)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto bg-white">
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

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-accent pb-2">
                <Smartphone className="w-4 h-4 text-primary/40" />
                <h3 className="text-xs font-black uppercase text-primary tracking-widest">Student Contacts</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Institutional Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input value={newStudent.email} onChange={(e) => setNewStudent({...newStudent, email: e.target.value})} placeholder="alice@school.edu" className="h-12 bg-accent/30 border-none rounded-xl pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Contact</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                    <Input value={newStudent.phone} onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})} placeholder="+237 6XX XX XX XX" className="h-12 bg-accent/30 border-none rounded-xl pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp Contact</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <Input value={newStudent.whatsapp} onChange={(e) => setNewStudent({...newStudent, whatsapp: e.target.value})} placeholder="+237 6XX XX XX XX" className="h-12 bg-accent/30 border-none rounded-xl pl-10 font-bold" />
                  </div>
                </div>
              </div>
            </div>

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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Guardian Type</Label>
                <Select value={newGuardian.type} onValueChange={(v) => setNewGuardian({...newGuardian, type: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GUARDIAN_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Occupation</Label>
                <Input value={newGuardian.occupation} onChange={(e) => setNewGuardian({...newGuardian, occupation: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Contact</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <Input value={newGuardian.phone} onChange={(e) => setNewGuardian({...newGuardian, phone: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl pl-10 font-bold" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <Input value={newGuardian.whatsapp} onChange={(e) => setNewGuardian({...newGuardian, whatsapp: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl pl-10 font-bold" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                <Input type="email" value={newGuardian.email} onChange={(e) => setNewGuardian({...newGuardian, email: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl pl-10" />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold bg-primary text-white" onClick={handleQuickAddGuardian}>
              Save Guardian Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW LINKED FAMILY INFO DIALOG */}
      <Dialog open={!!viewingLinkedInfo} onOpenChange={() => setViewingLinkedInfo(null)}>
        <DialogContent className="sm:max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <UsersRound className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Linked Family Registry</DialogTitle>
                <DialogDescription className="text-white/60">Institutional family tree & emergency context.</DialogDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setViewingLinkedInfo(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
              <X className="w-6 h-6" />
            </Button>
          </DialogHeader>
          <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto">
            {viewingLinkedInfo?.type === 'student' ? (
              <>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-accent pb-2">
                    <UserRound className="w-4 h-4 text-primary/40" />
                    <h3 className="text-xs font-black uppercase text-primary tracking-widest">Primary Guardian</h3>
                  </div>
                  {viewingLinkedInfo.guardian ? (
                    <Card className="border-none shadow-sm bg-accent/20 rounded-2xl overflow-hidden">
                      <CardContent className="p-6 flex items-center gap-6">
                        <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                          <AvatarImage src={viewingLinkedInfo.guardian.avatar} />
                          <AvatarFallback className="bg-primary text-white font-bold">{viewingLinkedInfo.guardian.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-black text-primary uppercase text-sm leading-none">{viewingLinkedInfo.guardian.name}</p>
                            <Badge variant="secondary" className="bg-secondary/20 text-primary border-none text-[8px] font-black h-4 px-1.5">{viewingLinkedInfo.guardian.type}</Badge>
                          </div>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase">{viewingLinkedInfo.guardian.id}</p>
                          <div className="flex flex-wrap items-center gap-4 pt-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground"><Phone className="w-3 h-3" /> {viewingLinkedInfo.guardian.phone}</span>
                            <span className="flex items-center gap-1 text-[10px] font-black text-secondary"><MessageCircle className="w-3 h-3" /> {viewingLinkedInfo.guardian.whatsapp}</span>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground"><Mail className="w-3 h-3" /> {viewingLinkedInfo.guardian.email}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="p-6 text-center border-2 border-dashed rounded-2xl bg-red-50 text-red-600 font-bold text-xs">
                      No linked guardian found in registry.
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-accent pb-2">
                    <Users className="w-4 h-4 text-primary/40" />
                    <h3 className="text-xs font-black uppercase text-primary tracking-widest">Siblings in Institution</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {viewingLinkedInfo?.siblings && viewingLinkedInfo.siblings.length > 0 ? viewingLinkedInfo.siblings.map((sib: any) => (
                      <div key={sib.id} className="flex items-center justify-between p-4 rounded-xl border bg-white group hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border">
                            <AvatarImage src={sib.avatar} />
                            <AvatarFallback>{sib.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-bold text-primary">{sib.name}</p>
                            <p className="text-[9px] font-mono text-muted-foreground uppercase">{sib.id} • {sib.class}</p>
                          </div>
                        </div>
                        <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black h-4">{sib.status}</Badge>
                      </div>
                    )) : (
                      <p className="text-[10px] text-muted-foreground italic text-center py-4">No siblings currently registered.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-accent pb-2">
                  <GraduationCap className="w-4 h-4 text-primary/40" />
                  <h3 className="text-xs font-black uppercase text-primary tracking-widest">Linked Students ({viewingLinkedInfo?.children?.length || 0})</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {viewingLinkedInfo?.children?.map((child: any) => (
                    <Card key={child.id} className="border-none shadow-sm bg-accent/10 hover:bg-accent/20 transition-all cursor-pointer overflow-hidden" onClick={() => router.push(`/dashboard/children/view?id=${child.id}`)}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                            <AvatarImage src={child.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary font-bold">{child.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="font-black text-primary uppercase text-xs">{child.name}</p>
                            <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase">{child.id} • {child.class}</p>
                            <Badge variant="outline" className="text-[7px] h-3.5 border-primary/10 text-primary/60 font-black tracking-tighter uppercase">{child.section}</Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-primary/40" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t border-accent flex justify-end">
             <div className="flex items-center gap-2 text-muted-foreground italic mr-auto">
                <ShieldCheck className="w-4 h-4 text-primary opacity-40" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Verified Institutional Linkage</p>
             </div>
             <Button onClick={() => setViewingLinkedInfo(null)} className="rounded-xl px-8 h-11 font-black uppercase text-[10px]">Close Registry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UserActionMenu({ onEdit, onToggleStatus, onView, onViewLinked, status, role, type }: any) {
  const isTeacher = role === "TEACHER";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-4 h-4"/></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-none">
        <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-4 py-2">Registry Context</DropdownMenuLabel>
        
        {onView && (
          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onView}>
            <Eye className="w-4 h-4 text-primary/60" /> <span className="font-bold text-xs">View Dashboard</span>
          </DropdownMenuItem>
        )}

        {onViewLinked && (
          <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onViewLinked}>
            <UsersRound className="w-4 h-4 text-primary/60" /> 
            <span className="font-bold text-xs">
              {type === 'student' ? 'View Parent/Siblings' : 'View Linked Children'}
            </span>
          </DropdownMenuItem>
        )}

        {!isTeacher && (
          <>
            <DropdownMenuItem className="gap-3 px-4 py-2.5 cursor-pointer" onClick={onEdit}>
              <Pencil className="w-4 h-4 text-primary/60" /> <span className="font-bold text-xs">Edit Dossier Details</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-accent" />
            <DropdownMenuItem 
              className={cn(
                "gap-3 px-4 py-2.5 cursor-pointer",
                status === 'active' ? "text-destructive hover:bg-red-50" : "text-green-600 hover:bg-green-50"
              )} 
              onClick={onToggleStatus}
            >
              {status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              <span className="font-bold text-xs">{status === 'active' ? 'Suspend Access' : 'Reactivate Node'}</span>
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
