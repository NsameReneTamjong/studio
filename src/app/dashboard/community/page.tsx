
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  MoreVertical, 
  User, 
  ShieldCheck, 
  Trash2, 
  Eye, 
  Ban, 
  Clock, 
  CheckCircle2, 
  UsersRound,
  FileText,
  TrendingUp,
  Activity,
  UserCheck,
  Building2,
  Fingerprint,
  Building,
  Plus,
  Network,
  UserPlus,
  ShieldAlert,
  ChevronRight,
  Settings2,
  LayoutGrid,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  FileSpreadsheet,
  GraduationCap,
  PenTool,
  Award,
  History,
  Mail,
  Calendar,
  MapPin,
  Lock,
  FileCheck,
  Users
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
interface SubAdminPermissions {
  manageStudents: boolean;
  manageStaff: boolean;
  generateReports: boolean;
  fullControl: boolean;
}

interface SchoolAdmin {
  id: string;
  name: string;
  role: string;
  purview: string;
  avatar: string;
  permissions: SubAdminPermissions;
}

// Mock Data
const INITIAL_SUB_SCHOOLS = [
  { id: "SEC-01", name: "Anglophone Section", type: "General", head: "Dr. Aris Tesla", headRole: "Vice Principal", students: 450, staff: 18, color: "bg-blue-500" },
  { id: "SEC-02", name: "Francophone Section", type: "General", head: "Mme. Ngono Celine", headRole: "Vice Principal", students: 620, staff: 24, color: "bg-emerald-500" },
  { id: "SEC-03", name: "Technical Section", type: "Technical", head: "Mr. Ebong", headRole: "Section Head", students: 214, staff: 12, color: "bg-purple-500" },
];

const INITIAL_ADMINS: SchoolAdmin[] = [
  { 
    id: "ADM-01", 
    name: "Principal Fonka", 
    role: "Principal", 
    purview: "Whole Institution", 
    avatar: "https://picsum.photos/seed/p1/100/100",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: true }
  },
  { 
    id: "ADM-02", 
    name: "Dr. Aris Tesla", 
    role: "Vice Principal", 
    purview: "Anglophone Section", 
    avatar: "https://picsum.photos/seed/t1/100/100",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: false }
  },
  { 
    id: "ADM-03", 
    name: "Mme. Ngono Celine", 
    role: "Vice Principal", 
    purview: "Francophone Section", 
    avatar: "https://picsum.photos/seed/b1/100/100",
    permissions: { manageStudents: true, manageStaff: false, generateReports: true, fullControl: false }
  },
];

const INITIAL_USERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100", status: "active", lastLogin: "2 hours ago", section: "Anglophone Section", dept: "Science Section A" },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", email: "aris.tesla@school.edu", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", lastLogin: "10 mins ago", section: "Anglophone Section", dept: "Physics Department" },
  { id: "B001", name: "Mme. Ngono Celine", role: "BURSAR", email: "celine.n@school.edu", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", lastLogin: "Yesterday", section: "Cross-Sectional", dept: "Finance Office" },
  { id: "L001", name: "Mr. Ebong", role: "LIBRARIAN", email: "ebong.lib@school.edu", avatar: "https://picsum.photos/seed/l1/100/100", status: "suspended", lastLogin: "3 days ago", section: "Technical Section", dept: "Resource Center" },
];

const MOCK_ACTIVITIES = [
  { id: 1, action: "Assignment Submitted", module: "Pedagogy", time: "Oct 24, 10:30 AM", detail: "Physics: Thermodynamics Lab", status: "Verified" },
  { id: 2, action: "Library Book Borrowed", module: "Library", time: "Oct 23, 02:15 PM", detail: "Calculus II (Ref: IGN-102)", status: "Verified" },
];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [subSchools, setSubSchools] = useState(INITIAL_SUB_SCHOOLS);
  const [admins, setAdmins] = useState<SchoolAdmin[]>(INITIAL_ADMINS);
  const [viewingUser, setViewingUser] = useState<any>(null);
  
  // Creation States
  const [isAddingSubSchool, setIsAddingSubSchool] = useState(false);
  const [isAppointingAdmin, setIsAppointingAdmin] = useState(false);
  
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    id: "",
    title: "",
    purview: "whole",
    permissions: {
      manageStudents: false,
      manageStaff: false,
      generateReports: false,
      fullControl: false
    }
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubSchool = () => {
    toast({ title: "Sub-School Created", description: "New institutional section has been registered." });
    setIsAddingSubSchool(false);
  };

  const handleAppointAdmin = () => {
    if (!newAdminData.name) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select a staff member to appoint." });
      return;
    }

    const newAdmin: SchoolAdmin = {
      id: newAdminData.id || `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: newAdminData.name,
      role: newAdminData.title || "Sub-Admin",
      purview: newAdminData.purview === 'whole' ? "Whole Institution" : newAdminData.purview.charAt(0).toUpperCase() + newAdminData.purview.slice(1) + " Section",
      avatar: `https://picsum.photos/seed/${newAdminData.name}/100/100`,
      permissions: newAdminData.permissions
    };

    setAdmins(prev => [...prev, newAdmin]);
    setIsAppointingAdmin(false);
    toast({ title: "Admin Appointed", description: `${newAdminData.name} has been assigned operational authority.` });
    setNewAdminData({ name: "", id: "", title: "", purview: "whole", permissions: { manageStudents: false, manageStaff: false, generateReports: false, fullControl: false } });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT': return 'bg-blue-100 text-blue-700';
      case 'TEACHER': return 'bg-purple-100 text-purple-700';
      case 'BURSAR': return 'bg-green-100 text-green-700';
      case 'LIBRARIAN': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const PermissionCheckbox = ({ 
    id, 
    label, 
    description, 
    checked, 
    onChange, 
    icon: Icon 
  }: { 
    id: string; 
    label: string; 
    description: string; 
    checked: boolean; 
    onChange: (val: boolean) => void;
    icon: any;
  }) => (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-xl border-2 transition-all",
      checked ? "border-primary bg-primary/5 shadow-sm" : "border-accent bg-white hover:border-accent-foreground/10"
    )}>
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-1" />
      <Label htmlFor={id} className="flex-1 cursor-pointer space-y-1">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-3.5 h-3.5", checked ? "text-primary" : "text-muted-foreground")} />
          <span className="font-bold text-sm">{label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
      </Label>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <UsersRound className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Community" : "Communauté Institutionnelle"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor activity, manage sub-schools, and define administrative hierarchy.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-accent flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground leading-none">Registered</p>
                <p className="text-lg font-black text-primary leading-tight">{users.length}</p>
              </div>
           </div>
        </div>
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-[800px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="registry" className="gap-2 py-3 rounded-xl transition-all">
            <UsersRound className="w-4 h-4" /> Registry
          </TabsTrigger>
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">
            <Building className="w-4 h-4" /> Sections
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2 py-3 rounded-xl transition-all">
            <ShieldCheck className="w-4 h-4" /> Admin Hierarchy
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2 py-3 rounded-xl transition-all">
            <Activity className="w-4 h-4" /> Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-0 animate-in fade-in slide-in-from-bottom-4">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, ID or role..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-accent/10 border-b border-accent/20">
                    <TableHead className="pl-8 py-4 font-black uppercase text-[10px] tracking-widest">Matricule</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">User Profile</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Institutional Unit</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="pr-8 text-right font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="group hover:bg-accent/5 border-b border-accent/10">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{u.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-accent">
                            <AvatarImage src={u.avatar} alt={u.name} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{u.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-primary leading-none mb-1">{u.name}</span>
                            <Badge variant="outline" className={cn("w-fit text-[8px] h-4 uppercase border-none tracking-tighter", getRoleColor(u.role))}>
                              {u.role}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-primary">{u.section}</p>
                          <p className="text-[10px] text-muted-foreground">{u.dept}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-tighter border-none px-3",
                          u.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button variant="ghost" size="icon" onClick={() => setViewingUser({ ...u, isAdmin: false })} className="rounded-full"><Eye className="w-4 h-4 text-primary" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Sub-School Sections</h3>
              <Dialog open={isAddingSubSchool} onOpenChange={setIsAddingSubSchool}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl"><Plus className="w-4 h-4" /> Add Section</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Institutional Section</DialogTitle>
                    <DialogDescription>Create a sub-school or specialized wing (e.g. Anglophone Wing).</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2"><Label>Section Name</Label><Input placeholder="e.g. Technical Wing" /></div>
                    <div className="space-y-2">
                      <Label>Section Head / Lead</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Assign staff..." /></SelectTrigger>
                        <SelectContent>{INITIAL_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter><Button onClick={handleCreateSubSchool}>Register Section</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subSchools.map(section => (
                <Card key={section.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <div className={cn("h-1.5 w-full", section.color)} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20">{section.type}</Badge>
                        <CardTitle className="text-xl font-black text-primary">{section.name}</CardTitle>
                      </div>
                      <div className="p-2 bg-accent rounded-xl"><Building className="w-5 h-5 text-primary" /></div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/10 space-y-1">
                      <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest leading-none">Section Head</p>
                      <p className="text-sm font-bold text-primary">{section.head}</p>
                      <Badge className="bg-secondary text-primary border-none text-[8px] h-4">{section.headRole}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-2 rounded-xl bg-accent/30">
                        <p className="text-[9px] font-black uppercase opacity-40">Students</p>
                        <p className="text-lg font-black">{section.students}</p>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-accent/30">
                        <p className="text-[9px] font-black uppercase opacity-40">Faculty</p>
                        <p className="text-lg font-black">{section.staff}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-accent/10 p-4">
                    <Button variant="ghost" className="w-full justify-between hover:bg-white text-xs font-bold">Manage Section <ChevronRight className="w-4 h-4" /></Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Administrative Hierarchy</h3>
              <Dialog open={isAppointingAdmin} onOpenChange={setIsAppointingAdmin}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl bg-secondary text-primary hover:bg-secondary/90 shadow-sm">
                    <ShieldCheck className="w-4 h-4" /> Appoint Sub-Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                  <DialogHeader className="bg-primary p-8 text-white">
                    <DialogTitle className="text-2xl font-black">Admin Appointment Suite</DialogTitle>
                    <DialogDescription className="text-white/60">Define administrative roles and operational authority for staff members.</DialogDescription>
                  </DialogHeader>
                  <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Select Staff Member</Label>
                        <Select onValueChange={(v) => {
                          const staff = INITIAL_USERS.find(u => u.id === v);
                          if (staff) setNewAdminData({...newAdminData, id: staff.id, name: staff.name});
                        }}>
                          <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Staff DB Search..." /></SelectTrigger>
                          <SelectContent>{INITIAL_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Designated Title</Label>
                        <Input 
                          placeholder="e.g. Vice Principal Academics" 
                          className="h-12 bg-accent/30 border-none rounded-xl"
                          value={newAdminData.title}
                          onChange={(e) => setNewAdminData({...newAdminData, title: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Operational Purview</Label>
                        <Select value={newAdminData.purview} onValueChange={(v) => setNewAdminData({...newAdminData, purview: v})}>
                          <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whole">Whole Institution</SelectItem>
                            <SelectItem value="anglophone">Anglophone Section</SelectItem>
                            <SelectItem value="francophone">Francophone Section</SelectItem>
                            <SelectItem value="technical">Technical Section</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b pb-2">
                        <Lock className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-black uppercase text-primary tracking-widest">Operational Authority</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <PermissionCheckbox 
                          id="p-students" 
                          label="Manage Students" 
                          description="Can handle admissions, class assignments and student records."
                          icon={GraduationCap}
                          checked={newAdminData.permissions.manageStudents}
                          onChange={(v) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStudents: v}})}
                        />
                        <PermissionCheckbox 
                          id="p-staff" 
                          label="Manage Staff" 
                          description="Can onboard and manage teacher duty cycles and portfolios."
                          icon={Users}
                          checked={newAdminData.permissions.manageStaff}
                          onChange={(v) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStaff: v}})}
                        />
                        <PermissionCheckbox 
                          id="p-reports" 
                          label="Generate Reports" 
                          description="Access to download financial, pedagogical and attendance logs."
                          icon={FileCheck}
                          checked={newAdminData.permissions.generateReports}
                          onChange={(v) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, generateReports: v}})}
                        />
                        <PermissionCheckbox 
                          id="p-full" 
                          label="Full Admin Control" 
                          description="Complete institutional oversight across all dashboard modules."
                          icon={ShieldCheck}
                          checked={newAdminData.permissions.fullControl}
                          onChange={(v) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, fullControl: v}})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="bg-accent/20 p-6 border-t border-accent flex sm:flex-row gap-3">
                    <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsAppointingAdmin(false)}>Cancel</Button>
                    <Button className="flex-1 h-12 rounded-xl shadow-lg font-bold" onClick={handleAppointAdmin}>Assign Authority</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map(adm => (
                <Card key={adm.id} className="border-none shadow-xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <CardHeader className="bg-primary p-6 text-white text-center pb-8 relative">
                    <div className="absolute top-4 right-4">
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white" onClick={() => setViewingUser({ ...adm, isAdmin: true })}>
                         <Eye className="w-4 h-4" />
                       </Button>
                    </div>
                    <Avatar className="h-20 w-20 border-4 border-white/20 mx-auto shadow-2xl mb-4">
                      <AvatarImage src={adm.avatar} />
                      <AvatarFallback>{adm.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-lg font-black">{adm.name}</CardTitle>
                    <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2">{adm.role}</Badge>
                  </CardHeader>
                  <CardContent className="p-6 -mt-4 bg-white rounded-t-3xl space-y-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                        <Zap className="w-3 h-3 text-secondary" /> pur·view / responsibility
                      </p>
                      <p className="text-sm font-bold text-primary">{adm.purview}</p>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                       <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Authority Granted</p>
                       <div className="flex flex-wrap gap-1">
                          {adm.permissions.fullControl ? (
                            <Badge className="bg-primary text-white border-none text-[8px] h-4">FULL CONTROL</Badge>
                          ) : (
                            <>
                              {adm.permissions.manageStudents && <Badge variant="outline" className="text-[8px] h-4 border-primary/20 text-primary">STUDENTS</Badge>}
                              {adm.permissions.manageStaff && <Badge variant="outline" className="text-[8px] h-4 border-primary/20 text-primary">STAFF</Badge>}
                              {adm.permissions.generateReports && <Badge variant="outline" className="text-[8px] h-4 border-primary/20 text-primary">REPORTS</Badge>}
                            </>
                          )}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-accent flex justify-between items-center">
                       <Button variant="outline" size="sm" className="rounded-xl h-8 px-4 text-[10px] font-black uppercase">Edit Duties</Button>
                       <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b">
              <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                <History className="w-4 h-4" /> Full Institutional Footprint
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/30">
                  <TableRow className="uppercase text-[10px] font-black">
                    <TableHead className="pl-8 py-4">Event / Action</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right pr-8">Integrity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_ACTIVITIES.map(act => (
                    <TableRow key={act.id}>
                      <TableCell className="pl-8 font-bold text-sm text-primary">{act.action}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[9px] font-black uppercase border-primary/10">{act.module}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{act.detail}</TableCell>
                      <TableCell className="text-right pr-8"><div className="inline-flex items-center gap-1 text-[10px] text-green-600 font-black"><CheckCircle2 className="w-3 h-3" /> {act.status}</div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Portfolio Drill-down */}
      <Dialog open={!!viewingUser} onOpenChange={() => setViewingUser(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="bg-primary p-8 text-white relative">
            <div className="absolute top-4 right-12 flex items-center gap-2">
               <Fingerprint className="w-4 h-4 opacity-30" />
               <span className="text-[10px] uppercase font-bold opacity-30 tracking-widest">Verified Digital ID</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl shrink-0">
                <AvatarImage src={viewingUser?.avatar} />
                <AvatarFallback className="text-4xl text-primary bg-white">{viewingUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <DialogTitle className="text-4xl font-black tracking-tight">{viewingUser?.name}</DialogTitle>
                    <Badge className="bg-secondary text-primary border-none font-black h-6">{viewingUser?.role}</Badge>
                  </div>
                  <DialogDescription className="text-white/60 text-lg flex items-center justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {viewingUser?.email || "internal@eduignite.cm"}</span>
                    <span className="opacity-30">|</span>
                    <span className="flex items-center gap-1.5 font-mono">ID: {viewingUser?.id}</span>
                  </DialogDescription>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                   <Badge variant="secondary" className="bg-white/10 text-white border-none gap-1.5 py-1 px-3">
                     <Building2 className="w-3.5 h-3.5" /> {viewingUser?.section || viewingUser?.purview}
                   </Badge>
                   <Badge variant="secondary" className="bg-white/10 text-white border-none gap-1.5 py-1 px-3">
                     <Calendar className="w-3.5 h-3.5" /> Active Record
                   </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 space-y-4 h-fit">
                  <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Operational pur·view
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground italic">
                    {viewingUser?.isAdmin 
                      ? `This administrator is assigned to the ${viewingUser?.purview} and is authorized to execute operations based on their verified authority profile.`
                      : `This account has active access to the ${viewingUser?.section} module. All actions performed are logged under the verified digital ID system.`
                    }
                  </p>
                </div>

                {viewingUser?.isAdmin && (
                  <div className="bg-accent/20 p-6 rounded-2xl border border-accent space-y-4">
                    <h3 className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Verified Authority Profile
                    </h3>
                    <div className="space-y-3">
                       {[
                         { label: "Manage Student Records", key: "manageStudents" },
                         { label: "Personnel & Staff Onboarding", key: "manageStaff" },
                         { label: "Pedagogical & Financial Reporting", key: "generateReports" },
                         { label: "Full Dashboard Governance", key: "fullControl" },
                       ].map(perm => (
                         <div key={perm.key} className="flex items-center justify-between py-2 border-b border-accent last:border-0">
                            <span className="text-sm font-medium">{perm.label}</span>
                            {viewingUser.permissions[perm.key as keyof SubAdminPermissions] ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Badge variant="outline" className="text-[8px] opacity-30">RESTRICTED</Badge>
                            )}
                         </div>
                       ))}
                    </div>
                  </div>
                )}
             </div>
          </div>
          <DialogFooter className="bg-accent/10 p-6 border-t flex justify-end">
            <Button onClick={() => setViewingUser(null)} className="rounded-xl px-10 h-12 shadow-lg font-black uppercase tracking-widest text-xs">Close Dossier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
