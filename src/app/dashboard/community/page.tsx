
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
  Users,
  Pencil,
  UserX
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
  status: "active" | "inactive";
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
    status: "active",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: true }
  },
  { 
    id: "ADM-02", 
    name: "Dr. Aris Tesla", 
    role: "Vice Principal", 
    purview: "Anglophone Section", 
    avatar: "https://picsum.photos/seed/t1/100/100",
    status: "active",
    permissions: { manageStudents: true, manageStaff: true, generateReports: true, fullControl: false }
  },
  { 
    id: "ADM-03", 
    name: "Mme. Ngono Celine", 
    role: "Vice Principal", 
    purview: "Francophone Section", 
    avatar: "https://picsum.photos/seed/b1/100/100",
    status: "active",
    permissions: { manageStudents: true, manageStaff: false, generateReports: true, fullControl: false }
  },
];

const INITIAL_USERS = [
  { id: "S001", name: "Alice Thompson", role: "STUDENT", email: "alice.t@school.edu", avatar: "https://picsum.photos/seed/s1/100/100", status: "active", lastLogin: "2 hours ago", section: "Anglophone Section", dept: "Science Section A" },
  { id: "T001", name: "Dr. Aris Tesla", role: "TEACHER", email: "aris.tesla@school.edu", avatar: "https://picsum.photos/seed/t1/100/100", status: "active", lastLogin: "10 mins ago", section: "Anglophone Section", dept: "Physics Department" },
  { id: "B001", name: "Mme. Ngono Celine", role: "BURSAR", email: "celine.n@school.edu", avatar: "https://picsum.photos/seed/b1/100/100", status: "active", lastLogin: "Yesterday", section: "Cross-Sectional", dept: "Finance Office" },
  { id: "L001", name: "Mr. Ebong", role: "LIBRARIAN", email: "ebong.lib@school.edu", avatar: "https://picsum.photos/seed/l1/100/100", status: "suspended", lastLogin: "3 days ago", section: "Technical Section", dept: "Resource Center" },
];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [subSchools, setSubSchools] = useState(INITIAL_SUB_SCHOOLS);
  const [admins, setAdmins] = useState<SchoolAdmin[]>(INITIAL_ADMINS);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);
  
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

  const handleToggleAdminStatus = (id: string) => {
    setAdmins(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'active' ? 'inactive' : 'active';
        toast({ title: `Admin ${nextStatus === 'active' ? 'Activated' : 'Suspended'}`, description: `${a.name} is now ${nextStatus}.` });
        return { ...a, status: nextStatus };
      }
      return a;
    }));
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
      status: "active",
      permissions: newAdminData.permissions
    };

    setAdmins(prev => [...prev, newAdmin]);
    setIsAppointingAdmin(false);
    toast({ title: "Admin Appointed", description: `${newAdminData.name} has been assigned operational authority.` });
    setNewAdminData({ name: "", id: "", title: "", purview: "whole", permissions: { manageStudents: false, manageStaff: false, generateReports: false, fullControl: false } });
  };

  const handleSaveAdminEdit = () => {
    if (!editingAdmin) return;
    setAdmins(prev => prev.map(a => a.id === editingAdmin.id ? editingAdmin : a));
    setEditingAdmin(null);
    toast({ title: "Authority Profile Updated" });
  };

  const PermissionCheckbox = ({ id, label, description, checked, onChange, icon: Icon }: any) => (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-xl border-2 transition-all",
      checked ? "border-primary bg-primary/5 shadow-sm" : "border-accent bg-white"
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
          <p className="text-muted-foreground mt-1">Monitor activity and manage sub-school administrative hierarchy.</p>
        </div>
      </div>

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="registry" className="gap-2 py-3 rounded-xl transition-all">Registry</TabsTrigger>
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">Sections</TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2 py-3 rounded-xl transition-all">Hierarchy</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="mt-0">
          <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-white border-b p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search user registry..." 
                  className="pl-10 h-12 bg-accent/20 border-none rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-accent/10">
                  <TableRow className="uppercase text-[10px] font-black tracking-widest border-b">
                    <TableHead className="pl-8 py-4">Matricule</TableHead>
                    <TableHead>User Profile</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right pr-8">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id} className="group hover:bg-accent/5">
                      <TableCell className="pl-8 font-mono text-xs font-bold text-primary">{u.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{u.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-sm text-primary">{u.name}</p>
                            <Badge variant="outline" className="text-[8px] h-4 uppercase">{u.role}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[9px] font-black uppercase px-3",
                          u.status === 'active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <Button variant="ghost" size="icon" onClick={() => setViewingUser(u)}><Eye className="w-4 h-4 text-primary" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="mt-0">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-primary">Administrative Hierarchy</h3>
              <Button className="gap-2 rounded-xl" onClick={() => setIsAppointingAdmin(true)}>
                <ShieldCheck className="w-4 h-4" /> Appoint Sub-Admin
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map(adm => (
                <Card key={adm.id} className="border-none shadow-xl bg-white overflow-hidden group">
                  <CardHeader className={cn(
                    "p-6 text-white text-center pb-8 relative",
                    adm.status === 'active' ? "bg-primary" : "bg-destructive/80"
                  )}>
                    <div className="absolute top-4 right-4">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"><MoreVertical className="w-4 h-4"/></Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl border-none shadow-2xl">
                           <DropdownMenuItem onClick={() => setEditingAdmin({...adm})}>
                             <Pencil className="w-4 h-4 mr-2" /> Edit Authority
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem 
                             className={cn(adm.status === 'active' ? "text-destructive" : "text-green-600")}
                             onClick={() => handleToggleAdminStatus(adm.id)}
                           >
                             {adm.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                             {adm.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
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
                      <p className="text-[10px] font-black uppercase text-muted-foreground">Purview</p>
                      <p className="text-sm font-bold text-primary">{adm.purview}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {adm.permissions.fullControl ? <Badge className="bg-primary text-white text-[8px]">FULL CONTROL</Badge> : <Badge variant="outline" className="text-[8px]">SUB-ADMIN</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* APPOINT/EDIT ADMIN DIALOG */}
      <Dialog open={isAppointingAdmin || !!editingAdmin} onOpenChange={(v) => { if(!v) { setIsAppointingAdmin(false); setEditingAdmin(null); } }}>
        <DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-white">
            <DialogTitle className="text-2xl font-black">{editingAdmin ? 'Edit Authority Profile' : 'Admin Appointment Suite'}</DialogTitle>
            <DialogDescription className="text-white/60">Define administrative roles and operational permissions.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              {!editingAdmin && (
                <div className="col-span-2 space-y-2">
                  <Label>Select Staff</Label>
                  <Select onValueChange={(v) => {
                    const s = INITIAL_USERS.find(item => item.id === v);
                    if(s) setNewAdminData({...newAdminData, id: s.id, name: s.name});
                  }}>
                    <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue placeholder="Search Staff..." /></SelectTrigger>
                    <SelectContent>{INITIAL_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={editingAdmin ? editingAdmin.role : newAdminData.title} 
                  onChange={(e) => editingAdmin ? setEditingAdmin({...editingAdmin, role: e.target.value}) : setNewAdminData({...newAdminData, title: e.target.value})} 
                  className="h-12 bg-accent/30 border-none rounded-xl" 
                />
              </div>
              <div className="space-y-2">
                <Label>Purview</Label>
                <Select 
                  value={editingAdmin ? editingAdmin.purview : newAdminData.purview} 
                  onValueChange={(v) => editingAdmin ? setEditingAdmin({...editingAdmin, purview: v}) : setNewAdminData({...newAdminData, purview: v})}
                >
                  <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Whole Institution">Whole Institution</SelectItem>
                    <SelectItem value="Anglophone Section">Anglophone Section</SelectItem>
                    <SelectItem value="Francophone Section">Francophone Section</SelectItem>
                    <SelectItem value="Technical Section">Technical Section</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase text-primary tracking-widest border-b pb-2">Authority Permissions</h3>
              <div className="grid grid-cols-2 gap-3">
                <PermissionCheckbox 
                  label="Manage Students" 
                  checked={editingAdmin ? editingAdmin.permissions.manageStudents : newAdminData.permissions.manageStudents} 
                  onChange={(v: boolean) => editingAdmin ? setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, manageStudents: v}}) : setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStudents: v}})}
                  icon={GraduationCap}
                />
                <PermissionCheckbox 
                  label="Full Admin" 
                  checked={editingAdmin ? editingAdmin.permissions.fullControl : newAdminData.permissions.fullControl} 
                  onChange={(v: boolean) => editingAdmin ? setEditingAdmin({...editingAdmin, permissions: {...editingAdmin.permissions, fullControl: v}}) : setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, fullControl: v}})}
                  icon={ShieldCheck}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
            <Button className="w-full h-12 rounded-xl shadow-lg font-bold" onClick={editingAdmin ? handleSaveAdminEdit : handleAppointAdmin}>
              {editingAdmin ? 'Update Profile' : 'Assign Authority'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
