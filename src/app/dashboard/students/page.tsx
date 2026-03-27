
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
  AlertCircle,
  TrendingUp,
  ArrowUpCircle,
  LogOut,
  UserRoundCheck,
  Zap
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
import { Progress } from "@/components/ui/progress";

const MOCK_STUDENTS = [
  { id: "GBHS26S001", uid: "S1", name: "Alice Thompson", email: "alice.t@school.edu", phone: "+237 600 11 22 33", whatsapp: "+237 600 11 22 33", class: "2nde / Form 5", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s1/100/100", annualAvg: 16.45 },
  { id: "GBHS26S002", uid: "S2", name: "Bob Richards", email: "bob.r@school.edu", phone: "+237 600 44 55 66", whatsapp: "+237 600 44 55 66", class: "Terminale / Upper Sixth", section: "Anglophone Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s2/100/100", annualAvg: 14.20 },
  { id: "GBHS26S003", uid: "S3", name: "Charlie Davis", email: "charlie.d@school.edu", phone: "+237 600 77 88 99", whatsapp: "+237 600 77 88 99", class: "1ère / Lower Sixth", section: "Francophone Section", isLicensePaid: false, status: "active", avatar: "https://picsum.photos/seed/s3/100/100", annualAvg: 9.15 },
  { id: "GBHS26S004", uid: "S4", name: "Diana Prince", email: "diana.p@school.edu", phone: "+237 600 00 11 22", whatsapp: "+237 600 00 11 22", class: "Terminale / Upper Sixth", section: "Technical Section", isLicensePaid: true, status: "active", avatar: "https://picsum.photos/seed/s4/100/100", annualAvg: 17.10 },
  { id: "GBHS25S099", uid: "S5", name: "Ex-Student John", email: "john.ex@mail.com", class: "Terminale / Upper Sixth", section: "Anglophone Section", isLicensePaid: true, status: "graduated", avatar: "https://picsum.photos/seed/ex1/100/100", annualAvg: 12.00 },
];

const MOCK_PARENTS = [
  { id: "GBHS26P001", uid: "P1", name: "Mr. Robert Thompson", email: "robert.t@mail.cm", child: "Alice Thompson", phone: "+237 677 00 11 22", whatsapp: "+237 677 00 11 22", status: "active", avatar: "https://picsum.photos/seed/p1/100/100", type: "Father" },
  { id: "GBHS26P002", uid: "P2", name: "Mrs. Sarah Richards", email: "sarah.r@mail.cm", child: "Bob Richards", phone: "+237 699 33 44 55", whatsapp: "+237 699 33 44 55", status: "active", avatar: "https://picsum.photos/seed/p2/100/100", type: "Mother" },
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
  const [statusFilter, setStatusFilter] = useState("active");
  
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPromotionProcessing, setIsPromotionProcessing] = useState(false);
  
  const [studentList, setStudentList] = useState(MOCK_STUDENTS);
  const [parentList, setParentList] = useState(MOCK_PARENTS);
  const [editingUser, setEditingUser] = useState<any>(null);
  
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

  const isAdmin = ["SCHOOL_ADMIN", "SUB_ADMIN"].includes(user?.role || "");
  const isTeacher = user?.role === "TEACHER";

  const filteredStudents = useMemo(() => studentList.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesSection = sectionFilter === "all" || s.section === sectionFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesSection && matchesStatus;
  }), [studentList, searchTerm, classFilter, sectionFilter, statusFilter]);

  const promotionEligible = useMemo(() => studentList.filter(s => s.status === 'active'), [studentList]);

  const handlePromoteStudents = () => {
    setIsPromotionProcessing(true);
    setTimeout(() => {
      setStudentList(prev => prev.map(s => {
        if (s.status !== 'active') return s;
        
        const isPassed = (s.annualAvg || 0) >= 10;
        if (!isPassed) return s; // Repeaters stay in same class

        const currentIdx = CLASSES.indexOf(s.class);
        if (currentIdx === CLASSES.length - 1) {
          // It's a Terminale / Upper Sixth student graduating
          return { ...s, status: 'graduated' as any };
        } else {
          // Promote to next class
          return { ...s, class: CLASSES[currentIdx + 1] };
        }
      }));
      setIsPromotionProcessing(false);
      toast({
        title: "Promotion Cycle Complete",
        description: "Eligible students have been advanced. Terminal students marked as Graduated.",
      });
    }, 2500);
  };

  const handleWithdrawStudent = (uid: string) => {
    setStudentList(prev => prev.map(s => s.uid === uid ? { ...s, status: 'withdrawn' as any } : s));
    toast({ variant: "destructive", title: "Student Withdrawn", description: "Record moved to non-active registry." });
  };

  const handleFinalizeAdmission = () => {
    if (!newStudent.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const id = `GBHS26S00${studentList.length + 1}`;
      const created = { 
        ...newStudent, 
        id, 
        uid: Math.random().toString(), 
        status: "active" as any, 
        avatar: `https://picsum.photos/seed/${id}/200/200`,
        annualAvg: 0
      };
      setStudentList([created, ...studentList]);
      setIsProcessing(false);
      setIsAdmissionOpen(false);
      toast({ title: "Student Admitted", description: `Assigned ID: ${id}` });
    }, 1500);
  };

  const handleGenerateReport = () => {
    toast({ title: "Report Generation Initiated", description: "High-fidelity pedagogical registry is being prepared." });
  };

  const handleSaveEdit = () => {
    if (!editingUser.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      setStudentList(prev => prev.map(s => s.uid === editingUser.uid ? editingUser : s));
      setIsProcessing(false);
      setEditingUser(null);
      toast({ title: "Identity Updated" });
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
              Student Governance
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">Manage lifecycle from admission to graduation.</p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="flex-1 md:flex-none h-12 rounded-2xl font-bold gap-2 border-primary/10 bg-white" onClick={handleGenerateReport}>
              <FileDown className="w-4 h-4 text-primary" /> Export
            </Button>
            <Button className="flex-[2] md:flex-none gap-2 shadow-lg h-12 px-6 rounded-2xl font-bold" onClick={() => setIsAdmissionOpen(true)}>
              <UserPlus className="w-5 h-5" /> New Admission
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid w-full mb-8 bg-white shadow-sm border h-auto p-1.5 rounded-3xl grid-cols-2 md:w-[500px]">
          <TabsTrigger value="registry" className="gap-2 py-3 rounded-2xl transition-all font-bold text-xs sm:text-sm">
            <Users className="w-4 h-4" /> Student Registry
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="promotion" className="gap-2 py-3 rounded-2xl transition-all font-bold text-xs sm:text-sm">
              <ArrowUpCircle className="w-4 h-4" /> Promotion Center
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="registry" className="animate-in fade-in slide-in-from-bottom-2 mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-3xl border shadow-sm items-end">
            <div className="md:col-span-1 space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Search Registry</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Name or Matricule..." className="pl-10 h-11 bg-accent/20 border-none rounded-xl text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Lifecycle Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Global (All)</SelectItem>
                  <SelectItem value="active">Active Students</SelectItem>
                  <SelectItem value="graduated">Graduated (Ex-Students)</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn / Left</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Academic Section</Label>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Entire Node</SelectItem>
                  {SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Class Level</Label>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="h-11 bg-accent/20 border-none rounded-xl font-bold text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
            <CardContent className="p-0 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest border-b border-accent/20">
                  <TableRow>
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>Student Identity</TableHead>
                    <TableHead>Academic Level</TableHead>
                    <TableHead className="text-center">Lifecycle Status</TableHead>
                    <TableHead className="text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s) => (
                    <TableRow key={s.uid} className="group hover:bg-accent/5 transition-colors h-16 border-b last:border-0">
                      <TableCell className="pl-8 font-mono text-[10px] font-bold text-primary">{s.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent shrink-0">
                            <AvatarImage src={s.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{s.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary uppercase leading-tight">{s.name}</span>
                            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter">{s.section}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] border-primary/10 text-primary font-bold uppercase">{s.class}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-3 h-5 border-none",
                          s.status === 'active' ? "bg-green-100 text-green-700" : 
                          s.status === 'graduated' ? "bg-blue-100 text-blue-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {s.status === 'active' ? 'ENROLLED' : s.status === 'graduated' ? 'EX-STUDENT / ALUMNI' : 'WITHDRAWN'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/5">
                              <MoreVertical className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-none p-2">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black opacity-40 px-3">Governance Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer" onClick={() => router.push(`/dashboard/children/view?id=${s.id}`)}>
                              <Eye className="w-4 h-4 text-primary/60" /> 
                              <span className="font-bold text-xs">Access Dossier</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-xl cursor-pointer" onClick={() => setEditingUser({...s})}>
                              <Pencil className="w-4 h-4 text-primary/60" /> 
                              <span className="font-bold text-xs">Update Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-accent" />
                            <DropdownMenuItem className="text-destructive gap-3 rounded-xl cursor-pointer" onClick={() => handleWithdrawStudent(s.uid)}>
                              <LogOut className="w-4 h-4" /> 
                              <span className="font-bold text-xs">Formal Withdrawal</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredStudents.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-20 text-center text-muted-foreground font-medium bg-accent/5 italic">
                        No student records found in this registry category.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotion" className="animate-in fade-in slide-in-from-bottom-2 mt-0 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2.5rem]">
                <CardHeader className="bg-primary p-8 text-white">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-2xl text-secondary">
                        <ArrowUpCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-xl md:text-2xl font-black uppercase tracking-tight">Institutional Promotion Cycle</CardTitle>
                        <CardDescription className="text-white/60">Automated advancement based on 3rd term final results.</CardDescription>
                      </div>
                    </div>
                    <Button 
                      className="bg-secondary text-primary hover:bg-secondary/90 h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg gap-2"
                      onClick={handlePromoteStudents}
                      disabled={isPromotionProcessing}
                    >
                      {isPromotionProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      Execute Global Promotion
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto scrollbar-thin">
                  <Table>
                    <TableHeader className="bg-accent/10 uppercase text-[9px] font-black tracking-widest">
                      <TableRow>
                        <TableHead className="pl-8 py-4">Student Profile</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead className="text-center">Annual Moyenne</TableHead>
                        <TableHead className="text-right pr-8">Transition Plan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotionEligible.map((s) => {
                        const isPassed = (s.annualAvg || 0) >= 10;
                        const isTerminal = s.class === CLASSES[CLASSES.length - 1];
                        return (
                          <TableRow key={s.uid} className="hover:bg-accent/5 h-16 border-b last:border-0">
                            <TableCell className="pl-8">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border shrink-0"><AvatarImage src={s.avatar} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                                <span className="font-bold text-xs text-primary uppercase">{s.name}</span>
                              </div>
                            </TableCell>
                            <TableCell><span className="text-[10px] font-bold uppercase">{s.class}</span></TableCell>
                            <TableCell className="text-center">
                              <span className={cn("text-sm font-black", isPassed ? "text-green-600" : "text-red-600")}>
                                {s.annualAvg?.toFixed(2)} / 20
                              </span>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <div className="flex items-center justify-end gap-2">
                                {isPassed ? (
                                  isTerminal ? (
                                    <Badge className="bg-blue-100 text-blue-700 border-none text-[8px] font-black uppercase">GRADUATION ELIGIBLE</Badge>
                                  ) : (
                                    <Badge className="bg-green-100 text-green-700 border-none text-[8px] font-black uppercase">PROMOTE TO NEXT GRADE</Badge>
                                  )
                                ) : (
                                  <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase">REPEATER / MONITOR</Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm bg-blue-50 p-8 space-y-6 rounded-[2.5rem]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-black text-blue-900 uppercase">Governance Rules</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">Students with a cumulative annual average ≥ 10.00 are promoted.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">Promoted terminal students (Upper Sixth) are transitioned to Alumni status.</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-blue-800 leading-relaxed font-medium">Registry codes and historical data remain immutable for verified audits.</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-blue-100 flex flex-col items-center gap-4 text-center">
                   <QrCode className="w-24 h-24 opacity-10" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-600/40">Verified Promotion Node</p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ADMISSION DIALOG */}
      <Dialog open={isAdmissionOpen} onOpenChange={setIsAdmissionOpen}>
        <DialogContent className="sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-6 md:p-8 text-white relative shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl"><UserPlus className="w-8 h-8 text-secondary" /></div>
              <DialogTitle className="text-xl md:text-2xl font-black uppercase tracking-tighter">New Student Admission</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsAdmissionOpen(false)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
          </DialogHeader>
          <div className="p-6 md:p-10 space-y-8 max-h-[75vh] overflow-y-auto bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Identity Name</Label>
                <Input value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" placeholder="e.g. Alice Thompson" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Target Class Level</Label>
                <Select value={newStudent.class} onValueChange={(v) => setNewStudent({...newStudent, class: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Institutional Section</Label>
                <Select value={newStudent.section} onValueChange={(v) => setNewStudent({...newStudent, section: v})}>
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Date of Birth</Label>
                <Input type="date" value={newStudent.dob} onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl" />
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

      {/* EDIT USER DIALOG */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Edit Identity</DialogTitle>
            <DialogDescription className="text-white/60">Updating records for {editingUser?.name}.</DialogDescription>
            <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="absolute top-4 right-4 text-white hover:bg-white/10"><X className="w-6 h-6" /></Button>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Identity Name</Label>
              <Input value={editingUser?.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Current Class</Label>
              <Select value={editingUser?.class} onValueChange={(v) => setEditingUser({...editingUser, class: v})}>
                <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button onClick={handleSaveEdit} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
