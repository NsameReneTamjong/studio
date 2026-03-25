
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
  UserX,
  Loader2
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
  { id: "SEC-02", name: "Francophone Section", type: "General", head: "Mme. Celine Njoh", headRole: "Vice Principal", students: 620, staff: 24, color: "bg-emerald-500" },
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
];

const STAFF_MEMBERS = [
  { id: "GBHS26T001", name: "Dr. Aris Tesla", role: "TEACHER" },
  { id: "GBHS26B001", name: "Mme. Celine Njoh", role: "BURSAR" },
  { id: "GBHS26L001", name: "Mr. Ebong", role: "LIBRARIAN" },
];

export default function CommunityPage() {
  const { language } = useI18n();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [subSchools, setSubSchools] = useState(INITIAL_SUB_SCHOOLS);
  const [admins, setAdmins] = useState<SchoolAdmin[]>(INITIAL_ADMINS);
  
  const [isAddingSubSchool, setIsAddingSubSchool] = useState(false);
  const [isAppointingAdmin, setIsAppointingAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<SchoolAdmin | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [newSectionData, setNewSectionData] = useState({ name: "", type: "General" });
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    id: "",
    title: "",
    purview: "Whole Institution",
    permissions: {
      manageStudents: false,
      manageStaff: false,
      generateReports: false,
      fullControl: false
    }
  });

  const handleAddSection = () => {
    if (!newSectionData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created = {
        id: `SEC-${Math.floor(100 + Math.random() * 900)}`,
        name: newSectionData.name,
        type: newSectionData.type,
        head: "Unassigned",
        headRole: "Pending",
        students: 0,
        staff: 0,
        color: "bg-primary"
      };
      setSubSchools([...subSchools, created]);
      setIsProcessing(false);
      setIsAddingSubSchool(false);
      setNewSectionData({ name: "", type: "General" });
      toast({ title: "Section Created", description: `${created.name} added to school structure.` });
    }, 800);
  };

  const handleAppointAdmin = () => {
    if (!newAdminData.name) return;
    setIsProcessing(true);
    setTimeout(() => {
      const created: SchoolAdmin = {
        id: newAdminData.id || `ADM-${Math.floor(100 + Math.random() * 900)}`,
        name: newAdminData.name,
        role: newAdminData.title || "Sub-Admin",
        purview: newAdminData.purview,
        avatar: `https://picsum.photos/seed/${newAdminData.name}/100/100`,
        status: "active",
        permissions: newAdminData.permissions
      };
      setAdmins([...admins, created]);
      setIsProcessing(false);
      setIsAppointingAdmin(false);
      setNewAdminData({ name: "", id: "", title: "", purview: "Whole Institution", permissions: { manageStudents: false, manageStaff: false, generateReports: false, fullControl: false } });
      toast({ title: "Admin Appointed", description: `${created.name} is now authorized.` });
    }, 1000);
  };

  const PermissionCheckbox = ({ id, label, checked, onChange, icon: Icon }: any) => (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
      checked ? "border-primary bg-primary/5" : "border-accent bg-white"
    )} onClick={() => onChange(!checked)}>
      <Checkbox checked={checked} onCheckedChange={() => {}} className="pointer-events-none" />
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", checked ? "text-primary" : "text-muted-foreground")} />
        <span className="font-bold text-xs">{label}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <Network className="w-6 h-6 text-secondary" />
            </div>
            {language === 'en' ? "Institutional Hierarchy" : "Hiérarchie Institutionnelle"}
          </h1>
          <p className="text-muted-foreground mt-1">Manage sub-schools, sections, and administrative appointments.</p>
        </div>
      </div>

      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-[500px] mb-8 bg-white shadow-sm border h-auto p-1 rounded-2xl">
          <TabsTrigger value="structure" className="gap-2 py-3 rounded-xl transition-all">
            <Building className="w-4 h-4" /> Sections & Sub-Schools
          </TabsTrigger>
          <TabsTrigger value="hierarchy" className="gap-2 py-3 rounded-xl transition-all">
            <ShieldCheck className="w-4 h-4" /> Admin Appointments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Active Sections</h3>
            <Dialog open={isAddingSubSchool} onOpenChange={setIsAddingSubSchool}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg bg-secondary text-primary hover:bg-secondary/90 font-bold">
                  <Plus className="w-4 h-4" /> Create Section
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">New Institutional Section</DialogTitle>
                  <DialogDescription className="text-white/60">Define a specialized sub-school or wing.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label>Section Name</Label>
                    <Input value={newSectionData.name} onChange={(e) => setNewSectionData({...newSectionData, name: e.target.value})} placeholder="e.g. Technical Section" className="h-12 bg-accent/30 border-none rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={newSectionData.type} onValueChange={(v) => setNewSectionData({...newSectionData, type: v})}>
                      <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General Education</SelectItem>
                        <SelectItem value="Technical">Technical Education</SelectItem>
                        <SelectItem value="Teacher Training">Teacher Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAddSection} className="w-full h-12 rounded-xl shadow-lg font-bold" disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Section Creation"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subSchools.map(sec => (
              <Card key={sec.id} className="border-none shadow-sm group hover:shadow-md transition-all overflow-hidden bg-white">
                <div className={cn("h-1.5 w-full", sec.color)} />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] font-black uppercase border-primary/10 text-primary">{sec.type}</Badge>
                    <div className="p-2 bg-accent rounded-xl"><Building2 className="w-5 h-5 text-primary" /></div>
                  </div>
                  <CardTitle className="text-xl font-black text-primary mt-2">{sec.name}</CardTitle>
                  <CardDescription className="font-bold flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-secondary" /> Head: {sec.head}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-accent/30 p-3 rounded-xl text-center space-y-0.5">
                      <p className="text-[9px] font-black uppercase opacity-40">Students</p>
                      <p className="text-lg font-black text-primary">{sec.students}</p>
                    </div>
                    <div className="bg-accent/30 p-3 rounded-xl text-center space-y-0.5">
                      <p className="text-[9px] font-black uppercase opacity-40">Personnel</p>
                      <p className="text-lg font-black text-primary">{sec.staff}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 border-t bg-accent/10 p-4">
                  <Button variant="ghost" className="w-full justify-between hover:bg-white text-xs font-bold text-primary">
                    Section Configuration
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="hierarchy" className="animate-in fade-in slide-in-from-bottom-4 mt-0 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-primary uppercase tracking-tight">Administrative Team</h3>
            <Dialog open={isAppointingAdmin} onOpenChange={setIsAppointingAdmin}>
              <DialogTrigger asChild>
                <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg bg-primary text-white font-bold">
                  <ShieldCheck className="w-4 h-4" /> Appoint Sub-Admin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black">Appoint Sub-Administrator</DialogTitle>
                  <DialogDescription className="text-white/60">Authorize a staff member for specific administrative duties.</DialogDescription>
                </DialogHeader>
                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <Label>Select Professional</Label>
                      <Select onValueChange={(v) => {
                        const s = STAFF_MEMBERS.find(item => item.id === v);
                        if(s) setNewAdminData({...newAdminData, id: s.id, name: s.name});
                      }}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl font-bold"><SelectValue placeholder="Search Staff Registry..." /></SelectTrigger>
                        <SelectContent>{STAFF_MEMBERS.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.role})</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title / Position</Label>
                      <Input value={newAdminData.title} onChange={(e) => setNewAdminData({...newAdminData, title: e.target.value})} placeholder="e.g. Vice Principal" className="h-12 bg-accent/30 border-none rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Assigned Purview</Label>
                      <Select value={newAdminData.purview} onValueChange={(v) => setNewAdminData({...newAdminData, purview: v})}>
                        <SelectTrigger className="h-12 bg-accent/30 border-none rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Whole Institution">Whole Institution</SelectItem>
                          {subSchools.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest border-b pb-2">Operational Authority Toggle</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <PermissionCheckbox label="Manage Students" icon={GraduationCap} checked={newAdminData.permissions.manageStudents} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStudents: v}})} />
                      <PermissionCheckbox label="Manage Staff" icon={Users} checked={newAdminData.permissions.manageStaff} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, manageStaff: v}})} />
                      <PermissionCheckbox label="Generate Reports" icon={FileText} checked={newAdminData.permissions.generateReports} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, generateReports: v}})} />
                      <PermissionCheckbox label="Full Control" icon={ShieldAlert} checked={newAdminData.permissions.fullControl} onChange={(v: boolean) => setNewAdminData({...newAdminData, permissions: {...newAdminData.permissions, fullControl: v}})} />
                    </div>
                  </div>
                </div>
                <DialogFooter className="bg-accent/20 p-6 border-t border-accent">
                  <Button onClick={handleAppointAdmin} className="w-full h-14 rounded-2xl shadow-xl font-black uppercase tracking-widest text-xs gap-3" disabled={isProcessing || !newAdminData.name}>
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Confirm Appointment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map(adm => (
              <Card key={adm.id} className="border-none shadow-xl bg-white overflow-hidden group">
                <CardHeader className={cn(
                  "p-6 text-white text-center pb-8 relative",
                  adm.status === 'active' ? "bg-primary" : "bg-destructive/80"
                )}>
                  <Avatar className="h-20 w-20 border-4 border-white/20 mx-auto shadow-2xl mb-4">
                    <AvatarImage src={adm.avatar} />
                    <AvatarFallback>{adm.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-lg font-black">{adm.name}</CardTitle>
                  <Badge variant="secondary" className="bg-white/10 text-white border-none mt-2 uppercase text-[8px] tracking-widest">{adm.role}</Badge>
                </CardHeader>
                <CardContent className="p-6 -mt-4 bg-white rounded-t-3xl space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Strategic Purview</p>
                    <p className="text-sm font-bold text-primary">{adm.purview}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {adm.permissions.fullControl ? <Badge className="bg-primary text-white text-[8px] font-black">FULL CONTROL</Badge> : <Badge variant="outline" className="text-[8px] font-bold">SUB-ADMIN</Badge>}
                    {adm.permissions.manageStudents && <Badge variant="secondary" className="text-[8px] font-bold h-4">Students</Badge>}
                    {adm.permissions.manageStaff && <Badge variant="secondary" className="text-[8px] font-bold h-4">Staff</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="bg-accent/10 p-3 border-t flex justify-end gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-primary/40 hover:text-primary"><Pencil className="w-4 h-4"/></Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/40 hover:text-destructive"><UserX className="w-4 h-4"/></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
