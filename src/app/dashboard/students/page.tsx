
"use client";

import { useState, useMemo } from "react";
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
  Network
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

export default function StudentsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [studentList, setStudentList] = useState(MOCK_STUDENTS);
  const [parentList, setParentList] = useState(MOCK_PARENTS);
  const [editingUser, setEditingUser] = useState<any>(null);

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
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-secondary" />
            </div>
            Registry Governance
          </h1>
          <p className="text-muted-foreground mt-1">Manage institutional student records and parent accounts.</p>
        </div>
        {isAdmin && (
          <Button className="gap-2 shadow-lg h-12 px-6 rounded-2xl" onClick={() => setIsAdmissionOpen(true)}>
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
              
              <div className="flex gap-4 col-span-1 md:col-span-2">
                <div className="flex-1">
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
                <div className="flex-1">
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

          <TabsContent value="students" className="m-0">
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
                      <Badge variant="outline" className="text-[10px] border-primary/10 text-primary font-bold">{s.class}</Badge>
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

          <TabsContent value="parents" className="m-0">
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
                          <p className="text-[10px] text-muted-foreground">{p.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
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

      {/* EDIT USER DIALOG */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <DialogTitle className="text-2xl font-black">Edit User Dossier</DialogTitle>
                <DialogDescription className="text-white/60">Update institutional records for {editingUser?.name}.</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="text-white/40 hover:text-white">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input value={editingUser?.name || ""} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} className="h-12 bg-accent/30 border-none rounded-xl font-bold" />
            </div>
            {editingUser?.class ? (
              <div className="grid grid-cols-2 gap-4">
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
